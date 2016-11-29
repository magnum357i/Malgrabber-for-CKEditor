<?php
	header('Content-type:image/jpg');
	$id = strip_tags($_GET['id']);
	echo file_get_contents('poster/' . $id . '.jpg');
?>
