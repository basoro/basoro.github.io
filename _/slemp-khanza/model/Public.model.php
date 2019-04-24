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

function ajax_return($data,$type='JSON') {
    switch (strtoupper($type)){
        case 'JSON' :
            header('Content-Type:application/json; charset=utf-8');
            exit(json_encode($data));
        case 'XML'  :
            header('Content-Type:text/xml; charset=utf-8');
            exit(xml_encode($data));
        case 'JSONP':
            header('Content-Type:application/json; charset=utf-8');
            $handler  =   isset($_GET['callback']) ? $_GET['callback'] : 'jsonpReturn';
            exit($handler.'('.json_encode($data).');');
        case 'EVAL' :
            header('Content-Type:text/html; charset=utf-8');
            exit($data);
    }
}

function returnJson($status,$msg){
	$data = array(
		'status' =>	$status,
		'msg'	=>	$msg
	);

	ajax_return($data,isset($_GET['callback'])?'JSONP':'JSON');
}

function returnSocket($data){
	$status = ($data['status']=='true' || $data['status']==true)?true:false;
	returnJson($status,$data['msg']);
}

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
    $long = sprintf("%u",ip2long($ip));
    $ip   = $long ? array($ip, $long) : array('0.0.0.0', 0);
    return $ip[$type];
}

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


function I($name,$default='',$filter=null,$datas=null) {
	static $_PUT	=	null;
	if(strpos($name,'/')){ // 
		list($name,$type) 	=	explode('/',$name,2);
	}elseif(true){ // 
        $type   =   's';
    }
    if(strpos($name,'.')) { // 
        list($method,$name) =   explode('.',$name,2);
    }else{ // 
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
    if(''==$name) { // 
        $data       =   $input;
        $filters    =   isset($filter)?$filter:'htmlspecialchars';
        if($filters) {
            if(is_string($filters)){
                $filters    =   explode(',',$filters);
            }
            foreach($filters as $filter){
                $data   =   array_map_recursive($filter,$data); // 
            }
        }
    }elseif(isset($input[$name])) { // 
        $data       =   $input[$name];
        $filters    =   isset($filter)?$filter:'htmlspecialchars';
        if($filters) {
            if(is_string($filters)){
                if(0 === strpos($filters,'/')){
                    if(1 !== preg_match($filters,(string)$data)){
                        // 
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
                        $data   =   is_array($data) ? array_map_recursive($filter,$data) : $filter($data); // 
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
        		case 'a':	// 
        			$data 	=	(array)$data;
        			break;
        		case 'd':	// 
        			$data 	=	(int)$data;
        			break;
        		case 'f':	// 
        			$data 	=	(float)$data;
        			break;
        		case 'b':	// 
        			$data 	=	(boolean)$data;
        			break;
                case 's':   // 
                default:
                    $data   =   (string)$data;
        	}
        }
    }else{ // 
        $data       =    isset($default)?$default:null;
    }
    is_array($data) && array_walk_recursive($data,'my_filter');
    return $data;
}

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


function SendSocket($data,$rcv=30,$snd=5)
{
	$port_tmp = '/tmp/bt_port.pl';
	if(file_exists($port_tmp)){
		$service_port = intval(trim(file_get_contents($port_tmp)));
	}else{
		$service_port = 25326;
	}

	$address = '127.0.0.1';

	// TCP/IP socket
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
	$data .= '|||'.$keyName;	//
	socket_write($socket, $data, strlen($data));
	$out = '';
	$rend = '';
	//
	while ($out = socket_read($socket, 2048)) {
	    $rend .= $out;
	}
	socket_close($socket);

	//
	$str = @iconv("GBK","UTF-8//IGNORE",$rend);
	$text = str_replace('\\', '\\\\', $str);
	$text = str_replace("\0", '', $text);
	$text = str_replace("\n", "", $text);
	return json_decode($text,1);
}


function my_filter(&$value){
	// TODO 

	// 
    if(preg_match('/^(EXP|NEQ|GT|EGT|LT|ELT|OR|XOR|LIKE|NOTLIKE|NOT BETWEEN|NOTBETWEEN|BETWEEN|NOTIN|NOT IN|IN)$/i',$value)){
        $value .= ' ';
    }
}
?>
