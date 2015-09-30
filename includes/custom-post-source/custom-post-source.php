<?php
/**
 * @version 1.0.1
 */
add_filter('theme_includes',function($fns){
	$fns[] = 'theme_custom_post_source::init';
	return $fns;
});
class theme_custom_post_source{
	public static $post_meta_key = array(
		'key' => '_theme_custom_post_source'
	);
	public static function init(){
		
		add_action('page_settings',__CLASS__ . '::display_backend');
		add_filter('theme_options_save',__CLASS__ . '::options_save');
		add_filter('theme_options_default',__CLASS__ . '::options_default');

		if(!self::is_enabled())
			return;
			
		add_action('add_meta_boxes', __CLASS__ . '::meta_box_add');
		add_action('save_post_post', __CLASS__ . '::meta_box_save');
	}
	public static function is_enabled(){
		return self::get_options('enabled') == 1;
	}
	public static function options_default(array $opts = []){
		$opts[__CLASS__] = [
			'enabled' => 1,
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
			$opts[__CLASS__] = $_POST[__CLASS__];
		}
		return $opts;
	}
	public static function get_types($key = null){
		$types = array(
			'original' => array(
				'text' => ___('Original')
			),
			'reprint' => array(
				'text' => ___('Reprint'),
			)
		);
		if($key)
			return isset($types[$key]) ? $types[$key] : null;
		return $types;
	}
	public static function get_post_meta($post_id = null){
		if(!$post_id){
			global $post;
			$post_id = $post->ID;
		}
		static $caches = [];
		
		if(!isset($caches[$post_id]))
			$caches[$post_id] = array_filter((array)get_post_meta($post_id,self::$post_meta_key['key'],true));
			
		return $caches[$post_id];
	}
	public static function meta_box_add(){
		$screens = array( 'post' );
		foreach ( $screens as $screen ) {
			add_meta_box(
				__CLASS__,
				___('Post source'),
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

		$new_meta = $_POST[__CLASS__];
		$source = isset($new_meta['source']) ? array_filter((array)$new_meta['source']) : null;

		$old_meta = self::get_post_meta($post_id);

		
		if($new_meta == $old_meta)
			return;
			
		if(!$source || !self::get_types($source))
			return;

		if(isset($new_meta['reprint']['url']))
			$new_meta['reprint']['url'] = esc_url($new_meta['reprint']['url']);
			
		update_post_meta($post_id,self::$post_meta_key['key'],$new_meta);
		
	}
	public static function meta_box_display($post){
		$meta = self::get_post_meta($post->ID);
		//wp_nonce_field(__CLASS__,__CLASS__ . '-nonce');
		?>
		<div class="<?= __CLASS__;?>">
			<select class="widefat" name="<?= __CLASS__;?>[source]" id="<?= __CLASS__;?>-source">
				<?php
				foreach(self::get_types() as $type_id => $type_name){
					the_option_list($type_id,self::get_types($type_id)['text'],$meta['source']);
				}
				?>
			</select>
			<input 
				type="url" 
				name="<?= __CLASS__;?>[reprint][url]" 
				id="<?= __CLASS__;?>-reprint-url" 
				class="widefat code" 
				title="<?= ___('Source URL, for reprint work');?>"
				placeholder="<?= ___('Source URL, for reprint work');?>"
				value="<?= isset($meta['reprint']['url']) ? $meta['reprint']['url'] : null;?>" 
			>
			<input 
				type="text" 
				name="<?= __CLASS__;?>[reprint][author]" 
				id="<?= __CLASS__;?>-reprint-author" 
				class="widefat code" 
				title="<?= ___('Author, for reprint work');?>"
				placeholder="<?= ___('Author, for reprint work');?>"
				value="<?= isset($meta['reprint']['author']) ? esc_attr($meta['reprint']['author']) : null;?>" 
			>
		</div>			
		<?php
	}
	public static function display_backend(){
		?>
		<fieldset>
			<legend><?= ___('Post source settings');?></legend>
			<p class="description"><?= ___('The post source will display below the main content.');?></p>
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
				</tbody>
			</table>
		</fieldset>
		<?php
	}
	public static function display_frontend(){
		global $post;
		$meta = self::get_post_meta($post->ID);
		if(!isset($meta['source']))
			return false;
			
		?>
		<ul class="post-source hidden-xs">
			<?php
			switch($meta['source']){
				case 'original':
					?>
					<li><?php 
					echo sprintf(
						___('This article is %1$s member %2$s\'s original work.'),
						
						'<a href="' . theme_cache::home_url() . '">' .theme_cache::get_bloginfo('name') . '</a>',
						
						'<a href="' . theme_cache::get_author_posts_url($post->post_author) . '">' . theme_cache::get_the_author_meta('display_name',$post->post_author) . '</a>'
						
						);
						
					?></li>
					<li><?php 
					$permalink = theme_cache::get_permalink($post->ID);
					echo sprintf(
						___('Welcome to reprint but must indicate the source url %1$s.'),
						'<a href="' . $permalink . '" target="_blank" rel="nofollow">' . $permalink . '</a>'
					);?></li>
					<?php
					break;
				case 'reprint':
					$reprint_author = isset($meta['reprint']['author']) && !empty($meta['reprint']['author']) ? trim($meta['reprint']['author']) : ___('Unkown');
					
					$reprint_url = isset($meta['reprint']['url']) && !empty($meta['reprint']['url']) ? '<a href="' . esc_url($meta['reprint']['url']) . '" target="_blank" rel="nofollow">' . esc_url($meta['reprint']['url']) . '</a>' : ___('Unkown');
					?>
					<li><?php 
					echo sprintf(
						___('This article is %1$s member %2$s\'s reprint work.'),
						
						'<a href="' . theme_cache::home_url() . '">' .theme_cache::get_bloginfo('name') . '</a>',
						
						'<a href="' . theme_cache::get_author_posts_url($post->post_author) . '">' . theme_cache::get_the_author_meta('display_name',$post->post_author) . '</a>'
						
						);
						
					?></li>
					<li>
						<?= sprintf(
						___('Source: %s, author: %s.'),
						$reprint_url,
						$reprint_author);
						?>
					</li>
					<?php
					break;
			}
			?>
		</ul>
		<?php
	}
}
?>