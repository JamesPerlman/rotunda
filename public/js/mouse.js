// a module that abstracts mouse movement

var MPlug = (function() {
	var cx, cy;
	function updateCursor(evt) {
		var e, p = getCumulativeOffset(canvas);
		var _cx, _cy;
		e = window.event || evt;
		
		if (e.clientX || e.clientY) {
			_cx = e.clientX;
			_cy = e.clientY;
		}else if (e.touches) {
			_cx = e.touches[0].clientX;
			_cy = e.touches[0].clientY;
		} else if (e.changedTouches) {
			_cx = e.changedTouches[0].clientX;
			_cy = e.changedTouches[0].clientY;
		}
		if (_cx && _cy) {
			cx = _cx+window.pageXOffset-p.x;
			cy = _cy+window.pageYOffset-p.y;
		}
		return {x:cx,y:cy};
	}
	function getCumulativeOffset (obj) {
		var left=0, top=0;
		if (obj.offsetParent) {
			do {
				left += obj.offsetLeft;
				top  += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		return {
			x : left,
			y : top
		};
	};
	return {
		update: updateCursor
	}
})();
