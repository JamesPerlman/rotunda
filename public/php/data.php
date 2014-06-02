<?php
	//if ($_SERVER['QUERY_STRING'] == 'getlinks') {
		// here we would connect to MySQL and request links
		// for now we will use an array;
		include 'db.php';
		$result = mysql_query("SELECT * FROM `navigation`");
		$index = array();
		// get as linear list
		while ($row = mysql_fetch_assoc($result)) {
			$index[$row["id"]] = $row;
			if ($row["action"]=='folder') $index[$row["id"]]['action']=array();
		}
		for ($i=count($index)-1;$i>0;$i--) {
			array_unshift($index[$index[$i]['folder']-1]['action'],$index[$i]);
		};
		$links=array($index[0]);
		
		// layout JSON
		// recursive array builder
		function buildJSONArray($items) {
			$menu = array();
			for ($i = 0; $i < count($items); $i++) {
				$sub = array();
				foreach ($items[$i] as $k => $v) {
					array_push(
						$sub,
						"\"$k\":" . (is_array($v) ? "[".buildJSONArray($v)."]" : "\"$v\"")
					);
				}
				array_push($menu,'{'.implode(',',$sub).'}');
			}
			return implode($menu,',');
		};
		$home = buildJSONArray($links);
		echo '[' . $home . ']';
		
			
	//};
?>