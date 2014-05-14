<?php
// check if user is logged in as admin
	session_start();
	if (isset($_SESSION["admin"]) && $_SESSION["admin"]=="1") {
		// session_regenerate_id();
		$admin = true;
		$user = $_SESSION["user"];
		$_SESSION["EXPIRES"] = time()+900;//expires in 15 minutes
		// get links with admin data
		if ($_SERVER['QUERY_STRING'] == 'getlinks') {
			include 'php/db.php';
			
		}
	}
?>
<!doctype html>
<html>
<head>
<style type="text/css">
body {
	background: black;
	color: white;
	font: Arial;
}
.centered {
	left: 50%;
	top: 50%;
	width: auto;
	position: absolute;
}
</style>
<meta charset="UTF-8">
<?php
if ($admin) {
?>
<link rel="stylesheet" media="screen" href="styles/admin.css">
<title>Welcome,<?php echo $_SESSION["user"]; ?>!</title>
</head>
<script src="js/jquery-2.1.0.min.js"></script>
<script src="js/directory.js"></script>
<script src="js/admin.js"></script>
<body>
<section>
  <div id="navtable"> 
    <!--
            here goes the nav menu editor
            - create new item (folder, link, or object: image, movie, flash)
            - delete items (with confirmation)
            - drag and drop items
            - item changes accumulate in a queue
            - save changes with ajax
           -->
    <?php
// connect to mysql and list all items
// ...
// put a New Item button at the end of every folder
function navfolder($id,$title,$icon,$action,$content) {
	$item = navitem($id,$title,$icon,$action);
	return <<<EOT
	<details>
      <summary>
	    $item
      </summary>
      $content  
    </details>
EOT;
}
function navitem($id,$title,$icon,$action) {
	return <<<EOT
	<div class="navitm" id="item$id">
        <div class="title">$title</div>
        <div class="icon">$icon</div>
        <div class="action">$action</div>
        <div class="edit"><a onclick="edit($id)">[ edit ]</a></div>
    </div>
EOT;
}
function newbtn($id) {
	return <<<EOT
	<div class="navitm" id="new$id"><a onClick="newItem($id)"> [+ New Item] </a></div>
EOT;
}
/*
echo navfolder(0,"Home","Blah","Folder",
	navitem("1", "About", "abt.png", "goto about.php")
	.
	navitem("2", "Math", "math.png", "goto math.php"));
echo navfolder(3,"title","icon","action",
navfolder("4", "title", "icon", "action",
navitem("5", "some", "thing", "else")));*/
?>
    <?php echo newbtn(3); ?>

  </div>
  <div class="navitm" id="itemproto">
    <form hidden="true">
      <div class="title">[title]<br>
        <input type="text" name="title">
      </div>
      <div class="icon">[icon]
        <input type="file" name="icon" >
      </div>
      <div class="action">[action]
        <select name="action">
          <option value="url">load</option>
          <option value="open">goto</option>
          <option value="display">display</option>
        </select>
        <input type="text" name="url">
      </div>
      <div class="edit">
        <button type="submit">add item</button>
      </div>
    </form>
  </div>
</section>
<button id="savebtn" hidden="true">Save Changes</button>
</body>
<?php
} else {
?>
<link rel="stylesheet" media="screen" href="styles/login.css">
<title>Identify Yourself</title>
</head><script src="js/sha256.js"></script>
<script src="js/jquery-2.1.0.min.js"></script>
<script language="javascript">
	function post() {
		// get user and hashed pass in variables
		var user = document.forms.enter.user.value;
		var pass = document.forms.enter.pass.value;
		if (user.length<3 || pass.length<3 || !/^[a-z0-9_]+$/i.test(user)) return;
		$.post("php/login.php", {u:user,p:window.Sha256.hash(pass)}, login);
	}
	function login(s) { // s for status: 1=true, 0=false
		if (parseInt(s)) location.reload();
		else document.getElementById("msg").style.visibility="visible";
	}
</script>
<body>
<section>
  <div class="centered">
    <div id="login" align="left">
      <form id="enter" onSubmit="post();return false;">
        Username:
        <input type="text" name="user">
        <br>
        <br>
        Password:
        <input type="password" name="pass">
        <br>
        <br>
        <button type="submit" style="float:right">Submit</button>
      </form>
      <div id="msg" style="visibility:hidden">Sorry</div>
    </div>
  </div>
</section>
</body>
</html>
<?php
}
?>