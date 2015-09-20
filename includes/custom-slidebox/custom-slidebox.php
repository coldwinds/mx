<?php
/*
Feature Name:	theme_custom_slidebox
Feature URI:	http://www.inn-studio.com
Version:		2.0.1
Description:	theme_custom_slidebox
Author:			INN STUDIO
Author URI:		http://www.inn-studio.com
*/
add_filter('theme_includes',function($fns){
	$fns[] = 'theme_custom_slidebox::init';
	return $fns;
});
class theme_custom_slidebox{
	public static $file_exts = ['png','jpg','gif'];
	public static $image_size = [800,500,true];
	public static function init(){
		add_action('after_backend_tab_init', __CLASS__ . '::backend_seajs_use'); 
		add_action('page_settings', __CLASS__ . '::display_backend');
		add_action('wp_ajax_' . __CLASS__, __CLASS__ . '::process');
		add_filter('theme_options_save', __CLASS__ . '::options_save');
		add_action('backend_css', __CLASS__ . '::backend_css'); 

		/**
		 * frontend
		 */
		add_action('frontend_seajs_alias',__CLASS__ . '::frontend_seajs_alias');
		add_action('frontend_seajs_use',__CLASS__ . '::frontend_seajs_use');
		add_action('wp_enqueue_scripts', 	__CLASS__ . '::frontend_css');
	}
	public static function options_save(array $opts = []){
		if(isset($_POST[__CLASS__])){
			/** check hash */
			$old_hash = $_POST[__CLASS__]['hash'];
			unset($_POST[__CLASS__]['hash']);
			$new_hash = md5(json_encode($_POST[__CLASS__]));
			if($old_hash != $new_hash){
				theme_cache::delete(__CLASS__);
			}
			$opts[__CLASS__] = $_POST[__CLASS__];
		}
		return $opts;
	}
	private static function get_cat_checkbox_list($name,$id,$selected_cat_ids = []){
		$cats = get_categories(array(
			'hide_empty' => false,
			'exclude' => '1',
		));
		
		ob_start();
		if($cats){
			foreach($cats as $cat){
				if(in_array($cat->term_id,(array)$selected_cat_ids)){
					$checked = ' checked="checked" ';
					$selected_class = ' button-primary ';
				}else{
					$checked = null;
					$selected_class = null;
				}
			?>
			<label for="<?= $id;?>-<?= $cat->term_id;?>" class="item button <?= $selected_class;?>">
				<input 
					type="checkbox" 
					id="<?= $id;?>-<?= $cat->term_id;?>" 
					name="<?= $name;?>[]" 
					value="<?= $cat->term_id;?>"
					<?= $checked;?>
				/>
				<?= esc_html($cat->name);?>
			</label>
			<?php 
			}
		}else{ ?>
			<p><?= ___('No category, pleass go to add some categories.');?></p>
		<?php }
		$content = ob_get_contents();
		ob_end_clean();
		return $content;
	}
	public static function get_options($key = null){
		$caches = null;
		if($caches === null)
			$caches = (array)theme_options::get_options(__CLASS__);

		if($key)
			return isset($caches[$key]) ? $caches[$key] : null;
		return $caches;
	}
	public static function process(){
		$output = [];
		
		/** 
		 * if not image
		 */
		$filename = isset($_FILES['img']['name']) ? $_FILES['img']['name'] : null;
		$file_ext = $filename ? strtolower(array_slice(explode('.',$filename),-1,1)[0]) : null;
		if(!in_array($file_ext,self::$file_exts)){
			$output['status'] = 'error';
			$output['code'] = 'invaild_file_type';
			$output['msg'] = ___('Invaild file type.');
			die(theme_features::json_format($output));
		}
		/** 
		 * check permission
		 */
		if(!theme_cache::current_user_can('manage_options')){
			$output['status'] = 'error';
			$output['code'] = 'invaild_permission';
			$output['msg'] = ___('You have not permission to upload.');
			die(theme_features::json_format($output));
		}
		/** 
		 * pass
		 */
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/media.php' );
	
		add_image_size(__CLASS__, self::$image_size[0],self::$image_size[1],self::$image_size[2]);
		
		$attach_id = media_handle_upload('img',0);
		if(is_wp_error($attach_id)){
			$output['status'] = 'error';
			$output['code'] = $attach_id->get_error_code();
			$output['msg'] = $attach_id->get_error_message();
			die(theme_features::json_format($output));
		}else{
			$output['status'] = 'success';
			$output['url'] = wp_get_attachment_image_src($attach_id,__CLASS__)[0];
			$output['msg'] = ___('Upload success.');
			die(theme_features::json_format($output));
		}
		die(theme_features::json_format($output));
	}
	private static function get_box_tpl($placeholder){
		$boxes = (array)self::get_options('boxes');
		$title = isset($boxes[$placeholder]['title']) ? $boxes[$placeholder]['title'] : null;
		$subtitle = isset($boxes[$placeholder]['subtitle']) ? $boxes[$placeholder]['subtitle'] : null;
		$link_url = isset($boxes[$placeholder]['link-url']) ? $boxes[$placeholder]['link-url'] : null;
		$img_url = isset($boxes[$placeholder]['img-url']) ? esc_url($boxes[$placeholder]['img-url']) : null;
		$checked_rel_nofollow = isset($boxes[$placeholder]['rel']['nofollow']) ? ' checked ' : null;
		$checked_target_blank = isset($boxes[$placeholder]['target']['blank']) ? ' checked ' : null;
		
		ob_start();
		?>
		<table 
			class="form-table <?= __CLASS__;?>-item" 
			id="<?= __CLASS__;?>-item-<?= $placeholder;?>" 
			data-placeholder="<?= $placeholder;?>" 
		>
		<tbody>
		<tr>
			<th><label for="<?= __CLASS__;?>-title-<?= $placeholder;?>"><?= sprintf(___('Slide-box title - %s'),$placeholder);?></label></th>
			<td><input type="text" id="<?= __CLASS__;?>-title-<?= $placeholder;?>" name="<?= __CLASS__;?>[boxes][<?= $placeholder;?>][title]" class="widefat" placeholder="<?= ___('Title will be display as attribute-alt');?>" value="<?= $title;?>"/></td>
		</tr>
		<tr>
			<th><label for="<?= __CLASS__;?>-subtitle-<?= $placeholder;?>"><?= ___('Subtitles (optional)');?></label></th>
			<td>
				<input type="text" id="<?= __CLASS__;?>-subtitle-<?= $placeholder;?>" name="<?= __CLASS__;?>[boxes][<?= $placeholder;?>][subtitle]" class="widefat" placeholder="<?= ___('Subtitle can be date or any text');?>" value="<?= $subtitle;?>"/>
			</td>
		</tr>
		<tr>
			<th><label for="<?= __CLASS__;?>-cat-<?= $placeholder;?>"><?= ___('Categories (optional)');?></label></th>
			<td>
				<?php
				$selected_cat_ids = isset($boxes[$placeholder]['catids']) ? (array)$boxes[$placeholder]['catids'] : [];
				echo self::get_cat_checkbox_list(__CLASS__ . "[$placeholder][catids]",__CLASS__ . "-catids-$placeholder",$selected_cat_ids);
				?>
			</td>
		</tr>
		<tr>
			<th><label for="<?= __CLASS__;?>-link-url-<?= $placeholder;?>"><?= ___('Link url');?></label></th>
			<td><input type="url" id="<?= __CLASS__;?>-link-url-<?= $placeholder;?>" name="<?= __CLASS__;?>[boxes][<?= $placeholder;?>][link-url]" class="widefat" placeholder="<?= ___('Url address');?>" value="<?= esc_url($link_url);?>"/></td>
		</tr>
		<tr>
			<th>
				<label for="<?= __CLASS__;?>-img-url-<?= $placeholder;?>"><?= ___('Image url');?></label>
				<?php if($img_url){ ?>
					<br>
					<a href="<?= $img_url;?>" target="_blank">
						<img src="<?= $img_url;?>" alt="preview" width="100" height="60">
					</a>
				<?php } ?>
			</th>
			<td>
				<div class="<?= __CLASS__;?>-upload-area">
					<input type="url" id="<?= __CLASS__;?>-img-url-<?= $placeholder;?>" name="<?= __CLASS__;?>[boxes][<?= $placeholder;?>][img-url]" class="<?= __CLASS__;?>-img-url" placeholder="<?= ___('Image address');?>" value="<?= $img_url;?>"/>
					<a href="javascript:;" class="button-primary <?= __CLASS__;?>-upload" id="<?= __CLASS__;?>-upload-<?= $placeholder;?>"><?= ___('Upload image');?><input type="file" id="<?= __CLASS__;?>-file-<?= $placeholder;?>" class="<?= __CLASS__;?>-file"/></a>
				</div>
				<div class="<?= __CLASS__;?>-upload-tip hide"></div>
			</td>
		</tr>
		<tr>
			<th><?= ___('Addon options');?></th>
			<td>
				<label for="<?= __CLASS__;?>-rel-nofollow-<?= $placeholder;?>" class="button">
					<input type="checkbox" name="<?= __CLASS__;?>[<?= $placeholder;?>][rel][nofollow]" id="<?= __CLASS__;?>-rel-nofollow-<?= $placeholder;?>" value="1" <?= $checked_rel_nofollow;?> />
					<?= ___('Nofollow link');?>
				</label>
				<label for="<?= __CLASS__;?>-target-blank-<?= $placeholder;?>" class="button">
					<input type="checkbox" name="<?= __CLASS__;?>[boxes][<?= $placeholder;?>][target][blank]" id="<?= __CLASS__;?>-target-blank-<?= $placeholder;?>" value="1" <?= $checked_target_blank;?> />
					<?= ___('Open in new window');?>
				</label>

				<a href="javascript:;" class="<?= __CLASS__;?>-del delete" id="<?= __CLASS__;?>-del-<?= $placeholder;?>" data-id="<?= $placeholder;?>" data-target="#<?= __CLASS__;?>-item-<?= $placeholder;?>"><?= ___('Delete this item');?></a>
			</td>
		</tr>
		
		</tbody>
		</table>
		<?php
		$content = ob_get_contents();
		ob_end_clean();
		return $content;
	}
	public static function get_types($key = null){
		$types = [
			'candy' => ___('Candy'),
			'scroller' => ___('Scroller'),
		];
		if($key)
			return isset($types[$key]) ? $types[$key] : false;
		return $types;
	}
	public static function options_default(array $opts = []){
		$opts[__CLASS__] = [
			'type' => 'candy'
		];
		return $opts;
	}
	public static function get_type(){
		return self::get_options('type') ? self::get_options('type') : self::options_default()[__CLASS__]['type'];
	}
	public static function display_backend(){
		$boxes = self::get_boxes();
		?>
		<fieldset>
			<legend><?= ___('Slide-box settings');?></legend>
			<p class="description">
				<?= sprintf(___('Slide-box will display on homepage. You can select style type and set images and links for slide-box. Image size is %s&times;%s px. Remember save your settings when all done.'),self::$image_size[0] === 999 ? ___('unlimited') : self::$image_size[0],self::$image_size[1] === 999 ? ___('unlimited') : self::$image_size[1]);?>
			</p>
			<table class="form-table" id="<?= __CLASS__;?>-control">
			<tbody>
			<tr>
				<th>
					<label for="<?= __CLASS__;?>-type"><?= ___('Style type');?></label>
				</th>
				<td>
					<select class="widefat" name="<?= __CLASS__;?>[type]" id="<?= __CLASS__;?>-type">
						<?php foreach(self::get_types() as $k => $v){ ?>
							<option value="<?= $k;?>" <?= self::get_type() === $k ? 'selected' : null;?> >
								<?= $v;?>
							</option>
						<?php } ?>
					</select>
				</td>
			</tr>
			</tbody>
			</table>
			<div class="<?= __CLASS__;?>-container">
				<?php
				if(!empty($boxes)){
					foreach($boxes as $k => $v){
						echo self::get_box_tpl($k);
					}
				}else{
					echo self::get_box_tpl(1);
				}
				?>
			</div>
			<table class="form-table" id="<?= __CLASS__;?>-control">
			<tbody>
			<tr>
			<th><?= ___('Control');?></th>
			<td>
				<a id="<?= __CLASS__;?>-add" href="javascript:;" class="button-primary"><?= ___('Add a new item');?></a>
			</td>
			</tr>
			</tbody>
			</table>
			<input type="hidden" name="<?= __CLASS__;?>[hash]" value="<?= md5(json_encode(self::get_options()));?>">
		</fieldset>
	<?php
	}

	public static function display_frontend(){
		$cache = theme_cache::get(__CLASS__);
		if($cache){
			echo $cache;
			unset($cache);
			return;
		}
		
		ob_start();
		$type = 'display_frontend_' . self::get_type();
		self::$type();
		
		$cache = html_minify(ob_get_contents());
		ob_end_clean();
		theme_cache::set(__CLASS__,$cache);
		echo $cache;
		unset($cache);
	}
	/**
	 * scroller
	 */
	public static function display_frontend_scroller(){
		$boxes = self::get_boxes();
		if(!$boxes)
			return false;

		$small = 2;
		?>
<div class="<?= __CLASS__;?>-container">
	<div class="area-blur">
		<?php 
		$i = 0;
		foreach($boxes as $box){ 
		++$i;
		?>
			<div class="item <?= $i === 1 ? 'active' : null;?>" style="background-image:url(<?= $box['img-url'];?>)"></div>
		<?php } ?>
	</div>
	<div id="<?= __CLASS__;?>">
		<?php 
		$i = 0;
		foreach($boxes as $box){ 
			++$i;
			$rel_nofollow = isset($box['rel']['nofollow']) ? 'rel="nofollow"' : null;
			$target_blank = isset($box['target']['blank']) ? 'target="blank"' : null;
			$title = $box['title'];
			$subtitle = $box['subtitle'];
			$img_url = $box['img-url'];
			$link_url = $box['link-url'];
			
			$mod = $i % ($small + 1);
			$large = $mod === 0 ? 'large' : null;
			$is_bombine_start = $mod === $small - 1;
			$is_bombine_end = $mod === $small;
			if($is_bombine_start){
				?><div class="item"><?php
			}else if($large){
				?><div class="item <?= $large;?>"><?php
			}
			?><a 
					href="<?= $box['link-url'];?>" 
					<?= $rel_nofollow;?> 
					<?= $target_blank;l?> 
					title="<?= $title;?>" 
				>
				<img src="<?= $img_url;?>" alt="<?= $title;?>">
				<h2><?= $title;?></h2>
			</a>
			<?php
			if($is_bombine_end || $large || $i === count($boxes)){
				?></div><?php
			}
		} /** end foreach */
		?>
	</div>
</div>
		<?php
		unset($boxes);
	}
	private static function get_boxes(){
		$boxes = self::get_options('boxes');

		if(!is_array($boxes) || count($boxes) < 1)
			return false;

		$new_boxes = [];
		foreach($boxes as $k => $v){
			if(!isset($v['title']))
				return false;
			$new_boxes[$k] = $v;
			$new_boxes[$k]['title'] = esc_html($new_boxes[$k]['title']);
			$new_boxes[$k]['subtitle'] = esc_html($new_boxes[$k]['subtitle']);
			$new_boxes[$k]['img-url'] = esc_url($new_boxes[$k]['img-url']);
			$new_boxes[$k]['link-url'] = esc_url($new_boxes[$k]['link-url']);
		}
		unset($boxes);
		return $new_boxes;
	}
	/**
	 * candy 
	 */
	public static function display_frontend_candy(){
		$boxes = self::get_boxes();
		if(!$boxes)
			return false;

		krsort($boxes);
		?>
<div class="<?= __CLASS__;?>-container">
<div class="area-overdely"></div>
<div class="area-blur">
	<?php 
	$i = 0;
	foreach($boxes as $box){ 
	++$i;
	?>
		<div class="item <?= $i === 1 ? 'active' : null;?>" style="background-image:url(<?= $box['img-url'];?>)"></div>
	<?php } ?>
</div>
<div id="<?= __CLASS__;?>" class="container hidden-xs">
	<div class="area-main">
		<?php
		$i = 0;
		foreach($boxes as $box){
			++$i;
			$rel_nofollow = isset($box['rel']['nofollow']) ? 'rel="nofollow"' : null;
			$target_blank = isset($box['target']['blank']) ? 'target="blank"' : null;
			$title = $box['title'];
			$subtitle = $box['subtitle'];
			$img_url = $box['img-url'];
			$link_url = $box['link-url'];
			?>
			<div class="item <?= $i === 1 ? 'active' : null;?>">
				<a 
					class="img" 
					href="<?= $link_url;?>" 
					title="<?= $title;?>" 
					<?= $rel_nofollow;?> 
					<?= $target_blank;?> 
				><img src="<?= $img_url;?>" alt="<?= $title;?>" width="<?= self::$image_size[0];?>" height="<?= self::$image_size[1];?>"></a>

				<a 
					class="des" 
					href="<?= $link_url;?>" 
					title="<?= $title;?>" 
					<?= $rel_nofollow;?> 
					<?= $target_blank;?> 
				>
					<span class="title"><?= $title;?></span>
					<?php if($subtitle !== ''){ ?>
						<span class="sub-title"><?= $subtitle;?></span>
					<?php } ?>

					<?php
					/** colorful cat */
					if(isset($box['catids']) && !empty($box['catids']) && class_exists('theme_colorful_cats')){
						?>
						<span class="cats">
							<?php
							foreach($box['catids'] as $cat_id){
								$cat = theme_cache::get_category($cat_id);
								$color = theme_colorful_cats::get_cat_color($cat_id,true);
								?>
								<span style="background-color:rgba(<?= $color['r'];?>,<?= $color['g'];?>,<?= $color['b'];?>,.8);"><?= esc_html($cat->name);?></span>
							<?php } ?>
						</span>
					<?php } ?>
					<span class="more"><?= ___('Detail &raquo;');?></span>
				</a>
			</div>
		<?php } ?>
	</div>
	<div class="area-thumbnail">
		<?php
		$i = 0;
		foreach($boxes as $box){
			++$i;
			$rel_nofollow = isset($box['rel']['nofollow']) ? 'rel="nofollow"' : null;
			$target_blank = isset($box['target']['blank']) ? 'target="blank"' : null;
			$title = $box['title'];
			$img_url = $box['img-url'];
			$link_url = $box['link-url'];
			?>
			<a 
				class="item <?= $i === 1 ? 'active' : null;?>" 
				href="<?= $link_url;?>" 
				title="<?= $title;?>" 
				<?= $rel_nofollow;?> 
				<?= $target_blank;?> 
			>
				<img src="<?= $img_url;?>" alt="placeholder" width="<?= self::$image_size[0];?>" height="<?= self::$image_size[1];?>">
				<h2><?= $title;?></h2>
			</a>
		<?php } ?>
	</div>
</div><!-- /#slidebox -->
</div><!-- /.slidebox-container -->
		<?php
	}
	public static function backend_css(){
		?>
		<link href="<?= theme_features::get_theme_includes_css(__DIR__,'backend',true,true);?>" rel="stylesheet"  media="all"/>
		<?php
	}
	public static function frontend_seajs_alias(array $alias = []){
		if(theme_cache::is_home())
			$alias[__CLASS__] = theme_features::get_theme_includes_js(__DIR__);
		return $alias;
	}
	public static function frontend_seajs_use(){
		if(!theme_cache::is_home())
			return false;
		?>
		seajs.use('<?= __CLASS__;?>',function(m){
			m.config.type = '<?= self::get_type();?>';
			m.init();
		});
		<?php
	}
	public static function frontend_css(){
		if(!theme_cache::is_home())
			return false;
			
		wp_enqueue_style(
			__CLASS__,
			theme_features::get_theme_includes_css(__DIR__, 'frontend-' . self::get_type()),
			'frontend',
			theme_file_timestamp::get_timestamp()
		);
	}
	public static function backend_seajs_use(){
		?>
		seajs.use('<?= theme_features::get_theme_includes_js(__DIR__,'backend.js');?>',function(m){
			m.config.tpl = <?= json_encode(html_minify(self::get_box_tpl('%placeholder%')));?>;
			m.config.process_url = '<?= theme_features::get_process_url(array('action'=>__CLASS__));?>';
			m.config.lang.M00001 = '<?= ___('Loading, please wait...');?>';
			m.config.lang.E00001 = '<?= ___('Server error or network is disconnected.');?>';
			m.init();
		});

		<?php
	}

}

?>
