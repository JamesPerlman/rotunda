<?php
	// connect to db
	/*mysql_connect(getenv('OPENSHIFT_MYSQL_DB_HOST'), getenv('OPENSHIFT_MYSQL_DB_USERNAME'), getenv('OPENSHIFT_MYSQL_DB_PASSWORD'), "", getenv('OPENSHIFT_MYSQL_DB_PORT')) or die("Error: " . mysql_error());
mysql_select_db('james') or die("Error: " . mysql_error());
*/
	if ($_SERVER['SERVER_ADDR']=='::1')
		mysql_connect('127.0.0.1', 'adminrI7Qdbb', 'j4YB6Gm7Lvch');
	else
		mysql_connect('127.3.32.130', 'adminrI7Qdbb', 'j4YB6Gm7Lvch') or die('hi');
	mysql_select_db('james') or die("Error: " . mysql_error());
	
?>