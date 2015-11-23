<?php get_header();?>
<?php 
/**
 * slidebox
 */
theme_custom_slidebox::display_frontend();
?>
<div class="g">

	<?php 
	/**
	 * recommended box
	 */
	if(!wp_is_mobile() && $recomm = theme_functions::frontend_recomm_posts()){ ?>
		<div class="recomm-container hidden-sm">
			<?= $recomm;?>
		</div>
		<?php 
		unset($recomm);
	} 
	?>

	<div class="row">
		<div id="main" class="g-desktop-3-4">
			
			<?php 
			/**
			 * homebox 
			 */
			theme_functions::the_homebox();
			?>
			
		</div><!-- /#main -->
		<?php get_sidebar() ;?>
	</div>
	
</div>
<?php get_footer();?>
