/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	__webpack_require__(1)();

	__webpack_require__(3)();

	__webpack_require__(6)();


	/** addons */
	__webpack_require__(10)();
	__webpack_require__(12)();
	__webpack_require__(13)();
	__webpack_require__(15)();
	__webpack_require__(16)();
	//require('addons/custom-page-rank/assets/js/backend')();
	__webpack_require__(17)();
	__webpack_require__(18)();
	__webpack_require__(20)();
	__webpack_require__(22)();
	__webpack_require__(23)();
	__webpack_require__(24)();
	__webpack_require__(58)();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);

	module.exports = function(){
		ready(init);
		function init(){
			var $inputs = document.querySelectorAll('.text-select');
			if(!$inputs[0])
				return false;
			for(var i = 0, len = $inputs.length; i < len; i++){
				$inputs[i].addEventListener('click',function(){
					this.select();
				})
			}
		}
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(fn) {
		if (document.readyState != 'loading') {
			fn();
		} else if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', fn);
		} else {
			document.attachEvent('onreadystatechange', function() {
				if (document.readyState != 'loading') 
					fn();
			});
		}
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var window_scroll = __webpack_require__(4);
	var get_ele_top = __webpack_require__(5);

	module.exports = function(){
		'use strict';

		ready(init);

		var cache = {};
		
		function init(){
			cache.$tab = I('backend-tab');
			if(!cache.$tab)
				return;

			cache.$tab_loading = document.querySelector('.backend-tab-loading');
			cache.$tab_header = cache.$tab.querySelector('.tab-header');
			cache.$tab_header_items = cache.$tab_header.querySelectorAll('.tab-item');
			cache.$tab_body = cache.$tab.querySelector('.tab-body');
			cache.$tab_body_items = cache.$tab_body.querySelectorAll('.tab-item');
			
			cache.len = cache.$tab_header_items.length;
			cache.last_active_i = 0;
			cache.active_i = 0;
			cache.actived = [];

			for( var i = 0; i < cache.len; i++){
				cache.$tab_header_items[i].setAttribute('data-i',i);
				cache.$tab_header_items[i].addEventListener(('ontouchstart' in document.documentElement ? 'touchstart' : 'mouseover'),event_tab_header_hover);
			}

			/** show tab */
			cache.$tab_loading.style.display = 'none';
			cache.$tab.style.display = 'block';

			/** show last tab */
			last_tab_init();

			/** nav init */
			tab_nav_init();

			/** nav fixed init */
			tab_nav_fixed_init();
		}
		
		function event_tab_header_hover(e){
			e.preventDefault();
			e.stopPropagation();
			
			cache.active_i = this.getAttribute('data-i');
			
			if(cache.last_active_i == cache.active_i)
				return false;
				
			/** hide last tab */
			action_tab_hide(cache.last_active_i);
			
			/** show current tab */
			action_tab_show(cache.active_i);

			/** hide last tab nav */
			action_tab_nav_hide(cache.last_active_i);

			/** show current tab nav */
			action_tab_nav_show(cache.active_i);

			/** init tab nav scroll */
			tab_nav_scroll_init();
			
			/** set last tab */
			cache.last_active_i = cache.active_i;
			
			/** set last tab to localStorage */
			localStorage.setItem('backend-tab-last-active',cache.active_i);
		}
		function last_tab_init(){
			cache.last_active_i = parseInt(localStorage.getItem('backend-tab-last-active'));
			if(!cache.last_active_i)
				cache.last_active_i = 0;
			cache.active_i = cache.last_active_i;
			action_tab_show(cache.last_active_i);
		}
		function action_tab_show(i){
			//console.log(i);
			//console.log(cache.$tab_body_items[i]);
			cache.$tab_header_items[i].classList.add('active');
			cache.$tab_body_items[i].classList.add('active');
		}
		function action_tab_hide(i){
			cache.$tab_header_items[i].classList.remove('active');
			cache.$tab_body_items[i].classList.remove('active');
		}
		/**
		 * nav
		 */
		function tab_nav_init(){
			cache.$nav_container = document.createElement('div');
			cache.$nav_container.className = 'tab-nav-container';
			cache.$tab_body.insertBefore(cache.$nav_container,cache.$tab_body.firstChild);

			cache.admin_bar_height = 32;
			cache.legend_tops = [];
			cache.$tab_nav = [];
			cache.$nav_items = [];
			cache.$tab_legends = [];
			
			for(var i = 0; i < cache.len; i++){
				nav_item_create(i);
			}
			/** show tab nav */
			action_tab_nav_show(cache.last_active_i);
		}
		function nav_item_create(i){
			cache.$tab_nav[i] = document.createElement('nav');
			cache.$tab_nav[i].className = 'tab-nav';

			cache.$nav_items[i] = {};
			cache.$tab_legends[i] = cache.$tab_body_items[i].querySelectorAll('legend');

			cache.last_tab_nav_active_i = 0;
			
			if(!cache.$tab_legends[i][0])
				return false;
				
			for(var j = 0, len = cache.$tab_legends[i].length; j < len; j++){
				/** get legend title */
				var title = cache.$tab_legends[i][j].innerHTML,
					text = cache.$tab_legends[i][j].textContent;
					/** create nav item */
					if(!cache.$nav_items[i])
						cache.$nav_items[i] = [];
					cache.$nav_items[i][j] = document.createElement('span');
					
				/** scroll to top */
				cache.$tab_legends[i][j].addEventListener('click',function(){
					scrollTo(0,0);
				});
				
				/** set legend id */
				cache.$tab_legends[i][j].id = encodeURI(text);
				
				/** set data */
				cache.$nav_items[i][j].setAttribute('data-hash',encodeURI(text));
				cache.$nav_items[i][j].setAttribute('data-i',i);
				cache.$nav_items[i][j].setAttribute('data-j',j);
				cache.$nav_items[i][j].innerHTML = title;
				
				/** bind click */
				cache.$nav_items[i][j].addEventListener('click',event_nav_item_click);
				
				/** append */
				cache.$tab_nav[i].appendChild(cache.$nav_items[i][j]);
			}
			cache.$nav_container.appendChild(cache.$tab_nav[i]);
		}
		function event_nav_item_click(e){
			e.preventDefault();
			var $legend = cache.$tab_legends[this.getAttribute('data-i')][this.getAttribute('data-j')],
				$parent = $legend.parentNode;
				
			scrollTo(0,get_ele_top($legend) - cache.admin_bar_height);
			
			history.pushState(null, null, '#' + this.getAttribute('data-hash'));
			
			$parent.classList.add('active');
			setTimeout(function(){
				$parent.classList.remove('active');
			},2000);
		}
		function action_tab_nav_show(i){
			cache.$tab_nav[i].classList.add('active');
		}
		function action_tab_nav_hide(i){
			cache.$tab_nav[i].classList.remove('active');
		}
		function tab_nav_fixed_init(){
			cache.nav_ori_top = get_ele_top(cache.$nav_container) - cache.admin_bar_height;
			cache.is_fixed = false;
			
			tab_nav_scroll_init();
		}
		function tab_nav_scroll_init(){
			if(cache.actived.indexOf(cache.active_i) !== -1)
				return;

			/** set first active */
			cache.$nav_items[cache.active_i][0].classList.add('active');
			
			/** set offset top */
			for(var j = 0, len = cache.$tab_legends[cache.active_i].length; j < len; j++){
				if(!cache.legend_tops[cache.active_i])
					cache.legend_tops[cache.active_i] = [];
				cache.legend_tops[cache.active_i][j] = parseInt(get_ele_top(cache.$tab_legends[cache.active_i][j]));
			}
			window_scroll(function(scroll_y){
				event_tab_nav_fixed(scroll_y);
				event_legends_scroll(scroll_y);
			});
			
			/** set actived */
			cache.actived.push(cache.active_i);
		}
		function event_legends_scroll(wot){

			var len = cache.legend_tops[cache.active_i].length;
			for(var i=0; i<len; i++){
				if((wot >= cache.legend_tops[cache.active_i][i] - cache.admin_bar_height*2) && (wot < cache.legend_tops[cache.active_i][i + 1])){
					
					if(cache.tab_nav_last_active_i !== i){
						for(var j = 0; j < len; j++){
							cache.$nav_items[cache.active_i][j].classList.remove('active');
						}
						cache.$nav_items[cache.active_i][i].classList.add('active');
						cache.tab_nav_last_active_i = i;
					}
				}
			}
		}
		function event_tab_nav_fixed(y){
			if(y >= cache.nav_ori_top){
				if(!cache.is_fixed){
					cache.$tab_nav[cache.active_i].style.top = cache.admin_bar_height + 'px';
					cache.$tab_nav[cache.active_i].style.position = 'fixed';
					cache.is_fixed = true;
				}
			}else{
				if(cache.is_fixed){
					cache.$tab_nav[cache.active_i].style.top = 0;
					cache.$tab_nav[cache.active_i].style.position = 'relative';
					cache.is_fixed = false;
				}
			}
		}
		function I(e){
			return document.getElementById(e);
		}
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(fn){
		'use strict';
		
		var last_y = window.pageYOffset,
			ticking = false;
		function on_scroll(){
			last_y = window.pageYOffset;
			request_ticking();
		}
		function request_ticking(){
			if(!ticking){
				requestAnimationFrame(update);
				ticking = true;
			}
		}
		function update(){
			fn(last_y);
			ticking = false;
		}
		window.addEventListener('scroll',on_scroll);
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * get ele offset top
	 */
	module.exports = function(e){
		var l = e.offsetTop,
			c = e.offsetParent;
		while (c !== null){
			l += c.offsetTop;
			c = c.offsetParent;
		}
		return l;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var ajax_loading_tip = __webpack_require__(7);
	var ready = __webpack_require__(2);
	module.exports = function(){

		var cache = {},
			config = {
				lang : {
					M01 : 'Saving your settings, please wait...',
					M02 : 'Your settings have been saved.'
				}
			};

		ready(function(){
			submit();
		});

		function submit(){
			cache.fm = document.getElementById('backend-options-fm');
			if(!cache.fm)
				return;
			cache.fm.addEventListener('submit',function(){
				ajax_loading_tip('loading',config.lang.M01);
				return true;
			});
		}
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ajax_loading_tip
	 *
	 * @param string t Message type. success/error/info/loading...
	 * @param string s Message
	 * @param int Timeout to hide(second)
	 * @version 1.0.2
	 */
	var status_tip = __webpack_require__(8); 
	var click_handle = __webpack_require__(9);
	var cache = {};
	var doc = document;
	module.exports = function(t,s,timeout){
		
		if(!cache)
			cache = {};

		if(!cache.si)
			cache.si = false;
			
		/** if first */
		if(!cache.$t_container){
			cache.$c = doc.createElement('i');
			cache.$c.setAttribute('class','btn-close fa fa-times fa-fw');
			
			cache.$t_container = doc.createElement('div');
			cache.$t_container.id = 'ajax-loading-container';
			
			cache.$t = doc.createElement('div');
			cache.$t.id = 'ajax-loading';
			
			cache.$t_container.appendChild(cache.$t)
			cache.$t_container.appendChild(cache.$c);
			doc.body.appendChild(cache.$t_container);
			
			cache.$c.addEventListener(click_handle,function(){
				action_close();
				clearInterval(cache.si);
			});
		}
			
		clearInterval(cache.si);
		if(timeout > 0){
			set_close_time(timeout);
			cache.si = setInterval(function(){
				timeout--;
				set_close_time(timeout);
				if(timeout <= 0){
					action_close();
					cache.$c.innerHTML = '';
					if(cache.si)
						clearInterval(cache.si);
				}
			},1000);
		}else{
			cache.$c.innerHTML = '';
		}
		/** hide */
		if(t === 'hide'){
			action_close();
		/** show */
		}else{
			setTimeout(function(){
				cache.$t_container.className = t + ' show';
			},1);
			cache.$t.innerHTML = status_tip(t,s);
		}
		function set_close_time(t){
			cache.$c.innerHTML = '<b class="number">' + t + '</b>';
		}
		function action_close(){
			cache.$t_container.classList.remove('show');
		}
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * status_tip
	 *
	 * @param mixed
	 * @return string
	 * @version 1.1.3
	 */
	module.exports = function(){
		var defaults = ['type','size','content','wrapper'],
			types = ['loading','success','error','question','info','ban','warning'],
			sizes = ['small','middle','large'],
			wrappers = ['div','span'],
			type,
			icon,
			size,
			wrapper,
			content,	
			args = arguments;
		switch(args.length){
			case 0:
				return false;
			/** 
			 * only content
			 */
			case 1:
				content = args[0];
				break;
			/** 
			 * only type & content
			 */
			case 2:
				type = args[0];
				content = args[1];
				break;
			/** 
			 * other
			 */
			default:
				for(var i in args){
					eval(defaults[i] + ' = args[i];');
				}
		}
		if(!type)
			type = types[0];
		if(!size)
			size = sizes[0];
		if(!wrapper)
			wrapper = wrappers[0];

		switch(type){
			case 'success':
				icon = 'check-circle';
				break;
			case 'error' :
				icon = 'times-circle';
				break;
			case 'info':
			case 'warning':
				icon = 'exclamation-circle';
				break;
			case 'question':
			case 'help':
				icon = 'question-circle';
				break;
			case 'ban':
				icon = 'minus-circle';
				break;
			case 'loading':
			case 'spinner':
				icon = 'circle-o-notch fa-spin';
				break;
			default:
				icon = type;
		}

		return '<' + wrapper + ' class="tip-status tip-status-' + size + ' tip-status-' + type + '"><i class="fa fa-' + icon + ' fa-fw"></i> ' + content + '</' + wrapper + '>';
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = ('touchend' in document.documentElement ? 'touchend' : 'click');

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var status_tip = __webpack_require__(8);
	var ready = __webpack_require__(2);
	var array_merge = __webpack_require__(11);

	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_mailer)
			return;
			
		var cache = {},
			config = {
				process_url : ''
			};

		config = array_merge(config, window.THEME_CONFIG.theme_mailer);
		
		ready(bind);		

		function bind(){
			cache.$test_btn = I('theme_mailer-test-btn');
			cache.$test_mail = I('theme_mailer-test-mail');
			cache.$area = I('theme_mailer-area-btn');
			cache.$tip = I('theme_mailer-tip');

			cache.$from = I('theme_mailer-From');
			cache.$from_name = I('theme_mailer-FromName');
			cache.$host = I('theme_mailer-Host');
			cache.$port = I('theme_mailer-Port');
			cache.$secure = I('theme_mailer-SMTPSecure');
			cache.$username = I('theme_mailer-Username');
			cache.$pwd = I('theme_mailer-Password');
			

			if(!cache.$test_btn || !cache.$test_mail || !cache.$tip || !cache.$area)
				return false;

			cache.$test_btn.addEventListener('click', send_mail, false);
			
		}
		function send_mail(){
			if(cache.$test_mail.value === ''){
				cache.$test_mail.focus();
				return false;
			}else if(cache.$from.value === ''){
				cache.$from.focus();
				return false;
			}else if(cache.$from_name.value === ''){
				cache.$from_name.focus();
				return false;
			}else if(cache.$host.value === ''){
				cache.$host.focus();
				return false;
			}else if(cache.$port.value === ''){
				cache.$port.focus();
				return false;
			}else if(cache.$secure.value === ''){
				cache.$secure.focus();
				return false;
			}else if(cache.$username.value === ''){
				cache.$username.focus();
				return false;
			}else if(cache.$pwd.value === ''){
				cache.$pwd.focus();
				return false;
			}
			
			tip('loading',window.THEME_CONFIG.lang.M01);
			var xhr = new XMLHttpRequest(),
				fd = new FormData();

			fd.append('From',cache.$from.value);
			fd.append('FromName',cache.$from_name.value);
			fd.append('Host',cache.$host.value);
			fd.append('Port',cache.$port.value);
			fd.append('SMTPSecure',cache.$secure.value);
			fd.append('Username',cache.$username.value);
			fd.append('Password',cache.$pwd.value);
			fd.append('test',cache.$test_mail.value);
			
			xhr.open('post',config.process_url);
			xhr.send(fd);
			xhr.onload = function(){
				if (xhr.status >= 200 && xhr.status < 400) {
					var data;
					try{data = JSON.parse(xhr.responseText)}catch(e){data = xhr.responseText}
					if(data && data.status){
						tip(data.status,data.msg);
					}else{
						tip('error',data);
					}
				}else{
					tip('error',xhr.responseText);
				}
				
			};
			xhr.onerror = function(){
				tip('error',window.THEME_CONFIG.lang.E01);
			};
		}
		function tip(t,s){
			if(t === 'hide'){
				cache.$area.style.display = 'block';
				cache.$tip.style.display = 'none';
				return false;
			}
			cache.$tip.innerHTML = status_tip(t,s);
			cache.$tip.style.display = 'block';
			if(t === 'loading'){
				cache.$area.style.display = 'none';
			}else{
				cache.$area.style.display = 'block';
			}
		}
		function I(e){
			return document.getElementById(e);
		}
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function() {
		//  discuss at: http://phpjs.org/functions/array_merge/
		// original by: Brett Zamir (http://brett-zamir.me)
		// bugfixed by: Nate
		// bugfixed by: Brett Zamir (http://brett-zamir.me)
		//    input by: josh
		//   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
		//   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
		//   example 1: array_merge(arr1, arr2)
		//   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
		//   example 2: arr1 = []
		//   example 2: arr2 = {1: "data"}
		//   example 2: array_merge(arr1, arr2)
		//   returns 2: {0: "data"}
		var args = Array.prototype.slice.call(arguments),
			argl = args.length,
			arg, retObj = {},
			k = '',
			argil = 0,
			j = 0,
			i = 0,
			ct = 0,
			toStr = Object.prototype.toString,
			retArr = true;

		for (i = 0; i < argl; i++) {
			if (toStr.call(args[i]) !== '[object Array]') {
				retArr = false;
				break;
			}
		}

		if (retArr) {
			retArr = [];
			for (i = 0; i < argl; i++) {
				retArr = retArr.concat(args[i]);
			}
			return retArr;
		}

		for (i = 0, ct = 0; i < argl; i++) {
			arg = args[i];
			if (toStr.call(arg) === '[object Array]') {
				for (j = 0, argil = arg.length; j < argil; j++) {
					retObj[ct++] = arg[j];
				}
			} else {
				for (k in arg) {
					if (arg.hasOwnProperty(k)) {
						if (parseInt(k, 10) + '' === k) {
							retObj[ct++] = arg[k];
						} else {
							retObj[k] = arg[k];
						}
					}
				}
			}
		}
		return retObj;
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);

	module.exports = function(){
		'use strict';
		var cache = {},
			config = {
				color_prefix_id : 'theme_colorful_cats-cat-color-'
			};
			
		ready(bind);

		function bind(){

			cache.$preset_colors = I('theme_colorful_cats-preset-colors').querySelectorAll('a');
			cache.$cat_ids = I('theme_colorful_cats-cat-ids');
			cache.$cat_colors = document.querySelectorAll('.theme_colorful_cats-cat-colors');
			
			cache.$cat_ids.addEventListener('change', event_change);

			/** init the select color */
			
			for( var i = 0, len = cache.$cat_ids.options.length; i < len; i++ ){
				if(cache.$cat_ids.options[i].value == -1)
					continue;
				cache.$cat_ids.options[i].style.backgroundColor = '#' + get_color(cache.$cat_ids.options[i].value);
				cache.$cat_ids.options[i].setAttribute('data-color',get_color(cache.$cat_ids.options[i].value));
			}
			
			for( var i = 0, len = cache.$preset_colors.length; i < len; i++ ){
				cache.$preset_colors[i].addEventListener('click',event_preset_click);
			}
		};
		function event_preset_click(e){
			if(cache.$cat_ids.selectedIndex == 0)
				return false;
			var $opt = cache.$cat_ids.options[cache.$cat_ids.selectedIndex],
				color = this.getAttribute('data-color');
			$opt.setAttribute('data-color',color);
			$opt.style.backgroundColor = '#' + color;
			set_color($opt.value,color);
			
			for(var i = 0, len = cache.$preset_colors.length; i<len; i++){
				if(cache.$preset_colors[i].getAttribute('data-color') == color){
					if(!cache.$preset_colors[i].classList.contains('active'))
						cache.$preset_colors[i].classList.add('active');
				}else{
					cache.$preset_colors[i].classList.remove('active');
				}
			}
		}
		function get_color(cat_id){
			if(!cache.prefix_colors)
				cache.prefix_colors = [];
			if(!cache.prefix_colors[cat_id])
				cache.prefix_colors[cat_id] = I(config.color_prefix_id + cat_id).value;
			return cache.prefix_colors[cat_id];
		}
		function set_color(cat_id,color){
			cache.prefix_colors[cat_id] = color;
			I(config.color_prefix_id + cat_id).value = color;
		}
		function event_change(){
			var id = this.value;
			if(id == -1)
				return;
			for(var i = 0, len = cache.$preset_colors.length; i<len; i++){
				var $this_opt =  this.options[this.selectedIndex],
					this_color = $this_opt.getAttribute('data-color');
					
				if(cache.$preset_colors[i].getAttribute('data-color') == this_color){
					/** set active class */
					if(!cache.$preset_colors[i].classList.contains('active'))
						cache.$preset_colors[i].classList.add('active');
					/** set color vlaue */
					set_color($this_opt.value,this_color);
				}else{
					if(cache.$preset_colors[i].classList.contains('active'))
						cache.$preset_colors[i].classList.remove('active');
				}
			}
			
		}
		function I(e){
			return document.getElementById(e);
		}
		
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var array_merge = __webpack_require__(11);
	var paseHTML = __webpack_require__(14);

	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_custom_homebox)
			return;
		
		var cache = {},
			config = {
				placeholder_pattern : /\%placeholder\%/ig,
				tpl : ''
			};
		config = array_merge(config, window.THEME_CONFIG.theme_custom_homebox);
		
		ready(bind);
		function bind(){
			
			cache.$container = document.getElementById('theme_custom_homebox-container');
			if(!cache.$container)
				return;
				
			cache.$control_container = document.getElementById('theme_custom_homebox-control');

			cache.$items = cache.$container.querySelectorAll('.item');
			cache.$add = cache.$control_container.querySelector('.add');
			cache.$dels = cache.$container.querySelectorAll('.del');

			cache.len = cache.$items.length;
			/** 
			 * bind event for first init
			 */
			if(cache.len > 0){
				for(var i = 0; i < cache.len; i++){
					/** del */
					bind_del(cache.$dels[i]);
				}
			}
			/** 
			 * bind add event
			 */
			bind_add();
		}
		function bind_add(){
			cache.$add.addEventListener('click',function(){
				var tpl = config.tpl.replace(config.placeholder_pattern,+new Date()),
					$new_item = paseHTML(tpl);
				/** append */
				cache.$container.appendChild($new_item);
				/** bind del */
				bind_del($new_item.querySelector('.del'));
				/** focus */
				$new_item.querySelector('input').focus();
			});
		}
		function bind_del($del){
			$del.addEventListener('click', function () {
				var target_id = this.getAttribute('data-target'),
				$target = document.getElementById(target_id);
				if(window.jQuery){
					var $t = jQuery($target);
					$t.fadeOut(1,function(){
						$t.remove();
					}).css({
						'background-color':'#d54e21'
					});
				}else{
					$target.parentNode.removeChild($target);
				}
			});
		}
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(s) {
		var t = document.createElement('div');
		t.innerHTML = s;
		return t.firstChild;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);

	module.exports = function(){
		'use strict';
		if(!window.THEME_CONFIG.theme_page_tags)
			return;
			
		var cache = {},
			config = {
				process_url : ''
			};
		config = array_merge(config, window.THEME_CONFIG.theme_page_tags);
		
		ready(bind);
		function bind(){
			cache.$btn = document.getElementById('theme_page_tags-clean-cache');
			if(!cache.$btn)
				return;
			cache.$btn.addEventListener('click',event_click);
		}
		function event_click(){
			
			ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
			
			var xhr = new XMLHttpRequest();
			xhr.open('get',config.process_url);
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					try{data = JSON.parse(xhr.responseText)}catch(err){data = xhr.responseText}
					
					if(data && data.status){
						ajax_loading_tip(data.status,data.msg);
					}else{
						ajax_loading_tip('error',data);
					}
				}else{
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
				}
			};
			xhr.onerror = function(){
				ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
			};
			xhr.send();
		}
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);

	module.exports = function(){
		'use strict';
		if(!window.THEME_CONFIG.custom_page_cats) 
			return;
			
		var cache = {},
			config = {
				process_url : ''
			};
		config = array_merge(config, window.THEME_CONFIG.custom_page_cats);
		
		ready(bind);
		
		function bind(){
			cache.$btn = document.getElementById('theme_page_cats-clean-cache');
			cache.$tip = document.getElementById(cache.$btn.getAttribute('data-tip-target'));
			if(!cache.$btn)
				return;
			cache.$btn.addEventListener('click',ajax);
		}
		function ajax(){
			ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
			
			var xhr = new XMLHttpRequest();
			xhr.open('get',config.process_url);
			xhr.send();
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					try{data = JSON.parse(xhr.responseText)}catch(err){data = xhr.responseText}
					if(data && data.status){
						ajax_loading_tip(data.status,data.status,data.msg);
					}else{
						ajax_loading_tip('error',data);
					}
				}else{
					ajax_loading_tip('loading',window.THEME_CONFIG.lang.E01);
				}
			};
			xhr.onerror = function(){
				ajax_loading_tip('loading',window.THEME_CONFIG.lang.E01);
			};
		}
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);

	module.exports = function(){
		'use strict';
		
		if(!window.THEME_CONFIG.theme_custom_point)
			return;
			
		var cache = {},
			config = {
				process_url : ''
			};

		config = array_merge(config, window.THEME_CONFIG.theme_custom_point);

		
		ready(set_point);

		function set_point(){
			cache.$user_id = document.getElementById('theme_custom_point-special-user-id');
			
			cache.$user_point = document.getElementById('theme_custom_point-special-point');
			
			cache.$user_event = document.getElementById('theme_custom_point-special-event');
			
			cache.$user_set = document.getElementById('theme_custom_point-special-set');

			cache.$user_id.addEventListener('blur',event_blur_get_point);
			cache.$user_set.addEventListener('click',event_set_user_point);
			
		}
		function event_blur_get_point(){
			var $this = this,
				urls = '&user-id=' + $this.value + '&type=' + $this.getAttribute('data-ajax-type');
				
			if($this.value === '')
				return false;
				
			ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
			var xhr = new XMLHttpRequest();
			xhr.open('GET',config.process_url + urls);
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					
					try{data = JSON.parse(xhr.responseText);}catch(err){data = xhr.responseText}
					
					if(data && data.status){
						ajax_loading_tip(data.status,data.msg);
					}else{
						ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
					}
				}else{
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
				}
				xhr = null;
			};
			xhr.onerror = function(){
				ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
			};
			xhr.send();
			
			return false;
			
		}
		function event_set_user_point(){
			var validates = [
					cache.$user_id,
					cache.$user_point,
					cache.$user_event
				],
				urls = '';
			for(var i = 0, len = validates.length; i < len;i++){
				if(validates[i].value === ''){
					validates[i].focus();
					return false;
				}
				urls += '&special[' + validates[i].getAttribute('data-ajax-field') + ']=' + validates[i].value;
			}
			urls += '&type=special';
			
			ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
			
			var xhr = new XMLHttpRequest();
			xhr.open('GET',config.process_url + urls);
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					
					try{data = JSON.parse(xhr.responseText);}catch(e){data = xhr.responseText}
					
					if(data && data.status){
						ajax_loading_tip(data.status,data.msg);
					}else{
						ajax_loading_tip('error',data);
					}
				}else{
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
				}
				xhr = null;
			};
			xhr.onerror = function(){
				ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
			};
			xhr.send();
			
			return false;
		}
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);
	var param = __webpack_require__(19);

	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_point_lottery)
			return;

		var cache = {},
			config = {
				process_url : '',
				prefix_item_id : 'theme_point_lottery-item-',
				items_id : '.theme_point_lottery-item',
				add_id : 'theme_point_lottery-add',
				control_container_id : 'theme_point_lottery-control',
				tpl : '',
			};
			
		config = array_merge(config, window.THEME_CONFIG.theme_point_lottery);
		
		ready(function(){
			bind();
			check_redeem();
		});

		

		function bind(){
			add();
			del(jQuery(config.items_id));
		}
		function I(e,j){
			if(!j)
				return jQuery(document.getElementById(e));
			return document.getElementById(e);
		}
		function add(){
			var $add = I(config.add_id),
				$control_container = I(config.control_container_id);
			if(!$add[0]) return false;
			$add.on('click',function(){
				var $tpl = jQuery(config.tpl.replace(/\%placeholder\%/ig,get_random_int()));
				del($tpl);
				$control_container.before($tpl);
				$tpl.find('input').eq(0).focus();
			});
		
		}
		function del($tpl){
			$tpl.find('.delete').on('click',function(){
				I(jQuery(this).data('target'))
				.css('background','#d54e21')
				.fadeOut('slow',function(){
					jQuery(this).remove();
				})
			})
		}
		function get_random_int() {
			return +new Date();
		}
		function check_redeem(){
			cache.$tip = I('theme_point_lottery-tip',true);
			cache.$area_btns = I('theme_point_lottery-btns',true);
			cache.$user_id = I('theme_point_lottery-redeem-user-id',true);
			cache.$code = I('theme_point_lottery-redeem-code',true);
			cache.$submit = I('theme_point_lottery-check-redeem',true);

			function event_click(e){
				e.preventDefault();

				if(cache.$user_id.value === ''){
					cache.$user_id.focus();
					return false;
				}
				
				if(cache.$code.value === ''){
					cache.$code.focus();
					return false;
				}

				ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
				
				var xhr = new XMLHttpRequest(),
				fd = {
					'user-id' : cache.$user_id.value,
					redeem : cache.$code.value,
					type : 'check-redeem'
				};
				xhr.open('get',config.process_url + '&' + param(fd));
				xhr.send();
				xhr.onload = function(){
					if(xhr.status >= 200 && xhr.status < 400){
						var data;
						try{data = JSON.parse(xhr.responseText)}catch(e){data = xhr.responseText}
						if(data.status){
							ajax_loading_tip(data.status,data.msg);
						}else{
							ajax_loading_tip('error',data);
						}
					}else{
						ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
					}
				};
				xhr.onerror = function(){
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
				}
			}
			cache.$submit.addEventListener('click', event_click);
		}
	}

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(obj){
		return Object.keys(obj).map(function(key){ 
			return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]); 
		}).join('&');
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);
	var uploader = __webpack_require__(21);
	var paseHTML = __webpack_require__(14);

	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_custom_slidebox)
			return;
		
		var cache = {},
			config = {
				placeholder_pattern : /\%placeholder\%/ig,
				tpl : '',
				process_url : ''
			};
		config = array_merge(config, window.THEME_CONFIG.theme_custom_slidebox);
		
		ready(bind);
		function bind(){
			
			cache.$container = document.getElementById('theme_custom_slidebox-container');
			if(!cache.$container)
				return;
				
			cache.$control_container = document.getElementById('theme_custom_slidebox-control');

			cache.$items = cache.$container.querySelectorAll('.item');
			cache.$add = cache.$control_container.querySelector('.add');
			cache.$dels = cache.$container.querySelectorAll('.del');

			cache.len = cache.$items.length;
			/** 
			 * bind event for first init
			 */
			if(cache.len > 0){
				for(var i = 0; i < cache.len; i++){
					/** del */
					bind_del(cache.$dels[i]);
					/** upload */
					bind_upload({
						$item : cache.$items[i],
						$url : cache.$items[i].querySelector('.upload-img-url'),
						$file : cache.$items[i].querySelector('input[type="file"]')
					});
				}
			}
			/** 
			 * bind add event
			 */
			bind_add();
		}
		function bind_upload(args){
			new uploader({
				url : config.process_url,
				$item : args.$item,
				$file : args.$file,
				paramname : 'img',
				onselect : function(){
					ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
				},
				onalways : function(data,i,file,count) {
					if(data && data.status === 'success'){
						args.$url.value = data.url;
						if(args.$item){
							args.$item.querySelector('.img-preview').src = data.url;
						}
						ajax_loading_tip('success',data.msg,3);
					}else if(data && data.status === 'error'){
						ajax_loading_tip(data.status,data.msg,3);
					}else{
						ajax_loading_tip('error',data);
					}
				}
			});
		}
		
		function bind_add(){
			cache.$add.addEventListener('click',function(){
				var tpl = config.tpl.replace(config.placeholder_pattern, +new Date()),
					$new_item = paseHTML(tpl);
				/** append */
				cache.$container.appendChild($new_item);
				/** bind del */
				bind_del($new_item.querySelector('.del'));
				/** bind upload */
				bind_upload({
					$item : $new_item,
					$file : $new_item.querySelector('input[type="file"]'),
					$url : $new_item.querySelector('.upload-img-url')
				});
				/** focus */
				$new_item.querySelector('input').focus();
			});
		}
		function bind_del($del){
			$del.addEventListener('click', function () {
				var target_id = this.getAttribute('data-target'),
				$target = document.getElementById(target_id);
				if(window.jQuery){
					var $t = jQuery($target);
					$t.fadeOut(1,function(){
						$t.remove();
					}).css({
						'background-color':'#d54e21'
					});
				}else{
					$target.parentNode.removeChild($target);
				}
			});
		}
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var array_merge = __webpack_require__(11);

	module.exports = function(config){
		'use strict';
		var defaults = {
			$file : false,
			url : '',
			paramname : 'file',
			maxsize : 1048*1024*2, /** 2mb */
			maxfiles : 50,
			interval : 3000,
			onselect : function(file,file_index,file_count){},
			status_success : function(data,file_index,file,count){},
			onalways : function(data,file_index,file,count){},
			onprogress : function(percent,file_index,file,count){},
			status_error : function(data,file_index,file,count){},
			onerror : function(data,file_index,file,count){}
		};
		config = array_merge(defaults, config);
		
		if(!config.$file) 
			return false;
			
		var files,
			file,
			file_count = 0,
			file_index = 0,
			start_time,
			is_uploading = false,
			all_complete = false;


		init();
		function init(){
			config.$file.addEventListener('change', handle_change);
			config.$file.addEventListener('drop', handle_drop);
		};

		function handle_drop(e){
			e.stopPropagation();
			e.preventDefault();
			files = e.dataTransfer.files;
			file_count = files.length;
			file = files[0];
			file_index = 0;
			file_upload(files[0]);
		}
		function handle_change(e){
			e.stopPropagation();
			e.preventDefault();
			files = e.target.files.length ? e.target.files : e.originalEvent.dataTransfer.files;
			file_count = files.length;
			file = files[0];
			file_index = 0;
			file_upload(files[0]);
		}
		function file_upload(file){
			start_time = new Date();
			config.onselect(file,file_index,file_count);
			submission(file);
		}
		function submission(file){
			if(is_uploading) 
				return;
			is_uploading = true;
			var fd = new FormData(),
			xhr = new XMLHttpRequest();
			fd.append(config.paramname,file);
			xhr.open('post',config.url);
			xhr.send(fd);
			
			xhr.onload = function(){
				if (xhr.status >= 200 && xhr.status < 400) {
					complete(xhr);
				}else{
					error(status,file_index,file,file_count);
				}
				is_uploading = false;
				xhr = null;
			};
			xhr.onerror = function(){
				config.onerror(i,file,file_count);
			};
			xhr.upload.onprogress = function(e){
				if (e.lengthComputable) {
					var percent = (e.loaded * cache.file_index) / (e.total * cache.file_count) * 100;
					config.onprogress(percent,i,file,file_count);
				}
			};
		}
		function complete(xhr){
			var data = xhr.responseText;
			try{data = JSON.parse(xhr.responseText);
			}catch(error){}
			file_index++;
			if(data.status === 'success'){
				config.status_success(data,file_index,file,file_count);
				if(file_count === file_index){
					all_complete = true;
					is_uploading = false;
					config.$file.value = '';
				}else{
					upload_next(files[file_index]);
				}
			}else{
				config.status_error(data,file_index,file,file_count);
				if(file_count > file_index){
					upload_next(files[file_index]);
				}else{
					config.$file.value = '';
				}
			}
			config.onalways(data,file_index,file,file_count);

		}
		function upload_next(file){
			var end_time = new Date(),
			interval_time = end_time - start_time,
			timeout = config.interval - interval_time,
			timeout = timeout < 0 ? 0 :timeout;
			setTimeout(function(){
				file_upload(file);
			},timeout);
		}
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var ajax_loading_tip = __webpack_require__(7);
	var ready = __webpack_require__(2);
	var uploader = __webpack_require__(21);
	var array_merge = __webpack_require__(11);
	module.exports = function(){
		'use strict';
		if(!window.THEME_CONFIG.theme_import_settings)
			return;
			
		var cache = {},
			config = {
				process_url : ''
			};

		config = array_merge(config, window.THEME_CONFIG.theme_import_settings);
		
		ready(file_import);
		
		function I(e){
			return document.getElementById(e);
		}
		function file_import(){
			cache.$file = I('theme_import_settings-file');
			if(!cache.$file)
				return false;
			
			new uploader({
				$file : cache.$file,
				url : config.process_url + '&type=import',
				onselect : onselect,
				onalways : onalways,
				onerror : onerror
			});
			
			function onselect(){
				ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
			}
			function onalways(data){
				if(data.status === 'success'){
					ajax_loading_tip(data.status,data.msg);
					location.reload(true);
				}else if(data.status === 'error'){
					ajax_loading_tip(data.status,data.msg);
				}else{
					ajax_loading_tip('error',data);
				}
			}
			function onerror(){
				ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
			}
		}
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);
	module.exports = function(){
		if(!window.THEME_CONFIG.theme_clean_up)
			return;
			
		var cache = {},
			config = {
				process_url : ''
			};

		config = array_merge(config, window.THEME_CONFIG.theme_clean_up);
		
		ready(bind);
		
		function bind(){
			cache.$btns = document.querySelectorAll('.theme_clean_up-btn');
			if(!cache.$btns[0])
				return;

			for(var i = 0, len = cache.$btns.length; i < len; i++){
				cache.$btns[i].addEventListener('click',event_click);
			}
		}
		function event_click(){
			ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
			var xhr = new XMLHttpRequest();
			xhr.open('get',config.process_url + '&type=' + this.getAttribute('data-action'));
			xhr.send();
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					try{data=JSON.parse(xhr.responseText)}catch(err){data=xhr.responseText};
					if(data && data.status){
						ajax_loading_tip(data.status,data.msg);
					}else{
						ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
					}
				}else{
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
				}
			};
			xhr.onerror = function(){
				ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
			};
		}
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var array_merge = __webpack_require__(11);

	module.exports = function(){
		if(!window.THEME_CONFIG.theme_help)
			return;
		var cache = {},
			config = {};
		
		config = array_merge(config, window.THEME_CONFIG.theme_help);
		
		ready(function(){
			paypal();
		});
		
		function paypal(){
			bind_click();
			function create_form(){
				cache.$paypal_fm = document.createElement('form');
				cache.$paypal_fm.setAttribute('accept-charset','GBK');
				cache.$paypal_fm.name = '_xclick';
				cache.$paypal_fm.action = 'https://www.paypal.com/cgi-bin/webscr';
				cache.$paypal_fm.method = 'post';
				cache.$paypal_fm.target = '_blank';
				cache.$paypal_fm.style.display = 'none';
				document.body.appendChild(cache.$paypal_fm);
			}
			function create_inputs(){
				var inputs_data = {
					'cmd' : '_donations',
					'item_name' : config.lang.M01,
					'amount' : '',
					'currency_code' : 'USD',
					'business' : 'kmvan.com@gmail.com',
					'lc' : 'US',
					'no_note' : '0'
				};
				for(var i in inputs_data){
					var $input = document.createElement('input');
					$input.type = 'hidden';
					$input.name = i;
					$input.value = inputs_data[i];
					cache.$paypal_fm.appendChild($input);
				}
			}
			function event_submit(){
				cache.$paypal_fm.submit();
			}
			function bind_click(){
				cache.$paypal_btn = document.getElementById('paypal_donate');
				if(!cache.$paypal_btn)
					return false;
				cache.$paypal_btn.addEventListener('click', function (e) {
					create_form();
					create_inputs();
					event_submit();
				});
			}
		}
	}

/***/ },
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var tpl_control = __webpack_require__(59);

	module.exports = function(){
		ready(bind);
		function bind(){
			var ootpl = new tpl_control();
			ootpl.$add = document.getElementById('theme_custom_report-add');
			ootpl.$container = document.getElementById('theme_custom_report-container');
			ootpl.init();
		}
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var click_handle = __webpack_require__(9);
	var paseHTML = __webpack_require__(14);

	module.exports = function(){
		this.$add = false;
		this.$container = false;
		this.new_tpl_callback = false;

		var that = this,
			cache = {};
			
			
		this.init = function(){
			if(!that.$add || !that.$container)
				return;
				
			cache.$items = that.$container.querySelectorAll('.tpl-item');
			cache.$dels = that.$container.querySelectorAll('.del');
			/** bind add */
			bind_click_add();
			
			if(!cache.$items[0])
				return;

			bind_items();
		};
		function bind_items(){
			for(var i = 0, len = cache.$items.length; i < len; i++){
				/** add callback */
				if(typeof(that.new_tpl_callback) == 'function')
					that.new_tpl_callback(cache.$items[i]);
				/** bind delete */
				bind_click_del(cache.$dels[i]);
			}
		}
		function bind_click_del($del){
			$del.addEventListener(click_handle, event_click_del);
		}
		function event_click_del(e){
			e.preventDefault();
			var target_id = this.getAttribute('data-target'),
				$target = document.getElementById(target_id);
			if(window.jQuery){
				var $t = jQuery($target);
				$t.fadeOut(1,function(){
					$t.remove();
				}).css({
					'background-color':'#d54e21'
				});
			}else{
				$target.parentNode.removeChild($target);
			}
		}
		function bind_click_add(){
			that.$add.addEventListener(click_handle, event_click_add);
		}
		function event_click_add(e){
			e.preventDefault();
			var tpl = that.$container.getAttribute('data-tpl').replace(/\%placeholder\%/ig, +new Date()),
				$new_item = paseHTML(tpl);

			/** bind del */
			bind_click_del($new_item.querySelector('.del'));
			
			/** add callback */
			if(typeof(that.new_tpl_callback) == 'function')
				that.new_tpl_callback($new_item);
				
			that.$container.appendChild($new_item);
			/** focus first input */
			var $first_input = $new_item.querySelector('input');
			if($first_input)
				$first_input.focus();
		}
	}

/***/ }
/******/ ]);