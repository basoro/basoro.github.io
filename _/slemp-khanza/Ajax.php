<?php

include_once './Common.php';

if(isset($_GET['action'])){
	$_GET['action']();
}

/**
 * Take system information
 * @param String $_GET['ip'] Server IP
 * @param String $_GET['name'] Information to be obtained info, disk, cpu, net
 * @return Json   Successfully returned array，Failed to return false
 */
function systemInfo(){
	$name = $_GET['name'];
	switch ($name){
		case 'info':
			$Return = SendSocket("System|info");
			break;
		case 'disk':
			$Return = SendSocket("System|disk");
			break;
		case 'cpu':
			$Return = SendSocket("System|cpu");
			break;
		case 'net':
			$Return = SendSocket("System|net");
			break;
		default:
			$Return = false;
			break;
	}
	ajax_return($Return);
}

/**
 * Server information
 * @param String $_GET['ip'] Server IP
 * @param String $_GET['name'] Information to be obtained   serverType , softInfo ,inSql
 * @return Json   Successfully returned array，Failed to return false
 */
function server_info(){
	$name = $_GET['name'];
	switch ($name){
		case 'serverType':
			$Return = SendSocket("Type");
			break;
		case 'softInfo':
			$Return = SendSocket("Info");
			break;
		case 'inSql':
			$Return = SendSocket("InSQL");
			break;
		default:
			$Return = false;
			break;
	}
	ajax_return($Return);
}


/**
 * Set up comment information
 * @param String $_GET['tab'] Database table name
 * @param String $_GET['id'] Condition ID
 * @return Bool
 */
function setPs(){
	$tableName = $_GET['tab'];
	$id = $_GET['id'];
	$SQL = M($tableName);
	if($SQL->where("id=$id")->setField('ps',$_GET['ps'])){
		ajax_return(true);
	}else{
		ajax_return(false);
	}

}

	/**
 * Take a list of data
 * @param String $_GET['tab'] Database table name
 * @param Int $_GET['count'] Number of rows per page
 * @param Int $_GET['p'] Page number  To take the first few pages of data
 * @return Json  page.Number of pages , count.Total number of rows   data.Retrieved data
 */
function getData(){
	$table = $_GET['tab'];
	$data = GetSql($table);

	$SQL = M('backup');
	//Decrypt encrypted text
	for($i=0;$i<count($data['data']);$i++){
		$id = $data['data'][$i]['id'];
		if(isset($data['data'][$i]['password']) && strlen($data['data'][$i]['password']) > 20){
			$data['data'][$i]['password'] = RCode($data['data'][$i]['password'], 'DECODE');
		}
		if(isset($data['data'][$i]['filename'])){
			if($data['data'][$i]['size'] == '0'){
				$data['data'][$i]['size'] = filesize($data['data'][$i]['filename']);
				if($data['data'][$i]['size'] !== false)
					$SQL->where("id=".$data['data'][$i]['id'])->setField('size',$data['data'][$i]['size']);
			}
		}else{
			$data['data'][$i]['backup_count'] = $SQL->where("pid='$id'")->getCount();
		}

		if($data[$i]['ps'] == '') $data[$i]['ps'] = '空';
	}


	//return
	ajax_return($data);
}

/**
 * Take the database row
 * @param String $_GET['tab'] Database table name
 * @param Int $_GET['id'] Index ID
 * @return Json
 */
function getFind(){
	$tableName = I('get.tab');
	$id = I('get.id');
	$SQL = M($tableName);
	$where = "id=$id";
	$find = $SQL->where($where)->find();
	ajax_return($find);
}

/**
 * Take field value
 * @param String $_GET['tab'] Database table name
 * @param String $_GET['key'] Field
 * @param String $_GET['id'] Condition ID
 * @return String
 */
function getKey(){
	$tableName = $_GET['tab'];
	$keyName = $_GET['key'];
	$id = $_GET['id'];
	$SQL = M($tableName);
	$where = "id=$id";
	$retuls = $SQL->where($where)->getField($keyName);
	ajax_return($retuls);
}


/**
 * Get data and paging
 * @param string $table table
 * @param string $where Query conditions
 * @param int $limit Number of lines per page
 * @param mixed $result Defining paging data structures
 * @return array
 */
function GetSql($table,$result = '1,2,3,4,5,8'){
	//Determine whether the front end passes parameters
	$order = !empty($_GET['order'])? $_GET['order']:"id desc";  //Sort
	$limit = !empty($_GET['limit'])? $_GET['limit']:20;			//Number of lines per page
	$result = !empty($_GET['return'])? $_GET['return']:$result;	//Paging structure
	//Query condition
	$where = GetWhere($table);
	//Instantiate database objects
	$SQL = M($table);
	//Take the total number of rows
	$count = $SQL->where($where)->getCount();
	//Include paging class
	include_once './class/Page.class.php';
	//Instantiated paging class
	$page = new Page($count,$limit);
	//Get paging data
	$data['page'] = $page->getPage($result=='false'? false:$result);
	//Take out data
	$data['data'] = $SQL->where($where)->order($order)->limit($page->shift,$page->row)->select();
	return $data;
}

//Acquisition condition
function GetWhere($tableName){
	if(!isset($_GET['search'])) return '';
	$search = $_GET['search'];

	switch($tableName){
		case 'sites':
			$where = "id like binary '$search' or  name like binary '%$search%' or status like binary '$search' or domain like binary '%$search%' or ps like binary '%$search%'";
			break;
		case 'ftps':
			$where = "id like binary '$search' or  name like binary '%$search%' or ps like binary '%$search%'";
			break;
		case 'databases':
			$where = "id like binary '$search' or  name like binary '%$search%' or ps like binary '%$search%'";
			break;
		case 'logs':
			$where = "type like binary '%$search%' or log like binary '%$search%' or addtime like binary '%$search%'";
			break;
		case 'backup':
			$where = "pid=$search";
			break;
		default:
			return "";
			break;
	}

	return $where;
}


//Browse folder
function GetDir(){
	$path = trim($_POST['path']);
	$path = str_replace( '//', '/',$path);

	if($path  == ''){
		$path = '/';
		$Disk = SendSocket("System|disk");
		foreach($Disk as $value){
				if($value['分区'] == '/boot' || $value['分区'] == '') continue;
				$data['DISK'][] =  array('Span'=>$value['分区'],'Size'=>$value['可用空间']);
		}
		$data['PATH'] = '/';
		ajax_return($data);
	}
	if(!is_dir($path)) $path = $_SESSION['config']['sites_path'];
	if(!file_exists($path)) $path = '/';
	$dir = dir($path);
	if(!$dir){
		$path =  $_SESSION['config']['sites_path'];
		$dir = dir($path);
	}
	$dirs = array();
	$files = array();
	while (true) {
		$file = $dir -> read();
		if($file === false) break;
		$fileName = $path.'/'.$file;

		if ($file != '.' && $file != '..') {
			$fileInfo = GetFileAccess($fileName);
			$size = filesize($fileName);
			$editTime = filemtime($fileName);
			if (is_dir($fileName)) {
				$dirs[] = $file.';'.$size.';'.$editTime.';'.$fileInfo['chmod'].';'.$fileInfo['chown'];
			} else {

				$files[] = $file.';'.$size.';'.($file=='.user.ini'?'Directory security file, may cause major security risks after deletion!':$editTime).';'.$fileInfo['chmod'].';'.$fileInfo['chown'];
			}
		}
	}
	array_multisort($dirs ,SORT_ASC,SORT_STRING, $dirs);
	array_multisort($files ,SORT_ASC,SORT_STRING, $files);
	$data = array('PATH'=>$path,'DIR'=>$dirs,'FILES'=>$files);
	if(!json_encode($data))$data = mult_iconv('GB2312','UTF-8',$data);
	ajax_return($data);
}

//File or directory permissions
function GetFileAccess($fileName){
	//Owner
	$own = posix_getpwuid(fileowner($fileName));
	$fileInfo['chown'] = $own['name'];

	//Permission
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

	return $fileInfo;
}

//Take the directory size
function GetDirSize(){
	$path = I('path');
	SendSocket("ExecShell|du -sb $path");
	$size = formatsize(intval(file_get_contents('/tmp/shell_temp.pl')));
    ajax_return($size);
}

//Clean up the log
function CloseLogs(){
	SendSocket("ExecShell|rm -f /www/wwwlogs/*log");
	SendSocket("ExecShell|kill -USR1 `cat /www/server/nginx/logs/nginx.pid`");
	$_GET['path'] = '/www/wwwlogs';
	GetDirSize();

}


//Convert array character encoding
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

//Create folder
function AddDir(){
	$path = I('path');
	$tmp = explode('/',$path);
	$path = str_replace("\\", "/", $path);
	$Name = $tmp[count($tmp)-1];
	if($Name == '') $path .= 'NewFolder';
	if(CheckPath($Name)){
		ajax_return(array('status'=>false,'msg'=>'Folder name is illegal, not allowed <span style="color:red">\\/:*?"<>|</span>'));
	}
	$data = SendSocket("AddDir|".$path);
	$data['msg'] .= $path;
	ajax_return($data);
}

//Delete empty folder
function DelNullDir(){
	$path = str_replace("\\", "/", I('path'));
	$dir = dir($path);
	while($file = $dir -> read()){
		if ($file != '.' && $file != '..') {
			returnJson(false, 'Cannot delete non-empty directories!');
		}
	}
	$data = SendSocket("FileAdmin|DelDir|" . $path);
	$data['msg'] .= $path;
	ajax_return($data);
}

//Verify directory name
function CheckPath($Name){
	$str = "/:*?\"<>|";
	for($i=0;$i<strlen($str);$i++){
		if(strstr($Name,$str{$i})){
			return true;
		}
	}
	return false;
}
//Traffic statistics
function GetNetTotal(){
	$netStr = @file("/proc/net/dev");
	$data = array();
	$up = $down = $data['downTotal'] = $data['upTotal'] = 0;
    for($i=2;$i<count($netStr);$i++){
		preg_match_all( "/([^\s]+):[\s]{0,}(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/", $netStr[$i], $info);
		if($info[1][0] == 'lo') continue;

		$up += $info[10][0];
		$down += $info[2][0];
		$data['downTotal'] += $info[2][0];
		$data['upTotal'] += $info[10][0];
	}
	if(!isset($_SESSION['up'])){
		$_SESSION['up'] = $info[10][0];
		$_SESSION['down'] = $info[2][0];
	}
	$data['downTotal'] = formatsize($data['downTotal']);
	$data['upTotal'] = formatsize($data['upTotal']);
	$data['up'] = round(($up - $_SESSION['up']) / 1024 / 3,2);
	$data['down'] = round(($down - $_SESSION['down']) / 1024 / 3,2);

	$_SESSION['up'] = $up;
	$_SESSION['down'] = $down;
	if($data['up'] > 102400){
		$data['up'] = $data['down'] = 0;
	}

	$data['cpuinfo'] = GetCpuTotal();
	ajax_return($data);
}

//System statistics
function GetSystemTotal(){
	$data = array();
	$data['system'] = str_replace('release','',file_get_contents('/etc/redhat-release'));
	$mem = GetMemTotal();
	$data['memTotal'] = $mem['memTotal'];
	$data['memRealUsed'] = $mem['memRealUsed'];
	$data['time'] = GetTimeTotal();
	$cpu = GetCpuTotal();
	$data['cpuNum'] = $cpu['num'];
	$data['cpuRealUsed'] = $cpu['used'];
	ajax_return($data);

}

//Take memory statistics
function GetMemTotal(){
	$str = @file("/proc/meminfo");
    $str = implode("", $str);
    preg_match_all("/MemTotal\s{0,}\:+\s{0,}([\d\.]+).+?MemFree\s{0,}\:+\s{0,}([\d\.]+).+?Cached\s{0,}\:+\s{0,}([\d\.]+).+?SwapTotal\s{0,}\:+\s{0,}([\d\.]+).+?SwapFree\s{0,}\:+\s{0,}([\d\.]+)/s", $str, $buf);
	preg_match_all("/Buffers\s{0,}\:+\s{0,}([\d\.]+)/s", $str, $buffers);

    $data['memTotal'] = intval($buf[1][0]/1024);
    $data['memFree'] = round($buf[2][0]/1024, 2);
    $data['memBuffers'] = round($buffers[1][0]/1024, 2);
	$data['memCached'] = round($buf[3][0]/1024, 2);
    $data['memRealUsed'] = $data['memTotal'] - $data['memFree'] - $data['memCached'] - $data['memBuffers'];
	return $data;

}

//Take boot time
function GetTimeTotal(){
	$str = @file("/proc/uptime");
    $str = explode(" ", implode("", $str));
    $str = trim($str[0]);
    $min = $str / 60;
    $hours = $min / 60;
    $days = floor($hours / 24);
    $hours = floor($hours - ($days * 24));
    $min = floor($min - ($days * 60 * 24) - ($hours * 60));
    if ($days !== 0) $data = $days." day ";
    if ($hours !== 0) $data .= $hours." hour ";
    $data .= $min." minute ";
    return $data;
}

//Take CPU statistics
function GetCpuTotal(){
    $stat1 = GetCoreInformation();
    sleep(1);
    $stat2 = GetCoreInformation();
    $data = GetCpuPercentages($stat1, $stat2);
	$result['num'] = count($data);
	$free = 0;
	foreach($data as $value){
		$free += $value['idle'];
	}
	$result['used'] = round(($result['num'] * 100 - $free) / $result['num'],2);
	return $result;
}

function GetCpuPercentages($stat1, $stat2) {
	if(count($stat1)!==count($stat2)){
		return;
	}
	$cpus=array();
	for( $i = 0, $l = count($stat1); $i < $l; $i++) {
		$dif = array();
		$dif['user'] = $stat2[$i]['user'] - $stat1[$i]['user'];
		$dif['nice'] = $stat2[$i]['nice'] - $stat1[$i]['nice'];
		$dif['sys'] = $stat2[$i]['sys'] - $stat1[$i]['sys'];
		$dif['idle'] = $stat2[$i]['idle'] - $stat1[$i]['idle'];
		$dif['iowait'] = $stat2[$i]['iowait'] - $stat1[$i]['iowait'];
		$dif['irq'] = $stat2[$i]['irq'] - $stat1[$i]['irq'];
		$dif['softirq'] = $stat2[$i]['softirq'] - $stat1[$i]['softirq'];

		$total = array_sum($dif);
		$cpu = array();
		foreach($dif as $x=>$y) $cpu[$x] = round($y / $total * 100, 2);
		$cpus['cpu' . $i] = $cpu;
	}
	return $cpus;


}


function GetCoreInformation() {
	$data = file('/proc/stat');
	$cores = array();
	foreach( $data as $line ) {
		if( preg_match('/^cpu[0-9]/', $line) ){
			$info = explode(' ', $line);
			$cores[]=array(
			'user'=>$info[1],
			'nice'=>$info[2],
			'sys' => $info[3],
			'idle'=>$info[4],
			'iowait'=>$info[5],
			'irq' => $info[6],
			'softirq' => $info[7]);
		}
	}
	return $cores;
}

//Take the Nginx load status
function GetNginxStatus(){
	$url = "http://127.0.0.1/nginx_status";
	$result = httpGet($url);
	$tmp = explode("\n",$result);

	$data = array();
	$active = explode(':',$tmp[0]);
	$data['active'] = intval($active[1]);		//Current active connections
	$server = explode(' ',trim($tmp[2]));
	$data['accepts'] = intval($server[0]);		//Total connections
	$data['handled'] = intval($server[1]);		//Total number of successful handshakes
	$data['requests'] = intval($server[2]);		//Total requests
	$rww = explode(' ',$tmp[3]);
	$data['Reading'] = intval($rww[1]);			//Read the number of connections from the client.
	$data['Writing'] = intval($rww[3]);			//The number of response data to the client
	$data['Waiting'] = intval($rww[5]);			//Number of resident processes
	ajax_return($data);
}

//Unit conversion
function formatsize($size)
{
	$danwei=array(' B ',' K ',' M ',' G ',' T ');
	for($i=0;$i<count($danwei);$i++){
		if($size < 1024) return round($size,2).$danwei[$i];
		$size /= 1024;
	}
	return round($size,2).$danwei[count($danwei)-1];
}
?>
