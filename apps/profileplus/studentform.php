<?php
	//error_reporting(E_ALL);
	include("../../db.php");
	session_start();
	if (isset($_COOKIE["user"]))
	
		$_SESSION['uname'] = $_COOKIE["user"];
		

	include("../../config.php");
		$loggedin = 1;
	if($loggedin == 0)	
		die("Please Login to continue");
	
//	$uname = "name";
	$uname = $_SESSION['uname'];
/*	$uname = "Username";
	$uname = "username";
	$user = "user";
	$name = "name";
	$nick = "nick";
	$room = "room";
	$hostel = "hostel";
	$contact = "contact";
	$email = "email";
        $bgroup = "bgroup";
*/		
	$CatTable = "categories";
	$SubCatTable = "sub_categories";
?>
<style>
.categories {
	font-size:14px;
}
.accordion-heading a {
	color : #333333;
	text-decoration : none;
}
.accordion-heading a h4 {
	color : #333333;
	text-decoration : none;
	padding-right: 0;
	padding-left: 0;
	margin-right: 20px;
	font-weight: bold;
	-webkit-transition: all .3s linear;
	   -moz-transition: all .3s linear;
			transition: all .3s linear;
}
.accordion-heading a:hover {
	color : #000000;
	text-decoration : none;
}
.accordion-heading a h4:hover {
	color : #000000;
	text-decoration : none;
	text-shadow : 0 0 10px rgba(0, 0, 0, 0.90);
}
.accordion-item-inner item {
	background-color : #F7F7F7;
}
.extra_button_right {
	padding-right: 0;
	padding-left: 0;
	margin-right: 20px;
	font-weight: bold;
	border : 1px solid #888888;	
	border-radius: 10px 10px 10px 10px;
	text-decoration : none;
	-webkit-transition: all .3s linear;
	   -moz-transition: all .3s linear;
			transition: all .3s linear;
	color : #444444;
}
.extra_button_right:hover {
	color : #000000;
	border : 1px solid #000000;
	text-decoration: none;
	text-shadow : 0 0 10px rgba(0, 0, 0, 0.90);
	box-shadow : 0 0 10px rgba(0, 0, 0, 0.90), 
		0 0 8px rgba(0, 0, 0, 0.5) inset;
}
.table, .table td, .table th {
	text-align : center;
}
.my_button {
	padding-left : 10px;
	padding-top : 2px;
	padding-bottom : 2px;
	padding-right : 10px;
	font-weight: bold;
	border : 1px solid #888888;	
	border-radius: 10px 10px 10px 10px;
	box-shadow : 0 0 8px rgba(0, 0, 0, 0.5) inset;
	-webkit-transition: all .3s linear;
	   -moz-transition: all .3s linear;
			transition: all .3s linear;
	color : #000000;
}
.my_button:hover {
	color : #ffffff;
	border : 1px solid #000000;
	text-decoration: none;
	text-shadow : 0 0 10px rgba(0, 0, 0, 0.90);
	box-shadow : 0 0 10px rgba(0, 0, 0, 0.90), 
		0 0 8px rgba(0, 0, 0, 0.5) inset;
}
#myCarousel {
	width : 99%;
	margin-left : 1px;
}
.my_carousel_inner {
	box-shadow : 0 0 10px rgba(0, 0, 0, 0.90), 
		0 0 8px rgba(0, 0, 0, 0.5) inset;
	width : 88%;
}
.profile_carousel_item {
	height : 400px;
	<!--overflow-y : scroll;-->	
}
.navbar-profile {
	padding-top : 20px;
	padding-bottom : 20px;
	margin-top : -10px;
	margin-bottom : 20px;
	box-shadow : 0 0 8px rgba(0, 0, 0, 0.5) inset;	
}
.nav-profile {
	list-style-type : none;
	margin : 0;
	padding : 0;
}
.nav-profile li {
	display : inline;
}
.nav-profile li a {
	font-weight : bold;
	color : #FFFFFF;
	background-color : #888888;
	background-image : linear-gradient(280deg, rgb(125, 125, 125), rgb(100, 100, 100));
	text-align : center;
	padding : 6px;
	margin-left : 2px;
	margin-right : 2px;
	text-decoration : none;
	text-transform : uppercase;
}.nav-profile li a:hover {
	font-weight : bold;
	color : #FFFFFF;
	background-color : #888888;
	background-image : linear-gradient(280deg, rgb(150, 150, 150), rgb(100, 100, 100));
	text-align : center;
	padding : 6px;
	text-decoration : none;
	text-transform : uppercase;
}
.nav-profile li.active a {
	font-weight:bold;
	background-color :	#cccccc;
	background-image : linear-gradient(280deg, rgb(250, 250, 250), rgb(200, 200, 200));
	border : 1px solid #888888;
	font-size : 15px;
	margin-top : 5px;
	margin-bottom : 5px;
	margin-left : 10px;
	margin-right : 10px;
	color : #000000;
	
}
.nav-profile li.active a:hover {
	background-color : #cccccc;
	background-image : linear-gradient(280deg, rgb(200, 200, 200), rgb(100, 100, 100));
	box-shadow : 0 0 8px rgba(0, 0, 0, 0.5) inset;
	color : #FFFFFF;
}
</style>



<center>
<head
	<div class="span12">
		<div class="widget"  style="float:right; width:1340px; margin:10px;">
			<div class="widget-header">
				<i class="icon-star"></i>
				<h3>Update Profile</h3>
			</div> <!-- /widget-header -->		
			<div class="widget-content">
		
				<div class="navbar-profile">
					<div class="navbar-inner-profile">
						<ul class="nav-profile" id="profile_nav_id">
							<li class="active profile_carousel_nav" id="0_nav"><a href="javascript:setCarousel(0);">Basic info</a></a></li>
							<li class="profile_carousel_nav" id="1_nav"><a href="javascript:setCarousel(1);">Education</a></li>
<?php
				$catquery = "SELECT * FROM $CatTable";
				$catresult = mysql_query($catquery);
				$i = 1;
				while($catrow = mysql_fetch_array($catresult)) {
					$i += 1;
					$catname = $catrow['name'];
					$catID = $catrow['id'];
					$catdesc = $catrow['description'];
					$catadmin = $catrow['admin'];
?>
							<li class="profile_carousel_nav" id="<?php echo $i ?>_nav"><a href="javascript:setCarousel(<?php echo $i ?>);"><?php echo $catname;?></a></li>
<?php
				}
?>
						</ul>
					</div>
				</div>
				
				<div id="myCarousel" class="row carousel slide" >
				<!-- Carousel items -->
					<div class="carousel-inner my_carousel_inner">
						<div class="active item profile_carousel_item" id="basicinfo">
							<h3>Basic information</h3>
							<?php include("basicinfo.php"); ?>
						</div>
						<div class="item profile_carousel_item" id="education">
							<h3>
								Education 
							<!--	<span href="#myModal_Edu" role="button" data-toggle="modal"  class="extra_button_right pull-right">
									&nbsp; <i style="margin-top: 4px;" class="icon-plus-sign"></i> Add &nbsp;
								</span>-->
							</h3>
							<?php include 'eduready.php'; ?>
						</div>
<?php
				$catquery = "SELECT * FROM $CatTable";
				$catresult = mysql_query($catquery);
		
				while($catrow = mysql_fetch_array($catresult)) {
					$catname = $catrow['name'];
					$catID = $catrow['id'];
					$catdesc = $catrow['description'];
					$catadmin = $catrow['admin'];
?>
						<div class="item profile_carousel_item" id="<?php echo $catname;?>">
							<h3>
								<?php echo $catname;?> 
							</h3>
							<?php include 'catready.php'; ?>
						</div>
<?php
				}
?>
					</div>
					<!-- Carousel nav 
					<a class="carousel-control left" href="#myCarousel" data-slide="prev" onclick="next_carousel();">&lsaquo;</a>
					<a class="carousel-control right" href="#myCarousel" data-slide="next" onclick="prev_carousel()">&rsaquo;</a>-->
				</div>
	
	
<!--
				<div class="accordion" id="accordionProfile">
					
					<div class="accordion-group">
						<div class="accordion-heading">
							<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordionProfile" href="#collapse_Info"> 
								<h4>
									Basic info
								</h4>
							</a>
						</div>
						<div id="collapse_Info" class="accordion-body in collapse" >
							<div class="accordion-inner">
								<?php //include("basicinfo.php"); ?>
							</div>
						</div>
					</div>
									
<?php
	/*	include("education.php");
		
		
		$catquery = "SELECT * FROM $CatTable";
		$catresult = mysql_query($catquery);
		
		while($catrow = mysql_fetch_array($catresult)) {
			$catname = $catrow['name'];
			$catID = $catrow['id'];
			$catdesc = $catrow['description'];
			$catadmin = $catrow['admin'];
			include("categories.php");
		}
	*/
?>
				</div> <!-- /accordion -->				
			</div> <!-- /widget-content -->					
		</div> <!-- /widget -->	
	</div>
</center>
<?php

	include("education.php");
				$catquery = "SELECT * FROM $CatTable";
				$catresult = mysql_query($catquery);
		
				while($catrow = mysql_fetch_array($catresult)) {
					$catname = $catrow['name'];
					$catID = $catrow['id'];
					$catdesc = $catrow['description'];
					$catadmin = $catrow['admin'];
					include 'categories.php'; 
				}
?>
<script>
	// disable auto rotating of carousel
	//$('.carousel').carousel({interval : false});
	//$(document).on('slide', '.carousel', function() { alert("slide"); } );
</script>

