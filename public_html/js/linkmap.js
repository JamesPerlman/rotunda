// mainObjects.js - created by James on March 31, 2014 at 1:59pm

// Singleton Link Map (Controller)
var LinkMap = (function() {
	// shared instance of singleton
	var instance;
	// create the instance
	function instantiate() {
		// variables
		var links;
		var directory;
		var loaded;
		var onLoadData;
		var thisdir, parentdir;
		// functions
		// load model from JSON
		function initFromJSONData(url) {
			directory = new Directory();
			$.getJSON(url, function(json) {
				directory.populate(json, function(obj) {
					return new Button(obj);
				});	
				//debug
				/*
				var s = "";
				for (var i = 0; i<directory.folders.length; i++) {
					s += i+": ";
					for( var j = 0; j<directory.folders[i].length;j++) {
						s+=  directory.folders[i][j]+". "+directory.index[directory.folders[i][j]].title+ ", ";
					}
					s+="\n";
				}
				alert(s);
				*/
				onLoadData();
			});
			
		}
		// iterate over buttons
		function enumerateLinks(action) {
			for (var i=0;i<directory.index.length;i++)
				action(directory.index[i])
		}
		function enumerateFolders(action) {
			for (var i=0;i<directory.folders.length;i++)
				action(i, directory.folders[i]);
		}
		function enumLinksInFolder(fid,action) {
			if(fid>=0&&fid<directory.folders.length) {
				var folder = getFolderByID(fid);
				for (var i=0;i<folder.length;i++)
					action(directory.index[folder[i]]);
			}
		}
		function getLinkByID(id,f) {
			if (f!=undefined) return directory.index[directory.folders[f][id]];
			return directory.index[id];
		}
		function getFolderByID(id) {
			for (var i=0;i<directory.fdex.length;i++)
				if (directory.fdex[i]==id) {
					return directory.folders[i+1];
				}
		}
		// singleton object
		return {
			loadJSON : initFromJSONData,
			links : function() { return directory.index; },
			folders : function() { return directory.folders; },
			folder : function(idx) { return directory.folders[idx]; },
			setOnLoad : function (func) { onLoadData=func; },
			eachLink : enumerateLinks,
			eachFolder : enumerateFolders,
			eachIn : enumLinksInFolder,
			getLink : getLinkByID,
			count : function() { return directory.index.length; }
		}
	}
	function init () {
		if ( !instance ) instance = instantiate();
		return instance;
	}
	return {
		initFromJSON: function(url) {
			init().loadJSON(url);
			return instance;
		}
	}
})();

function Button(obj) {
	for (var v in obj)
		this[v] = obj[v];
}