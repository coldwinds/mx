<?php
/**
 * @version 1.0.2
 */
if(!class_exists('emoji_fix')){
	class emoji_fix{
		public static function init(){
			add_filter('emoji_url', 'emoji_fix::url');
			if(!theme_cache::is_admin()){
				remove_action('wp_head', 'print_emoji_detection_script', 7);
				add_action('wp_footer', 'print_emoji_detection_script', 7 ); 
			}
		}
		public static function url(){
			static $url = null;
			if($url === null)
				$url = set_url_scheme('//cdnjs.cloudflare.com/ajax/libs/twemoji/1.4.1/72x72/');
			return $url;
		}
	}
	add_filter('theme_addons',function($fns){
		$fns[] = 'emoji_fix::init';
		return $fns;
	});
}

