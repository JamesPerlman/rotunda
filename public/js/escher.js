// Escherizer - create a two-dimensional tessellated design on the web.  Started at 11:32 AM on Friday, May 23, 2014 by James E Perlman in Austin, TX

var esch = (function(m) {
	var p_array=null, canvas, grid, ctr, mouse = m, max_i=10, color='#000000',
		v=[0,0, .5,0, 1,0, 1,.5, 1,1, .5,1, 0,1, 0,.5],
		w=Math.PI*.75, r2=Math.SQRT2, ir2=[1,1/r2], tri=null,lev=null,rast=true;
		
	function clr() {
		canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
	}
	
	function onLoad() {
		canvas.addEventListener("mousedown", esch.mouseDown);
		ctr = {x:canvas.width/2,y:canvas.height/2};
		drawGrid();
		canvas.addEventListener("mousemove", esch.mouseMove);
		canvas.addEventListener("mouseout", esch.mouseOut);
		canvas.addEventListener("mouseup", esch.mouseUp);
	}
	
	function mDown(e) {
		rast=false;
		var p=mouse.update(e);
		if (lev===null && tri===null) {
			lev=level(p);
			tri=triangle(p,lev);
		}
		draw(p);
	}
	
	function mMove(e) {
		if (!p_array) return;
		var p=mouse.update(e);
		draw(p);
	}
	function mUp(e) {
		p_array = lev = tri = null;
	}
	function drawGrid() {
		if (!grid) return;
		
		var ctx = grid.getContext('2d'),
		s = Math.SQRT2;
		ctx.lineWidth = 0;	
		var drawSquare = function (k,ctx) {
			ctx.translate(canvas.width/(2*s), k*canvas.height/(2*s));
			ctx.strokeRect(0,0,(canvas.width)/s,(canvas.height)/s);
		}
		
		ctx.strokeStyle='#000';
		ctx.lineWidth=1;
		for (i=0;i<max_i;i++) {
			ctx.save();
			ctx.rotate(Math.PI/4);
			drawSquare(-1,ctx)
			ctx.restore();
			s*=r2;
			drawSquare(1,ctx);
			s*=r2;
		};
		// works.
		ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
	}
	
	function level(p) {// returns the power to raise 1/2 to in order to get the scaling factor of the square from the center
		var d=Math.max(Math.abs(ctr.x-p.x),Math.abs(ctr.y-p.y));
		return d==0?1:Math.ceil(Math.log(d*1024/canvas.width)/Math.log(2))+1;
	}
	function rotax(p,o,n) {
		var dx=p.x-o.x,
			dy=p.y-o.y,
			d=Math.sqrt(dx*dx+dy*dy),
			q=dy==0?d:dx/dy,
			b= ((dy>0||dx>0&&dy==0)||-1)*d/(n*Math.sqrt(2*(1+q*q)));
		return {x: (1+q)*b, y:(1-q)*b};
	}
	function draw(p) {
		// draw in each level...assume a square canvas
		var arr=[],b=[],d,k,l,o,q=normal(p,lev,tri),s=canvas.width*2,t,vert;
		t=Math.atan2(q.y,q.x)+w;
		d=Math.sqrt(q.x*q.x + q.y*q.y);
		for (var a, i=0;i<8;i++) {
			a = Math.atan2(v[i*2+1]-.5, v[i*2]-.5)+t;
			b[i] = P(Math.cos(a),Math.sin(a));
		}
		for (var i=0;i<max_i;i++) {
			l = s/2 * d;
			for (var j=0;j<8;j++) {
				o = P(ctr.x+s*(v[j*2]-.5), ctr.y+s*(v[j*2+1]-.5));
				arr[i*8+j] = P(o.x + ir2[j%2]*l*b[j].x, o.y+ir2[j%2]*l*b[j].y);
			}
			s/=2;
		}
		// after we have located all the points, we either start drawing or we continue drawing
		if (p_array) { // continue drawing
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
			for (var i=0; i<max_i*8; i++) {
				ctx.moveTo(p_array[i].x, p_array[i].y);
				ctx.lineTo(arr[i].x,arr[i].y);
			}
			ctx.stroke();
		}
		p_array = arr;
		
	}
	function _grid() {
		var g=grid.style;
		g.visibility=(g.visibility=='visible')?'hidden':'visible';
		return (g.visibility=='hidden');
	}
	function P(x,y) { return {x:x,y:y}; }
	// normalize coordinates between 0 and 1
	
	function normal(p,m,n) {
		var r = Math.pow(2,m-1)*canvas.width/1024,
			x=p.x-ctr.x+r,
			y=p.y-ctr.y+r,
			z = r/Math.SQRT2,
			k;
		k = !n ? P(x/r,y/r)
		: n==1 ? rotax(p,P(ctr.x,ctr.x-r),z)
		: n==2 ? P(x/r,y/r)
		: n==3 ? rotax(P(p.y,canvas.width-p.x),P(ctr.y,ctr.x-r),z)
		: n==4 ? P(2-x/r,2-y/r)
		: n==5 ? rotax(P(canvas.width-p.x,canvas.height-p.y),P(ctr.x,ctr.y-r),z)
		: n==6 ? P(2-x/r,2-y/r)
		: rotax(P(canvas.height-p.y,p.x),P(ctr.y,ctr.x-r),z);
		return k;
	}
	function rasterize() {
		if (rast) return;
		window.open(canvas.toDataURL());
		rast=true;
	}
	function triangle(p,n) {// returns the triangle index (clockwise from top left) at the current level.
		var r=Math.pow(2,n-1)*canvas.width/1024,
			x=p.x-ctr.x+r,
			y=p.y-ctr.y+r,
			d=[y<r-x, y<x-r, y>3*r-x,y>x+r],// diagonals;
			s=[y<r/2, x>3/2*r, y>3/2*r, x<r/2],// sides
			i=d[0]?0:!d[1]&&s[0]?1:!d[3]&&s[3]?7:d[1]?2:d[2]?4:!d[1]&&s[1]?3:!d[3]&&s[2]?5:d[3]&&6;
		return i;
	}
	return {
		clear : clr,
		init : onLoad,
		mouseDown : mDown,
		mouseMove : mMove,
		mouseOut : mUp,
		mouseUp : mUp,
		rast : rasterize,
		setCanvas: function(c,g) { canvas = c; grid=g; },
		setColor : function(c) { var ctx = canvas.getContext('2d'); ctx.strokeStyle = c; },
		toggleGrid : _grid
	}
})(MPlug);
// Finished by James Perlman on Friday, May 31, 2014
// Approximately 20 hours of work