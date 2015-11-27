var ready = require('modules/ready');
var array_merge = require('modules/array-merge');
var ajax_loading_tip = require('modules/ajax-loading-tip');

module.exports = function(){

if(!window.THEME_CONFIG.theme_super_search)
	return;
	
var cache = {},
	config = {
		process_url : '',
		cats : {},
		lang : {
			M01 : 'All',
			M02 : 'Searching, please wait...'
		}
	};
	
config = array_merge(config, window.THEME_CONFIG.theme_super_search);


ready(init);

function init(){
	cats();
	tags();
	search();
}

function cats(){
	if(!config.cats)
		return false;
	cache.$cat_container = I('ss-cat-container');
	if(!cache.$cat_container)
		return;
		
	create_parent_cats();
	
	/** create emtry section */
	function create_null_opt($cat_container,pid){
		var $label = document.createElement('label');
		$label.className = 'condition-label';
		
		var $radio = document.createElement('input');
		$radio.type = 'radio';
		$radio.setAttribute('data-parent-target','search-cat-item-' + pid);
		$radio.name = 'search[cats][' + pid + ']';
		$radio.value = '';
		$radio.hidden = true;
		$radio.checked = true;
		$radio.addEventListener('change', event_cat_change);
		$label.appendChild($radio);

		
		var $tx = document.createElement('span');
		$tx.className = 'tx';
		$tx.innerHTML = config.lang.M01;
		$label.appendChild($tx);
		
		$cat_container.appendChild($label);
	}
	/** crreate parent select */
	function create_parent_cats(){
		cache.$parent_cat = document.createElement('div');
		cache.$parent_cat.id = 'search-cat-item-0';
		cache.$parent_cat.className = 'search-cat';
		/** create null opt */
		create_null_opt(cache.$parent_cat,0);
		for(var i in config.cats){
			if(config.cats[i].parent > 0)
				continue;
				
			var $label = document.createElement('label');
			$label.className = 'condition-label';
			
			var $radio = document.createElement('input');
			$radio.type = 'radio';
			$radio.hidden = true;
			$radio.value = config.cats[i].term_id;
			$radio.name = 'search[cats][' + config.cats[i].parent + ']';
			$radio.setAttribute('data-parent-target', 'search-cat-item-0');
			$label.appendChild($radio);
			
			var $tx = document.createElement('span');
			$tx.className = 'tx';
			$tx.innerHTML = config.cats[i].name;
			$label.appendChild($tx);
			
			cache.$parent_cat.appendChild($label);

			$radio.addEventListener('change', event_cat_change);
		}
		/** event */
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
		/** create new items */
		var parent_cid = this.value,
			$cat_child = cache['$cat_' + parent_cid];
			
		if(parent_cid <= 0){
			remove_next(I(this.getAttribute('data-parent-target')));
			go_submit();
			return;
		}
		
		/** remove other */
		remove_next(I(this.getAttribute('data-parent-target')));
			
		if($cat_child){
			cache.$cat_container.appendChild($cat_child);
			return;
		}
		for(var i in config.cats){
			if(config.cats[i].parent != parent_cid)
				continue;
				
			var $label = document.createElement('label');
			$label.className = 'condition-label';
			
			var $radio = document.createElement('input');
			$radio.type = 'radio';
			$radio.hidden = true;
			$radio.value = config.cats[i].term_id;
			$radio.name = 'search[cats][' + config.cats[i].parent + ']';
			$radio.setAttribute('data-parent-target', 'search-cat-item-' + parent_cid);
			$label.appendChild($radio);
			
			var $tx = document.createElement('span');
			$tx.className = 'tx';
			$tx.innerHTML = config.cats[i].name;
			$label.appendChild($tx);
			
			cache.$parent_cat.appendChild($label);

			
			if(!$cat_child){
				$cat_child = document.createElement('div');
				$cat_child.id = 'search-cat-item-' + parent_cid;
				$cat_child.className = 'search-cat';
				/** create null opt */
				create_null_opt($cat_child, parent_cid);
				$radio.addEventListener('change',event_cat_change);
			}
			$cat_child.appendChild($label);
		}
		if($cat_child)
			cache.$cat_container.appendChild($cat_child);
		/** submit */
		go_submit();
	}
}
/** tags *************************************** */
function tags(){
	cache.$tags = document.querySelectorAll('.ss-tag-input');
	if(!cache.$tags[0])
		return;
	/** bind */
	for( var i = 0, len = cache.$tags.length; i < len; i++){
		cache.$tags[i].addEventListener('change',event_tag_change);
	}
}
function event_tag_change(e){
	go_submit();
}




/** search ************************************* */
function search(){
	cache.$fm = I('fm-search-page');
	cache.$result_container = I('ss-result-container');
	cache.$s = I('search-page-s');
	if(!cache.$fm || !cache.$result_container)
		return;
	cache.$fm.addEventListener('submit', event_submit);
}
function event_submit(e){
	e.preventDefault();
	go_submit();
}
function go_submit(){
	/** ajax tip */
	ajax_loading_tip('loading', window.THEME_CONFIG.lang.M01);

	var xhr = new XMLHttpRequest(),
		fd = new FormData(cache.$fm);
	xhr.open('post',config.process_url + '&theme-nonce=' + window.DYNAMIC_REQUEST['theme-nonce']);
	xhr.send(fd);
	xhr.onload = function(){
		if(xhr.status >= 200 && xhr.status < 400){
			var data = xhr.responseText;
			try{data=JSON.parse(xhr.responseText)}catch(err){}
			if(data.status === 'success'){
				ajax_loading_tip('hide');
				cache.$result_container.innerHTML = data.content;
			}else if(data.status === 'error'){
				ajax_loading_tip(data.status, data.msg,3);
				cache.$s.focus();
			}else{
				ajax_loading_tip('error', data);
			}
		}else{
			ajax_loading_tip('error', window.THEME_CONFIG.lang.E01);
		}
	};
	xhr.onerror = function(){
		ajax_loading_tip('error', window.THEME_CONFIG.lang.E01);
	};
}
function I(e){
	return document.getElementById(e);
}
	
}