<?php
/**
 * @version 1.1.0
 */
add_filter('theme_includes',function($fns){
	$fns[] = 'theme_custom_storage::init';
	return $fns;
});
class theme_custom_storage{
	public static $page_slug = 'storage-download';
	public static $post_meta_key = array(
		'key' => '_theme_custom_storage'
	);
	public static function init(){
		add_action('init',					__CLASS__ . '::page_create');
		add_action('add_meta_boxes', 		__CLASS__ . '::meta_box_add');
		add_action('save_post_post', 		__CLASS__ . '::meta_box_save');

		add_action('template_redirect',		__CLASS__ . '::template_redirect');
		
		add_action('wp_enqueue_scripts', 	__CLASS__ . '::frontend_css');
		
		//add_shortcode('post-stroage-download',__CLASS__ . '::add_shortcode');
		
		add_filter('wp_title',				__CLASS__ . '::wp_title',10,2);	

		add_action('page_settings',__CLASS__ . '::display_backend');
		add_filter('theme_options_save',__CLASS__ . '::options_save');
		add_filter('theme_options_default',__CLASS__ . '::options_default');

		add_action('wp_ajax_' . __CLASS__, __CLASS__ . '::process');
	}
	public static function wp_title($title, $sep){
		if(!self::is_page()) 
			return $title;

		$post = self::get_decode_post();
		if($post)
			return theme_cache::get_the_title($post->ID) . $sep . ___('storage download') . $sep . theme_cache::get_bloginfo('name');
	}
	public static function is_enabled(){
		return self::get_options('enabled') == 1;
	}
	public static function display_backend(){
		?>
		<fieldset>
			<legend><?= ___('Storage settings');?></legend>
			<p class="description"><?= ___('You can edit storage types here. They will display in contribution page.');?></p>
			<table class="form-table">
				<tbody>
				<tr>
					<th><label for="<?= __CLASS__;?>-enabled"><?= ___('Enable or not?');?></label></th>
					<td>
						<select name="<?= __CLASS__;?>[enabled]" id="<?= __CLASS__;?>-enabled" class="widefat">
							<?php the_option_list(-1,___('Disable'),self::get_options('enabled'));?>
							<?php the_option_list(1,___('Enable'),self::get_options('enabled'));?>
						</select>
					</td>
				</tr>
				<tr>
					<th><label for="<?= __CLASS__;?>-types"><?= ___('Storage types');?></label></th>
					<td>
						<textarea name="<= __CLASS__;?>[types]" id="<?= __CLASS__;?>-item" cols="50" rows="5" class="widefat" placeholder="<?= ___('ID = Storage name, e.g. bdpan = Baidu storage');?>"><?= self::get_types_text();?></textarea>
						<p class="description"><?= ___('One item per line');?></p>
					</td>
				</tr>
				<tr>
					<th><?= ___('Control');?></th>
					<td>
						<a class="button button-primary" target="_blank" href="<?= theme_features::get_process_url([
							'action' => __CLASS__,
							'type' => 'meta-convert',
						]);?>"><i class="fa fa-exchange"></i> <?= ___('Convert to new version data');?></a>
						<span class="description"><?= ___('This operation only needs to be performed once if you are upgrade from a old version.');?></span> 
					</td>
				</tr>
				</tbody>
			</table>
		</fieldset>
		<?php
	}
	public static function options_default(array $opts = []){
		$opts[__CLASS__] = [
			'enabled' => 1,
			'types' => [
				'bdyun' => ___('Baidu storage'),
				'360pan' => ___('360 storage'),
				'kuaipan' => ___('Thunder storage'),
				'mega' => ___('Mega storage'),
			],
		];
		return $opts;
	}
	public static function get_options($key = null){
		static $caches = null;
		if($caches === null)
			$caches = (array)theme_options::get_options(__CLASS__);
		if($key){
			if(isset($caches[$key])){
				return $caches[$key];
			}else{
				$caches[$key] = isset(self::options_default()[__CLASS__][$key]) ? self::options_default()[__CLASS__][$key] : false;
				return $caches[$key];
			}
		}
		return $caches;
	}
	public static function options_save(array $opts = []){
		if(isset($_POST[__CLASS__])){
			if(empty(trim($_POST[__CLASS__]['types']))){
				$opts[__CLASS__]['types'] = self::options_default()[__CLASS__]['types'];
			}else{
				$lines = explode("\n",$_POST[__CLASS__]['types']);
				$opts[__CLASS__]['types'] = array_map(function($v){
					$items = explode('=',$v);
					if(isset($items[0],$items[1]))
						return [trim($items[0]),trim($items[1])];
				},$lines);
			}
			$opts[__CLASS__] = $_POST[__CLASS__];
		}
		return $opts;
	}
	public static function get_types($key = null){
		$types = array_filter((array)self::get_options('types'));
		if($key)
			return isset($types[$key]) ? $types[$key] : false;
		return $types;
	}
	public static function get_types_text(){
		$types = self::get_options('types');
		$lines = [];
		foreach($types as $k => $v){
			$lines[] = $k . ' = ' . $v;
		}
		return stripslashes(implode("\n",$lines));
	}
	public static function template_redirect(){
		if(self::is_page() && !self::get_decode_post()){
			wp_die(
				___('Sorry, this URL is invaild.'),
				___('Error'),
				[
					'response' => 403,
					'back_link' => true,
				]
			);
		}
		return;
	}
	public static function get_post_meta($post_id){
		static $caches = [];
		if(isset($caches[$post_id]))
			return $caches[$post_id];
			
		$caches[$post_id] = array_filter((array)get_post_meta($post_id,self::$post_meta_key['key'],true));

		return $caches[$post_id];
		
	}
	public static function meta_box_add(){
		$screens = array( 'post' );
		foreach ( $screens as $screen ) {
			add_meta_box(
				__CLASS__,
				___('File storage'),
				__CLASS__ . '::meta_box_display',
				$screen,
				'side'
			);
		}
	}
	public static function meta_box_save($post_id){
		if(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) 
			return;
			
		if(!isset($_POST[__CLASS__]))
			return;
			
		$new_meta = array_filter((array)$_POST[__CLASS__]);
		if($new_meta)
			$new_meta = array_values($new_meta);
			
		$old_meta = self::get_post_meta($post_id);
		
		self::post_save($post_id, $old_meta, $new_meta);
		
	}
	public static function post_save($post_id, $old_meta = [], $new_meta = []){
		/** nothing to do */
		if($old_meta == $new_meta)
			return;
		if(!$old_meta && empty($new_meta[0]['url']))
			return;

		/** check */
		foreach($new_meta as $k => $v){
			if(!self::get_types($v['type']))
				$new_meta[$k]['type'] = 'bdyun';
				
			if($new_meta[$key]['url'])
				$new_meta[$key]['url'] = esc_url($new_meta[$key]['url']);
		}
		
		/** add */
		if(!$old_meta){
			add_post_meta($post_id,self::$post_meta_key['key'],$new_meta);
			return;
		}
		
		/** delete */
		if(isset($new_meta[0]['url']) && $new_meta[0]['url'] == ''){
			delete_post_meta($post_id,self::$post_meta_key['key']);
			return;
		}
		
		/** update */
		update_post_meta($post_id,self::$post_meta_key['key'],$new_meta);
	}
	public static function process(){
		theme_features::check_referer();
		if(!theme_cache::current_user_can('manage_options'))
			die;
		$type = isset($_REQUEST['type']) ? $_REQUEST['type'] : false;
		switch($type){
			case 'meta-convert':
				ini_set('max_execution_time', 300);
				$query = new WP_Query([
					'nopaging' => true,
					'meta_key' => self::$post_meta_key['key'],
				]);
				if(!$query->have_posts())
					die('OK');
				echo 'Found: ' . count($query->posts) . '<br>';
				global $post;
				foreach($query->posts as $post){
					setup_postdata($post);
					$old_meta = self::get_post_meta($post->ID);
					$new_meta = [];
					foreach($old_meta as $k => $v){
						if(isset($v['download-pwd']))
							break 1;
						$new_meta[] = [
							'type' => $k,
							'url' => $v['url'],
							'download-pwd' => $v['pwd'],
							'extract-pwd' => self::get_options('default-extract-pwd'),
						];
					}
					if(array_filter($new_meta)){
						update_post_meta($post->ID,self::$post_meta_key['key'],$new_meta);
						echo $post->ID . ' ... OK <br>';
					}
				}
				wp_reset_postdata();
				unset($query);
				die('ALL OK');

			default:
				
		}
	}
	public static function meta_box_display($post){
		$meta = array_filter((array)self::get_post_meta($post->ID));
		
		foreach($meta as $k => $v){
			?>
			<div class="<?= __CLASS__;?>">
				<select class="widefat" name="<?= __CLASS__;?>[<?= $k;?>][type]" id="<?= __CLASS__;?>-<?= $k;?>-type">
					<?php
					foreach(self::get_types() as $type_id => $type_name){
						the_option_list($type_id,self::get_types($type_id),$v['type']);
					}
					?>
				</select>
				<input 
					type="url" 
					name="<?= __CLASS__;?>[<?= $k;?>][url]" 
					id="<?= __CLASS__;?>-<?= $k;?>-url" 
					class="widefat" 
					placeholder="<?= ___('Download page URL (include http://)');?>" 
					title="<?= ___('Download page URL (include http://)');?>" 
					value="<?= isset($v['url']) && !empty($v['url']) ? esc_url($v['url']) : null;?>" 
				>
				<input 
					type="text" 
					name="<?= __CLASS__;?>[<?= $k;?>][download-pwd]" 
					id="<?= __CLASS__;?>-<?= $k;?>-download-pwd" 
					class="widefat" 
					placeholder="<?= ___('Download password (optional)');?>" 
					title="<?= ___('Download password (optional)');?>" 
					value="<?= isset($v['download-pwd']) ? $v['download-pwd'] : null;?>" 
				>
				<input 
					type="text" 
					name="<?= __CLASS__;?>[<?= $k;?>][extract-pwd]" 
					id="<?= __CLASS__;?>-<?= $k;?>-extract-pwd" 
					class="widefat" 
					placeholder="<?= ___('Extract password (optional)');?>" 
					title="<?= ___('Extract password (optional)');?>" 
					value="<?= isset($v['extract-pwd']) ? $v['extract-pwd'] : null;?>" 
				>
			</div>			
			<?php
		}
		//var_dump($meta);die;
		//wp_nonce_field(__CLASS__,__CLASS__ . '-nonce');
	}

	public static function page_create(){
		if(!theme_cache::current_user_can('manage_options')) 
			return false;
		
		$page_slugs = array(
			self::$page_slug => array(
				'post_content' 	=> '[post-' . self::$page_slug . ']',
				'post_name'		=> self::$page_slug,
				'post_title'	=> ___('Storage download'),
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
			theme_cache::get_page_by_path($k) || wp_insert_post(array_merge($defaults,$v));
		}
	}
	public static function get_url(){
		static $cache = null;
		if($cache === null)
			$cache =  theme_cache::get_permalink(theme_cache::get_page_by_path(self::$page_slug)->ID);

		return $cache;
	}
	public static function get_download_page_url($post_id = null){
		if($post_id === null){
			global $post;
			$post_id = $post->ID;
		}
		
		static $caches;
		if(isset($caches[$post_id]))
			return $caches[$post_id];
			
		$code_obj = array(
			'post-id' => (int)$post_id
		);
		$caches[$post_id] = esc_url(add_query_arg(array(
			'code' => base64_encode(authcode(serialize($code_obj),'encode'))
			),self::get_url()));
		return $caches[$post_id];
	}
	public static function get_decode_post(){
		static $cache = null;
		if($cache !== null)
			return $cache;
		$code = isset($_GET['code']) && is_string($_GET['code']) ? base64_decode($_GET['code']) : null;
		if(!$code){
			$cache = false;
			return $cache;
		}
			
		$decode = authcode($code,'decode');
		
		if(!$decode){
			$cache = false;
			return $cache;
		}
			
		$decode = unserialize($decode);
		
		if(!isset($decode['post-id'])){
			$cache = false;
			return $cache;
		}

		$cache = theme_cache::get_post($decode['post-id']);
		return $cache;
	}
	public static function download_info($post_id){
		//global $post;
		//$post = self::get_decode_post();
		$meta = self::get_post_meta($post_id);
		//var_dump($meta);die;
		//ob_start();
		?>
<div class="post-download">
	<?php foreach($meta as $k => $v){ ?>
		<fieldset class="post-download-module">
			<legend><span class="label label-success"><?= self::get_types($v['type']);?></span></legend>
			<div class="fieldset-content">
				<?php if(isset($v['download-pwd']) && !empty($v['download-pwd'])){ ?>
					<div class="form-group">
						<div class="input-group input-group-lg">
							<label for="<?= __CLASS__;?>-<?= $k;?>-download-pwd" class="input-group-addon" >
								<i class="fa fa-key"></i> <?= ___('Download password');?>
							</label>
							<input type="text" id="<?= __CLASS__;?>-<?= $k;?>-download-pwd" class="form-control pwd" value="<?= esc_html($v['download-pwd']);?>" size="5" onclick="this.select();" >
						</div>
					</div>
				<?php } ?>
				
				<?php if(isset($v['extract-pwd']) && !empty($v['extract-pwd'])){ ?>
					<div class="form-group">
						<div class="input-group input-group-lg">
							<label for="<?= __CLASS__;?>-<?= $k;?>-extract-pwd" class="input-group-addon" >
								<i class="fa fa-unlock"></i> <?= ___('Extract password');?>
							</label>
							<input type="text" id="<?= __CLASS__;?>-<?= $k;?>-extract-pwd" class="form-control pwd" value="<?= esc_html($v['extract-pwd']);?>" size="5" onclick="this.select();" >
						</div>
					</div>
				<?php } ?>

				<?php if(isset($v['url']) && !empty($v['url'])){ ?>
					<div class="form-group">
						<div class="btn-group btn-group-lg btn-block">
							<a 
								href="<?= $v['url'];?>" 
								class="btn btn-success col-xs-9 col-sm-10" 
								rel="nofollow"
							>
									<i class="fa fa-cloud-download"></i> 
									<?= ___('Download now');?>
								</a>
							<a 
								href="<?= $v['url'];?>" 
								class="btn btn-success col-xs-3 col-sm-2" 
								target="_blank" 
								rel="nofollow"
								title="<?= ___('Open in new window');?>" 
							>
								<i class="fa fa-external-link"></i>
							</a>
						</div>
					</div>
				<?php } ?>
			</div><!-- /.fieldset-content -->
		</fieldset>
	<?php } ?>
</div><!-- /.post-download -->
		<?php
		//wp_reset_postdata();
		//$content = ob_get_contents();
		//ob_end_clean();
		//return $content;
	}
	public static function display_frontend(){
		global $post;
		$meta = self::get_post_meta($post->ID);
		if(!$meta)
			return;

		$download_url = self::get_download_page_url($post->ID);

		?>
		<div class="post-storage">
			<div class="btn-group btn-group-lg btn-block">
				<a href="<?= $download_url;?>" class="download-link btn btn-success col-xs-9 col-sm-11" rel="nofollow" >
					<i class="fa fa-cloud-download"></i>
					<?= ___('Download now');?>
					
				</a>
				<a href="<?= $download_url;?>" class="download-link btn btn-success col-xs-3 col-sm-1" rel="nofollow" target="_blank" title="<?= ___('Open in new window');?>" >
					<i class="fa fa-external-link fa-fw"></i>
				</a>
			</div>
			
		</div>
		<?php
	}
	public static function is_page(){
		static $cache = null;
		if($cache === null)
			$cache = theme_cache::is_page(self::$page_slug);

		return $cache;
	}
	public static function frontend_css(){
		if(!self::is_page()) 
			return false;

		wp_enqueue_style(
			__CLASS__,
			theme_features::get_theme_includes_css(__DIR__),
			'frontend',
			theme_file_timestamp::get_timestamp()
		);

	}
}
?>