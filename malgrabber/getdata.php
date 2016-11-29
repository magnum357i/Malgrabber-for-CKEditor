	<?php
	require 'image_settings.php';
	require 'cookie_settings.php';

	$ctval = 1;

	if(isset($_COOKIE[$config["cookie_name"]]))
	{ $ctval = $_COOKIE[$config["cookie_name"]]; }
	else
	{ setcookie($config["cookie_name"], 1, $config["cookie_timeout"]); }

	$url = $_POST["url"];

	if ( $ctval >= $config["cookie_limit"] ) { echo "limit is over"; }
	else {

		setcookie($config["cookie_name"], $ctval + 1, $config["cookie_timeout"]);

		if (isset($url)){

		$base_path   = dirname(__FILE__) . "/";
		$server_path = dirname($_SERVER['PHP_SELF']) . "/";
		$server_path = str_replace("//","/",$server_path);

		$content     = file_get_contents($url);
		$mal_title   = get_text('@<span itemprop="name">(.*?)</span>@i',$content,false);
		$mal_poster  = get_image('@(https://myanimelist.cdn-dena.com/images/(anime|manga)/[0-9]+/[0-9]+\.jpg)@si',$content);
		$mal_subject = get_text('@<span itemprop="description">(.*?)</span>@si',$content,true);

			if(empty($mal_title) and empty($mal_subject) and empty($mal_poster)){echo 'missing data';}
			elseif(!is_dir($base_path . $config["image_save_path"])){echo 'poster folder is not created';}
			else{

			$image_path   = $mal_poster;
			$image_size   = getimagesize($image_path);
			$image_width  = $image_size[0];
			$image_height = $image_size[1];
			$image_name   = preg_replace("@https?://myanimelist.cdn-dena.com/images/(anime|manga)/[0-9]+/@i", "", $image_path);

				if($image_width > $config["image_max_size"] and $image_width > $config["image_max_size"]) {echo "poster size is too big";}
				else{
					if(!file_exists($base_path . $config["image_save_path"] . $image_name)){
						copy($image_path, $base_path . $config["image_save_path"] . $image_name);
					}
				}

				$mal_poster = $server_path . 'malposter=' . str_replace('.jpg','',$image_name);

				$mal_title_alt             = $_POST["custom_title"];
				$mal_title_english         = get_text('@<span class="dark_text">english:</span>(.*?)</div>@si',         $content, false);
				$mal_title_japanese        = get_text('@<span class="dark_text">japanese:</span>(.*?)</div>@si',        $content, false);
				$mal_title_synonyms        = get_text('@<span class="dark_text">synonyms:</span>(.*?)</div>@si',        $content, false);

				$mal_type                  = get_text('@<span class="dark_text">type:</span> <a href=".*">(.*?)</a>@i', $content, false);
				$mal_episode               = get_text('@<span class="dark_text">episodes:</span>(.*?)</div>@si',        $content, false);
				$mal_manga_volume          = get_text('@<span class="dark_text">volumes:</span>(.*?)</div>@si',         $content, false);
				$mal_manga_chapter         = get_text('@<span class="dark_text">chapters:</span>(.*?)</div>@si',        $content, false);
				$mal_status                = get_text('@<span class="dark_text">status:</span>(.*?)</div>@si',          $content, false);

				$mal_date                  = get_text('@<span class="dark_text">aired:</span>(.*?)</div>@si',           $content, false);
				if(!$mal_date){$mal_date   = get_text('@<span class="dark_text">published:</span>(.*?)</div>@si',       $content, false);}

				$mal_anime_publisher       = get_text('@<span class="dark_text">studios:</span>(.*?)</div>@si',         $content, false);
				$mal_manga_publisher       = get_text('@<span class="dark_text">serialization:</span>(.*?)</div>@si',   $content, false);
				$mal_anime_source          = get_text('@<span class="dark_text">source:</span>(.*?)</div>@si',          $content, false);
				$mal_manga_authors         = get_text('@<span class="dark_text">authors:</span>(.*?)</div>@si',         $content, false);
				$mal_genres                = get_text('@<span class="dark_text">genres:</span>(.*?)</div>@si',          $content, false);
				$mal_duration              = get_text('@<span class="dark_text">duration:</span>(.*?)</div>@si',        $content, false);

				$mal_score                 = get_text('@<span itemprop="ratingValue">(.*?)</span>@si',                  $content, false);
				if(!$mal_score){$mal_score = get_text('@<span class="dark_text">score:</span>(.*?)<sup>@i',             $content, false);}	

				$mal_rank                  = get_text('@<span class="dark_text">ranked:</span>(.*?)<sup>@si',           $content, false);
				$mal_external_links        = get_text('@<h2>external links</h2>(.*)</div>@i',                           $content, false);



				$mal_title           = $mal_title;
				$mal_title_alt       = $_POST["custom_title"];
					if($mal_title_alt != ""){
					$mal_title_temp  = $mal_title;
					$mal_title       = $mal_title_alt;
					$mal_title_alt   = $mal_title_temp;
					}

				$mal_subject         = replace_text('/\n.*\n\(source:.*\)/i',"",$mal_subject);
				$mal_subject         = replace_text('/\n.*\n\[written by.+\]/i',"",$mal_subject);

				$mal_rank            = replace_text('/#/',"",$mal_rank);

				$json =
				array(
				'mal_title'        => brep($mal_title),
				'mal_poster'       => brep($mal_poster),
				'mal_subject'      =>
				array(
				      'mal_title_alt'        => brep($mal_title_alt),
				      'mal_title_english'    => brep($mal_title_english),
				      'mal_title_japanese'   => brep($mal_title_japanese),
				      'mal_title_synonyms'   => brep($mal_title_synonyms),
				      'mal_subject'          => $mal_subject,
				),
				'mal_info'         =>
				array(
				      'info'       =>
				      array(
				      'mal_type'            => brep($mal_type),
				      'mal_episode'         => brep($mal_episode),
				      'mal_manga_volume'    => brep($mal_manga_volume),
				      'mal_manga_chapter'   => brep($mal_manga_chapter),
				      'mal_date'            => brep($mal_date),
				      'mal_anime_publisher' => brep($mal_anime_publisher),
				      'mal_manga_publisher' => brep($mal_manga_publisher),
				      'mal_anime_source'    => brep($mal_anime_source),
				      'mal_manga_authors'   => brep($mal_manga_authors),
				      'mal_genres'          => brep($mal_genres),
				      'mal_duration'        => brep($mal_duration),
				      ),
				      'statistics' =>
				      array(
				      'mal_score'           => brep($mal_score),
				      'mal_rank'            => brep($mal_rank),
				),
				'mal_external_links' => $mal_external_links,
				));

				print_r(json_encode($json));

			}

		}
	}

	function get_image($r,$c){
		preg_match($r,$c,$m);
		if(count($m) > 0){
		return $m[1];
		}
	}

	function get_text($r,$c,$s){
		preg_match($r,$c,$m);
		if(count($m) > 0){
		if($s == false){$m[1] = $m[1];}
		return strip_tags($m[1],"<br>");
		}
	}

	function replace_text($r,$c,$m){
		return preg_replace($r,$c,$m);
	}

	function brep($t){
	$r = $t;
	$r = str_replace("\n","",$r);
	$r = trim($r);
	return $r;
	}