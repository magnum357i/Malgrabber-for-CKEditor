	<?php
	require 'defines/config.php';
	require 'defines/path.php';
	require 'functions.php';

	$ctval = 1;

	if ( isset( $_COOKIE[ cookie_name ] ) )
	{ $ctval = $_COOKIE[ cookie_name ]; }
	else
	{ setcookie(cookie_name, 1, cookie_timeout); }

	$url = $_POST["url"];

	try {

		if ( $ctval > cookie_limit )
		{ throw new Exception( cookie_limit . ',' . $cookie_hours . ',' . $cookie_mins ); }

			setcookie( cookie_name, $ctval + 1, cookie_timeout );

			if ( isset( $url ) ) {

			$content     = @file_get_contents( $url );
			$mal_title   = get_text( '@<span itemprop="name">(.*?)</span>@i',                                           $content, false, "" );
			$mal_poster  = get_image( '@(https://myanimelist.cdn-dena.com/images/(anime|manga)/[0-9]+/[0-9]+\.jpg)@si', $content );
			$mal_subject = get_text( '@<span itemprop="description">(.*?)</span>@si',                                   $content, true, "<br>" );

			if ( $mal_title == "" and $mal_subject == "" and $mal_poster == "" )
			{ throw new Exception( 'missing data' ); }
			elseif ( !is_dir( image_save_path ) )
			{ throw new Exception( 'poster folder is not created' ); }

				$image_path   = $mal_poster;
				$image_size   = getimagesize( $image_path );
				$image_width  = $image_size[ 0 ];
				$image_height = $image_size[ 1 ];
				$image_name   = preg_replace( "@https?://myanimelist.cdn-dena.com/images/(anime|manga)/[0-9]+/@i", "", $image_path );

				if ( $image_width > max_image_size and $image_width > max_image_size )
				{ throw new Exception( 'poster size is too big' ); }

						if( !file_exists( base_path . image_save_path . $image_name ) ) {
							copy( $image_path, base_path . image_save_path . $image_name );
						}

				$mal_poster = $image_name;

				$mal_title_alt       = $_POST[ "custom_title" ];
				$mal_title_english   = get_text( '@<span class="dark_text">english:</span>(.*?)</div>@si',         $content, false, "" );
				$mal_title_japanese  = get_text( '@<span class="dark_text">japanese:</span>(.*?)</div>@si',        $content, false, "" );
				$mal_title_synonyms  = get_text( '@<span class="dark_text">synonyms:</span>(.*?)</div>@si',        $content, false, "" );

				$mal_type            = get_text( '@<span class="dark_text">type:</span> <a href=".*">(.*?)</a>@i', $content, false, "" );
				$mal_episode         = get_text( '@<span class="dark_text">episodes:</span>(.*?)</div>@si',        $content, false, "" );
				$mal_manga_volume    = get_text( '@<span class="dark_text">volumes:</span>(.*?)</div>@si',         $content, false, "" );
				$mal_manga_chapter   = get_text( '@<span class="dark_text">chapters:</span>(.*?)</div>@si',        $content, false, "" );
				$mal_status          = get_text( '@<span class="dark_text">status:</span>(.*?)</div>@si',          $content, false, "" );

				$mal_date            = get_text( '@<span class="dark_text">aired:</span>(.*?)</div>@si',           $content, false, "" );
				if ( !$mal_date ) { $mal_date = get_text( '@<span class="dark_text">published:</span>(.*?)</div>@si', $content, false, "" ); }

				$mal_anime_publisher = get_text( '@<span class="dark_text">studios:</span>(.*?)</div>@si',         $content, false, "" );
				$mal_manga_publisher = get_text( '@<span class="dark_text">serialization:</span>(.*?)</div>@si',   $content, false, "" );
				$mal_anime_source    = get_text( '@<span class="dark_text">source:</span>(.*?)</div>@si',          $content, false, "" );
				$mal_manga_authors   = get_text( '@<span class="dark_text">authors:</span>(.*?)</div>@si',         $content, false, "" );
				$mal_genres          = get_text( '@<span class="dark_text">genres:</span>(.*?)</div>@si',          $content, false, "" );
				$mal_duration        = get_text( '@<span class="dark_text">duration:</span>(.*?)</div>@si',        $content, false, "" );

				$mal_score           = get_text( '@<span itemprop="ratingValue">(.*?)</span>@si',                  $content, false, "" );
				if ( !$mal_score ) { $mal_score = get_text( '@<span class="dark_text">score:</span>(.*?)<sup>@i', $content, false, "" ); }

				$mal_rank            = get_text( '@<span class="dark_text">ranked:</span>(.*?)<sup>@si',           $content, false, "" );

				$mal_list_staff = get_text( '@</div>staff</h2><table.*?>(.*?)</table>@si', $content, false, "<table><tr><td><a>" );
				$mal_list_staff = replace_text( '/<tr.*?>/', "<tr>", $mal_list_staff );
				$mal_list_staff = replace_text( '/<td.*?>/', "<td>", $mal_list_staff );
				$mal_list_staff = replace_text( '/<th.*?>/', "<th>", $mal_list_staff );
				$mal_list_staff = replace_text( '/<a.*?>/', "<a>", $mal_list_staff );
				$mal_list_staff = replace_text( '/\t/', "", $mal_list_staff );
				$mal_list_staff = replace_text( '/\n/', "", $mal_list_staff );
				$mal_list_staff = replace_text( '/ +/', " ", $mal_list_staff );
				$mal_list_staff = replace_text( '/> </', "><", $mal_list_staff );
				$mal_list_staff = replace_text( '/(>) /', "$1", $mal_list_staff );
				$mal_list_staff = replace_text( '/ (<)/', "$1", $mal_list_staff );
				$mal_list_staff = replace_text( '/<td><a><\/a><\/td>/i', "", $mal_list_staff );
				$mal_list_staff = replace_text( '/<tr><td><a>(.*?)<\/a>(.*?)<\/td><\/tr>/i', "staffName_begin$1staffName_endstaffPosition_begin$2staffPosition_end", $mal_list_staff );

				$mal_list_voice = get_text( '@</div>characters & voice actors</h2>(.*?)<br><a name="staff"></a>@si', $content, false, "<table><th><td><tr>" );
				$mal_list_voice = replace_text( '/<table.*?>/', "<table>", $mal_list_voice );
				$mal_list_voice = replace_text( '/<tr.*?>/', "<tr>", $mal_list_voice );
				$mal_list_voice = replace_text( '/<td.*?>/', "<td>", $mal_list_voice );
				$mal_list_voice = replace_text( '/<th.*?>/', "<th>", $mal_list_voice );
				$mal_list_voice = replace_text( '/<tbody.*?>/', "<tbody>", $mal_list_voice );
				$mal_list_voice = replace_text( '/\t/', "", $mal_list_voice );
				$mal_list_voice = replace_text( '/\n/', "", $mal_list_voice );
				$mal_list_voice = replace_text( '/ +/', " ", $mal_list_voice );
				$mal_list_voice = replace_text( '/> </', "><", $mal_list_voice );
				$mal_list_voice = replace_text( '/(>) /', "$1", $mal_list_voice );
				$mal_list_voice = replace_text( '/ (<)/', "$1", $mal_list_voice );
				$mal_list_voice = replace_text( '/<table><\/table>/s', "", $mal_list_voice );
				$mal_list_voice = replace_text( '/<td><\/td>/s', "", $mal_list_voice );				
				$mal_list_voice = replace_text( '/<td><table><tr><td>([^<]*?)<\/td><\/tr><\/table><\/td>/s', "<td>voiceName_1_begin$1voiceName_1_end</td>", $mal_list_voice );
				$mal_list_voice = replace_text( '/<td><table><tr><td>([^<]*?)<\/td><\/tr><tr><td>([^<]*?)<\/td><\/tr><\/table><\/td>/s', "<td>voiceName_1_begin$1voiceName_1_endvoiceName_2_begin$2voiceName_2_end</td>", $mal_list_voice );
				$mal_list_voice = replace_text( '/<td><table><tr><td>([^<]*?)<\/td><\/tr><tr><td>([^<]*?)<\/td><\/tr><tr><td>([^<]*?)<\/td><\/tr><\/table><\/td>/s', "<td>voiceName_1_begin$1voiceName_1_endvoiceName_2_begin$2voiceName_2_endvoiceName_3_begin$3voiceName_3_end</td>", $mal_list_voice );
				$mal_list_voice = replace_text( '/<table><tr><td>([^<]*?)<\/td><td>([^<]*?)<\/td><\/tr><\/table>/s', "voiceCol_1_begin$1voiceCol_1_endvoiceCol_2_begin$2voiceCol_2_end", $mal_list_voice );
				$mal_list_voice = replace_text( '/<table><tr><td>([^<]*?)<\/td><\/tr><\/table>/s', "voiceCol_1_begin$1voiceCol_1_endvoiceCol_2_beginvoiceCol_2_end", $mal_list_voice );

				$mal_list_characters = get_text( '@</div>characters</h2>(.*?</table>)<div.*?>@si', $content, false, "<table><th><td><tr>" );
				$mal_list_characters = replace_text( '/<table.*?>/', "<table>", $mal_list_characters );
				$mal_list_characters = replace_text( '/<tr.*?>/', "<tr>", $mal_list_characters );
				$mal_list_characters = replace_text( '/<td.*?>/', "<td>", $mal_list_characters );
				$mal_list_characters = replace_text( '/<th.*?>/', "<th>", $mal_list_characters );
				$mal_list_characters = replace_text( '/\t/', "", $mal_list_characters );
				$mal_list_characters = replace_text( '/\n/', "", $mal_list_characters );
				$mal_list_characters = replace_text( '/ +/', " ", $mal_list_characters );
				$mal_list_characters = replace_text( '/> </', "><", $mal_list_characters );
				$mal_list_characters = replace_text( '/(>) /', "$1", $mal_list_characters );
				$mal_list_characters = replace_text( '/ (<)/', "$1", $mal_list_characters );
				$mal_list_characters = replace_text( '/<td><\/td>/', "", $mal_list_characters );
				$mal_list_characters = replace_text( '/<table><tr><td>(.*?)<\/td><\/tr><\/table>/', "characters_begin$1characters_end", $mal_list_characters );


				$mal_title           = $mal_title;
				$mal_title_alt       = $_POST[ "custom_title" ];
					if ( $mal_title_alt != "" ) {
					$mal_title_temp  = $mal_title;
					$mal_title       = $mal_title_alt;
					$mal_title_alt   = $mal_title_temp;
					}

				$mal_subject         = replace_text( '/\n.*\n\(source:.*\)/i', "", $mal_subject );
				$mal_subject         = replace_text( '/\n.*\n\[written by.+\]/i', "", $mal_subject );

				$mal_rank            = replace_text( '/#/',"", $mal_rank );


				$displayed_path        = '';
				$displayed_server_path = '';

				if ( $_SERVER['HTTP_HOST'] != "localhost" ) {

				if ( $config[ "htaccess_enabled" ] == "on" ) { $displayed_path = "/malgrabber/"; }
				elseif ( $config[ "htaccess_enabled" ] == "off" ) { $displayed_path = server_path; }

				$displayed_server_path = $_SERVER['HTTP_HOST'] . subfolder;

				if ( https == "on" ) { $displayed_server_path = "https://" . $displayed_server_path; }
				elseif ( https == "off" ) { $displayed_server_path = "http://" . $displayed_server_path; }

				}
				else {

				if ( $config[ "htaccess_enabled" ] == "on" ) { $displayed_path = "malgrabber/"; }
				elseif ( $config[ "htaccess_enabled" ] == "off" ) { $displayed_path = server_path; }

				$displayed_path = subfolder . $displayed_path;

				}

				if ( $_POST[ 'defualt_timezone' ] )
				{ date_default_timezone_set( $_POST[ 'defualt_timezone' ] ); }

				$json =
				array(
				'mal_created_date'      => date('/j-n-Y/H:i/w/', time()),
				'displayed_poster_path' => $displayed_server_path . $displayed_path . image_save_path,
				'displayed_icons_path'  => $displayed_path . 'icons/',
				'mal_title'             => brep( $mal_title  ),
				'mal_poster'            => brep( $mal_poster ),
				'mal_subject'           =>
				array(
				      'mal_title_alt'      => brep( $mal_title_alt      ),
				      'mal_title_english'  => brep( $mal_title_english  ),
				      'mal_title_japanese' => brep( $mal_title_japanese ),
				      'mal_title_synonyms' => brep( $mal_title_synonyms ),
				      'mal_subject'        => brep( $mal_subject        ),
				),
				'mal_info' =>
				array(
				      'info' =>
				      array(
				      'mal_type'            => brep( $mal_type            ),
				      'mal_episode'         => brep( $mal_episode         ),
				      'mal_manga_volume'    => brep( $mal_manga_volume    ),
				      'mal_manga_chapter'   => brep( $mal_manga_chapter   ),
				      'mal_date'            => brep( $mal_date            ),
				      'mal_anime_publisher' => brep( $mal_anime_publisher ),
				      'mal_manga_publisher' => brep( $mal_manga_publisher ),
				      'mal_anime_source'    => brep( $mal_anime_source    ),
				      'mal_manga_authors'   => brep( $mal_manga_authors   ),
				      'mal_genres'          => brep( $mal_genres          ),
				      'mal_duration'        => brep( $mal_duration        ),
				      ),
				      'statistics' =>
				      array(
				      'mal_score' => brep( $mal_score ),
				      'mal_rank'  => brep( $mal_rank  ),
				),				
				),
				'mal_list_staff'     => $mal_list_staff,
				'mal_list_voice'     => $mal_list_voice,
				'mal_list_characters' => $mal_list_characters,
				);

				print_r(json_encode($json));
		}
	}
	catch ( Exception $e )
	{ echo $e->getMessage(); }