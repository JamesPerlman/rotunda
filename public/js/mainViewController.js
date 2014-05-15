// Main Link Button Controller.Created by James Perlman on April 4th, 2014 at 12:06PM
var lvc = (function(){
	var navFolders = [{x:0,z:0,id:0}];
	var center = {x:500, y:500};
	var cam = {x:0,y:.8,z:2};
	var curLevel = 1, lastLevel=1, curFolder=0, lastFolder=0;
	var cscale = 600;
	var cur = -1;
	var enabled = true;
	var fLen = 400;
	var minAngle = Math.PI/6;
	var model, parent;
	var rings = [];
	var tEffect = 0.25;
	// this is very messy
	function build(linkdata,element) {
		if (linkdata && element) {
			model = linkdata;
			parent = element;
			// enumerate through folders
			model.eachFolder(function(i,f) {
				// add a ring of position coordinates
				addRing(f.length);
				// loop through objects
				for (var j=0;j<f.length;j++) {
					// create button
					var btn = new ButtonView(model.getLink(f[j]));
					model.getLink(f[j]).view = btn;
					parent.appendChild(btn.div);
					addEvents(btn.div,f[j]);
					
					if (i>curLevel)
						btn.div.style.opacity = 0;
					else {
						btn.x = i*rings[i][j].x;
						btn.z = i*rings[i][j].z;
						//if (btn.z>cam.z+fLen)
						//btn.div.style.opacity=0;
						//alert (btn.x + ":" + btn.z);
					}
				};
				//parent.appendChild(fe);
				
			});
			
			setupDisplay();
			
		};
	};
	
	function addRing(n) {
		var _max = Math.PI*1.5, _min=.5;
		if (n<=7) { _max=Math.PI*.499; _min=-Math.PI*.499; }
		var theta = n==1 ? Math.PI*.5 : (_max-_min)/(n-1);
		var o = Math.PI/2+_min;
		var ring=[];
		for (var i=0;i<n;i++)
			ring.push({x:Math.cos(o+i*theta),z:Math.sin(o+i*theta),t:o+i*theta});
		rings.push(ring);
	}
	function addEvents(obj,id) {
		obj.setAttribute('onClick','lvc.sel('+id+')');
		obj.setAttribute('onMouseOver', 'lvc.mOver('+id+')');
		obj.setAttribute('onMouseOut', 'lvc.mOut('+id+')');
	}
	function render3D() {
		model.eachFolder(function(i,f) {
			if(i<=curLevel) {
				var obj,x,y,h,dy,k;
				
				for(j=0;j<f.length;j++)
					setPos3D(linkData.getLink(f[j]).view);
			};
		});
		sortByDepth();
	}
	
	function rot_angle() {
		var mat = $("#rotator").css("transform").split(",");
		return Math.atan2(mat[1],mat[3]);
	}
	
	function setOffsets(){
		model.eachFolder(function(i,f) {
			if (i<=curLevel)
				for (j=0;j<f.length;j++) {
					var obj = model.getLink(f[j]).view;
					obj.setBase(obj.base.x,obj.base.y);
				}
			
		});
	};
	function setPos3D(obj) {
		dz = obj.z-cam.z;
		k = fLen/dz;
		// geometrically find x and y in 2d view
		// resize object
		obj.setSize(-100/dz);
		obj.setBase((cam.x-obj.x)*k+center.x,(cam.y-obj.y)*k+center.y);
	}
	// position elements
	function setupDisplay() {
		render3D();
		// make sure object offsets stay up to date
		// put buttons in concentric rings
		 // linkData.eachFolder
		// center home button
		//directory.links()[0].view.setBase(center.x,center.y);
		
		// put other buttons in concentric rings
	}
	// rotate shortest distance
	function shortDist(m,c,t) {
		if (t==c) return 0;
		else return .5;
		var k=(t>c)?1:-1;
		return Math.min(m-k*(t-c),k*(t-c));
	}
	function shortWay(m,c,t) {
		// max, current, target
		var k,r
		// decimal modulo (m%t)
		// quick floor ~~
		// remainder
		// r = t - ~~(t/m); 
		if (c==t) return 0;
		
		k=(t>c)?1:-1;
		return m-k*(t-c)>k*(t-c) ? 1:-1;
	}
	// this is easy to read. functions have been nicely categorized, but is hardly optimized
	function sortByDepth() {
		var arr=[],z,p=-1,view;
		for (var i=0;i<model.count();i++) {
			view = model.getLink(i).view;
			// add depth value of object at index i to array
			z=view.z;
			for (var j=0;j<arr.length;j++) {
				// compare depth of object i to value in arr at index j
				if (z<arr[j].z){
					//alert(z+"<"+arr[j]+":"+(z<arr[j]));
					p=j;// position sentinel (p=new position)
					break;
				}
			}
			if(~p) //not found
				arr.splice(p,0,{z:z,id:i});
			else
				arr.push({z:z,id:i});
			
			p=-1;
		};
		for (var i=0;i<arr.length;i++) {
			model.getLink(arr[i].id).view.div.style.zIndex = i;
		}
		
	}
	// animation
	function _changeFolder(id) {
		
		enabled=false;
		lastFolder = curFolder;
		curFolder = id;
		lastLevel = curLevel;
		curLevel = model.getFolderIndex(curFolder);
		// check which direction we are moving (into a folder or out of one)
		TweenLite.ticker.addEventListener("tick", lvc.changeFolderTick);
		TweenLite.to($("#rotator"), tEffect, {directionalRotation: -90+"deg_short", onComplete:lvc.changeFolderDone});
		var k = (id > lastFolder) ? 0 : 2;
		model.eachIn(lastFolder, function(i,obj) {
			TweenLite.to(obj.view, tEffect, {x:rings[lastLevel][i].x*k,z:rings[lastLevel][i].z*k});
			TweenLite.to(obj.view.div, tEffect, {opacity:0});
		});
			
		model.eachIn(curFolder, function(i,obj) {
			obj.view.div.style.visibility = "visible";
			TweenLite.to(obj.view, tEffect, {x:rings[curLevel][i].x,z:rings[curLevel][i].z});
			TweenLite.to(obj.view.div, tEffect, {opacity:1});
		});
	}
	function _changeFolderTick() {
		
		model.eachIn(curFolder, function(i,obj) { setPos3D(obj.view); });
		model.eachIn(lastFolder, function(i,obj) { setPos3D(obj.view); });
		sortByDepth();
	}
	function _changeFolderDone() {
		enabled = true;
		_changeFolderTick();
		model.eachIn(lastFolder, function(i,obj) { obj.view.div.style.visibility="hidden"; });
		TweenLite.ticker.removeEventListener("tick", lvc.changeFolderTick);
		
	}
	// menu navigation
	function _itemMouseClick(id) {
		if (!enabled) return;
		var obj = model.getLink(id);
		// folder
		if( typeof obj.action == "number") {
			if (curFolder!=id) _changeFolder(id);
		} else
			_rotateTo(id);
		
	}
	function _itemMouseOut(id) {
		TweenLite.to($('#btn'+id+" .ButtonTop .ButtonIcon"), tEffect,
						{boxShadow:"0px 0px 0px"});
		TweenLite.to($('#btn'+id+" .ButtonReflection .IconReflection"), tEffect,
						{boxShadow:"0px -5px 15px #000"});
	}
	function _itemMouseOver(id) {
		//alert(TweenLite);
		TweenLite.to($('#btn'+id+" .ButtonTop .ButtonIcon"), tEffect,
						{boxShadow:"0px 0px 15px #fff"});
		TweenLite.to($('#btn'+id+" .ButtonReflection .IconReflection"), tEffect,
						{boxShadow:"0px -5px 15px #555"});
	}
	function _itemMouseUp(id) {
	}
	// rotate on a timer
	function _rotateTo(id) {
		var d;
		
		//var theta = rot_angle()*180/Math.PI;
		
		if ((d=shortDist(rings[curLevel].length,cur,id))) {
			enabled = false;
			cur = id;
			TweenLite.to($("#rotator"), d,
			{
				directionalRotation: 180*(1+rings[curLevel][model.getLinkIndex(id)].t/Math.PI) + "deg_short",
				onComplete:lvc.rotateDone
			});
			_itemMouseOut(id);
			TweenLite.ticker.addEventListener("tick", lvc.rotateTick);
		};
	}
	function _rotateDone() {
		_rotateTick();
		TweenLite.ticker.removeEventListener("tick", lvc.rotateTick);
		enabled = true;
		model.eachIn(curFolder, function(i,obj) {
			obj.view.draw();
			
		});
		//theta *= 180 / Math.PI;
		
						
	}
	function _rotateTick() {
		var theta = rot_angle();
		model.eachIn(curFolder, function(i,obj) {
			// change values
			obj.view.x = Math.cos(-Math.PI/2-theta+rings[curLevel][i].t);
			obj.view.z = Math.sin(-Math.PI/2-theta+rings[curLevel][i].t);
			setPos3D(obj.view);
			obj.view.draw();
		});
		sortByDepth();
	}
	return {
		init : build,
		sel:_itemMouseClick,
		mOver:_itemMouseOver,
		mOut:_itemMouseOut,
		mUp:_itemMouseUp,
		rotateDone:_rotateDone,
		rotateTick:_rotateTick,
		changeFolderDone:_changeFolderDone,
		changeFolderTick:_changeFolderTick
	};
})();
window.t=0;