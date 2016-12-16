<?php
define("subfolder", $config[ "subfolder" ] );
define("base_path",   str_replace( "defines", "", str_replace("//","/", dirname(__FILE__) . "/"             ) ) );
define("server_path", str_replace( "defines", "", str_replace("//","/", dirname($_SERVER['PHP_SELF']) . "/" ) ) );