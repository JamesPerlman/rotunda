// Main Link Button Controller.Created by James Perlman on April 4th, 2014 at 12:06PM
var lvc = (function(){
	var cam = {x:0,y:.8,z:2},
		center = {x:500, y:500},
		cur = -1, curLevel = 1, curFolder=0,
		enabled = true,
		fLen = 400,
		lastLevel=1, lastFolder=0,
		minAngle = Math.PI/6,
		model, navFolders = [{x:0,z:0,id:0}],
		nav=[0],
		parent,
		rings = [],
		tEffect = 0.25;
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
					
					if (i>curLevel) btn.div.style.opacity = 0;
					var k = Math.min(1.5,i);
					btn.x = k*rings[i][j].x;
					btn.z = k*rings[i][j].z;
				};
			});
			setupDisplay();
		};
	};
	
	function addRing(n) {
		var _max = Math.PI*1.5, _min=-Math.PI*.5;
		var theta;
		if (n<=7) { 
			_max=Math.PI*.499; _min=-Math.PI*.499;
			
			theta = n==1 ? Math.PI*.5 : (_max-_min)/(n-1);
		} else
			theta = (_max-_min)/n;
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
	// load content
	function loadContent(url) {
		var info = url.split(":");
		switch(info[0]) {
			case "htm" :
				$.get('html/'+info[1], function(data) {
					$('#screen').html(data);
				});
			break;
			case "img" :
				$('#screen').html('<img src="img/'+info[1]+'">');
			break;	
		};
	}
	function render3D() {
		model.eachFolder(function(i,f) {
			if(i<=curLevel)
				for(j=0;j<f.length;j++)
					setPos3D(linkData.getLink(f[j]).view);
		});
		sortByDepth();
	}
	
	function rot_angle() {
		var mat = $('#rotator').css('transform').split(',');
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
		// resize object
		obj.setSize(-100/dz);
		// geometrically find x and y in 2d view
		obj.setBase((cam.x-obj.x)*k+center.x,(cam.y-obj.y)*k+center.y);
	}
	// position elements
	function setupDisplay() {
		render3D();
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
			for (var j=0;j<arr.length;j++)
				// compare depth of object i to value in arr at index j
				if (z<arr[j].z){
					//alert(z+"<"+arr[j]+":"+(z<arr[j]));
					p=j;// position sentinel (p=new position)
					break;
				}
			
			if(~p) //not found
				arr.splice(p,0,{z:z,id:i});
			else
				arr.push({z:z,id:i});
			p=-1;
		};
		for (var i=0;i<arr.length;i++)
			model.getLink(arr[i].id).view.div.style.zIndex = i;
	}
	// animation
	function _changeFolder(id) {
		enabled=false; cur = -1; lastFolder = curFolder; curFolder = id; lastLevel = curLevel;
		curLevel = model.getFolderIndex(curFolder);
		TweenLite.ticker.addEventListener("tick", lvc.changeFolderTick);
		TweenLite.to($("#rotator"), tEffect, {directionalRotation: "-90deg_short", onComplete:lvc.changeFolderDone});
		
		if (id > lastFolder) { // moving into a new folder
			nav.push(id);
			k = 0;
		} else { // moving back to an old folder
			var i = nav.indexOf(lastFolder);
			nav.splice(i, nav.length-i);
			k = 1.5;
		}
		model.eachIn(lastFolder, function(i,obj) {
			if (obj.id==id)return;
			TweenLite.to(obj.view, tEffect, {x:rings[lastLevel][i].x*k,z:rings[lastLevel][i].z*k});
			TweenLite.to(obj.view.div, tEffect, {opacity:0});
		});
		model.eachIn(curFolder, function(i,obj) {
			obj.view.div.style.visibility = "visible";
			TweenLite.to(obj.view, tEffect, {x:rings[curLevel][i].x,z:rings[curLevel][i].z});
			TweenLite.to(obj.view.div, tEffect, {opacity:1});
		});
		// arrange folders
		var w=.27;
		var l=-w*(nav.length-1)/2;		
		for (var i=0; i<nav.length; i++)
			TweenLite.to(model.getLink(nav[i]).view, tEffect, {x: l+w*i, z:0});
	}
	function _changeFolderTick() {
		setPos3D(model.getLink(0).view);
		model.eachIn(curFolder, function(i,obj) { setPos3D(obj.view); obj.view.draw(); });
		model.eachIn(lastFolder, function(i,obj) { setPos3D(obj.view); obj.view.draw(); });
		sortByDepth();
	}
	function _changeFolderDone() {
		enabled = true;
		_changeFolderTick();
		model.eachIn(lastFolder, function(i,obj) { if (obj.id!=curFolder) obj.view.div.style.visibility="hidden"; });
		model.eachIn(curFolder, function(i, obj) { setPos3D(obj.view); obj.view.draw(); });
		TweenLite.ticker.removeEventListener("tick", lvc.changeFolderTick);
		
	}
	// menu navigation
	function _itemMouseClick(id) {
		if (!enabled) return;
		var obj = model.getLink(id);
		if( typeof obj.action == "number") { // folder
			if (curFolder!=id) _changeFolder(id);
		} else {
			loadContent(obj.action);
			_rotateTo(id);
		}
	}
	function _itemMouseOut(id) {
		TweenLite.to($('#btn'+id+" .ButtonTop .ButtonIcon"), tEffect,
						{boxShadow:"0px 0px 0px"});
		TweenLite.to($('#btn'+id+" .ButtonReflection .IconReflection"), tEffect,
						{boxShadow:"0px -5px 15px #000"});
	}
	function _itemMouseOver(id) {
		TweenLite.to($('#btn'+id+" .ButtonTop .ButtonIcon"), tEffect,
						{boxShadow:"0px 0px 15px #fff"});
		TweenLite.to($('#btn'+id+" .ButtonReflection .IconReflection"), tEffect,
						{boxShadow:"0px -5px 15px #555"});
	}
	// rotate on a timer
	function _rotateTo(id) {
		var d;
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
		model.eachIn(curFolder, function(i,obj) { setPos3D(obj.view); obj.view.draw(); });				
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
		rotateDone:_rotateDone,
		rotateTick:_rotateTick,
		changeFolderDone:_changeFolderDone,
		changeFolderTick:_changeFolderTick
	};
})();
window.t=0;