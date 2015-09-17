<?php
/**
 * @version 1.0.0
 */
add_filter('theme_includes',function($fns){
	$fns[] = 'theme_full_width_mode::init';
	return $fns;
});
class theme_full_width_mode{

	public static function init(){
		add_action('wp_enqueue_scripts', 	__CLASS__ . '::frontend_css');
		add_filter('frontend_seajs_alias' , __CLASS__ . '::frontend_seajs_alias');
		add_action('frontend_seajs_use' , __CLASS__ . '::frontend_seajs_use');
	}
	public static function frontend_seajs_alias(array $alias = []){
		if(theme_cache::is_singular())
			$alias[__CLASS__] = theme_features::get_theme_includes_js(__DIR__);
		return $alias;
	}
	public static function frontend_seajs_use(){
		if(!theme_cache::is_singular()) 
			return false;
		?>
		seajs.use('<?= __CLASS__;?>',function(m){
			m.config.lang.M01 = '<?= ___('Full width mode');?>';
			m.init();
		});
		<?php
	}
	public static function frontend_css(){
		if(!theme_cache::is_singular()) 
			return false;
			
		wp_enqueue_style(
			__CLASS__,
			theme_features::get_theme_includes_css(__DIR__),
			'frontend',
			theme_file_timestamp::get_timestamp()
		);
	}
}