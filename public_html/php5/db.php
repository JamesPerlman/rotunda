<?php
	// connect to db
	$link = mysql_connect('127.0.0.1', 'adminrI7Qdbb', 'j4YB6Gm7Lvch');
	/*if (!$link) {
		die('Could not connect: ' . mysql_error());
	}
	echo 'Connected successfully';
	*/
	mysql_select_db('james');
echo mysql_error();
?>