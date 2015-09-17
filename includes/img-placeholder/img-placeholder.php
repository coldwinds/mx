<?php
/**
 * img placeholder
 *
 * @version 1.0.0
 */
add_filter('theme_includes',function($fns){
	$fns[] = 'theme_img_placeholder::init';
	return $fns;
},5);
class theme_img_placeholder{
	public static function init(){
		add_filter('theme_options_save', __CLASS__ . '::options_save');
		add_filter('theme_options_default', __CLASS__ . '::options_default');

		add_action('base_settings', __CLASS__ . '::display_backend');

		theme_functions::$thumbnail_placeholder = self::get_options('thumbnail');
		theme_functions::$avatar_placeholder = self::get_options('avatar');
	}
	public static function options_save(array $opts = []){
		if(isset($_POST[__CLASS__]))
			$opts[__CLASS__] = $_POST[__CLASS__];
		return $opts;
	}
	public static function options_default(array $opts = []){
		$opts[__CLASS__] = [
			'thumbnail' => 'http://ww4.sinaimg.cn/large/686ee05djw1ew56itdn2nj208w05k0sp.jpg',
			'avatar' => 'http://ww2.sinaimg.cn/large/686ee05djw1ew5767l9voj2074074dfn.jpg',
		];
		return $opts;
	}
	public static function get_options($key = null){
		static $caches = null;
		if($caches === null)
			$caches = (array)theme_options::get_options(__CLASS__);
			
		if($key)
			return isset($caches[$key]) ? esc_url($caches[$key]) : false;
		return $caches;
	}
	public static function display_backend(){
		?>
		<fieldset>
			<legend><?= ___('Default image placeholder settings');?></legend>
			<p class="description"><?= ___('You can custom the image placeholder here.');?></p>
			<table class="form-table">
				<tr>
					<th>
						<label for="<?= __CLASS__;?>-thumbnail-url"><?= ___('Thumbnail image URL');?></label>
						<br>
						<a href="<?= self::get_options('thumbnail');?>" target="_blank">
							<img src="<?= self::get_options('thumbnail');?>" alt="thumbnail" width="160" height="100">
						</a>
					</th>
					<td>
						<input class="widefat" type="url" name="<?= __CLASS__;?>[thumbnail]" id="<?= __CLASS__;?>-thumbnail-url" value="<?= self::get_options('thumbnail');?>" placeholder="<?= ___('Your custom thumbnail image URL address');?>">
						<p class="description"><?= ___('Default');?> <input type="url" value="<?= self::options_default()[__CLASS__]['thumbnail'];?>" readonly class="text-select"></p>
					</td>
				</tr>
					<tr>
					<th>
						<label for="<?= __CLASS__;?>-avatar-url"><?= ___('Avatar image URL');?></label>
						<br>
						<a href="<?= self::get_options('avatar');?>" target="_blank">
							<img src="<?= self::get_options('avatar');?>" alt="avatar" width="100" height="100">
						</a>
					</th>
					<td>
						<input class="widefat" type="url" name="<?= __CLASS__;?>[avatar]" id="<?= __CLASS__;?>-avatar-url" value="<?= self::get_options('avatar');?>" placeholder="<?= ___('Your custom avatar image URL address');?>">
						<p class="description"><?= ___('Default');?> <input type="url" value="<?= self::options_default()[__CLASS__]['avatar'];?>" readonly class="text-select"></p>
				</td>
				</tr>
			</table>
		</fieldset>
		<?php
	}
}

