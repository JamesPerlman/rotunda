// Main screen Button
function Button(obj) {
	this.title = obj.title;
	this.action = obj.action;
	this.icon = new Image();
	this.icon.src = obj.icon;
	this.icon.title = this.title;
}
