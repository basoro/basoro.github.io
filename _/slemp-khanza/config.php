<?php
require './Common.php';

//Service management
function ServiceAdmin(){
	$name = I('name');
	$type = I('type');
	if($name == 'nginx'){
		SendSocket("ExecShell|nginx -t -c /www/server/nginx/conf/nginx.conf");
		$result = file_get_contents('/tmp/shell_temp.pl');
		if(!strpos($result,'successful')){
			WriteLogs("Environment setting", $exec."Execution failed: ".$result);
			returnJson(false,'Nginx configuration rule error: <br><a style="color:red;">'.str_replace("\n",'<br>',$result).'</a>');
		}
	}


	if($type == 'test') returnJson(true, 'Configuration detection pass!');
	$exec = "service $name $type";
	if($exec == 'service pure-ftpd reload') $exec = '/www/server/pure-ftpd/bin/pure-pw mkdb /www/server/pure-ftpd/etc/pureftpd.pdb';
	if($name == 'nginx' && $type == 'restart'){
		SendSocket("ExecShell|pkill -9 nginx");
		SendSocket("ExecShell|service nginx start");
	}else{
		$result = SendSocket("ExecShell|$exec");
		$tmp = trim(file_get_contents('/tmp/shell_temp.pl'));
		if(strpos($tmp,'nginx.pid')){
			SendSocket("ExecShell|pkill -9 nginx && sleep 1");
			SendSocket("ExecShell|service nginx start");
		}
	}


	WriteLogs("Environment setting", $exec."execution succeed!");
	ajax_return($result);
}

//Disable the specified PHP version
function StopPHPVersion(){
	$version = I('version');
	$panelVersion = substr(str_replace('.','',PHP_VERSION),0,2);
	if($version == $panelVersion) returnJson(false, 'The current PHP version is being used by the panel!');

	$filename = '/etc/init.d/php-fpm-'.$version;
	$filename_backup = '/etc/init.d/php-fpm-'.$version.'_backup';
	if(file_exists($filename)){
		SendSocket("ExecShell|service php-fpm-".$version." stop");
		SendSocket("FileAdmin|MvDirOrFile|" . $filename . '|'.$filename_backup);
	} else {
        SendSocket("ExecShell|service php".$version."-php-fpm stop");
    }
	returnJson(true, 'PHP-'.$version.' terminated!');
}

//Enable the specified PHP version
function StartPHPVersion(){
	$version = I('version');
	$filename = '/etc/init.d/php-fpm-'.$version;
	$filename_backup = '/etc/init.d/php-fpm-'.$version.'_backup';
	if(file_exists($filename_backup)){
		SendSocket("FileAdmin|MvDirOrFile|" . $filename_backup. '|'.$filename);
		SendSocket("FileAdmin|ChownFile|" . $filename . '|root');
		SendSocket("FileAdmin|ChmodFile|" . $filename . '|755');
	}

	if(file_exists($filename)){
		SendSocket("ExecShell|service php-fpm-".$version." start");
		returnJson(true, 'PHP-'.$version.' activated!');
	} else {
        SendSocket("ExecShell|service php".$version."-php-fpm start");
	}

	returnJson(false, $filename_backup.'file does not exist!');
}

function SetPanelSSL(){
	$file = $_SESSION['server_type'] == 'nginx' ? '/www/server/nginx/conf/nginx.conf':'';
	$conf = file_get_contents($file);
	$panel = GetPanelBinding();
	$panel['script_name'] = $_SERVER['SCRIPT_NAME'];
	if($panel['domain'] == 'basoro.id'){
		$tmp = explode(':', $_SERVER['HTTP_HOST']);
		$panel['domain'] = $tmp[0];
	}
	if($panel['port'] == '80') returnJson(false,'Panel port cannot be 80');
	if($panel['ssl']){
		if($_SESSION['server_type'] == 'nginx'){
			$rep = "/\s+ssl_certificate\s+.+;\s+ssl_certificate_key\s+.+;\n/";
			$conf = preg_replace($rep,'',$conf);
			$rep = "/listen\s+".$panel['port']."\s+ssl;/";
			$conf = preg_replace($rep,'listen '.$panel['port'].';',$conf);
			$rep = "/\s+error_page\s497.+;\n/";
			$conf = preg_replace($rep,'',$conf);
		}else{
			if(strpos($conf, 'combined')){
				$rep = "combined\nSSLEngine On\nSSLCertificateFile conf/key/default/key.csr\nSSLCertificateKeyFile conf/key/default/key.key";
				$conf = str_replace($rep,'combined',$conf);
			}else{
				$rep = "example.com\nSSLEngine On\nSSLCertificateFile conf/key/default/key.csr\nSSLCertificateKeyFile conf/key/default/key.key";
				$conf = str_replace($rep,'example.com',$conf);
			}

		}


		if (file_put_contents('/tmp/read.tmp', $conf)) {
			$result = SendSocket("FileAdmin|SaveFile|" . $file);
			if($result['status']) WriteLogs("Environment setting", "Open panel SSL successfully!");
			serviceWebReload();
			$panel['status'] = true;
			$panel['msg'] = 'SSL is turned off, please use http protocol to access the panel.!';
			$panel['type'] = 'http://';
			ajax_return($panel);
		}

		returnJson(false, 'operation failed!');
	}


	if($_SESSION['server_type'] == 'nginx'){
		$rep = "/listen\s+".$panel['port']."\s*;/";
		$conf = preg_replace($rep,'listen '.$panel['port'].' ssl;',$conf);
		$sslStr = "#error_page   404   /404.html;\n		ssl_certificate	key/default/key.csr;\n		ssl_certificate_key  key/default/key.key;\n		error_page 497  https://\$host:\$server_port\$uri;\n";
		$conf = str_replace('#error_page   404   /404.html;',$sslStr,$conf);
	}else{
		if(strpos($conf, 'combined')){
			$conf = str_replace('combined', "combined\nSSLEngine On\nSSLCertificateFile conf/key/default/key.csr\nSSLCertificateKeyFile conf/key/default/key.key", $conf);
		}else{
			$conf = str_replace('example.com', "example.com\nSSLEngine On\nSSLCertificateFile conf/key/default/key.csr\nSSLCertificateKeyFile conf/key/default/key.key", $conf);
		}

	}

	//Generate certificate
	$dn = array(
   	 	"countryName" 			=> 'ID',
   	 	"stateOrProvinceName"	=> 'Kalimantan Selatan',
   	 	"localityName" 			=> 'Barabai',
  	 	"organizationName" 		=>	'basoro.id',
    	"organizationalUnitName" => 'Basoro',
    	"commonName" 			=> $panel['domain'],
    	"emailAddress" 			=> 'dentix.id@gmail.com'
 	);
	$numberofdays = 3650;     				//Effective duration
	$path =   "/www/server/".$_SESSION['server_type']."/conf/key/default";
	if(!file_exists($path)){
		SendSocket("FileAdmin|AddDir|" . $path);
	}
	$csrpath = $path."/key.csr";				//Generate a certification path
	$keypath = $path."/key.key"; 				//Key file path
	if(!file_exists($csrpath)){
		$privkey = openssl_pkey_new();
		$csr = openssl_csr_new($dn, $privkey);
		$sscert = openssl_csr_sign($csr, null, $privkey, $numberofdays);
		openssl_x509_export($sscert, $csrkey);
		openssl_pkey_export($privkey, $privatekey);
		file_put_contents('/tmp/read.tmp', $privatekey);
		SendSocket("FileAdmin|SaveFile|" . $keypath);
		file_put_contents('/tmp/read.tmp', $csrkey);
		SendSocket("FileAdmin|SaveFile|" . $csrpath);
	}
	if (file_put_contents('/tmp/read.tmp', $conf)) {
		$result = SendSocket("FileAdmin|SaveFile|" . $file);
		if($result['status']) WriteLogs("Environment setting", "Open panel SSL successfully!");
		serviceWebReload();
		$panel['status'] = true;
		$panel['msg'] = 'SSL is enabled, please use the SSL protocol to access the panel.!';
		$panel['type'] = 'https://';
		ajax_return($panel);
	}
	returnJson(false, 'operation failed!');
}

//Set panel port and domain name
function SetPanelBinding(){
	$port 	= I('port','','intval');
	$domain = I('domain');
	if(intval($port) > 9999 || intval($port) < 888) returnJson(false, 'The port range is invalid.(888 - 8888)!');
	$panel = GetPanelBinding();
	$file = $_SESSION['server_type'] == 'nginx' ? '/www/server/nginx/conf/nginx.conf':'';
	$conf = file_get_contents($file);
	if($port != $panel['port']){
		$conf = str_replace($panel['port'],$port,$conf);
		//Add a firewall
		SendSocket("Firewall|AddFireWallPort|".$port."|TCP|webPanel");
		//Modify the firewall list
		M('firewall')->where("port='".$panel['port']."'")->setField('port',$port);
	}

	if($domain != $panel['domain'] && strlen($domain) > 3){
		$conf = str_replace($panel['domain'],$domain,$conf);
		$_SESSION['bindingDomain'] = $domain;
	}

	if (file_put_contents('/tmp/read.tmp', $conf)) {
		$result = SendSocket("FileAdmin|SaveFile|" . $file);
		if($result['status']) WriteLogs("Environment setting", "Change the panel port to [$port], Binding domain name [$domain]!");
		return true;
	}
	return false;
}

//Set whether to enable access restrictions
function SetPanelLimit(){
	$limit = file_get_contents('./conf/limit.conf');
	if($limit == 'true'){
		file_put_contents('./conf/limit.conf','false');
	}else{
		file_put_contents('./conf/limit.conf','true');
	}
	returnJson(true, 'Successful operation!');
}

//Save configuration
function SaveConfig(){
	$result['status']  = false;
	$result['status'] = SetPanelBinding();

	$data = array(
		'sites_path'	=>	I('sites_path'),
		'backup_path'	=>	I('backup_path')
	);

	if(M('config')->where("id=1")->save($data)){
		$_SESSION['config']['sites_path'] = $data['sites_path'];
		$_SESSION['config']['backup_path'] = $data['backup_path'];
		SendSocket("FileAdmin|AddDir|".$data['sites_path']);
		SendSocket("FileAdmin|AddDir|".$data['backup_path'].'/database');
		SendSocket("FileAdmin|AddDir|".$data['backup_path'].'/site');
		$result['status'] = true;
	}

	if($_POST['ip'] != $_SESSION['iplist']){
		file_put_contents("./conf/iplist.conf",$_POST['ip']);
		$_SESSION['iplist'] = $_POST['ip'];
		$result['status'] = true;
		WriteLogs("Environment setting", "Update server IP to [".$_POST['ip']."]!");
	}

	if(isset($_POST['panel_name'])){
		file_put_contents('./conf/panelName.conf', $_POST['panel_name']);
		$result['status'] = true;
		$_SESSION['panel_name'] = $_POST['panel_name'];
	}

	$result['msg'] = $result['status']?'Configuration saved' : 'Did not make any changes';
	if($result['status']){
		$panel = GetPanelBinding();
		$result['port'] = I('port');
		$result['domain'] = I('domain');
		$result['script_name'] = $_SERVER['SCRIPT_NAME'];
		$result['type'] = $panel['ssl']?'https://':'http://';
		if($result['domain'] == 'basoro.id') $result['domain'] = $_SESSION['serverip'];
	}

	ajax_return($result);
}

//Set path Info support
function SetPathInfo(){
	$version = I('version');
	$type = I('type');

	if($_SESSION['server_type'] == 'nginx'){
		$path = '/www/server/nginx/conf/enable-php-'.$version.'.conf';
		$conf = file_get_contents($path);
		$rep = "/\s+#*include\s+pathinfo.conf;/";
		if($type == 'on'){
			$conf = preg_replace($rep,"\n\t\t\tinclude pathinfo.conf;",$conf);
		}else{
			$conf = preg_replace($rep,"\n\t\t\t#include pathinfo.conf;",$conf);
		}
		file_put_contents('/tmp/read.tmp',$conf);
		SendSocket("FileAdmin|SaveFile|" . $path);
	}
	$path = '/www/server/php/'.$version.'/etc/php.ini';
	$conf = file_get_contents($path);
	$rep = "/\n;*\s*cgi\.fix_pathinfo\s*=\s*([0-9]+)\s*\n/";
	$status = $type == 'on' ? '1':'0';
	$conf = preg_replace($rep, "\ncgi.fix_pathinfo = $status\n", $conf);
	file_put_contents('/tmp/read.tmp',$conf);
	SendSocket("FileAdmin|SaveFile|" . $path);
	if($result['status']) WriteLogs("Environment setting", "Setting up PHP-${version} The PATH_INFO module is [{$type}]!");
	SendSocket("ExecShell|service php-fpm-$version reload");
	returnJson(true,'Successful setup!');
}

//Set PHP file upload size limit
function SetPHPMaxSize(){
	$version = $_GET['version'];
	$max = intval($_GET['max']);

	//Setting up PHP
	$path = '/www/server/php/'.$version.'/etc/php.ini';
	$conf = file_get_contents($path);
	$rep = "/^upload_max_filesize\s*=\s*[0-9]+M/m";
	$conf = preg_replace($rep,'upload_max_filesize = '.$max.'M',$conf);
	$rep = "/^post_max_size\s*=\s*[0-9]+M/m";
	$conf = preg_replace($rep,'post_max_size = '.$max.'M',$conf);
	if(file_put_contents('/tmp/read.tmp',$conf)){
		$result = SendSocket("FileAdmin|SaveFile|" . $path);
	}

	if($_SESSION['server_type'] == 'nginx'){
		//Set up Nginx
		$path = '/www/server/nginx/conf/nginx.conf';
		$conf = file_get_contents($path);
		$rep = "/client_max_body_size\s+([0-9]+)m/m";
		preg_match($rep,$conf,$tmp);
		if(intval($tmp[1]) < intval($max)){
			$conf = preg_replace($rep,'client_max_body_size '.$max.'m',$conf);
			if(file_put_contents('/tmp/read.tmp',$conf)){
				$result = SendSocket("FileAdmin|SaveFile|" . $path);
			}
		}
	}
	serviceWebReload();
	SendSocket("ExecShell|service php-fpm-$version reload");
	if($result['status']) WriteLogs("Environment setting", "Set the maximum upload size of PHP to [{$max}MB]!");
	returnJson(true,'Successful setup!');
}

//Set PHP timeout
function SetPHPMaxTime(){
	$time = I('time','','intval');
	$version = I('version','','intval');
	if($time < 30 || $time > 86400*30) returnJson(false,'Please fill in 30-86400*30 values!');
	$file = '/www/server/php/'.$version.'/etc/php-fpm.conf';
	$conf = file_get_contents($file);
	$rep = "/request_terminate_timeout\s*=\s*([0-9]+)\n/";
	$conf = preg_replace($rep,"request_terminate_timeout = ".$time."\n",$conf);
	if(file_put_contents('/tmp/read.tmp',$conf)){
		$result = SendSocket("FileAdmin|SaveFile|" . $file);
	}

	if($_SESSION['server_type'] == 'nginx'){
		//Set up Nginx
		$path = '/www/server/nginx/conf/nginx.conf';
		$conf = file_get_contents($path);
		$rep = "/fastcgi_connect_timeout\s+([0-9]+);/";
		preg_match($rep, $conf,$tmp);
		if(intval($tmp[1]) < $time){
			$conf = preg_replace($rep,'fastcgi_connect_timeout '.$time.';',$conf);
			$rep = "/fastcgi_send_timeout\s+([0-9]+);/";
			$conf = preg_replace($rep,'fastcgi_send_timeout '.$time.';',$conf);
			$rep = "/fastcgi_read_timeout\s+([0-9]+);/";
			$conf = preg_replace($rep,'fastcgi_read_timeout '.$time.';',$conf);

			if(file_put_contents('/tmp/read.tmp',$conf)){
				$result = SendSocket("FileAdmin|SaveFile|" . $path);
			}
		}
	}
	if($result['status']) WriteLogs("Environment setting", "Set PHP maximum script timeout to [{$time} second]!");
	serviceWebReload();
	SendSocket("ExecShell|service php-fpm-$version reload");
	returnJson(true, 'Successfully saved!');
}

//Set anti-malware resolution
function SetDefaultSite(){
	if($_SESSION['server_type'] != 'nginx') return;
	$file = '/www/server/nginx/conf/vhost/default.conf';
	if(file_exists($file)) {
		SendSocket("FileAdmin|DelFile|".$file);
	}else{
		$conf=<<<EOT
server {
	listen 80 default_server;
	server_name _;
	root /usr/share/nginx/html;
}
EOT;

		if (file_put_contents('/tmp/read.tmp', $conf)) {
			SendSocket("FileAdmin|SaveFile|".$file);
		}
	}
	serviceWebReload();
	returnJson(true, 'Successful setup!');
}

//Take FPM settings
function GetFpmConfig(){
	$version = I('version');
	$file = "/www/server/php/$version/etc/php-fpm.conf";
	$conf = file_get_contents($file);
	$rep = "/\s*pm.max_children\s*=\s*([0-9]+)\s*/";
	preg_match($rep, $conf,$tmp);
	$data['max_children'] = $tmp[1];

	$rep = "/\s*pm.start_servers\s*=\s*([0-9]+)\s*/";
	preg_match($rep, $conf,$tmp);
	$data['start_servers'] = $tmp[1];

	$rep = "/\s*pm.min_spare_servers\s*=\s*([0-9]+)\s*/";
	preg_match($rep, $conf,$tmp);
	$data['min_spare_servers'] = $tmp[1];

	$rep = "/\s*pm.max_spare_servers \s*=\s*([0-9]+)\s*/";
	preg_match($rep, $conf,$tmp);
	$data['max_spare_servers'] = $tmp[1];

	ajax_return($data);
}

//Setting
function SetFpmConfig(){
	$version = I('version');
	$max_children = I('max_children');
	$start_servers = I('start_servers');
	$min_spare_servers = I('min_spare_servers');
	$max_spare_servers = I('max_spare_servers');

	$file = "/www/server/php/$version/etc/php-fpm.conf";
	$conf = file_get_contents($file);

	$rep = "/\s*pm.max_children\s*=\s*([0-9]+)\s*/";
	$conf = preg_replace($rep, "\npm.max_children = ".$max_children, $conf);

	$rep = "/\s*pm.start_servers\s*=\s*([0-9]+)\s*/";
	$conf = preg_replace($rep, "\npm.start_servers = ".$start_servers, $conf);

	$rep = "/\s*pm.min_spare_servers\s*=\s*([0-9]+)\s*/";
	$conf = preg_replace($rep, "\npm.min_spare_servers = ".$min_spare_servers, $conf);

	$rep = "/\s*pm.max_spare_servers \s*=\s*([0-9]+)\s*/";
	$conf = preg_replace($rep, "\npm.max_spare_servers = ".$max_spare_servers."\n", $conf);
	if(file_put_contents('/tmp/read.tmp',$conf)){
		$result = SendSocket("FileAdmin|SaveFile|" . $file);
	}
	SendSocket("ExecShell|service php-fpm-$version reload");
	returnJson(true, 'Successful setup');
}

//Automatic update
function SetPanelAutoUpload(){
	$limit = file_get_contents('./conf/upload.conf');
	if($limit == 'true'){
		file_put_contents('./conf/upload.conf','false');
	}else{
		file_put_contents('./conf/upload.conf','true');
	}
	returnJson(true, 'Successful operation!');
}

function ClosePanel(){
	$filename = '/www/server/panel/conf/close.pl';
	$result = file_put_contents($filename, 'True');
	if($result){
		SendSocket("chmod 644 ".$filename);
		SendSocket("chown root.root ".$filename);
		returnJson(true, 'SLEMP Panel is closed!');
	}
	returnJson(true, 'Closing failure!');
}


//Get MySQL memory configuration
function GetMySQLMemConf(){
	$conf = file_get_contents('/etc/my.cnf');

	$data = array();

	$caches = array(
					array(
						'name'	=> 'table_open_cache',
						'ps'	=> "table_cache specifies the size of the table cache. Whenever MySQL accesses a table, if there is space in the table buffer, the table is opened and placed in it, which allows faster access to the table contents. By checking the state values ​​Open_tables and Opened_tables of the peak time, you can decide whether you need to increase the value of table_cache. If you find that open_tables is equal to table_cache and opened_tables is growing, then you need to increase the value of table_cache.",
						'value'	=> '',
						),
					array(
						'name'	=> 'query_cache_size',
						'ps'	=> "It is mainly used to cache the ResultSet in MySQL, which is the result set of a SQL statement execution, so it can only be used for the select statement. When we open the Query Cache function, MySQL accepts a request for a select statement, if the statement satisfies the requirements of the Query Cache (not explicitly stated that Query Cache is not allowed, or has explicitly stated that Query Cache is required), MySQL The selected select statement will be hashed as a string according to the preset HASH algorithm, and then directly to the Query Cache to find whether it has been cached. In other words, if it is already in the cache, the select request will directly return the data, thus omitting all subsequent steps (such as parsing of SQL statements, optimizer optimization, and requesting data from the storage engine), greatly improving performance. According to the MySQL user manual, using query buffers can achieve up to 238% efficiency.
Of course, Query Cache also has a fatal flaw, that is, any changes to the data of a table will cause all the select statements that reference the table to invalidate the cached data in the Query Cache. So, when our data changes very frequently, using Query Cache may not pay off.",
						'value'	=> '',
						),
					array(
						'name'	=> 'sort_buffer_size',
						'ps'	=> "sort_buffer_size is the buffer size used by MySql to perform sorting. If you want to increase the speed of ORDER BY, first look at whether you can let MySQL use the index instead of the extra sorting stage. If not, try increasing the size of the sort_buffer_size variable.",
						'value'	=> '',
						),
					array(
						'name'	=> 'thread_concurrency',
						'ps'	=> "The correct value of thread_concurrency has a great impact on the performance of mysql. In the case of multiple cpu (or multi-core), the value of thread_concurrency is set incorrectly, which will cause mysql to make full use of multiple cpu (or multi-core). Only one cpu (or core) can work at a time.
Thread_concurrency should be set to twice the number of CPU cores. For example, if there is a dual-core CPU, the thread_concurrency should be 4; 2 dual-core cpu, the value of thread_concurrency should be 8.",
						'value'	=> '',
						),
					array(
						'name'	=> 'tmp_table_size',
						'ps'	=> "tmp_table_size is the heap size of MySql's heap. All unions are done within a single DML instruction, and most unions can even be done without a temporary table. Most temporary tables are based on
Saved (HEAP) table. Temporary tables with large record lengths (sum of lengths of all columns) or tables containing BLOB columns are stored on the hard disk. If an internal heap (population) table size exceeds tmp_table_size, MySQL can
Move the heap table in memory to the hard disk based MyISAM table. You can also increase the size of the temporary table by setting the tmp_table_size option. In other words, if you increase the value, MySql will increase the size of the heap table, which can be improved.
The effect of joining the query speed.",
						'value'	=> '',
						),
					array(
						'name'	=> 'key_buffer_size',
						'ps'	=> "key_buffer_size is the buffer size used to index the block, increasing its index for better processing (for all reads and multiple rewrites), one parameter that has the greatest impact on MyISAM table performance. If you make it too big, the system will start to change pages and it will really slow down. Strictly speaking, it determines the speed of database index processing, especially the speed of index reading. For servers with 4GB or so memory, this parameter can be set to 256M or 384M.",
						'value'	=> '',
						),
					array(
						'name'	=> 'read_buffer_size',
						'ps'	=> "read_buffer_size is the size of the MySql read buffer. A request to sequentially scan a table will allocate a read buffer, and MySql will allocate a memory buffer for it. The read_buffer_size variable controls this
The size of the buffer. If the sequential scan request for the table is very frequent and you think that the frequent scan is going too slowly, you can increase its performance by increasing the value of the variable and the size of the memory buffer.",
						'value'	=> '',
						),
					array(
						'name'	=> 'read_rnd_buffer_size',
						'ps'	=> "read_rnd_buffer_size is the random read buffer size of MySql. When rows are read in any order (for example, in sort order), a random read buffer is allocated. When sorting queries, MySql will first scan the buffer to avoid disk search and improve the query speed. If you need to sort a large amount of data, you can increase the value appropriately. However, MySql will issue this buffer space for each client connection, so you should set this value as much as possible to avoid excessive memory overhead.",
						'value'	=> '',
						),
					array(
						'name'	=> 'innodb_buffer_pool_size',
						'ps'	=> "innodb_buffer_pool_size: A parameter that has the greatest impact on InnoDB table performance. The function is the same as Key_buffer_size. The memory occupied by InnoDB, in addition to innodb_buffer_pool_size is used to store page cache data, in addition to the normal case there is about 8% of the overhead, mainly used in the description of each cache page frame, adaptive hash and other data structures, if not safely closed, start If you want to recover, you need to open another 12% of the memory for recovery. The addition of the two has almost 21% overhead. Assumption: 12G innodb_buffer_pool_size, at most, InnoDB may occupy 14.5G of memory. If the system only has 16G and only runs MySQL, and MySQL only uses InnoDB,
So open 12G for MySQL, is to maximize the use of memory.
In addition, unlike InnoDB and MyISAM storage engines, MyISAM's key_buffer_size can only cache index keys, while innodb_buffer_pool_size can cache data blocks and index keys. Appropriately increasing the size of this parameter can effectively reduce the disk I/O of InnoDB-type tables.
When we operate an InnoDB table, all the data returned or any index block used in the data process will go in this memory area.",
						'value'	=> '',
						),
					array(
					'name'	=> 'innodb_log_buffer_size',
					'ps'	=> "innodb_log_buffer_size: This is the buffer used by the transaction log of the InnoDB storage engine. Similar to Binlog Buffer, when InnoDB writes the transaction log, in order to improve performance, the information is first written into the Innofb Log Buffer. After the corresponding condition set by the innodb_flush_log_trx_commit parameter is satisfied (or the log buffer is full), The log is written to a file (or synced to disk). The maximum memory space that can be used can be set by the innodb_log_buffer_size parameter.
   The buffer size before InnoDB writes the log to the log disk file. The ideal value is 1M to 8M. The large log buffer allows the transaction to run without saving the log to disk and only committing the transaction. Therefore, if there is a large transaction, setting a large log buffer can reduce disk I/O. Set in digital format in my.cnf.
The default is 8MB, and the system can be increased to 4MB to 8MB as frequently. Of course, as mentioned above, this parameter is actually related to another flush parameter. Generally not recommended more than 32MB",
					'value'	=> '',
					),
					array(
					'name'	=> 'innodb_log_file_size',
					'ps'	=> "This parameter determines the size of the data log file, in M, with larger settings to improve performance but also increases the time required to recover a failed database",
					'value'	=> '',
					),
					array(
					'name'	=> 'innodb_additional_mem_pool_size',
					'ps'	=> "innodb_additional_mem_pool_size sets the size of the memory space used by the InnoDB storage engine to store data dictionary information and some internal data structures, so when we have a lot of database objects in a MySQL Instance, we need to adjust the size of this parameter to ensure that all data is Can be stored in memory to improve access efficiency.
Whether the size of this parameter is sufficient is still relatively easy to know, because when it is too small, MySQL will record the Warning information to the error log of the database. At this time, you know that you should adjust the size of this parameter. According to the MySQL manual, for machines with 2G memory, the recommended value is 20M, 100M for 32G memory.",
					'value'	=> '',
					)
				);
	for($i=0;$i<count($caches);$i++){
		$rep = "/".$caches[$i]['name']."\s*=\s*([0-9kKmM]+)/";
		preg_match($rep, $conf,$tmp);
		if(!$tmp[1]) continue;
		$caches[$i]['value'] = $tmp[1];
	}

	ajax_return($caches);
}

//Interface action
$_SESSION['crontab']['status'] = null;
if(isset($_GET['action'])){
	$_GET['action']();
	exit;
}


$ConfigInfo = GetConfigInfo();
$Panel = GetPanelBinding();

//Includes head and menu
require './public/head.html';
require './public/menu.html';
require './public/config.html';
require './public/footer.html';
?>
