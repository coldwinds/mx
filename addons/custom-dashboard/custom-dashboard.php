<?php
/**
 * @version 1.0.1
 */
class theme_custom_dashboard{
	public static $page_slug = 'account';

	public static function init(){	
		if(!theme_cache::is_ajax()){
			add_filter('wp_title',				__CLASS__ . '::wp_title',10,2);
			include __DIR__ . '/dashboards.php';
		}
		
		foreach(self::get_tabs() as $k => $v){
			$nav_fn = 'filter_nav_' . $k; 
			add_filter('account_navs',__CLASS__ . "::$nav_fn",$v['filter_priority']);
		}

	}
	public static function wp_title($title, $sep){
		if(!self::is_page()) 
			return $title;
			
		$tab_active = get_query_var('tab');
		$tabs = self::get_tabs();
		if(!empty($tab_active) && isset($tabs[$tab_active])){
			$title = $tabs[$tab_active]['text'];
		}
		return $title . $sep . theme_cache::get_bloginfo('name');
	}
	public static function filter_nav_dashboard($navs){
		$navs['dashboard'] = '<a href="' . esc_url(self::get_tabs('dashboard')['url']) . '">
			<i class="fa fa-' . self::get_tabs('dashboard')['icon'] . ' fa-fw"></i> 
			' . self::get_tabs('dashboard')['text'] . '
		</a>';
		return $navs;
	}

	public static function is_page(){
		static $cache = null;
		if($cache === null)
			$cache = 
				theme_cache::is_page(self::$page_slug) &&
				(get_query_var('tab') === 'dashboard' || 
				!get_query_var('tab'));
			
		return $cache;
	}
	public static function get_url(){
		static $cache = null;
		if($cache === null)
			$cache = theme_cache::get_permalink(theme_cache::get_page_by_path(self::$page_slug)->ID);
		return $cache;
	}
	public static function get_tabs($key = null){
		$baseurl = self::get_url();
		$tabs = array(
			'dashboard' => array(
				'text' => ___('Dashboard'),
				'icon' => 'dashboard',
				'url' => esc_url(add_query_arg('tab','dashboard',$baseurl)),
				'filter_priority' => 10,
			),
		);
		if($key){
			return isset($tabs[$key]) ? $tabs[$key] : false;
		}
		return $tabs;
	}
}
add_filter('theme_addons',function($fns){
	$fns[] = 'theme_custom_dashboard::init';
	return $fns;
});