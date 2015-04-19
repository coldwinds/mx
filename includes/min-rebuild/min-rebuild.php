<?php
/*
Feature Name:	theme_min_rebuild
Feature URI:	http://www.inn-studio.com
Version:		2.0.1
Description:	Rebuild the minify version file of JS and CSS. If you have edit JS or CSS file.
Author:			INN STUDIO
Author URI:		http://www.inn-studio.com
*/

add_filter('theme_includes',function($fns){
	$fns[] = 'theme_min_rebuild::init';
	return $fns;
});
class theme_min_rebuild{
	private static $iden = 'theme_min_rebuild';
	public static function init(){
		add_action('dev_settings',				__CLASS__ . '::admin',90);
		add_action('wp_ajax_'. self::$iden,		__CLASS__ . '::process');		
	}
	/**
	 * Admin Display
	 */
	public static function admin(){
		
		$process_url = theme_features::get_process_url([
			'action' => self::$iden
		]);
		?>
		<!-- theme_min_rebuild -->
		<fieldset>
			<legend><?php echo ___('Rebuild minify version');?></legend>
			<p class="description"><?php echo ___('Rebuild the minify version file of JS and CSS. If you have edit JS or CSS file, please run it. May take several minutes.');?></p>
			<table class="form-table">
				<tbody>
					<tr>
						<th scope="row"><?php echo ___('Control');?></th>
						<td>
							<?php
							if(isset($_GET[self::$iden])){
								echo status_tip('success',___('Files have been rebuilt.'));
							}
							?>
							<p>
								<a href="<?php echo esc_url($process_url);?>" class="button" onclick="javascript:this.innerHTML='<?php echo ___('Rebuilding, please wait...');?>'"><?php echo ___('Start rebuild');?></a>
								<span class="description"><i class="fa fa-exclamation-circle"></i> <?php echo ___('Save your settings before rebuild');?></span>
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
		if(!current_user_can('manage_options'))
			return false;
		
		@ini_set('max_input_nesting_level','10000');
		@ini_set('max_execution_time','300'); 
		
		remove_dir(get_stylesheet_directory() . theme_features::$basedir_js_min);
		remove_dir(get_stylesheet_directory() . theme_features::$basedir_css_min);
		
		theme_features::minify_force(get_stylesheet_directory() . theme_features::$basedir_js_src);
		theme_features::minify_force(get_stylesheet_directory() . theme_features::$basedir_css_src);
		theme_features::minify_force(get_stylesheet_directory() . theme_features::$basedir_includes);
		
		wp_redirect(add_query_arg(self::$iden,1,theme_options::get_url()));
		
		die();
	}
}
?>