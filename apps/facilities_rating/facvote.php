<?php
$fac=$_GET["fac"];
$amnt=$_GET["amnt"];
session_start();
if (isset($_SESSION['uname'])){
include("../../db.php");

$date = date('Y-m-d');
$uid = $_SESSION['uid'];
$checkquery="SELECT * FROM facilities_rating WHERE facility='$fac'AND userid='$uid'AND Date='$date'";
$checkresult = mysql_query($checkquery);		
$checkcount = mysql_num_rows($checkresult);
if($checkcount==0)
{
	$facquery="SELECT * FROM facilities WHERE name='$fac'";
	$facresult = mysql_query($facquery);
		
	$faccount = mysql_num_rows($facresult);
		
	if($faccount == 1)
	{
		$facrow = mysql_fetch_array($facresult);
	
		$total = $facrow[total]+1;
		$rating = (($facrow[rating]*$facrow[total])+$amnt)/$total;

		mysql_query("UPDATE facilities SET rating=$rating, total=$total WHERE name='$fac'");
		mysql_query("INSERT INTO facilities_rating(userid, facility, vote, Date) VALUES ('$uid', '$fac', '$amnt', '$date')");
	}
}
}
?>
<div class="widget-header">
	<i class="icon-list"></i>
	<h3></h3>
</div> <!-- /widget-header -->


<div class="widget-content"  id= "widget-content">						
	<?php if($checkcount!=0) { echo "Only One vote per day<br>"; echo "Click <a href=\"javascript:update('apps/facilities_rating/facility.php?fac=".$fac."','widget');\">here</a> to go back."; }
		else { echo "Thank You! Your response has been recorded."; echo "Click <a href=\"javascript:update('apps/facilities_rating/facility.php?fac=".$fac."','widget');\">here</a> to go back."; }
?>
</div>
