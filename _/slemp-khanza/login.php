<?php
include_once './Common.php';
@session_start();
$_SESSION['error_count'] = isset($_SESSION['error_count'])? $_SESSION['error_count']:0;
if(isset($_GET['dologin'])) dologin();
if(isset($_POST['username'])) login();

function login(){
	$tmp = @file_get_contents('./conf/breakIp.conf');
	$breakIp = explode('|',$tmp);
	$ip = get_client_ip();
	if($ip == $breakIp[0] && (time() - $breakIp[1]) < 600){
		header("Content-type: text/html; charset=utf-8");
		exit('You failed to log in multiple times, forbidden to log in for 10 minutes.!');
	}

	if($_SESSION['error_count'] > 6){
		file_put_contents('./conf/breakIp.conf', $ip.'|'.time());
		$_SESSION['error_count'] = 4;
	}

	if($_SESSION['error_count'] > 3){
		include_once './class/Code.class.php';
		if(Code::check($_POST['code']) == false){
			$_SESSION['error'] = "Please enter correct verify code!";
			$_SESSION['error_count']++;
			unset($_POST['username']);
			return;
		}
	}

	if(isset($_POST['username']) && isset($_POST['password']))
	{
		$sql = M('user');
		$ip = get_client_ip();

		$username = I('username');
		$password = md5(trim(I('password')));

		$tmp =  $sql->query('SELECT username,password FROM bt_user WHERE id=:id', array('id'=>1));
		$isLogin = $tmp[0];

		if($password != $isLogin['password'] || $username != $isLogin['username']) $isLogin = false;
		if($isLogin){
			$login_temp = './conf/login.temp';
			$login_logs = file_get_contents($login_temp);
			if(!$login_logs) $login_logs = '';
			file_put_contents($login_temp, $ip.'|'.$login_logs.time().',');

			$param  = array('login_ip'=>$ip,'login_time'=>date('Y-m-d H:i:s'));
			$sql->execute('UPDATE bt_user SET login_ip=:login_ip,login_time=:login_time', $param);
			$_SESSION['username'] = $isLogin['username'];
			WriteLogs("Landing", "Landed successfully; Login IP:$ip");
			unset($_SESSION['error_count']);
			unset($_SESSION['error']);
			header("Location: /index.php");
			exit;
		}else{
			WriteLogs("Landing", "Login failed; account number:".$isLogin['username'].", password:".I('password').", Login IP:$ip");
			$_SESSION['error'] = "Account or password is incorrect!";
			$_SESSION['error_count']++;
		}
	}
}

function dologin(){
	if(empty($_SESSION['username'])) exit;
	$_SESSION = array();
	if (isset ( $_COOKIE [session_name ()] )) {
		setcookie ( session_name (), '', time () - 1, '/' );
	}
	session_destroy ();
	header("Location: /login.php");
	exit;
}

require './public/login.html';
?>
