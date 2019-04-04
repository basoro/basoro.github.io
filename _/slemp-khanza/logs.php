<?php

require './Common.php';


if(isset($_GET['action'])){
	$_GET['action']();
	exit;
}


require './public/head.html'; 
require './public/menu.html';
require './public/logs.html';
require './public/footer.html';
?>
