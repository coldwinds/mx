<?php
/**
 * ad
 */
if(class_exists('theme_adbox') && !empty(theme_adbox::display_frontend('above-footer'))){
	?>
	<div class="container"><div class="ad-container ad-above-footer"><?= theme_adbox::display_frontend('above-footer');?></div></div>
	<?php
}
?>
<footer id="footer">
	<div class="container">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h2 class="panel-title"><i class="fa fa-link"></i> <?= ___('Links');?></h2>
			</div>
			<div class="panel-body">
				<?php
				/**
				 * links
				 */
				theme_cache::wp_nav_menu([
					'theme_location'    => 'links-footer',
					'container'         => 'nav',
					'menu_class'        => 'menu',
					'menu_id' 			=> 'links-footer',
					'fallback_cb'       => 'custom_navwalker::fallback',
					'walker'            => new custom_navwalker
				]);
				?>
			</div>
		</div>
		<?php if(!wp_is_mobile()){ ?>
			<div class="widget-area row hiddex-xs">
				<?php if(!theme_cache::dynamic_sidebar('widget-area-footer')){ ?>
					<div class="col-xs-12">
						<div class="panel">
							<div class="panel-body">
								<div class="page-tip">
									<?= status_tip('info', ___('Please set some widgets in footer.'));?>
								</div>
							</div>
						</div>
					</div>
				<?php } ?>
			</div>
		<?php } ?>
		<p class="footer-meta copyright text-center">
			<?= class_exists('theme_user_code') ? theme_user_code::get_frontend_footer_code() : null;?>
		</p>
	</div>
</footer>
<a href="#" class="fa fa-arrow-up fa-2x back-to-top" title="<?= ___('Back to top');?>"></a>
<?php wp_footer();?></body></html>