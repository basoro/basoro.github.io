<?php
require './Common.php';

function SetFirewallStatus(){
	$status = I('status','','intval');
	$result = SendSocket("Firewall|status|".$status);
	ajax_return($result);
}

function AddAcceptPort(){
	$port = I('port','','intval');
	$ps = I('ps');
	$sql = M('firewall');
	if($sql->where("port='$port'")->getCount() > 0){
		ajax_return(array('status'=>false,'msg'=>'The port you want to release already exists, no need to repeat the release!'));
	}

	$result = SendSocket("Firewall|AddFireWallPort|".$port."|TCP|".$ps);
	if($result['status'] == 'true'){
		WriteLogs("Firewall management", 'Release port ['.$port.'] success!');
		$data = array('port'=>$port,'ps'=>$ps,'addtime'=>date('Y-m-d H:i:s'));
		$sql->add($data);
	}
	ajax_return($result);
}

function DelAcceptPort(){
	$port = I('port','','intval');
	$id = I('id','','intval');

	$result = SendSocket("Firewall|DelFireWallPort|".$port.'||');
	if($result['status']){
		WriteLogs("Firewall management", 'Shielded port ['.$port.'] success!');
		M('firewall')->where("id='$id'")->delete();
	}
	ajax_return($result);
}

function SetSshStatus(){
	$version = file_get_contents('/etc/redhat-release');
	if(intval($_GET['status'])==1){
		$msg = 'SSH service has been disabled';
		$act = 'stop';
	}else{
		$msg = 'SSH service has started';
		$act = 'start';
	}
	if(strpos($version,' 7.')){
		$ret = SendSocket("ExecShell|systemctl {$act} sshd.service");
	}else{
		$ret = SendSocket("ExecShell|service sshd ".$act);
	}

	if($ret['status']){

		WriteLogs("Firewall management", $msg);
		ajax_return(array('status'=>true,'msg'=>$msg));
	}else{
		ajax_return(array('status'=>false,'msg'=>'Operation failed, unknown mistake'));
	}
}

function SetPing(){
	if($_GET['st'] != 1){
		$ret = SendSocket('Firewall|OffPing');
		$in_ping = 'false';
	}else{
		$ret = SendSocket('Firewall|NoPing');
		$in_ping = 'true';
	}
	if($ret['status'] == 'true'){
		M('config')->where("id=1")->setField('ping',$in_ping);
		$_SESSION['config']['ping'] = $in_ping;
		WriteLogs("Firewall management", (($_GET['st']!=1)?'Setting':'Cancel')."Forbidden Ping successfully!");
		ajax_return(true);
	}else{
		WriteLogs("Firewall management", (($_GET['st']!=1)?'Setting':'Cancel')."Forbidden Ping failed!");
		ajax_return(false);
	}
}

function SetSshPort(){
	$port = trim(I('port'));
	if($port < 22 || $port > 65535)ajax_return(false);

	$file = '/etc/ssh/sshd_config';
	SendSocket("FileAdmin|ReadFile|" . $file);
	$conf = file_get_contents('/tmp/read.tmp');

	$rep = "/#*Port\s+([0-9]+)\s*\n/";
	$conf = preg_replace($rep, "Port $port\n", $conf);
	file_put_contents('/tmp/read.tmp',$conf);
	$ret = SendSocket("FileAdmin|SaveFile|". $file);

	if($ret['status']){
		SendSocket("FileAdmin|ChmodFile|" . $file . '|600');
		SendSocket("FileAdmin|ChownFile|" . $file . '|root');
		SendSocket("Firewall|AddFireWallPort|$port|TCP|ssh");
		SendSocket("ExecShell|service sshd restart");
		M('firewall')->where("ps='SSH remote management service'")->setField('port',$port);
		WriteLogs("Firewall management", "Change the SSH port to [$port] success!");
		ajax_return(true);
	}else{
		WriteLogs("Firewall management", "Change the SSH port to [$port] failure!");
		ajax_return(false);
	}
}

if(isset($_GET['action'])){
	$_GET['action']();
	exit;
}
$ssh = SendSocket('Testing|mstsc');

require './public/head.html';
require './public/menu.html';
require './public/firewall.html';
require './public/footer.html';
?>
