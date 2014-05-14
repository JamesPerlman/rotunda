// admin.js - created by James Perlman at 12:02am on Wednesday, April 23, 2014 in Austin, TX

var d = new Directory();
$.getJSON("php/data.php?getlinks",
	function(json) {
		d.populate(json);
		build(d.items);
		$('#navtable').html(html);
	});

var inserts = [];
var deletes = [];
var updates = [];
var html = "";

function build (arr) {
	for (var i=0;i<arr.length;i++) {
		
		var obj=d.index[arr[i]];
		if (obj.action ? obj.action.constructor == Array : 0) {
			html += '<details><summary>'+navitem(obj)+'</summary>';
			build(obj.action);
			html += '</details>';
		} else {
			html += navitem(obj);
		}
	}
}
function navitem(obj) {
	return '<div class="navitm" id="item'+obj.id+'">\
		<div class="title">'+obj.title+'</div>\
		<div class="icon">'+(obj.icon||'x')+'</div>\
		<div class="action">'+(obj.action?(obj.action.constructor==Array?'folder':obj.action):'x')+'</div>\
		<div class="edit"><a onclick="edit('+obj.id+')">[ edit ]</a></div>\
	</div>\
	';
}

function proto() {
	return $('#itemproto');
}
function protoform() {
	return proto().find('form');
}
function protoclone() {
	return proto().clone(true,true).attr({'id':''});
}

function edit(id) {
	// convert navitm into editform
	window.event.preventDefault();
	var a, obj, btn, icon, form, file, clone;
	obj = $('#item'+id);
	obj.css('visibility','hidden');
	clone = protoclone();
	clone.attr('id','edit'+id)
	form = clone.find('form');
	icon = form.find('input[name=icon]');
	clone.find('.icon').html(obj.find('.icon').html()+'<br><input type="file" name="icon">');
	// copy values
	form.find('input[name=title]').attr({'value':obj.find('.title').html()});
	// add img
	clone.find('.title').add('<img width="36px" height="36px">');
	form.attr({'hidden':false});
	// replace "add item" text in submit button
	btn = form.find('button');
	btn.html('update');
	btn.attr('onclick','update('+id+')');
	$('<br><button onclick="del('+id+')">remove</button>').insertAfter(btn);
	clone.insertBefore(obj);
	
	//alert(form.find('select[name=action]').prop('selectedIndex'));
	//obj.style.visibility = "hidden";
	// replace this
}
function newItem(id) {
	// insert newbtn after item of id
	var obj, clone, form;
	obj = $('#new'+id);
	clone = protoclone();
	clone.insertBefore(obj);
	$('<br>').insertBefore(obj);
	clone.find('form').attr('hidden',false);
}

function update(id) {
	edt = $('#edit'+id);
	var itm = $('#item'+id);
	itm.css('visibility','visible');
	var upd = {};
	
	if (d.index[id].title != edt.find('input[name=title]').prop('value')) {
		upd.title = edt.find('input[name=title]').prop('value');
		itm.find('.title').html(upd.title);
	}
	if (edt.find('input[type=file]').prop('files')[0]) {
		upd.icon = edt.find('input[type=file]').prop('files')[0];
		itm.find('.icon').html(edt.find('input[type=file]').val().split('\\').pop());
	}
	if (d.index[id].action != edt.find('select').prop('value')) {
		upd.action = edt.find('select').prop('value');
		itm.find('.action').html(upd.action);
	}
	upd.id = id;
	
	updates[id] = upd;
	edt.remove();
	$('#savebtn').attr('hidden', false);
}

function insert(id,folder,after) {
	
}

function del(id) {
	
}