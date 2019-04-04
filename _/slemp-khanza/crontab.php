<?php
require './Common.php';
//Take a list of scheduled tasks
function GetCrontab(){
	checkBackup();
	$data = M('crontab')->order("addtime desc")->select();

	for($i=0;$i<count($data);$i++){

		switch($data[$i]['type']){
			case 'day':
				$data[$i]['type'] = "every day";
				$data[$i]['cycle'] = 'every day, '.$data[$i]['where_hour'].'point'.$data[$i]['where_minute'].'Execution';
				break;
			case 'day-n':
				$data[$i]['type'] = "each".$data[$i]['where1'].'day';
				$data[$i]['cycle'] = 'Every'.$data[$i]['where1'].'day '.$data[$i]['where_hour'].'point'.$data[$i]['where_minute'].'Execution';
				break;
			case 'hour':
				$data[$i]['type'] = "per hour";
				$data[$i]['cycle'] = 'per hour, First'.$data[$i]['where_minute'].'Minute execution';
				break;
			case 'hour-n':
				$data[$i]['type'] = "each".$data[$i]['where1'].'hour';
				$data[$i]['cycle'] = 'Every'.$data[$i]['where1'].'Hour'.$data[$i]['where_minute'].'Minute execution';
				break;
			case 'minute-n':
				$data[$i]['type'] = "each".$data[$i]['where1'].'minute';
				$data[$i]['cycle'] = 'Every'.$data[$i]['where1'].'Minute execution';
				break;
			case 'week':
				$data[$i]['type'] = "weekly";
				$data[$i]['cycle'] = 'weekly'.toWeek($data[$i]['where1']).', '.$data[$i]['where_hour'].'point'.$data[$i]['where_minute'].'Execution';
				break;
			case 'month':
				$data[$i]['type'] = "per month";
				$data[$i]['cycle'] = 'per month, '.$data[$i]['where1'].'day '.$data[$i]['where_hour'].'point'.$data[$i]['where_minute'].'Execution';
				break;
		}
	}

	return $data;
}

//Check the environment
function checkBackup(){

	//Check if the table exists
	$count = SqlQuery("select COUNT(TABLE_NAME) from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='bt_default' and TABLE_NAME='bt_crontab'");
	if(intval($count['COUNT(TABLE_NAME)']) == 0){
		$sql = "CREATE TABLE bt_default.bt_crontab(
					`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
					`name` varchar(64) DEFAULT '' COMMENT 'mission name',
					`type` varchar(24) DEFAULT '' COMMENT 'Task type',
					`where1` varchar(24) DEFAULT '' COMMENT 'Condition 1',
					`where_hour` int(4) DEFAULT 0 COMMENT 'hour',
					`where_minute` int(4) DEFAULT 0 COMMENT 'minute',
					`echo` varchar(32) DEFAULT '' COMMENT 'Output tag',
					`addtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'add time',
					PRIMARY KEY (`id`),INDEX(`name`)
				)
				ENGINE=MyISAM DEFAULT CHARSET=utf8";
		SqlExec($sql);
	}

	//Check if the backup script exists
	if(!file_exists('/www/server/cloud/backup')){
		$file = '/www/server/cloud/backup';
		$backup = file_get_contents('https://basoro.id/downloads/backup.sh');
		file_put_contents('/tmp/read.tmp',$backup);
		SendSocket("FileAdmin|SaveFile|$file");
		SetAccess($file);
	}

	//Check if the log cutting script exists
	if(!file_exists('/www/server/cloud/logsBackup')){
		$file = '/www/server/cloud/logsBackup';
		$backup = file_get_contents('https://basoro.id/downloads/logsBackup');
		file_put_contents('/tmp/read.tmp',$backup);
		SendSocket("FileAdmin|SaveFile|$file");
		SetAccess($file);
	}

	//Check scheduled task service status
	SendSocket("ExecShell|service crond status");
	$result = trim(file_get_contents('/tmp/shell_temp.pl'));
	if(strpos($result,'running') === false) SendSocket("ExecShell|service crond start");

}

//Convert uppercase weeks
function toWeek($num){
	switch($num){
		case '0':
			return 'day';
		case '1':
			return 'One';
		case '2':
			return 'two';
		case '3':
			return 'three';
		case '4':
			return 'four';
		case '5':
			return 'Fives';
		case '6':
			return 'six';
	}
}

//Add a scheduled task
function AddCrontab(){
	if(empty($_POST['name'])) returnMsg(false, 'Task name cannot be empty!');
	$type = I('type');
	switch($type){
		case 'day':
			$cuonConfig = GetDay();
			$name = "every day";
			break;
		case 'day-n':
			$cuonConfig = GetDay_N();
			$name = "each ".I('where1')." day";
			break;
		case 'hour':
			$cuonConfig = GetHour();
			$name = "per hour";
			break;
		case 'hour-n':
			$cuonConfig = GetHour_N();
			$name = "per hour";
			break;
		case 'minute-n':
			$cuonConfig = Minute_N();
			break;
		case 'week':
			$_POST['where1'] = I('week');
			$cuonConfig = Week();
			break;
		case 'month':
			$cuonConfig = Month();
			break;
	}

	$cronPath = '/www/server/cron';
	$cronName = GetShell();
	$cuonConfig .= $cronPath.'/'.$cronName.' >> '.$cronPath.'/'.$cronName.'.log 2>&1';
	WriteShell($cuonConfig);
	CrondReload();
	$data = array(
		'name'	=>	I('name'),
		'type'	=>	$type,
		'where1' =>	I('where1'),
		'where_hour' =>	I('hour','','intval'),
		'where_minute' =>	I('minute','','intval'),
		'echo'	=>	$cronName
	);

	if(M('crontab')->add($data)){
		WriteLogs('Scheduled Tasks', 'Add a scheduled task ['.$data['name'].'] success!');
		returnMsg(true, 'Added successfully!');
	}

	returnMsg(false, 'add failed!');
}

//Take a list of data
function GetDataList(){
	$type = I('type');
	$data = M($type)->field('name,ps')->select();
	ajax_return($data);
}

//Write a message
function returnMsg($status,$msg){
	$_SESSION['crontab']['status'] = $status?'true':'false';
	$_SESSION['crontab']['msg'] = $msg;
	header("Location: crontab.php");
	exit;
}

//Task log
function GetLogs(){
	$id = I('id','','intval');
	$echo = M('crontab')->where("id=$id")->getField('echo');
	$logFile = '/www/server/cron/'.$echo.'.log';
	if(!file_exists($logFile)) returnJson(false, 'The current task log is empty!');
	$log = file_get_contents($logFile);
	$where = "Warning: Using a password on the command line interface can be insecure.\n";
	if(strpos($log, $where) !== false){
		$log = str_replace($where, '', $log);
		file_put_contents('/tmp/read.tmp',$log);
		SendSocket("FileAdmin|SaveFile|". $logFile);
	}

	returnJson(true, $log);
}

//Clean up the task log
function DelLogs(){
	$id = I('id','','intval');
	$echo = M('crontab')->where("id=$id")->getField('echo');
	$logFile = '/www/server/cron/'.$echo.'.log';
	SendSocket("FileAdmin|DelFile|".$logFile);
	returnJson(true, 'Log has been emptied!');
}

//Delete scheduled task
function DelCrontab(){
	$id = I('id');
	$find = M('crontab')->where("id=$id")->find();
	$file = '/var/spool/cron/root';
	SendSocket("FileAdmin|ReadFile|" . $file);
	$conf = file_get_contents('/tmp/read.tmp');
	$rep = "/\n.+".$find['echo'].".+\n/";
	$conf = preg_replace($rep, "\n", $conf);
	file_put_contents('/tmp/read.tmp',$conf);
	$cronPath = '/www/server/cron';
	$result = SendSocket("FileAdmin|SaveFile|". $file);
	if($result['status']){
		SendSocket("FileAdmin|ChmodFile|" . $file . '|600');
		SendSocket("FileAdmin|DelFile|".$cronPath.'/'.$find['echo']);
		SendSocket("FileAdmin|DelFile|".$cronPath.'/'.$find['echo'].'.log');
		CrondReload();
		M('crontab')->where("id=$id")->delete();
		WriteLogs('Scheduled Tasks', 'Delete scheduled task ['.$find['name'].'] success!');
		returnMsg(true, 'successfully deleted!');
	}
	returnMsg(false, 'Write configuration to scheduled task failed!');
}

//Overload configuration
function CrondReload(){
	SendSocket("ExecShell|/etc/rc.d/init.d/crond reload");
}

//Take the task structure Day
function GetDay(){
	$hour = I('hour');
	$minute = I('minute');
	$cuonConfig = "$minute $hour * * * ";
	return $cuonConfig;
}

//Take the task structure Day-n
function GetDay_N(){
	$hour = I('hour');
	$minute = I('minute');
	$day = I('where1');
	$cuonConfig = "$minute $hour */$day * * ";
	return $cuonConfig;
}

//Take the task to construct Hour
function GetHour(){
	$minute = I('minute');
	$cuonConfig = "$minute * * * * ";
	return $cuonConfig;
}

//Take the task to construct Hour-N
function GetHour_N(){
	$minute = I('minute');
	$hour = I('where1');
	$cuonConfig = "$minute */$hour * * * ";
	return $cuonConfig;
}

//Take the task to construct Minute-N
function Minute_N(){
	$minute = I('where1');
	$cuonConfig = "*/$minute * * * * ";
	return $cuonConfig;
}

//Take the task structure week
function Week(){
	$week = I('week');
	$minute = I('minute');
	$hour = I('hour');
	$cuonConfig = "$minute $hour * * $week ";
	return $cuonConfig;
}

//Take the task to construct Month
function Month(){
	$where1 = I('where1');
	$minute = I('minute');
	$hour = I('hour');
	$cuonConfig = "$minute $hour $where1 * * ";
	return $cuonConfig;
}

//Take execution script
function GetShell(){
	$type = I('sType');
	if($_POST['backupTo'] == 'qiniu'){
		if(file_exists('/usr/lib/python2.6/site-packages/qiniu/auth.py') == false && file_exists('/usr/lib/python2.7/site-packages/qiniu/auth.py') == false) returnMsg(false, '请先到[面板设置]中安装七牛云存储插件!');
	}

	if($type == 'toFile'){
		$sfile = I('sFile');
		if($_FILES["sFile"]["error"] > 0)	returnMsg(false, $_FILES["sFile"]["error"]);
		$shell = file_get_contents($_FILES['sFile']['tmp_name']);
		SendSocket("FileAdmin|DelFile|". $_FILES['sFile']['tmp_name']);
	}else{
		$head = "#!/bin/bash\nPATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin\nexport PATH\n";
		switch($type){
			case 'site':
				if($_POST['backupTo'] == 'qiniu'){
					$shell = $head."/www/server/cloud/backup_qiniu site ".I('sName')." ".I('save');
				}else{
					$shell = $head."/www/server/cloud/backup site ".I('sName')." ".I('save');
				}

				break;
			case 'database':
				if($_POST['backupTo'] == 'qiniu'){
					$shell = $head."/www/server/cloud/backup_qiniu database ".I('sName')." ".I('save');
				}else{
					$shell = $head."/www/server/cloud/backup database ".I('sName')." ".I('save');
				}
				break;
			case 'logs':
				$shell = $head."/www/server/cloud/logsBackup ".I('sName').($_SESSION['server_type']=='nginx'?'.log':'-access_log')." ".I('save');
				break;
			default:
				$shell = $head.$_POST['sBody'];
		}

	}

	$cronPath = '/www/server/cron';
	if(!file_exists($cronPath)) SendSocket("FileAdmin|AddDir|" . $cronPath);
	file_put_contents('/tmp/read.tmp',$shell);
	$cronName = md5(md5(time().'_bt'.rand(10000, 1000000)));
	$file = $cronPath.'/'.$cronName;
	$result = SendSocket("FileAdmin|SaveFile|". $file);
	if($result['status']){
		SetAccess($file);
		return $cronName;
	}
	returnMsg(false, 'Write script failed!');
}

//Set permissions for the specified file
function SetAccess($sfile){
	SendSocket("FileAdmin|ChownFile|" . $sfile . '|root');
	SendSocket("FileAdmin|ChmodFile|" . $sfile . '|755');
}

//Write the shell script to a file
function WriteShell($config){
	$file = '/var/spool/cron/root';
	SendSocket("FileAdmin|AddFile|" . $file);
	SendSocket("FileAdmin|ReadFile|" . $file);
	$conf = file_get_contents('/tmp/read.tmp');
	$conf .= $config."\n";
	if(file_put_contents('/tmp/read.tmp',$conf)){
		SendSocket("FileAdmin|SaveFile|". $file);
		SendSocket("FileAdmin|ChmodFile|" . $file . '|600');
		SendSocket("FileAdmin|ChownFile|" . $file . '|root');
		return true;
	}
	returnMsg(false, 'Write configuration to scheduled task failed!');
}

//Interface action
if(isset($_GET['action'])){
	$_GET['action']();
	exit;
}


$cronData = GetCrontab();


//Includes head and menu
require './public/head.html';
require './public/menu.html';
require './public/crontab.html';
require './public/footer.html';
?>
