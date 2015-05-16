<?php

/**
 * tags
 */
$tags_args = [
	'orderby' => 'count',
	'order' => 'desc',
	'hide_empty' => 0,
	'number' => theme_custom_collection::get_options('tags-number') ? theme_custom_collection::get_options('tags-number') : 16,
];
if(class_exists('theme_custom_collection')){
	$tags_ids = theme_custom_collection::get_options('tags');
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
}else{
	$tags = get_tags($tags_args);
}
?>
<div class="panel panel-default">
	<div class="panel-heading">
		<h3 class="panel-title">
			<i class="fa fa-<?= theme_custom_collection::get_tabs('collection')['icon'];?>"></i> 
			<?= theme_custom_collection::get_tabs('collection')['text'];?>
		</h3>
	</div>
	<div class="panel-body">
		<?= theme_custom_collection::get_des();?>
		<form action="javascript:;" id="fm-clt" class="form-horizontal">
			<div class="form-group">
				<label for="clt-title" class="col-sm-2 control-label">
					<?= ___('Collection title');?>
				</label>
				<div class="col-sm-10">
					<input 
						type="text" 
						name="clt[post-title]"
						class="form-control" 
						id="clt-title" 
						placeholder="<?= ___('Collection title (require)');?>" 
						title="<?= ___('Collection title must to write');?>" 
						required 
						autofocus
					>
				</div>
			</div>
			<!-- upload image -->
			<div class="form-group">
				<label for="clt-file" class="col-sm-2 control-label">
					<i class="fa fa-image"></i>
					<?= ___('Upload a cover');?>
				</label>
				<div class="col-sm-10">
					<div id="clt-file-area">
						<div class="" id="clt-file-btn">
							<i class="fa fa-image"></i>
							<?= ___('Select or Drag images');?>
							<input type="file" id="clt-file" >
						</div>
					</div>
					<!-- upload progress -->
					<div id="clt-file-progress">
						<div id="clt-file-progress-tx"></div>
						<div id="clt-file-progress-bar"></div>
					</div>
					<!-- file completion -->
					<div id="clt-file-completion"></div>
					<!-- files -->
					<div id="clt-files" class="row"></div>
					
				</div>
			</div>
			<!-- collection posts -->
			<div class="form-group">
				<label for="clt-post-id-0" class="col-sm-2 control-label">
					<i class="fa fa-th-list"></i>
					<?= ___('Collection posts');?>
				</label>
				<div class="col-sm-10">
					<?php 
					for($i = 0, $len = theme_custom_collection::get_posts_number('min'); $i < $len; ++$i){
						echo theme_custom_collection::get_tpl($i);
					} 
					?>
				</div>
			</div>

			<!-- add more posts -->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="clt-add-post">
					<i class="fa fa-plus"></i>
					<?= ___('Add more posts');?>
				</label>
				<div class="col-sm-10">
					<a href="javascript:;" id="clt-add-post" class="btn btn-success btn-block"><i class="fa fa-plus"></i> <?= ___('Add new post');?></a>
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
						foreach($tags as $tag){
							?>
							<label class="clt-tag" for="clt-tags-<?= $tag->term_id;?>">
								<input 
									type="checkbox" 
									id="clt-tags-<?= $tag->term_id;?>" 
									name="clt[tags][]" 
									value="<?= esc_attr($tag->name);?>"
									hidden
								>
								<span class="label label-default">
									<?= esc_html($tag->name);?>
								</span>
							</label>
							
							<?php
						}
						?>
					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-2 control-label">
					<i class="fa fa-tag"></i>
					<?= ___('Custom tags');?>
				</div>
				<div class="col-sm-10">
					<div id="custom-tag">
						<div class="row">
							<?php for($i = 0;$i<=3;++$i){ ?>
								<div class="col-xs-6 col-sm-3">
									<div class="input-group input-group-sm">
										<label class="input-group-addon" for="clt-tag-<?= $i;?>"><i class="fa fa-tag fa-fw"></i></label>
										<input id="clt-tag-<?= $i;?>" class="custom-tag-list form-control" type="text" name="clt[tags][]" placeholder="<?= sprintf(___('tag %d'),$i+1);?>" size="10">
									</div>
								</div>
							<?php } ?>
						</div>
					</div>
				</div>
			</div>


			<!-- submit -->
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<div class="page-tip submit-tip"></div>
					
					<button type="submit" class="btn btn-lg btn-success btn-block submit" data-loading-text="<?= ___('Sending, please wait...');?>">
						<i class="fa fa-check"></i>
						<?= ___('Submit');?>
					</button>

					<input type="hidden" name="type" value="post">
				</div>
			</div>
		</form>
	</div>
</div>