<?php
/*
Feature Name:	Maintenance Mode
Feature URI:	http://www.inn-studio.com
Version:		1.1.6
Description:	Site in the background to maintain or measured using the change function, visitors will jump to a specified page, the administrator will not.
Author:			INN STUDIO
Author URI:		http://www.inn-studio.com
*/
class maintenance_mode{
	public static function init(){
		if(theme_cache::is_ajax()){
			add_filter('theme_options_save', __CLASS__ . '::options_save');
			add_action('wp_ajax_nopriv_' . __CLASS__, __CLASS__ . '::process');
			
		}else{
			if(theme_options::is_options_page()){
				add_action('dev_settings', __CLASS__ . '::display_backend',90);
			}
		}
		add_action('after_setup_theme', __CLASS__ . '::redirect');
	
	}
	public static function get_options($key = null){
		static $caches = [];
		if(!isset($caches[__CLASS__]))
			$caches[__CLASS__] = theme_options::get_options(__CLASS__);

		if($key){
			return isset($caches[__CLASS__][$key]) ? $caches[__CLASS__][$key] : null;
		}else{
			return $caches[__CLASS__];
		}
	}
	public static function has_url(){
		static $caches = [];
		if(!isset($caches[__CLASS__]))
			$caches[__CLASS__] = trim(esc_url(self::get_options('url')));

		return empty($caches[__CLASS__]) ? null : $caches[__CLASS__];
	}
	public static function display_backend(){
		
		$options = self::get_options();
		$url = isset($options['url']) ?  stripslashes($options['url']): null
		?>
		<!-- maintenance_mode -->
		<fieldset>
			<legend><i class="fa fa-fw fa-wrench"></i> <?= ___('Maintenance Mode');?></legend>
			<p class="description"><?= ___('If your site needs to test privately, maybe fill a URL in the redirect area that the the visitors will see the redirect page but yourself, otherwise left blank.');?></p>
			<p class="description"><strong><?= ___('Attention: if theme has frontend log-in page, please DO NOT use maintenance mode, or you can not log-in to background.');?></strong></p>
			<table class="form-table">
				<tbody>
					<tr>
						<th scope="row"><label for="<?= __CLASS__;?>-url"><?= ___('Redirect URL (include http://):');?></label></th>
						<td>
							<input type="url" id="<?= __CLASS__;?>-url" name="<?= __CLASS__;?>[url]" class="widefat" value="<?= $url;?>"/>
							
							<p class="description">
								<?= ___('Optional template URL: ');?>
							
								<input type="url" class="widfat text-select" value="<?= theme_features::get_process_url(array('action'=>__CLASS__));?>" readonly />
							</p>
						</td>
					</tr>
				</tbody>
			</table>
		</fieldset>
	<?php
	}
	public static function process($output){
		if(!self::has_url())
			return;
		$output = '
<!doctype html>
<html lang="' . theme_cache::get_bloginfo('language') . '">
	<head>
	<meta charset="' . theme_cache::get_bloginfo( 'charset' ) . '">
	<title>' . esc_attr(theme_cache::get_bloginfo('name')) . ' - ' . ___('Maintenance Mode') . '</title>
	<style>
	body {font:20px/2 "Microsoft YaHei",Arial,"Liberation Sans",FreeSans,sans-serif;text-align: center; padding: 150px; color: #333;}
	article { display: block; text-align: left; width: 650px; margin: 0 auto; }
	a { color: #dc8100; text-decoration: none; }
	a:hover { color: #333; }
	.by{text-align:right;}
	</style>
	</head>
	 <body>
		<article>
		<h1>' . ___('We&rsquo;ll be back soon!') . '</h1>
		<p>' . sprintf(___('Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment. If you need to you can always <a href="mailto:%s">contact us</a>, otherwise we&rsquo;ll be back online shortly!'),theme_cache::get_bloginfo('admin_email')) . '</p>
		<p class="by">&mdash; ' . theme_cache::get_bloginfo('name') . '</p>
		</article>
	</body>
</html>
		';
		die($output);
		
	}
	/**
	 * Save options
	 */
	public static function options_save($options){
		if(isset($_POST[__CLASS__])){
			$options[__CLASS__] = $_POST[__CLASS__];
		}
		return $options;
	}
	/**
	 * Redirect
	 */
	public static function redirect(){
		$url = self::has_url();
		if(!theme_cache::current_user_can('manage_options') && $url){
			header("Location: $url");
			die;
		}
	}
}
add_filter('theme_addons',function($fns){
	$fns[] = 'maintenance_mode::init';
	return $fns;
});