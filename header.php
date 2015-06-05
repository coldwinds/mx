<!DOCTYPE html><html <?php language_attributes(); ?>><head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><![endif]-->
	<!-- <meta http-equiv="Cache-Control" content="no-transform" /> -->
	<meta name="renderer" content="webkit" />
	<meta name="viewport" content="width=device-width" />
	<meta name="author" content="INN STUDIO" />
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
	<?php wp_head();?>
</head>
<body <?php body_class(); ?>>

<?php if(!wp_is_mobile()){ ?>
	<div class="top-bar navbar navbar-default hidden-xs">	
		<div class="container">
			<?php
			/** 
			 * menu top-bar
			 */
           theme_cache::wp_nav_menu( array(
                'theme_location'    => 'menu-top-bar',
                'container'         => 'nav',
                'container_class'   => 'nav navbar-nav navbar-left',
                'menu_class'        => 'nav navbar-nav',
                'menu_id' 			=> 'menu-top-bar',
                'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
                'walker'            => new wp_bootstrap_navwalker())
            );
			?>
			<div class="top-bar-tools">
				<?php include __DIR__ . '/tpl/header-topbar-tools.php';?>
			</div>
		</div><!-- /.container -->
	</div><!-- /.top-bar -->	
<?php } ?>


<?php
/** 
 * banner
 */
if(!wp_is_mobile() && has_header_image()){ ?>
	<a href="<?= home_url();?>" class="banner hidden-xs">
		<img src="<?php header_image(); ?>" alt="Banner">
		<?php if(display_header_text()){ ?>
			<h1 hidden><?= get_bloginfo('name');?></h1>
			<span hidden><?= get_bloginfo('description');?></span>
		<?php } ?>
	</a>
<?php } ?>

<div class="main-nav navbar navbar-default">
	<div class="container">
	<!-- <div class="container-fluid"> -->
		<div class="navbar-header">
			<a href="javascript:;" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".menu-header">
	            <span class="sr-only"></span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	        </a>
	        <a href="<?= home_url();?>" class="navbar-brand">
				<?= get_bloginfo('name');?>
			</a>
			<!-- search btn -->
			<a class="mx-tool mx-search-btn dropdown-toggle" href="javascript:;" data-toggle="collapse" data-target=".navbar-collapse-form">
				<i class="fa fa-search fa-fw fa-fw"></i>
			</a>

			<!-- account btn -->
			<?php if(is_user_logged_in()){ ?>
				<a class="mx-tool mx-account-btn dropdown-toggle" href="javascript:;" data-toggle="collapse" data-target=".header-nav-account-menu">
					<i class="fa fa-user fa-fw"></i>
				</a>
			<?php }else{ ?>
				<a class="mx-tool mx-account-btn dropdown-toggle" href="<?= esc_url(wp_login_url(get_current_url()));?>">
					<i class="fa fa-user fa-fw"></i>
				</a>
			<?php } ?>
		</div>
		<?php
		/** 
		 * menu menu-header
		 */
		theme_cache::wp_nav_menu(array(
	        'theme_location'    => 'menu-header',
	        'container'         => 'nav',
	        'container_class'   => 'menu-header navbar-left navbar-collapse collapse',
	        'menu_class'        => 'menu nav navbar-nav',
	        'menu_id' 			=> 'menu-header',
	        'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
	        'walker'            => new wp_bootstrap_navwalker
	   	));
		?>

		<!-- search btn -->
		<a class="mx-tool mx-search-btn hidden-xs" href="javascript:;" data-toggle="collapse" data-target=".navbar-collapse-form">
			<i class="fa fa-search fa-fw"></i>
		</a>
		
		<?php
		/**
		 * account menu
		 */
		if(is_user_logged_in()){
			$active_tab = get_query_var('tab');
			if(!$active_tab)
				$active_tab = 'dashboard';
				
			$is_account_page = theme_custom_account::is_page();
			?>
			<div class="header-nav-account-menu collapse">
				<ul class="nav navbar-nav">
					<?php
					$account_navs = apply_filters('account_navs',[]);
					if(!empty($account_navs)){
						foreach($account_navs as $k => $v){
							$active_class = $k === $active_tab ? ' active ' : null;
							?>
							<li class="<?= $is_account_page ? $active_class : null;?>"><?= $v;?></li>
							<?php
						}
					}
					?>
				</ul>
			</div>
		<?php } ?>

		<!-- search form -->
		<form class="mx-form navbar-form navbar-collapse-form collapse" role="search" action="<?= esc_url(home_url('/')); ?>" method="get">
            <div class="input-group">
                <input name="s" class="form-control input-sm" placeholder="<?= ___('Keywords');?>" value="<?= esc_attr(get_search_query())?>" type="search">
                <span class="input-group-btn">
                    <button class="btn btn-default btn-sm" type="submit"><i class="fa fa-search fa-fw"></i></button>
                </span>
            </div>
        </form>		
        
	<!-- </div> --><!-- /.container-fluid -->
	</div>
</div><!-- /.main-nav -->