// JavaScript Document - Created by James Perlman in Haiku, HI sometime in early 2013.  Updated and modularized starting Saturday, May 31, 2014 in Austin, TX
// set up vars
var draw = (function(mplug) {
	var isDrawing, // (true or false)
		drawingData, // (data being collected)
		polygonPoints, // current polygon
		polygons, // array of all drawn polygons waiting to be flushed to the server
		canvas, statusDiv, // 
		c, ctx,
		sending, drawing,
		numPoints=0, totalPoints=0, maxPoints=2048,
		dataSendTimeout, waitSeconds = 3,
		xmlhttp,
		lineWidth = 2, color="000000",
		m=mplug;
	
	var init=function() {
		polygons = new Array();
		canvas = document.getElementById("canvas");
		statusDiv = document.getElementById("status");
		ctx = canvas.getContext('2d');
		ctx.lineWidth=lineWidth;
		ctx.strokeStyle="#" + color;
		
		
		canvas.ontouchstart = function(e) { 
			if (e.touches.length==1) {
				e.preventDefault(); draw.mouseDown(e);
			}
		}
		canvas.ontouchmove = function(e) {if (e.touches.length==1){e.preventDefault(); draw.mouseMove(e);}  }
		canvas.ontouchend = function(e) {draw.mouseUp();}
		
		canvas.addEventListener("mousedown", draw.mouseDown);
		canvas.addEventListener("mousemove", draw.mouseMove);
		canvas.addEventListener("mouseup", draw.mouseUp);
		canvas.addEventListener("mouseout", draw.mouseUp);
		
	
	}
	var setThick=function(tStr) {
		lineWidth = parseInt(tStr);
		ctx.lineWidth = lineWidth;
	}
	var setColor=function(cStr) {
		color = cStr;
		ctx.strokeStyle="#" + color;
	}
	var setStatus=function(msg) {
		statusDiv.innerHTML = msg;
	}
	
	var mouseDown=function(e) {
		setStatus("Editing");
		c=m.update(e);
		startDrawing(c.x, c.y);
		if (dataSendTimeout) {
			clearTimeout(dataSendTimeout);
			dataSendTimeout = 0;
		}
	}
	
	// called when the cursor is moved
	var mouseMove=function(e) {
		if (drawing) {
			c=m.update(e);
			drawToPoint(c.x, c.y);
			if (++numPoints>maxPoints) {
				stopDrawing(e);
				flushDrawingData();
				startDrawing(c.x,c.y);
			}
		}
	}
	
	
	// called on mouseUp event
	var mouseUp=function() {
		if (drawing) {
			setStatus("Edited");
			stopDrawing();
			dataSendTimeout = setTimeout(flushDrawingData, 1000*waitSeconds);
		}
	}
	
	var startDrawing=function(_x, _y) {
		drawing = true;
		polygonPoints = [lineWidth, color, _x, _y];
	}
	
	// this method draws a line point as efficiently as possible
	var drawToPoint=function(_x, _y) {
		
		ctx.beginPath();
		
		ctx.moveTo(polygonPoints[polygonPoints.length-2], polygonPoints[polygonPoints.length-1]);
		
		ctx.lineTo(_x, _y);
		
		ctx.closePath();
		
		ctx.stroke();
	
		polygonPoints.push(_x, _y);
	
	}
	
	var stopDrawing=function() {
		drawing = false
		//updateCursor(e);
		polygonPoints.push(c.x, c.y);
		polygons.push(polygonPoints);
	}
	
	// turn vectors into an image
	var rasterizeCanvas=function() {
		var imageData = ctx.getImageData(0,0, canvas.width, canvas.height)
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(imageData, 0, 0);
	}
	// returns a string of polygon data
	var stringData=function() {
		var datastr = "";
		for (var j=0; j<polygons.length; j++)
			datastr += polygons[j].join(',') + "!";
		return datastr;
	}
	
	var flushDrawingData=function() {
		sendDrawingData();
		polygons.length=0;
	
		if ((totalPoints+=numPoints)>=maxPoints) {
			totalPoints=0;
			rasterizeCanvas();
		}
	
		numPoints=0;
	}
	// sends current drawn data to the server for processing
	var sendDrawingData=function() {
		strData = stringData();
		if (!strData) return;
		
		setStatus("Saving...");
	
		xmlhttp=null;
	
		var Url="../php/draw.php?"          // THE SERVER SCRIPT TO HANDLE THE REQUEST 
	
	
	  if (window.XMLHttpRequest) {
	
		  xmlhttp=new XMLHttpRequest()                            // For all modern browsers
	
	  } else if (window.ActiveXObject) {
	
		 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")   // For (older) IE
	
	  }
	
	
	 if (xmlhttp!=null)  {
	
		 xmlhttp.onreadystatechange=processDrawingResponse;
	  
	
	   // How to send a POST request
		xmlhttp.open("POST", Url, true);                                                         //  (httpMethod,  URL,  asynchronous)
	
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	
		 xmlhttp.send("data="+strData);	
	  } else
		 alert("This app won't work :( No xmlhttp support on your browser.");
	}
	
	var processDrawingResponse=function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.responseText == "success" && xmlhttp.status == 200)
				setStatus("Saved");
			else
				setStatus("Failed");
		}
	}
	
	return {
		init:init,
		mouseDown:mouseDown,
		mouseMove:mouseMove,
		mouseUp:mouseUp,
		setColor:setColor,
		setThick:setThick
	}
})(MPlug);