<?php

include_once './Common.php';

function oneKeyAdd(){
	$data = json_decode(stripcslashes($_POST['webname']),true);
	if(!$data) ajax_return(array('status'=>false,'code'=>500,'msg'=>'The form is illegal, please re-fill'));
	if(checkMainPath($_POST['path'])) ajax_return(array('status'=>false,'code'=>501,'msg'=>'Cannot use system key directory as site directory'));

	$MainDomain = explode(":",$data['domain']);
	$reg = "/^([\w\-\*]{1,100}\.){1,4}(\w{1,10}|\w{1,10}\.\w{1,10})$/";
	if(!preg_match($reg, trim($MainDomain[0]))) ajax_return(array('status'=>false,'code'=>501,'msg'=>'The primary domain name is not in the correct format'));
	$_POST['webname'] =  $MainDomain[0];
	$_POST['port'] = empty($_POST['port'])?'80':$_POST['port'];
	$result = AddSite(true);
	if($result['status']){
		foreach($data['domainlist'] as $value){
			$tmp = explode(':',$value);
			$_POST['port'] = isset($tmp[1])? $tmp[1]:'80';
			$_POST['new_domain'] = $tmp[0];
			if($tmp[0] == $_POST['webname'] || strlen($tmp[0]) < 2){
				continue;
			}
			AddDomain(true);
		}
	}
	ajax_return($result);
}

function oneKeyAddDomain(){
	$domain = @explode(',',I('domain'));
	$i = 0;
	$reg = "/^([\w\-\*]{1,100}\.){1,4}(\w{2,10}|\w{2,10}\.\w{2,10})$/";
	foreach($domain as $value){
		$tmp = explode(':',$value);
		$_POST['port'] = isset($tmp[1])? $tmp[1]:'80';
		$_POST['new_domain'] = $tmp[0];

		if(!preg_match($reg, $tmp[0])){
			continue;
		}

		if(AddDomain(true)){
			$i++;
		}
	}
	ajax_return($i);
}

function SetSSL(){
	$type = I('type');
	$siteName = I('siteName');
	$dn = array(
   	 	"countryName" 			=> 'ID',
   	 	"stateOrProvinceName"	=> 'Kalimantan Selatan',
   	 	"localityName" 			=> 'Barabai',
  	 	"organizationName" 		=>	'Basoro.ID',
    	"organizationalUnitName" => 'SLEMP Panel',
    	"commonName" 			=> I('domain'),
    	"emailAddress" 			=> 'dentix.id@gmail.com'
 	);
	$numberofdays = 3650;
	$path =   "/www/server/".$_SESSION['server_type']."/conf/key/{$siteName}";
	if(!file_exists($path)){
		SendSocket("FileAdmin|AddDir|" . $path);
	}
	$csrpath = $path."/key.csr";
	$keypath = $path."/key.key";

	if($type == 1){
		if(strpos($_POST['key'],'CERTIFICATE')) returnJson(false, 'The key is wrong, please check!');
		if(strpos($_POST['csr'],'KEY')) returnJson(false, 'Certificate error, please check!');
		SendSocket('ExecShell|\\cp -a '.$keypath.' /tmp/backup1.conf');
		file_put_contents('/tmp/read.tmp', str_replace('(Bt.cn)','+',$_POST['key']));
		SendSocket("FileAdmin|SaveFile|" . $keypath);

		SendSocket('ExecShell|\\cp -a '.$csrpath.' /tmp/backup2.conf');
		file_put_contents('/tmp/read.tmp', str_replace('(Bt.cn)','+',$_POST['csr']));
		SendSocket("FileAdmin|SaveFile|" . $csrpath);

		if($_SESSION['server_type'] == 'nginx'){
			$isError = checkNginxConf();
		}

		if($isError !== true){
			SendSocket('ExecShell|\\cp -a /tmp/backup1.conf '.$keypath);
			SendSocket('ExecShell|\\cp -a /tmp/backup2.conf '.$csrpath);
			SendSocket("FileAdmin|ChmodFile|" . $keypath . '|root');
			SendSocket("FileAdmin|ChmodFile|" . $csrpath . '|root');
			returnJson(false,'Certificate error: <br><a style="color:red;">'.str_replace("\n",'<br>',$isError).'</a>');
		}

		serviceWebReload();
		returnJson(true,'The certificate has been saved!');
	}

	$privkey = openssl_pkey_new();
	$csr = openssl_csr_new($dn, $privkey);
	$sscert = openssl_csr_sign($csr, null, $privkey, $numberofdays);
	openssl_x509_export($sscert, $csrkey);
	openssl_pkey_export($privkey, $privatekey);

	file_put_contents('/tmp/read.tmp', $privatekey);
	SendSocket("FileAdmin|SaveFile|" . $keypath);
	file_put_contents('/tmp/read.tmp', $csrkey);
	SendSocket("FileAdmin|SaveFile|" . $csrpath);
	$data = array('status'=>true,'msg'=>'Certificate has been generated!','key'=>$privatekey,'csr'=>$csrkey);
	serviceWebReload();
	ajax_return($data);
}

function SetSSLConf(){
	$siteName = I('siteName');
	$file = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$siteName.'.conf';
	$conf = file_get_contents($file);
	if($_SESSION['server_type'] == 'nginx'){
		$nginxVersion = trim(@file_get_contents('/www/server/nginx/version.pl'));
		$onSSL = ($nginxVersion == '1.8.1' || $nginxVersion == '-Tengine2.1.2' || $nginxVersion == '-Tengine2.2.0') ? '':"";
		$sslStr = "#error_page 404/404.html;{$onSSL}\n		ssl_certificate      	key/$siteName/key.csr;\n		ssl_certificate_key  key/$siteName/key.key;\n	if (\$server_port !~ 443){\n			rewrite ^/.*\$ https://\$host\$uri;\n		}\n		error_page 497  https://\$host\$uri;\n";
		if(strpos($conf,'ssl_certificate')){
			returnJson(true,'SSL is successfully turned on!');
		}

		$conf = str_replace('#error_page 404/404.html;',$sslStr,$conf);
		$rep = "/listen\s+([0-9]+).*;/";
		preg_match_all($rep,$conf,$tmp);
		if(!in_array('443',$tmp[1])){
			$ssl = ($nginxVersion == '1.8.1' || $nginxVersion == '-Tengine2.1.2' || $nginxVersion == '-Tengine2.2.0') ? "\n		listen 443 ssl;":"\n		listen 443 ssl;";
			$conf = str_replace($tmp[0][0],$tmp[0][0].$ssl,$conf);
		}
	}

	if (file_put_contents('/tmp/read.tmp', $conf)) {
		SendSocket('ExecShell|\\cp -a '.$file.' /tmp/backup.conf');
		SendSocket("FileAdmin|SaveFile|" . $file);
		if($_SESSION['server_type'] == 'nginx'){
			$isError = checkNginxConf();
		}

		if($isError !== true){
			SendSocket('ExecShell|\\cp -a /tmp/backup.conf '.$file);
			SendSocket("FileAdmin|ChmodFile|" . $file . '|root');
			returnJson(false,'Configuration file error: <br><a style="color:red;">'.str_replace("\n",'<br>',$isError).'</a>');
		}

		$sql = M('firewall');
		if(!$sql->where("port='443'")->getCount()){
			SendSocket("Firewall|AddFireWallPort|443|TCP|".$ps);
			$data = array('port'=>'443','ps'=>'https','addtime'=>date('Y-m-d H:i:s'));
			$sql->add($data);
		}
		WriteLogs('Website management', 'website ['.$siteName.'] Enable SSL successfully!');
		returnJson(true,'SSL is successfully turned on!');
	}
	returnJson(false,'SSL open failed!');

}

function CloseSSLConf(){
	$siteName = I('siteName');
	$file = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$siteName.'.conf';
	$conf = file_get_contents($file);
	if($_SESSION['server_type'] == 'nginx'){
		$rep = "/\s+ssl_certificate\s+.+;\s+ssl_certificate_key\s+.+;/";
		$conf = preg_replace($rep,'',$conf);
		$rep = "/\s+ssl\s+on;/";
		$conf = preg_replace($rep,'',$conf);
		$rep = "/\s+error_page\s497.+;/";
		$conf = preg_replace($rep,'',$conf);
		$rep = "/\s+if.+server_port.+\n.+\n\s+}\s/";
		$conf = preg_replace($rep,'',$conf);
		$rep = "/\s+listen\s+443.*;/";
		$conf = preg_replace($rep,'',$conf);
	}else{
		$rep = "/\n<VirtualHost \*\:443>(.|\n)*<\/VirtualHost>/";
		$conf = preg_replace($rep,'',$conf);
	}

	if (file_put_contents('/tmp/read.tmp', $conf)) {
        $result = SendSocket("FileAdmin|SaveFile|" . $file);
        WriteLogs('Website management', 'website ['.$siteName.'] turn off SSL successfully!');
        returnJson(true,'SSL is off!');
    }
    returnJson(false,'Closing failure!');
}

function GetSSL(){
	$siteName = I('siteName');
	$path =   "/www/server/".$_SESSION['server_type']."/conf/key/{$siteName}";
	$csrpath = $path."/key.csr";
	$keypath = $path."/key.key";
	$key = @file_get_contents($keypath);
	$csr = @file_get_contents($csrpath);
	$file = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$siteName.'.conf';
    $conf = file_get_contents($file);
	$keyText = $_SESSION['server_type'] == 'nginx' ?'ssl_certificate':'SSLCertificateFile';
	$status = (strpos($conf,$keyText) > 0)?true:false;
	$domains = M('sites')->where("name='$siteName'")->getField('domain');
	ajax_return(array('status'=>$status,'domain'=>$domains,'key'=>$key,'csr'=>$csr));
}

function SiteStart(){
	$Path = '/www/server/'.$_SESSION['server_type'].'/stop';
	$Path2= '/www/nginx/stop';
	$Path3= '/www/wwwroot/stop';
	$file = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$_GET['name'].'.conf';
	$conf = file_get_contents($file);
	$id = I('id');
	$sitePath = M('sites')->where("id='$id'")->getField('path');

	$conf = str_replace($Path, $sitePath, $conf);
	$conf = str_replace($Path1, $sitePath, $conf);
	$conf = str_replace($Path2, $sitePath, $conf);
	if (file_put_contents('/tmp/read.tmp', $conf)) {
		$data = SendSocket("FileAdmin|SaveFile|" . $file);
	}

	if($data['status']){

		M('sites')->where("id='$id'")->setField('status','running');
		serviceWebReload();
	}
	returnSocket($data);
}

function SiteStop(){
	$path = '/www/server/'.$_SESSION['server_type'].'/stop';
	if(!file_exists($path)){
		SendSocket("FileAdmin|AddDir|" . $path);
		$html = file_get_contents('https://basoro.id/downloads/stop.html');
		file_put_contents($path.'/index.html', $html);
	}
	$file = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$_GET['name'].'.conf';
	$conf = file_get_contents($file);
	$id = I('id');
	$sitePath = M('sites')->where("id='$id'")->getField('path');
	$conf = str_replace($sitePath,$path, $conf);
	if (file_put_contents('/tmp/read.tmp', $conf)){
		$result = SendSocket("FileAdmin|SaveFile|".$file);
	}
	if($result['status']){
		M('sites')->where("id='$id'")->setField('status','stopped');
		serviceWebReload();
	}
	returnSocket($result);
}

function AddSite($own = false){
	$webname 	= str_replace(' ','',I('post.webname'));
	$webdir 	= GetPathStr(str_replace(' ','',I('post.path')));
	$port 		= str_replace(' ','',I('post.port'));
	$domain 	= str_replace(' ','',I('post.domain'));
	$version 	= str_replace(' ','',I('post.version'));

	if(strlen($version) < 2) returnJson(false,'PHP version number cannot be empty!');

	if(!isset($webname)) returnJson(false,'The parameter is incorrect!');
	if($domain == '')	$domain = $webname;

	$SQL = M('sites');

	if($SQL->where("name='$webname'")->getCount()){
		returnJson(false,'The site you added already exists!');
	}
	if($_SESSION['server_type'] == 'nginx'){
		$conf=<<<EOT
server
	{
		listen {$port};
		server_name {$domain};
		index index.php index.html index.htm default.php default.htm default.html;
		root {$webdir};
		#error_page 404/404.html;
		error_page 404 /404.html;
		error_page 502 /502.html;

		include enable-php-{$version}.conf;
		include rewrite/{$webname}.conf;
		location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)\$
		{
			expires      30d;
			access_log on;
		}
		location ~ .*\\.(js|css)?\$
		{
			expires      12h;
			access_log on;
		}
		access_log  /www/wwwlogs/{$webname}.log;
	}
EOT;
	}

	if (file_put_contents('/tmp/read.tmp', $conf)) {
		$file = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$webname.'.conf';
		$status = SendSocket("FileAdmin|SaveFile|" . $file);
		if($status['status']){
			SendSocket("FileAdmin|AddDir|" . $webdir);
			if(!file_exists('./conf/defaultDoc.html')){
				file_put_contents('./conf/defaultDoc.html',file_get_contents('https://basoro.id/downloads/defaultDoc.html'));
			}
			if(!file_exists('./conf/404.html')){
				file_put_contents('./conf/404.html',file_get_contents('https://basoro.id/downloads/404.html'));
			}


			if($_SESSION['server_type'] == 'nginx'){
				if(!file_exists('./conf/502.html')){
					file_put_contents('./conf/502.html',file_get_contents('https://basoro.id/downloads/502.html'));
				}
				file_put_contents($webdir.'/502.html', file_get_contents('./conf/502.html'));
				if(!file_exists('/www/server/nginx/conf/rewrite')) SendSocket("FileAdmin|AddDir|/www/server/nginx/conf/rewrite");
				SendSocket("FileAdmin|AddFile|/www/server/nginx/conf/rewrite/{$webname}.conf");

			}

			file_put_contents($webdir.'/index.html', file_get_contents('./conf/defaultDoc.html'));
			file_put_contents($webdir.'/404.html', file_get_contents('./conf/404.html'));
			file_put_contents($webdir.'/.user.ini', 'open_basedir='.$webdir.'/:/tmp/:/proc/');
			SendSocket("ExecShell|chmod 644 {$webdir}/.user.ini|$webdir");
			SendSocket("ExecShell|chown root.root {$webdir}/.user.ini|$webdir");
			SendSocket("ExecShell|chattr +i {$webdir}/.user.ini|$webdir");
			$serverType = $_SESSION['server_type'] == 'nginx' ? 'nginx':'';
			SendSocket("ExecShell|service ".$serverType." reload");
		}
	}

	if (!$status['status']){
		$result = array('status'=>false,'code'=>-1,'msg'=>(isset($status['msg'])?$status['msg']:'Connection server interface failed!'));
		if($own){
			return $result;
		}
		ajax_return($result);
	}


	if (I('post.ftp')=='true'){
		$ftppassword = I('post.ftppassword');
		$ftpusername = trim(I('post.ftpuser'));
		$ftpstatus = SendSocket("FTP|add|{$ftpusername}|{$ftppassword}|{$webdir}|1|Read and write|500|500");
		if(@$ftpstatus['status'] == 'true'){
			$data = array(
				'name' 		=> $ftpusername,
				'password' 	=> $ftppassword,
				'path' 		=> $webdir,
				'status' 	=> 1,
				'ps' 		=> "website: {$webname} FTP account"
			);
			M('ftps')->add($data);
			$_SESSION['server_count']['ftps']++;
			WriteLogs('FTP management', "Add FTP [$ftpusername] success!");
		}
		$retuls = array('status'=>true,'in_ftp'=>true,'ftpUserName'=>$ftpusername,'ftpPassword'=>$ftppassword,'ftpUrl'=>'ftp://'.$_SESSION['serverip'].':'.$_SESSION['port']);
	}else{
		$retuls = array('status'=>true,'in_ftp'=>false);
	}
	if(I('post.sql') != 'false'){
		$retuls['sql'] = AddSql();
	}
	$ps = I('post.bak');
	$data = array(
		'name'		=> $webname,
		'path' 		=> $webdir,
		'domain' 	=> $domain.':'.$port,
		'ps'	=> ($ps == '')? 'Fill in the note':$ps,
		'status' => "running"
	);
	$_POST['id'] = $SQL->add($data);
	$_SESSION['server_count']['sites']++;
	WriteLogs('Website management', 'Add website ['.$webname.'] success!');
	if($own){
		return $retuls;
	}
	ajax_return($retuls);
}

function GetPathStr($path){
	$len = strlen($path);
	if(substr($path,$len-1, 1) == '/'){
		return substr($path,0, $len -1);
	}
	return $path;
}

function GetLimitNet(){
	$id = I('id');

	$siteName = M('sites')->where("id='$id'")->getField('name');
	$filename = '/www/server/nginx/conf/vhost/'.$siteName.'.conf';

	$conf = file_get_contents($filename);
	$rep = "/\s+limit_conn\s+perserver\s+([0-9]+);/";
	preg_match($rep, $conf,$tmp);
	$data['perserver'] = intval($tmp[1]);

	$rep = "/\s+limit_conn\s+perip\s+([0-9]+);/";
	preg_match($rep, $conf,$tmp);
	$data['perip'] = intval($tmp[1]);

	$rep = "/\s+limit_rate\s+([0-9]+)\w+;/";
	preg_match($rep, $conf,$tmp);
	$data['limit_rate'] = intval($tmp[1]);

	ajax_return($data);
}

function SetLimitNet(){
	if($_SESSION['server_type'] != 'nginx') returnJson(false, 'Traffic restrictions currently only support Nginx environments');

	$id = I('id');
	$perserver = 'limit_conn perserver '.I('perserver','','intval').';';
	$perip = 'limit_conn perip '.I('perip','','intval').';';
	$limit_rate = 'limit_rate '.I('limit_rate','','intval').'k;';

	$siteName = M('sites')->where("id=$id")->getField('name');
	$filename = '/www/server/nginx/conf/vhost/'.$siteName.'.conf';
	$conf = file_get_contents($filename);

	$oldLimit = '/www/server/nginx/conf/vhost/limit.conf';
	if(file_exists($oldLimit)) SendSocket("FileAdmin|DelFile|".$oldLimit);
	$limit = '/www/server/nginx/conf/nginx.conf';
	$nginxConf = file_get_contents($limit);
	$limitConf = "limit_conn_zone \$binary_remote_addr zone=perip:10m;\n	limit_conn_zone \$server_name zone=perserver:10m;";
	$nginxConf = str_replace("#limit_conn_zone \$binary_remote_addr zone=perip:10m;",$limitConf,$nginxConf);
	file_put_contents('/tmp/read.tmp', $nginxConf);
	SendSocket("FileAdmin|SaveFile|".$limit);

	if(strpos($conf,'limit_conn perserver') !== false){

		$rep = "/limit_conn\s+perserver\s+([0-9]+);/";
		$conf = preg_replace($rep,$perserver,$conf);

		$rep = "/limit_conn\s+perip\s+([0-9]+);/";
		$conf = preg_replace($rep,$perip,$conf);

		$rep = "/limit_rate\s+([0-9]+)\w+;/";
		$conf = preg_replace($rep,$limit_rate,$conf);
	}else{
		$conf = str_replace('#error_page 404/404.html;',"#error_page 404/404.html;\n	{$perserver}\n	{$perip}\n	{$limit_rate}",$conf);
	}

	if (file_put_contents('/tmp/read.tmp', $conf)) {
		SendSocket('FileAdmin|CopyFile|'.$filename.'|/tmp/backup.conf');
		$result = SendSocket("FileAdmin|SaveFile|" . $filename);
		if($_SESSION['server_type'] == 'nginx'){
			$isError = checkNginxConf();
		}

		if($isError !== true){
			SendSocket('FileAdmin|CopyFile|/tmp/backup.conf|'.$filename);
			SendSocket("FileAdmin|ChmodFile|" . $filename . '|root');
			returnJson(false,'Configuration file error: <br><a style="color:red;">'.str_replace("\n",'<br>',$isError).'</a>');
		}
		serviceWebReload();
		returnJson(true, 'Successful setup!');
	}

	returnJson(false, 'Save failed!');
}

function CloseLimitNet(){
	$id = I('id');

	$siteName = M('sites')->where("id=$id")->getField('name');
	$filename = '/www/server/nginx/conf/vhost/'.$siteName.'.conf';
	$conf = file_get_contents($filename);

	$rep = "/\s+limit_conn\s+perserver\s+([0-9]+);/";
	$conf = preg_replace($rep,'',$conf);

	$rep = "/\s+limit_conn\s+perip\s+([0-9]+);/";
	$conf = preg_replace($rep,'',$conf);

	$rep = "/\s+limit_rate\s+([0-9]+)\w+;/";
	$conf = preg_replace($rep,'',$conf);
	if (file_put_contents('/tmp/read.tmp', $conf)) {
		SendSocket("FileAdmin|SaveFile|" . $filename);
		serviceWebReload();
		returnJson(true, 'Traffic limit has been turned off!');
	}
	returnJson(false, 'Save failed!');
}

function Get301Status(){
	$siteName = I('siteName');

	if($_SESSION['server_type'] == 'nginx'){
		$tmp = file_get_contents('/www/server/nginx/conf/vhost/'.$siteName.'.conf');
		$rep = "/return\s+301\s+((http|https)\:\/\/.+);/";
		preg_match($rep, $tmp,$arr);
		$rep = "/host.+\^((\w+\.)+\w+)/";
		preg_match($rep, $tmp,$src);
		$src[0] = $src[1];
	}
	$result['src'] = str_replace("'", '', $src[0]);
	$result['domain'] = M('sites')->where("name='$siteName'")->getField('domain');
	$result['status'] = (strlen($arr[1]) < 3)?false:true;
	$result['url'] = $arr[1];

	ajax_return($result);
}

function Set301Status(){
	$siteName = I('siteName');
	$srcDomain = I('srcDomain');
	$toDomain = I('toDomain');
	$type = I('type');
	$rep = "/(http|https)\:\/\/[\w-_\.]+.+/";
	if(!preg_match($rep, $toDomain))	returnJson(false,'Url address is incorrect!');
	if($_SESSION['server_type'] == 'nginx'){
		if($srcDomain == 'all'){
			$conf301 = "\t#301-START\n\t\treturn 301 $toDomain;\n\t\t#301-END";
		}else{
			$conf301 = "\t#301-START\n\t\tif (\$host ~ '^$srcDomain'){\n\t\t\treturn 301 $toDomain\$uri;\n\t\t}\n\t\t#301-END";
		}
		//$conf = ($type == '1')?$conf301:' ';
		$filename = '/www/server/nginx/conf/vhost/'.$siteName.'.conf';
		$conf = file_get_contents($filename);
		if($type == '1'){
			$conf = str_replace("#error_page 404/404.html;", "#error_page 404/404.html;\n\t".$conf301, $conf);
		}else{
			$rep = "/\s+#301-START(.|\n)+#301-END/";
			$conf = preg_replace($rep, '', $conf);
		}
	}


	if (file_put_contents('/tmp/read.tmp', $conf)) {
		SendSocket('FileAdmin|CopyFile|'.$filename.'|/tmp/backup.conf');
		$result = SendSocket("FileAdmin|SaveFile|" . $filename);
		if($_SESSION['server_type'] == 'nginx'){
			$isError = checkNginxConf();
		}

		if($isError !== true){
			SendSocket('FileAdmin|CopyFile|/tmp/backup.conf|'.$filename);
			SendSocket("FileAdmin|ChmodFile|" . $filename . '|root');
			returnJson(false,'Configuration file error: <br><a style="color:red;">'.str_replace("\n",'<br>',$isError).'</a>');
		}
		serviceWebReload();
		returnJson(true,'Successful operation!');
	}
	returnJson(false,'Operation failed!');
}

function AddSql(){
	$data_name = trim(I('post.datauser'));
	$datapwd = trim(I('post.datapassword'));
	if($data_name == 'root' || $data_name == 'mysql' || $data_name == 'test' || strlen($data_name) < 3){
		$result['dataName'] = 'Illegal database name!';
		return $result;
	}
	if(strlen($data_name) > 16) return false;
	$reg = "/^[a-zA-Z]{1}\w+$/";
	if(!preg_match($reg, $data_name)) return false;

	$SQL = M('databases');
	if($SQL->where("name='$data_name'")->getCount()) return false;
	$codeing = I('codeing');
	switch($codeing){
		case 'utf8':
			$codeStr = 'utf8_general_ci';
			break;
		case 'utf8bm4':
			$codeStr = 'utf8mb4_general_ci';
			break;
		case 'gbk':
			$codeStr = 'gbk_chinese_ci';
			break;
		case 'big5':
			$codeStr = 'big5_chinese_ci';
			break;
		default:
			$codeStr = 'utf8_general_ci';
	}
	$result = SqlExec("create database $data_name DEFAULT CHARACTER SET $codeing COLLATE $codeStr");
	if(strpos($result,"using password:")){
		$result['dataName'] = 'Database management password error!';
		return $result;
	}

	SqlExec("drop user '$data_name'@'localhost'");
	SqlExec("drop user '$data_name'@'127.0.0.1'");
	SqlExec("grant all privileges on ".$data_name.".* to '$data_name'@'localhost' identified by '$datapwd'");
	SqlExec("grant all privileges on ".$data_name.".* to '$data_name'@'127.0.0.1' identified by '$datapwd'");
	SqlExec("flush privileges");


	$data = array(
		'name' 		=> $data_name,
		'username' 	=> $data_name,
		'password' 	=> $datapwd,
		'ps' 		=> 'Website: '.$_POST['webname'].' database'
	);
	$SQL->add($data);
	WriteLogs('Database management', 'Add database ['.$data_name.'] success!');
	$retuls = array('dataName'=>$data_name,'dataUser'=>$data_name,'password'=>$datapwd);
	return $retuls;
}

function DeleteSite(){
	$id = I('get.id');
	$path = isset($_GET['path'])?M('sites')->where("id='$id'")->getField('path'):'';
	$siteName = I('get.webname');
	if($_SESSION['server_type'] == 'nginx'){
		if(intval($_GET['path']) != 1) $path = '';
		$ret = SendSocket('Nginx|delete|'.$_GET['webname'].'|'.$path);
		SendSocket("FileAdmin|DelFile|/www/server/nginx/conf/rewrite/".$_GET['webname'].'.conf');
		SendSocket("FileAdmin|DelFile|/www/server/nginx/conf/rewrite/".$_GET['webname'].'_*');
		SendSocket("FileAdmin|DelFile|/www/wwwlogs/".$_GET['webname'].'.log');
		SendSocket("FileAdmin|DelFile|/www/wwwlogs/".$_GET['webname'].'-*');
		SendSocket("FileAdmin|DelFile|".$_SESSION['config']['backup_path']."/site/".$_GET['webname'].'_*');
		SendSocket("FileAdmin|DelDir|/www/server/nginx/conf/key/".$_GET['webname']);
	}

	if($ret){
		M('sites')->where("id='$id'")->delete();
		M('binding')->where("pid='$id'")->delete();
		WriteLogs('Website management', "Delete website [".I('get.webname').'] success!');
		if(isset($_GET['data'])){
			DeleteDatabase();
		}
		if(isset($_GET['ftp'])){
			DeleteFtp();
		}
		ajax_return(true);
	}else{
		WriteLogs('Website management', "Delete website [".I('get.webname').'] failure!');
		ajax_return(false);
	}
}

function DeleteFtp(){
	$webname = $_GET['webname'];
	$SQL = M('ftps');
	$ftpData = $SQL->where("ps like '%$webname%'")->find();
	$username = $ftpData['name'];
	$ret = SendSocket('FTP|delete|'.$username.'|no|');
	if($ret['status'] == 'true'){
		$SQL->where("id='".$ftpData['id']."'")->delete();
		WriteLogs('FTP management', 'Delete FTP ['.$username.'] success!');
		$_SESSION['server_count']['ftps']--;
		return true;
	}else{
		return false;
	}
}

function DeleteDatabase(){
	$webname = $_GET['webname'];
	$SQL = M('databases');
	$find = $SQL->where("ps like '%$webname%'")->find();
	if(!$find){
		return false;
	}
	$result = SqlExec("drop database ".$find['name']);
	if(substr($result,"using password:")) return false;
	if(substr($result,"Connection refused")) return false;
	SqlExec("drop user '".$find['name']."'@'localhost'");
	SqlExec("drop user '".$find['name']."'@'".$find['accept']."'");
	SqlExec("flush privileges");
	$SQL->where("id='".$find['id']."'")->delete();
	WriteLogs('Database management','Delete database ['.$find['name'].'] success!');
	return true;
}

function GetDirBinding(){
	$id = I('id');
	$count = SqlQuery("select COUNT(TABLE_NAME) from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='bt_default' and TABLE_NAME='bt_binding'");
	if(intval($count['COUNT(TABLE_NAME)']) == 0){
		$sql = "CREATE TABLE bt_default.bt_binding( `id` int(11) unsigned NOT NULL AUTO_INCREMENT, `pid` int(11) unsigned DEFAULT '0', `domain` varchar(64) DEFAULT '', `path` varchar(128) DEFAULT NULL, `port` int(7) unsigned DEFAULT '80', `addtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`),INDEX(`pid`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		SqlExec($sql);
	}

	$data['binding'] = M('binding')->where("pid='$id'")->select();

	$path = M('sites')->where("id='$id'")->getField('path');
	$mydir = dir($path);
	$dirs = array();
	while($dir = $mydir->read()){
		if(is_dir($path.'/'.$dir) == false || $dir == '.' || $dir == '..') continue;
		$dirs[] = $dir;
	}

	$data['dirs'] = $dirs;
	if(!json_encode($data))$data = mult_iconv('GB2312','UTF-8',$data);
	ajax_return($data);
}

function mult_iconv($in_charset,$out_charset,$data)
{
    if(substr($out_charset,-8)=='//IGNORE'){
        $out_charset=substr($out_charset,0,-8);
    }
    if(is_array($data)){
        foreach($data as $key => $value){
            if(is_array($value)){
                $key=iconv($in_charset,$out_charset.'//IGNORE',$key);
                $rtn[$key]=mult_iconv($in_charset,$out_charset,$value);
            }elseif(is_string($key) || is_string($value)){
                if(is_string($key)){
                    $key=iconv($in_charset,$out_charset.'//IGNORE',$key);
                }
                if(is_string($value)){
                    $value=iconv($in_charset,$out_charset.'//IGNORE',$value);
                }
                $rtn[$key]=$value;
            }else{
                $rtn[$key]=$value;
            }
        }
    }elseif(is_string($data)){
        $rtn=iconv($in_charset,$out_charset.'//IGNORE',$data);
    }else{
        $rtn=$data;
    }
    return $rtn;
}

function AddDirBinding(){
	$id = I('id');
	$tmp = explode(':',I('domain'));
	$domain = $tmp[0];
	$port = ($tmp[1] == '')?80:$tmp[1];
	$dirName = I('dirName');
	if(!$dirName) returnJson(false, 'Directory cannot be empty!');
	$siteInfo = M('sites')->where("id='$id'")->find();
	$webdir = $siteInfo['path'].'/'.$dirName;
	$sql = M('binding');
	if($sql->where("domain='$domain'")->getCount()) returnJson(false, 'Please do not double-bind the domain name!');
	$filename = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$siteInfo['name'].'.conf';
	$conf = file_get_contents($filename);

	if($_SESSION['server_type'] == 'nginx'){
		$rep = "/enable-php-([0-9]{2,3})\.conf/";
		preg_match($rep,$conf,$tmp);
		$version = $tmp[1];
		$bindingConf =<<<EOT
\n#BINDING-{$domain}-START
server
    {
        listen {$port};
        server_name {$domain};
        index index.php index.html index.htm default.php default.htm default.html;
        root {$webdir};

        include enable-php-{$version}.conf;
        include rewrite/{$siteInfo[name]}.conf;
        location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)\$
        {
            expires      30d;
        }
        location ~ .*\\.(js|css)?\$
        {
            expires      12h;
        }
        location ~ /\\.
        {
            deny all;
        }
    }
#BINDING-{$domain}-END
EOT;
	}
	$conf .= $bindingConf;
	if (file_put_contents('/tmp/read.tmp', $conf)) {
		SendSocket('FileAdmin|CopyFile|'.$filename.'|/tmp/backup.conf');
		$result = SendSocket("FileAdmin|SaveFile|" . $filename);
		if($_SESSION['server_type'] == 'nginx'){
			$isError = checkNginxConf();
		}

		if($isError !== true){
			SendSocket('FileAdmin|CopyFile|/tmp/backup.conf|'.$filename);
			SendSocket("FileAdmin|ChmodFile|" . $filename . '|root');
			returnJson(false,'Configuration file error: <br><a style="color:red;">'.str_replace("\n",'<br>',$isError).'</a>');
		}
		$data = array(
			'pid'		=>	$id,
			'domain'	=>	$domain,
			'port'		=>	$port,
			'path'		=>	$dirName
		);
		M('binding')->add($data);
		serviceWebReload();
		ajax_return($result);
	}

	returnJson(false, 'add failed');
}

function GetDirRewrite(){
	$id = I('id','','intval');
	$find = M('binding')->where("id=$id")->find();
	$site = M('sites')->where("id=".$find['pid'])->find();
	$filename = '/www/server/nginx/conf/rewrite/'.$site['name'].'_'.$find['path'].'.conf';

	if(isset($_GET['add'])){
		SendSocket("FileAdmin|AddFile|".$filename);
		if($_SESSION['server_type'] == 'nginx'){
			$file = '/www/server/nginx/conf/vhost/'.$site['name'].'.conf';
			$conf = file_get_contents($file);
			$domain = $find['domain'];
			$rep = "/\n#BINDING-{$domain}-START(.|\n)+BINDING-{$domain}-END/";
			preg_match($rep, $conf,$tmp);
			$dirConf = str_replace('include rewrite/'.$site['name'].'.conf;', 'include rewrite/'.$site['name'].'_'.$find['path'].'.conf;', $tmp[0]);
			$conf = str_replace($tmp[0], $dirConf, $conf);
			file_put_contents('/tmp/read.tmp', $conf);
			SendSocket("FileAdmin|SaveFile|" . $file);
		}
	}
	$data['status'] = false;
	if(file_exists($filename)){
		$data['status'] = true;
		$data['data'] = file_get_contents($filename);
		$data['rlist'] = explode(',', file_get_contents(dirname(__FILE__).'/rewrite/'.$_SESSION['server_type'].'/list.txt'));
		$data['filename'] = $filename;
	}

	ajax_return($data);
}

function DelDirBinding(){
	$id = I('id');
	$binding = M('binding')->where("id='$id'")->find();
	$siteName = M('sites')->where("id='".$binding['pid']."'")->getField('name');
	$filename = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$siteName.'.conf';
	$conf = file_get_contents($filename);
	$rep = "/\s*.+BINDING-".$binding['domain']."-START(.|\n)+BINDING-".$binding['domain']."-END/";
	$conf = preg_replace($rep, '', $conf);
	if (file_put_contents('/tmp/read.tmp', $conf)) {
		$result = SendSocket("FileAdmin|SaveFile|" . $filename);
		M('binding')->where("id='$id'")->delete();
		$filename = '/www/server/'.$_SESSION['server_type'].'/conf/rewrite/'.$siteName.'_'.$binding['path'].'.conf';
		if(file_exists($filename)) SendSocket("FileAdmin|DelFile|".$filename);
		serviceWebReload();
		ajax_return($result);
	}
}

function AddDomain($own=false){
	$_POST['port'] = $_POST['port'] == ""?'80':intval($_POST['port']);
	$_POST['new_domain'] = trim($_POST['new_domain']);
	$SQL = M('sites');
	$id=intval($_POST['id']);
	if($SQL->where("domain like '".$_POST['new_domain'].":%' OR domain like '%,".$_POST['new_domain'].":%'")->getCount()){
		if($own) return false;
		ajax_return(0);
	}


	if($_SESSION['server_type'] == 'nginx'){
		$file = '/www/server/nginx/conf/vhost/'.$_POST['webname'].'.conf';
		$conf = file_get_contents($file);

		$rep = "/server_name\s*(.*);$/m";
		preg_match($rep,$conf,$tmp);
		$domains = explode(' ',$tmp[1]);
		if(!in_array($_POST['new_domain'],$domains)){
			$newServerName = str_replace(';',' '.$_POST['new_domain'].';',$tmp[0]);
			$conf = str_replace($tmp[0],$newServerName,$conf);
		}

		$rep = "/listen\s+([0-9]+);/";
		preg_match_all($rep,$conf,$tmp);
		if(!in_array(''.$_POST['port'],$tmp[1])){
			$conf = str_replace($tmp[0][0],$tmp[0][0]."\n	listen ".$_POST['port'].";",$conf);
		}
	}

	if (file_put_contents('/tmp/read.tmp', $conf)) {
		SendSocket('FileAdmin|CopyFile|'.$file.'|/tmp/backup.conf');
		$result = SendSocket("FileAdmin|SaveFile|" . $file);
		if($_SESSION['server_type'] == 'nginx'){
			$isError = checkNginxConf();
		}

		if($isError !== true){
			SendSocket('FileAdmin|CopyFile|/tmp/backup.conf|'.$file);
			SendSocket("FileAdmin|ChmodFile|" . $file . '|root');
			returnJson(false,'Configuration file error: <br><a style="color:red;">'.str_replace("\n",'<br>',$isError).'</a>');
		}
		if($result['status']){
			$find = $SQL->where("id='$id'")->find();
			$domains = explode(',',$find['domain']);
			if(!in_array($_POST['new_domain'].':'.$_POST['port'],$domains)){
				$domain = $find['domain'].','.$_POST['new_domain'].':'.$_POST['port'];
				$SQL->where("id='$id'")->setField('domain',$domain);
			}
			serviceWebReload();
			WriteLogs('Website management', 'website ['.$_POST['webname'].'] add domain name ['.$_POST['new_domain'].'] success!');
			if($own) return true;
			ajax_return(true);
		}
	}

	if($own){
		return false;
	}
	ajax_return(false);
}

function DeleteDomain(){
	$SQL = M('sites');
	$id=$_GET['id'];
	$find = $SQL->where("id='$id'")->find();
	$domain = explode(',',$find['domain']);
	$domain_count = count($domain);
	if($domain_count == 1) returnJson(false,'The last domain name cannot be deleted');

	if($_SESSION['server_type'] == 'nginx'){
		$file = '/www/server/nginx/conf/vhost/'.$_GET['webname'].'.conf';
		$conf = file_get_contents($file);

		$rep = "/server_name\s+(.+);$/m";
		preg_match($rep,$conf,$tmp);
		$newServerName = str_replace(' '.$_GET['domain'].';',';',$tmp[0]);
		$newServerName = str_replace(' '.$_GET['domain'].' ',' ',$newServerName);
		$conf = str_replace($tmp[0],$newServerName,$conf);

		$port = I('port','','intval');
		$rep = "/listen\s+([0-9]+);/";
		preg_match_all($rep,$conf,$tmp);
		if(in_array(''.$port,$tmp[1]) == true && count($tmp[1]) > 1 && checkPort($domain,$port) == false){
			$rep = "/\s+listen\s+".$port.";/";
			$conf = preg_replace($rep,'',$conf);
		}
	}

	if (file_put_contents('/tmp/read.tmp', $conf)) {
		$result = SendSocket("FileAdmin|SaveFile|" . $file);
		if($result['status']){
			$n = 0;
			for($i=0;$i<$domain_count;$i++){
				if($n == 0){
					$null = '';
				}else{
					$null = ',';
				}
				$domainPort = explode(':',$domain[$i]);
				if(count($domainPort) == 1)$domainPort[1] = '80';
				if($domainPort[0].':'.$domainPort[1] != $_GET['domain'].':'.$_GET['port']){
					$new_domain = $new_domain.$null.$domain[$i];
					$n++;
				}
			}

			$SQL->where("id='$id'")->setField('domain',$new_domain);
			WriteLogs('Website management', 'website ['.I('get.webname').'] delete domain name ['.I('get.domain').'] success!');
			serviceWebReload();
			ajax_return($result);
		}
	}
	WriteLogs('Website management', 'website ['.I('get.webname').'] delete domain name ['.I('get.domain').'] failure!');
	ajax_return($result);
}

function checkPort($domains,$port){
	$n = 0;
	foreach($domains as $value){
		$tmp = explode(':',$value);
		if($tmp[1] == $port){
			$n++;
			if($n > 1){
				return true;
			}
		}
	}
	return false;
}

function FilesZip(){
	$id = I('id');
	$files = I('files');

	if($files == ''){
		ajax_return(array('status'=>false,'code'=>-4,'msg'=>'File name cannot be empty'));
	}
	$tmp = explode('.', $files);
	$num = count($tmp);
	if($num < 2){
		ajax_return(array('status'=>false,'code'=>-2,'msg'=>'Must have file suffix'));
	}
	$exp = strtolower($tmp[$num-1]);
	if( $exp != 'zip' && $exp != 'gz'){
		ajax_return(array('status'=>false,'code'=>-3,'msg'=>'Currently only compressed files in zip or tar.gz format are supported.'));
	}

	$path = M('sites')->where("id='$id'")->getField('path');
	$files = $path.'/'.$files;

	$exec = "FileAdmin|UnZipFile|" . $files . '|' . $path . '|' . (($exp=='zip')?'0':'1');
	$result = SendSocket($exec);

	if($result['status'] == 'true'){
		WriteLogs("Website management", "Online decompression [$files] success!");
		$data = array('status'=>true,'code'=>1,'msg'=>'Successful operation');
	}else{
		$data = array('status'=>false,'code'=>-1,'msg'=>$result['msg']);
	}
	ajax_return($data);
}

function GetIndex(){
	$id = I('id');
	$Index = M('sites')->where("id=$id")->getField('index');
	exit($Index);
}

function SetIndex(){
	$id = I('id');
	if(!strstr($_GET['Index'], '.')){
		ajax_return(array('status'=>false,'msg'=>'Input format is incorrect!'));
	};

	$Index = str_replace(' ', '',$_GET['Index']);
	$Index = str_replace(',,', ',',$_GET['Index']);

	if(strlen($Index) < 3){
		ajax_return(array('status'=>false,'msg'=>'Default document cannot be empty!'));
	}

	$Name = M('sites')->where("id=$id")->getField('name');
	$Index_L = str_replace(",", " ", $Index);
	$file = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$Name.'.conf';

	$conf = file_get_contents($file);
	if($_SESSION['server_type'] == 'nginx'){
		$rep = "/\s+index\s+.+;/";
		$conf = preg_replace($rep,"\n	index ".$Index_L.";",$conf);
	}

	if (file_put_contents('/tmp/read.tmp', $conf)) {
		$data = SendSocket("FileAdmin|SaveFile|" . $file);
		serviceWebReload();
	}


	M('sites')->where("id='$id'")->save(array('index'=>$Index));
	WriteLogs('Website management', 'Set the default document successfully!');
	ajax_return($data);
}

function SetPath(){
	$id = I('id','',int);

	$Path = GetPathStr($_POST['path']);
	if($Path == "" || $id == 0){
		returnJson(false,  "Directory cannot be empty");
	}

	if(checkMainPath($path))returnJson(false,  "Cannot use system key directory as website directory!");

	$SiteFind = M("sites")->where("id='$id'")->find();
	if($SiteFind["path"] == $Path) returnJson(false,  "Consistent with the original path, no need to modify");
	$Name = $SiteFind['name'];
	$file = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$Name.'.conf';
	if($_SESSION['server_type'] == 'nginx'){
		$conf = file_get_contents($file);
		$conf = str_replace($SiteFind['path'],$Path , $conf);
	}

	if (file_put_contents('/tmp/read.tmp', $conf)) {
		$data = SendSocket("FileAdmin|SaveFile|" . $file);
	}

	if($data['status'] == "true"){
		serviceWebReload();
		M("sites")->where("`id`='$id'")->setField('path',$Path);
		WriteLogs('Website management', 'Modify website ['.$Name.'] physical path succeeded!');
		returnJson(true,  "Successfully modified");
	}
	returnJson(false,  $data['msg']);
}

function ToBackup(){
	$id = I('id');
	$find = M('sites')->where("id=$id")->find();
	$fileName = $find['name'].'_'.date('YmdHis').'.zip';
	$zipName = $_SESSION['config']['backup_path'].'/site/'.$fileName;
	if(!file_exists($_SESSION['config']['backup_path'].'/site')) SendSocket("FileAdmin|AddDir|".$_SESSION['config']['backup_path'].'/site');
	$exec = "SiteZip|".$find['path'].'|'.$zipName;
	$result = SendSocket($exec);
	$sql = M('backup');
	$data = array(
		'type' => 0,
		'name'	=>	$fileName,
		'pid'	=>	$find['id'],
		'filename'	=>	$zipName,
		'size'	=>	0,
		'addtime'	=>	date('Y-m-d H:i:s'));
	$sql->add($data);
	WriteLogs('Website management', 'Backup website ['.$find['name'].'] success!');
	returnJson(true, 'Backup success!');
}

function DelBackup(){
	$id = I('id');
	$where = "id=$id";
	$filename = M('backup')->where($where)->getField('filename');
	$result = SendSocket("FileAdmin|DelFile|$filename");
	if($result['status'] == true || empty($result['msg']) == true){
		WriteLogs('Website management', 'Delete website backup ['.$filename.'] success!');
		M('backup')->where($where)->delete();
	}
	$result['msg'] = isset($result['msg'])?$result['msg'] :'File does not exist!';
	returnSocket($result);
}

function GetPHPStatus(){
	$version = I('version');
	$url = "http://127.0.0.1/phpfpm_{$version}_status?json";
	$result = json_decode(httpGet($url),1);
	$result['start time'] = date('Y-m-d H:i:s',$result['start time']);
	ajax_return($result);
}

function GetRewriteList(){
	$rewriteList['rewrite'] = explode(',', file_get_contents(dirname(__FILE__).'/rewrite/'.$_SESSION['server_type'].'/list.txt'));
	ajax_return($rewriteList);
}

function GetPHPVersion(){
	$phpVersions = array('54','55','56','70','71','72','73');
	$data = array();
	$i = 0;
	$httpdVersion = "";
	$filename = '/www/server/apache/version.pl';
	if(file_exists($filename)) $httpdVersion = trim(file_get_contents($filename));

	foreach($phpVersions as $val){
		if(strpos($httpdVersion,'2.2.3') !== false){
			$filename = '/www/server/php/'.$val.'/bin/php';
		}else{
			$filename = '/tmp/php-cgi-'.$val.'.sock';
		}
		if(file_exists($filename) == true){
			if($_SESSION['server_type'] != 'nginx' && $val == '52' && strpos($httpdVersion,'2.2.3') === false) continue;
			$data[$i]['version'] = $val;
			$data[$i]['name'] = 'PHP-'.$val;
			$i++;
		}
	}
	ajax_return($data);
}

function GetSitePHPVersion(){
	$siteName = I('siteName');
	$conf = file_get_contents('/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$siteName.'.conf');

	$rep = ($_SESSION['server_type'] == 'nginx') ? "/enable-php-([0-9]{2,3})\.conf/":"/php-cgi-([0-9]{2,3})\.sock/";
	preg_match($rep,$conf,$tmp);
	ajax_return($tmp[1]);
}

function SetPHPVersion(){
	$siteName = I('siteName');
	$version = I('version');
	if($_SESSION['server_type'] == 'nginx'){
		$file = '/www/server/nginx/conf/vhost/'.$siteName.'.conf';
		$conf = file_get_contents($file);
		$rep = "/enable-php-([0-9]{2,3})\.conf/";
		preg_match($rep,$conf,$tmp);
		$conf = str_replace($tmp[0],'enable-php-'.$version.'.conf',$conf);
	}
	if (file_put_contents('/tmp/read.tmp', $conf)) {
		$result = SendSocket("FileAdmin|SaveFile|" . $file);
		serviceWebReload();
		if($result['status']) WriteLogs("Website management", "Website [$siteName] The PHP version is switched to [$version]!");
		ajax_return($result);
	}
	ajax_return(array('status' => false, 'msg' => 'Save failed!'));
}

function GetDirUserINI(){
	$path = I('path');
	if(file_exists($path.'/.user.ini')){
		returnJson(true, 'Anti-cross-site attack has been configured!');
	}
	returnJson(false, 'Anti-cross-site attack has been turned off!');
}

function SetDirUserINI(){
	$path = GetPathStr(I('path'));
	$filename = $path.'/.user.ini';
	if(file_exists($filename)){
		SendSocket("ExecShell|chattr -i ".$filename);
		SendSocket("FileAdmin|DelFile|" . $filename);
		returnJson(true, 'Anti-cross-site attack has been disabled!');
	}

	file_put_contents('/tmp/read.tmp', 'open_basedir='.$path.'/:/tmp/:/proc/');
	SendSocket("FileAdmin|SaveFile|" . $filename);
	SendSocket("ExecShell|chmod 644 $filename|$path");
	SendSocket("ExecShell|chown root.root $filename|$path");
	SendSocket("ExecShell|chattr +i $filename|$path");
	returnJson(true, 'Anti-cross-site attack is enabled!');
}

function RewriteConverter(){
	require_once './class/Rewrite.class.php';
	$RC = new rewriteConf($_POST['rules']);
	$RC->parseContent();
    $RC->writeConfig();
	exit($RC->confOk);
}

function GetReferer(){
	$siteName = I('siteName');
	$filename = '/www/server/'.$_SESSION['server_type'].'/conf/vhost/'.$siteName.'.conf';
}

function GetProxy(){
	$name = I('name');
	$file = "/www/server/nginx/conf/vhost/{$name}.conf";
	$conf = file_get_contents($file);
	$rep = "/proxy_pass\s+(.+);/";
	preg_match($rep, $conf,$tmp);
	$data['proxyUrl'] = $tmp[1];
	$rep = "/proxy_set_header\s+Host\s+(.+);/";
	preg_match($rep, $conf,$tmp);
	$data['toDomain'] = $tmp[1]?$tmp[1]:'$host';
	$data['status'] = $data['proxyUrl']?true:false;
	ajax_return($data);
}

function SetProxy(){
	$name = I('name');
	$type = I('type');
	$toDomain = trim(I('toDomain'));
	$proxyUrl=I('proxyUrl');
	$rep = "/(http|https)\:\/\/[\w-_\.]+.+/";
	if(!preg_match($rep, $proxyUrl))	returnJson(false,'Url address is incorrect!');
	if($_SESSION['server_type'] != 'nginx') returnJson(false, 'Sorry, the reverse proxy feature only supports Nginx for the time being.');

	if($toDomain != '$host'){
		$rep = "/^([\w\-\*]{1,100}\.){1,4}(\w{1,10}|\w{1,10}\.\w{1,10})$/";
		if(!preg_match($rep, $toDomain))	returnJson(false,'Sending domain name format is incorrect!');
	}

	if(substr($proxyUrl,strlen($proxyUrl)-1,1) == '/') $proxyUrl = substr($proxyUrl,0,strlen($proxyUrl)-1);
	CheckProxy();
	$file = "/www/server/nginx/conf/vhost/{$name}.conf";
	$conf = file_get_contents($file);

	if($type == "1"){
		$proxy=<<<EOT
#PROXY-START
		location /
		{
			proxy_pass $proxyUrl;
			proxy_cache_key $toDomain\$uri\$is_args\$args;
			proxy_set_header Host $toDomain;
			proxy_set_header X-Forwarded-For \$remote_addr;
			proxy_cache_valid 200 304 12h;
			expires 2d;
		}

		location ~ .*\\.(php|jsp|cgi|asp|aspx|flv|swf|xml)?\$
		{
			proxy_set_header Host $toDomain;
			proxy_set_header X-Forwarded-For \$remote_addr;
			proxy_pass $proxyUrl;
		}
		#PROXY-END
EOT;
		$rep = "/location(.|\n)+access_log\s+\//";
		$conf = preg_replace($rep, 'access_log  /', $conf);
		$conf = str_replace("include enable-php-", $proxy."\n\n		include enable-php-", $conf);
		file_put_contents('/tmp/read.tmp', $conf);
		SendSocket("FileAdmin|SaveFile|" . $file);
	}else{
		$rep = "/\n\s+#PROXY-START(.|\n)+#PROXY-END/";
		$conf = preg_replace($rep, "", $conf);
		$oldconf = "location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)\$
	    {
	        expires      30d;
	        access_log off;
	    }
	    location ~ .*\\.(js|css)?\$
	    {
	        expires      12h;
	        access_log off;
	    }";
		$conf = str_replace('access_log', $oldconf."\n\t\taccess_log", $conf);
		file_put_contents('/tmp/read.tmp', $conf);
		SendSocket("FileAdmin|SaveFile|" . $file);
	}
	serviceWebReload();
	returnJson(true, 'Successful operation!');
}

function CheckProxy(){
	$file = "/www/server/nginx/conf/proxy.conf";
	if(!file_exists($file)){
		$conf=<<<EOT
proxy_temp_path /www/server/nginx/proxy_temp_dir;
proxy_cache_path /www/server/nginx/proxy_cache_dir levels=1:2 keys_zone=cache_one:20m inactive=1d max_size=5g;
client_body_buffer_size 512k;
proxy_connect_timeout 60;
proxy_read_timeout 60;
proxy_send_timeout 60;
proxy_buffer_size 32k;
proxy_buffers 4 64k;
proxy_busy_buffers_size 128k;
proxy_temp_file_write_size 128k;
proxy_next_upstream error timeout invalid_header http_500 http_503 http_404;
proxy_cache cache_one;
EOT;
		file_put_contents('/tmp/read.tmp', $conf);
		SendSocket("FileAdmin|SaveFile|" . $file);
	}

	$file = "/www/server/nginx/conf/nginx.conf";
	$conf = file_get_contents($file);
	if(strpos($conf,'include proxy.conf;') === false){
		$rep = "/include\s+mime.types;/";
		$conf = preg_replace($rep, "include mime.types;\ninclude proxy.conf;", $conf);
		file_put_contents('/tmp/read.tmp', $conf);
		SendSocket("FileAdmin|SaveFile|" . $file);
	}
}

if(isset($_GET['action'])){
	$_GET['action']();
	exit;
}

require './public/head.html';
require './public/menu.html';
require './public/site.html';
require './public/footer.html';
?>
