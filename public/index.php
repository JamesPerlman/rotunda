<!-- Developed by James Perlman.  Start: Thursday, March 27, 2014.  7:07pm.  Austin, TX -->
<!doctype html>
<html lang="en">
  <head>
    <script src="js/jquery-2.1.0.min.js"></script>
    <script src="js/directory.js"></script>
    <script src="js/linkmap.js"></script>
    <script src="js/mainButtonView.js"></script>
    <script src="js/mainViewController.js"></script>
    <script src="js/CSSPlugin.min.js"></script>
    <script src="js/TweenLite.min.js"></script>
    <script src="js/jquery.gsap.min.js"></script>
    <script src="js/DirectionalRotationPlugin.min.js"></script>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Welcome!</title>
    <style>
    
    </style>
    <link href="styles/index.css" rel="stylesheet" type="text/css">
    <script type="text/javascript">
		var linkData = LinkMap.initFromJSON("php/data.php?getlinks");
		linkData.setOnLoad(function(){
			lvc.init(linkData,document.getElementById("navcontainer"));
		});
	
	</script>
    
  </head>  
  <body>
  	
    <section>
      <div>
        <nav>
          <div id="topnav">
          </div>
        
          <div id="navcontainer">
            <div id="screen">
            
            </div>
            <div id="rotator"></div>
            <canvas id="navcanvas" width="1000" height="500"></canvas>
          </div>
        </nav>
      
        <footer>
        
        </footer>
      </div>
    </section>
  </body>
</html>
