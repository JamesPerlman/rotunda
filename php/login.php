<?php
// login.php - accept postdata and return a 1 or a 0 (true or false)
	if ($_POST["u"]=='james' && $_POST["p"] == hash("sha256", "edgar")) {
		session_start();
		$_SESSION["admin"]="1";
		$_SESSION["user"]="James";
		echo 1;	
	} else echo 0;
?>