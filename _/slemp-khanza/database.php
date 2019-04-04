<?php
require './Common.php';

//Add database
function AddDatabase(){
	$data_name = trim(I('post.name'));
	if($data_name == 'root' || $data_name == 'mysql' || $data_name == 'test' || strlen($data_name) < 3){
		ajax_return(array('status'=>false,'msg'=>'The database name is not legal, or less than 3 characters!'));
	}

	if(strlen($data_name) > 16) returnJson(false, 'Database name cannot be greater than 16 digits');

	$reg = "/^[a-zA-Z]{1}\w+$/";
	if(!preg_match($reg, $data_name)){
		ajax_return(array('status'=>false,'msg'=>'The database name cannot have a special symbol, and the first digit must be a letter'));
	}
	$data_pwd = I('post.password');
	if(!$_POST['password']){
		$data_pwd = substr(md5(time()), 0, 8);
	}
	$sql = M('databases');
	if($sql->where("name='$data_name'")->getCount()) returnJson(false,'The database already exists!');
	$address = trim($_POST['address']);
	$user = 'Yes';
	$username = $data_name;
	$password = $data_pwd;
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
	IsSqlError($result);
	SqlExec("drop user '$username'@'localhost'");
	SqlExec("drop user '$username'@'$address'");
	SqlExec("grant all privileges on ".$data_name.".* to '$username'@'localhost' identified by '$data_pwd'");
	SqlExec("grant all privileges on ".$data_name.".* to '$username'@'$address' identified by '$data_pwd'");
	SqlExec("flush privileges");

	$data 	= array(
			'name'=> $data_name,
			'username' => $username,
			'password' => $password,
			'accept'   => $address,
			'ps' => ($_POST['bak'] == '')?'Fill in the note':$_POST['bak']);
	$sql->add($data);
	WriteLogs("Database management", "Add database [$data_name] success!");
	ajax_return(array('status'=>true,'msg'=>'Added successfully'));
}

//Detect database execution errors
function IsSqlError($str){
	if(strstr($str,"using password:")) returnJson(false,'Database management password error!');
	if(strstr($str,"Connection refused")) returnJson(false,'Database connection failed, please check if the database service is started!');
	if(strstr($str,"1133")) returnJson(false,'Database user does not exist!');
}
//Delete database
function DeleteDatabase(){
	$id=$_GET['id'];
	$name = I('name');
	if($name == 'bt_default') returnJson(false,'Cannot delete the pagoda default database!');
	$accept = M('databases')->where("id='$id'")->getField('accept');
	$result = SqlExec("drop database $name");
	IsSqlError($result);
	SqlExec("drop user '$name'@'localhost'");
	SqlExec("drop user '$name'@'$accept'");
	SqlExec("flush privileges");
	M('databases')->where("id='$id'")->delete();
	WriteLogs("Database management", "Delete database [$name] success!");
	returnJson(true, 'Delete database successfully!');
}

//Set the ROOT password
function SetupPassword(){
	$password = trim(I('password'));
	$rep = "/^[\w#@%]+$/";
	if(!preg_match($rep, $password)) returnJson(false, 'Do not include special characters in the password!');
	$sql = M('config');
	$mysql_root = $sql->where("id=1")->getField('mysql_root');
	$sql->where("id=1")->setField('mysql_root',$password);
	$result = SqlQuery("show databases");
	$msg = 'Successful setup!';
	if(!is_array($result)){
		$sql->where("id=1")->setField('mysql_root',$mysql_root);

		if(strpos(@file_get_contents('/www/server/mysql/version.pl'),'5.7') !== false){
			$result = SqlExec("update mysql.user set authentication_string=password('$password') where User='root'");
		}else{
			$result = SqlExec("update mysql.user set Password=password('$password') where User='root'");
		}
		if(strpos($result,'using password')){
			WriteLogs("Database management", "Failed to set root password, password verification failed!");
			ajax_return(array('status'=>false,'msg'=>'The root password is incorrect. Please re-enter!'));
		}
		SqlExec("flush privileges");
		$msg = 'The ROOT password was successfully modified.!';
	}
	M('config')->where("id=1")->setField('mysql_root',$password);
	WriteLogs("Database management", "Set the root password successfully.!");
	session('mysql_root',$password);
	ajax_return(array('status'=>true,'msg'=>$msg));
}

//Modify user password
function ResDatabasePassword(){
	$newpassword = I('post.password');
	$username = I('post.username');
	if($username == 'bt_default') returnJson(false,'Cannot modify the password of the pagoda database!');
	$id = I('post.id');
	if(strpos(@file_get_contents('/www/server/mysql/version.pl'),'5.7') !== false){
		$result = SqlExec("update mysql.user set authentication_string=password('$newpassword') where User='$username'");
	}else{
		$result = SqlExec("update mysql.user set Password=password('$newpassword') where User='$username'");
	}

	IsSqlError($result);
	if(!$result) returnJson(false,'Fail to edit, Database user does not exist!');
	if(intval($id) > 0){
		M('databases')->where("id='$id'")->setField('password',RCODE($newpassword,'ENCODE'));
	}else{
		M('config')->where("id=1")->setField('mysql_root',$newpassword);
		session('mysql_root',$newpassword);
	}
	SqlExec("flush privileges");
	WriteLogs("Database management", "Modify database user [$username] Password succeeded!");
	returnJson(true,'Modify the database ['.$username.'] password succeeded!');
}

function setMyCnf($action = true){
	$myFile = '/etc/my.cnf';
	$mycnf = file_get_contents($myFile);
	$root = $_SESSION['mysql_root'];
	$pwdConfig = "\n[mysqldump]\nuser=root\npassword=$root";
	$rep = "/\n\[mysqldump\]\nuser=root\npassword=.+/";
	if($action){
		if(strpos($mycnf, $pwdConfig) !== false) return;
		if(strpos($mycnf,"\n[mysqldump]\nuser=root\n") !== false){
			$mycnf = preg_replace($rep, $pwdConfig, $mycnf);
		}else{
			$mycnf .= "\n[mysqldump]\nuser=root\npassword=$root";
		}
	}else{
		$mycnf = preg_replace($rep, '', $mycnf);
	}

	file_put_contents('/tmp/read.tmp', $mycnf);
	SendSocket("FileAdmin|SaveFile|" . $myFile);
	SendSocket("FileAdmin|ChownFile|$myFile|root");
	SendSocket("FileAdmin|ChmodFile|$myFile|644");
}

//Backup
function ToBackup(){
	$id = I('id');
	$where = "id=$id";
	$name = M('databases')->where($where)->getField('name');
	$root = $_SESSION['mysql_root'];
	setMyCnf(true);
	$fileName = $name.'_'.date('Ymd_His').'.sql';
	$backupName = $_SESSION['config']['backup_path'].'/database/'.$fileName;
	if(!file_exists($_SESSION['config']['backup_path'].'/database')) SendSocket("FileAdmin|AddDir|".$data['backup_path'].'/database');
	$exec = "MySQL|backup|$name|$backupName|$root";
	$result = SendSocket($exec);
	$tarName = str_replace('.sql', '.tar.gz', $fileName);
	SendSocket("ExecShell|tar -zcvf $tarName $fileName && rm -f $fileName|".$_SESSION['config']['backup_path'].'/database');
	$backupName = str_replace('.sql', '.tar.gz', $backupName);

	setMyCnf(false);
	if($result['status']){
		$sql = M('backup');
		$data = array(
			'type' => 1,
			'name'	=>	$tarName,
			'pid'	=>	$id,
			'filename'	=>	$backupName,
			'size'	=>	0,
			'addtime'	=>	date('Y-m-d H:i:s'));
		$sql->add($data);
		WriteLogs("Database management", "backup database [$name] success!");
		returnJson(true, 'Backup success!');
	}
	WriteLogs("Database management", "backup database [$name] failure!");
	returnJson(false, 'Backup failed!');
}

//Delete backup file
function DelBackup(){
	$id = I('id');
	$where = "id=$id";
	$filename = M('backup')->where($where)->getField('filename');
	$result = SendSocket("FileAdmin|DelFile|$filename");
	if($result['status'] == true || empty($result['msg']) == true){
		M('backup')->where($where)->delete();
		WriteLogs("Database management", "Delete backup file [$filename] success!");
	}
	$result['msg'] = isset($result['msg'])?$result['msg'] :'file does not exist!';
	returnSocket($result);
}

//Import
function InputSql(){
	$name = I('name');
	$file = I('file');
	$root = $_SESSION['mysql_root'];
	$tmp = explode('.', $file);
	$exts = array('sql','gz','zip');
	$ext = $tmp[count($tmp)-1];
	if(!in_array($ext, $exts)) returnJson(false, 'Please select sql, gz, zip file format!');

	if($ext != 'sql'){
		$tmp = explode('/', $file);
		$tmpFile = $tmp[count($tmp)-1];
		$tmpFile = str_replace('.sql.'.$ext, '.sql', $tmpFile);
		$tmpFile = str_replace('.'.$ext, '.sql', $tmpFile);
		$tmpFile = str_replace('tar.', '', $tmpFile);
		$backupPath = $_SESSION['config']['backup_path'].'/database';
		if($ext == 'zip'){
			SendSocket("ExecShell|unzip $file|".$backupPath);
		}else{
			SendSocket("ExecShell|tar zxf $file|".$backupPath);
			if(!file_exists($backupPath.'/'.$tmpFile)) SendSocket("ExecShell|gunzip -q $file|".$backupPath);
		}

		if(!file_exists($backupPath.'/'.$tmpFile) || $tmpFile == '') returnJson(false, 'file ['.$tmpFile.'] does not exist!');
		$exec = "ExecShell|/www/server/mysql/bin/mysql -uroot -p$root $name < $tmpFile && rm -f $tmpFile|".$backupPath;
		$result = SendSocket($exec);
	}else{
		$result = SendSocket("ExecShell|/www/server/mysql/bin/mysql -uroot -p$root $name < $file");
	}

	if($result['status']) WriteLogs("Database management", "Import database [$name] success!");
	returnSocket($result);
}

//Synchronize the database to the server
function SyncToDatabases(){
	$type = intval($_GET['type']);
	$n = 0;
	$sql = M('databases');
	if($type == 0){
		$data = $sql->field('id,name,username,password,accept')->select();
		foreach($data as $value){
			$result = ToDataBase($value);
			if($result == 1) $n++;
		}
	}else{
		$data = $_POST;
		foreach($data as $value){
			$find = $sql->where("id=$value")->field('id,name,username,password,accept')->find();
			$result = ToDataBase($find);
			if($result == 1) $n++;
		}
	}

	returnJson(true,"This time is synchronized {$n} database");
}

//Add to server
function ToDataBase($find){
	if($find['username'] == 'bt_default') return 0;
	if(strlen($find['password']) < 3){
		$find['username'] = $find['name'];
		$find['password'] = substr(md5(time().$find['name']), 0, 10);
		M('databases')->where("id=".$find['id'])->save(array('password'=>$find['password'],'username'=>$find['username']));
	}
	$result = SqlExec("create database ".$find['name']);
	if(substr($result,"using password:")) return -1;
	if(substr($result,"Connection refused")) return -1;
	SqlExec("drop user '".$find['username']."'@'localhost'");
	SqlExec("drop user '".$find['username']."'@'".$find['accept']."'");
	$password = $find['password'];
	if(isset($find['password']) && strlen($find['password']) > 20){
		$password = RCode($find['password'], 'DECODE');
	}
	SqlExec("grant all privileges on ".$find['name'].".* to '".$find['username']."'@'localhost' identified by '$password'");
	SqlExec("grant all privileges on ".$find['name'].".* to '".$find['username']."'@'".$find['accept']."' identified by '$password'");
	SqlExec("flush privileges");
	return 1;
}

//Get the database from the server
function SyncGetDatabases(){
	$data = SqlQuery("show databases");
	$users = SqlQuery("select User,Host from mysql.user where User!='root' AND Host!='localhost' AND Host!=''");
	$sql = M('databases');
	$nameArr = array('information_schema','performance_schema','mysql');
	$n = 0;
	foreach($data as $value){
		if(in_array($value['Database'],$nameArr)) continue;
		if($sql->where("name='".$value['Database']."'")->getCount()) continue;
		$host = '127.0.0.1';
		foreach($users as $user){
			if($value == $user['User']){
				$host = $user['Host'];
				break;
			}
		}
		switch($value['Database']){
			case 'bt_default':
				$ps = 'Management Assistant Linux Edition Database';
				break;
			case 'test':
				$ps = 'Test database';
				break;
			default:
				$ps = 'Fill in the note';
				break;
		}
		$data = array(
			'name'		=>	$value['Database'],
			'username'	=>	$value['Database'],
			'password'	=>	'',
			'accept'	=>	$host,
			'ps'		=>	$ps);
		if($sql->add($data)) $n++;
	}

	returnJson(true,'This time from the server '.$n.' Database!');
}

//Get database permissions
function GetDatabaseAccess(){
	$name = I('name');
	$users = SqlQuery("select User,Host from mysql.user where User='$name' AND Host!='localhost'");
	ajax_return($users[0]);
}

//Set database permissions
function SetDatabaseAccess(){
	$name = I('name');
	$access = I('access');
	if($access != '%' && filter_var($access, FILTER_VALIDATE_IP) == false) returnJson(false, 'The permission format is illegal');
	$password = M('databases')->where("name='$name'")->getField('password');
	SqlExec("delete from mysql.user where User='$name' AND Host!='localhost'");
	SqlExec("grant all privileges on ".$name.".* to '$name'@'$access' identified by '$password'");
	SqlExec("flush privileges");
	returnJson(true, 'Successful setup!');
}

//Interface action
if(isset($_GET['action'])){
	$_GET['action']();
	exit;
}

//Includes head and menu
require './public/head.html';
require './public/menu.html';
require './public/database.html';
require './public/footer.html';
?>
