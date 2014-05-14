<?php
	// connect to db
	$link = mysql_connect('127.0.0.1', 'admin3sLgrat', '2clviRKHGxXQ');
	/*if (!$link) {
		die('Could not connect: ' . mysql_error());
	}
	echo 'Connected successfully';
	*/
	mysql_select_db('james');
echo mysql_error();
?>