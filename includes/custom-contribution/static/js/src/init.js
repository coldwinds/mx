define(function(require, exports, module){
	'use strict';
	var tools = require('modules/tools'),
		js_request 	= require('theme-cache-request');
		
	exports.config = {
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
			E01 : 'Sorry, server is busy now, can not respond your request, please try again later.'
		}
	}
	var config = exports.config,
		cache = {};
	exports.init = function(){
		tools.ready(exports.bind);
	}
	function I(e){
		return document.getElementById(e);
	}
	exports.bind = function(){
		cache.$fm = 				I('fm-ctb');
		cache.$post_id = 			I('ctb-post-id');
		cache.$post_title = 		I('ctb-title');
		cache.$post_excerpt = 		I('ctb-excerpt');
		cache.$file_area = 			I('ctb-file-area');
		cache.$file_btn = 			I('ctb-file-btn');
		cache.$file = 				I('ctb-file');
		cache.$files = 				I('ctb-files');
		cache.$file_progress = 		I('ctb-file-progress');
		cache.$file_completion_tip = I('ctb-file-completion');
		cache.$file_progress_bar = 	I('ctb-file-progress-bar');
		cache.$file_progress_tx = 	I('ctb-file-progress-tx');
		
		cache.$split_number = 		I('ctb-split-number');

		if(!cache.$fm) 
			return false;
			
		load_thumbnails();
		
		upload();

		cats();
		
		toggle_reprint_group();
		
		fm_validate(cache.$fm);	

		/** auto save */
		exports.auto_save.bind();
	}

	/**
	 * auto save
	 */
	exports.auto_save = {
		config : {
			save_interval : 5,
			lang : {
				M01 : 'You have a auto save version, do you want to restore? Auto-save in last {seconds} seconds.',
				M02 : 'Restore completed.', 
			}
		},
		timer : false,
		bind : function(){
			var that = this;
			/** set save key */
			that.save_key = 'auto-save' + cache.$post_id.value;
			
			that.check_version();
			
			/** save data per x seconds */
			that.timer = setInterval(that.save, that.config.save_interval * 1000);
		},
		/** action check version */
		check_version : function(){
			var that = this;
			var data = localStorage.getItem(that.save_key);
			if(!data)
				return false;
			data = JSON.parse(data);
			if(!data)
				return false;
			
			var msg = that.config.lang.M01.replace('{seconds}',that.config.save_interval);
			if(!confirm(msg))
				return false;
			
			that.restore();
			tools.ajax_loading_tip('success',that.config.lang.M02,3);
		},
		del : function(){
			localStorage.removeItem(that.save_key);
			clearInterval(that.timer);
		},
		/** action save */
		save : function(){
			var data = {
				title : cache.$post_title.value,
				excerpt : cache.$post_excerpt.value,
				content : tinymce.editors['ctb-content'].getContent(),
			};
			/** storage */
			if(document.querySelector('.theme_custom_storage-group')){
				data.storage = {};
				cache.$storage_items = document.querySelectorAll('.theme_custom_storage-item');
				for(var i=0, len=cache.$storage_items.length; i<len; i++){
					if(!data.storage[i])
						data.storage[i] = {};
					data.storage[i] = {
						type : I('theme_custom_storage-' + i + '-type').value,
						url : I('theme_custom_storage-' + i + '-url').value,
						download_pwd : I('theme_custom_storage-' + i + '-download-pwd').value,
						extract_pwd : I('theme_custom_storage-' + i + '-extract-pwd').value
					};
				}
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
			}
			/** source */
			var $source = document.querySelector('.theme_custom_post_source-source-radio:checked');
			if($source){
				data.source = {
					source : $source.value,
					reprint_url : I('theme_custom_post_source-reprint-url').value,
					reprint_author : I('theme_custom_post_source-reprint-author').value
				};
			}
			console.log(data);
			localStorage.setItem('auto-save',JSON.stringify(data));
		},
		/** action restore */
		restore : function(){
			var that = this;
			var data = localStorage.getItem('auto-save');
			if(!data)
				return false;
			data = JSON.parse(data);
			if(!data)
				return false;
			/** post title */
			if(data.title)
				cache.$post_title.value = data.title;
				
			/** post excerpt */
			if(data.excerpt)
				cache.$post_excerpt.value = data.excerpt;

			/** post content */
			if(data.content)
				content : tinymce.editors['ctb-content'].setContent(data.content);
				
			/** storage */
			if(data.storage){
				for(var i in data.storage){
					var $item = I('theme_custom_storage-' + i + '-type');
					if($item){
						item_option_select : {
							for(var j=0,len=$item.options;j<len;j++){
								if($item.options[j].value === data.storage[i].type){
									$item.options[j].selected = true;
									break item_option_select;
								}
							}
						}
					}
						
					$item =	I('theme_custom_storage-' + i + '-url');
					if($item)
						$item.value = data.storage[i].url;
						
					$item =	I('theme_custom_storage-' + i + '-download-pwd');
					if($item)
						$item.value = data.storage[i].download_pwd;
						
					$item = I('theme_custom_storage-' + i + '-extract-pwd');
					if($item)
						$item.value = data.storage[i].extract_pwd;
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
					if($item)
						$item.checked = true;
					if($reprint_url)
						$reprint_url.value = data.source.reprint_url;
					if($reprint_url)
						$reprint_author.value = data.source.reprint_author;
				}
			}
		}
	};
	
	
	
	/**
	 * send_to_editor
	 * 
	 * @return 
	 * @version 1.0.0
	 */
	function send_to_editor(h) {
		var ed, mce = typeof(tinymce) != 'undefined', qt = typeof(QTags) != 'undefined';

		if ( !wpActiveEditor ) {
			if ( mce && tinymce.activeEditor ) {
				ed = tinymce.activeEditor;
				wpActiveEditor = ed.id;
			} else if ( !qt ) {
				return false;
			}
		} else if ( mce ) {
			if ( tinymce.activeEditor && (tinymce.activeEditor.id == 'mce_fullscreen' || tinymce.activeEditor.id == 'wp_mce_fullscreen') )
				ed = tinymce.activeEditor;
			else
				ed = tinymce.get(wpActiveEditor);
		}

		if ( ed && !ed.isHidden() ) {
			// restore caret position on IE
			if ( tinymce.isIE && ed.windowManager.insertimagebookmark )
				ed.selection.moveToBookmark(ed.windowManager.insertimagebookmark);

			if ( h.indexOf('[caption') !== -1 ) {
				if ( ed.wpSetImgCaption )
					h = ed.wpSetImgCaption(h);
			} else if ( h.indexOf('[gallery') !== -1 ) {
				if ( ed.plugins.wpgallery )
					h = ed.plugins.wpgallery._do_gallery(h);
			} else if ( h.indexOf('[embed') === 0 ) {
				if ( ed.plugins.wordpress )
					h = ed.plugins.wordpress._setEmbed(h);
			}

			ed.execCommand('mceInsertContent', false, h);
		} else if ( qt ) {
			QTags.insertContent(h);
		} else {
			document.getElementById(wpActiveEditor).value += h;
		}

		try{tb_remove();}catch(e){};
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
	}
	/**
	 * file_upload
	 */
	function file_upload(file){
		var	reader = new FileReader();
		reader.onload = function (e) {
			file_submission(file);
		};
		reader.readAsDataURL(file);
	}
	/**
	 * file_submission
	 */
	function file_submission(file){
		file_beforesend_callback();
		var fd = new FormData(),
			xhr = new XMLHttpRequest();

		fd.append('type','upload');
		fd.append('theme-nonce',js_request['theme-nonce']);
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
				var percent = e.loaded / e.total * 100;		
				cache.$file_progress_bar.style.width = percent + '%';
			}
		};
		xhr.send(fd);
	}
	function file_beforesend_callback(){
		var tx = config.lang.M02.format(cache.file_index + 1,cache.file_count);
		cache.$file_progress_bar.style.width = '10%';
		uploading_tip('loading',tx);
	}
	function file_error_callback(msg){
		msg = msg ? msg : config.lang.E01;
		uploading_tip('error',msg);
	}
	/** 
	 * upload_started
	 */
	function upload_started(i,file,count){
		var t = config.lang.M02.format(i,count);
		uploading_tip('loading',t);
	}
	function file_complete_callback(data){
		try{data = JSON.parse(data)}catch(error){}
		cache.file_index++;
		/** 
		 * success
		 */
		if(data && data.status === 'success'){
			append_tpl(data);
			/** send to editor */
			var editor_content = send_content({
				attach_page_url : data['attach-page-url'],
				width : data.large.width,
				height : data.large.height,
				img_url : data[config.default_size].url
			});
			
			/** nextpage checked */
			if(cache.$split_number.value >= 1 && cache.file_index > 1){
				if(cache.file_index % cache.$split_number.value == 0)
					editor_content = '<!--nextpage-->' + editor_content;
			}
			send_to_editor(editor_content);
		
			/** 
			 * check all thing has finished, if finished
			 */
			if(cache.file_count === cache.file_index){
				var tx = config.lang.M04.format(cache.file_index,cache.file_count);
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
	 * args = {
		original,
		thumbnail,
		medium
		attach-id
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
				
				'<a href="javascript:;" class="btn btn-primary btn-block ctb-insert-btn" id="ctb-insert-' + args['attach-id'] + '" data-size="large" data-attach-page-url="' + args['attach-page-url'] + '" data-width="' + args['large']['width'] + '" data-height="' + args['large']['height'] + '"><i class="fa fa-plug"></i> ' + config.lang.M09 + '</a>' +
				
				'<input type="radio" name="ctb[thumbnail-id]" id="img-thumbnail-' + args['attach-id'] + '" value="' + args['attach-id'] + '" hidden class="img-thumbnail-checkbox" required >' +
				
				'<label for="img-thumbnail-' + args['attach-id'] + '" class="ctb-set-cover-btn"><i class="fa fa-star"></i> ' + config.lang.M07 + '</label>' +
				
				'<input type="hidden" name="ctb[attach-ids][]" value="' + args['attach-id'] + '" >';
				
		$tpl.id = 'img-' + args['attach-id'];
		$tpl.setAttribute('class','thumbnail-tpl col-xs-6 col-sm-3 col-md-2');
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
				send_to_editor(send_content({
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
	function send_content(data){
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
			cache.$file_progress_tx.innerHTML = tools.status_tip('loading',text);
			cache.$file_progress.style.display = 'block';
			cache.$file_area.style.display = 'none';
			cache.$file_completion_tip.style.display = 'none';
		/** 
		 * success status
		 */
		}else{
			cache.$file_completion_tip.innerHTML = tools.status_tip(status,text)
			cache.$file_completion_tip.style.display = 'block';
			cache.$file_progress.style.display = 'none';
			cache.$file_area.style.display = 'block';
		}
	}/** end uploading_tip */

	function fm_validate($fm){
		var m = new tools.validate();
			m.process_url = config.process_url;
			m.loading_tx = config.lang.M01;
			m.error_tx = config.lang.E01;
			m.$fm = $fm;
			m.done = function(data){
				if(config.edit){
					$fm.querySelector('.submit').removeAttribute('disabled');
				}
			};
			m.init();
		
	}
	function cats(){
		if(!config.cats)
			return false;
		cache.$cat_child = document.querySelectorAll('.ctb-cat-child');

		if(!cache.$cat_child[0])
			return false;
			
		function event_parent_change(){
			var $target = I('ctb-cat-' + this.value);
			
			for(var i=0, len=cache.$cat_child.length; i<len; i++){
				if(cache.$cat_child[i].classList.contains('selected'))
					cache.$cat_child[i].classList.remove('selected');
				cache.$cat_child[i].setAttribute('disabled',true);
			}
			if(!$target)
				return;
			$target.classList.add('selected');
			$target.removeAttribute('disabled');
		}
		
		cache.$cat_0 = I('ctb-cat-0');
		cache.$cat_0.setAttribute('required',true);
		cache.$cat_0.addEventListener('change',event_parent_change);
	}
	function toggle_reprint_group(){
		var $radios = document.querySelectorAll('.theme_custom_post_source-source-radio'),
			$inputs = document.querySelectorAll('.theme_custom_post_source-inputs'),
			action = function($radio){
				var target = $radio.getAttribute('target'),
					$target = I(target);
				for(var i=0,len=$inputs.length;i<len;i++){
					if($target && $target.id === target){
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


});