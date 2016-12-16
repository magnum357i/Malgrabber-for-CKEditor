<?php

	if ( !defined( 'base_path' ) and !defined( 'server_path' ) ) {
	require 'settings/link.php';
	require 'defines/path.php';
	}

	//Settings
	$htaccess_file = 'htaccess.txt';

	//Codes
	if ( !is_file( $htaccess_file ) ) {

	echo "An htaccess.txt file has been created.";

	$sfs = (subfolder != "" ? "/" : "");
	$sf  = ( $_SERVER['HTTP_HOST'] == "localhost" ? "" : subfolder );
	$hbp = str_replace( "//", "/", $sfs . $sf . server_path );

	$htaccess_line_break = "\r\n";
	$htaccess_content = '## If the root directory contains an htaccess file,'
	. $htaccess_line_break . '## Just place the RewriteRule codes under the RewriteBase or RewriteEngine code in that file.'
	. $htaccess_line_break . ''
	. $htaccess_line_break . '## Malgrabber Begin'
	. $htaccess_line_break . 'RewriteEngine on'
	. $htaccess_line_break . ''
	. $htaccess_line_break . 'RewriteRule ^' . $sf . 'malgrabber/poster/(.*)$' . ' ' . $hbp . 'poster/$1 [L]'
	. $htaccess_line_break . 'RewriteRule ^' . $sf . 'malgrabber/icons/(.*)$' . ' ' . $hbp . 'icons/$1 [L]'
	. $htaccess_line_break . '## Malgrabber End'
	. $htaccess_line_break . ''
	. $htaccess_line_break . '## Delete this file when you are done.';

	$htaccess_file = fopen( $htaccess_file, "w" );
	fwrite( $htaccess_file, $htaccess_content );
	fclose( $htaccess_file );

	}
	else
	{
		echo "Please, delete the existing htaccess.txt file from the plugin directory.";
	}