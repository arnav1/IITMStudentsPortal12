<?php
	
?>
<style>
	.dropdown-menu li a {
		color: #ccc;
		text-decoration: none;
		
	}

	.dropdown-menu li a:hover {
		color: #fff;
		text-decoration: none;
	}
	
</style>

<div class="dropdown clearfix" >
	<ul class="muted dropdown-menu" style="display: block; position: static; min-width: 100%; ">
		<li>
			<a href="#" tabindex="-1">Add a new Team</a>
		</li>
		<li class="divider"></li>
		<li>
			<a href="#">Another action</a>
			<a class="close" href="javascript:deleteTeam(this);">&times;</a>
		</li>
		<li>
			<a href="#">Something else here</a>
			<a class="close" href="#">&times;</a>
		</li>
		<li>
			<a href="#">Separated link</a>
			<a class="close" href="#">&times;</a>
		</li>
	</ul>
</div>