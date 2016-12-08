<?php

	if ( !defined( 'base_path' ) and !defined( 'server_path' ) ) { require 'defines/path.php'; }

	//Settings
	$subfolder = ""; //Example: forum
	$htaccess_file = 'htaccess.txt';

	//Codes
	if ( !is_file( $htaccess_file ) ) {

	$subfolder2 = "";
	if ( $subfolder != "" ) { $subfolder2 = $subfolder . "/"; }

	$htaccess_line_break = "\r\n";
	$htaccess_content =
	                         'RewriteEngine on'
	. $htaccess_line_break . ''
	. $htaccess_line_break . '#If the root directory contains an htaccess file, just paste the codes below.'
	. $htaccess_line_break . 'RewriteRule ^' . $subfolder2 . 'malgrabber/poster/(.*)$' . ' ' . $subfolder . server_path . 'poster/$1'
	. $htaccess_line_break . 'RewriteRule ^' . $subfolder2 . 'malgrabber/icons/(.*)$' . ' ' . $subfolder . server_path . 'icons/$1';

	$htaccess_file = fopen( $htaccess_file, "w" );
	fwrite( $htaccess_file, $htaccess_content );
	fclose( $htaccess_file );

	}