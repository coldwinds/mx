<?php
/**
 * Post form
 *
 * @return 
 * @version 1.0.0
 */
function post_form($post_id = null){

	$edit = false;
	$post_title = null;
	$post_content = null;
	$post_excerpt = null;

	
	/**
	 * edit
	 */
	if(is_numeric($post_id)){
		/**
		 * check post exists
		 */
		global $post;
		$post = theme_cache::get_post($post_id);
		if(!$post || 
			!theme_custom_contribution::in_edit_post_status($post->post_status) ||
			$post->post_type !== 'post'
		){
			?>
			<div class="page-tip"><?= status_tip('error',___('Sorry, the post does not exist.'));?></div>
			<?php
			wp_reset_postdata();
			return false;
		}
		/**
		 * check post category in collection category
		 */
		if(class_exists('theme_custom_collection') && !empty(theme_custom_collection::get_cat_ids())){
			foreach(get_the_category($post_id) as $v){
				if(in_array($v->term_id,theme_custom_collection::get_cat_ids())){
					?>
					<div class="page-tip"><?= status_tip('error',___('Sorry, collection edits feature is not supported currently.'));?></div>
					<?php
					wp_reset_postdata();
					return false;
				}
				break;
			}
		}
		/**
		 * check author
		 */
		if($post->post_author != theme_cache::get_current_user_id()){
			?>
			<div class="page-tip"><?= status_tip('error',___('Sorry, you are not the post author, can not edit it.'));?></div>
			<?php
			return false;
			wp_reset_postdata();
		}
		setup_postdata($post);
		
		/**
		 * check edit lock status
		 */
		$lock_user_id = theme_custom_contribution::wp_check_post_lock($post_id);
		if($lock_user_id){
			?>
			<div class="page-tip"><?= status_tip('error',___('Sorry, you can not edit this post now, because editor is editing. Please wait a minute...'));?></div>
			<?php
			return false;
		}
	
		$edit = true;
		$post_title = $post->post_title;
		$post_content = $post->post_content;
		$post_excerpt = stripslashes($post->post_excerpt);
		
	}

	?>
	
	<?= theme_custom_contribution::get_des();?>
	
	<form action="javascript:;" id="fm-ctb" class="form-horizontal">
		<div class="form-group">
			<label for="ctb-title" class="col-sm-2 control-label">
				<?= ___('Post title');?>
			</label>
			<div class="col-sm-10">
				<input 
					type="text" 
					name="ctb[post-title]"
					class="form-control" 
					id="ctb-title" 
					placeholder="<?= ___('Post title (require)');?>" 
					title="<?= ___('Post title must to write');?>" 
					value="<?= esc_attr($post_title);?>" 
					required 
					autofocus
				>
			</div>
		</div>
		<!-- post excerpt -->
		<div class="form-group">
			<label for="ctb-excerpt" class="col-sm-2 control-label">
				<?= ___('Post excerpt');?>
			</label>
			<div class="col-sm-10">
				<textarea name="ctb[post-excerpt]" id="ctb-excerpt" rows="3" class="form-control" placeholder="<?= ___('Your can write the post excerpt here, it will show every page nagination header.');?>"><?= $post_excerpt;?></textarea>
			</div>
		</div>
		<!-- post content -->
		<div class="form-group">
			<label for="ctb-content" class="col-sm-2 control-label">
				<?= ___('Post content');?>
			</label>
			<div class="col-sm-10">
				<?php 
				wp_editor(
					$post_content,
					'ctb-content', 
					[
						'textarea_name' => 'ctb[post-content]',
						'drag_drop_upload' => true,
						'teeny' => true,
						'media_buttons' => false,
					]
				);
				?>
			</div>
		</div>
		<!-- split with next-page -->
		<div class="form-group">
			<div class="col-sm-2 control-label">
				<i class="fa fa-scissors"></i>
				<?= ___('Image next-page tag');?>
			</div>
			<div class="col-sm-10">
				<select id="ctb-split-number" class="form-control">
					<option value="0"><?= ___('Do not use next-page tag');?></option>
					<?php for($i=1;$i<=10;++$i){ ?>
						<option value="<?= $i;?>"><?= sprintf(___('%d image(s) / page'),$i);?></option>
					<?php } ?>
				</select>
				<p class="description"><?= ___('How many images to split with next-page tag?');?> <i class="fa fa-info-circle"></i> <?= ___('Please confirm before uploading image.');?></p>
			</div>
		</div>
		
		<!-- upload image -->
		<div class="form-group">
			<div class="col-sm-2 control-label">
				<i class="fa fa-image"></i>
				<?= ___('Upload preview image');?>
			</div>
			<div class="col-sm-10">
				<div id="ctb-file-area">
					<div class="" id="ctb-file-btn">
						<i class="fa fa-image"></i>
						<?= ___('Select or Drag images');?>
						<input type="file" id="ctb-file" multiple >
					</div>
				</div>
				<!-- upload progress -->
				<div id="ctb-file-progress">
					<div id="ctb-file-progress-tx"></div>
					<div id="ctb-file-progress-bar"></div>
				</div>
				<!-- file completion -->
				<div id="ctb-file-completion"></div>
				<!-- files -->
				<div id="ctb-files" class="row"></div>
				
			</div>
		</div>






		
<!-- storage -->
<?php
if(class_exists('theme_custom_storage') && theme_custom_storage::is_enabled()){
	$storage_meta = $post_id ? theme_custom_storage::get_post_meta($post_id) : null;

	/**
	 * tpl
	 */
	$storage_tpl = function($placeholder) use ($storage_meta){
		
		$storage_type = isset($storage_meta[$placeholder]['type'][0]) ? $storage_meta[$placeholder]['type'][0] : null;
		
		$storage_url = isset($storage_meta[$placeholder]['url']) ? $storage_meta[$placeholder]['url'] : null;
		
		$storage_download_pwd = isset($storage_meta[$placeholder]['download-pwd']) ? $storage_meta[$placeholder]['download-pwd'] : null;
		
		$storage_extract_pwd = isset($storage_meta[$placeholder]['extract-pwd']) ? $storage_meta[$placeholder]['extract-pwd'] : null;

		ob_start();
		?>
		<div class="theme_custom_storage-item">
			<?= var_dump(theme_custom_storage::get_types());?>
		<select name="theme_custom_storage[<?= $placeholder;?>][type]" id="theme_custom_storage-<?= $placeholder;?>-type" class="form-control theme_custom_storage-control">
			<?php foreach(theme_custom_storage::get_types() as $item){ ?>
				<?php the_option_list(array_keys($item)[0],array_values($item)[0],$storage_type);?>
			<?php } ?>
		</select>
		<div class="row">
			<div class="col-sm-6">
				<input 
					type="url" 
					class="form-control" 
					name="theme_custom_storage[<?= $placeholder;?>][url]" 
					id="theme_custom_storage-<?= $placeholder;?>-url" 
					title="<?= ___('Download page URL (include http://)');?>" 
					placeholder="<?= ___('Download page URL (include http://)');?>" 
					value="<?= $storage_url;?>" 
				>
			</div>
			<div class="col-sm-3">
				<div class="input-group">
					<label class="input-group-addon" for="theme_custom_storage-download-pwd"><i class="fa fa-key fa-fw"></i></label>
					<input 
						type="text" 
						class="form-control" 
						name="theme_custom_storage[<?= $placeholder;?>][download-pwd]" 
						id="theme_custom_storage-<?= $placeholder;?>-download-pwd" 
						title="<?= ___('Download password (optional)');?>" 
						placeholder="<?= ___('Download password (optional)');?>" 
						value="<?= $storage_download_pwd;?>" 
					>
				</div>
			</div>
			<div class="col-sm-3">
				<div class="input-group">
					<label class="input-group-addon" for="theme_custom_storage-url"><i class="fa fa-unlock fa-fw"></i></label>
					<input 
						type="text" 
						class="form-control" 
						name="theme_custom_storage[<?= $placeholder;?>][extract-pwd]" 
						id="theme_custom_storage-<?= $placeholder;?>-extract-pwd" 
						title="<?= ___('Extract password (optional)');?>" 
						placeholder="<?= ___('Extract password (optional)');?>" 
						value="<?= $storage_extract_pwd;?>" 
					>
				</div>
			</div>
		</div><!-- /.row -->
		</div><!-- /.item -->
		<?php
		$html = html_minify(ob_get_contents());
		ob_end_clean();
		return $html;
	};
	/**
	 * end $storage_tpl()
	 */
	
	?>
	<div class="form-group theme_custom_storage-group" data-tpl="<?= esc_attr($storage_tpl(0));?>">
		<div class="col-sm-2 control-label">
			<i class="fa fa-cloud-download"></i>
			<?= ___('Storage link');?>
		</div>
		<div class="col-sm-10">
			<?php
			/** is edit */
			if($post_id && $storage_meta){
				foreach($storage_meta as $k => $v){
					echo $storage_tpl($k);
				}
			/** new post */
			}else{
				echo $storage_tpl(0);
			}
			?>
		</div>
	</div>
<?php 
/**
 * end theme_custom_storage
 */
} 
?>
		






		
		<!-- cats -->
		<div class="form-group">
			<div class="col-sm-2 control-label">
				<i class="fa fa-folder-open"></i>
				<?= ___('Category');?>
			</div>
			<div class="col-sm-10">
				<?php
				if($edit){
					$selected_cat_id = 0;
					$cats = get_the_category($post->ID);
					
					if(isset($cats[0]->term_id))
						$selected_cat_id = $cats[0]->term_id;
						
					foreach($cats as $cat){
						if($cat->parent != 0)
							$selected_cat_id = $cat->term_id;
					}
					wp_dropdown_categories([
						'id' => 'ctb-cat',
						'name' => 'ctb[cat]',
						'class' => 'form-control',
						'selected' => $selected_cat_id,
						'show_option_none' => ___('Select category'),
						'hierarchical' => true,
						'hide_empty' => false,
						'include' => (array)theme_custom_contribution::get_cat_ids(),
					]); 
				}else{
					theme_custom_contribution::output_cats();
				}
				?>
			</div>
		</div>





		
		<!-- tags -->
		<div class="form-group">
			<div class="col-sm-2 control-label">
				<i class="fa fa-tags"></i> 
				<?= ___('Pop. tags');?>
			</div>
			<div class="col-sm-10">
				<div class="checkbox-select">
					<?php
					$tags_args = [
						'orderby' => 'count',
						'order' => 'desc',
						'hide_empty' => 0,
						'number' => theme_custom_contribution::get_options('tags-number') ? theme_custom_contribution::get_options('tags-number') : 16,
					];
					$tags_ids = theme_custom_contribution::get_options('tags');
					if(empty($tag_ids)){
						$tags = get_tags($tags_args);
					}else{
						$tags = get_tags([
							'include' => implode($tags_ids),
							'orderby' => 'count',
							'order' => 'desc',
							'hide_empty' => 0,
						]);
					}
					/**
					 * edit
					 */
					if($edit){
						$exist_tags = [];
						$post_tags = get_the_tags($post->ID);
						if($post_tags){
							foreach($post_tags as $v){
								$v->selected = true;
								array_unshift($tags,$v);
							}
						}
					}
					foreach($tags as $tag){
						if($edit){
							if(isset($exist_tags[$tag->term_id])){
								continue;
							}else{
								$exist_tags[$tag->term_id] = 1;
							}
						}
						$tag_name = esc_html($tag->name);
						?>
						<label class="ctb-tag" for="ctb-tags-<?= $tag->term_id;?>">
							<input 
								class="ctb-preset-tag" 
								type="checkbox" 
								id="ctb-tags-<?= $tag->term_id;?>" 
								name="ctb[tags][]" 
								value="<?= $tag_name;?>"
								hidden 
								<?= isset($tag->selected) ? 'checked' : null;?>
							>
							<span class="label label-default">
								<?= $tag_name;?>
							</span>
						</label>
						
					<?php } ?>
				</div>
			</div>
		</div>
		
		<!-- custom tags -->
		<div class="form-group">
			<div class="col-sm-2 control-label">
				<i class="fa fa-tag"></i> 
				<?= ___('Custom tags');?>
			</div>
			<div class="col-sm-10">
				<div class="row">
					<?php for($i = 0;$i<=3;++$i){ ?>
						<div class="col-xs-6 col-sm-3">
							<input id="ctb-custom-tag-<?= $i;?>" class="ctb-custom-tag form-control" type="text" name="ctb[tags][]" placeholder="<?= sprintf(___('Custom tag %d'),$i+1);?>" >
						</div>
					<?php } ?>
				</div>
			</div>
		</div>


		<!-- source -->
		<?php 
		if(class_exists('theme_custom_post_source') && theme_custom_post_source::is_enabled()){
			if($edit){
				$post_source_meta = theme_custom_post_source::get_post_meta($post->ID);
			}else{
				$post_source_meta = null;
			}
			
			?>
			<div class="form-group">
				<div class="col-sm-2 control-label">
					<i class="fa fa-truck"></i> 
					<?= ___('Source');?>
				</div>
				<div class="col-sm-10">
					<label class="radio-inline" for="theme_custom_post_source-source-original">
						<input 
							type="radio" 
							name="theme_custom_post_source[source]" 
							id="theme_custom_post_source-source-original" 
							value="original" 
							class="theme_custom_post_source-source-radio" 
							<?= !isset($post_source_meta['source']) || $post_source_meta['source'] === 'original' ? 'checked' : null;?> 
							target="theme_custom_post_source-input-original" 
						>
						<?= ___('Original');?>
					</label>
					<label class="radio-inline" for="theme_custom_post_source-source-reprint">
						<input 
							type="radio" 
							name="theme_custom_post_source[source]" 
							id="theme_custom_post_source-source-reprint" 
							value="reprint" 
							class="theme_custom_post_source-source-radio" 
							<?= isset($post_source_meta['source']) && $post_source_meta['source'] === 'reprint' ? 'checked' : null;?> 
							target="theme_custom_post_source-input-reprint" 
						>
						<?= ___('Reprint');?>
					</label>
					<div class="row theme_custom_post_source-inputs" id="theme_custom_post_source-input-reprint" >
						<div class="col-sm-7">
							<div class="input-group">
								<label class="input-group-addon" for="theme_custom_post_source-reprint-url">
									<i class="fa fa-link"></i>
								</label>
								<input 
									type="url" 
									class="form-control" 
									name="theme_custom_post_source[reprint][url]" 
									id="theme_custom_post_source-reprint-url" 
									placeholder="<?= ___('The source of work URL, includes http://');?>" 
									title="<?= ___('The source of work URL, includes http://');?>"
									value="<?= isset($post_source_meta['reprint']['url']) ? $post_source_meta['reprint']['url'] : null;?>"
								>
							</div>
						</div>
						<div class="col-sm-5">
							<div class="input-group">
								<label class="input-group-addon" for="theme_custom_post_source-reprint-author">
									<i class="fa fa-user"></i>
								</label>
								<input 
									type="text" 
									class="form-control" 
									name="theme_custom_post_source[reprint][author]" 
									id="theme_custom_post_source-reprint-author" 
									placeholder="<?= ___('Author');?>" 
									title="<?= ___('Author');?>"
									value="<?= isset($post_source_meta['reprint']['author']) ? esc_attr($post_source_meta['reprint']['author']) : null;?>"
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		<?php } /** end theme_custom_post_source */ ?>

		
		<!-- submit -->
		<div class="form-group">
			<div class="col-sm-2">
				<a href="javascript:;" id="ctb-quick-save" class="btn btn-block btn-default btn-lg" title="<?= ___('The post data will be saved automatically per minute in your current borwser, you can also save it now manually.');?>">
					<i class="fa fa-save"></i> <?= ___('Quick save');?>
				</a>
			</div>
			<div class="col-sm-10">
				
				<button type="submit" class="btn btn-lg btn-success btn-block submit" data-loading-text="<?= ___('Sending, please wait...');?>">
					<i class="fa fa-check"></i> 
					<?= $edit ? ___('Update') : ___('Submit');?>
				</button>
				<input type="hidden" id="ctb-post-id" name="post-id" value="<?= $edit ? $post->ID : 0;?>">
				<input type="hidden" name="type" value="post">
			</div>
		</div>
	</form>
	<?php
	wp_reset_postdata();
}

?>
<div class="panel panel-default">
	<div class="panel-body">
		<?php
		if(isset($_GET['post']) && is_numeric($_GET['post'])){
			post_form($_GET['post']);
		}else{
			post_form();
		}
		?>
	</div>
</div>