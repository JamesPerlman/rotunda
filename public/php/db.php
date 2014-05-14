<?php
	// connect to db
	mysql_connect(getenv('OPENSHIFT_MYSQL_DB_HOST'), getenv('OPENSHIFT_MYSQL_DB_USERNAME'), getenv('OPENSHIFT_MYSQL_DB_PASSWORD'), "", getenv('OPENSHIFT_MYSQL_DB_PORT')) or die("Error: " . mysql_error());
mysql_select_db('james') or die("Error: " . mysql_error());
/*
	mysql_connect('127.0.0.1', 'adminrI7Qdbb', 'j4YB6Gm7Lvch');
	mysql_select_db('james') or die("Error: " . mysql_error());
	*/
?>