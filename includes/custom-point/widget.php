<?php
/**
 * User rank widget
 * 
 * @version 1.0.1
 */
add_action('widgets_init','widget_point_rank::register_widget');
class widget_point_rank extends WP_Widget{
	function __construct(){
		$this->alt_option_name = __CLASS__;
		parent::__construct(
			__CLASS__,
			___('User point rank <small>(custom)</small>'),
			array(
				'classname' => __CLASS__,
				'description'=> ___('Display user point rank list'),
			)
		);
	}
	function widget($args = [], $instance = []){
		$instance = array_merge([
			'title'=> ___('User point rank'),
			'total_number' => 100,
			'rand_number' => 12
		],$instance);
		
		if((int)$instance['total_number'] === 0 || (int)$instance['rand_number'] === 0)
			return false;

		
		echo $args['before_widget'];
		echo $args['before_title'];
		?>
		<i class="fa fa-bar-chart"></i> <?= $instance['title'];?>
		<?php 
		echo $args['after_title'];

		$users = theme_cache::get('widget',__CLASS__);
		if(!$users){
			$user_query = new WP_User_Query([
				'meta_key' => theme_custom_point::$user_meta_key['point'],
				'orderby' => 'meta_value_num',
				'order' => 'desc',
				'number' => (int)$instance['total_number'],
			]);
			$users = $user_query->results;
		}
		if(!isset($user_query->total_users) || $user_query->total_users < 2){
			?>
			<div class="panel-body">
				<div class="page-tip"><?= status_tip('info',___('No matched user yet.'));?></div>
			</div>
			<?php
		}else{
			theme_cache::set('widget',$users,__CLASS__,3600);
			/**
			 * rand
			 */
			if($instance['rand_number'] > $user_query->total_users){
				$instance['rand_number'] = $user_query->total_users;
			}
			$rand_users = array_rand($users,$instance['rand_number']);
			
			?>
			<div class="panel-body">
				<div class="user-lists row">
					<?php
					$user = null;
					foreach($rand_users as $k){ 
						theme_functions::the_user_list([
							'user' => $users[$k],
							'extra' => 'point',
							'extra_title' => sprintf(
								__x('%s %s','eg. 20 points'),
								'%',
								theme_custom_point::get_point_name()
							),
						]);
					}
					?>
				</div>
			</div>
			<?php
		}
		unset($users,$rand_users);
		echo $args['after_widget'];
	}
	function form($instance = []){
		$instance = array_merge([
			'title'=> ___('User point rank'),
			'total_number' => 100,
			'rand_number' => 12
		],$instance);
		?>
		<p>
			<label for="<?= self::get_field_id('title');?>"><?= ___('Title (optional)');?></label>
			<input 
				id="<?= self::get_field_id('title');?>"
				class="widefat"
				name="<?= self::get_field_name('title');?>" 
				type="text" 
				value="<?= esc_attr($instance['title']);?>" 
				placeholder="<?= ___('Title (optional)');?>"
			/>
		</p>
		<p>
			<label for="<?= self::get_field_id('total_number');?>"><?= ___('Total number');?></label>
			<input 
				id="<?= self::get_field_id('total_number');?>"
				class="widefat"
				name="<?= self::get_field_name('total_number');?>" 
				type="number" 
				value="<?= (int)$instance['total_number'];?>" 
				placeholder="<?= ___('Total number');?>"
			/>
		</p>
		<p>
			<label for="<?= self::get_field_id('rand_number');?>"><?= ___('Random number');?></label>
			<input 
				id="<?= self::get_field_id('rand_number');?>"
				class="widefat"
				name="<?= self::get_field_name('rand_number');?>" 
				type="number" 
				value="<?= (int)$instance['rand_number'];?>" 
				placeholder="<?= ___('Random number');?>"
			/>
		</p>
		
		<?php
	}
	function update($new_instance,$old_instance){
		if(isset($old_instance['total_number']) && 
			isset($old_instance['rand_number']) && 
			(int)$old_instance['total_number'] < (int)$old_instance['rand_number']){
			$old_instance['rand_number'] = (int)$old_instance['total_number'];
		}
		return array_merge($old_instance,$new_instance);
	}
	public static function register_widget(){
		register_widget(__CLASS__);
	}
}