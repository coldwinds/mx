
define(function(require,exports,module){'use strict';var tools=require('modules/tools');var cache={};exports.init=function(){tools.ready(exports.bind);}
exports.bind=function(){cache.$boxes=document.querySelectorAll('.homebox');if(!cache.$boxes[0])
return;cache.ori_offset_left=getElementLeft(document.getElementById('sidebar-container'));cache.ori_offset_top=getElementTop(cache.$boxes[0]);create_nav();}
function set_nav_style(){cache.$nav.style.left=cache.ori_offset_left+'px';cache.$nav.style.top=cache.ori_offset_top+'px';}
function append_content_nav(){for(var i=0,len=cache.$boxes.length;i<len;i++){var $title=cache.$boxes[i].querySelector('.mod-title a'),title=$title.textContent,icon_class=$title.querySelector('i').getAttribute('class'),$item=document.createElement('a');$item.href='#'+cache.$boxes[i].id;$item.title=title;$item.innerHTML='<i class="'+icon_class+' fa-fw"></i>';$item.addEventListener('click',function(e){e.preventDefault();scrollTo(0,getElementTop(cache.$boxes[i])-40);});cache.$nav.appendChild($item);}}
function create_nav(){cache.$nav=document.createElement('nav');cache.$nav.id='homebox-nav';append_content_nav();set_nav_style();document.body.appendChild(cache.$nav);}
function getElementLeft(e){var l=e.offsetLeft,c=e.offsetParent;while(c!==null){l+=c.offsetLeft;c=c.offsetParent;}
return l;}
function getElementTop(e){var l=e.offsetTop,c=e.offsetParent;while(c!==null){l+=c.offsetTop;c=c.offsetParent;}
return l;}});