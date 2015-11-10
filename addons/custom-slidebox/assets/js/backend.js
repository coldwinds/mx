var ready = require('modules/ready');
var ajax_loading_tip = require('modules/ajax-loading-tip');
var array_merge = require('modules/array-merge');
var uploader = require('modules/uploader');
var paseHTML = require('modules/parse-html');

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
			var tpl = config.tpl.replace(config.placeholder_pattern,+new Date()),
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