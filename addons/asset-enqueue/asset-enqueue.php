<?php
/**
 * @version 1.0.2
 */
class theme_asset_enqueue{
	public static function init(){
		
		add_action( 'wp_enqueue_scripts', __CLASS__  . '::seajs_enqueue_scripts' ,1);
		add_action( 'wp_enqueue_scripts', __CLASS__  . '::frontend_enqueue_css' ,1);
	}
	/**
	 * JS
	 */
	public static function seajs_enqueue_scripts(){
		$js = [
			'frontend-seajs' => [
				'deps' => [],
				'url' => theme_features::get_theme_js('seajs/sea'),
			],
			
		];
		
		foreach($js as $k => $v){
			wp_enqueue_script(
				$k,
				$v['url'],
				isset($v['deps']) ? $v['deps'] : [],
				self::get_version($v),
				true
			);
		}
		
	}

	private static function get_version($v){
		return array_key_exists('version', $v) ? $v['version'] : theme_file_timestamp::get_timestamp();
	}
	/**
	 * CSS
	 */
	public static function frontend_enqueue_css(){
		$css = [
			'frontend' => [
				'deps' => ['awesome'],
				'url' =>  theme_features::get_theme_css('frontend/frontend'),
			],
			'awesome' => [
				'deps' => [],
				'url' => 'http://cdn.bootcss.com/font-awesome/4.4.0/css/font-awesome.min.css',
				'version' => null,
			],
			//'awesome' => [
			//	'deps' => [],
			//	'url' => theme_features::get_theme_css('modules/awesome/4.4.0/css/font-awesome'),
			//],
			
		];

		foreach($css as $k => $v){

			wp_enqueue_style(
				$k,
				$v['url'],
				isset($v['deps']) ? $v['deps'] : [],
				self::get_version($v)
			);
		}
	}
}
add_filter('theme_addons',function($fns){
	$fns[] = 'theme_asset_enqueue::init';
	return $fns;
});