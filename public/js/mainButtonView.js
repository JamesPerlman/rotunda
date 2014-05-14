// Main screen Button
function ButtonView(obj) {
	this.div = this.ref = this.top = this.grad = undefined;
	this.model = obj;
	this.icon = new Image();
	this.icon.src = obj.icon;
	this.refImg = new Image();
	this.refImg.src = this.icon.src;
	this.offset = {x:0,y:0};
	this.center = {x:0,y:0};
	this.base = {x:0,y:0};
	this.x=0;
	this.z=0;
	this.y=0;
	this.build();
}
ButtonView.prototype.build = function() {
	// create button...lengthy and dirty, but it works!
	// desperately needs to be refactored
	
	this.div = document.createElement("div");
	this.top = document.createElement("div");
	
	this.div.appendChild(this.top);
	this.div.id = "btn"+this.model.id;
	this.div.className = "Button";
	
	var txt = document.createElement("div");
	txt.innerHTML = this.model.title;
	txt.className = "Title";
	
	this.top.appendChild(txt);
	this.top.appendChild(this.icon);
	this.top.className = "ButtonTop";
	
	this.icon.className = "ButtonIcon";
	this.ref = document.createElement("div");
	this.grad = document.createElement("div");
	this.grad.className = "Gradient";
	this.refImg.className = "IconReflection";
	this.ref.appendChild(this.grad);
	this.ref.appendChild(this.refImg);
	this.div.appendChild(this.ref);
	this.ref.className = "ButtonReflection";
	
	
}
ButtonView.prototype.draw = function() {
	//$(this.div).hide().show();
	//$(this.ref).hide().show();
	//$(this.top).hide().show();
	$(this.grad).hide().show();
	$(this.refImg).hide().show();
	/*this.div.focus();
	this.ref.focus();
	this.top.focus();
	this.grad.focus();
	this.icon.focus();
	this.refImg.focus();*/
}
ButtonView.prototype.appendTo = function(element) {
	element.appendChild(this.div);
}
ButtonView.prototype.setBase = function(x,y) {
	this.div.style.bottom = (y-this.top.offsetHeight)+"px";
	this.div.style.left = this.ref.left = (x-this.offset.x)+"px";
	//this.base = {x:x,y:y};
}
ButtonView.prototype.setCenter = function(x,y) {
	this.div.style.bottom = (y+this.offset.y)+"%";
	this.div.style.left = (x-this.offset.x)+"%";
	this.center = {x:x,y:y};
}
ButtonView.prototype.setSize = function(size) {
	this.top.style.width = this.ref.style.width = this.top.style.height = this.ref.style.height = size + "px";
	this.top.style.marginLeft = this.ref.style.marginLeft = -size/2 + "px";
	
}
ButtonView.prototype.getCenterX = function() {
	return this.div.style.offsetLeft-this.offset.x;
}
ButtonView.prototype.getCenterY = function() {
	return this.div.style.offsetBottom-this.offset.y;
}
ButtonView.prototype.angle = function() {
	return 180/Math.PI * Math.atan2(this.z, this.x) - 180;
}