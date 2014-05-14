// functions.js - global functions
var loadFile = function(file, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET",file,true);
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
			callback(xmlhttp.responseText);
		}
	}
	xmlhttp.send();
};