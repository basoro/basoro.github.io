<?php

function C($name,$key = null){
	$conf = @include('./conf/'.$name.'.config.php');
	if(is_null($key)){
			return $conf;
	}
	if(is_null(@$conf[$key])){
		return false;
	}
	return $conf[$key];
}

function dump($array){
	echo '<pre>';
	var_dump($array);
	echo '</pre>';
}
include('./class/Mysql.class.php');

function M($table){
	$conn = C('sql');
	$conn['DB_TABLE'] = $table;
	return Mysql::start($conn);
}

function SqlQuery($sql){
	$sqlObject = ConnectSql();
	if(is_string($sqlObject)) return $sqlObject;
	try{
		$pre = $sqlObject->prepare($sql);
		$pre->execute();
		$pre->setFetchMode(PDO::FETCH_ASSOC);
		return $pre->fetchAll();
	}catch(PDOException $e){
		return $e->getMessage();
	}
}

function SqlExec($sql){
	$sqlObject = ConnectSql();
	if(is_string($sqlObject)) return $sqlObject;
	try{
		$pre = $sqlObject->prepare($sql);
		$pre->execute();
		return $pre->rowCount();
	}catch(PDOException $e){
		return $e->getMessage();
	}
}

function ConnectSql(){
	try{
		$conn = C('sql');
		$sqlObject = null;
		$mysql_root = M('config')->where("id=1")->getField('mysql_root');
		$dsn  =  'mysql:host='.$conn['DB_HOST'].';port='.$conn['DB_PORT'];
		$options  = array(
			PDO :: MYSQL_ATTR_INIT_COMMAND  =>  'SET NAMES utf8',
		);
		$sqlObject = new  PDO ($dsn,'root',$mysql_root,$options);
		$sqlObject->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
		return $sqlObject;
	}catch(PDOException $e){
		return $e->getMessage();
	}
}

function httpGet($url) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_TIMEOUT, 6);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER,array('Accept-Encoding: gzip, deflate'));
	curl_setopt($ch, CURLOPT_ENCODING, 'gzip,deflate');
	curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4");
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 3);
	$output = curl_exec($ch);
	curl_close($ch);
	return $output;
}

function httpPost($url,$data){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_TIMEOUT, 30);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36");
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	$output = curl_exec($ch);
	curl_close($ch);
	return $output;
}

function serviceWebReload(){
	if(empty($_SESSION['server_type'])) $_SESSION['server_type'] = M('config')->where("id=1")->getField('webserver');
	$serverType = $_SESSION['server_type'] == 'nginx' ? 'nginx':'';
	SendSocket("ExecShell|service ".$serverType." reload");
	if($serverType == 'nginx'){
		$tmp = trim(file_get_contents('/tmp/shell_temp.pl'));
		if(strpos($tmp,'nginx.pid')){
			SendSocket("ExecShell|pkill -9 nginx && sleep 1");
			SendSocket("ExecShell|service nginx start");
		}
	}
}

function WriteLogs($type,$log){
	$sqlObject = M('logs');
	$param = array(
		'type'	=>	$type,
		'log'	=>	$log,
		'addtime'	=>	date('Y-m-d H:i:s')
	);

	$sql = "INSERT INTO bt_logs(type,log,addtime) VALUES(:type,:log,:addtime)";
	$sqlObject->execute($sql, $param);
}

/**
 * Ajax方式返回数据到客户端
 * @param mixed $data 要返回的数据
 * @param String $type AJAX返回数据格式
 * @return void
 */
function ajax_return($data,$type='JSON') {
    switch (strtoupper($type)){
        case 'JSON' :
            // 返回JSON数据格式到客户端 包含状态信息
            header('Content-Type:application/json; charset=utf-8');
            exit(json_encode($data));
        case 'XML'  :
            // 返回xml格式数据
            header('Content-Type:text/xml; charset=utf-8');
            exit(xml_encode($data));
        case 'JSONP':
            // 返回JSON数据格式到客户端 包含状态信息
            header('Content-Type:application/json; charset=utf-8');
            $handler  =   isset($_GET['callback']) ? $_GET['callback'] : 'jsonpReturn';
            exit($handler.'('.json_encode($data).');');
        case 'EVAL' :
            // 返回可执行的js脚本
            header('Content-Type:text/html; charset=utf-8');
            exit($data);
    }
}

/**
 * 返回格式化JSON
 * @param bool $status 状态
 * @param string $msg  消息
 */
function returnJson($status,$msg){
	$data = array(
		'status' =>	$status,
		'msg'	=>	$msg
	);

	ajax_return($data,isset($_GET['callback'])?'JSONP':'JSON');
}

/**
 * 直接格式化Socket接口返回数组
 * @param array $data  数组
 */
function returnSocket($data){
	$status = ($data['status']=='true' || $data['status']==true)?true:false;
	returnJson($status,$data['msg']);
}


/**
 * 获取客户端IP地址
 * @param integer $type 返回类型 0 返回IP地址 1 返回IPV4地址数字
 * @return mixed
 */
function get_client_ip($type = 0) {
    $type       =  $type ? 1 : 0;
    static $ip  =   NULL;
    if ($ip !== NULL) return $ip[$type];
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $arr    =   explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $pos    =   array_search('unknown',$arr);
        if(false !== $pos) unset($arr[$pos]);
        $ip     =   trim($arr[0]);
    }elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
        $ip     =   $_SERVER['HTTP_CLIENT_IP'];
    }elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $ip     =   $_SERVER['REMOTE_ADDR'];
    }
    // IP地址合法验证
    $long = sprintf("%u",ip2long($ip));
    $ip   = $long ? array($ip, $long) : array('0.0.0.0', 0);
    return $ip[$type];
}

/**
 * XML编码
 * @param mixed $data 数据
 * @param string $root 根节点名
 * @param string $item 数字索引的子节点名
 * @param string $attr 根节点属性
 * @param string $id   数字索引子节点key转换的属性名
 * @param string $encoding 数据编码
 * @return string
 */
function xml_encode($data, $root='data', $item='item', $attr='', $id='id', $encoding='utf-8') {
    if(is_array($attr)){
        $_attr = array();
        foreach ($attr as $key => $value) {
            $_attr[] = "{$key}=\"{$value}\"";
        }
        $attr = implode(' ', $_attr);
    }
    $attr   = trim($attr);
    $attr   = empty($attr) ? '' : " {$attr}";
    $xml    = "<?xml version=\"1.0\" encoding=\"{$encoding}\"?>";
    $xml   .= "<{$root}{$attr}>";
    $xml   .= data_to_xml($data, $item, $id);
    $xml   .= "</{$root}>";
    return $xml;
}

/**
 * 数据XML编码
 * @param mixed  $data 数据
 * @param string $item 数字索引时的节点名称
 * @param string $id   数字索引key转换为的属性名
 * @return string
 */
function data_to_xml($data, $item='item', $id='id') {
    $xml = $attr = '';
    foreach ($data as $key => $val) {
        if(is_numeric($key)){
            $id && $attr = " {$id}=\"{$key}\"";
            $key  = $item;
        }
        $xml    .=  "<{$key}{$attr}>";
        $xml    .=  (is_array($val) || is_object($val)) ? data_to_xml($val, $item, $id) : $val;
        $xml    .=  "</{$key}>";
    }
    return $xml;
}


/**
 * 获取输入参数 支持过滤和默认值
 * 使用方法:
 * <code>
 * I('id',0); 获取id参数 自动判断get或者post
 * I('post.name','','htmlspecialchars'); 获取$_POST['name']
 * I('get.'); 获取$_GET
 * </code>
 * @param string $name 变量的名称 支持指定类型
 * @param mixed $default 不存在的时候默认值
 * @param mixed $filter 参数过滤方法
 * @param mixed $datas 要获取的额外数据源
 * @return mixed
 */
function I($name,$default='',$filter=null,$datas=null) {
	static $_PUT	=	null;
	if(strpos($name,'/')){ // 指定修饰符
		list($name,$type) 	=	explode('/',$name,2);
	}elseif(true){ // 默认强制转换为字符串
        $type   =   's';
    }
    if(strpos($name,'.')) { // 指定参数来源
        list($method,$name) =   explode('.',$name,2);
    }else{ // 默认为自动判断
        $method =   'param';
    }
    switch(strtolower($method)) {
        case 'get'     :
        	$input =& $_GET;
        	break;
        case 'post'    :
        	$input =& $_POST;
        	break;
        case 'put'     :
        	if(is_null($_PUT)){
            	parse_str(file_get_contents('php://input'), $_PUT);
        	}
        	$input 	=	$_PUT;
        	break;
        case 'param'   :
            switch($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $input  =  $_POST;
                    break;
                case 'PUT':
                	if(is_null($_PUT)){
                    	parse_str(file_get_contents('php://input'), $_PUT);
                	}
                	$input 	=	$_PUT;
                    break;
                default:
                    $input  =  $_GET;
            }
            break;
        case 'path'    :
            $input  =   array();
            if(!empty($_SERVER['PATH_INFO'])){
                $depr   =   '-';
                $input  =   explode($depr,trim($_SERVER['PATH_INFO'],$depr));
            }
            break;
        case 'request' :
        	$input =& $_REQUEST;
        	break;
        case 'session' :
        	$input =& $_SESSION;
        	break;
        case 'cookie'  :
        	$input =& $_COOKIE;
        	break;
        case 'server'  :
        	$input =& $_SERVER;
        	break;
        case 'globals' :
        	$input =& $GLOBALS;
        	break;
        case 'data'    :
        	$input =& $datas;
        	break;
        default:
            return null;
    }
    if(''==$name) { // 获取全部变量
        $data       =   $input;
        $filters    =   isset($filter)?$filter:'htmlspecialchars';
        if($filters) {
            if(is_string($filters)){
                $filters    =   explode(',',$filters);
            }
            foreach($filters as $filter){
                $data   =   array_map_recursive($filter,$data); // 参数过滤
            }
        }
    }elseif(isset($input[$name])) { // 取值操作
        $data       =   $input[$name];
        $filters    =   isset($filter)?$filter:'htmlspecialchars';
        if($filters) {
            if(is_string($filters)){
                if(0 === strpos($filters,'/')){
                    if(1 !== preg_match($filters,(string)$data)){
                        // 支持正则验证
                        return   isset($default) ? $default : null;
                    }
                }else{
                    $filters    =   explode(',',$filters);
                }
            }elseif(is_int($filters)){
                $filters    =   array($filters);
            }

            if(is_array($filters)){
                foreach($filters as $filter){
                    if(function_exists($filter)) {
                        $data   =   is_array($data) ? array_map_recursive($filter,$data) : $filter($data); // 参数过滤
                    }else{
                        $data   =   filter_var($data,is_int($filter) ? $filter : filter_id($filter));
                        if(false === $data) {
                            return   isset($default) ? $default : null;
                        }
                    }
                }
            }
        }
        if(!empty($type)){
        	switch(strtolower($type)){
        		case 'a':	// 数组
        			$data 	=	(array)$data;
        			break;
        		case 'd':	// 数字
        			$data 	=	(int)$data;
        			break;
        		case 'f':	// 浮点
        			$data 	=	(float)$data;
        			break;
        		case 'b':	// 布尔
        			$data 	=	(boolean)$data;
        			break;
                case 's':   // 字符串
                default:
                    $data   =   (string)$data;
        	}
        }
    }else{ // 变量默认值
        $data       =    isset($default)?$default:null;
    }
    is_array($data) && array_walk_recursive($data,'my_filter');
    return $data;
}

/**
 * 加密解密
 * @param String $string 欲处理的文本
 * @param String $operation 选项，DECODE.解密   ENCODE.加密
 * @param String $key 密码文本
 * @param Int $expiry 到期时间(秒)
 * @return String 返回处理后的文本
 */
function RCode($string, $operation, $key = 'a002601', $expiry = 0) {
	 $ckey_length = 0;
	 $key = md5($key ? $key : md5(AUTHKEY.$_SERVER['HTTP_USER_AGENT']));
	 $keya = md5(substr($key, 0, 16));
	 $keyb = md5(substr($key, 16, 16));
	 $keyc = $ckey_length ? ($operation == 'DECODE' ? substr($string, 0, $ckey_length): substr(md5(microtime()), -$ckey_length)) : ''; $cryptkey = $keya.md5($keya.$keyc);
	 $key_length = strlen($cryptkey); $string = $operation == 'DECODE' ? base64_decode(substr($string, $ckey_length)) : sprintf('%010d', $expiry ? $expiry + time() : 0).substr(md5($string.$keyb), 0, 16).$string;
	 $string_length = strlen($string); $result = '';
	 $box = range(0, 255); $rndkey = array();
	 for($i = 0; $i <= 255; $i++) {
	  $rndkey[$i] = ord($cryptkey[$i % $key_length]);
	 } for($j = $i = 0; $i < 256; $i++) {
	  $j = ($j + $box[$i] + $rndkey[$i]) % 256;
	  $tmp = $box[$i];
	  $box[$i] = $box[$j];
	  $box[$j] = $tmp;
	 } for($a = $j = $i = 0; $i < $string_length; $i++) {
	  $a = ($a + 1) % 256;
	  $j = ($j + $box[$a]) % 256;
	  $tmp = $box[$a];
	  $box[$a] = $box[$j];
	  $box[$j] = $tmp;
	  $result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
	 } if($operation == 'DECODE') {
	  if((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) && substr($result, 10, 16) == substr(md5(substr($result, 26).$keyb), 0, 16)) {
	   return substr($result, 26);
	  } else {
	   return '';
	  }
	 } else {
	  return $keyc.str_replace('=', '', base64_encode($result));
	 }
}


/**
 * 发送套接字
 * @param string $data
 * @return string
 */
function SendSocket($data,$rcv=30,$snd=5)
{
	$port_tmp = '/tmp/bt_port.pl';
	if(file_exists($port_tmp)){
		$service_port = intval(trim(file_get_contents($port_tmp)));
	}else{
		$service_port = 25326;
	}

	$address = '127.0.0.1';

	//创建 TCP/IP socket
	$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
	socket_set_option($socket,SOL_SOCKET,SO_RCVTIMEO,array("sec"=>$rcv, "usec"=>0 ));
	socket_set_option($socket,SOL_SOCKET,SO_SNDTIMEO,array("sec"=>$snd, "usec"=>0 ));

	if (!$socket) {
		return false;
	}
	$result = @socket_connect($socket, $address, $service_port);
	if (!$result) {
	    return false;
	}
	$keyPath='/www/server/cloud/tmp';
	$keyName=md5(time().rand(1111,9999)).'.key';
	file_put_contents($keyPath.'/'.$keyName,time());
	$data .= '|||'.$keyName;	//通配
	socket_write($socket, $data, strlen($data));
	$out = '';
	$rend = '';
	//接收服务器返回
	while ($out = socket_read($socket, 2048)) {
	    $rend .= $out;
	}
	socket_close($socket);

	//处理编码
	$str = @iconv("GBK","UTF-8//IGNORE",$rend);
	$text = str_replace('\\', '\\\\', $str);
	$text = str_replace("\0", '', $text);
	$text = str_replace("\n", "", $text);
	return json_decode($text,1);
}


function my_filter(&$value){
	// TODO 其他安全过滤

	// 过滤查询特殊字符
    if(preg_match('/^(EXP|NEQ|GT|EGT|LT|ELT|OR|XOR|LIKE|NOTLIKE|NOT BETWEEN|NOTBETWEEN|BETWEEN|NOTIN|NOT IN|IN)$/i',$value)){
        $value .= ' ';
    }
}
?>
