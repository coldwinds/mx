<?php get_header();?>
<div class="container grid-container">
	<div class="row">
		<?php
		if(have_posts()){
			while(have_posts()){
				the_post();
				?>
				<div id="main" class="main col-md-8 col-sm-12">
					<?php theme_functions::singular_content();?>
					<div class="np-posts">
						<?php theme_functions::the_post_pagination();?>
					</div>
					<?php
					/**
					 * ad
					 */
					if(class_exists('theme_adbox') && !empty(theme_adbox::display_frontend('below-adjacent-post'))){
						?>
						<div class="ad-container ad-below-adjacent-post"><?= theme_adbox::display_frontend('below-adjacent-post');?></div>
						<?php
					}
					?>
					<?php theme_functions::the_related_posts_plus();?>
					<?php comments_template();?>
				</div>
				<?php include __DIR__ . '/sidebar-post.php';?>
			<?php 
			}
		}else{ 
			?>
			
		<?php } ?>
	</div>
</div>
<?php get_footer();?>