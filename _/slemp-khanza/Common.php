<?php

$filename = '/www/server/panel/conf/close.pl';
if(file_exists($filename) === true){
	echo '<meta charset="utf-8">
    <title>Please open the panel first!</title>
    </head><body>
    <h1>Sorry, the administrator has closed the panel and denied access!</h1>
        <p>Open command: rm -f /www/server/panel/conf/close.pl</p>
    <hr>
    <address>SLEMP Panel<a href="http://slemp.basoro.io" target="_blank">Request help</a></address>
    </body></html>';
	exit;
}

include_once './model/Public.model.php';
error_reporting(E_ALL^E_NOTICE^E_WARNING);
@session_start();
if(empty($_SESSION['panel_name'])){
	session('panel_name', 'SLEMP Panel');
	session('version','1.0');
	if(file_exists('./conf/panelName.conf')) session('panel_name',file_get_contents('./conf/panelName.conf'));
}


if(empty($_SESSION['bindingDomain'])){
	$panel = GetPanelBinding();
	$_SESSION['bindingDomain'] = $panel['domain'];
}



if(file_get_contents('./conf/limit.conf') == 'true'){
	$tmp = explode(':', $_SERVER['HTTP_HOST']);
	if($tmp[0] != $_SESSION['bindingDomain'] && $_SESSION['bindingDomain'] != "basoro.id" && $_SESSION['bindingDomain'] != NULL){
		header("HTTP/1.1 404 Not Found");
		exit;
	}
}

if(empty($_SESSION['config']['status'])){
	$status = M('config')->where("id=1")->getField('status');
	$_SESSION['config']['status'] = $status;
}

if(empty($_SESSION['iplist']) == true  || $_SESSION['iplist'] != $_SESSION['serverip']){
	$_SESSION['iplist'] = @file_get_contents('./conf/iplist.conf');
	if(empty($_SESSION['iplist'])){
		$_SESSION['iplist'] = $_SESSION['serverip'];
	}
	$tmp = explode(',',$_SESSION['iplist']);
	$_SESSION['serverip'] = $tmp[0];
}

//Whether to initialize
if(empty($_SESSION['config']['status'])){
	if(intval($status) != 1 && $_SERVER['SCRIPT_NAME'] != '/install.php'){
		header("Location: install.php");
		exit;
	}
}else{
	//Verify login
	if(empty($_SESSION["username"]) && $_SERVER['SCRIPT_NAME'] != '/login.php')
	{
		header("Location: login.php");
		exit;
	}
	GetServerInfo();
}

if(file_exists('/www/server/nginx/sbin/nginx')){
	session('server_type','nginx');
}

//Take the panel binding port and domain name
function GetPanelBinding(){
	$data = array();
	$filename = $_SESSION['server_type'] == 'nginx' ? '/www/server/nginx/conf/nginx.conf':'';
	$conf = file_get_contents($filename);
	$rep = $_SESSION['server_type'] == 'nginx'?"/listen\s+([0-9]{1,6})\s*.*;/":'';
	preg_match($rep,$conf,$tmp);
	$data['port'] = $tmp[1];
	$rep = $_SESSION['server_type'] == 'nginx'?"/\s+server_name\s+([\w\._-]+);/":'';
	preg_match($rep,$conf,$tmp);
	$data['domain'] = $tmp[1];

	$keyText = $_SESSION['server_type'] == 'nginx' ?'ssl_certificate':'';
	$data['ssl'] = (strpos($conf,$keyText) > 0)?true:false;
	$data['limit'] = file_get_contents('./conf/limit.conf') == 'true' ? true:false;
	if($_SESSION['server_type'] == 'nginx'){
		$data['defaultSite'] = file_exists('/www/server/nginx/conf/vhost/default.conf')?true:false;
	}
	$data['panel_name'] = 'SLEMP Panel';
	if(file_exists('./conf/panelName.conf')) $data['panel_name'] = file_get_contents('./conf/panelName.conf');

	$data['auto'] = false;
	if(file_exists('./conf/upload.conf')) $data['auto'] = file_get_contents('./conf/upload.conf') == 'true' ? true:false;
	return $data;
}

//Server information
function GetServerInfo(){
	if(empty($_SESSION['system'])){
		$where = "id='1'";
		$find = M('config')->where($where)->find();
		$result = SendSocket('Info');
		if(!$result){
			header("Content-type: text/html; charset=utf-8");
			exit('Sorry, the connection interface failed. Please try to enter service yunclient start on the SSH command line.!');
		}
		$ip = explode(',',$result['address']);
		session('config',$find);
		session('system','Linux');					//Operating system type
		session('mysql_root',$find['mysql_root']);	//MySQL administrator password
		session('info',$result['info']);			//Interface version
		session('server_type',$find['webserver']);	//HTTP server type
		session('serverip',GetMainAddress($ip));	//Server IP
		session('phpmyadminDirName', trim(file_get_contents('/www/server/cloud/phpmyadminDirName.pl')));
		session('phpmodel',trim(file_get_contents('/www/server/php/version.pl')));
	}
}

//Take the primary IP address
function GetMainAddress($ip){
	foreach($ip as $address){
		if(strlen($address) < 8) continue;
		$tmp = explode('.',$address);
		if($tmp[0] == '10') continue;
		if($tmp[0] == '192' && $tmp[1] == '168') continue;
		if($tmp[0] == '172' && $tmp[1] > 15 and $tmp[1] < 32) continue;
		return $address;
	}
	if(strlen($ip[0]) < 8) return $ip[1];
	return $ip[0];
}

//SESSION assignment
function session($key,$value){
	@session_start();

	if($value){
		$_SESSION[$key] = $value;
		return true;
	}
	return $_SESSION[$key];
}

//Configuration information
function GetConfigInfo(){
	if(!isset($_SESSION['config'])){
		$_SESSION['config'] = M('config')->where("id=1")->find();
	}
	if(!isset($_SESSION['config']['email'])){
		$_SESSION['config']['email'] = M('user')->where("id=1")->getField('email');
	}
	$data = $_SESSION['config'];

	$phpVersions = array('54','55','56','70','71','72','73');

	foreach($phpVersions as $val){
		$data['php'][$val]['setup'] = file_exists('/www/server/php/'.$val.'/bin/php');
		if($data['php'][$val]['setup']){
			$phpConfig = GetPHPConfig($val);
			$data['php'][$val]['max'] = $phpConfig['max'];
			$data['php'][$val]['maxTime'] = $phpConfig['maxTime'];
			$data['php'][$val]['pathinfo'] = $phpConfig['pathinfo'];
		}
		$data['php'][$val]['status'] = file_exists('/tmp/php-cgi-'.$val.'.sock');
	}

	$data['web']['type'] = $_SESSION['server_type'];
	$data['web']['version'] = file_get_contents('/www/server/'.$_SESSION['server_type'].'/version.pl');
	$data['mysql']['version'] = file_get_contents('/www/server/mysql/version.pl');
	$data['mysql']['status'] = file_exists('/tmp/mysql.sock');
	return $data;
}

//Take PHP configuration information
function GetPHPConfig($version){
	$file = "/www/server/php/{$version}/etc/php.ini";
	$phpini = file_get_contents($file);
	$file = "/www/server/php/{$version}/etc/php-fpm.conf";
	$phpfpm = file_get_contents($file);

	$rep = "/^upload_max_filesize\s*=\s*([0-9]+)M/m";
	preg_match($rep,$phpini,$tmp);
	$data['max'] = $tmp[1];

	$rep = "/request_terminate_timeout\s*=\s*([0-9]+)\n/";
	preg_match($rep,$phpfpm,$tmp);
	$data['maxTime'] = $tmp[1];

	$rep = "/\n;*\s*cgi\.fix_pathinfo\s*=\s*([0-9]+)\s*\n/";
	preg_match($rep,$phpini,$tmp);

	$data['pathinfo'] = $tmp[1] == '0'?true:false;

	return $data;
}

/**
 * Number of trains
 * @param String $table Table Name
 * @param void $where Query conditions
 * @return Int
 */
 function getCount($table){
 	$SQL = M($table);
	return $SQL->getCount();
 }

//Detect port legitimacy
function checkSetPort($port){
	if(intval($port) > 65535 || intval($port) < 21 ) return false;
	$ports = array('1','21','25326','20','22');
	if(in_array($port, $ports)) return false;
	return true;
}

//Check the Nginx configuration file
function checkNginxConf(){
	SendSocket("ExecShell|nginx -t -c /www/server/nginx/conf/nginx.conf");
	$reConf = file_get_contents('/tmp/shell_temp.pl');
	if(!strpos($reConf,'successful')){
		WriteLogs("Change setting", "Configuration file error: ".$reConf);
		return $reConf;
	}

	return true;
}

//Check directory restrictions
function checkMainPath($path){
	if($path == '/') return true;
	if(substr($path,strlen($path)-1,1) == '/'){
		$path = substr($path,0,strlen($path)-1);
	}

	$limit = array('/','/root','/usr','/var','bin','/sbin','/www','/www/wwwroot','/www/server','/www/server/data','/www/wwwroot/default',$_SESSION['config']['sites_path'],$_SESSION['config']['backup_path']);
	if(in_array($path,$limit)) return true;
	return false;
}

/**
 * Take the middle of the string
 * @param String $content Source text
 * @param String $start Start text
 * @param String $end	End text
 * @return String
 */
function GetBetween($content,$start,$end){
	$r = explode($start, $content);
	if (isset($r[1])){
		$r = explode($end, $r[1]);
		return $r[0];
	}
	return '';
}

?>
