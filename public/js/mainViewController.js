// Main Link Button Controller.Created by James Perlman on April 4th, 2014 at 12:06PM
var lvc = (function(){
	var cam = {x:0,y:.8,z:2},
		center = {x:500, y:500},
		cur = -1, curLevel = 1, curFolder=0,
		enabled = true, exit=[],
		fLen = 400,
		fullscreen=false,
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
			if (n==1)
				_max=_min=0;
			else {
				var inc = Math.PI/(7*2)
				_max=inc*n; _min=-_max;
			}
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
		if (info[0]=="img")
			loadImage(info[1]);
		else {
			if (info[0]=="folder") {
				TweenLite.to($('#screen'), tEffect, {marginLeft:-250, width:500});
				$('#enlarge').css('visibility','hidden');
				$('#screen').html(info[1]||'&nbsp;');
			} else if  (info[0]=="htm") {
				$.get('html/'+info[1], function(data) {
					$('#screen').html(data);
					TweenLite.to($('#screen'), tEffect, {marginLeft:-250, width:500});
				});
			} else if (info[0]=="app") {
				$.get('html/'+info[1]+'.desc', function(data) {
					$('#enlarge').css('visibility','hidden');
					$('#screen').html(data+'<br><a href="html/'+info[1]+'" target="_blank">Launch App</a>');
				});
			}
		};
	}
	function loadImage(url) {
		var img = new Image();
		img.onload = function() {
			var w=img.width,h=img.height,a=w>h;
			// resize image
			var H=240*(a?1:h/w);
			var W=240*(a?w/h:1);
			$('#screen').html(img);
			document.getElementById('enlarge').src='img/helper/enlarge.jpg';
			TweenLite.to($('#screen'), tEffect, {width:W, height:H, marginLeft:-W/2, onComplete: function() { $('#enlarge').css({marginLeft:478+W/2 + 'px',visibility:'visible'})}});
			document.getElementById('enlarge').onclick = function() { lvc.toggleImage(w,h,W,H) };
			img.style.width= '100%';
			img.style.height = '100%';
		}
		img.src = 'img/'+url;
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
		if (c==-1) return 5;
		if (t==c) return 0;
		var k=(t>c)?1:-1;
		return Math.max(3,(m<=7)?k*(t-c):Math.min(m-k*(t-c),k*(t-c)));
	}
	function shortWay(m,c,t) {
		// max, current, target
		var k,r 
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
	function toggleImage(w,h,w2,h2) {
		if (!enabled) return;
		
		enabled = false;
		var en = document.getElementById('enlarge'),f;
		if (/^.+enlarge\.jpg$/.test(en.src)) {
			en.onclick=function(){lvc.toggleImage(w2,h2,w,h)};
			en.src='img/helper/minify.jpg';
			fullscreen = true;
		} else {
			en.onclick=function(){lvc.toggleImage(w2,h2,w,h)};
			en.src='img/helper/enlarge.jpg';
			fullscreen = false;
		}
		TweenLite.to($('#screen'), tEffect, {marginLeft: -w/2, width:w, height:h});
		TweenLite.to($('#enlarge'), tEffect, {marginLeft:479+w/2, onComplete:function(){enabled=true;}});
			
	}
	// animation
	function _changeFolder(id) {
		enabled=false; cur = -1; lastFolder = curFolder; curFolder = id; lastLevel = curLevel;
		curLevel = model.getFolderIndex(curFolder);
		TweenLite.ticker.addEventListener("tick", lvc.changeFolderTick);
		TweenLite.to($("#rotator"), tEffect, {directionalRotation: "-90deg_short", onComplete:lvc.changeFolderDone});
		
		var f_img = new Image();
		f_img.onload = function() { $('#screen').html(f_img); };
		f_img.src = 'img/folders/'+model.getLink(id).title+'.jpg';
		
		
		if (id > lastFolder) { // moving into a new folder
			nav.push(id);
			k = 0;
		} else { // moving back to an old folder
			var i = nav.indexOf(id)+1;
			exit = nav.splice(i, nav.length-i);
			exit.shift();
			k = 1.5;
			// we must loop through all folders prior and remove them
			for (i=0;i<exit.length;i++) {
				var obj = model.getLink(exit[i]),
					f=model.getFolderIndex(obj.folder-1),
					r=rings[f][model.getLinkIndex(exit[i])];
				TweenLite.to(obj.view, tEffect, {x:1.5*r.x, z:1.5*r.z});
				TweenLite.to(obj.view.div, tEffect, {opacity: 0});
			}
		}
		model.eachIn(lastFolder, function(i,obj) {
			if (obj.id==id) return;
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
		model.eachIn(curFolder, function(i,obj) { setPos3D(obj.view); obj.view.draw(); });
		model.eachIn(lastFolder, function(i,obj) { setPos3D(obj.view); obj.view.draw(); });
		for (var i=0; i<exit.length; i++) {
			var view = model.getLink(exit[i]).view;
			setPos3D(view); view.draw();
		}
		for (var i=0; i<nav.length; i++) {
			var view = model.getLink(nav[i]).view;
			setPos3D(view); view.draw();
		}
		sortByDepth();
	}
	function _changeFolderDone() {
		enabled = true;
		model.eachIn(lastFolder, function(i,obj) { if (obj.id!=curFolder) obj.view.div.style.visibility="hidden"; });
		model.eachIn(curFolder, function(i, obj) {
			obj.view.x=rings[curLevel][i].x;
			obj.view.z=rings[curLevel][i].z;
			setPos3D(obj.view);
			obj.view.draw();
		});
		TweenLite.ticker.removeEventListener("tick", lvc.changeFolderTick);
		for (i=0;i<exit.length;i++) {
			var obj = model.getLink(exit[i]),
				r=rings[model.getFolderIndex(obj.folder-1)];
				model.eachIn(obj.folder-1, function(j, o) {
					o.view.x=1.5*r[j].x;
					o.view.z=1.5*r[j].z;
				});
			
			obj.view.div.style.visibility="hidden";
		}
		exit = [];
		var w=.27,
			l=-w*(nav.length-1)/2;
		for (var i=0; i<nav.length; i++) {
			var view = model.getLink(nav[i]).view;
			view.x = l+w*i; view.z = 0;
			setPos3D(view); view.draw();
		}
	}
	// menu navigation
	function _itemMouseClick(id) {
		if (!enabled) return;
		var obj = model.getLink(id);
		if( typeof obj.action == "number") { // folder
			if (curFolder!=id) _changeFolder(id);
			loadContent('folder');
		} else {
			_rotateTo(id);
			loadContent(obj.action);
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
			TweenLite.to($("#rotator"), d*.15,
			{
				directionalRotation: 180*(1+rings[curLevel][model.getLinkIndex(id)].t/Math.PI) + "deg_short",
				onComplete:lvc.rotateDone
			});
			_itemMouseOut(id);
			TweenLite.ticker.addEventListener("tick", lvc.rotateTick);
		};
	}
	function _rotateDone() {
		var theta = rot_angle();
		_rotateTick();
		TweenLite.ticker.removeEventListener("tick", lvc.rotateTick);
		enabled = true;
		model.eachIn(curFolder, function(i,obj) { 
			obj.view.x = Math.cos(-Math.PI/2-theta+rings[curLevel][i].t);
			obj.view.z = Math.sin(-Math.PI/2-theta+rings[curLevel][i].t);
			setPos3D(obj.view);
			obj.view.draw();
		});				
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
		toggleImage:toggleImage,
		changeFolderDone:_changeFolderDone,
		changeFolderTick:_changeFolderTick
	};
})();
window.t=0;