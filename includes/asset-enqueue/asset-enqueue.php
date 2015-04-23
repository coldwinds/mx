<?php
/**
 * @version 1.0.0
 */
add_filter('theme_includes',function($fns){
	$fns[] = 'theme_asset_enqueue::init';
	return $fns;
});
class theme_asset_enqueue{
	public static $iden = 'theme_asset_enqueue';
	
	public static function init(){
		
		add_action( 'wp_enqueue_scripts', __CLASS__  . '::seajs_enqueue_scripts' ,1);
		add_action( 'wp_enqueue_scripts', __CLASS__  . '::frontend_enqueue_css' ,1);
	}
	public static function is_cdn_enabled(){
		
	}
	/**
	 * JS
	 */
	public static function seajs_enqueue_scripts(){
		$js = [
			'frontend-seajs' => [
				'deps' => [],
				'src' => theme_features::get_theme_js('seajs/sea',true,false),
			],
			'jquery' => [
				'deps' => [],
				'cdn' => 'http://ajax.aspnetcdn.com/ajax/jquery/jquery-2.1.3.min.js',
				'version' => null,
			],
			'bootstrap' => [
				'deps' => ['jquery'],
				'cdn' => 'http://ajax.aspnetcdn.com/ajax/bootstrap/3.3.4/bootstrap.min.js',
				'version' => null,
			],
			
			
		];
		/**
		 * first deregister
		 */
		self::frontend_deregister_js();
		
		foreach($js as $k => $v){
			wp_enqueue_script(
				$k,
				isset($v['src']) ? $v['src'] : $v['cdn'],
				isset($v['deps']) ? $v['deps'] : [],
				self::get_version($v)
				
			);
		}
		
	}
	public static function frontend_deregister_js(){
		$js = [
			'jquery'
		];
		foreach($js as $v){
			wp_deregister_script( $v );
		}
	}
	private static function get_version($v){
		return array_key_exists('version', $v) ? $v['version'] : theme_features::get_theme_info('version');
	}
	/**
	 * CSS
	 */
	public static function frontend_enqueue_css(){
		$css = [
			'frontend' => [
				'deps' => ['bootstrap','awesome'],
				'src' =>  theme_features::get_theme_css('frontend/style',false,false),
			],
			'bootstrap' => [
				'deps' => [],
				'cdn' => 'http://ajax.aspnetcdn.com/ajax/bootstrap/3.3.4/css/bootstrap.min.css',
				'version' => null,
			],
			'awesome' => [
				'deps' => [],
				'cdn' => 'http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css',
				'version' => null,
			],
			
		];

		foreach($css as $k => $v){

			
			wp_enqueue_style(
				$k,
				isset($v['src']) ? $v['src'] : $v['cdn'],
				isset($v['deps']) ? $v['deps'] : [],
				self::get_version($v)
			);
		}
	}
}