define(function(require, exports){
	'use strict';
	var tools = require('modules/tools');
	exports.init = function(){
		tools.ready(function(){
			bind();
		});
	}
	exports.config = {
		prefix_item_id : '#theme_custom_homebox-item-',
		items_id : '.theme_custom_homebox-item',
		add_id : '#theme_custom_homebox-add',
		container_id : '#theme_custom_homebox-container',
		tpl : ''
	}
	var cache = {},
		config = exports.config;
		
	function bind(){
		cache.$container = jQuery(config.container_id);
		cache.$add = jQuery(config.add_id);
		add();
		del(jQuery(exports.config.items_id));
		
	}
	function add(){
		if(!cache.$add[0]) 
			return false;
		cache.$add.on('click',function(){
			var $tpl = jQuery(config.tpl.replace(/\%placeholder\%/ig,get_random_int()));
			del($tpl);
			cache.$container.append($tpl);
			$tpl.find('input').eq(0).focus();
		});
	
	}
	function del($tpl){
		$tpl.find('.delete').on('click',function(){
			jQuery(jQuery(this).data('target')).css('background','#d54e21')
			.fadeOut('slow',function(){
				jQuery(this).remove();
			})
		})
	}
	function get_random_int() {
		return new Date().getTime();
	}
});