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

	/** theme */
	__webpack_require__(28)();
	__webpack_require__(30)();
	__webpack_require__(31)();
	__webpack_require__(32)();
	__webpack_require__(33)();
	__webpack_require__(34)();
	__webpack_require__(35)();
	__webpack_require__(36)();

	/** addons common*/
	__webpack_require__(37)();
	__webpack_require__(38)();


	/** addons custom */
	__webpack_require__(39)();
	__webpack_require__(40)();
	__webpack_require__(51)();
	__webpack_require__(44)();
	__webpack_require__(45).init();
	__webpack_require__(46)();
	__webpack_require__(47)();
	__webpack_require__(48)();


	/** logged */
	__webpack_require__(53)();
	__webpack_require__(54)();
	__webpack_require__(55)();
	__webpack_require__(56)();
	__webpack_require__(58)();
	__webpack_require__(59)();
	__webpack_require__(27)();


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
/* 14 */,
/* 15 */
/***/ function(module, exports) {

	module.exports = function(s) {
		var t = document.createElement('div');
		t.innerHTML = s;
		return t.firstChild;
	};

/***/ },
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */
/***/ function(module, exports) {

	module.exports = function(obj){
		return Object.keys(obj).map(function(key){ 
			return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]); 
		}).join('&');
	};

/***/ },
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var paseHTML = __webpack_require__(15);
	module.exports = function(){
		'use strict';

		var cache = {};

		ready(bind);

		function bind(){
			cache.$container = document.getElementById('theme_custom_storage-container');
			if(!cache.$container)
				return;

			cache.$control_container = document.getElementById('theme_custom_storage-control');

			cache.$add = cache.$control_container.querySelector('.add');
			if(!cache.$add)
				return;
				
			cache.$items = cache.$container.querySelectorAll('.item');
			cache.$dels = cache.$container.querySelectorAll('.del');
			cache.len = cache.$items.length;

			bind_add();
			if(cache.len > 0){
				for(var i = 0; i < cache.len; i++){
					/** del */
					bind_del(cache.$dels[i]);
				}
			}
		}
		function bind_add(){
			cache.$add.addEventListener('click',function(){
				var tpl = cache.$container.getAttribute('data-tpl').replace(/\%placeholder\%/g, +new Date()),
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
			$del.addEventListener('click', function() {
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var scroll_to = __webpack_require__(29);
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
/* 29 */
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
/* 30 */
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
/* 31 */
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
/* 32 */
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
/* 33 */
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
/* 34 */
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
/* 35 */
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
/* 36 */
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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var array_merge = __webpack_require__(11);
	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var parseHTML = __webpack_require__(15);

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
/* 38 */
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
/* 39 */
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var scroll_to = __webpack_require__(29);
	var get_ele_left = __webpack_require__(41);
	var get_ele_top = __webpack_require__(5);
	var is_mobile = __webpack_require__(42);
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
/* 41 */
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
/* 42 */
/***/ function(module, exports) {

	module.exports = /Mobi/.test(navigator.userAgent);

/***/ },
/* 43 */,
/* 44 */
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
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);
	var scroll_to = __webpack_require__(29);
	var window_scroll = __webpack_require__(4);
	var ready = __webpack_require__(2);
	var click_handle = __webpack_require__(9);
	var get_ele_top = __webpack_require__(5);
	var get_ele_left = __webpack_require__(41);

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
/* 46 */
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
				__webpack_require__(45).page_nagi.reset_nagi_style();
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
/* 47 */
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
/* 48 */
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
/* 49 */,
/* 50 */
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

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var array_merge = __webpack_require__(11);
	var array_replace = __webpack_require__(52);
	var ajax_loading_tip = __webpack_require__(7);
	var status_tip = __webpack_require__(8);
	var param = __webpack_require__(20);
	var validate = __webpack_require__(50);

	module.exports = function(){
		'use strict';
		if(!window.THEME_CONFIG.theme_custom_collection)
			return;
			
		var cache = {},
			config = {
				process_url : '',
				tpl_input : '',
				tpl_preview : '',
				min_posts : 5,
				max_posts : 10,
				lang : {
					M01 : 'Loading, please wait...',
					M02 : 'A item has been deleted.',
					M03 : 'Getting post data, please wait...',
					M04 : 'Previewing, please wait...',
					E01 : 'Sorry, server is busy now, can not respond your request, please try again later.',
					E02 : 'Sorry, the minimum number of posts is %d.',
					E03 : 'Sorry, the maximum number of posts is %d.',
					E04 : 'Sorry, the post id must be number, please correct it.'
				}
			};
		config = array_merge(config, window.THEME_CONFIG.theme_custom_collection);
		
		ready(init);
		
		function init(){
			upload();
			list();
			preview();
			post();
		}
		function get_posts_count(){
			return document.querySelectorAll('.clt-list').length;
		}
		function preview(){
			var $preview = I('clt-preview');
			cache.$preview_container = I('clt-preview-container');
			
			if(!$preview)
				return false;

			function event_preview_click(e){
				if(e)
					e.preventDefault();
				var lists_count = get_posts_count();
				
				if(lists_count < config.min_posts){
					ajax_loading_tip('error',config.lang.E02,3);
					return false;
				}else if(lists_count > config.max_posts){
					ajax_loading_tip('error',config.lang.E03,3);
					return false;
				}

				show_preview();
			}
			$preview.addEventListener('click',event_preview_click);

			function show_preview(){
				var $lists = document.querySelectorAll('.clt-list'),
					tpl = '';
				/**
				 * loop lists
				 */
				for(var i = 0, len = $lists.length; i < len; i++){
					/**
					 * check empty input
					 */
					var $requires = $lists[i].querySelectorAll('[required]');
					/**
					 * loop requires
					 */
					for(var j = 0, l = $requires.length; j < l; j++){
						if($requires[j].value.trim() === ''){
							ajax_loading_tip('error',$requires[j].getAttribute('title'),3);
							$requires[j].focus();
							return false;
						}
					}
					var id = $lists[i].getAttribute('data-id'),
						$imgs = $lists[i].querySelectorAll('img'),
						thumbnail_url = $imgs[$imgs.length - 1].src;

					/**
					 * create tpl
					 */
					tpl += array_replace(
						config.tpl_preview,
						[
							'%hash%',
							'%title%',
							'%thumbnail%',
							'%content%'
						],
						[
							id,
							I('clt-list-post-title-' + id).value,
							thumbnail_url,
							I('clt-list-post-content-' + id).value
						]
					);
					//console.log(config.tpl_preview);
				}
				//console.log(tpl);
				preview_done(tpl);

			}
			function preview_done(tpl){
				cache.$preview_container.innerHTML = tpl;
				//location.hash = '#' + cache.$preview_container.id;
			}

		}
		function list(){
			var _cache = {},
				$lists = document.querySelectorAll('.clt-list');
				
			if(!$lists[0])
				return false;
				
			_cache.$add = I('clt-add-post');
			_cache.$container = I('clt-lists-container');
			
				
			/**
			 * bind the lsits
			 */
			for(var i = 0, len = $lists.length; i < len; i++){
				bind_list($lists[i]);
			}
			/**
			 * bind the add list btn
			 */
			add_list();
			/**
			 * action add new psot
			 */
			function add_list(){
				var helper = function(e){
					if(e)
						e.preventDefault();
					/** too many posts */
					if(get_posts_count() >= config.max_posts){
						ajax_loading_tip('error',config.lang.E03,3);
						return false;
					}
					var rand = Date.now(),
						$tmp = document.createElement('div'),
						$new_list;
						
					$tmp.innerHTML = get_input_tpl(rand);
					$new_list = $tmp.firstChild;

					$new_list.classList.add('delete');
					_cache.$container.appendChild($new_list);
					/** bind list */
					bind_list($new_list);
					
					setTimeout(function(){
						$new_list.classList.remove('delete');
					},1);

				};
				_cache.$add.addEventListener('click', helper);
			}
			function get_input_tpl(placeholder){
				return config.tpl_input.replace(/%placeholder%/g,placeholder);
			}

			
			/**
			 * bind list
			 */
			function bind_list($list){
				if(!$list)
					return false;

				var placeholder = $list.getAttribute('data-id');
				
				/** bind delete action */
				del(placeholder);
				
				/** bind post id input blur action */
				show_post(placeholder);
				
				/**
				 * delete action
				 */
				function del(placeholder){
					var helper = function(e){
						if(e)
							e.preventDefault();
						/** not enough posts */
						if(get_posts_count() <= config.min_posts){
							ajax_loading_tip('error',config.lang.E02,3);
							return false;
						}
						$list.classList.add('delete');
						setTimeout(function(){
							$list.parentNode.removeChild($list);
						},500);
					};
					I('clt-list-del-' + placeholder).addEventListener('click', helper);;
				}

				/**
				 * get post data action
				 */
				function show_post(placeholder){
					post_id_blur();
					function post_id_blur(){
						var $post_id = I('clt-list-post-id-' + placeholder),
							helper = function(evt){
								evt.preventDefault();
								
								var post_id = this.value;
								if(post_id.trim() === '')
									return false;

								if(isNaN(post_id.trim()) === true){
									this.select();
									ajax_loading_tip('error',config.lang.E04,3);
									return false;
								}
								/**
								 * if no exist cache, get data from server
								 */
								if(!get_post_cache_data(post_id)){
									ajax(post_id,placeholder,this);
								/**
								 * get post data from cache
								 */
								}else{
									set_post_data(post_id,placeholder);
								}
							}
						$post_id.addEventListener('change',helper,false);
						$post_id.addEventListener('blur',helper,false);
					}
					function ajax(post_id,placeholder,$post_id){
						/**
						 * loading tip
						 */
						ajax_loading_tip('loading',config.lang.M03);
						
						var xhr = new XMLHttpRequest(),
							ajax_data = {
								'type' : 'get-post',
								'post-id' : post_id,
								'theme-nonce' : window.DYNAMIC_REQUEST['theme-nonce']
							};
						xhr.open('GET',config.process_url + '&' + param(ajax_data));
						xhr.send();
						xhr.onload = function(){
							if(xhr.status >= 200 && xhr.status < 400){
								var data;
								try{data = JSON.parse(xhr.responseText)}catch(err){data = xhr.responseText}
								done(data);
							}else{
								ajax_loading_tip('error',config.lang.E01);
							}
						};
						xhr.onerror = function(){
							ajax_loading_tip('error',config.lang.E01);
						};
						function done(data){
							if(data && data.status === 'success'){
								/** set cache */
								set_post_cache(post_id,data);
								/** set to html */
								set_post_data(post_id,placeholder);
								/** tip */
								ajax_loading_tip(data.status,data.msg,3);
							}else if(data && data.status === 'error'){
								/** set cache */
								set_post_cache(post_id,data);
								/** focus post id */
								$post_id.select();
								/** tip */
								ajax_loading_tip(data.status,data.msg,3);
							}else{
								ajax_loading_tip('error',data);
							}
						}
					}
					/**
					 * set post data to cache
					 */
					function set_post_cache(post_id,data){
						if(cache.posts && cache.posts[post_id])
							return false;
							
						if(!cache.posts)
							cache.posts = {};

						cache.posts[post_id] = {
							'thumbnail' : data.thumbnail,
							'title' : data.title,
							'excerpt' : data.excerpt
						};
					}
					function get_post_cache_data(post_id,key){
						if(!cache.posts || !cache.posts[post_id])
							return false;
							
						if(!key)
							return cache.posts[post_id];

						return cache.posts[post_id][key];
							
					}
					/**
					 * set post data to html
					 */
					function set_post_data(post_id,placeholder){
						var $content = I('clt-list-post-content-' + placeholder),
							$thumbnail = I('clt-list-thumbnail-' + placeholder),
							$thumbnail_url = I('clt-list-thumbnail-url-' + placeholder);
						
						if(cache.posts[post_id].title)
							I('clt-list-post-title-' + placeholder).value = cache.posts[post_id].title;

						if(cache.posts[post_id].excerpt && $content.value.trim() === '')
							$content.value = cache.posts[post_id].excerpt;
							
						if(cache.posts[post_id].thumbnail){
							$thumbnail.src = cache.posts[post_id].thumbnail.url;
							$thumbnail_url.value = cache.posts[post_id].thumbnail.url;
						}
					}/** end set_post_data */
				}/** end show_post */
			}/** end bind_list */
		}/** end list */
		function post(){
			var _cache = {};
			_cache.$fm = I('fm-clt');

			if(!_cache.$fm)
				return false;

			var sm = new validate();
			sm.$fm = _cache.$fm;
			sm.process_url = config.process_url;
			sm.error_tx = config.lang.E01;
			sm.init();
		}
		function upload(){
			var $file = I('clt-file'),
				_cache = {};

			_cache.$cover = I('clt-cover');
			_cache.$progress = I('clt-file-progress');
			_cache.$tip = I('clt-file-tip');
			_cache.$progress_bar = I('clt-file-progress-bar');
			_cache.$progress_tx = I('clt-file-progress-tx');
			_cache.$thumbnail_id = I('clt-thumbnail-id');
			_cache.$file_area = I('clt-file-area');

			if(!$file)
				return false;

			$file.addEventListener('change',file_select);
			$file.addEventListener('drop',file_drop);
			$file.addEventListener('dragover',file_select);

			function file_drop(e){
				e.stopPropagation();
				e.preventDefault();
				_cache.files = e.dataTransfer.files;
				file_upload(_cache.files[0]);
			}
			function file_select(e){
				e.stopPropagation();
				e.preventDefault();
				_cache.files = e.target.files.length ? e.target.files : e.originalEvent.dataTransfer.files;
				file_upload(_cache.files[0]);
			}
			function file_upload(file){
				var	reader = new FileReader();
				reader.onload = function (e) {
					submission(file);
				};
				reader.readAsDataURL(file);
			}
			function submission(file){

				/** loading tip */
				progress_tip('loading',config.lang.M01);
				
				var fd = new FormData(),
					xhr = new XMLHttpRequest();

				fd.append('type','add-cover');
				fd.append('theme-nonce',window.DYNAMIC_REQUEST['theme-nonce']);
				fd.append('img',file);
				xhr.open('post',config.process_url);
				xhr.send(fd);
				xhr.upload.onprogress = function(e){
					if (e.lengthComputable) {
						var percent = e.loaded / e.total * 100;		
						_cache.$progress_bar.style.width = percent + '%';
					}
				};
				xhr.onload = function(){
					if (xhr.status >= 200 && xhr.status < 400) {
						var data;
						try{data = JSON.parse(xhr.responseText)}catch(err){data = xhr.responseText}
						if(data && data.status === 'success'){
							_cache.$cover.src = data.thumbnail.url;
							_cache.$thumbnail_id.value = data['attach-id'];
							ajax_loading_tip(data.status,data.msg,3);
						}else if(data && data.status === 'error'){
							ajax_loading_tip(data.status,data.msg);
						}else{
							ajax_loading_tip('error',data);
						}
					}else{
						ajax_loading_tip('error',config.lang.E01);
					}
					progress_tip('hide');
				};
				xhr.onerror = function(){
					ajax_loading_tip('error',config.lang.E01);
				};
			}
			function progress_tip(t,s){
				if(t === 'hide'){
					_cache.$progress.style.display = 'none';
					_cache.$file_area.style.display = 'block';
					return false;
				}
				_cache.$file_area.style.display = 'none'
				_cache.$progress.style.display = 'block';
				_cache.$progress_bar.style.width = '10%';
				_cache.$progress_tx.innerHTML = status_tip(t,s);
					
			}
		}
		function I(e){
			return document.getElementById(e);
		}
	}

/***/ },
/* 52 */
/***/ function(module, exports) {

	/**
	 * replace array
	 * @param string str The string ready replace
	 * @param string find Search string
	 * @param string replace Replace string
	 */
	module.exports = function(str,find,replace){
		var regex;
		for (var i = 0, len = find.length; i < len; i++) {
			regex = new RegExp(find[i], 'g');
			str = str.replace(regex, replace[i]);
		}
		return str;
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var parseHTML = __webpack_require__(15);
	var param = __webpack_require__(20);
	var array_merge = __webpack_require__(11);

	module.exports = function(){
		'use strict';
		if(!window.THEME_CONFIG.theme_custom_pm)
			return;
			
		var config = {
			lang : {
				M01 : 'Loading, please wait...',
				M02 : 'Enter to send P.M.',
				M03 : 'P.M. content',
				M04 : 'Send P.M.',
				M05 : 'Hello, I am %name%, welcome to chat with me what do you want.',
				M06 : 'P.M. is sending, please wait...',
				E01 : 'Sorry, server is busy now, can not respond your request, please try again later.'
			},
			uid : 'new',
			my_uid : '',
			userdata : {}
			
		},
		cache = {};
		
		config = array_merge(config,window.THEME_CONFIG.theme_custom_pm);
		
		/** init */
		init();
		function init(){
			ready(function(){
				tab_bind();
				if(!cache.$tabs_container)
					return false;
				new_tab_bind();
				comet();
				preset_receiver_bind();
			});
		};
		
		function tab_bind(){
			cache.$tabs_container = I('pm-tab');
			if(!cache.$tabs_container)
				return false;
			cache.$dialogs_container = document.querySelector('.pm-dialog-container');
			cache.$tmp_dialogs = document.querySelectorAll('.pm-dialog');
			cache.$tmp_tabs = cache.$tabs_container.querySelectorAll('a');
			cache.$dialog_new = I('pm-dialog-new');
			cache.$dialog_new_uid = I('pm-dialog-content-new');
			cache.$tabs = {};
			cache.$dialogs = {};


			/** hide loading tip */
			var $tip = I('pm-loading-tip');
			$tip.parentNode.removeChild($tip);
			
			/** show container */
			I('pm-container').style.display = 'block';
			
			cache.tab_count = cache.$tmp_tabs.length;
			
			for(var i=0; i<cache.tab_count; i++){
				var uid = cache.$tmp_tabs[i].getAttribute('data-uid'),
					$close = cache.$tmp_tabs[i].querySelector('.close');
				cache.$tabs[uid] = cache.$tmp_tabs[i];
				cache.$dialogs[uid] = cache.$tmp_dialogs[i];
				/** set user data */
				if(uid !== 'new'){
					config.userdata[uid] = {
						name : cache.$tabs[uid].querySelector('.author').innerHTML,
						avatar : cache.$tabs[uid].querySelector('img').src,
						url : cache.$tabs[uid].getAttribute('data-url')
					};
				}
				/** scroll bottom */
				scroll_dialog_bottom(uid);
				
				/** bind tab event */
				event_switch_tab(uid);
				
				/** bind close click */
				if($close)
					$close.addEventListener('click',event_close_click);

				/** bind msg submit */
				if(uid !== 'new')
					cache.$dialogs[uid].addEventListener('submit',event_submit_send_pm);
			}
			for(var i=0; i<cache.tab_count; i++){
				var uid = cache.$tmp_tabs[i].getAttribute('data-uid');
				/** set current tab */
				if(uid === config.uid){
					tab_toggle(uid);
					focus_content(uid);
					cache.$current_tab = cache.$tabs[uid];
				}
			}
		}
		function preset_receiver_bind(){
			/** check preset receiver */
			cache.preset_uid = get_hash_uid();
			if(!cache.preset_uid)
				return;
				
			if(!cache.$tabs[cache.preset_uid]){
				get_uid_from_server(cache.preset_uid);
			}else{
				tab_switch_it(cache.preset_uid);
			}
			
		}
		function get_hash_uid(){
			return location.hash && parseInt(location.hash.replace('#',''));
		}
		function event_switch_tab(uid){
			function helper(e){
				e.preventDefault();
				e.stopPropagation();
				tab_toggle(uid);
				focus_content(uid);
				show_new_msg(uid,'hide');
			}
			cache.$tabs[uid].addEventListener('click',helper);
		}
		function scroll_dialog_bottom(uid){
			var $list = cache.$dialogs[uid].querySelector('.pm-dialog-list');
			if($list)
				$list.scrollTop = $list.scrollHeight;
		}
		function is_current_tab(uid){
			return cache.$current_tab.getAttribute('uid') === uid;
		}
		function focus_content(uid){
			//console.log(I('pm-dialog-content-' + uid));
			I('pm-dialog-content-' + uid).focus();
		}
		function tab_toggle(uid){
			/** set current uid */
			config.uid = uid;
			for(var i in cache.$tabs){
				/** if current tab */
				//console.log(i , uid);
				if(i == uid){
					//console.log(cache.$tabs[uid]);
					/** display target dialog */
					cache.$dialogs[uid].style.display = 'block';
					/** add class for target tab */
					cache.$tabs[uid].classList.add('active');
					continue;
				}
				/** remove class for old tab */
				cache.$tabs[i].classList.remove('active');
				/** add class for dialog */
				cache.$dialogs[i].style.display = 'none';
			}
		}
		function tab_switch_it(uid){
			/** define tab nav */
			if(!cache.$tabs[uid]){
				cache.$tabs[uid] = I('pm-tab-' + uid);
			}
			/** if not current tab, hide others tab but the target tab */
			if(!is_current_tab(uid)){
				tab_toggle(uid)
			}
				
			/** focus */
			focus_content(uid);
		
		}
		function new_tab_bind(){
			cache.$dialog_new.addEventListener('submit', event_submit_new_tab);
		}
		function event_submit_new_tab(){
			var uid = cache.$dialog_new_uid.value;
			
			/** check uid is cache */
			if(cache.$dialogs[uid]){
				tab_switch_it(uid);
				return false;
			}
			get_uid_from_server(uid);
			
		}
		function create_tab(uid){
			cache.$tabs[uid] = parseHTML(get_tpl_tab(uid));
			cache.$tabs_container.appendChild(cache.$tabs[uid]);
			cache.$tmp_tabs = cache.$tabs_container.querySelectorAll('a');
		}
		function create_close(uid){
			var $close = parseHTML(get_tpl_close());
			$close.addEventListener('click',event_close_click);
			cache.$tabs[uid].appendChild($close);
		}
		function create_dialog(uid,msg){
			cache.$dialogs[uid] = parseHTML(get_tpl_dialog(uid,msg));
			cache.$dialogs_container.appendChild(cache.$dialogs[uid]);
		}
		function get_uid_from_server(uid){
			ajax_loading_tip('loading',config.lang.M01);
			
			var xhr = new XMLHttpRequest();
			xhr.open('get',config.process_url + '&type=get-userdata&uid=' + uid + '&theme-nonce=' + window.DYNAMIC_REQUEST['theme-nonce']);
			xhr.send();
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					try{data=JSON.parse(xhr.responseText)}catch(err){data=xhr.responseText}
					done(data);
				}else{
					fail();
				}
			};
			xhr.onerror = function(){
				ajax_loading_tip('error',config.lang.E01);
				cache.$dialog_new_uid.select();
			};
			function done(data){
				if(data.status === 'success'){
					/** set userdata cache */
					config.userdata[uid] = {
						avatar : data.avatar,
						name : data.name,
						url : data.url
					};
					/** tip */
					ajax_loading_tip(data.status,data.msg,3);
					
					/** clear new uid value */
					//cache.$dialog_new_uid.value = '';
					
					/** create tab */
					create_tab(uid);

					/** create close */
					create_close(uid);
					
					/** create init content */
					if(!data.histories){
						/** create dialog */
						//console.log(get_tpl_msg(uid,config.lang.M05.replace('%name%', config.userdata[uid].name)));
						create_dialog(uid,get_tpl_msg(uid,config.lang.M05.replace('%name%', config.userdata[uid].name)));
					}else{
						/** create dialog */
						create_dialog(uid,get_histories(data.histories));
					}
					
					/** set current tab */
					cache.$current_tab = cache.$tabs[uid];
					
					/** update count */
					cache.tab_count++;
					
					/** add click event */
					event_switch_tab(uid);

					/** switch new tab */
					tab_switch_it(uid);

					/** bind submit event */
					cache.$dialogs[uid].addEventListener('submit',event_submit_send_pm);
					
				}else if(data.status === 'error'){
					ajax_loading_tip(data.status,data.msg,3);
					cache.$dialog_new_uid.select();
				}else{
					ajax_loading_tip('error',data);
					cache.$dialog_new_uid.select();
				}
			}
		}
		function event_submit_send_pm(e){
			e.preventDefault();
			
			/** set disabled */
			var $submit = cache.$dialogs[config.uid].querySelector('button[type="submit"]');
			$submit.setAttribute('disabled',true);
			
			/** tip */
			ajax_loading_tip('loading',config.lang.M06);

			/** ajax start */
			var xhr = new XMLHttpRequest(),
				fd = new FormData(this);
			fd.append('type','send');
			fd.append('theme-nonce',window.DYNAMIC_REQUEST['theme-nonce']);
			fd.append('uid',config.uid);
			xhr.open('post',config.process_url);
			xhr.send(fd);
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					try{data=JSON.parse(xhr.responseText)}catch(err){data=xhr.responseText}
					done(data);
				}else{
					fail();
				}
			};
			xhr.onerror = fail;
			function done(data){
				if(data.status && data.status === 'success'){
					ajax_loading_tip(data.status,data.msg,3);
					focus_clear_input(config.uid);
				}else if(data.status && data.status === 'error'){
					ajax_loading_tip(data.status,data.msg,5);
				}else{
					ajax_loading_tip('error',data);
				}
				focus_content(config.uid);
				
				/** remove disabled */
				$submit.removeAttribute('disabled');
			}
			
			function fail(){
				ajax_loading_tip('error',config.lang.E01);
				focus_content(config.uid);
				
				/** remove disabled */
				$submit.removeAttribute('disabled');
			}
		}
		function event_close_click(e){
			e.preventDefault();
			e.stopPropagation();
			var $parent = this.parentNode,
				uid = $parent.getAttribute('data-uid');

			if(config.uid == uid){
				/** switch to new */
				tab_switch_it('new');
				
				/** set current tab */
				cache.$current_tab = cache.$tabs['new'];
			}
			
			/** update count */
			cache.tab_count--;

			/** remove tab */
			$parent.parentNode.removeChild($parent);

			/** remove dialog */
			cache.$dialogs[uid].parentNode.removeChild(cache.$dialogs[uid]);
			
			/** delete obj */
			delete cache.$tabs[uid];
			delete cache.$dialogs[uid];
			
			/** send remove uid to server */
			var xhr = new XMLHttpRequest(),
				fd = new FormData();
			xhr.open('post',config.process_url);
			fd.append('uid',uid);
			fd.append('theme-nonce',window.DYNAMIC_REQUEST['theme-nonce']);
			fd.append('type','remove-dialog');
			xhr.send(fd);
			
		}
		function insert_dialog_msg(uid,msg){
			var target_uid = uid;
			if(uid === 'me')
				target_uid = config.uid;

			var $dialog_list = cache.$dialogs[target_uid].querySelector('.pm-dialog-list');
			$dialog_list.appendChild(parseHTML(get_tpl_msg(uid,msg)));
			$dialog_list.scrollTop = $dialog_list.scrollHeight;
		}
		function get_histories(histories){
			var content = '';
			for(var i in histories){
				content += get_tpl_msg(histories[i]);
			}
			return content;
		}
		function get_tpl_tab(uid){
			return '<a id="pm-tab-' + uid + '" href="javascript:;" data-uid="' + uid + '" title="' + config.userdata[uid].name + '">' + 
				'<img src="' + config.userdata[uid].avatar + '" alt="avatar" class="avatar" width="24" height="24"> ' + 
					'<span class="author">' + config.userdata[uid].name + '</span>' + 
			'</a>';
		}
		function get_tpl_close(){
			return '<b class="close">&times;</b>'
		}
		function get_tpl_dialog(uid, msgs){
			if(!msgs)
				msgs = '';
			return '<form action="javascript:;" id="pm-dialog-' + uid + '" class="pm-dialog">' + 
				'<div class="form-group pm-dialog-list">' + 
					msgs + 
				'</div>' + 
				'<div class="form-group">' + 
					'<input type="text" id="pm-dialog-content-' + uid + '" name="content" class="pm-dialog-conteng form-control" placeholder="' + config.lang.M02 + '" required title="' + config.lang.M03 + '">' + 
				'</div>' + 
				'<div class="form-group">' + 
					'<button class="btn btn-success btn-block" type="submit"><i class="fa fa-check"></i>&nbsp;' + config.lang.M04 + '</button>' + 
				'</div>' + 
			'</form>';
		}
		function get_tpl_msg(uid,msg){
			var d = new Date(),
				d = date_format(d,'yyyy/MM/dd hh:mm:ss'),
				sender = uid === 'me' ? 'me' : 'sender';

			return '<section class="pm-dialog-' + sender + '">' + 
				'<div class="pm-dialog-bg">' + 
					'<h4>' + 
						'<span class="name"><a href="' + config.userdata[uid].url + '" target="_blank">' + config.userdata[uid].name + '</a></span> ' + 
						'<span class="date"> ' + d + ' </span>' + 
					'</h4>' + 
					'<div class="media-content">' + msg + '</div>' + 
				'</div>' + 
			'</section>';
		}
		function comet(){
			var xhr = new XMLHttpRequest();
			if(!cache.timestamp)
				cache.timestamp = window.DYNAMIC_REQUEST['theme_custom_pm']['timestamp'];
			xhr.open('get',config.process_url + '&' + param({
				type : 'comet',
				'theme-nonce' : window.DYNAMIC_REQUEST['theme-nonce'],
				timestamp : cache.timestamp
			}));
			xhr.send();
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					try{data=JSON.parse(xhr.responseText)}catch(err){data=xhr.responseText}
					done(data);
				}else{
					fail();
				}
			};
			xhr.onerror = fail;
			function done(data){
				/** have new pm */
				if(data && data.status === 'success'){
					var author_uid = data.pm.pm_author,
						receiver_uid = data.pm.pm_receiver;
					cache.timestamp = data.timestamp;
					/** author is me msg */
					if(author_uid == config.my_uid && cache.$dialogs[receiver_uid]){
						//console.log('fuck');
						/** insert msg */
						insert_dialog_msg('me',data.pm.pm_content);
						/** clear current input content */
						focus_clear_input(receiver_uid);
					/** receiver is me */
					}else{
						/** set userdata */
						if(!config.userdata[author_uid]){
							config.userdata[author_uid] = {
								name : data.pm.pm_author_name,
								avatar : data.pm.pm_author_avatar,
								url : data.pm.url
							};
						}
						//console.log(cache.$dialogs[author_uid]);
						/** if dialog is not in lists */
						if(!cache.$dialogs[author_uid]){
							/** create tab */
							create_tab(author_uid);

							/** create close */
							create_close(author_uid);

							/** create dialog */
							create_dialog(author_uid);
							cache.$dialogs[author_uid].style.display = 'none';
							
							/** highlight tab */
							show_new_msg(author_uid);
							
							/** update count */
							cache.tab_count++;
							
							/** add click event */
							event_switch_tab(author_uid);

							/** bind submit event */
							cache.$dialogs[author_uid].addEventListener('submit',event_submit_send_pm);
						}
						/** insert msg */
						insert_dialog_msg(author_uid,data.pm.pm_content);
						
						/** highlight tab */
						if(config.uid != author_uid){
							show_new_msg(author_uid);
						}
					}
					comet();
				}else if(data && data.status === 'error'){
					if(data.code === 'timeout'){
						comet();
					}
				}else{
					setTimeout(function(){
						comet();
					},30000);
				}
			}
			function fail(){
				setTimeout(function(){
					comet();
				},30000);
			}
		}
		function show_new_msg(uid,type){
			if(type === 'hide'){
				cache.$tabs[uid].classList.remove('new-msg');
			}else{
				cache.$tabs[uid].classList.add('new-msg');
			}
		}
		function focus_clear_input(uid){
			if(!cache.$inputs)
				cache.$inputs = {};
			if(!cache.$inputs[uid])
				cache.$inputs[uid] = I('pm-dialog-content-' + uid);
			
			cache.$inputs[uid].focus();
			cache.$inputs[uid].value = '';
		}
		function date_format(d,fmt) { //author: meizz 
		    var o = {
		        "M+": d.getMonth() + 1, //月份 
		        "d+": d.getDate(), //日 
		        "h+": d.getHours(), //小时 
		        "m+": d.getMinutes(), //分 
		        "s+": d.getSeconds(), //秒 
		        "q+": Math.floor((d.getMonth() + 3) / 3), //季度 
		        "S": d.getMilliseconds() //毫秒 
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
		}

		function I(e){
			return document.getElementById(e);
		}
	}

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var array_merge = __webpack_require__(11);
	var ajax_loading_tip = __webpack_require__(7);
	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_custom_point_bomb)
			return;
			
		var cache = {},
			config = {
				process_url : '',
				lang : {
					M01 : 'Target locking...',
					M02 : 'Bombing, please wait...'
				}
			};

		config = array_merge(config, window.THEME_CONFIG.theme_custom_point_bomb);

		function init(){
			ready(function(){
				bind();
				if(!cache.$fm_loading)
					return false;
				radio_check();
				
			});
		}

		function bind(){
			cache.$fm_loading = I('fm-bomb-loading');
			if(!cache.$fm_loading)
				return false;
			cache.$fm = I('fm-bomb');
			cache.$attacker_points = I('bomb-attacker-points');
			cache.$target = I('bomb-target');
			cache.$target_name = I('bomb-target-name');
			cache.$target_points = I('bomb-target-points');
			cache.$target_avatar = I('bomb-target-avatar');
			cache.$points = document.querySelectorAll('.bomb-points');
			
			
			if(!cache.$fm)
				return false;

			cache.$submit = cache.$fm.querySelector('.submit');
			
			cache.$fm_loading.parentNode.removeChild(cache.$fm_loading);
			cache.$fm.style.display = 'block';
			cache.$fm.addEventListener('submit', fm_submit);
			cache.$target.addEventListener('blur', get_target.bind, true);

			/**
			 * check if exists value
			 */
			if(cache.$target.value.trim() !== '' && !isNaN(cache.$target.value)){
				get_target.init(cache.$target.value);
			}
			
		}

		var get_target = {
			bind : function(){
				
				cache.target_id = cache.$target.value.trim();
				
				if(cache.target_id === '' || isNaN(cache.target_id))
					return false;

				get_target.init(cache.target_id);
				
			},
			init : function(target_id){
				/**
				 * check cache
				 */
				if(this.get_target_form_cache(target_id)){
					this.set_target(target_id);
				}else{
					this.get_target_form_server(target_id);
				}	
			},
			/**
			 * get target data from server
			 * @param int target Target user ID
			 */
			get_target_form_server : function(target_id){
				var that = this,
					xhr = new XMLHttpRequest();
				/** loding tip */
				ajax_loading_tip('loading',config.lang.M01);
				
				xhr.open('GET',config.process_url + '&type=get-target&target=' + target_id + '&theme-nonce=' + window.DYNAMIC_REQUEST['theme-nonce']);
				xhr.send();
				xhr.onload = function(){
					if(xhr.status >= 200 && xhr.status < 400){
						var data;
						try{data = JSON.parse(xhr.responseText)}catch(e){data = xhr.responseText}
						
						if(data && data.status === 'success'){
							/** set cache */
							that.set_target_cache(target_id,{
								name : data.name,
								points : data.points,
								avatar : data.avatar
							});
							
							/** set to html */
							that.set_target(target_id);
							
							/** tip */
							ajax_loading_tip(data.status,data.msg);
							
							cache.$submit.removeAttribute('disabled');
						}else if(data && data.status === 'error'){
							cache.$target.select();
							
							/** tip */
							ajax_loading_tip(data.status,data.msg);

						}else{
							ajax_loading_tip('error',data);
							cache.$target.select();
						}
					}else{
						ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
					}
				};
				xhr.onerror = function(){
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
				};
			},
			/**
			 * set target data to html
			 * @param int target Target user ID
			 */
			set_target : function(target_id){
				cache.$target_points.innerHTML = cache.users[target_id].points;
				cache.$target_name.innerHTML = cache.users[target_id].name;
				cache.$target_avatar.src = cache.users[target_id].avatar;
			},
			/**
			 * get target data from cache
			 * @param int target Target user ID
			 */
			get_target_form_cache : function(target_id){
				return cache.users && cache.users[target_id];
			},
			/**
			 * set target data to cache
			 * @param int target Target user ID
			 * @param object data Target data
			 */
			set_target_cache : function(target_id,data){
				if(!cache.users)
					cache.users = [];
				
				cache.users[target_id] = data;
			}
		};

		function radio_check(){
			function helper(e){
				active(this);
			}
			function active($radio){
				var $label = $radio.parentNode,
					$loop_label;
				for( var i = 0, len = cache.$points.length; i < len; i++ ){
					$loop_label = cache.$points[i].parentNode;
					if($loop_label.classList.contains('label-success'))
						$loop_label.classList.remove('label-success');
				}
				
				$label.classList.add('label-success');
				cache.points = parseInt($radio.value);
				
			}
			for( var i = 0, len = cache.$points.length; i < len; i++ ){
				if(cache.$points[i].checked)
					active(cache.$points[i]);
				cache.$points[i].addEventListener('change', helper);
			}
		}
		function fm_submit(e){
			e.preventDefault();
			/** tip */
			ajax_loading_tip('loading',config.lang.M02);
			cache.$submit.setAttribute('disabled',true);
			
			var xhr = new XMLHttpRequest(),
				fd = new FormData(cache.$fm);
				
			fd.append('theme-nonce',window.DYNAMIC_REQUEST['theme-nonce']);
			xhr.open('POST',config.process_url);
			xhr.send(fd);
			xhr.onload = function(){
				var data;
				try{data = JSON.parse(xhr.responseText)}catch(e){data = xhr.responseText}
				
				if(data && data.status === 'success'){
					/** get attack and target points */
					var old_attacker_points = parseInt(cache.$attacker_points.textContent.trim()),
						old_target_points = parseInt(cache.$target_points.textContent.trim());
					/**
					 * hit
					 */
					if(data.hit){
						ajax_loading_tip(data.status,data.msg);
						/** attacker points */
						cache.$attacker_points.innerHTML = old_attacker_points + '<span class="text-success">+' + cache.points + '</span>';
						setTimeout(function(){
							cache.$attacker_points.innerHTML = old_attacker_points + cache.points;
						}, 3000);
						/** target points */
						cache.$target_points.innerHTML = old_target_points + '<span class="text-danger">-' + cache.points + '</span>';
						setTimeout(function(){
							cache.$target_points.innerHTML = old_target_points - cache.points;
						}, 3000);
					/**
					 * miss
					 */
					}else{
						ajax_loading_tip('warning',data.msg);
						/** attacker points */
						var half_points = Math.round(cache.points / 2);
						
						cache.$attacker_points.innerHTML = old_attacker_points + '<span class="text-danger">-' + cache.points + '</span>';
						setTimeout(function(){
							cache.$attacker_points.innerHTML = old_attacker_points - cache.points;
						}, 3000);
						
						/** target points */
						cache.$target_points.innerHTML = old_target_points + '<span class="text-success">+' + half_points + '</span>';
						setTimeout(function(){
							cache.$target_points.innerHTML = old_target_points + half_points;
						}, 3000);
					}
					
					
				}else if(data && data.status === 'error'){
					ajax_loading_tip(data.status,data.msg);
				}else{
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
				}
				cache.$submit.removeAttribute('disabled');
			};
			xhr.onerror = function(){
				ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
				cache.$submit.removeAttribute('disabled');
			};
		}
		
		function I(s){
			return document.getElementById(s);
		}
		/** init */
		init();
		
	}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);
	var validate = __webpack_require__(50);

	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_point_lottery)
			return;

		var cache = {},
			config = {
				process_url : '',
				lang : {
					M01 : 'Results coming soon...'
				}
			};
			
		config = array_merge(config, window.THEME_CONFIG.theme_point_lottery);
		
		ready(bind);

		function bind(){
			cache.$hgihlight_point = I('modify-count');
			if(!cache.$hgihlight_point)
				return false;
			cache.$point_count = I('point-count');
			cache.$fm = I('fm-lottery');
			if(!cache.$fm)
				return false;
			submit();
		}
		function submit(){
			var vld = new validate();
			vld.process_url = config.process_url;
			vld.loading_tx = config.lang.M01;
			vld.error_tx = window.THEME_CONFIG.lang.E01;
			vld.$fm = cache.$fm;

			vld.done = done;
			vld.always = always;
			vld.init();
				
			function done(data){
				if(data.status === 'warning'){
					ajax_loading_tip(data.status,data.msg);
				}
				if(data.status !== 'error'){
					/** set new point */
					highlight_point(parseInt(data['new-points']) - parseInt(cache.$point_count.innerHTML));
				}
			}
			function always(){
				cache.$fm.querySelector('.submit').removeAttribute('disabled');
			}
		}
		function highlight_point(point){
			if(point > 0){
				cache.$hgihlight_point.classList.add('plus');
				cache.$hgihlight_point.innerHTML = '+' + point;
			}else{
				cache.$hgihlight_point.classList.add('mins');
				cache.$hgihlight_point.innerHTML = point;
			}
			cache.$hgihlight_point.style.display = 'inline';
			setTimeout(function(){
				cache.$hgihlight_point.classList.remove('plus');
				cache.$hgihlight_point.classList.remove('mins');
				cache.$hgihlight_point.style.display = 'none';
				cache.$point_count.innerHTML = parseInt(cache.$point_count.innerHTML) + point;
			},2000);
		}
		function I(e){
			return document.getElementById(e);
		}
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var array_merge = __webpack_require__(11);
	var ajax_loading_tip = __webpack_require__(7);
	var validate = __webpack_require__(50);
	var placeholder = __webpack_require__(57);
	var paseHTML = __webpack_require__(15);

	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_custom_contribution)
			return;
			
		var cache = {},
			config = {
				fm_id : 			'fm-ctb',
				file_area_id : 		'ctb-file-area',
				file_btn_id : 		'ctb-file-btn',
				file_id : 			'ctb-file',
				file_tip_id : 		'ctb-file-tip',
				files_id : 			'ctb-files',

				edit : false,
				thumbnail_id : false,
				attachs : false,
				cats : false,
				
				default_size : 'large',
				process_url : '',
				
				lang : {
					M01 : 'Loading, please wait...',
					M02 : 'Uploading {0}/{1}, please wait...',
					M03 : 'Click to delete',
					M04 : '{0} files have been uploaded.',
					M05 : 'Source',
					M06 : 'Click to view source',
					M07 : 'Set as cover.',
					M08 : 'Optional: some description',
					M09 : 'Insert',
					M10 : 'Preview',
					M11 : 'Large size',
					M12 : 'Medium size',
					M13 : 'Small size',
					M14 : 'Please select a category',
					E01 : 'Sorry, server is busy now, can not respond your request, please try again later.'
				}
			};
			
		config = array_merge(config, window.THEME_CONFIG.theme_custom_contribution);
		
		function I(e){
			return document.getElementById(e);
		}
		function init(){
			ready(bind);
		}
		function bind(){
			cache.$fm = 				I('fm-ctb');
			cache.$post_id = 			I('ctb-post-id');
			cache.$post_title = 		I('ctb-title');
			cache.$post_content = 		I('ctb-content');
			cache.$post_excerpt = 		I('ctb-excerpt');
			cache.$file_area = 			I('ctb-file-area');
			cache.$file_btn = 			I('ctb-file-btn');
			cache.$file = 				I('ctb-file');
			cache.$files = 				I('ctb-files');
			
			cache.$file_progress_container = I('ctb-file-progress-container');
			cache.$file_progress = 		I('ctb-file-progress');
			
			cache.$file_completion_tip = I('ctb-file-completion');
			
			cache.$split_number = 		I('ctb-split-number');

			cache.$batch_insert = 		I('ctb-batch-insert-btn');

			if(!cache.$fm) 
				return false;
			I('fm-ctb-loading').style.display = 'none';
			cache.$fm.style.display = 'block';
			
			cache.$post_title.focus();

			
			load_thumbnails();
			
			upload();

			cats();
			
			toggle_reprint_group();
			
			fm_validate();	

			save_split_number();
			
			restore_split_number();
			
			/** auto save */
			auto_save.bind();

			batch_insert();

		}

		function save_split_number(){
			var helper = function(){
				localStorage.setItem('ctb-split-number',this.value);
			}
			cache.$split_number.addEventListener('change',helper);
		}
		function restore_split_number(){
			var number = parseInt(localStorage.getItem('ctb-split-number'));
			if(number > 0)
				cache.$split_number.value = number;
		}
		/**
		 * auto save
		 */
		var auto_save = {
			config : {
				save_interval : 30,
				lang : {
					M01 : 'You have a auto save version, do you want to restore? Auto save last time is {time}.',
					M02 : 'Restore completed.',
					M03 : 'The data has saved your browser.'
				}
			},
			timer : false,
			bind : function(){
				var that = this;
				/** set save key */
				this.save_key = 'auto-save-' + cache.$post_id.value;
				
				this.check_version();
				
				/** save data per x seconds */
				this.timer = setInterval(function(){
					that.save();
				}, this.config.save_interval * 1000);

				cache.$quick_save = I('ctb-quick-save');
				if(cache.$quick_save){
					cache.$quick_save.addEventListener('click',function(){
						if(cache.$post_title.value === ''){
							cache.$post_title.focus();
						}else{
							that.save();
							ajax_loading_tip('success',that.config.lang.M03,3);
						}
					})
				}
			},
			get : function(){
				var data = localStorage.getItem(this.save_key);
				return data ? JSON.parse(data) : false;
			},
			/** action check version */
			check_version : function(){ 
				var data = this.get();
				if(!data || !data.can_restore)
					return false;
				
				var msg = this.config.lang.M01.replace('{time}',data.time);
				if(!confirm(msg))
					return false;
				
				this.restore();
				ajax_loading_tip('success',this.config.lang.M02,3);
			},
			/** preview thumbnail */
			get_data_preview : function(){
				var $insert_btns = document.querySelectorAll('.ctb-insert-btn');
				if(!$insert_btns[0])
					return false;
					
				var $img_links = document.querySelectorAll('.img-link'),
					$img_thumbnail_urls = document.querySelectorAll(' .img-link img'),
					$thumbnail_ids = document.querySelectorAll('.img-thumbnail-checkbox'),
					
					data = {};
				for(var i=0, len=$insert_btns.length; i<len; i++){
					data[$thumbnail_ids[i].value] = {
						'attach-page-url' :  $insert_btns[i].getAttribute('data-attach-page-url'),
						full : {
							url : $img_links[i].href,
						},
						large : {
							url : $insert_btns[i].getAttribute('data-large-url'),
							width : $insert_btns[i].getAttribute('data-width'),
							height : $insert_btns[i].getAttribute('data-height')
						},
						thumbnail : {
							url : $img_thumbnail_urls[i].src
						},
						'attach-id' : $thumbnail_ids[i].value
					}
				}
				return data;
			},
			del : function(){
				localStorage.removeItem(this.save_key);
				clearInterval(this.timer);
			},
			/** action save */
			save : function(){
				var data = {
						can_restore : false
					};
					
				/** title */
				if(cache.$post_title.value !== ''){
					data.title = cache.$post_title.value;
					data.can_restore = true;
				}

				/** excerpt */
				if(cache.$post_excerpt.value !== ''){
					data.excerpt = cache.$post_excerpt.value;
					data.can_restore = true;
				}

				/** content */
				var post_content = get_editor_content();
				if(post_content !== ''){
					data.content = post_content;
					data.can_restore = true;
				}
				
				
				
				/** storage */
				if(document.querySelector('.theme_custom_storage-group')){
					data.storage = {};
					cache.$storage_items = document.querySelectorAll('.theme_custom_storage-item');
					if(cache.$storage_items[0]){
						for(var i=0, len=cache.$storage_items.length; i<len; i++){
							if(!data.storage[i])
								data.storage[i] = {};
							var ph = cache.$storage_items[i].getAttribute('data-placeholder');
							data.storage[i] = {
								url : I('theme_custom_storage-' + ph + '-url').value,
								download_pwd : I('theme_custom_storage-' + ph + '-download-pwd').value,
								extract_pwd : I('theme_custom_storage-' + ph + '-extract-pwd').value
							};
							var $name = I('theme_custom_storage-' + ph + '-name');
							if($name)
								data.storage[i].name = $name.value;
						}
					}
					//data.can_restore = true;
				}
				/** preset tags */
				var $tags = document.querySelectorAll('.ctb-preset-tag:checked');
				if($tags[0]){
					data.preset_tags = {};
					for(var i=0,len=$tags.length;i<len;i++){
						if(!data.preset_tags[i])
							data.preset_tags[i] = {};
						data.preset_tags[i] = $tags[i].id;
					}
					data.can_restore = true;
				}

				/** custom tags */
				var $custom_tags = document.querySelectorAll('.ctb-custom-tag');
				if($custom_tags[0]){
					data.custom_tags = {};
					for(var i=0,len=$custom_tags.length;i<len;i++){
						if(!data.custom_tags[$custom_tags[i].id])
							data.custom_tags[$custom_tags[i].id] = {};
						data.custom_tags[$custom_tags[i].id] = $custom_tags[i].value;
					}
					//data.can_restore = true;
				}
				/** source */
				var $source = document.querySelector('.theme_custom_post_source-source-radio:checked');
				if($source){
					data.source = {
						source : $source.value,
						reprint_url : I('theme_custom_post_source-reprint-url').value,
						reprint_author : I('theme_custom_post_source-reprint-author').value
					};
					//data.can_restore = true;
				}

				/** preview */
				data.preview = this.get_data_preview();
				if(data.preview){
					data.can_restore = true;
				}

				/** cover id */
				var $cover = document.querySelector('.img-thumbnail-checkbox:checked');
				if($cover){
					data.cover_id = $cover.value;
					data.can_restore = true;
				}

				/** time */
				var d = new Date();
				data.time = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
				/** save */
				localStorage.setItem(this.save_key,JSON.stringify(data));
			},

			/** action restore */
			restore : function(){
				var data = this.get();
				if(!data || !data.can_restore)
					return false;
				/** post title */
				if(data.title)
					cache.$post_title.value = data.title;
					
				/** post excerpt */
				if(data.excerpt)
					cache.$post_excerpt.value = data.excerpt;

				/** post content */
				if(data.content)
					set_editor_content(data.content);
					
				/** storage */
				if(data.storage && document.querySelector('.theme_custom_storage-group')){
					var $storage_container = I('theme_custom_storage-container');
					var tpl = $storage_container.getAttribute('data-tpl');
					$storage_container.innerHTML = '';
					for(var i in data.storage){
						var $tpl = paseHTML(tpl.replace(/\%placeholder\%/g,i));
						/** name */
						var $name = $tpl.querySelector('#theme_custom_storage-' + i + '-name');
						if($name){
							$name.value = data.storage[i].name;
						}
						/** url */
						var $url = $tpl.querySelector('#theme_custom_storage-' + i + '-url');
						$url.value = data.storage[i].url;
						/** url */
						var $download_pwd = $tpl.querySelector('#theme_custom_storage-' + i + '-download-pwd');
						$download_pwd.value = data.storage[i].download_pwd;
						/** url */
						var $extract_pwd = $tpl.querySelector('#theme_custom_storage-' + i + '-extract-pwd');
						$extract_pwd.value = data.storage[i].extract_pwd;

						$storage_container.appendChild($tpl);			
					}
				}
				
				/** preset tags */
				if(data.preset_tags){
					for(var i in data.preset_tags){
						var $preset_tag = I(data.preset_tags[i]);
						if($preset_tag)
							$preset_tag.checked = true;
					}
				}

				/** custom tags */
				if(data.custom_tags){
					for(var i in data.custom_tags){
						var $custom_tag = I(i);
						if($custom_tag)
							$custom_tag.value = data.custom_tags[i];
					}
				}
				
				/** source */
				if(data.source){
					if(data.source.source){
						var $item = I('theme_custom_post_source-source-' + data.source.source),
							$reprint_url = I('theme_custom_post_source-reprint-url'),
							$reprint_author = I('theme_custom_post_source-reprint-author');
						if($reprint_url)
							$reprint_url.value = data.source.reprint_url;
						if($reprint_url)
							$reprint_author.value = data.source.reprint_author;
						if($item)
							$item.checked = true;
					}
				}

				/** Preview */
				if(data.preview){
					/** set cover id */
					if(data.cover_id)
						config.thumbnail_id = data.cover_id;
					for(var i in data.preview){
						append_tpl(convert_to_preview_tpl_args(data.preview[i]));
					}
				}
			}
		};
		function convert_to_preview_tpl_args(data){
			var preview_args = {
				full : {
					url : data.full.url
				},
				large : {
					url : data.large.url,
					width : data.large.width,
					height : data.large.height
				},
				thumbnail : {
					url : data.thumbnail.url
				},
				'attach-id' : data['attach-id']
			};
			preview_args['attach-page-url'] = data['attach-page-url'];
			return preview_args;
		}
		function set_editor_content(s){
			var ed = tinymce.editors['ctb-content'];
			if(ed && !ed.isHidden()){
				tinymce.editors['ctb-content'].setContent(s);
			}else{
				cache.$post_content.value = s;
			}
		}
		function get_editor_content(){
			var ed = tinymce.editors['ctb-content'];
			if(ed && !ed.isHidden()){
				return tinymce.editors['ctb-content'].getContent();
			}else{
				return cache.$post_content.value;
			}
		}

		function send_to_editor(s) {
			var ed = tinymce.editors['ctb-content'];
			if(ed && !ed.isHidden()){
				ed.execCommand('mceInsertContent', false, s);
			}else if(typeof(QTags) != 'undefined'){
				QTags.insertContent(s);
			}else{
				cache.$post_content.value += s;
			}
		}
		function load_thumbnails(){
			if( !config.edit || !config.attachs )
				return false;
				
			for(var i in config.attachs){
				//console.log(config.attachs[i]);
				append_tpl(config.attachs[i]);
			}
		}
		/**
		 * upload
		 */
		
		function upload(){
			cache.$file.addEventListener('change', file_select);
			cache.$file.addEventListener('drop', file_drop);
			cache.$file.addEventListener('dragover', dragover);
		}
		function dragover(evt){
			evt.stopPropagation();
			evt.preventDefault();
			evt.dataTransfer.dropEffect = 'copy';
		}
		function file_drop(e){
			e.stopPropagation();
			e.preventDefault();
			cache.files = e.dataTransfer.files;
			cache.file_count = cache.files.length;
			cache.file = cache.files[0];
			cache.file_index = 0;
			file_upload(cache.files[0]);
		}
		/**
		 * file_select
		 */
		function file_select(e){
			e.stopPropagation();
			e.preventDefault();
			cache.files = e.target.files.length ? e.target.files : e.originalEvent.dataTransfer.files;
			cache.file_count = cache.files.length;
			cache.file = cache.files[0];
			cache.file_index = 0;
			file_upload(cache.files[0]);
			cache.$file_progress.style.width = '1px';

		}
		/**
		 * file_upload
		 */
		function file_upload(file){
			file_submission(file);
		}
		/**
		 * file_submission
		 */
		function file_submission(file){
			file_beforesend_callback();
			var fd = new FormData(),
				xhr = new XMLHttpRequest();

			fd.append('type','upload');
			fd.append('theme-nonce',window.DYNAMIC_REQUEST['theme-nonce']);
			fd.append('img',file);
			
			xhr.open('post',config.process_url);
			xhr.onload = function(){
				if (xhr.status >= 200 && xhr.status < 400) {
					file_complete_callback(xhr.responseText);
				}else{
					file_error_callback(xhr.responseText);
				}
				xhr = null;
			};
			
			
			xhr.upload.onprogress = function(e){
				if (e.lengthComputable) {
					var percent = (e.loaded * cache.file_index) / (e.total * cache.file_count) * 100;
					cache.$file_progress.style.width = percent + '%';
				}
			};
			xhr.send(fd);
		}
		function file_beforesend_callback(){
			var tx = placeholder(config.lang.M02, cache.file_index + 1,cache.file_count);
			uploading_tip('loading',tx);
		}
		function file_error_callback(msg){
			msg = msg ? msg : config.lang.E01;
			uploading_tip('error',msg);
		}
		/** 
		 * upload_started
		 */
		//function upload_started(i,file,count){
		//	var t = placeholder(config.lang.M02, i,count);
		//	uploading_tip('loading',t);
		//}
		function file_complete_callback(data){
			try{data = JSON.parse(data)}catch(error){}
			cache.file_index++;
			/** 
			 * success
			 */
			if(data && data.status === 'success'){
				/** append to tpl */
				append_tpl(data);
				
				/** preset editor content */
				//var editor_content = get_img_content_tpl({
				//	attach_page_url : data['attach-page-url'],
				//	width : data.large.width,
				//	height : data.large.height,
				//	img_url : data[config.default_size].url
				//});
				
				
				//}
				/** set content to editor */
				//send_to_editor(editor_content);
			
				/** 
				 * check all thing has finished, if finished
				 */
				if(cache.file_count === cache.file_index){
					var tx = placeholder(config.lang.M04, cache.file_index,cache.file_count);
					uploading_tip('success',tx);
					cache.$file.value = '';
				/**
				 * upload next file
				 */
				}else{
					file_upload(cache.files[cache.file_index]);
				}
			/** 
			 * no success
			 */
			}else{
				/** 
				 * notify current file is error
				 */
				if(cache.file_index > 0){
					//error_file_tip(cache.files[cache.file_index - 1]);
				}
				/** 
				 * if have next file, continue to upload next file
				 */
				if(cache.file_count > cache.file_index){
					file_upload(cache.files[cache.file_index]);
				/** 
				 * have not next file, all complete
				 */
				}else{
					cache.is_uploading = false;
					if(data && data.status === 'error'){
						file_error_callback(data.msg);
					}else{
						file_error_callback(config.lang.E01);
						console.error(data);
					}
					/** 
					 * reset file input
					 */
					cache.$file.value = '';

				}
			}
		}/** end file_complete_callback */
		
		function append_tpl(data){
			var $tpl = get_preview_tpl(data);
				
			cache.$files.style.display = 'block';
			cache.$files.appendChild($tpl);
			$tpl.style.display = 'block';
		}
		/**
		args = {
			attach-page-url : ...
			full : {
				url : ...,
				height : ...,
				width : ...
			},
			large : {
				url : ...,
				height : ...,
				width : ...
			}
			thumbnail : {
				url : ...,
				height : ...,
				width : ...
			}
			attach-id : ...
		}
		 */
		function get_preview_tpl(args){
			if(!cache.$post_title)
				cache.$post_title = I('ctb-title');
				
			var $tpl = document.createElement('div'),
				M10 = cache.$post_title == '' ? config.lang.M10 : cache.$post_title.value,
				content = '<a class="img-link" href="' + args.full.url + '" target="_blank" title="' + config.lang.M06 + '">' + 
						'<img src="' + args.thumbnail.url + '" alt="' + M10 +'" >' +
					'</a>' +
					
					'<a href="javascript:;" class="btn btn-default btn-block ctb-insert-btn" id="ctb-insert-' + args['attach-id'] + '" data-size="large" data-attach-page-url="' + args['attach-page-url'] + '" data-width="' + args.large.width + '" data-height="' + args.large.height + '" data-large-url="' + args.large.url + '" ><i class="fa fa-plug"></i> ' + config.lang.M09 + '</a>' +
					
					'<input type="radio" name="ctb[thumbnail-id]" id="img-thumbnail-' + args['attach-id'] + '" value="' + args['attach-id'] + '" hidden class="img-thumbnail-checkbox" required >' +
					
					'<label for="img-thumbnail-' + args['attach-id'] + '" class="ctb-set-cover-btn"><i class="fa fa-star"></i> ' + config.lang.M07 + '</label>' +
					
					'<input type="hidden" name="ctb[attach-ids][]" value="' + args['attach-id'] + '" >';
					
			$tpl.id = 'img-' + args['attach-id'];
			$tpl.setAttribute('class','thumbnail-tpl g-phone-1-2 g-tablet-1-3 g-desktop-1-4');
			$tpl.innerHTML = content;
			$tpl.style.display = 'none';
			
			/**
			 * set as cover
			 */
			if((!config.thumbnail_id && !cache.first_cover) || (args['attach-id'] == config.thumbnail_id)){
				$tpl.querySelector('.img-thumbnail-checkbox').checked = true;
				cache.first_cover = true;
			}
			/**
			 * insert
			 */
			var $insert_btn = $tpl.querySelectorAll('.ctb-insert-btn'),
				send_content_helper = function(){
					/** send to editor */
					send_to_editor(get_img_content_tpl({
						attach_page_url : this.getAttribute('data-attach-page-url'),
						width : this.getAttribute('data-width'),
						height : this.getAttribute('data-height'),
						img_url : args[this.getAttribute('data-size')].url
					}));
				};
			for(var i = 0, len = $insert_btn.length; i < len; i++){
				$insert_btn[i].addEventListener('click',send_content_helper,false);
			}

			return $tpl;
		}
		/**
		 * 
		data = {
			attach_page_url : '',
			img_url : '',
			width : '',
			height : ''
		}
		 */
		function get_img_content_tpl(data){
			var title = cache.$post_title == '' ? config.lang.M10 : cache.$post_title.value;
			return '<p><a href="' + data.attach_page_url + '" title="' + title + '" target="_blank" >' + 
				'<img src="' + data.img_url + '" alt="' + title + '" width="'+ data.width + '" height="'+ data.height + '">' +
			'</a></p>';
		}

		/**
		 * The tip when pic is uploading
		 *
		 * @param string status 'loading','success' ,'error'
		 * @param string text The content of tip
		 * @return 
		 * @version 1.0.1
		 */
		function uploading_tip(status,text){
			/** 
			 * uploading status
			 */
			if(!status || status === 'loading'){
				ajax_loading_tip(status,text);
				//cache.$file_progress_tx.innerHTML = text;
				cache.$file_progress_container.style.display = 'block';
				cache.$file_area.style.display = 'none';
				//cache.$file_completion_tip.style.display = 'none';
			/** 
			 * success status
			 */
			}else{
				ajax_loading_tip(status,text);
				//cache.$file_completion_tip.innerHTML = status_tip(status,text)
				//cache.$file_completion_tip.style.display = 'block';
				cache.$file_progress_container.style.display = 'none';
				cache.$file_area.style.display = 'block';
			}
		}/** end uploading_tip */

		function batch_insert(){
			cache.$batch_insert.addEventListener('click', event_batch_insert_imgs);
		}
		function event_batch_insert_imgs(){
			var data = auto_save.get_data_preview(),
				content = [],
				index = 0;
				
			if(!data)
				return false;

			var len = Object.keys(data).length;
				
			for(var i in data){
				
				content.push(get_img_content_tpl({
					attach_page_url : data[i]['attach-page-url'],
					img_url : data[i].large.url,
					width : data[i].large.width,
					height : data[i].large.height
				}));

				/** nextpage checked */
				if(cache.$split_number.value > 0 && 
					index < len - 1 && 
					(index + 1) % cache.$split_number.value == 0
				){
					content.push(' <!--nextpage--> ');
				}
				
				index++;
			}
			if(content)
				send_to_editor(content.join(''));
		}
		function fm_validate(){
			var m = new validate();
				m.process_url = config.process_url;
				m.loading_tx = config.lang.M01;
				m.error_tx = config.lang.E01;
				m.$fm = cache.$fm;
				m.before = function(fd){
					fd.append('ctb[post-content]',get_editor_content());
				};
				m.done = function(data){
					if(config.edit){
						cache.$fm.querySelector('.submit').removeAttribute('disabled');
					}
					if(data.status === 'success'){
						/** delete auto save */
						auto_save.del();
					}
				};
				m.init();
		}
		function cats(){
			if(!config.cats)
				return false;
			cache.$cat_container = I('ctb-cat-container');
			if(!cache.$cat_container)
				return;
				
			create_parent_cats();
			
			/** create no select option */
			function create_null_opt($container){
				var $null_opt = document.createElement('option');
				$null_opt.innerHTML = config.lang.M14;
				$null_opt.value = '';
				$container.appendChild($null_opt);
			}
			/** crreate parent select */
			function create_parent_cats(){
				cache.$parent_cat = document.createElement('select');
				cache.$parent_cat.name = 'ctb[cats][]';
				cache.$parent_cat.classList.add('ctb-cat') ;
				cache.$parent_cat.classList.add('form-control');
				cache.$parent_cat.required = true;
				create_null_opt(cache.$parent_cat);
				for(var i in config.cats){
					if(config.cats[i].parent > 0)
						continue;
					var $opt = document.createElement('option');
					$opt.value = config.cats[i].term_id;
					$opt.title = config.cats[i].description;
					$opt.innerHTML = config.cats[i].name;
					cache.$parent_cat.appendChild($opt);
				}
				/** event */
				cache.$parent_cat.addEventListener('change', event_cat_change);
				cache.$cat_container.appendChild(cache.$parent_cat);
			}
			function remove_next($curr){
				var $next = $curr.nextElementSibling;
				if($next){
					$next.parentNode.removeChild($next);
					remove_next($curr);
				}
			}
			function event_cat_change(){
				/** remove other */
				remove_next(this);
				
				var parent_cid = this.value,
					$cat_child = cache['$cat_' + parent_cid];
				
				if(!parent_cid)
					return;
				if($cat_child){
					cache.$cat_container.appendChild($cat_child);
					return;
				}
				for(var i in config.cats){
					if(config.cats[i].parent != parent_cid)
						continue;
					var $opt = document.createElement('option');
					$opt.value = config.cats[i].term_id;
					$opt.title = config.cats[i].description;
					$opt.innerHTML = config.cats[i].name;
					if(!$cat_child){
						$cat_child = document.createElement('select');
						$cat_child.name = 'ctb[cats][]';
						$cat_child.classList.add('ctb-cat') ;
						$cat_child.classList.add('form-control');
						create_null_opt($cat_child);
						$cat_child.addEventListener('change',event_cat_change);
					}
					$cat_child.appendChild($opt);
				}
				if($cat_child)
					cache.$cat_container.appendChild($cat_child);
			}
		}
		function toggle_reprint_group(){
			var $radios = document.querySelectorAll('.theme_custom_post_source-source-radio'),
				$inputs = document.querySelectorAll('.theme_custom_post_source-inputs'),
				action = function($radio){
					var target = $radio.getAttribute('target'),
						$target = I(target);
					for(var i=0,len=$inputs.length;i<len;i++){
						if($target && $target.id === target && $radio.checked){
							$target.style.display = 'block';
							var $input = $target.querySelector('input');
							if($input.value.trim() === '')
								$input.focus();
						}else{
							$inputs[i].style.display = 'none';
						}
					}
				},
				event_select = function(){
					action(this)
				};
			for(var i = 0, len = $radios.length; i < len; i++){
				action($radios[i]);
				$radios[i].addEventListener('change', event_select);
			}
		}

		init();
	}

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = function(){    
		var args = arguments;  
		return arguments[0].replace(/\{(\d+)\}/g,                    
			function(m,i){
				return args[parseInt(i)+1];    
			});     
	};


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var validate = __webpack_require__(50);
	var array_merge = __webpack_require__(11);
	module.exports = function(){
		'use strict';

		if(!window.THEME_CONFIG.theme_custom_user_settings)
			return;
			
		var cache = {},
			config = {
				process_url : '',
			};

		config = array_merge(config, window.THEME_CONFIG.theme_custom_user_settings);
		
		function init(){
			ready(bind);
		}
		function bind(){
			cache.$fm = document.querySelector('.user-form');
			if(!cache.$fm)
				return;
				
			fm_validate(cache.$fm);
		}
		function fm_validate($fm){
			var m = new validate();
				m.process_url = config.process_url;
				m.loading_tx = window.THEME_CONFIG.lang.M01;
				m.error_tx = window.THEME_CONFIG.lang.E01;
				m.$fm = $fm;
				m.init();
		}

		init();
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var ajax_loading_tip = __webpack_require__(7);
	var array_merge = __webpack_require__(11);
	module.exports = function(){
		'use strict';
		
		if(!window.THEME_CONFIG.theme_custom_user_settings)
			return;

		var cache = {},
			config = {
				process_url : ''
			};
		config = array_merge(config, window.THEME_CONFIG.theme_custom_user_settings);
		
		function init(){
			
			ready(bind);
		}
		function I(e){
			return document.getElementById(e);
		}
		function bind(){
			cache.$fm = I('fm-change-avatar');
			if(!cache.$fm)
				return;
			cache.$crop_container = I('cropper-container');
			cache.$avatar_preview = I('avatar-preview');
			cache.$crop_done_btn = I('cropper-done-btn');
			cache.$base64 = I('avatar-base64');
			upload();
		}
		function upload(){
			cache.$file = I('file');
			
			cache.$file.addEventListener('drop', file_select , false);
			cache.$file.addEventListener('change', file_select , false);

			cache.$fm.addEventListener('submit',validate,false);
			
			function file_select(e){
				e.stopPropagation();  
				e.preventDefault();  
				cache.files = e.target.files.length ? e.target.files : e.originalEvent.dataTransfer.files;
				cache.file = cache.files[0];
				file_read(cache.file);
			}
			function file_read(file){
				var	reader = new FileReader();
				reader.onload = function (e) {
					if(file.type.indexOf('image') === -1){
						alert('Invaild file type.');
						return false;
					}

					cache.$crop_container.innerHTML = '<img src="' + reader.result + '" alt="cropper">';
					cache.$crop_container.style.display = 'block';
					
					cache.$crop_img = cache.$crop_container.querySelector('img');
					
					cache.$avatar_preview.style.display = 'block';

					/** load crop module */
					//require.ensure(['./cropper'],function(){
						
					//});
					cache.cp = new Cropper(cache.$crop_img,{
						aspectRatio : 1,
						preview : '#avatar-preview',
						minCropBoxWidth : 150,
						minCropBoxHeight : 150
					});
					cache.$crop_done_btn.style.display = 'block';
				};
				reader.readAsDataURL(file);	
			}
			function validate(){
				var xhr = new XMLHttpRequest(),
					fd = new FormData(),
					$submit = cache.$fm.querySelector('[type=submit]');
				/**
				 * tip
				 */
				ajax_loading_tip('loading',window.THEME_CONFIG.lang.M01);
				$submit.setAttribute('disabled',true);

				fd.append('theme-nonce',window.DYNAMIC_REQUEST['theme-nonce']);
				fd.append('type','avatar');
				fd.append('b4',cache.cp.getCroppedCanvas().toDataURL('image/jpeg',0.75));
				
				xhr.open('POST',config.process_url);
				xhr.send(fd);
				xhr.onload = function(){
					if(xhr.status >= 200 && xhr.status < 400){
						var data;
						try{data = JSON.parse(xhr.responseText)}catch(e){data = xhr.responseText}
						
						if(data && data.status === 'success'){
							ajax_loading_tip(data.status,data.msg);
							location.reload();
						}else if(data && data.status === 'error'){
							ajax_loading_tip(data.status,data.msg);
							$submit.removeAttribute('disabled');
						}else{
							ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
							$submit.removeAttribute('disabled');
						}
					}else{
						ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
						$submit.removeAttribute('disabled');
					}
				};
				xhr.onerror = function(){
					ajax_loading_tip('error',window.THEME_CONFIG.lang.E01);
					$submit.removeAttribute('disabled');
				}

			}
		}
		init();
	}

/***/ }
/******/ ]);