var ready = require('modules/ready');
var tpl_control = require('modules/tpl-control');

module.exports = function(){
	var cache = {};
	
	ready(bind);
	
	function bind(){
		var controler = new tpl_control();
		controler.$add = document.getElementById('theme_super_search-add');
		controler.$container = document.getElementById('theme_super_search-container');
		controler.init();
	}
}