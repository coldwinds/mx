<?php
?>
<div class="panel panel-default">
	<div class="panel-body">
<div class="media">
	<div class="media-left">
		<img class="media-object" src="<?= theme_custom_point::get_point_img_url();?>" alt="">
	</div>
	<div class="media-body">
		<h4 class="media-heading">
			<strong class="total-point"><?= number_format(theme_custom_point::get_point(theme_cache::get_current_user_id()));?></strong>
		</h4>
	</div>
</div>
</div><!-- /.panel-body -->
<?php
$history_list = theme_custom_point::get_history_list(array(
	'posts_per_page' => 20,
));
if(empty($history_list)){
	?>
	<div class="panel-body">
		<div class="page-tip"><?= status_tip('info',___('Your have not any history yet.')); ?></div>
	</div><!-- /.panel-body -->
	<?php
}else{
	echo $history_list;
}
?>
	</div>
</div>