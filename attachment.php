<?php get_header();?>
<div class="container grid-container">
		<?php
		if(have_posts()){
			while(have_posts()){
				the_post();
				?>
				<div id="main" class="main">
					<article id="post-<?= $post->ID;?>" <?php post_class(['singular-post panel']);?>>
						<div class="heading">
							<h2 class="entry-title title">
								<?= sprintf(___('The attachment of %s'),'<a href="' . theme_cache::get_permalink($post->post_parent) . '">' . theme_cache::get_the_title($post->post_parent) . '</a>');?>
							</h2>
						</div>

						<div class="content">
							<div class="post-content content-reset">
								<?php the_content();?>
							</div>
						</div>
						<footer class="post-footer post-metas footer clearfix">
							<?php
							/** 
							 * post-share
							 */
							if(class_exists('theme_post_share') && theme_post_share::is_enabled()){
								?>
								<div class="post-meta post-share">
									<?= theme_post_share::display();?>
								</div>
								<?php
							} /** end post-share */
							?>
							
						</footer>
					</article>
				</div>
			<?php 
			}
		}else{ 
			?>
			
		<?php } ?>
	</div>
</div>
<?php get_footer();?>