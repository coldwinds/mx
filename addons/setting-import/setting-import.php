<?php
/*
Feature Name:	theme_import_settings
Feature URI:	http://www.inn-studio.com
Version:		3.0.2
Description:	theme_import_settings
Author:			INN STUDIO
Author URI:		http://www.inn-studio.com
*/
add_filter('theme_addons',function($fns){
	$fns[] = 'theme_import_settings::init';
	return $fns;
});
class theme_import_settings{
	public static function init(){
		add_action('wp_ajax_' . __CLASS__,	__CLASS__ . '::process');
		add_action('after_backend_tab_init',	__CLASS__ . '::backend_seajs_use'); 
		add_filter('backend_seajs_alias' , 		__CLASS__ . '::backend_seajs_alias');
		add_action('backend_css',				__CLASS__ . '::backend_css'); 
		add_action('advanced_settings',			__CLASS__ . '::display_backend',99);		
	}
	public static function display_backend(){
		
		?>
		<fieldset>
			<legend><?= ___('Import &amp; export theme settings');?></legend>
			<p class="description">
				<?= ___('You can select the settings file to upload and restore settings if you have the *.txt file. If you want to export the settings backup, please click the export button.');?>
			</p>
			<table class="form-table">
				<tbody>
					<tr>
						<th scope="row"><?= ___('Import');?></th>
						<td>
							<div id="<?= __CLASS__;?>-tip"></div>
							<div id="<?= __CLASS__;?>-upload-area">
								<span id="<?= __CLASS__;?>-import" class="button">
									<i class="fa fa-history"></i> 
									<?= ___('Select a setting file to restore');?>
									<input id="<?= __CLASS__;?>-file" type="file" />
								</span>
								
							</div>
						</td>
					</tr>
					<tr>
						<th scope="row"><?= ___('Export');?></th>
						<td>
							<a href="<?= esc_url(theme_features::get_process_url([
								'action' => __CLASS__,
								'type' => 'export',
								'theme-nonce' => wp_create_nonce('theme-nonce'),
							]));?>" id="<?= __CLASS__;?>-export" class="button"><i class="fa fa-cloud-download"></i> <?= ___('Start export settings file');?></a>
						</td>
					</tr>
				</tbody>
			</table>
		</fieldset>
	<?php
	}
	/**
	 * Process
	 * 
	 * 
	 * @return 
	 * @version 1.0.0
	 * 
	 */
	public static function process(){

		theme_features::check_referer();
		theme_features::check_nonce();
		
		if(!theme_cache::current_user_can('manage_options'))
			die;
			
		$output = [];
		
		$type = isset($_REQUEST['type']) ? $_REQUEST['type'] : null;

		switch($type){
			case 'import':
				$contents = isset($_POST['b64']) && is_string($_POST['b64']) ? json_decode(base64_decode($_POST['b64']),true) : null;

				if(is_array($contents) && !empty($contents)){
					set_theme_mod(theme_options::$iden,$contents);
					$output['status'] = 'success';
					$output['msg'] = ___('Settings has been restored, refreshing page, please wait...');
				/**
				 * invalid contents
				 */
				}else{
					$output['status'] = 'error';
					$output['msg'] = ___('Invalid content.');
				}
				break;
			/**
			 * export
			 */
			case 'export':
				$contents = base64_encode(json_encode(theme_options::get_options()));
				/**
				 * write content to a tmp file
				 */
				$tmp = tmpfile();
				$filepath = stream_get_meta_data($tmp)['uri'];
				file_put_contents($filepath,$contents);
				/**
				 * output file download
				 */
				header('Content-Description: File Transfer');
				header('Content-Type: application/octet-stream');
				header('Expires: 0');
				header('Cache-Control: must-revalidate');
				header('Pragma: public');
				header('Content-Length: ' . filesize($filepath));
				
				$download_fn = ___('Backup') ;
				$download_fn .= '-' . theme_cache::get_bloginfo('name');
				$download_fn .= '-' . theme_functions::$iden;
				$download_fn .= '-' . date('Ymd-His') . '.bk';
				
				header('Content-Disposition: attachment; filename=" ' . $download_fn . '"');
				
				readfile($filepath); 

				die;
		}

		die(theme_features::json_format($output));
	}
	/**
	 * Load style
	 * 
	 * 
	 * @return string HTML
	 * @version 1.0.0
	 * 
	 */
	public static function backend_css(){
		?>
		<link href="<?= theme_features::get_theme_addons_css(__DIR__,'backend',true);?>" rel="stylesheet"  media="all"/>
		<?php
	}
	public static function backend_seajs_alias(array $alias = []){
		$alias[__CLASS__] = theme_features::get_theme_addons_js(__DIR__,'backend');
		return $alias;
	}
	public static function backend_seajs_use(){
		?>
		seajs.use('<?= __CLASS__;?>',function(m){
			m.config.lang.M00001 = '<?= ___('Processing, please wait...');?>';
			m.config.lang.M00002 = '<?= ___('Error: Your browser does not support HTML5. ');?>';
			m.config.lang.E00001 = '<?= ___('Error: failed to complete the operation. ');?>';
			m.config.lang.E00002 = '<?= ___('Error: Not match file. ');?>';
			m.config.process_url = '<?= theme_features::get_process_url([
				'action' => __CLASS__
			]);?>';
			m.init();
		});
		<?php
	}
}

?>
