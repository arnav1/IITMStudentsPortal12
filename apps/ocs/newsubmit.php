<?php

	
	session_start();
	
	include ('../../db.php');
	include ('../../config.php');
//die("haha");
	error_reporting(E_ALL);
	ini_set("display_errors",1);
	$uname = $_SESSION['uname'];
	$uname = strtolower($uname);
	$user = $uname;
	
	$comp_name = $_POST['name'];
	$comp_roll = $_POST['roll'];
	$comp_contact = $_POST['contact'];
	$comp_email = $_POST['email'];
	$comp_cat = $_POST['category'];
	$comp_subj = $_POST['subj'];
	$comp_ftime = $_POST['ftime'];
	$comp_desc = $_POST['desc'];
	
	$sql = "INSERT INTO ocs_complaints (user_id,user_contact,user_email,complaint_sub,complaint_cat,complaint_desc,complaint_ftime) VALUES ('$id','$comp_contact','$comp_email','$comp_subj','$comp_cat','$comp_desc','$comp_ftime')";
	mysql_query($sql) or die("DIED:".mysql_error($con));
	
	mysql_close($con);	
	header('Location: ../../index.php?message=ocs_y');
	
?>
