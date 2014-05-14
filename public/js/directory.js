// Directory.js

// Directory Model (template) 
var Directory = function() {
	var items;
	this.count = 0;
	this.folders=[[]];
	this.index=[];
	this.fdex=[];
	
}
// iterate recursively and build arrays
Directory.prototype.build = function(array, action) {
	var a = new Array(), b = [];
	for (var i = 0; i < array.length; i++) {
		var target = new Object();
		//alert(array[i].title);
		target.id = this.count++;
		target.folder = this.folders.length-1;
		this.folders[this.folders.length-1].push(target.id);
		for (var prop in array[i]) {
			if (prop)
				if (array[i][prop].constructor==Array) {
					// add to queue
					target[prop] = this.folders.length+b.length;
					b.push([target,prop,array[i][prop]]);
					this.fdex.push(target.id);
				} else
					target[prop] = array[i][prop];
				
		}
		// do some processing on target and replace if necessary
		this.index[target.id] = action ? (action(target) || target) : target;
		a.push(target.id);
	}
	// create folders from queue
	for (var i = 0; i<b.length; i++){
		this.folders.push([]);
		b[i][0][b[i][1]] = this.build(b[i][2],action);
	}
	
	return a;
}
	// navigate to subdirectory
Directory.prototype.changeDirectory = function(id) {
	if (id < count) {
		parent = current;
		current = id;
	}
}
// populate data with associative array, add ID tags to objects and (optionally) perform an action (optionally) returning the object to add to data
Directory.prototype.populate = function(JSON, action) {
	this.items = this.build(JSON,action);
}