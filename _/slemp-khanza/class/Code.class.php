<?php
class Code{
	private $fontSize;
	private $width;
	private $heigth;
	private $sum;
	private $img;
	private $code = array();
	public $type = 2;
	public $font = 4;
	public $str = NULL;
	public $inCurve = true;
	public $inNoise = true;

	public function __construct($size=20,$sum = 4){
		$this->sum = $sum;
		$this->fontSize =  !empty($_GET['codeSize'])? $_GET['codeSize']:$size;
		$this->width = $this->fontSize*$this->sum;
		$this->heigth = $this->fontSize*1.5;
	}

	public function getImage(){
		$this->createCode();
		$this->createImage();
		$this->createNoise();
		$this->createCurve();
		$this->printString();
		header('Cache-Control: private, max-age=0, no-store, no-cache, must-revalidate');
        header('Cache-Control: post-check=0, pre-check=0', false);
        header('Pragma: no-cache');
        header("content-type: image/png");
		imagepng ($this->img);
	}

	static function check($code,$now_time = 1800){
		if(empty($code) || empty($_SESSION['vcode'])){
			return false;
		}
		if(time() - $_SESSION['vtime'] > $now_time){
			return false;
		}
		if(md5($code) == $_SESSION['vcode']){
			return true;
		}
		return false;
	}

	private function createImage(){
		$this->img = imagecreatetruecolor($this->width, $this->heigth);
		$color = imagecolorallocate($this->img, rand(200, 255), rand(200, 255), rand(200, 255));
		imagefill($this->img, 1, 1, $color);
	}

	private function createNoise(){
		if(!$this->inNoise) return;
		$codeSet = '2345678abcdefhijkmnpqrstuvwxyz';
		$noiseSum = strlen($codeSet)-1;
        for($i = 0; $i < 5; $i++){
            $noiseColor = imagecolorallocate($this->img, mt_rand(150,225), mt_rand(150,225), mt_rand(150,225));
            for($j = 0; $j < 2; $j++) {
                // 绘杂点
                imagestring($this->img, 5, mt_rand(-10, $this->width),  mt_rand(-10, $this->heigth), $codeSet[mt_rand(0, $noiseSum)], $noiseColor);
            }
        }
	}

	private function createCurve() {
		if(!$this->inCurve) return;
        $px = $py = 0;
        $A = mt_rand(1, $this->heigth/2);
        $b = mt_rand(-$this->width/4, $this->heigth/4);
        $f = mt_rand(-$this->heigth/4, $this->heigth/4);
        $T = mt_rand($this->heigth, $this->width*2);
        $w = (2* M_PI)/$T;

        $px1 = 0;
        $px2 = mt_rand($this->width/2, $this->width * 2);
		$color = imagecolorallocate($this->img, rand(1, 100), rand(50, 150), rand(50, 150));
        for ($px=$px1; $px<=$px2; $px = $px + 1) {
            if ($w!=0) {
                $py = $A * sin($w*$px + $f)+ $b + $this->heigth/2;
                $i = (int) ($this->fontSize/5);
                while ($i > 0) {
                    imagesetpixel($this->img, $px + $i , $py + $i, $color);
                    $i--;
                }
            }
        }
    }

	private function printString(){
		if(isset($_GET['codeFont'])) $this->font = $_GET['codeFont'];
		if($this->font == 0 || $this->font > 6){
			$this->font = mt_rand(1,6);
		}
		$font = dirname(__FILE__).'/font/'.$this->font.'.ttf';
		$x = 0;
		for($i=0;$i<$this->sum;$i++){
			$color = imagecolorallocate($this->img, rand(30, 150), rand(30, 150), rand(30, 150));
			$x = mt_rand($this->fontSize*$i*0.95,$this->fontSize*$i*1.1);
			$y = $this->fontSize*1.1;
			imagettftext($this->img, $this->fontSize, mt_rand(-10, 10), $x, $y, $color, $font, $this->code[$i]);
		}

	}

	private function createCode(){
		$number = "3456789";
		$letter = "qwertyuipasdfghjkzxcvbnmQWERTYUPASDFGHJKXCVBNM";
		switch($this->type){
			case 0:
				$codeText = $number;
				break;
			case 1:
				$codeText = $letter;
				break;
			case 2:
				$codeText = $letter.$number;
				break;
			default:
				$codeText = $number;
				break;
		}
		if(!is_null($this->str) and $this->str != "") $codeText = $this->str;
		$strLen = strlen($codeText);
		$codes = '';
		for($i=0;$i<$this->sum;$i++){
			$this->code[$i] = $codeText{rand(0, $strLen-1)};
			$codes .= $this->code[$i];
		}
		@session_start();
		$_SESSION['vcode'] = md5(strtolower($codes));
		$_SESSION['vtime'] = time();
	}

	function __destruct(){
		@imagedestroy ($this->img);
	}
}
?>
