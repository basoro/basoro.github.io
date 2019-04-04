<?php
include_once './Common.php';

function setPassword(){

	if($_POST['password1'] == ''){
		returnJson(false, 'Error, new password cannot be empty!');
	}

	if($_POST['password1'] != $_POST['password2']){
		returnJson(false, 'Error, the password entered twice is inconsistent!');
	}

	$SQL = M('user');
	if($SQL->where("id='1'")->setField('password',md5(I('post.password1'))))
	{
		returnJson(true, 'Successfully modified!');
	}
	returnJson(false, 'Successfully modified...!');
}

function setUserName(){

	if($_POST['username1'] == ''){
		returnJson(false, 'Error, new username cannot be empty!');
	}

	if($_POST['username1'] != $_POST['username2']){
		returnJson(false, 'Error, the username entered twice is inconsistent!');
	}

	$SQL = M('user');
	if($SQL->where("id='1'")->setField('username',I('post.username1')))
	{
		$_SESSION['username'] = $_POST['username1'];
		returnJson(true, 'Successfully modified!');
	}
	returnJson(false, 'Same as the original user!');
}

function update(){

	if(isset($_SESSION['updateInfo']) && empty($_GET['check'])){
		$updateInfo = $_SESSION['updateInfo'];
	}else{
		$temp = './conf/login.temp';
		$logs = file_get_contents($temp);
		file_put_contents($temp, ' ');
		if(!$logs) $logs = '';
		$data = Totals();
		$data['logs'] = $logs;
		$data['system'] = str_replace('release','',file_get_contents('/etc/redhat-release'));
		//$updateInfo = json_decode(httpPost('',$data),1);
		if(empty($updateInfo)) returnJson(false,"Failed to connect to the cloud server!");
		session('updateInfo', $updateInfo);
	}


	if($updateInfo['version'] == $_SESSION['info-n']){
		returnJson(false,"Currently the latest version!");
	}

	$isAuto = file_get_contents('./conf/upload.conf');
	if($updateInfo['force'] == true || $_GET['toUpdate'] == 'yes' || $isAuto == 'true'){
		$result = SendSocket("UpdateWeb|".$updateInfo['downUrl']);
		if($result['status'] == true){
			session('info-n', $updateInfo['version']);
			returnJson(true,'Successfully upgraded to'.$updateInfo['version']);
		}
		returnJson(false,'File download failed!');
	}

	$data = array(
		'status' => true,
		'version'=> $updateInfo['version'],
		'updateMsg'=> $updateInfo['updateMsg']
	);
	ajax_return($data);
}

function getUpdateLogs(){
	$data = json_decode(httpGet(''));
	ajax_return($data);
}

function checkMySQLPath(){
	$data = '/www/server/data';
	$own = posix_getpwuid(fileowner($data));
	if($own['name'] != 'mysql'){
		SendSocket("FileAdmin|ChownFile|" . $data . '|mysql');
	}
	$own = posix_getpwuid(fileowner('/etc/my.cnf'));
	if($own['name'] != 'root'){
		SendSocket("FileAdmin|ChownFile|/etc/my.cnf|root");
		SendSocket("FileAdmin|ChmodFile|/etc/my.cnf|644");
	}


}

function SetPanelPHPVersion(){
	$version = I('version');
	if($_SESSION['server_type'] == 'nginx'){
	$file = "/www/server/nginx/conf/enable-php.conf";
	$conf=<<<EOT
location ~ [^/]\.php(/|$)
{
	try_files \$uri =404;
	fastcgi_pass  unix:/tmp/php-cgi-$version.sock;
	fastcgi_index index.php;
	include fastcgi.conf;
	#include pathinfo.conf;
}
EOT;
	}

	file_put_contents('/tmp/read.tmp',$conf);
	$result = SendSocket("FileAdmin|SaveFile|" . $file);
	serviceWebReload();
	returnJson(true, 'Panel usage version has been switched');
}

function ReBoot(){
	WriteLogs('Service management', 'Restart the server!');
	SendSocket("ExecShell|service mysqld stop");
	SendSocket("ExecShell|init 6");
	returnJson(true, 'Restarting the server, please wait a few minutes before refreshing the page!');
}

function Totals(){
	$count['sites'] = intval(getCount('sites'));
	$count['ftps'] = intval(getCount('ftps'));
	$count['databases'] = intval(getCount('databases'));
	return $count;
}

if(isset($_GET['action'])){
	$_GET['action']();
	exit;
}

$Disk = SendSocket("System|disk");
if(!is_array($Disk)) $Disk = array();
if(empty($Disk[0])){
	for($i=1;$i<count($Disk)+1;$i++){
		$Disk[$i]['Usage rate'] = ceil(($Disk[$i]['Total capacity'] - $Disk[$i]['Available space']) / ($Disk[$i]['Total capacity'] / 100));
	}
}

if(file_exists('/tmp/exec_shell.pl')) SendSocket("FileAdmin|DelFile|/tmp/exec_shell.pl");

session('server_count',Totals());
checkMySQLPath();

$ConfigInfo = GetConfigInfo();

include_once './public/head.html';
include_once './public/menu.html';
include_once './public/index.html';
include_once './public/footer.html';
?>
