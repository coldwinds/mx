<?php
/**
 * ad
 */
if(class_exists('theme_adbox') && !empty(theme_adbox::display_frontend('above-footer'))){
	?>
	<div class="container ad-container ad-above-footer"><?= theme_adbox::display_frontend('above-footer');?></div>
	<?php
}
?>
<footer id="footer">
	<div class="container">
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