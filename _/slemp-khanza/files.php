<?php

require './Common.php';

function UploadFile(){
	set_time_limit(0);
	if($_FILES["zunfile"]["error"] > 0)	returnJson(false, $_FILES["file"]["error"]);
	$dirName = $_GET['path'];
	if(!file_exists($dirName)) SendSocket("FileAdmin|AddDir|".$dirName);
	$fileName = $dirName.$_FILES['zunfile']['name'];
	$result = SendSocket("FileAdmin|MvDirOrFile|".$_FILES['zunfile']['tmp_name'].'|'.$fileName);
	if($result['status']) WriteLogs("Document management", "upload files [$fileName] success!");
	set_time_limit(300);
	returnSocket($result);
}

function CreateFile() {
	$file =  $_POST['file'];
	$result = SendSocket("FileAdmin|AddFile|" . $file);
	if($result['status']) WriteLogs("Document management", "Create a file [$file] success!");
	ajax_return($result);
}

function CreateDir() {
	$dir = $_POST['dir'];
	$result = SendSocket("FileAdmin|AddDir|" . $dir);
	if($result['status']) WriteLogs("Document management", "Create a directory [$dir] success!");
	ajax_return($result);
}

function DeleteDir() {
	$dir = $_POST['dir'];
	if(checkDir($dir))returnJson(false,'Please don\'t die!');
	$result = SendSocket("FileAdmin|DelDir|" . $dir);
	if($result['status']) WriteLogs("Document management", "Delete directory [$dir] success!");
	ajax_return($result);
}

function DeleteFile() {
	$file = I('file');
	if(strpos($file,'.user.ini')) SendSocket("ExecShell|chattr -i ".$file);
	$result = SendSocket("FileAdmin|DelFile|" . $file);
	if($result['status']) WriteLogs("Document management", "Delete files [$file] success!");
	ajax_return($result);
}

function CopyFile() {
	$sfile = I('sfile');
	$dfile = I('dfile');
	$result = SendSocket("ExecShell|\\cp -r -a $sfile $dfile");
	if(strpos($dfile,$_SESSION['config']['sites_path']) !== false){
		SendSocket("FileAdmin|ChownFile|" . $dfile . '|www');
	}
	if($result['status']) WriteLogs("Document management", "Copy file [$sfile] to [$dfile] success!");
	ajax_return($result);
}

function MvFile() {
	$sfile = I('sfile');
	$dfile = I('dfile');
	CheckDirMV($dfile);
	$result = SendSocket("FileAdmin|MvDirOrFile|" . $sfile . '|' . $dfile);
	if($result['status']) WriteLogs("Document management", "Moving files [$sfile] to [$dfile] success!");
	ajax_return($result);
}

function CheckDirMV($dfile){
	if(file_exists($dfile)){
		if(is_dir($dfile)){
			$mdir = dir($dfile);
			$n=0;
			while($mfile = $mdir->read()){
				$n++;
			}
			if($n <= 2){
				SendSocket("FileAdmin|DelDir|". $dfile);
			}else{
				returnJson(false, 'Target directory already exists!');
			}
		}
	}
}

function GetFileBody() {
	$file = I('file');
    $result['status'] = false;
	$body = file_get_contents($file);
    if($body !== false){
         $result['status'] = true;
    }

	$encoding = mb_detect_encoding($body, array("UTF-8","GBK","BIG5","GB2312","CP936","EUC-CN"));

	if($encoding !== 'UTF-8'){
		$body = mb_convert_encoding($body,'UTF-8',$encoding);
	}

    $result['data'] = $body;
    $tmp =  json_decode(json_encode($result),1);
	$tmp['encoding'] = $encoding;
    ajax_return($tmp);
}

function SaveFileBody() {
	$file = I('file');
	if($_POST['data'] == '')$_POST['data'] = ' ';

	$data = str_replace('(__bt@cn__)','+',$_POST['data']);
	if(version_compare(PHP_VERSION,'5.4.0','<')) $data = str_replace("\\'","'",str_replace("\\\\","\\", str_replace("\\\"","\"",$data)));

	if(empty($_POST['encoding'])) $_POST['encoding'] = 'UTF-8';

	if($_POST['encoding'] != 'UTF-8'){
		$data = mb_convert_encoding($data,$_POST['encoding'],'UTF-8');
	}

	if (file_put_contents('/tmp/read.tmp', $data)) {
		$isUserINI = false;
		if(strpos($file,'.user.ini') !== false){
			$isUserINI = true;
			SendSocket("ExecShell|chattr -i ".$file);
		}

		$isConf = strpos($file,($_SESSION['server_type'] == 'nginx'?'nginx':'').'/conf');
		SendSocket('ExecShell|\\cp -a '.$file.' /tmp/backup.conf');
		$result = SendSocket("FileAdmin|SaveFile|" . $file);
		if($isConf) {

			if($_SESSION['server_type'] == 'nginx'){
				$isError = checkNginxConf();
			}


			if($isError !== true){
				SendSocket('ExecShell|\\cp -a /tmp/backup.conf '.$file);
				SendSocket("FileAdmin|ChmodFile|" . $file . '|root');
				returnJson(false,'Configuration file error: <br><a style="color:red;">'.str_replace("\n",'<br>',$isError).'</a>');
			}
		}

		if($isUserINI){
			SendSocket("ExecShell|chmod 644 $file");
			SendSocket("ExecShell|chown root.root $file");
			SendSocket("ExecShell|chattr +i ".$file);
		}

		if($result['status']) WriteLogs("Document management", "Edit file [$file] successfully saved!");
		ajax_return($result);
	}
	ajax_return(array('status' => false, 'msg' => 'Failed to transfer file!'));
}

function Zip() {
	$sfile = I('sfile');
	$dfile = I('dfile');
	$type = trim(I('type'));
	if(checkDir($sfile)) returnJson(false, 'Cannot compress system key directories!');
	if(!isset($type)) returnJson(false, 'The parameter is incorrect!');
	$result = SendSocket("FileAdmin|ZipFile|" . $sfile . '|' . $dfile . '|' . $type);
	if($result['status']) WriteLogs("Document management", "Compressed directory [$sfile] to [$dfile] success!");
	ajax_return($result);
}

function UnZip() {
	$sfile = I('sfile');
	$dfile = I('dfile');
	$type = trim(I('type'));
	if(!isset($type)) returnJson(false, 'The parameter is incorrect');
	$result = SendSocket("FileAdmin|UnZipFile|" . $sfile . '|' . $dfile . '|' . $type);
	if($result['status']) WriteLogs("Document management", "Unzip files [$sfile] to [$dfile] success!");
	ajax_return($result);
}

function GetFileAccess(){
	$fileName = I('filename');
	$own = posix_getpwuid(fileowner($fileName));
	$fileInfo['chown'] = $own['name'];

	$perms = fileperms($fileName);
	$fileInfo['chmod'] = '';

	$num = 0;
	$num += ($perms & 0x0100)?4:0;
	$num += ($perms & 0x0080)?2:0;
	$num += ($perms & 0x0040)?1:0;
	$fileInfo['chmod'] .= $num;
	$num = 0;
	$num += ($perms & 0x0020)?4:0;
	$num += ($perms & 0x0010)?2:0;
	$num += ($perms & 0x0008)?1:0;
	$fileInfo['chmod'] .= $num;
	$num = 0;
	$num += ($perms & 0x0004)?4:0;
	$num += ($perms & 0x0002)?2:0;
	$num += ($perms & 0x0001)?1:0;
	$fileInfo['chmod'] .= $num;
	if($fileInfo['chmod'] == '000'){
		$fileInfo['chmod'] = '755';
		$fileInfo['chown'] = 'www';
	}
	ajax_return($fileInfo);
}

function SetFileAccess(){
	$file = I('filename');
	$user = I('user');
	$access = I('access');
	$result = SendSocket("FileAdmin|ChownFile|" . $file . '|' . $user);
	$result = SendSocket("FileAdmin|ChmodFile|" . $file . '|' . $access);
	WriteLogs("Document management", "Setting file [".$file."] successful permission!");
	ajax_return($result);
}

function GetFileBytes(){
	$file = I('file');
	if($file == 'qiniu'){
		$name = I('name');
		SendSocket("ExecShell|python backup_qiniu.py download $name|/www/server/cloud",30,30);
		$tmp = explode('http', file_get_contents('/tmp/shell_temp.pl'));
		if(count($tmp) > 1){
			$data = 'http'.trim($tmp[1]);
		}else{
			$data = trim($tmp[0]);
		}
		$url = trim(str_replace(' ','',str_replace('"',"",$data)));
		header("Location: $url");
		exit;
	}

	if(!file_exists($file)) exit('Error: The specified file does not exist!');
	$fileInfo = pathinfo($file);
	$myFile = fopen($file, 'rb');
	$size = filesize($file);
	$type = isImageFile($fileInfo['extension']);

	set_time_limit(0);
	header("Content-Disposition: attachment; filename=" . iconv('utf-8','gb2312',$fileInfo['basename']));
	header("Accept-Ranges: bytes");
	header("Content-Length: ".$size);
	if($type != false){
		ob_clean();
		header('Content-type: '.$type);
	}else{
		if(isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])){
		  header("HTTP/1.1 304 Not Modified");
		  exit;
		}
		$sTime = 60*60;
		header("Cache-Control: private, max-age=".$sTime.", pre-check=".$sTime);
		header("Pragma: private");
		header('Expires:'. preg_replace('/.{5}$/', 'GMT', gmdate('r', time()+ $sTime)));
		header('Last-Modified: ' . preg_replace('/.{5}$/', 'GMT', gmdate('r', $sTime)));
		header('Content-type: application/octet-stream');
	}

	$n = 4096;
	while($eopt = fread($myFile, $n)){
		echo $eopt;
		$n += 4096;
	}
	fclose($myFile);
	set_time_limit(300);

}

function isImageFile($ext){
	$exts = array('jpg','jpeg','png','bmp','gif','tiff');
	foreach($exts as $value){
		if($value == $ext){
			return 'image/'.$ext;
		}
	}
	return false;
}

function checkDir($path){
	$dirs = array('/','/*', '/www', '/root', '/boot', '/bin', '/etc', '/home', '/dev', '/sbin', '/var', '/usr', '/tmp', '/sys',
	 '/proc', '/media', '/mnt', '/opt', '/lib', '/srv', 'selinux','/www/server','/www/wwwroot','/www/backup','/www/wwwroot/default');
	return in_array($path, $dirs);
}

function DownloadFile(){
	$url = urldecode($_POST['url']);
	$fileName = I('path');
	$result = SendSocket("DownloadFile|$url|$fileName");
	ajax_return($result);
}

function ExecShell(){
	$exec = trim(I('exec'));
	$path = trim(I('path'));
	$zs = array('rm -rf /','rm -rf /*','rm -rf /boot','rm -rf /usr','rm -rf /var','rm -rf /www');
	if(in_array($exec,$zs)) returnJson(false,'Please don\'t die!');
	$result = SendSocket("ExecShell|$exec|$path");
	ajax_return($result);
}

function GetShellEcho(){
	$tmp = '/tmp/shell_temp.pl';
	if(!file_exists($tmp))ajax_return('error');
	$str = file_get_contents($tmp);
	ajax_return($str);
}

function SetBatchData(){
	switch(intval($_POST['type'])){
		case 1:
			$_SESSION['selected'] = $_POST;
			$msg = 'Marked successfully, please click the paste all button in the target directory.!';
			break;
		case 2:
			$_SESSION['selected'] = $_POST;
			$msg = 'Marked successfully, please click the paste all button in the target directory.!';
			break;
		case 3:
			$user = $_POST['user'];
			$access = $_POST['access'];
			foreach($_POST['data'] as $value){
				$file = $_POST['path'].'/'.$value;
				SendSocket("FileAdmin|ChownFile|" . $file . '|' . $user);
				SendSocket("FileAdmin|ChmodFile|" . $file . '|' . $access);
			}
			WriteLogs("Document management", "From [".$_POST['path']."] batch setting permissions succeeded!");
			$msg = 'Successful setup';
		break;
		case 4:
			foreach($_POST['data'] as $value){
				$file = $_POST['path'].'/'.$value;
				if(is_dir($file)){
					if(checkDir($file)) continue;
					SendSocket("FileAdmin|DelDir|".$file);
				}else{
					SendSocket("FileAdmin|DelFile|".$file);
				}
			}
			WriteLogs("Document management", "From [".$_POST['path']."] delete files successfully in batches!");
			$msg = 'Successfully deleted';
		break;
	}
	returnJson(true,$msg);
}

function BatchPaste(){
	$i = 0;
	switch(intval($_POST['type'])){
		case 1:
			foreach($_SESSION['selected']['data'] as $value){
				$i++;
				$sfile = $_SESSION['selected']['path'].'/'.$value;
				$dfile = $_POST['path'].'/'.$value;
				SendSocket("ExecShell|\\cp -r -a $sfile $dfile");
				if(strpos($dfile,$_SESSION['config']['sites_path']) !== false){
					SendSocket("FileAdmin|ChownFile|" . $dfile . '|www');
				}
			}
			$errorCount = count($_SESSION['selected']['data']) - $i;
			WriteLogs("Document management", "From [$sfile] bulk copy to [$dfile] success!");
			break;
		case 2:
			foreach($_SESSION['selected']['data'] as $value){
				$sfile = $_SESSION['selected']['path'].'/'.$value;
				$dfile = $_POST['path'].'/'.$value;
				CheckDirMV($dfile);
                SendSocket("FileAdmin|MvDirOrFile|" . $sfile . '|' . $dfile);
				$i++;
			}
			$errorCount = count($_SESSION['selected']['data']) - $i;
			WriteLogs("Document management", "From [$sfile] move to batch [$dfile] success![".$i.'], failure ['.(count($_SESSION['selected']['data']) - $i).']');
            break;
	}
	unset($_SESSION['selected']);
	returnJson(true,'Batch operation succeeded ['.$i.'], failure ['.$errorCount.']');
}

if (isset($_GET['action'])) {
	$key = array('file', 'dir', 'sfile', 'dfile', 'path', 'user', 'type');
	foreach ($key as $k) {
		if (isset($_POST[$k])) {
			$_POST[$k] = trim(str_replace('//', '/', $_POST[$k]));
		}
	}

	$_GET['action']();
	exit ;
}

require './public/head.html';
require './public/menu.html';
require './public/files.html';
require './public/footer.html';
?>
