<?php
/*
Feature Name:	theme_min_rebuild
Feature URI:	http://www.inn-studio.com
Version:		2.0.2
Description:	Rebuild the minify version file of JS and CSS. If you have edit JS or CSS file.
Author:			INN STUDIO
Author URI:		http://www.inn-studio.com
*/

add_filter('theme_includes',function($fns){
	$fns[] = 'theme_min_rebuild::init';
	return $fns;
});
class theme_min_rebuild{
	public static function init(){
		add_action('advanced_settings',			__CLASS__ . '::display_backend');
		add_action('wp_ajax_'. __CLASS__,		__CLASS__ . '::process');		
	}
	/**
	 * Admin Display
	 */
	public static function display_backend(){
		?>
		<!-- theme_min_rebuild -->
		<fieldset>
			<legend><?= ___('Rebuild minify version');?></legend>
			<p class="description"><?= ___('Rebuild the minify version file of JS and CSS. If you have edit JS or CSS file, please run it. May take several minutes.');?></p>
			<table class="form-table">
				<tbody>
					<tr>
						<th scope="row"><?= ___('Control');?></th>
						<td>
							<?php
							if(isset($_GET[__CLASS__])){
								echo status_tip('success',___('Files have been rebuilt.'));
							}
							?>
							<p>
								<a href="<?= theme_features::get_process_url(['action' => __CLASS__ ]);?>" class="button button-primary" onclick="javascript:this.innerHTML='<?= ___('Rebuilding, please wait...');?>'"><?= ___('Start rebuild');?></a>
								<span class="description"><i class="fa fa-exclamation-circle"></i> <?= ___('Save your settings before rebuild');?></span>
							</p>
						</td>
					</tr>
				</tbody>
			</table>
		</fieldset>
	<?php
	}
	/**
	 * process
	 */
	public static function process(){
		if(!theme_cache::current_user_can('manage_options'))
			return false;
		
		@ini_set('max_input_nesting_level','10000');
		@ini_set('max_execution_time',0); 

		remove_dir(theme_features::get_stylesheet_directory() . theme_features::$basedir_js_min);
		theme_features::minify_force(theme_features::get_stylesheet_directory() . theme_features::$basedir_js_src);

		remove_dir(theme_features::get_stylesheet_directory() . theme_features::$basedir_css_min);
		theme_features::minify_force(theme_features::get_stylesheet_directory() . theme_features::$basedir_css_src);
		
		theme_features::minify_force(theme_features::get_stylesheet_directory() . theme_features::$basedir_includes);

		theme_file_timestamp::set_timestamp();
		
		wp_redirect(add_query_arg(__CLASS__,1,theme_options::get_url()));
		
		die;
	}
}
?>