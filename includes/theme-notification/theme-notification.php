<?php
/** 
 * @version 1.0.0
 */
theme_notification::init();
class theme_notification{
	public static $iden = 'theme_notification';
	public static $page_slug = 'notifications';
	public static $user_meta_key = array(
		'key' => 'theme_noti',
		'count' => 'theme_noti_count',
		'unread_count' => 'theme_noti_unread_count',
	);
	public static $pages = array();
	public static function init(){
		/** filter */
		add_filter('query_vars',			get_class() . '::filter_query_vars');
		add_filter('frontend_seajs_alias',	get_class() . '::frontend_seajs_alias');
		/** action */
		add_action('init', 					get_class() . '::page_create');
		add_action('template_redirect',		get_class() . '::template_redirect');
		add_action('frontend_seajs_use',	get_class() . '::frontend_seajs_use');
		//add_action('wp_ajax_nopriv_theme_quick_sign', 'theme_quick_sign::process');
		//add_filter('wp_title',				get_class() . '::wp_title',10,2);
	}

	public static function filter_query_vars($vars){
		if(!in_array('redirect',$vars)) $vars[] = 'redirect';
		return $vars;
	}
	public static function get_url(){
		return get_permalink(get_page_by_path(self::$page_slug));
	}
	public static function template_redirect(){
		if(is_page(self::$page_slug) && !is_user_logged_in()){
			$redirect = get_permalink(get_page_by_path(self::$page_slug));
			wp_redirect(theme_custom_sign::get_tabs('login',$redirect));
			die();
		}
	}
	public static function get_count($args){
		$defaults = array(
			'user_id' => null,
			'type' => 'all',
		);
		$args = wp_parse_args($args,$defaults);
		if(empty($args['user_id'])) return false;

		switch($args['type']){
			case 'unread':
				$metas = array_filter((array)get_user_meta($args['user_id'],self::$user_meta_key['unread_count'],true));
				return empty($metas) ? 0 : count($metas);
			default:
				$metas = array_filter((array)get_user_meta($args['user_id'],self::$user_meta_key['key']));
				return empty($metas) ? 0 : count($metas);
		}
	}
	public static function get_notifications($args){
		$defaults = array(
			'user_id' => null,
			'type' => 'all',/** all / unread / read */
			'posts_per_page' => null,
			'page' => 1,
			'orderby' => 'desc',
		);
		$args = wp_parse_args($args,$defaults);
		if(empty($args['user_id'])) return false;
		
		$metas = (array)get_user_meta($args['user_id'],self::$user_meta_key['key']);
		if(empty($metas)){
			return null;
		}else{
			asort($metas);
		}
		
		switch($args['type']){
			case 'unread':
				$unread = (array)get_user_meta($args['user_id'],self::$user_meta_key['unread_count'],true);
				if(empty($unread)){
					return $metas;
				}else{
					$metas = array_map(function($meta){
						if(!in_array($meta['id'],$unread)) return $meta;
						$meta['unread'] = true;
						return $meta;
					},$metas);
				}
			default:
				return $metas;
		}
	}
	public static function page_create(){
		if(!current_user_can('manage_options')) return false;
		
		$page_slugs = array(
			self::$page_slug => array(
				'post_content' 	=> '[' . self::$page_slug . ']',
				'post_name'		=> self::$page_slug,
				'post_title'	=> ___('Notifications'),
				'page_template'	=> 'page-' . self::$page_slug . '.php',
			)
		);
		
		$defaults = array(
			'post_content' 		=> '[post_content]',
			'post_name' 		=> null,
			'post_title' 		=> null,
			'post_status' 		=> 'publish',
			'post_type'			=> 'page',
			'comment_status'	=> 'closed',
		);
		foreach($page_slugs as $k => $v){
			$page = get_page_by_path($k);
			if(!$page){
				$r = wp_parse_args($v,$defaults);
				$page_id = wp_insert_post($r);
			}
		}
	}

	public static function process(){
		$output = array();
		
		theme_features::check_referer();
		theme_features::check_nonce();
		
		$type = isset($_REQUEST['type']) ? $_REQUEST['type'] : null;
		

		die(theme_features::json_format($output));
	}
	public static function frontend_seajs_alias($alias){
		if(is_user_logged_in() || !is_page(self::$page_slug)) return $alias;

		$alias[self::$iden] = theme_features::get_theme_includes_js(__FILE__);
		return $alias;
	}
	public static function frontend_seajs_use(){
		if(is_user_logged_in() || !is_page(self::$page_slug)) return false;
		?>
		seajs.use('<?php echo self::$iden;?>',function(m){
			m.config.process_url = '<?php echo theme_features::get_process_url(array('action' => theme_quick_sign::$iden));?>';
			m.config.lang.M00001 = '<?php echo esc_js(___('Loading, please wait...'));?>';
			m.config.lang.E00001 = '<?php echo esc_js(___('Sorry, server error please try again later.'));?>';
			
			m.init();
		});
		<?php
	}

}