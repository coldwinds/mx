<!DOCTYPE html><html <?php language_attributes(); ?>><head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<title><?php wp_title(' - ',true,'right');?></title>
	<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><![endif]-->
	<meta name="renderer" content="webkit" />
	<meta name="viewport" content="width=device-width" />
	<meta name="author" content="INN STUDIO" />
	<meta http-equiv="Cache-Control" content="no-transform" />
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
	<?php echo theme_features::get_theme_css('modules/fa-fonts','normal');?>
	<?php echo theme_features::get_theme_css('modules/bootstrap','normal');?>
	<?php echo theme_features::get_theme_css('modules/bootstrap-theme','normal');?>
	<?php echo theme_features::get_theme_css('frontend/style','normal',true);?>
	<link rel="shortcut icon" href="<?php //echo theme_features::get_theme_images_url('frontend/favicon.ico',true);?>" type="image/x-icon" />
	<?php wp_head();?>
</head>
<body <?php body_class(); ?>>
<div class="top-bar-container nav-bar navbar-default hidden-xs">
	<div class="top-bar container">
		<div class="top-bar-menu-container nav navbar-nav navbar-left">
			<?php
			/** 
			 * menu top-bar
			 */
            wp_nav_menu( array(
                'theme_location'    => 'menu-top-bar',
                'container'         => 'nav',
                'container_class'   => 'collapse navbar-collapse',
                'menu_class'        => 'nav navbar-nav',
                'menu_id' 			=> 'menu-top-bar',
                'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
                'walker'            => new wp_bootstrap_navwalker())
            );
			?>
		</div>
		<div class="top-bar-tools navbar-right">
			<?php
			/**
			 * if user logged
			 */
			if(is_user_logged_in()){
				?>
				<div class="btn-group btn-group-xs">
					<!-- ctb -->
					<?php if(class_exists('theme_custom_ctb')){ ?>
						<a href="<?php echo esc_url(theme_custom_ctb::get_url());?>" class="btn btn-primary meta tool-contribution">
							<i class="fa fa-pencil-square-o"></i>
							<?php echo ___('Contribution');?>
						</a>
					<?php } ?>

					
					<!-- notification -->
					<?php if(class_exists('theme_notification')){ ?>
						<a href="<?php echo esc_url(theme_notification::get_url());?>" class="meta tool-notification btn btn-default">
							<i class="fa fa-bell"></i> 
							<?php echo ___('Notification');?>
						</a>
					<?php } ?>

					
					<!-- favor -->
					<?php if(class_exists('theme_custom_favor')){ ?>
						<a href="<?php echo esc_url(theme_custom_favor::get_url());?>" class="meta tool-favor btn btn-default">
							<i class="fa fa-heart"></i>
							<?php echo ___('My favor');?>
						</a>
					<?php } ?>
					
					<!-- pm -->
					<?php if(class_exists('theme_pm')){ ?>
						<a href="<?php echo esc_url(theme_pm::get_url());?>" class="meta tool-favor btn btn-default">
							<i class="fa fa-envelope"></i>
							<?php echo ___('My favor');?>
							<?php if(theme_pm::get_unread_count() != 0){ ?>
								<span class="badge"><?php echo theme_pm::get_unread_count();?></span>
							<?php } ?>
						</a>
					<?php } ?>

					<!-- my settings -->
					<?php
					if(class_exists('theme_custom_user_settings')){
						$setting_url = theme_custom_user_settings::get_page_url();
					}else{
						$setting_url = admin_url('profile.php');
					}
					?>
					<a href="<?php echo esc_url($setting_url);?>" class="btn btn-default meta user-avatar">
						<?php echo get_avatar(get_current_user_id());?>
						<span class="tx"><?php echo wp_get_current_user()->display_name;?></span>
					</a>

					<!-- logout -->
					<a href="<?php echo wp_logout_url(get_current_url());?>" class="meta tool-logout btn btn-default">
						<i class="fa fa-power-off"></i>
					</a>
				</div>
			<?php
			/**
			 * is visitor
			 */
			}else{
				?>
				<div class="btn-group btn-group-xs">
					<a class="sign-in sign-in-meta btn btn-primary" href="<?php echo esc_url(wp_login_url(get_current_url()));?>">
						<i class="fa fa-user"></i>
						<?php echo ___('Login');?>
					</a>
					<?php
					/**
					 * open sign
					 */
					if(method_exists('theme_open_sign','get_login_url')){
						if(theme_open_sign::get_login_url('qq')){
							?>
							<a href="<?php echo esc_url(theme_open_sign::get_login_url('qq'));?>" class="open-sign sign-in-meta qq btn btn-primary" title="<?php echo ___('Login from QQ');?>">
								<i class="fa fa-qq"></i>
							</a>
						<?php
						}
						if(theme_open_sign::get_login_url('sina')){
							?>
							<a href="<?php echo esc_url(theme_open_sign::get_login_url('sina'));?>" class="open-sign sign-in-meta sina btn btn-primary" title="<?php echo ___('Login from Weibo');?>">
								<i class="fa fa-weibo"></i>
							</a>
						<?php 
						}
					}
				?>
				</div>
				<div class="sign-up-container meta btn-group btn-group-xs">
					<a class="sign-up meta btn btn-success" href="<?php echo esc_url(wp_login_url(get_current_url()));?>">
						<i class="fa fa-user-plus"></i>
						<?php echo ___('Register');?>
					</a>
				</div>
			<?php
			}
			?>
		</div>
	</div><!-- /.top-bar -->
</div><!-- /.container -->

<?php
/** 
 * banner
 */
if(get_header_image()){ ?>
	<div class="banner">
		<?php if(display_header_text()){ ?>
		<div class="container">
			<h1 hidden><?php echo esc_html(get_bloginfo('name'));?></h1>
			<h2 hidden><?php echo esc_html(get_bloginfo('description'));?></h2>
		</div>
		<?php } ?>
	</div>
<?php } ?>


<div class="menu-header-container">
	<div class="navbar navbar-inverse">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".menu-header">
	                <span class="sr-only"></span>
	                <span class="icon-bar"></span>
	                <span class="icon-bar"></span>
	                <span class="icon-bar"></span>
	            </button>
	            <a href="<?php echo home_url();?>" class="navbar-brand">
					<?php echo get_bloginfo('name');?>
				</a>
				<ul class="nav navbar-nav navbar-right visible-xs">
					<li>
						<a class="mx-search-btn dropdown-toggle" href="javascript:void(0);" data-toggle="collapse" data-target=".navbar-collapse-form">
							<i class="fa fa-search"></i>
						</a>
					</li>
					<li class="dropdown">
						<a href="javascript:void(0);" class="mx-user-btn dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
							<i class="fa fa-user"></i> 
						</a>
						<ul class="dropdown-menu" role="menu">
							<?php if(is_user_logged_in()){ ?>
								<!-- ctb -->
								<?php if(class_exists('theme_custom_ctb')){ ?>
									<li><a href="<?php echo esc_url(theme_custom_ctb::get_url());?>" class="meta tool-contribution">
										<i class="fa fa-pencil-square-o"></i>
										<?php echo ___('Contribution');?>
									</a></li>
								<?php } ?>

								
								<!-- notification -->
								<?php if(class_exists('theme_notification')){ ?>
									<li><a href="<?php echo esc_url(theme_notification::get_url());?>" class="meta tool-notification">
										<i class="fa fa-bell"></i> 
										<?php echo ___('Notification');?>
									</a></li>
								<?php } ?>

								
								<!-- favor -->
								<?php if(class_exists('theme_custom_favor')){ ?>
									<li><a href="<?php echo esc_url(theme_custom_favor::get_url());?>" class="meta tool-favor">
										<i class="fa fa-heart"></i>
										<?php echo ___('My favor');?>
									</a></li>
								<?php } ?>
								
								<!-- pm -->
								<?php if(class_exists('theme_pm')){ ?>
									<li><a href="<?php echo esc_url(theme_pm::get_url());?>" class="meta tool-favor">
										<i class="fa fa-envelope"></i>
										<?php echo ___('My favor');?>
										<?php if(theme_pm::get_unread_count() != 0){ ?>
											<span class="badge"><?php echo theme_pm::get_unread_count();?></span>
										<?php } ?>
									</a></li>
								<?php } ?>
								
								<li><a href="###" class="meta user-avatar">
									<?php echo get_avatar(get_current_user_id());?>
									<span class="tx"><?php echo wp_get_current_user()->display_name;?></span>
								</a></li>
								
								 <li class="divider"></li>
								 
								<!-- logout -->
								<li><a href="<?php echo wp_logout_url(get_current_url());?>" class="meta tool-logout">
									<i class="fa fa-power-off"></i>
								</a></li>
							<?php }else{ ?>
							
								<li><a class="sign-in sign-in-meta" href="<?php echo esc_url(wp_login_url(get_current_url()));?>">
									<i class="fa fa-user"></i>
									<?php echo ___('Login');?>
								</a></li>
								<?php
								/**
								 * open sign
								 */
								if(method_exists('theme_open_sign','get_login_url')){
									if(theme_open_sign::get_login_url('qq')){
										?>
										<li><a href="<?php echo esc_url(theme_open_sign::get_login_url('qq'));?>" class="open-sign sign-in-meta qq" title="<?php echo ___('Login from QQ');?>">
											<i class="fa fa-qq"></i>
										</a></li>
									<?php
									}
									if(theme_open_sign::get_login_url('sina')){
										?>
										<li><a href="<?php echo esc_url(theme_open_sign::get_login_url('sina'));?>" class="open-sign sign-in-meta sina" title="<?php echo ___('Login from Weibo');?>">
											<i class="fa fa-weibo"></i>
										</a></li>
									<?php } ?>
								<?php } ?>
							<?php } ?>
						</ul>
					</li>
				</ul>
			</div><!-- /.navbar-header -->
			<?php
			/** 
			 * menu menu-header
			 */
			wp_nav_menu(array(
	            'theme_location'    => 'menu-header',
	            'container'         => 'nav',
	            'container_class'   => 'menu-header navbar-left navbar-collapse collapse',
	            'menu_class'        => 'menu nav navbar-nav',
	            'menu_id' 			=> 'menu-header',
	            'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
	            'walker'            => new wp_bootstrap_navwalker
	       	));
			?>
	
			<div class="collapse navbar-collapse navbar-right navbar-collapse-form mx-navbar-form">
				<form class="navbar-form" role="search" action="" method="get">
		            <div class="input-group">
		                <input name="s" class="form-control input-sm" placeholder="<?php echo ___('Keywords');?>" value="<?php echo esc_attr(get_search_query())?>" type="search">
		                <span class="input-group-btn">
		                    <button class="btn btn-default btn-sm" type="submit"><i class="fa fa-search"></i></button>
		                </span>
		            </div>
		        </form>		
	    	</div>
		</div>
	</div>
</div>
