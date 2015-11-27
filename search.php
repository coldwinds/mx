<?php get_header();?>
<div class="g">
	<div id="main">
		<form id="fm-search-page" class="panel">
			<div class="content">
				<div class="form-group">
					<label for="search-page-s"><i class="fa fa-search fa-fw"></i></label>
					<input 
						type="search" 
						id="search-page-s" 
						name="s" 
						class="form-control" 
						value="<?= esc_attr(get_search_query());?>" 
						placeholder="<?= ___('Type keywords to search');?>" 
						title="<?= ___('Type keywords to search');?>" 
						required
						autofocus 
					>
				</div>
					<div class="ss-group">
						<span class="ss-group-title"><?= ___('Category');?></span>
						<div id="ss-cat-container" class="ss-condition-container"></div>
					</div>
					<?php
					$ss_tags = theme_super_search::get_tags();
					if($ss_tags){
						?>
						<div id="ss-tag-container">
							<?php foreach($ss_tags as $k => $ss_tag){ ?>
								<div class="ss-group">
									<span class="ss-group-title"><?= $ss_tag['name'];?></span>
									<div class="ss-condition-container">
										<label class="condition-label">
											<input 
												type="radio" 
												class="ss-tag-input" 
												name="search[tags][<?= $k;?>]" 
												value="" 
												hidden 
												checked 
											>
											<span class="tx"><?= ___('All');?></span>
										</label>
										<?php foreach($ss_tag['tags'] as $ss_tag_item){ ?>
											<label class="condition-label">
												<input 
													type="radio" 
													class="ss-tag-input" 
													name="search[tags][<?= $k;?>]" 
													value="<?= $ss_tag_item;?>" 
													hidden 
												>
												<span class="tx"><?= $ss_tag_item;?></span>
											</label>
										<?php }/** end tag label */ ?>
									</div>
								</div>
							<?php }/** end tag group */ ?>
						</div>
					<?php }/** end have tags */ ?>
				</fieldset>
			</div>
		</form>
		<div id="ss-result-container" class="row">
			<?php if(have_posts()){ ?>
				<?php
				$loop_i = 0;
				foreach($wp_query->posts as $post){
					setup_postdata($post);
					theme_functions::archive_card_sm([
						'classes' => 'g-desktop-1-4 g-tablet-1-2',
						'lazyload' => $loop_i <= 8 ? false : true,
					]);
					++$loop_i;
				}
				?>
			<?php }else{ ?>
				<div class="g-desktop-1-1">
					<?= status_tip('info',___('No content yet.'));?>
				</div>
			<?php } ?>
		</div>
	</div><!-- /#main -->
</div><!-- /.container -->
<?php get_footer();?>