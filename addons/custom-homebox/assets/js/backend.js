var ready = require('modules/ready');
var array_merge = require('modules/array-merge');
var paseHTML = require('modules/parse-html');

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
			var target_id = this.getAttribution('data-target'),
			$target = document.getElementById(target_id);
			if(window.jQuery){
				jQuery($target).fadeOut(1,function(){
					jQuery(this).remove();
				}).css({
					'background-color':'#d54e21'
				});
			}else{
				$target.parentNode.removeChild($target);
			}
		});
	}
}