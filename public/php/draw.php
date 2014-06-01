<?php
include 'drawfuncs.php';
// draw.php recieves polygon data
$IMGSIZE = 1024;
 // first check if all parameters are good
if (!$_POST["data"]) exit("fail");
$data = $_POST["data"];
if (validate_data($data)) {
	$polylines = get_polylines($data);
	draw_to_image($polylines);
	exit (draw_to_image($polylines)?"success":"fail");
}
?>
