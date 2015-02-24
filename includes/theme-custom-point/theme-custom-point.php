<?php
/**
 * @version 1.0.0
 */
theme_custom_point::init();
class theme_custom_point{
	public static $iden = 'theme_custom_point';
	public static $user_meta_key = array(
		'history' => 'theme_point_history',
		'point' => 'theme_point_count',
		'last-signin' => 'theme_last_signin',
	);
	public static function init(){
		add_action('page_settings',get_class() . '::display_backend');
		
		add_action('wp_insert_comment',get_class() . '::action_add_history_comment_publish',10,2);
		
		add_action('wp_insert_comment',get_class() . '::action_add_history_post_reply',10,2);
		
		add_action('publish_post',get_class() . '::action_add_history_post_publish',10,2);
		
		add_action('user_register',get_class() . '::action_add_history_signup');

		/** sign-in daily */
		add_filter('cache-request',get_class() . '::filter_cache_request');
		
		add_filter('theme_options_default',get_class() . '::options_default');
		add_filter('theme_options_save',get_class() . '::options_save');
	}
	public static function display_backend(){
		$opt = theme_options::get_options(self::$iden);
		$points = $opt['points'];
		$point_name = isset($opt['point-name']) ? $opt['point-name'] : ___('Cat-paw');
		?>
		<fieldset>
			<legend><?php echo ___('User point settings');?></legend>
			<p class="description"><?php echo ___('About user point settings.');?></p>
			<table class="form-table">
				<tbody>
					<tr>
						<th><label for="<?php echo self::$iden;?>-point-name"><?php echo ___('Point name');?></label></th>
						<td>
							<input type="text" class="widefat" id="<?php echo self::$iden;?>-point-name" value="<?php echo esc_attr($point_name);?>">
						</td>
					</tr>
					<?php foreach(self::get_point_types() as $k => $v){ ?>
						<tr>
							<th>
								<label for="<?php echo self::$iden;?>-<?php echo $k;?>"><?php echo $v[text];?></label>
							</th>
							<td>
								<input type="number" name="<?php echo self::$iden;?>[points][<?php echo $k;?>]" class="short-text" id="<?php echo self::$iden;?>-<?php echo $k;?>" value="<?php echo isset($points[$k]) ? $points[$k] : 0;?>">
							</td>
						</tr>
					<?php } ?>
					<tr>
						<th><label for="<?php echo self::$iden;?>-point-des"><?php echo ___('Description on point history page');?></label></th>
						<td>
							<textarea name="<?php echo self::$iden;?>[point-des]" id="<?php echo self::$iden;?>-des" rows="3" class="widefat code"><?php echo isset($opt['point-des']) ? $opt['point-des'] : null;?></textarea>
						</td>
					</tr>
					<tr>
						<th><label for="<?php echo self::$iden;?>-point-img-url"><?php echo ___('Description on point history page');?></label></th>
						<td>
							<input type="url" name="<?php echo self::$iden;?>[point-img-url]" id="<?php echo self::$iden;?>-img-url" class="widefat code" value="<?php echo isset($opt['point-img-url']) ? $opt['point-img-url'] : null;?>">
						</td>
					</tr>
				</tbody>
			</table>
		</fieldset>
		<?php
	}
	public static function get_point_types($key = null){
		$types = array(
			'signup' => array(
				'text' => ___('When sign-up')
			),
			'signin-daily' => array(
				'text' => ___('When sign-in daily')
			),
			'comment-publish' => array(
				'text' => ___('When publish comment')
			),
			'comment-delete' => array(
				'text' => ___('When delete comment')
			),
			'post-publish' => array(
				'text' => ___('When publish post')
			),
			'post-reply' => array(
				'text' => ___('When reply post')
			),
			'post-per-hundred-view'	=> array(
				'text' => ___('When post per hundred view ')
			),
			'aff-signup' => array(
				'text' => ___('When aff sign-up')
			),
		);
		if(empty($key)) return $types;
		
		return isset($types[$key]) ? $types[$key] : null;
	}
	public static function options_default($opts){
		$opts[self::$iden] = array(
			'point-name' 			=> ___('Cat-paw'), /** 名称 */
			'points' => array(
				'signup'			=> 20, /** 初始 */
				'signin-daily'		=> 2, /** 日登 */
				'comment-publish'	=> 1, /** 发表新评论 */
				'comment-delete'  	=> -3, /** 删除评论 */
				'post-publish' 		=> 3, /** 发表新文章 */
				'post-reply' 		=> 1, /** 文章被回复 */
				'post-per-hundred-view' => 5, /** 文章每百查看 */
				'aff-signup'		=> 5, /** 推广注册 */			
			),
			'point-des' => ___('Point can exchange many things.'),
			'point-img-url' => 'http://ww1.sinaimg.cn/large/686ee05djw1epfzp00krfg201101e0qn.gif',
		);
		return $opts;
	}
	public static function options_save($opts){
		if(!isset($_POST[self::$iden])) return $opts;
		$opts[self::$iden] = $_POST[self::$iden];
		return $opts;
	}
	public static function get_point_name(){
		return theme_options::get_options(self::$iden)['point-name'];
	}
	public static function get_point_des(){
		return theme_options::get_options(self::$iden)['point-des'];
	}
	public static function get_point_value($type){
		$opt = theme_options::get_options(self::$iden)['points'];
		return isset($opt[$type]) ? $opt[$type] : false;
	}
	/**
	 * Get user point
	 *
	 * @param int User id
	 * @version 1.0.0
	 * @return int
	 * @author Km.Van inn-studio.com <kmvan.com@gmail.com>
	 */
	public static function get_point($user_id = null){
		if(!$user_id) $user_id = get_current_user_id();
		return (int)get_user_meta($user_id,self::$user_meta_key['point'],true);
	}
	/**
	 * Get user history
	 *
	 * @param int User id
	 * @version 1.0.0
	 * @return array
	 * @author Km.Van inn-studio.com <kmvan.com@gmail.com>
	 */
	public static function get_history($user_id = null){
		if(!$user_id) $user_id = get_current_user_id();
		$metas = get_user_meta($user_id,self::$user_meta_key['history']);
		arsort($metas);
		return $metas;
	}
	public static function filter_cache_request($output){
		/**
		 * signin daily
		 */
		if(!is_user_logged_in()) return $output;
		if(self::action_add_history_signin_daily() === true){
			$point = (int)theme_options::get_options(self::$iden)['points']['signin-daily'];
			$output['signin-daily'] = array(
				'point' => $point,
				'msg' => sprintf(___('Sign-in daily points: +%s'),$point),
			);
		}else{
			$output['signin-daily'] = false;
		}
		return $output;
	}
	/**
	 * HOOK - Add sign-up history to user meta
	 *
	 * @version 1.0.0
	 * @author Km.Van inn-studio.com <kmvan.com@gmail.com>
	 */
	public static function action_add_history_signup($user_id){
		$meta = array(
			'type'=> 'signup'
		);
		add_user_meta($user_id,self::$user_meta_key['history'],$meta);
		/**
		 * update point
		 */
		update_user_meta($user_id,self::$user_meta_key['point'],(int)theme_options::get_options(self::$iden)['points']['signup']);
	}
	/**
	 * HOOK - Signin daily for user meta
	 *
	 * @version 1.0.0
	 * @author Km.Van inn-studio.com <kmvan.com@gmail.com>
	 */
	public static function action_add_history_signin_daily(){
		$user_id = get_current_user_id();
		$current_timestamp = current_time('timestamp');
		/**
		 * get the last sign-in time
		 */
		/** from cache */
		$caches = (array)wp_cache_get(self::$user_meta_key['last-sign']);
		/** found in cache */
		if(isset($caches[$user_id])){
			$last_signin_timestamp = $caches[$user_id];
		/** no found, find last signin from user meta */
		}else{
			$last_signin_timestamp = get_user_meta($user_id,self::$user_meta_key['last-signin'],true);
			/** if empty last signin from user meta, set it */
			if(empty($last_signin_timestamp)){
				update_user_meta($user_id,self::$user_meta_key['last-signin'],$current_timestamp);
				$last_signin_timestamp = $current_timestamp;
			}
			$caches[$user_id] = $current_timestamp;
			wp_cache_set(self::$user_meta_key['last-signin'],$caches,null,172800);/** 3600*24*2 = 2days */
		}
		/**
		 * Check last logged is yesterday or not.
		 */
		$today_Ymd = date('Ymd',$current_timestamp);
		$last_signin_Ymd = date('Ymd',$last_signin_timestamp);
		/** IS logged today, return */
		if($today_Ymd == $last_signin_Ymd) return false;
		/**
		 * add history
		 */
		$meta = array(
			'type' => 'signin-daily',
			'timestamp' => $current_timestamp
		);
		add_user_meta($user_id,self::$user_meta_key['history'],$meta);
		/**
		 * update point
		 */
		$old_point = self::get_point($user_id);
		update_user_meta($user_id,self::$user_meta_key['point'],$old_point + (int)theme_options::get_options(self::$iden)['points']['signin-daily']);

		return true;
	}
	/**
	 * HOOK - Add comment publish history to user meta
	 *
	 * @param int User id
	 * @param object Comment
	 * @version 1.0.0
	 * @author Km.Van inn-studio.com <kmvan.com@gmail.com>
	 */
	public static function action_add_history_comment_publish($comment_id,$comment){
		if(!is_user_logged_in()) return false;
		$comment_author_id = $comment->user_id;
		$post_author_id = get_post($comment->comment_post_ID)->post_author;
		if($comment_author_id == $post_author_id) return false;
		$meta = array(
			'type' => 'comment-publish',
			'comment-id' => $comment_id,
		);
		add_user_meta($comment_author_id,self::$user_meta_key['history'],$meta);
		/**
		 * update point
		 */
		$old_point = self::get_point($comment_author_id);
		update_user_meta($comment_author_id,self::$user_meta_key['point'],$old_point + (int)theme_options::get_options(self::$iden)['points']['comment-publish']);
	}
	
	/**
	 * HOOK - Add post publish history to user meta
	 *
	 * @param int Post id
	 * @param object Post
	 * @version 1.0.0
	 * @author Km.Van inn-studio.com <kmvan.com@gmail.com>
	 */
	public static function action_add_history_post_publish($post_id,$post){
		$post_author_id = $post->post_author;
		$meta = array(
			'type' => 'post-publish',
			'post-id' => $post_id,
		);
		add_user_meta($post_author_id,self::$user_meta_key['history'],$meta);
		/**
		 * update point
		 */
		$old_point = self::get_point($post_author_id);
		update_user_meta($post_author_id,self::$user_meta_key['point'],$old_point + (int)theme_options::get_options(self::$iden)['points']['post-publish']);
	}
	
	/**
	 * HOOK - Add post reply history to post author meta
	 *
	 * @param int Comment id
	 * @param object Comment
	 * @version 1.0.0
	 * @author Km.Van inn-studio.com <kmvan.com@gmail.com>
	 */
	public static function action_add_history_post_reply($comment_id,$comment){
		$post_author_id = get_post($comment->comment_post_ID)->post_author;
		/** do not add history for myself post */
		if($post_author_id == $comment->user_id) return false;
		
		$meta = array(
			'type' => 'post-reply',
			'comment-id' => $comment_id,
		);
		add_user_meta($post_author_id,self::$user_meta_key['history'],$meta);
		/**
		 * update point
		 */
		$old_point = self::get_point($post_author_id);
		update_user_meta($post_author_id,self::$user_meta_key['point'],$old_point + (int)theme_options::get_options(self::$iden)['points']['post-reply']);
	}
}
?>