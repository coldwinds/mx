define(function(require, exports, module){
	'use strict';
	var tools = require('modules/tools');
	exports.config = {
		key : 'full-width-mode',
		lang : {
			M01 : 'Full width mode'
		}
	};
	exports.init = function(){
		tools.ready(exports.bind);
	}
	var cache = {},
		config = exports.config;
	
	exports.bind = function(){
		
		if(!create_btn())
			return false;

		cache.$main = I('main');
		cache.$side = I('sidebar-container');
		cache.$btn.addEventListener('click', event_click);

		if(localStorage.getItem(config.key) == 1){
			expand();
		}
	}
	function expand(){
		cache.$btn.classList.remove('fa-angle-right');
		cache.$btn.classList.add('fa-angle-left');
		cache.$main.classList.add('expand');
		cache.$side.classList.add('expand');
		localStorage.setItem(config.key,1);
	}
	function reset(){
		cache.$btn.classList.remove('fa-angle-left');
		cache.$btn.classList.add('fa-angle-right');
		cache.$main.classList.remove('expand');
		cache.$side.classList.remove('expand');
		localStorage.removeItem(config.key);
	}
	function is_expanded(){
		return cache.$main.classList.contains('expand');
	}
	function event_click(){
		if(is_expanded()){
			reset();
		}else{
			expand();
		}
	}
	function create_btn(){
		var $container = document.querySelector('.singular-post > .panel-body');
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
});