<?php
	function get_image( $r,$c ) {
		preg_match ($r, $c, $m );
		if ( count($m) > 0 ) { return $m[1]; }
	}

	function get_text( $r, $c, $s ) {
		preg_match( $r, $c, $m );
		if ( count( $m ) > 0 ) {
		if ( $s == false ) { $m[1] = $m[1]; }
		return strip_tags( $m[1], "<br>" );
		}
	}

	function replace_text( $r, $c, $m )
	{ return preg_replace( $r, $c, $m ); }

	function brep( $t ) {
	$r = $t;
	$r = str_replace( "\n", "", $r );
	$r = trim( $r );
	return $r;
	}