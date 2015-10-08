<?php 
/**
 * Theme Options
 * the theme options and show admin control planel
 * 
 * @version 5.1.0
 * 
 */
class theme_options{
	public static $iden = 'theme_options';
	public static $opts = [];
	/**
	 * init
	 * 
	 * @return 
	 * @version 2.0.0
	 */
	public static function init(){
		add_action('admin_menu', __CLASS__ . '::add_page');
		add_action('admin_bar_menu', __CLASS__ . '::add_bar',61);
		add_action('wp_ajax_' . __CLASS__ , __CLASS__ . '::process');
		add_action('admin_init', __CLASS__ . '::admin_init' );
	}
	public static function admin_init(){
		if(!self::is_options_page())
			return false;
		add_action('admin_head', __CLASS__ . '::backend_css');
		add_action('admin_footer', __CLASS__ . '::backend_js');
		add_action('backend_seajs_alias', __CLASS__ . '::backend_seajs_alias');
	}
	/**
	 * get the theme options from the features default value or DB.
	 * 
	 * @usedby theme_options::get_options()
	 * @return array
	 * @version 2.0.0
	 * @since 3.1.0
	 * 
	 */
	public static function get_options($key = null){
		static $mod = null;
		if($mod === null)
			$mod = (array)get_theme_mod(__CLASS__);
			
		/** Default options hook */
		self::$opts = array_merge(
			apply_filters('theme_options_default',[]),
			$mod
		);

		if($key)
			return isset(self::$opts[$key]) ? self::$opts[$key] : false;
		return self::$opts;
	}
	public static function process(){
		
		if(!isset($_POST[__CLASS__]['nonce']))
			die;
			
		if(!wp_verify_nonce($_POST[__CLASS__]['nonce'],__CLASS__))
			die;
		
		self::options_save();
		
		wp_redirect(add_query_arg(
			'updated',
			true,
			self::get_url()
		));
		die;
	}
	public static function get_url(){
		static $cache = null;
		if($cache === null)
			$cache = admin_url('themes.php?page=core-options');
		return $cache;
	}
	public static function backend_css(){
		if(!theme_cache::current_user_can('manage_options'))
			return false;


		if(!self::is_options_page())
			return false;

		?>
		<link rel="stylesheet" href="http://cdn.bootcss.com/font-awesome/4.4.0/css/font-awesome.min.css">
		<?= theme_features::get_theme_css('backend/style','normal');?>
		<?php
		/**
		 * add admin_css hook 
		 */
		do_action('backend_css');
	}
	public static function backend_js(){
		if(!theme_cache::current_user_can('manage_options'))
			return false;

		if(!self::is_options_page())
			return false;

		?><script id="seajsnode" src="<?= theme_features::get_theme_js('seajs/sea');?>"></script>
		<script>
		<?php
		$config = [];
		$config['base'] = theme_features::get_theme_js();
		$config['paths'] = array(
			'theme_js' => theme_features::get_theme_js(),
			'theme_css' => theme_features::get_theme_css(),
		);
		$config['vars'] = array(
			'locale' => str_replace('-','_',theme_cache::get_bloginfo('language')),
			'theme_js' => theme_features::get_theme_js(),
			'theme_css' => theme_features::get_theme_css(),
			'process_url' => theme_features::get_process_url(),
		);
		$config['map'] = array(
			['.css','.css?v=' . theme_file_timestamp::get_timestamp()],
			['.js','.js?v=' . theme_file_timestamp::get_timestamp()]
		);
		/** 
		 * seajs hook
		 */
		$config['paths'] = apply_filters('backend_seajs_paths',$config['paths']);
		$config['alias'] = apply_filters('backend_seajs_alias',[]);
		$config['vars'] = apply_filters('backend_seajs_vars',$config['vars']);
		$config['map'] = apply_filters('backend_seajs_map',$config['map']);

		?>
		seajs.config(<?= json_encode($config);?>);
		<?php do_action('before_backend_tab_init');?>
		seajs.use('backend',function(backend_m){
			backend_m.config.lang.M01 = '<?= ___('Saving your settings, please wait...');?>';
			backend_m.init();
			<?php do_action('after_backend_tab_init');?>
		});
		</script>
		<?php	
	}
	public static function backend_seajs_alias(array $alias = []){
		$alias['backend'] = theme_features::get_theme_js('backend');
		return $alias;
	}
	/**
	 * show the options settings for admin theme setting page.
	 * 
	 * @return string html string for options
	 * @version 3.2.0
	 * 
	 */
	public static function display_backend(){
		?>
		<div class="wrap">
			<?php if(isset($_GET['updated'])){?>
				<div id="settings-updated">
					<?= status_tip('success',___('Your settings were saved successfully.'));?>
				</div>
			<?php } ?>
			<form id="backend-options-frm" method="post" action="<?= theme_features::get_process_url([
				'action' => __CLASS__,
			]);?>">
				
				<div class="backend-tab-loading"><?= status_tip('loading',___('Loading your settings, please wait...'));?></div>
				
				<div id="backend-tab" class="backend-tab">
					<nav class="tab-header">

						<a href="<?= theme_functions::theme_meta_translate()['theme_url'];?>" target="_blank" title="<?= ___('Visit the official of theme');?>" class="tab-title">
							<?= theme_functions::theme_meta_translate()['name'];?>
						</a>
					
						<span class="tab-item" title="<?= ___('The theme common basic settings.');?>">
							<i class="fa fa-fw fa-cog"></i> 
							<span class="tx"><?= ___('Basic settings');?></span>
						</span><!-- basic settings -->
						
						<span class="tab-item" title="<?= ___('You can customize the theme in this label.');?>">
							<i class="fa fa-fw fa-paint-brush"></i> 
							<span class="tx"><?= ___('Page settings');?></span>
						</span><!-- page settings -->
						
						<span class="tab-item" title="<?= ___('If the theme there are some problems, you can try to use these settings.');?>">
							<i class="fa fa-fw fa-cogs"></i> 
							<span class="tx"><?= ___('Advanced settings');?></span>
						</span><!-- advanced settings -->
						
						<span class="tab-item" title="<?= ___('This settings is for developer, if you want to debug code, you can try this.');?>">
							<i class="fa fa-fw fa-code"></i> 
							<span class="tx"><?= ___('Developer settings');?></span>
						</span><!-- developer mode -->
						
						<span class="tab-item" title="<?= ___('If you in trouble, maybe this label can help you.');?>">
							<i class="fa fa-fw fa-question-circle"></i> 
							<span class="tx"><?= ___('About &amp; help');?></span>
						</span><!-- about and help -->
						
					</nav>

					
					<div class="tab-body">
						<div class="tab-item">
							<?php do_action('base_settings');?>
						</div><!-- BASE SETTINGS -->
					
						<div class="tab-item">
							<?php do_action('page_settings');?>
						</div><!-- PAGE SETTINGS -->
					
						<div class="tab-item">
							<?php do_action('advanced_settings');?>
						</div><!-- ADVANCED SETTINGS -->
					
						<div class="tab-item">
							<?php do_action('dev_settings');?>
						</div><!-- DEVELOPER SETTINGS -->
					
						<div class="tab-item">
							<?php do_action('help_settings');?>
						</div><!-- ABOUT and HELP -->
					</div><!-- tab-content -->
				</div><!-- backend-tab -->
		
				<p>
					<input type="hidden" name="<?= __CLASS__;?>[nonce]" value="<?= wp_create_nonce(__CLASS__);?>">
					
					<button id="submit" type="submit" class="button button-primary button-large"><i class="fa fa-check"></i> <span class="tx"><?= ___('Save all settings');?></span></button>
					
					<label for="options-restore" class="label-options-restore" title="<?= ___('Something error with theme? Try to restore. Be careful, theme options will be cleared up!');?>">
						<input id="options-restore" name="<?= __CLASS__;?>[restore]" type="checkbox" value="1"/>
						<?= ___('Restore to theme default options');?> <i class="fa fa-question-circle"></i>
					</label>
				</p>
			</form>
		</div>
		<?php
	}
	/**
	 * Save Options
	 * 
	 * @version 2.0.0
	 * 
	 */
	private static function options_save(){
		if(!theme_cache::current_user_can('manage_options'))
			return false;

		$opts_new = apply_filters(__CLASS__ . '_save',[]);
		
		/** Reset the options? */
		if(isset($_POST[__CLASS__]['restore'])){
			/** Delete theme options */
			set_theme_mod(__CLASS__,[]);
		}else{
			set_theme_mod(__CLASS__,$opts_new);
		}
	}
	/**
	 * set_options
	 *
	 * @param string options key
	 * @param mixd
	 * @return array options
	 * @version 1.0.2
	 */
	public static function set_options($key,$data){
		self::$opts = self::get_options();		
		self::$opts[$key] = $data;
		set_theme_mod(__CLASS__,self::$opts);
		return self::$opts;
	}
	/**
	 * delete_options
	 *
	 * @param string
	 * @return 
	 * @version 1.0.2
	 */
	public static function delete_options($key){
		self::$opts = self::get_options();
		if(!isset(self::$opts[$key]))
			return false;
		
		unset(self::$opts[$key]);
		set_theme_mod(__CLASS__,self::$opts);
		return self::$opts;
	}
	/**
	 * is_options_page
	 * 
	 * @return bool
	 * @version 1.0.1
	 */
	public static function is_options_page(){
		if(!theme_cache::current_user_can('manage_options'))
			return false;
			
		if(is_admin() && isset($_GET['page']) && $_GET['page'] === 'core-options'){
			return true;
		}else{
			return false;
		}
	}

	/**
	 * Add to page
	 * 
	 * 
	 * @return n/a
	 * @version 1.0.0
	 * 
	 */
	public static function add_page(){
		if(!theme_cache::current_user_can('manage_options'))
			return false;
		/* Add to theme setting menu */
		add_theme_page(
			___('Theme settings'),
			___('Theme settings'), 
			'edit_themes', 
			'core-options',
			__CLASS__ . '::display_backend'
		);
	}
	/**
	 * Add admin bar
	 * 
	 * 
	 * @return 
	 * @version 1.0.1
	 * 
	 */
	public static function add_bar(){
		if(!theme_cache::current_user_can('manage_options'))
			return false;
		
		global $wp_admin_bar;
		$wp_admin_bar->add_menu( array(
			'parent' => 'appearance',
			'id' => 'theme_settings',
			'title' => ___('Theme settings'),
			'href' => self::get_url()
		));
	}
}
theme_options::init();