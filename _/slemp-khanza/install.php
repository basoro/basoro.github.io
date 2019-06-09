<?php

include_once './Common.php';

function checkInstall(){
	$status = M('config')->where("id=1")->getField('status');
	if($status == '1'){
		$_SESSION['status'] = 1;
		header("Location: login.php");
		exit;
	}
}

function Install(){
	checkInstall();
	if($_SESSION['status'] == 1 && isset($_SESSION['system']) == false) return;

	$root = I('root');
	$backup_path = I('backup_path');
	$sites_path = I('sites_path');
	$sql = M('config');
	$where = "id=1";
	$data = array(
		'mysql_root'	=>	$root,
		'backup_path'	=>	$backup_path,
		'sites_path'	=>	$sites_path
	);

	$sql->where($where)->save($data);

	$username = I('bt_username');
	$password1 = I('bt_password1');
	$password2 = I('bt_password2');

	if($username == '' || $password1 == ''){
		header("Content-type: text/html; charset=utf-8");
		exit('Username or password cannot be empty!');
	}

	if($password1 != $password2){
		header("Content-type: text/html; charset=utf-8");
		exit('The passwords entered twice do not match, please re-enter!');
	}

	$data = array(
		'username'	=>	$username,
		'password'	=>	md5($password1)
	);

	M('user')->where($where)->save($data);

	$sql->where($where)->setField('status',1);
	$_SESSION['status'] = 1;
	unset($_SESSION['system']);
	$itype = '';
}
checkInstall();

if(isset($_GET['action'])){
	$_GET['action']();
}

if($_SESSION['status'] != 1 || isset($_SESSION['system']) == true) {
	$config = M('config')->where('id=1')->find();
	$user = M('user')->where('id=1')->find();
	$_SESSION['status'] = 0;

	if($config['mysql_root'] == '') {
		$config['mysql_root'] = trim(file_get_contents('/www/server/mysql/default.pl'));
	}
}


?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="robots" content="noindex,nofollow">
		<title>Initialize Panel Setup</title>
		<link href="public/css/install.css" rel="stylesheet">
		<script type="text/javascript" src="public/js/jquery.js"></script>
	</head>
	<body>
		<div class="main">
		<?php if($_SESSION['status'] != 1){ ?>
		<div class="warp">
			<div class="title"><?php echo $_SESSION['panel_name']; ?></div>
			<form class="form" action="/install.php?action=Install" method="post">
				<fieldset>
					<legend>Administrator settings</legend>
					<p><span class="tit">Username</span><input type="text" name="bt_username" value="<?php echo $user['username']; ?>" /> *Please set the administrator username</p>
					<p><span class="tit">Password</span><input type="password" name="bt_password1" value="" /> *Please set the administrator password</p>
					<p><span class="tit">Repeat Password </span><input type="password" name="bt_password2" value="" /> *Enter the administrator password again</p>
				</fieldset>
				<fieldset style="display: none;">
					<legend>Path setting</legend>
					<p><span class="tit">Backup file path</span><input type="text" name="backup_path" value="<?php echo $config['backup_path']; ?>"/> *Site and database packaging backup file storage path</p>
					<p><span class="tit">Site creation path</span><input type="text" name="sites_path" value="<?php echo $config['sites_path']; ?>"/> *Site and default path</p>
				</fieldset>
				<fieldset style="display: none;">
					<legend>MySQL</legend>
					<p><span class="tit">Root password</span><input class='text' name='root' value='<?php echo $config['mysql_root']; ?>'> MySQL database management password</p>
				</fieldset>
				<input class="submit-btn" type="submit" value="Save" />
			</form>
		</div>
		<?php }else{ ?>
		<div class="success">
		<p>Ataaka panel initialized successfully</p>
		<a href="login.php">Login page</a>
		</div>
		<?php } ?>
		</div>
		<div class="copyright">Copyright © 2018 - <?php echo date('Y'); ?>  <a style="color:#3498DB;" href="https://ataaka.basoro.id" target="_blank">Ataaka</a>. All Rights Reserved</div>
		<script>
			var main = $(".main");
			$(window).resize(function () {
			  var wh = $(window).height();
			  main.height(wh);
			}).resize();
		</script>
	</body>
</html>
