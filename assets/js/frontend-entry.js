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

	/** common */
	//require('modules/ready');
	//require('modules/click-handle');
	//require('modules/get-ele-top');
	//require('modules/get-ele-left');
	//require('modules/auto-focus');
	//require('modules/in-screen');
	//require('modules/is-email');
	//require('modules/replace-array');
	//require('modules/window-scroll');
	//require('modules/status-tip');
	//require('modules/scroll-to');
	//require('modules/ajax-loading-tip');
	//require('modules/lazyload');
	//require('modules/validate');
	//require('modules/parse-html');
	//require('modules/placeholder');

	/** theme */
	__webpack_require__(26)();
	__webpack_require__(28)();
	__webpack_require__(29)();
	__webpack_require__(30)();
	__webpack_require__(31)();
	__webpack_require__(32)();
	__webpack_require__(33)();
	__webpack_require__(34)();

	/** addons common*/
	__webpack_require__(35)();
	__webpack_require__(36)();


	/** addons custom */
	__webpack_require__(37)();
	__webpack_require__(38)();
	__webpack_require__(41)();
	__webpack_require__(42)();
	var pna = __webpack_require__(43);
		pna.init();
	__webpack_require__(44)();
	__webpack_require__(45)();
	__webpack_require__(46)();

	/** vistor */
	__webpack_require__(47)();


/***/ },
/* 1 */,
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
/* 3 */,
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
/* 6 */,
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
/* 10 */,
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
/* 12 */,
/* 13 */,
/* 14 */
/***/ function(module, exports) {

	module.exports = function(s) {
		var t = document.createElement('div');
		t.innerHTML = s;
		return t.firstChild;
	};

/***/ },
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var scroll_to = __webpack_require__(27);
	var click_handle = __webpack_require__(9);
	var ready = __webpack_require__(2);
	module.exports = function(){
		'use strict';
		init();
		function init(){
			ready(function(){
				var $back = document.getElementById('back-to-top');
				if(!$back)
					return;
					
				$back.addEventListener(click_handle, function(e){
					e.preventDefault();
					scroll_to(0);
				});
			})
		}
	}

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = function(top, callback){
		// ease in out function thanks to:
		// http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
		var easeInOutCubic = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }
		var position = function(start, end, elapsed, duration) {
		    if (elapsed > duration) return end;
		    return start + (end - start) * easeInOutCubic(elapsed / duration);
		}

		var smoothScroll = function(el, duration, callback, context){
		    duration = duration || 500;
		    context = context || window;
		    var start = window.pageYOffset;

		    var end = parseInt(top),
		    clock = (+new Date),
		    requestAnimationFrame = window.requestAnimationFrame ||
		        window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
		        function(fn){
			        window.setTimeout(fn, 15);
		        };

		    var step = function(){
		        var elapsed = (+new Date) - clock;
		        if (context !== window) {
		        	context.scrollTop = position(start, end, elapsed, duration);
		        }
		        else {
		        	window.scroll(0, position(start, end, elapsed, duration));
		        }

		        if (elapsed > duration) {
		            if (typeof callback === 'function') {
		                callback(el);
		            }
		        } else {
		            requestAnimationFrame(step);
		        }
		    }
		    step();
	    };
	    smoothScroll(top);
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var window_scroll = __webpack_require__(4);
	var ready = __webpack_require__(2);

	module.exports = function(){
		'use strict';
		var cache = {};
		
		ready(bind)

		function bind(){
			cache.$menu = document.querySelector('.nav-main');
			if(!cache.$menu)
				return;
			cache.menu_height = cache.$menu.offsetHeight;
			cache.y = 0;
			cache.fold = false;
			/** first init */
			event_win_scroll(window.pageYOffset);
			
			window_scroll(event_win_scroll);
		}

		function hide(){
			if( !cache.fold ){
				cache.$menu.classList.add('fold');
				cache.$menu.classList.remove('top')
				cache.fold = true;
			}
		}
		function show(){
			if( cache.fold ){
				cache.$menu.classList.remove('fold');
				cache.fold = false;
			}
		}
		function event_win_scroll(scroll_y){
			if(scroll_y <= cache.menu_height){
				show();
				cache.$menu.classList.add('top');
			/**
			 * scroll down
			 */
			}else if( cache.y <= scroll_y ){
				hide();
			/**
			 * scroll up and delay show
			 */
			}else if( cache.y - scroll_y < 100 ) {
				show();
			}
			cache.y = scroll_y;
		}
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var click_handle = __webpack_require__(9);

	module.exports = function(){
		var $toggles = document.querySelectorAll('a[data-toggle-target]');
		if(!$toggles[0])
			return;

		var $last_click_btn,
			$last_target;

		function show_menu(){
			var icon_active = $last_click_btn.getAttribute('data-icon-active'),
				icon_original = $last_click_btn.getAttribute('data-icon-original');
			$last_target.classList.add('on');
			
			if(icon_active && icon_original){
				$last_click_btn.classList.remove(icon_original);
				$last_click_btn.classList.add(icon_active);
			}
			var focus_target = $last_click_btn.getAttribute('data-focus-target');
			if(focus_target){
				var $focus_target = document.querySelector(focus_target);
				if($focus_target){
					setTimeout(function(){
						$focus_target.focus();
					},500);
				}
			}
		}
		function hide_menu(e){
			if(e)
				e.preventDefault();
			var icon_active = $last_click_btn.getAttribute('data-icon-active'),
				icon_original = $last_click_btn.getAttribute('data-icon-original');
				
			$last_target.classList.remove('on');
			if(icon_active && icon_original){
				$last_click_btn.classList.remove(icon_active);
				$last_click_btn.classList.add(icon_original);
			}
		}
		function event_click(e){
			$last_target = document.querySelector(this.getAttribute('data-toggle-target'));
			$last_click_btn = this;

			/** hide */
			if($last_target.classList.contains('on')){
				hide_menu();
			}else{
				show_menu();
			}
		}
		for( var i = 0, len = $toggles.length; i < len; i++){
			$toggles[i].addEventListener(click_handle, event_click);
		}
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var click_handle = __webpack_require__(9);
	var ready = __webpack_require__(2);

	module.exports = function(){
		'use strict';
		var cache = {};

		function bind(){
			cache.$toggles = document.querySelectorAll('a[data-mobile-target]');
			if(!cache.$toggles[0])
				return;
			
			create_layer();

			for( var i = 0, len = cache.$toggles.length; i < len; i++){
				cache.$toggles[i].addEventListener(click_handle, event_click);
			}
		}

		function create_layer(){
			cache.$layer = document.createElement('div');
			cache.$layer.id = 'mobile-on-layer';
			cache.$layer.addEventListener(click_handle, hide_menu);
			document.body.appendChild(cache.$layer);
		}

		function show_menu(){
			var icon_active = cache.$last_click_btn.getAttribute('data-icon-active'),
				icon_original = cache.$last_click_btn.getAttribute('data-icon-original');
			document.body.classList.add('menu-on');
			cache.$last_target.classList.add('on');
			if(icon_active && icon_original){
				cache.$last_click_btn.classList.remove(icon_original);
				cache.$last_click_btn.classList.add(icon_active);
			}
			var focus_target = cache.$last_click_btn.getAttribute('data-focus-target');
			if(focus_target){
				var $focus_target = document.querySelector(focus_target);
				if($focus_target){
					$focus_target.focus();
				}
			}
		}
		function hide_menu(){
			var icon_active = cache.$last_click_btn.getAttribute('data-icon-active'),
				icon_original = cache.$last_click_btn.getAttribute('data-icon-original');
				
			document.body.classList.remove('menu-on');
			cache.$last_target.classList.remove('on');
			if(icon_active && icon_original){
				cache.$last_click_btn.classList.remove(icon_active);
				cache.$last_click_btn.classList.add(icon_original);
			}
		}
		function event_click(e){
			cache.$last_target = document.querySelector(this.getAttribute('data-mobile-target'));
			cache.$last_click_btn = this;
			/** hide */
			if(cache.$last_target.classList.contains('on')){
				hide_menu();
			}else{
				show_menu();
			}
		}
		
		ready(bind);
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);

	module.exports = function(){
		'use strict';
		
		var selects = document.querySelectorAll('.archive-pagination select');
		if(!selects[0])
			return;
			
		function event_change(e){
			if(this.value)
				location.href = this.value;
		}
		function init(){
			for(var i = 0, len = selects.length; i < len; i++){
				selects[i].addEventListener('change',event_change);
			}
		}
		ready(init);
	}

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = function(){
		var $btn = document.querySelector('.main-nav a.search');
			
		if(!$btn)
			return false;
			
		var $fm = document.querySelector($btn.getAttribute('data-toggle-target')),
			$input = $fm.querySelector('input[type="search"]'),
			event_submit = function(){
				if($input.value.trim() === ''){
					$input.focus();
					return false;
				}
			};
		function st(e){
			if(e)
				e.preventDefault();
			setTimeout(function(){
				$input.focus();
			},100);
		}
		$btn.addEventListener(click_handle,st);

		$fm.onsubmit = event_submit;
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	module.exports = function(){
		init();
		function init(){
			ready(bind);
		}
		function bind(){
			var $no_js = document.querySelectorAll('.hide-no-js'),
				$on_js = document.querySelectorAll('.hide-on-js');
			if($no_js[0]){
				for( var i = 0, len = $no_js.length; i < len; i++)
					$no_js[i].style.display = 'none';
			}
			if($on_js[0]){
				for( var i = 0, len = $on_js.length; i < len; i++)
					$on_js[i].style.display = 'none';
			}
		}
	}

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = function(){
	/*
	 * Lazy Load Images without jQuery
	 * http://kaizau.github.com/Lazy-Load-Images-without-jQuery/
	 *
	 * Original by Mike Pulaski - http://www.mikepulaski.com
	 * Modified by Kai Zau - http://kaizau.com
	 */
	!function(){function d(a){var b=0;if(a.offsetParent){do b+=a.offsetTop;while(a=a.offsetParent);return b}}var a=window.addEventListener||function(a,b){window.attachEvent("on"+a,b)},b=window.removeEventListener||function(a,b){window.detachEvent("on"+a,b)},c={cache:[],mobileScreenSize:500,addObservers:function(){a("scroll",c.throttledLoad),a("resize",c.throttledLoad)},removeObservers:function(){b("scroll",c.throttledLoad,!1),b("resize",c.throttledLoad,!1)},throttleTimer:(new Date).getTime(),throttledLoad:function(){var a=(new Date).getTime();a-c.throttleTimer>=200&&(c.throttleTimer=a,c.loadVisibleImages())},loadVisibleImages:function(){for(var a=window.pageYOffset||document.documentElement.scrollTop,b=window.innerHeight||document.documentElement.clientHeight,e={min:a-200,max:a+b+200},f=0;f<c.cache.length;){var g=c.cache[f],h=d(g),i=g.height||0;if(h>=e.min-i&&h<=e.max){var j=g.getAttribute("data-src-mobile");g.onload=function(){this.className=this.className.replace(/(^|\s+)lazy-load(\s+|$)/,"$1lazy-loaded$2")},g.src=j&&screen.width<=c.mobileScreenSize?j:g.getAttribute("data-src"),g.removeAttribute("data-src"),g.removeAttribute("data-src-mobile"),c.cache.splice(f,1)}else f++}0===c.cache.length&&c.removeObservers()},init:function(){document.querySelectorAll||(document.querySelectorAll=function(a){var b=document,c=b.documentElement.firstChild,d=b.createElement("STYLE");return c.appendChild(d),b.__qsaels=[],d.styleSheet.cssText=a+"{x:expression(document.__qsaels.push(this))}",window.scrollBy(0,0),b.__qsaels}),a("load",function d(){for(var a=document.querySelectorAll("img[data-src]"),e=0;e<a.length;e++){var f=a[e];c.cache.push(f)}c.addObservers(),c.loadVisibleImages(),b("load",d,!1)})}};c.init()}();

	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var array_merge = __webpack_require__(11);
	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var parseHTML = __webpack_require__(14);

	module.exports = function(){
		'use strict';
		
		/** check config */
		if(!window.THEME_CONFIG.theme_comment_ajax)
			return false;

		var cache = {},
			config = {
				process_url : '',
				pagi_process_url : '',
				post_id : '',
				lang : {
					M01 : 'Loading, please wait...',
					M02 : 'Previous',
					M03 : 'Next',
					M04 : '{n} page',
				}
			};
			
		config = array_merge(config,window.THEME_CONFIG.theme_comment_ajax);
		
		function init(){
			ready(function(){
				/**
				 * set comment count
				 */
				count.set();
				
				cache.$comment_list_container = I('comment-list-' + config.post_id);
				cache.$comments = I('comments');
				
				window.addComment = addComment;
				
				list.init();
				/**
				 * pagination
				 */
				var pagi = new pagination();

				pagi.lang.loading = config.lang.M01;
				pagi.lang.error = window.THEME_CONFIG.lang.E01;
				pagi.lang.prev = config.lang.M02;
				pagi.lang.next = config.lang.M03;
				pagi.lang.midd = config.lang.M04;
				
				pagi.pages = window.DYNAMIC_REQUEST.theme_comment_ajax.pages;
				pagi.cpage = window.DYNAMIC_REQUEST.theme_comment_ajax.cpage;
				pagi.url_format = config.pagi_process_url;
				pagi.init();

				/**
				 * respond
				 */
				var rsp = new respond();
				rsp.init();
			});
		};
		var count = {
			set : function(n){
				cache.$count = I('comment-number-' + config.post_id);
				if(!cache.$count)
					return false;

				cache.$count.innerHTML = n ? n : window.DYNAMIC_REQUEST.theme_comment_ajax.count;
			}
		};
		var list = {
			init : function(){
				if(!window.DYNAMIC_REQUEST.theme_comment_ajax.comments)
					return false;
				cache.$comment_list_container.innerHTML = window.DYNAMIC_REQUEST.theme_comment_ajax.comments;
				/** jump to comment */
				jump_to_comment();
			},
			get : function(){
				var _list = this,
					xhr = new XMLHttpRequest(),
					param = param({
						'type' : 'get-comments',
						'post-id' : config.post_id,
						'theme-nonce' : window.DYNAMIC_REQUEST['theme-nonce']
					});
				xhr.open('GET',config.pagi_process_url + '&' + param);
				xhr.send();
				xhr.onload = function(){
					if(xhr.status >= 200 && xhr.status < 400){
						var data;
						try{data = JSON.parse(xhr.responseText);}catch(e){data = xhr.responseText}
						if(data && data.status){
							_list.done(data);
						}else{
							_list.fail(data);
						}
						_list.always(data);
					}
				}
				
			},
			done : function(data){
				if(data.status === 'success'){
					cache.$comment_list_container.innerHTML = data.comments;
					
				}
			},
			faild : function(tx){
				
			},
			always : function(data){
				
			}
		};

		function pagination(){
			this.id = 'comment-pagination';
			this.container_id = 'comment-pagination-container';
			this.cpage = 1;
			this.pages = 1;
			this.class_name = 'comment-pagination';

			this.url_format = '';/** http://xxx.com/pages=n */
			this.lang = {
				loading : 'Loading, please wait...',
				error : 'Sorry, some server error occurred, the operation can not be completed, please try again later.',
				prev : 'Previous',
				next : 'Next',
				midd : '{n} page'
			};

			this.before = function(){};
			this.done = function(){};
			this.faild = function(){};
			this.always = function(){};

			var _cache = {},
				_that = this,
				target_page;
			
			this.init = function(){
				_cache.$container = document.getElementById(_that.container_id);
				if(!_cache.$container)
					return false;

				_cache.$container.appendChild(create());
				//console.log(_that.cpage);
				set_cache(_that.cpage,cache.$comment_list_container.innerHTML);
			};
			function set_cache(cpage,comments){
				//console.log('set ' +cpage);
				if(!_cache.comments)
					_cache.comments = [];
				/**
				 * for cache imgs
				 */
				var $tmp = parseHTML(comments),
					imgs = [];
				for(var i = 0, len = $tmp.length; i < len; i++){
					var tmp_imgs = $tmp[i].querySelectorAll('img');
					if(!tmp_imgs[0])
						continue;
					for(var j = 0, j_len = tmp_imgs.length; j < j_len; j++){
						imgs[j] = new Image();
						imgs[j].src = tmp_imgs[j].src;
					}
				}
				
				_cache.comments[cpage] = comments;
			}
			function get_cache(cpage){
				//console.log('get ' +cpage);
				return !_cache.comments || !_cache.comments[cpage] ? false : _cache.comments[cpage];
			}
			function create(){
				if(_that.pages <= 1)
					return false;
					
				_cache.$pagi = document.createElement('div');
				_cache.$pagi.id = _that.id;
				_cache.$pagi.setAttribute('class','comment-pagination');

				_cache.$pagi.appendChild(create_prev());
				_cache.$pagi.appendChild(create_next());

				return _cache.$pagi;
			}
			function create_prev(){
				var prev_class = _that.cpage <= 1 ? 'disabled' : '',
					attrs = {
						'class' : 'prev btn btn-success ' + prev_class,
						'href' : 'javascript:;'
					};
				_cache.$prev = document.createElement('a');
				for(var k in attrs){
					_cache.$prev.setAttribute(k,attrs[k]);
				}
				_cache.$prev.innerHTML = _that.lang.prev;
				_cache.$prev.addEventListener(click_handle,prev_click);
				return _cache.$prev;
			}
			/**
			 * Previous btn click
			 */
			function prev_click(e){
				if(e)
					e.preventDefault();
				if(_that.cpage <= 1)
					return false;
				target_page = parseInt(_that.cpage) - 1;
				ajax();
			}
			function done_prev(){
				if(_that.cpage <= 1){
					_cache.$prev.classList.add('disabled');
				}else{
					_cache.$prev.classList.remove('disabled');
				}
			}
			function create_next(){
				var next_class = _that.cpage > _that.pages - 1 ? 'disabled' : '',
					attrs = {
						'class' : 'next btn btn-default ' + next_class,
						'href' : 'javascript:;'
					};
				_cache.$next = document.createElement('a');
				for(var k in attrs){
					_cache.$next.setAttribute(k,attrs[k]);
				}
				_cache.$next.innerHTML = _that.lang.next;
				//console.log(_that.cpage == _that.pages);
				_cache.$next.addEventListener(click_handle,next_click);
				return _cache.$next;
			}
			/**
			 * Next btn click
			 */
			function next_click(e){
				if(e)
					e.preventDefault();
				//console.log(_that.cpage == _that.pages);
				if(_that.cpage == _that.pages)
					return false;
					
				target_page = parseInt(_that.cpage) + 1;
				ajax();
			}
			function done_next(){
				if(_that.cpage == _that.pages){
					_cache.$next.classList.add('disabled');
				}else{
					_cache.$next.classList.remove('disabled');
				}
			}
			function get_process_url(){
				return _that.url_format.replace('=n','=' + target_page);
			}
			
			function ajax(){
				scroll_to_list();
				/**
				 * restore form
				 */
				if(cache.$comments.querySelector('#respond'))
					addComment.cancelMove();

				/** set cpage */
				set_cpage();
				/**
				 * check cache
				 */
				if(get_cache(_that.cpage)){
					/**
					 * set html
					 */
					cache.$comment_list_container.innerHTML = get_cache(_that.cpage);
					
					done_prev();
					done_next();
					return false;
				}
				
				/** loading tip */
				ajax_loading_tip('loading',_that.lang.loading);
				
				var xhr = new XMLHttpRequest();
				xhr.open('GET',get_process_url() + '&theme-nonce=' + window.DYNAMIC_REQUEST['theme-nonce']);
				xhr.send();
				xhr.onload = function(){
					if(xhr.status >= 200 && xhr.status < 400){
						var data;
						try{data = JSON.parse(xhr.responseText)}catch(e){data = xhr.responseText}
						if(data && data.status === 'success'){
							
							/**
							 * set html
							 */
							cache.$comment_list_container.innerHTML = data.comments;
							/** set cpage */
							//set_cpage();
							/**
							 * cache
							 */
							set_cache(_that.cpage,data.comments);
							
							
							/** close tip */
							ajax_loading_tip('hide');
							done_next();
							done_prev();
						}else if(data && data.status === 'error'){
							ajax_loading_tip(data.status,data.msg);
						}else{
							ajax_loading_tip('error',data);
						}
						//console.log(_that.cpage);
					}
					_that.always();
					xhr = null;
				};
				xhr.onerror = function(){
					ajax_loading_tip('error',_that.lang.error);
				};
			}
			function set_cpage(){
				if(_that.cpage >= target_page){
					_that.cpage--;
				}else{
					_that.cpage++;
				}
			}
			/** scroll to comment list container offset top */
			function scroll_to_list(){
				location.hash = '#none';
				location.hash = '#comments';
			}
		}
		

		/**
		 * respond
		 */
		function respond(){
			var _cache = {},
				_config = {
					logged : window.DYNAMIC_REQUEST.theme_comment_ajax.logged,
					registration : window.DYNAMIC_REQUEST.theme_comment_ajax.registration,
					prefix_comment_body_id : 'comment-body-'
				};

			this.init = function(){
				goto_click();
				fm_init();
			};


			function fm_init(){
				_cache.$respond 		= I('respond');
				_cache.$fm 				= I('commentform');
				_cache.$must_logged 	= I('respond-must-login');
				_cache.$loading_ready 	= I('respond-loading-ready');
				_cache.$avatar 			= I('respond-avatar');
				_cache.$area_visitor 	= I('area-respond-visitor');
				_cache.$comment_parent 	= I('comment_parent');
				_cache.$comment_ta 		= I('comment-form-comment');
				
				
				if(!_cache.$respond || !_cache.$fm)
					return false;
					
				_cache.$submit_btn		= _cache.$fm.querySelector('.submit');

				/**
				 * hide loading ready
				 */
				if(_cache.$loading_ready)
					_cache.$loading_ready.parentNode.removeChild(_cache.$loading_ready);
					
				/**
				 * if not logged and need registration, return false
				 */
				if(_config.registration && !_config.logged){
					_cache.$must_logged.style.display = 'block';
					return false;
				}
				/**
				 * ctrl + enter to submit
				 */
				if(_cache.$comment_ta){
					
					_cache.$comment_ta.addEventListener('keydown',function(e){
						if (e.keyCode == 13 && e.ctrlKey) {
							_cache.$submit_btn.click();
							return false;
						}
					},false);
				}
				
				/**
				 * user logged
				 */
				if(_config.logged){
					if(_cache.$avatar)
						_cache.$avatar.src = window.DYNAMIC_REQUEST.theme_comment_ajax['avatar-url'];

					if(_cache.$area_visitor)
						_cache.$area_visitor.parentNode.removeChild(_cache.$area_visitor);
				}else{
					/**
					 * preset userinfo
					 */
					preset_userinfo();
				}
				_cache.$fm.style.display = 'block';

				_cache.$fm.addEventListener('submit',fm_submit);
			}
			function preset_userinfo(){
				if(_config.logged)
					return false;
				_cache.$comment_form_author = I('comment-form-author');
				_cache.$comment_form_email = I('comment-form-email');
				if(!_cache.$comment_form_author || !_cache.$comment_form_email)
					return false;

				if(window.DYNAMIC_REQUEST.theme_comment_ajax['user-name'])
					_cache.$comment_form_author.value = window.DYNAMIC_REQUEST.theme_comment_ajax['user-name'];
				if(window.DYNAMIC_REQUEST.theme_comment_ajax['user-email'])
					_cache.$comment_form_email.value = window.DYNAMIC_REQUEST.theme_comment_ajax['user-email'];
			}
			function fm_submit(e){
				/**
				 * check comment textarea
				 */
				if(_cache.$comment_ta.value.trim() === ''){
					_cache.$comment_ta.focus();
					ajax_loading_tip('error',_cache.$comment_ta.getAttribute('title'),3);
					return false;
				}
				/**
				 * check requred input and format
				 */
				if(!_config.logged && _config.registration){
					var $inputs = _cache.$fm.querySelectorAll('input[required]');
					for(var i = 0, len = $inputs.length; i < len; i++){
						/** check email */
						if($inputs[i].getAttribute('type') === 'email' && !is_email($inputs[i].value)){
							ajax_loading_tip('error',$inputs[i].getAttribute('title'),3);
							return false;
						}
						/** check null value */
						if($inputs[i].value.trim() === ''){
							ajax_loading_tip('error',$inputs[i].getAttribute('title'),3);
							return false;
						}
					}
				}

				/**
				 * ajax send
				 */
				ajax_loading_tip('loading',config.lang.M01);
				_cache.$submit_btn.setAttribute('disabled',true);
				ajax();
				return false;
			}
			function ajax(){
				var xhr = new XMLHttpRequest(),
					fd = new FormData(_cache.$fm);
				fd.append('theme-nonce',window.DYNAMIC_REQUEST['theme-nonce']);
				xhr.open('POST',config.process_url);
				xhr.send(fd);
				xhr.onload = function(){
					if(xhr.status >= 200 && xhr.status < 400){
						var data;
						try{data = JSON.parse(xhr.responseText);}catch(e){data = xhr.responseText}
						if(data && data.status === 'success'){
							/** do not use srcset */
							data.comment = data.comment.replace('srcset','data-srcset');
							var $new_comment = parseHTML(data.comment);
							$new_comment.classList.add('new');
							/**
							 * if children respond
							 */
							if(_cache.$comment_parent.value != 0){
								var $parent_comment_body = I(_config.prefix_comment_body_id + _cache.$comment_parent.value);
								$parent_comment_body.insertAdjacentHTML('afterend','<ul class="children">' + $new_comment.innerHTML + '</ul>');
								/** restore respond */
								addComment.cancelMove();
							}else{
								cache.$comment_list_container.appendChild($new_comment);
							}
							/** clear comment textarea */
							_cache.$comment_ta.value = '';
							
							/** hide comment loading */
							var $comment_loading = cache.$comments.querySelector('.comment-loading');
							if($comment_loading)
								$comment_loading.parentNode.removeChild($comment_loading);
							/** set comment number */
							var $badge = I('comment-number-' + data.post_id);
							if($badge){
								if(isNaN($badge.innerHTML)){
									$badge.innerHTML = 1;
								}else{
									$badge.innerHTML++;
								}
							}
							/**
							 * show $comments
							 */
							cache.$comments.style.display = 'block';
							
							/** show success tip */
							ajax_loading_tip(data.status,data.msg,3);
						}else if(data && data.status === 'error'){
							ajax_loading_tip(data.status,data.msg);
							/** focus */
							_cache.$comment_ta.focus();
						}else{
							ajax_loading_tip('error',data);
							/** focus, select */
							_cache.$comment_ta.select();
						}
					}else{
						ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
					}
					/** enable submit btn */
					_cache.$submit_btn.removeAttribute('disabled');
				};
				xhr.onerror = function(){
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
					_cache.$submit_btn.removeAttribute('disabled');
				}
				
			}
			function goto_click(){
				_cache.$goto =I('goto-comment');
				_cache.$comment = I('comment-form-comment');
				if(!_cache.$goto || !_cache.$comment)
					return false;
					
				_cache.$goto.style.display = 'block';
				_cache.$goto.onclick = function(){
					_cache.$comment.focus();
				}
			}
			
		}

		
		/**
		 * form comment-reply.js
		 */
		var addComment = {
			cache : {},
			cancelMove : function(){
				var t = this;

				t.cache.$parent.value = '0';
				t.cache.$tmp.parentNode.insertBefore(t.cache.$respond, t.cache.$tmp);
				//t.cache.$tmp.parentNode.removeChild(temp);
				
				t.cache.$cancel.style.display = 'none';
				t.cache.$cancel.onclick = null;
			},
			moveForm : function(commId, parentId, respondId, postId) {
				var t = this;

				t.cache.$comm 		= I(commId);
				t.cache.$respond 	= I(respondId);
				t.cache.$cancel 	= I('cancel-comment-reply-link');
				t.cache.$parent 	= I('comment_parent');
				t.cache.$post 		= I('comment_post_ID'),
				t.cache.$comment 	= I('comment-form-comment');

				if ( ! t.cache.$comm || ! t.cache.$respond || ! t.cache.$cancel || ! t.cache.$parent )
					return;

				postId = postId || false;

				if ( ! t.cache.$tmp ) {
					t.cache.$tmp = document.createElement('div');
					t.cache.$tmp.id = 'wp-temp-form-div';
					t.cache.$tmp.style.display = 'none';
					t.cache.$respond.parentNode.insertBefore(t.cache.$tmp, t.cache.$respond);
				}

				t.cache.$comm.parentNode.insertBefore(t.cache.$respond, t.cache.$comm.nextSibling);
				if ( t.cache.$post && postId )
					t.cache.$post.value = postId;
				t.cache.$parent.value = parentId;
				t.cache.$cancel.style.display = 'block';

				t.cache.$cancel.onclick = function() {
					t.cancelMove();
					return false;
				};

				if(t.cache.$comment)
					t.cache.$comment.focus();

				return false;
			}
		};
		function jump_to_comment(){
			if(!location.hash || location.hash === '')
				return false;
			var hash = location.hash,
				$comment = I(hash.substr(1));
			if(!$comment)
				return false;
			location.hash = 'e';
			location.hash = hash;
		}
		function I(e){
			return document.getElementById(e);
		}
		
		init();
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2),
		click_handle = __webpack_require__(9);
	module.exports = function(){
		'use strict';

		ready(bind);

		var cache = {};
			
		function bind(){
			cache.$emotion_btns = document.querySelectorAll('.comment-emotion-pop-btn');
			cache.$pop = document.querySelectorAll('.comment-emotion-area-pop .pop');
			cache.$comment = I('comment-form-comment');
			cache.$emotion_faces = document.querySelectorAll('.comment-emotion-area-pop a');
			if(!cache.$emotion_btns[0])
				return;
				
			cache.pop_hide = [];
			cache.replaced = [];
			pop();
			insert();
		}
		function insert(){
			function insert_content(e){
				if(e)
					e.preventDefault();
				cache.$comment.focus();
				var caret_pos = cache.$comment.selectionStart,
					old_val = cache.$comment.value;
				cache.$pop[cache.active_pop_i].style.display = 'none';
				
				cache.$comment.value = old_val.substring(0,caret_pos) + ' ' + this.getAttribute('data-content') + ' ' + old_val.substring(caret_pos);
				
			}
			for( var i = 0, len = cache.$emotion_faces.length; i < len; i++){
				cache.$emotion_faces[i].addEventListener(click_handle,insert_content);
			}
		}
		function hide_pop(e){
			if(e)
				e.stopPropagation();
			if(cache.$last_show_pop)
				cache.$last_show_pop.style.display = 'none';
			document.body.removeEventListener(click_handle, hide_pop);
		}
		function show_pop(e){
			if(e)
				e.stopPropagation();
			/**
			 * hide other pop
			 */
			for( var i = 0, len = cache.$pop.length; i < len; i++){
				if(cache.pop_hide[i] !== true){
					cache.$pop[i].style.display = 'none';
					cache.pop_hide[i] = true;
				}
				if(this == cache.$emotion_btns[i]){
					cache.active_pop_i = i;
					cache.pop_hide[i] = false;
					cache.$pop[i].style.display = 'block';
					cache.$last_show_pop = cache.$pop[i];
				}
			}
			/** replace data-url to src attribute */
			if(!cache.replaced[cache.active_pop_i]){
				cache.replaced[cache.active_pop_i] = true;
				var $imgs = cache.$pop[cache.active_pop_i].querySelectorAll('img');
				for(var i = 0, len = $imgs.length; i < len; i++){
					$imgs[i].src = $imgs[i].getAttribute('data-url');
					$imgs[i].removeAttribute('data-url');
				}
			}
			document.body.addEventListener(click_handle,hide_pop);
		}
		function pop(){
			for(var i = 0, len = cache.$emotion_btns.length; i < len; i++){
				cache.$emotion_btns[i].addEventListener(click_handle, show_pop);
			}
		}
		function I(e){
			return document.getElementById(e);
		}
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var array_merge = __webpack_require__(11);
	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_custom_slidebox)
			return;
			
		var cache = {},
			config = {
				type : 'candy'
			};

		config = array_merge(config, window.THEME_CONFIG.theme_custom_slidebox);
			
		function bind(){
			cache.$container = document.querySelector('.theme_custom_slidebox-container');
			if(!cache.$container)
				return;
				
			cache.$main = cache.$container.querySelector('.area-main');
			cache.$blurs = cache.$container.querySelectorAll('.area-blur .item');
			
			eval(config.type + '();');
		}
		/**
		 * scroller
		 */
		function scroller(){
			var moving = false,
				last_x;
			
			function mousemove(e){
				if(!moving)
					moving = true;
					
				if(!last_x)
					last_x = e.clientX;

				if(cache.$main.scrollLeft >= 0)
					cache.$main.scrollLeft = cache.$main.scrollLeft - (last_x - e.clientX);
				
				last_x = e.clientX;
			}
			function mouseout(e){
				if(moving)
					moving = false;

				if(!e.target.width)
					last_x = 0;
			}
			
			cache.$main.addEventListener('mouseout', mouseout);
			cache.$main.addEventListener('mousemove', mousemove);
			
			/**
			 * blur
			 */
			blur();
			function blur(){
				cache.$as = cache.$main.querySelectorAll('a');
				cache.current_i = 0;
				cache.len = cache.$as.length;
				function event_hover(e){
					var current_i = this.getAttribute('data-i');
					if(cache.current_i == current_i)
						return false;
					cache.current_i = current_i;
					for(var i = 0; i < cache.len; i++){
						//console.log(i);
						cache.$blurs[i].classList.contains('active') && cache.$blurs[i].classList.remove('active');
						
						cache.$as[i].classList.contains('active') && cache.$as[i].classList.remove('active');
					}
					this.classList.add('active');
					cache.$blurs[current_i].classList.add('active');
				}
				for(var i = 0; i < cache.len; i++){
					cache.$as[i].setAttribute('data-i',i);
					cache.$as[i].addEventListener('mouseover', event_hover);
				}
			}
		}
		/**
		 * candy
		 */
		function candy(){
			cache.$mains = cache.$container.querySelectorAll('.area-main .item');
			cache.$thumbnails = cache.$container.querySelectorAll('.area-thumbnail .item');
			
			cache.len = cache.$thumbnails.length;
			cache.current_i = 0;
			
			function event_hover(e){
				var current_i = this.getAttribute('data-i');
				if(cache.current_i == current_i)
					return false;
				cache.current_i = current_i;
				for(var i = 0; i < cache.len; i++){
					cache.$blurs[i].classList.contains('active') && cache.$blurs[i].classList.remove('active');
					
					cache.$mains[i].classList.contains('active') && cache.$mains[i].classList.remove('active');
					
					cache.$thumbnails[i].classList.contains('active') && cache.$thumbnails[i].classList.remove('active');
				}
				this.classList.add('active');
				cache.$blurs[current_i].classList.add('active');
				cache.$mains[current_i].classList.add('active');
			}
			for(var i = 0; i < cache.len; i++){
				cache.$thumbnails[i].setAttribute('data-i',i);
				cache.$thumbnails[i].addEventListener('mouseover', event_hover);
			}
		}

		ready(bind);
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var scroll_to = __webpack_require__(27);
	var get_ele_left = __webpack_require__(39);
	var get_ele_top = __webpack_require__(5);
	var is_mobile = __webpack_require__(40);
	var window_scroll = __webpack_require__(4);
	module.exports = function(){
		'use strict';

		/** do not init with mobile device */
		if(is_mobile)
			return;
		var cache = {
			is_fixed : false,
			target_datas : [],
			$items : [],
			main_nav_gutter : 70
		};

		ready(bind);
		
		function bind(){
			cache.$boxes = document.querySelectorAll('.homebox');
			if(!cache.$boxes[0])
				return;
				
			cache.len = cache.$boxes.length;
			cache.$last_boxes = cache.$boxes[cache.len - 1];
			cache.ori_bottom = get_ele_top(cache.$last_boxes) + cache.$last_boxes.offsetHeight;
			cache.ori_offset_left = get_ele_left(cache.$boxes[0]);
			cache.ori_offset_top = get_ele_top(cache.$boxes[0]);
			create_nav();
			bind_window_scroll();
		}
		function bind_window_scroll(){
			function event_on_scroll(scrollY){
				/** fixed */
				if(scrollY >= cache.target_datas[0].offset_top){
					if(!cache.is_fixed){
						cache.$nav.style.position = 'fixed';
						cache.$nav.style.top = cache.main_nav_gutter + 'px';
						cache.is_fixed = true;
					}
				}else{
					if(cache.is_fixed){
						cache.$nav.style.position = 'absolute';
						cache.$nav.style.top = cache.ori_offset_top + 'px';
						cache.is_fixed = false;
					}
				}
				for( var i = 0, len = cache.target_datas.length; i < len; i++ ){
					if(scrollY >= cache.target_datas[i].offset_top && scrollY < cache.target_datas[i].offset_top + cache.target_datas[i].height){
						cache.$items[i].classList.add('active');
					}else{
						cache.$items[i].classList.remove('active');
					}
				}
			}
			window_scroll(event_on_scroll);
		}
		function set_nav_style(){
			cache.$nav.style.left = cache.ori_offset_left + 'px';
			cache.$nav.style.top = cache.ori_offset_top + 'px';
		}
		function scroll_it(e){
			e.preventDefault();
			scroll_to(this.getAttribute('data-scroll-top'));
		}
		function append_content_nav(){
			for( var i = 0, len = cache.$boxes.length; i < len; i++ ){
				var $title = cache.$boxes[i].querySelector('.title a'),
					title = $title.textContent || $title.innerText,
					$i = $title.querySelector('i'),
					offsetTop = get_ele_top(cache.$boxes[i]) - cache.main_nav_gutter,
					$item = document.createElement('a');
					
				if(!$i)
					continue;
					
				var icon_class = $i.getAttribute('class');
				
				/** save target datas */
				cache.target_datas[i] = {
					offset_top : offsetTop,
					height : parseInt(getComputedStyle(cache.$boxes[i]).marginBottom) + cache.$boxes[i].clientHeight
				};
				
				$item.setAttribute('data-scroll-top',offsetTop);
				$item.href = '#' + cache.$boxes[i].id;
				$item.title = title;
				$item.innerHTML = '<i class="'+ icon_class + ' fa-fw"></i>';
				
				$item.addEventListener('click', scroll_it);
				cache.$items[i] = $item;
				cache.$nav.appendChild(cache.$items[i]);
			}
		}
		function create_nav(){
			cache.$nav = document.createElement('nav');
			cache.$nav.id = 'homebox-nav';
			append_content_nav();
			set_nav_style();
			document.body.appendChild(cache.$nav);
		}
	}

/***/ },
/* 39 */
/***/ function(module, exports) {

	/**
	 * get ele offset left
	 */
	module.exports = function(e){
		var l = e.offsetLeft,
			c = e.offsetParent;
		while (c !== null){
			l += c.offsetLeft;
			c = c.offsetParent;
		}
		return l;
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = /Mobi/.test(navigator.userAgent);

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	module.exports = function(){
		'use strict';

		ready(bind);
		
		var cache = {};
		
		function bind(){
			cache.$thumbnail_container = document.querySelector('.attachment-slide-thumbnail');
			if(!cache.$thumbnail_container)
				return false;
				
			cache.$thumbnails = cache.$thumbnail_container.querySelectorAll('a');
			if(cache.$thumbnails.length <= 3)
				return false;

			cache.$thumbnail_active = cache.$thumbnail_container.querySelector('a.active');
			
			/** scroll it */
			cache.$thumbnail_container.scrollLeft = cache.$thumbnail_active.offsetLeft - 100;
		}
	}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var ajax_loading_tip = __webpack_require__(7);
	var ready = __webpack_require__(2);
	var array_merge = __webpack_require__(11);

	module.exports = function(){
		'use strict';
		
		if(!window.THEME_CONFIG.custom_post_point)
			return;
			
		var cache = {},
			config = {
				process_url : '',
			};
			
		config = array_merge(config, window.THEME_CONFIG.custom_post_point);
		
		function init(){
			ready(bind);
		}
			
		function bind(){
			cache.$btns = document.querySelectorAll('.post-point-btn');
			if(!cache.$btns[0])
				return false;
				
			for(var i = 0,len = cache.$btns.length; i<len; i++){
				cache.$btns[i].addEventListener('click',event_click);
			}
		}

		function event_click(e){
			e.preventDefault();
			e.stopPropagation();
			var post_id = this.getAttribute('data-post-id'),
				points = this.getAttribute('data-points');

			cache.$number = I('post-point-number-' + post_id);
			
			ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
			
			var xhr = new XMLHttpRequest(),
				fd = new FormData();
			fd.append('post-id',post_id);
			fd.append('points',points);
			fd.append('theme-nonce',window.DYNAMIC_REQUEST['theme-nonce']);
			
			xhr.open('post',config.process_url);
			xhr.send(fd);
			
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					try{data = JSON.parse(xhr.responseText)}catch(err){data = xhr.responseText}
					
					if(data && data.status){
						done(data);
					}else{
						fail(data);
					}
				}else{
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
				}
			};
			xhr.onerror = function(){
				ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
			};

			function done(data){
				if(data.status === 'success'){
					ajax_loading_tip(data.status,data.msg,3);
					/** incre points to dom */
					cache.$number.innerHTML = data.points;
				}else{
					ajax_loading_tip(data.status,data.msg);
				}
			};
			function fail(text){
				ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
			}
			
		}
		function I(e){
			return document.getElementById(e);
		}

		init();
	}

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);
	var scroll_to = __webpack_require__(27);
	var window_scroll = __webpack_require__(4);
	var ready = __webpack_require__(2);
	var click_handle = __webpack_require__(9);
	var get_ele_top = __webpack_require__(5);
	var get_ele_left = __webpack_require__(39);

	var cache = {},
		config = {
			process_url : '',
			post_id : '',
			numpages : '',
			url_tpl : '',
			page : 1,
			lang : {
				M01 : 'Loading, please wait...', 
				M02 : 'Content loaded.',
				M03 : 'Already first page.',
				M04 : 'Already last page.',
				E01 : 'Sorry, some server error occurred, the operation can not be completed, please try again later.'
			}
		};
		
	config = array_merge(config, window.THEME_CONFIG.theme_page_nagination_ajax);

	var page_nagi = {
		init : function(){
			var that = this;
			cache.$post = document.querySelector('.singular-post');
			cache.$nagi = document.querySelector('.page-pagination');
			cache.$next = cache.$nagi.querySelector('.next');
			cache.$prev = cache.$nagi.querySelector('.prev');
			cache.$next_number = cache.$next.querySelector('.current-page');
			cache.$prev_number = cache.$prev.querySelector('.current-page');
			
			if(!cache.$post || !cache.$nagi)
				return;

			cache.last_scroll_y = window.pageYOffset;
			cache.ticking = false;
			cache.post_top;
			cache.max_bottom;
			cache.is_hide = false;

			window.addEventListener('resize',function(){
				that.reset_nagi_style();
			});

			this.bind();
		},
		bind : function(rebind){
			if(rebind === true){
				cache.$nagi = document.querySelector('.page-pagination');
			}
			this.reset_nagi_style();
			this.bind_scroll();
		},
		reset_nagi_style : function(){
			cache.post_top = get_ele_top(cache.$post);
			cache.post_height = cache.$post.querySelector('.entry-body').clientHeight;
			cache.max_bottom = cache.post_top + cache.post_height;
			cache.$nagi.style.left = get_ele_left(cache.$post) + 'px';
			cache.$nagi.style.width = cache.$post.clientWidth + 'px';
		},
		bind_scroll : function(){
			
			var is_fixed = false;
			function event_scroll(y){
				/** pos absolute */
				if(y >= cache.max_bottom - 250){
					if(is_fixed){
						cache.$nagi.classList.remove('fixed');
						is_fixed = false;
					}
				}else{
					if(!is_fixed){
						cache.$nagi.classList.add('fixed');
						is_fixed = true;
					}
				}
			}
			window_scroll(event_scroll);
		}
	};
	function img_link(){
		if(!cache.$nagi)
			return;
		var $imgs = cache.$post_content.querySelectorAll('a > img'),
			len = $imgs.length;
		if(len == 0)
			return;

		function event_img_click(e){
			e.preventDefault();
			cache.$as[1].click();
		}
		for(var i = 0; i < len; i++){
			var $parent = $imgs[i].parentNode;
			$parent.href = 'javascript:;';
			$parent.addEventListener(click_handle,event_img_click);
		}
	}
	function pagi_ajax(){
		if(!cache.$nagi)
			return;
			
		cache.$post_content = document.querySelector('.entry-content');
		cache.$as = cache.$nagi.querySelectorAll('a');
		/**
		 * bind click event
		 */
		for( var i = 0, len = cache.$as.length; i < len; i++){
			cache.$as[i].addEventListener(click_handle,event_click);
		}
		
		/** save current post content to cache */
		set_cache(config.page,cache.$post_content.innerHTML);
		/**
		 * get post content from cache
		 */
		function get_data_from_cache(id){
			if(!cache.post_contents || !cache.post_contents[id])
				return false;
			return cache.post_contents[id];
		}
		
		/**
		 * set post content to cache
		 */
		function set_cache(id,data){
			if(!cache.post_contents)
				cache.post_contents = [];
			cache.post_contents[id] = data;
		}
		
		/**
		 * write the content to post content area
		 */
		function set_post_content(content){
			cache.$post_content.innerHTML = content;
		}
		
		/**
		 * get current page after click
		 */
		function get_next_page(){
			return cache.$current == cache.$next ? config.page + 1 : config.page - 1;
		}
		
		function event_click(e){
			e.preventDefault();
			
			cache.$current = this;

			/** check first page */
			if(is_first_page()){
				ajax_loading_tip('warning',config.lang.M03,3);
				return false;
			}
			if(is_last_page()){
				ajax_loading_tip('warning',config.lang.M04,3);
				return false;
			}
			/** if have cache, just set content */
			if(get_data_from_cache(get_next_page())){
				set_post_content(get_data_from_cache(get_next_page()));
				pagenumber();
				hash();
				img_link();
				return;
			}
			ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
			var xhr = new XMLHttpRequest();
			xhr.open('get',config.process_url + '&page=' + get_next_page());
			xhr.send();
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					try{data = JSON.parse(xhr.responseText);}catch(e){data = xhr.responseText}
					if(data && data.status){
						done(data);
					}else{
						fail(data);
					}
				}else{
					fail();
				}
			};
			xhr.onerror = function(){
				fail();
			};
		}
		function done(data){
			if(data.status === 'success'){
				/** set cache */
				set_cache(get_next_page(),data.content)
				/** set html */
				set_post_content(data.content);
				/** change page number */
				pagenumber();
				/** hash */
				hash();
				/** img link */
				img_link();
				/** hide tip */
				ajax_loading_tip('hide');
			}else if(data.status === 'error'){
				ajax_loading_tip(data.status,data.msg);
			}
		}
		function fail(data){
			if(data){
				ajax_loading_tip('error',data);
			}else{
				ajax_loading_tip('error',config.lang.E01);
			}
		}
		function hash(){
			var url = config.url_tpl.replace(9999,config.page);
			history.replaceState(null,null,url);
			scroll_to(cache.post_top);
			//location.hash = cache.$post.id;
		}
		function pagenumber(){
			/** set page */
			config.page = get_next_page();
			cache.$next_number.innerHTML = config.page;
			cache.$prev_number.innerHTML = config.page;

		}
		function is_first_page(){
			return cache.$current == cache.$prev && config.page == 1;
		}
		function is_last_page(){
			return cache.$current == cache.$next && config.page == config.numpages;
		}
	}
	function init(){
		if(!window.THEME_CONFIG.theme_page_nagination_ajax)
			return false;
		ready(function(){
			page_nagi.init();
			pagi_ajax();
			img_link();
		});
	}
	module.exports.page_nagi = page_nagi;
	module.exports.init = init;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var array_merge = __webpack_require__(11);
	var click_handle = __webpack_require__(9);

	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_full_width_mode)
			return;
			
		var cache = {},
			config = {
				key : 'full-width-mode',
				lang : {
					M01 : 'Full width mode'
				}
			};
			
		config = array_merge(config, window.THEME_CONFIG.theme_full_width_mode);

		init();
		function init(){
			ready(bind);
		}
		function bind(){
			cache.$main = I('main');
			cache.$side = I('sidebar-container');
			
			if(!cache.$main || !cache.$side)
				return;
				
			if(!create_btn())
				return;
				
			cache.$btn.addEventListener(click_handle, event_click);

			if(localStorage.getItem(config.key) == 1){
				expand();
			}
		}
		function reset_media(){
			if(window.jQuery){
				jQuery(window).resize();
			}
			try{
				__webpack_require__(43).page_nagi.reset_nagi_style();
			}catch(e){}
		}
		function expand(set){
			cache.$btn.classList.remove('fa-angle-right');
			cache.$btn.classList.add('fa-angle-left');
			cache.$main.classList.add('expand');
			cache.$side.classList.add('expand');
			reset_media();
			if(set)
				localStorage.setItem(config.key,1);
		}
		function reset(){
			cache.$btn.classList.remove('fa-angle-left');
			cache.$btn.classList.add('fa-angle-right');
			cache.$main.classList.remove('expand');
			cache.$side.classList.remove('expand');
			reset_media();
			localStorage.removeItem(config.key);
		}
		function is_expanded(){
			return cache.$main.classList.contains('expand');
		}
		function event_click(){
			if(is_expanded()){
				reset();
			}else{
				expand(true);
			}
		}
		function create_btn(){
			var $container = document.querySelector('.singular-post');
			if(!$container)
				return false;
			var $i = document.createElement('i');
			$i.id = 'full-width-mode';
			$i.title = config.lang.M01;
			$i.setAttribute('class','fa fa-angle-right fa-2x');
			$container && $container.appendChild($i);
			cache.$btn = $i;
			return true;
		}
		function I(e){
			return document.getElementById(e);
		}
	}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	module.exports = function(){
		'use strict';

		ready(bdjs);
		
		function bdjs(){
			var $bdboxes = document.querySelectorAll('.bdsharebuttonbox');
			if(!$bdboxes[0])
				return false;
				
			var _bd_share_config = {
				common: {
					bdSnsKey: {},
					dText: false,
					bdMiniList: false,
					bdMini: 2,
					bdPic: false,
					bdStyle: false,
					bdSize: 16
				},
				share: [],
				//image: {},
				selectShare: false
			};
				
			for(var i = 0, len = $bdboxes.length; i < len; i++){
				var tar_id = 'bdshare_tag_' + i,
					share_json = JSON.parse($bdboxes[i].getAttribute('data-bdshare').replace(/\'/g,'"'));
				share_json.bdSign = 'off';
				share_json.tag = tar_id;
				$bdboxes[i].setAttribute('data-tag',tar_id);
				_bd_share_config.share.push(share_json);
				
			};
	 		window._bd_share_config = _bd_share_config;
			setTimeout(function(){
				var $js = document.createElement('script');
				$js.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~ (-new Date() / 36e5);		
				$js.async = true;
				document.getElementsByTagName('head')[0].appendChild($js);
			},5000);
		}
	}

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);

	module.exports = function(){
		'use strict';
		
		if(!window.THEME_CONFIG.theme_post_views)
			return;
			
		function set_views(){
			if(window.DYNAMIC_REQUEST && window.DYNAMIC_REQUEST.theme_post_views){
				for(var k in window.DYNAMIC_REQUEST.theme_post_views){
					var $view = document.getElementById('post-views-number-' + k);
					if($view)
						$view.innerHTML = window.DYNAMIC_REQUEST.theme_post_views[k];
				}
			}
		}
		ready(set_views);
	}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var validate = __webpack_require__(48);
	var array_merge = __webpack_require__(11);

	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_custom_sign)
			return;
		
		var cache = {},
			config = {
				fm_login_id : 'fm-sign-login',
				fm_reg_id : 'fm-sign-register',
				fm_recover_id : 'fm-sign-recover',
				fm_reset_id : 'fm-sign-reset',
				process_url : ''
			};
		config = array_merge(config, window.THEME_CONFIG.theme_custom_sign);
		
		function init(){
			ready(function(){
				sign.init();
				recover.init();
				reset.init();
			});
		};
		/** 
		 * reset
		 */
		var reset = {
			init : function(){
				cache.$fm_reset = I(config.fm_reset_id);
				if(!cache.$fm_reset)
					return false;
				var m = new validate();
					m.process_url = config.process_url;
					m.done = function(data){
						if(data && data.status === 'success'){
							location.href = data.redirect;
						}
					};
					m.loading_tx = window.THEME_CONFIG.lang.M01;
					m.error_tx = window.THEME_CONFIG.lang.E01;
					m.$fm = cache.$fm_reset;
					m.init();
			}
		};
		/** 
		 * recover
		 */
		var recover = {
			init : function(){
				cache.$fm_recover = I(config.fm_recover_id);
					
				if(!cache.$fm_recover)
					return false;
				
				var m = new validate();
					m.process_url = config.process_url;
					m.loading_tx = window.THEME_CONFIG.lang.M01;
					m.error_tx = window.THEME_CONFIG.lang.E01;
					m.$fm = cache.$fm_recover;
					m.init();
			}
		};
		var sign = {
			init : function(){
				cache.$fm_login = I(config.fm_login_id);
				cache.$fm_reg = I(config.fm_reg_id);
				if(cache.$fm_login){

					var m = new validate();
						m.process_url = config.process_url;
						m.done = function(data){
							if(data && data.status === 'success'){
								location.hash = '';
								location.reload();
							}
						};
						m.loading_tx = window.THEME_CONFIG.lang.M01;
						m.error_tx = window.THEME_CONFIG.lang.E01;
						m.$fm = cache.$fm_login;
						m.init();
				}else if(cache.$fm_reg){
					var m = new validate();
						m.process_url = config.process_url;
						m.done = function(data){
							if(data && data.status === 'success'){
								location.hash = '';
								location.reload();
							}
						};
						m.loading_tx = window.THEME_CONFIG.lang.M01;
						m.error_tx = window.THEME_CONFIG.lang.E01;
						m.$fm = cache.$fm_reg;
						m.init();
				}
			}
		};
		function I(e){
			return document.getElementById(e);
		}

		init();
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * validate
	 *
	 * @return object
	 * @version 1.0.1
	 */
	var ajax_loading_tip = __webpack_require__(7);
	module.exports = function(){
		/** config */
		this.process_url = false;
		this.loading_tx = false;
		this.error_tx = 'Sorry, the server is busy, please try again later.';
		this.$fm = false;
		this.done_close = false;

		this.done = function(){};
		this.before = function(){};
		this.always = function(){};
		this.fail = function(){};
		
		var that = this,
			cache = {};
		this.init = function(){
			that.$fm.addEventListener('submit',ajax.init,false);
		};
		
		var ajax = {
			init : function(){
				
				if(!cache.$submit){
					cache.$submit = that.$fm.querySelector('.submit');
					cache.submit_ori_tx = cache.$submit.innerHTML;
					cache.submit_loading_tx = that.loading_tx ? that.loading_tx : cache.$submit.getAttribute('data-loading-text');
				}
				cache.$submit.innerHTML = cache.submit_loading_tx;
				
				cache.$submit.setAttribute('disabled',true);
				ajax_loading_tip('loading',cache.submit_loading_tx);

				var xhr = new XMLHttpRequest();
				fd = new FormData(that.$fm);
				fd.append('theme-nonce', window.DYNAMIC_REQUEST['theme-nonce']);
				
				/** callback before */
				that.before(fd);
				
				xhr.open('POST',that.process_url);
				xhr.send(fd);
				xhr.onload = function(){
					if(xhr.status >= 200 && xhr.status < 400){
						var data;
						try{data = JSON.parse(xhr.responseText)}catch(e){data = xhr.responseText}
						
						if(data && data.status){
							if(data.status === 'success'){
								if(that.done_close){
									ajax_loading_tip(data.status,data.msg,that.done_close);
								}else{
									ajax_loading_tip(data.status,data.msg);
								}
							}else if(data.status === 'error'){
								ajax_loading_tip(data.status,data.msg);
								if(data.code && data.code.indexOf('pwd') !== -1){
									var $pwd = that.$fm.querySelector('input[type=password]');
									$pwd && $pwd.select();
								}else if(data.code && data.code.indexOf('email') !== -1){
									var $email = that.$fm.querySelector('input[type=email]');
									$email && $email.select();
								}
								cache.$submit.removeAttribute('disabled');
							}
							cache.$submit.innerHTML = cache.submit_ori_tx;
							that.done(data);
						}else{
							ajax_loading_tip('error',that.error_tx);
							cache.$submit.removeAttribute('disabled');
							cache.$submit.innerHTML = cache.submit_ori_tx;
							that.fail(data);
						}
					that.always(data);
					}
				};/** onload */

				xhr.onerror = function(){
					ajax_loading_tip('error',that.error_tx);
					cache.$submit.removeAttribute('disabled');
					cache.$submit.innerHTML = cache.submit_ori_tx;
					that.fail();
				}
			}
		};
		return this;
	};

/***/ }
/******/ ]);