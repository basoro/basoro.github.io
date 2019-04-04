<?php
require './Common.php';

function AddUser(){
	if(preg_match("/\W+/",$_POST['ftp_username'])) ajax_return(array('status'=>false,'code'=>501,'msg'=>'Username is not legal and cannot be marked with a special symbol'));
	if(strlen($_POST['ftp_username']) < 3)ajax_return(array('status'=>false,'code'=>501,'msg'=>'Username is not legal, can\'t be less than 3 characters'));
	if(checkMainPath($_POST['path'])) ajax_return(array('status'=>false,'code'=>501,'msg'=>'Cannot use system key directory as FTP directory'));
	$username = str_replace(' ', '', I('post.ftp_username'));
	$password = I('post.ftp_password');
	$path = str_replace(' ', '', I('post.path'));
	$path = str_replace("\\", "/", $path);
	$exec = 'FTP|add|'.$username.'|'.$password.'|'.$path;
	$ret = SendSocket($exec);
	if($ret['status'] == 'true'){
		$SQL = M('ftps');
		$data = array(
			'name' 		=> $username,
			'password' 	=> RCODE($password,'ENCODE'),
			'path' 		=> $path,
			'status' 	=> 1,
			'ps' 		=> ($_POST['ps'] == '')?'Fill in the note':$_POST['ps']
		);
		$SQL->add($data);
		WriteLogs('FTP management', 'Add an FTP user ['.$username.'] success!');
		$_SESSION['server_count']['ftps']++;
		ajax_return(array('status'=>true,'msg'=>'Added successfully'));
	}else{
		WriteLogs('FTP management', 'Add an FTP user ['.$username.'] failure!');
		ajax_return(array('status'=>true,'msg'=>'Add failed'));
	}
}

function DeleteUser(){
	$username = $_GET['username'];
	$id = $_GET['id'];
	$ret = SendSocket('FTP|delete|'.$username.'|no|');
	if($ret['status'] == 'true'){
		M('ftps')->where("id='$id'")->delete();
		WriteLogs('FTP management', 'Delete FTP user ['.$username.'] success!');
		$_SESSION['server_count']['ftps']--;
		returnJson(true, "Delete user successfully!");
	}else{
		WriteLogs('FTP management', 'Delete FTP user ['.$username.'] failure!');
		returnJson(false, "Interface connection failed!");
	}
}

function SetUserPassword(){
	$id = I('post.id');
	$username = I('post.ftp_username');
	$password = I('post.new_password');
	$ret = SendSocket('FTP|password|'.$username.'|'.$password);
	if($ret['status'] == 'true'){
		M('ftps')->where("id='$id'")->setField('password',$password);
		WriteLogs('FTP management', 'FTP user ['.$username.'], password has been updated!');
		ajax_return(true);
	}else{
		WriteLogs('FTP management', 'FTP user ['.$username.']，password change failed!');
		ajax_return(false);
	}
}

function SetStatus(){
	$id = I('id');
	$username = I('username');
	$status = I('status');
	$result = SendSocket('FTP|status|'.$username.'|'.$status);

	if(@$result['status'] == 'true'){
		M('ftps')->where("id='$id'")->setField('status',$status);
		WriteLogs('FTP management', "Disable FTP users [$username] success!");
		returnJson(true, 'Successful operation');
	}
	WriteLogs('FTP management', "Disable FTP users [$username] failure!");
	returnJson(false, 'Interface connection failed!');
}

function setPort(){
	$port = I('get.port','','intval');
	if($port < 1 || $port > 65535) returnJson(false,'Incorrect port format, range:1-65535');
	$file = '/www/server/pure-ftpd/etc/pure-ftpd.conf';
	$conf = file_get_contents($file);
	$rep = "/^#? *Bind\s+[0-9]+\.[0-9]+\.[0-9]+\.+[0-9]+,([0-9]+)/m";
	preg_match($rep,$conf,$tmp);
	$conf = preg_replace($rep,"Bind		0.0.0.0,".$port,$conf);
	if (file_put_contents('/tmp/read.tmp', $conf)) {

		$result = SendSocket("FileAdmin|SaveFile|" . $file);
		if(!$result['status']){
			returnJson(false, 'File dump failed!');
		}

		WriteLogs('FTP management', "Modify the FTP port to [$port] success!");

		SendSocket("Firewall|AddFireWallPort|".$port."|TCP|ftp");

		$exec = 'service pure-ftpd restart';
		SendSocket("ExecShell|$exec");

		M('firewall')->where("port='".$tmp[1]."'")->setField('port',$port);
		returnJson(true, 'Successfully modified');
	}

	returnJson(false, 'fail to edit!');
}

if(isset($_GET['action'])){
	$_GET['action']();
	exit;
}

$file = '/www/server/pure-ftpd/etc/pure-ftpd.conf';
$conf = file_get_contents($file);
$rep = "/^#? *Bind\s+[0-9]+\.[0-9]+\.[0-9]+\.+[0-9]+,([0-9]+)/m";
preg_match($rep,$conf,$tmp);
$_SESSION['port'] = $tmp[1];

require './public/head.html';
require './public/menu.html';
require './public/ftp.html';
require './public/footer.html';
?>
