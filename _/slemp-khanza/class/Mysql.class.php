<?php
class Mysql{
	private $host;
	private $dbname;
	private $port;
	private $username;
	private $password;
	private $charset;
	static $SQL;
	static $obj = null;
	public $table;
	private $pre = null;
	private $opt;

	private function __construct($dsn){
		$this->host = $dsn['DB_HOST'];
		$this->dbname = $dsn['DB_NAME'];
		$this->username = $dsn['DB_USER'];
		$this->password = $dsn['DB_PWD'];
		$this->port = $dsn['DB_PORT'];
		$this->charset = $dsn['DB_CHARSET'];
		$this->table = $dsn['DB_PREFIX'].$dsn['DB_TABLE'];
		$this->opt['where'] = '';
		$this->opt['order'] = '';
		$this->opt['limit'] = '';
		$this->opt['field'] = null;
		$this->connect();
	}

	private function connect(){
		try{
			 $dsn  =  'mysql:host='.$this->host.';dbname='.$this->dbname.';port='.$this->port;
			 $options  = array(
			     PDO :: MYSQL_ATTR_INIT_COMMAND  =>  'SET NAMES '.$this->charset,
			);
 			self::$SQL = new  PDO ($dsn,$this->username,$this->password,$options);
			self::$SQL->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
		}catch(PDOException $e){
			echo "Database connection failed: ".$e->getMessage();
			exit;
		}
		return true;
	}

	static function start($dsn){
		//if(is_null(self::$obj)){
		self::$obj = null;
		self::$obj = new self($dsn);
		//}
		return self::$obj;
	}

	public function add($data,$type = 2){
		try{
			$count = 0;
			$a = '';
			foreach($data as $k=>$v){
				if($count != 0){
					$a = ',';
				}
				@$key .= $a.$k;
				@$bind .=$a.":$k";
				$count++;
			}
			$s = "INSERT INTO {$this->table}({$key}) VALUES({$bind})";
			if($type != 1){
				$this->pre = self::$SQL->prepare($s);
				if($type == 0 && is_object($this->pre) == true){
					return 1;
				}
			}
			if($type != 0){
				$this->pre->execute($data);
			}
			return self::$SQL->lastinsertid();
		}catch(PDOException $e){
			exit("错误：".$e->getMessage());
		}

	}

	public function save($data){
		try{
			$count = 0;
			$a = '';
			foreach($data as $k=>$v){
				if($count != 0){
					$a = ',';
				}
				@$bind .=$a."`$k`=:$k";
				$count++;
			}
			$s = "UPDATE {$this->table} SET {$bind} {$this->opt['where']}";

			$this->pre = self::$SQL->prepare($s);
			$this->pre->execute($data);
			return $this->pre->rowCount();
		}catch(PDOException $e){
			exit("Error: ".$e->getMessage());
		}
	}

	public function sum($key,$num=1){
		try{
			$s = "UPDATE `{$this->table}` set `{$key}`={$key}+{$num} {$this->opt['where']}";
			$this->pre = self::$SQL->prepare($s);
			$this->pre->execute();
			return $this->pre->rowCount();
		}catch(PDOException $e){
			exit("Error: ".$e->getMessage());
		}
	}

	public function delete(){
		try{
			$s = "DELETE FROM `{$this->table}` {$this->opt['where']}";
			$this->pre = self::$SQL->prepare($s);
			$this->pre->execute();
			return $this->pre->rowCount();
		}catch(PDOException $e){
			exit("Error: ".$e->getMessage());
		}
	}

	public function select(){
		try{
			$s = "SELECT ".($this->opt['field']? $this->opt['field']:'*')." FROM `{$this->table}` {$this->opt['where']} {$this->opt['order']} {$this->opt['limit']}";
			$this->pre = self::$SQL->prepare($s);
			$this->pre->execute();
			$this->pre->setFetchMode(PDO::FETCH_ASSOC);
			return $this->pre->fetchAll();
		}catch(PDOException $e){
			exit("Error: ".$e->getMessage());
		}
	}

	public function find(){
		try{
			$s = "SELECT ".($this->opt['field']? $this->opt['field']:'*')." FROM `{$this->table}` {$this->opt['where']} {$this->opt['order']} LIMIT 1";
			$this->pre = self::$SQL->prepare($s);
			$this->pre->execute();
			$this->pre->setFetchMode(PDO::FETCH_ASSOC);
			$arr = $this->pre->fetchAll();
			if(count($arr) > 0){
				return $arr[0];
			}
			return null;
		}catch(PDOException $e){
			exit("Error: ".$e->getMessage());
		}
	}

	public function getField($key){
		try{
			$opt['field'] = $key;
			$selArr = $this->select();
			foreach($selArr as $number=>$value){
				$retuls[$number] = $value[$key];
			}

			if(@$retuls == null) $retuls=false;
			if(count($retuls) == 1 and $retuls != false){
				$retuls = $retuls[0];
			}
			return $retuls;
		}catch(PDOException $e){
			exit('Error: '.$e->getMessage());
		}
	}

	public function setField($key,$value){
		return $this->save(array($key=>$value));
	}

	public function getCount(){
		try{
			$s = "SELECT COUNT(*) FROM `{$this->table}` {$this->opt['where']}";
			$this->pre = self::$SQL->prepare($s);
			$this->pre->execute();
			$count = $this->pre->fetch();
			return Intval($count[0]);
		}catch(PDOException $e){
			exit("Error: ".$e->getMessage());
		}
	}

	public function where($where){
		$this->opt['where'] = $where? "WHERE ".$where:'';
		return $this;
	}

	public function order($order){
		$this->opt['order'] = $order? "ORDER BY ".$order:'';
		return $this;
	}

	public function limit($min,$max=null){
		$this->opt['limit'] = "LIMIT ".intval($min).($max? ','.intval($max):'');
		return $this;
	}

	public function field($field){
		$this->opt['field'] = $field;
		return $this;
	}

	public function execute($sql,$param){
		try{
			$this->pre = self::$SQL->prepare($sql);
			$this->pre->execute($param);
			return $this->pre->rowCount();
		}catch(PDOException $e){
			exit("Error: ".$e->getMessage());
		}
	}

	public function query($sql,$param){
		try{
			$this->pre = self::$SQL->prepare($sql);
			$this->pre->execute($param);
			$this->pre->setFetchMode(PDO::FETCH_ASSOC);
			return $this->pre->fetchAll();
		}catch(PDOException $e){
			exit("Error: ".$e->getMessage());
		}
	}

}

?>
