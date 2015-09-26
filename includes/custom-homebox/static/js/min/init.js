
define(function(require,exports,module){'use strict';var tools=require('modules/tools');var cache={is_fixed:false,offset_top_sets:{},$items:[]};exports.init=function(){tools.ready(exports.bind);}
exports.bind=function(){cache.$boxes=document.querySelectorAll('.homebox');if(!cache.$boxes[0])
return;cache.len=cache.$boxes.length;cache.$last_boxes=cache.$boxes[cache.len-1];cache.ori_bottom=tools.getElementTop(cache.$last_boxes)+cache.$last_boxes.offsetHeight;cache.ori_offset_left=tools.getElementLeft(document.getElementById('sidebar-container'));cache.ori_offset_top=tools.getElementTop(cache.$boxes[0]);create_nav();bind_window_scroll();}
function bind_window_scroll(){window.addEventListener('scroll',function(e){if(this.pageYOffset>=cache.ori_offset_top-100){if(!cache.is_fixed){cache.$nav.style.position='fixed';cache.$nav.style.top='100px';cache.is_fixed=true;}}else{if(cache.is_fixed){cache.$nav.style.position='absolute';cache.$nav.style.top=cache.ori_offset_top+'px';cache.is_fixed=false;}}
for(var i in cache.offset_top_sets){if(this.pageYOffset>=i-100){if(cache.$last_item){if(cache.$last_item.classList.contains('active'))
cache.$last_item.classList.remove('active');if(!cache.$last_item.classList.contains('active'))
cache.$items[cache.offset_top_sets[i]].classList.add('active');}
if(cache.$last_item!=cache.$items[cache.offset_top_sets[i]])
cache.$last_item=cache.$items[cache.offset_top_sets[i]];}}});}
function set_nav_style(){cache.$nav.style.left=cache.ori_offset_left+'px';cache.$nav.style.top=cache.ori_offset_top+'px';}
function scroll_to(e){e.preventDefault();scrollTo(0,this.getAttribute('data-scroll-top'));}
function append_content_nav(){for(var i=0,len=cache.$boxes.length;i<len;i++){var $title=cache.$boxes[i].querySelector('.mod-title a'),title=$title.textContent,$i=$title.querySelector('i'),offsetTop=tools.getElementTop(cache.$boxes[i])-100,$item=document.createElement('a');if(!$i)
continue;var icon_class=$i.getAttribute('class');cache.offset_top_sets[offsetTop]=i;$item.setAttribute('data-scroll-top',offsetTop);$item.href='#'+cache.$boxes[i].id;$item.title=title;$item.innerHTML='<i class="'+icon_class+' fa-fw"></i>';$item.addEventListener('click',scroll_to);cache.$items[i]=$item;cache.$nav.appendChild(cache.$items[i]);}}
function create_nav(){cache.$nav=document.createElement('nav');cache.$nav.id='homebox-nav';append_content_nav();set_nav_style();document.body.appendChild(cache.$nav);}});