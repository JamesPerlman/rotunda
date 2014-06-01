<?php
function new_image() {
	//for ($i=$a;$i<=$b;$i++) {
		$im = imagecreate(1024, 1024);
		$c = imagecolorallocate($im, 255, 255, 255);
		imagejpeg($im, img_path());
		imagecolordeallocate($im, $c);
	//}
}
//new_images(1, 12);
//new_images(13, 25);

function img_path() { return "../img/graffiti/canvas.jpg"; }

function draw_to_image($polylines) {
	// load image
	$bounds = get_bounds($polylines);
	
	$masterfile =  imagecreatefromjpeg(img_path());
	// draw data into context
	foreach($polylines as $points_array) {
		if (count($points_array)>=8) {
			$lineWidth = $points_array[0];
			$lineColor = $points_array[1];
			imagepolyline($masterfile, $lineWidth, $lineColor, array_slice($points_array, 2));
		}
	}
	if (imagejpeg($masterfile, img_path())) return true;
}

function imagepolyline($image, $thick, $color, $points) {
	imagesetthickness($image, $thick);
	$r = substr($color, 0, 2);
	$g = substr($color, 2, 2);
	$b = substr($color, 4, 2);
	$col = imagecolorallocate($image, hexdec($r), hexdec($g), hexdec($b));
	$poly = $points;
	$poly = palindromePoly($poly);
	
	$image = imagepolygon($image, $poly, count($poly)/2, $col);
	return $image;	
		
}

function palindromePoly($array) {
	$reversed = array_slice(array_reverse($array), 2, count($array)-4);
	for ($i=0; $i<count($array)-4; $i+=2) {
		$tmp_value = $reversed[$i];
		$reversed[$i]=$reversed[$i+1];
		$reversed[$i+1]=$tmp_value;
	}
	return array_merge($array, $reversed);
}

#Data validation / processing / parsing into arrays
function validate_data($str) { return preg_match('/\A(\d{1,2}(\.\d)?,[a-fA-F\d]{6}((,\d{1,4}){2})+!)+\Z/',$str); }

function is_valid_polyline($str) { return preg_match('/\A(\d{1,2}(\.\d)?,[a-fA-F\d]{6}((,\d{1,4}){2})+)\Z/',$str); }

function get_polylines($str) {
	$a=array();
	
	foreach (explode('!',$str) as $poly) array_push($a, get_points($poly));
			
	return $a;
}

function get_points($str) {
	return explode(',',$str);
}

function get_bounds($polylines) {
	$left=$polylines[0][2];
	$top=$polylines[0][3];
	$right=$left;
	$top=$bottom;
	foreach($polylines as $points) {
		$i=0;
		foreach (array_slice($points,2) as $v) {
			$i=1-$i;
			if ($i) { //x
				if ($v<$left) $left=$v;
				if ($v>$right) $right=$v;
			} else { //y
				if ($v<$top) $top=$v;
				if ($v>$bottom) $bottom=$v;
			}
		}
	}
	$width=$right-$left+1;
	$height=$bottom-$top+1;
	
	return Rect($left,$top,$width,$height);
}

function remap_points($points, $offsetX, $offsetY) {
	$i=0;
	$a=array();
	foreach ($points as $v) {
		$i=1-$i;
		array_push($a,(int)$v-($i ? $offsetX : $offsetY));
	}
	return $a;
}

function Rect($x, $y, $width, $height) { 
	if ($width<0 || $height<0) throw new Exception('Invalid dimensions for Rect');
	return array('x'=>$x,'y'=>$y,'w'=>$width,'h'=>$height);
}

?>