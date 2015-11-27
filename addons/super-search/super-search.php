<?php
class theme_super_search{
	public static function init(){
		add_filter('theme_options_default', __CLASS__ . '::options_default');
		
		if(theme_cache::is_ajax()){
			add_filter('theme_options_save', __CLASS__ . '::options_save');
			add_action('wp_ajax_' . __CLASS__, __CLASS__ . '::process');
			add_action('wp_ajax_nopriv_' . __CLASS__, __CLASS__ . '::process');
		}else{
			if(theme_options::is_options_page()){
				add_action('page_settings', __CLASS__ . '::display_backend');
			}else{
				
			}
			
		}
		if(!theme_cache::is_admin()){
			add_filter('frontend_js_config', __CLASS__ . '::frontend_js_config');
			//add_action( 'pre_get_posts', __CLASS__ . '::remove_default_query' );
		}
	}
	public static function remove_default_query($query){
		//$query = false;
	}
	public static function process(){
		theme_features::check_nonce();
		theme_features::check_referer();
		$output = [];

		/** keyword */
		$kw = isset($_POST['s']) && is_string($_POST['s']) ? trim($_POST['s']) : false;
		
		/** cats */
		$cats = isset($_POST['search']['cats']) && is_array($_POST['search']['cats']) ? array_filter($_POST['search']['cats']) : false;
		
		/** tags */
		$tags = isset($_POST['search']['tags']) && is_array($_POST['search']['tags']) ? array_filter($_POST['search']['tags']) : false;
		
		if(!$kw){
			die(theme_features::json_format([
				'status' => 'error',
				'code' => 'invalid_keyword',
				'msg' => ___('Invalid keyword, please try again.'),
			]));
		}
		/** search */
		$query_args = [
			's' => $kw,
		];
		if($cats)
			$query_args['category__in'] = $cats;
		if($tags)
			$query_args['tag_slug__in'] = $tags;
			
		$cache_id = md5(json_encode($query_args));
		
		/** get cache */
		$content = theme_cache::get($cache_id, __CLASS__);
		if($content){
			die(theme_features::json_format([
				'status' => 'success',
				'content' => $content,
				'msg' => ___('Search completed.'),
			]));
		}else if($content === null){
			die(theme_features::json_format([
				'status' => 'error',
				'msg' => ___('Sorry, can not match any content.'),
			]));
		}
		
		/** no cache, search db */
		$query = new WP_Query($query_args);
		if($query->have_posts()){
			global $post;
			ob_start();
			foreach($query->posts as $post){
				setup_postdata($post);
				theme_functions::archive_card_sm([
					'classes' => 'g-tablet-1-2 g-tablet-1-4',
					'lazyload' => false,
				]);
			}
			$content = ob_get_contents();
			ob_end_clean();
			theme_cache::set($cache_id, $content, __CLASS__, 3600);
			die(theme_features::json_format([
				'status' => 'success',
				'content' => $content,
				'msg' => ___('Search completed.'),
			]));
		}else{
			theme_cache::set($cache_id, null, __CLASS__, 3600);
			die(theme_features::json_format([
				'status' => 'error',
				'code' => 'not_match_found',
				'msg' => ___('Sorry, can not match any content.'),
			]));
		}
		die(theme_features::json_format($output));
	}
	public static function get_tags(){
		$cache = array_filter((array)wp_cache_get('tags',__CLASS__));
		
		if(!is_null_array($cache))
			return $cache;
			
		$tags = array_filter((array)self::get_options('tags'));
		if(is_null_array($tags))
			return false;
			
		foreach($tags as $k => $tag){
			$cache[] = [
				'name' => $tag['name'],
				'tags' => explode("\n",str_replace("\r",'',$tag['text'])),
			];
		}
		wp_cache_set('tags',$cache,__CLASS__);
		return $cache;
	}
	public static function display_backend(){
		$tags = array_filter((array)self::get_options('tags'));
		?>
		<fieldset>
			<legend><i class="fa fa-fw fa-search"></i> <?= ___('Super search settings');?></legend>
			<p class="description"><?= ___('The super search is a powerful search feature.');?></p>
			<table class="form-table">
				<tbody>
				<tr>
					<th><?= ___('Which category can be searched?');?></th>
					<td>
						<div class="categorydiv"><div class="tabs-panel"><ul class="categorychecklist form-no-clear">
							<?php theme_features::cat_checkbox_list(
								__CLASS__ . '-cat-ids', 
								__CLASS__ . '[cat-ids][]',
								self::get_cat_ids()
							);?>
						</ul></div></div>
						<p class="description"><?= ___('Select the parent category in generally.');?></p>
					</td>
				</tr>
				</tbody>
			</table>
			<h3><?= ___('Filter tag');?></h3>
			<div id="<?= __CLASS__;?>-container" data-tpl="<?= esc_attr(html_minify(self::get_backend_tag_tpl()));?>">
				<?php 
				if($tags){
					foreach($tags as $k => $v){
						echo self::get_backend_tag_tpl($k,$tags);
					}
				}else{
					echo self::get_backend_tag_tpl(0);
				}
				?>
			</div>
			<table class="form-table" id="<?= __CLASS__;?>-control">
				<tbody>
					<tr>
						<th><?= ___('Control');?></th>
						<td>
							<a href="javascript:;" id="<?= __CLASS__;?>-add" class="add button-primary"><i class="fa fa-plus"></i> <?= ___('Add new item');?></a>
						</td>
					</tr>
				</tbody>
			</table>				
		</fieldset>
		<?php
	}
	
	public static function get_backend_tag_tpl($placeholder = '%placeholder%', array $meta = []){
		$name = isset($meta[$placeholder]['name']) ? $meta[$placeholder]['name'] : null;
		$tags = isset($meta[$placeholder]['text']) ? $meta[$placeholder]['text'] : null;
		ob_start();
		?>
		<table class="form-table tpl-item" id="<?= __CLASS__;?>-item-<?= $placeholder;?>" >
			<tbody>
				<tr>
					<th><label for="<?= __CLASS__;?>-tags-<?= $placeholder;?>-name"><?= ___('Filter name');?> - <?= $placeholder;?></label></th>
					<td>
						<input type="text" id="<?= __CLASS__;?>-tags-<?= $placeholder;?>-name" name="<?= __CLASS__;?>[tags][<?= $placeholder;?>][name]" class="widefat" placeholder="<?= ___('The filter name, e.g. area');?>" value="<?= $name;?>">
					</td>
				</tr>
				<tr>
					<th><label for="<?= __CLASS__;?>-tags-<?= $placeholder;?>-text"><?= ___('Tags');?></label></th>
					<td>
						<textarea name="<?= __CLASS__;?>[tags][<?= $placeholder;?>][text]" id="<?= __CLASS__;?>-tags-<?= $placeholder;?>-text" rows="3" class="widefat" placeholder="<?= ___('The tag name, one per line');?>"><?= $tags;?></textarea>
					</td>
				</tr>
				<tr>
					<th><?= ___('Control');?></th>
					<td>
						<a href="javascript:;" data-target="<?= __CLASS__;?>-item-<?= $placeholder;?>" class="del"><i class="fa fa-exclamation-circle"></i> <?= ___('Delete this item');?></a>
					</td>
				</tr>
			</tbody>
		</table>
		<?php
		$content = ob_get_contents();
		ob_end_clean();
		return $content;
	}
	public static function options_default(array $opts = []){
		$opts[__CLASS__] = [
			'enabled' => 1,
			'enabled-display-name' => -1,
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
			wp_cache_delete('tags',__CLASS__);
		}
		return $opts;
	}
	public static function get_cat_ids(){
		return array_filter((array)self::get_options('cat-ids'));
	}
	private static function get_has_parent_cat_ids(){
		$has_parent_cats = [];
		foreach(self::get_cats() as $k => $cat){
			if($cat->parent > 0 && !isset($has_parent_cats[$cat->parent]))
				$has_parent_cats[$cat->parent] = $cat->parent;
		}
		return $has_parent_cats;
	}
	public static function get_cats(){
		static $cache = null;
		if($cache === null){
			$cats = theme_cache::get_categories([
				'include' => self::get_cat_ids(),
				'hide_empty' => false,
				'orderby' => 'count',
				'order' => 'desc',
			]);
			if($cats){
				foreach($cats as $cat){
					$cache[$cat->term_id] = (object)[
						'term_id' => $cat->term_id,
						'parent' => $cat->parent,
						'name' => $cat->name,
					];
				}
			}else{
				$cache = false;
			}
		}
		return $cache;
	}
	public static function output_cats(){
		if(!self::get_cat_ids())
			return false;

		self::output_cat(0);

		foreach(self::get_has_parent_cat_ids() as $pid){
			self::output_cat($pid);
		}
	}
	public static function output_cat($parent_cat_id){
		$cats = [];
		foreach(self::get_cats() as $cat){
			if($cat->parent == $parent_cat_id){
				$cats[] = '<label class="condition-label"><input id="search-input-' .  $cat->term_id . '" type="radio" name="search[cats][' . $parent_cat_id . ']" value="' . $cat->term_id . '" hidden><span class="tx">' . $cat->name . '</span></label>';
			}
		}
		if(!$cats)
			return false;
			
		?>
		<div 
			id="search-cat-<?= $parent_cat_id;?>" 
			class="search-cat <?= $parent_cat_id == 0 ? null : 'search-cat-child';?>" 
			data-parent="<?= $parent_cat_id;?>" 
		>
			<label class="condition-label"><input id="search-all-<?= $parent_cat_id;?>" type="radio" name="search[cats][<?= $parent_cat_id;?>]" checked hidden><span class="tx"><?= ___('All');?></span></label><?php
			echo implode('',$cats);
			?>
		</div>
		<?php
	}
	public static function frontend_js_config(array $config){
		if(!theme_cache::is_search())
			return $config;
		$config[__CLASS__] = [
			'process_url' => theme_features::get_process_url([
				'action' => __CLASS__,
			]),
			'lang' => [
				'M01' => ___('All'),
				'M02' => ___('Searching, please wait...'),
			],
			'cats' => self::get_cats(),
		];
		return $config;
	}
}

add_filter('theme_addons',function($fns){
	$fns[] = 'theme_super_search::init';
	return $fns;
});