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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(25)();


/***/ },

/***/ 2:
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

/***/ 14:
/***/ function(module, exports) {

	module.exports = function(s) {
		var t = document.createElement('div');
		t.innerHTML = s;
		return t.firstChild;
	};

/***/ },

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	var ready = __webpack_require__(2);
	var paseHTML = __webpack_require__(14);
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

/***/ }

/******/ });