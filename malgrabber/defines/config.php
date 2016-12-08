<?php
require 'settings/image.php';
require 'settings/link.php';
require 'settings/cookie.php';

define("image_save_path", 'poster/'                   );
define("cookie_name",     $config[ "cookie_name"    ] );
define("cookie_timeout",  $config[ "cookie_timeout" ] );
define("cookie_limit",    $config[ "cookie_limit"   ] );
define("max_image_size",  $config[ "max_image_size" ] );
define("https",           $config[ "https"          ] );