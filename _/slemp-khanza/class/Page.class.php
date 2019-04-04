<?php
class Page{
	public $prev = 'Previous';
	public $next = 'Next';
	public $start = 'Home';
	public $end = 'End';
	public $countStart = 'Total';
	public $countEnd = 'Data';
	public $fo = 'From';
	public $line = 'Post';
	public $listNum = 4;
	public $shift;	//Offset
	public $row;
	private $startNum;
	private $endNum;
	private $cPage;
	private $pageNumber;
	private $DataCount;
	private $uri;
	private $pkey = 'p';
	private $skey = 'rows';
	private $isjs;

	public function __construct($count,$rows){
		$this->isjs = !empty($_GET['tojs'])? $_GET['tojs']:NULL;
		$this->DataCount = $count;
		$this->row = !empty($_GET[$this->skey])? Intval($_GET[$this->skey]) :$rows;
		$this->cPage = $this->getCpage();
		$this->pageNumber = $this->getCount();
		$this->startNum = $this->startRow();
		$this->endNum = $this->endRow();
		$this->shift = $this->startNum - 1;
		$this->uri = $this->setUri();

	}


	public function getPage($limit = '1,2,3,4,5,6,7,8'){
		if($limit == false){
			return array('count'=>$this->DataCount,'pages'=>$this->pageNumber,'rows'=>$this->row);
		}
		$getKey = explode(',', $limit);
		$page[1] = $this->getStart();
		$page[2] = $this->getPrev();
		$page[3] = $this->getPages();
		$page[4] = $this->getNext();
		$page[5] = $this->getEnd();
		$page[6] = "<span class='Pnumber'>{$this->cPage}/{$this->pageNumber}</span>";
		$page[7] = "<span class='Pline'>{$this->fo}".$this->startNum."-".$this->endNum."{$this->line}</span>";
		$page[8] = "<span class='Pcount'>{$this->countStart} {$this->DataCount} {$this->countEnd}</span>";
		$retuls = '<div>';
		foreach($getKey as $key=>$value){
			$retuls .= $page[$value];
		}
		$retuls .='</div>';
		return $retuls;
	}
	private function startRow(){
		return ($this->cPage -1)*$this->row+1;
	}

	private function getCpage(){
		if(!empty($_GET[$this->pkey])){
			if($_GET[$this->pkey] >=1 and $_GET[$this->pkey] <= $this->DataCount){
				$cp = $_GET[$this->pkey];
			}else{
				$cp = 1;
			}
		}else{
			$cp = 1;
		}
		return $cp;
	}

	private function endRow(){
		return $this->cPage*$this->row;
	}

	private function getPages(){
		$pages = '';
		if(($this->pageNumber - $this->cPage) < $this->listNum){
			$num = $this->listNum + ($this->listNum - ($this->pageNumber - $this->cPage));
		}else{
			$num = $this->listNum;
		}
		for($i=$num;$i>=1;$i--){
			$page = $this->cPage - $i;
			if($page >0){
				$pages .= $this->isjs==NULL? "<a class='Pnum' href='{$this->uri}{$this->pkey}={$page}'>{$page}</a>":"<a class='Pnum' onclick='{$this->isjs}({$page})'>{$page}</a>";
			}

		}
		if($this->cPage > 0){
				$pages .= "<span class='Pcurrent'>{$this->cPage}</span>";
		}
		if($this->cPage <= $this->listNum){
			$num = $this->listNum + ($this->listNum - $this->cPage)+1;
		}else{
			$num = $this->listNum;
		}
		for($i=1;$i<=$num;$i++){
			$page = $this->cPage + $i;
			if($page > $this->pageNumber){
				break;
			}
			$pages .= $this->isjs==NULL? "<a class='Pnum' href='{$this->uri}{$this->pkey}={$page}'>{$page}</a>":"<a class='Pnum' onclick='{$this->isjs}({$page})'>{$page}</a>";
		}
		return $pages;
	}

	private function getNext(){
		if($this->cPage >= $this->pageNumber){
			$Str = '';
		}else{
			$Str = $this->isjs==NULL? "<a class='Pnext' href='{$this->uri}{$this->pkey}=".($this->cPage+1)."'>{$this->next}</a>":"<a class='Pnext' onclick='{$this->isjs}(".($this->cPage+1).")'>{$this->next}</a>";
		}
		return $Str;
	}

	private function getEnd(){
		if($this->cPage >= $this->pageNumber){
			$Str = '';
		}else{
			$Str = $this->isjs==NULL? "<a class='Pend' href='{$this->uri}{$this->pkey}={$this->pageNumber}'>{$this->end}</a>":"<a class='Pend' onclick='{$this->isjs}({$this->pageNumber})'>{$this->end}</a>";
		}

		return $Str;
	}

	private function getPrev(){
		if($this->cPage == 1){
			$Str = '';
		}else{
			$Str = $this->isjs==NULL? "<a class='Ppren' href='{$this->uri}{$this->pkey}=".($this->cPage-1)."'>{$this->prev}</a>":"<a class='Ppren' onclick='{$this->isjs}(".($this->cPage-1).")'>{$this->prev}</a>";
		}
		return $Str;
	}

	private function getStart(){
		if($this->cPage == 1){
			$Str = '';
		}else{
			$Str = $this->isjs==NULL? "<a class='Pstart' href='{$this->uri}{$this->pkey}=1'>{$this->start}</a>":"<a class='Pstart' onclick='{$this->isjs}(1)'>{$this->start}</a>";
		}

		return $Str;
	}

	private function setUri(){
		$url = $_SERVER['REQUEST_URI'];
		if(strstr($url,'?')){
			$arr = parse_url($url);
			if(isset($arr['query'])) parse_str($arr['query'],$output);
			unset($output[$this->pkey]);
			$null = '';
			if(count($output) > 0){
				$null = '&';
			}
			$url = $arr['path'].'?'.http_build_query($output).$null;
		}else{
			$url .='?';
		}
		return $url;
	}
	private function getCount(){
		return Intval(ceil($this->DataCount / $this->row));
	}
}
?>
