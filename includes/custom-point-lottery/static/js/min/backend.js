
define(function(require,exports,module){'use strict';var tools=require('modules/tools');exports.init=function(){tools.ready(function(){bind();});}
exports.config={prefix_item_id:'theme_point_lottery-item-',items_id:'.theme_point_lottery-item',add_id:'theme_point_lottery-add',control_container_id:'theme_point_lottery-control',tpl:''}
var cache={},config=exports.config;function bind(){add();del(jQuery(config.items_id));}
function I(e){return jQuery(document.getElementById(e));}
function add(){var $add=I(config.add_id),$control_container=I(config.control_container_id);if(!$add[0])return false;$add.on('click',function(){var $tpl=jQuery(config.tpl.replace(/\%placeholder\%/ig,get_random_int(100,999)));del($tpl);$control_container.before($tpl);$tpl.find('input').eq(0).focus();});}
function del($tpl){$tpl.find('.delete').on('click',function(){I(jQuery(this).data('target')).css('background','#d54e21').fadeOut('slow',function(){jQuery(this).remove();})})}
function get_random_int(min,max){return new Date().getTime()+''+(Math.floor(Math.random()*(max-min+1))+min);}});