
define(function(require,exports,module){'use strict';var tools=require('modules/tools');exports.config={}
exports.init=function(){tools.ready(exports.bind);}
var cache={},config=exports.config;exports.bind=function(){cache.$emotion_btns=document.querySelectorAll('.comment-emotion-pop-btn');cache.$pop=document.querySelectorAll('.comment-emotion-area-pop .pop');cache.$comment=I('comment-form-comment');cache.$emotion_faces=document.querySelectorAll('.comment-emotion-area-pop a');if(!cache.$emotion_btns||!cache.$emotion_btns[0])
return;cache.pop_hide=[];cache.replaced=[];pop();insert();}
function insert(){function insert_content(e){if(e)
e.preventDefault();cache.$comment.focus();var caret_pos=cache.$comment.selectionStart,old_val=cache.$comment.value;cache.$pop[cache.active_pop_i].style.display='none';cache.$comment.value=old_val.substring(0,caret_pos)+' '+this.getAttribute('data-content')+' '+old_val.substring(caret_pos);}
for(var i=0,len=cache.$emotion_faces.length;i<len;i++){cache.$emotion_faces[i].addEventListener(tools.click_handler,insert_content);}}
function hide_pop(e){if(e)
e.stopPropagation();if(cache.$last_show_pop)
cache.$last_show_pop.style.display='none';document.body.removeEventListener(tools.click_handler,hide_pop);}
function show_pop(e){if(e)
e.stopPropagation();for(var i=0,len=cache.$pop.length;i<len;i++){if(cache.pop_hide[i]!==true){cache.$pop[i].style.display='none';cache.pop_hide[i]=true;}
if(this==cache.$emotion_btns[i]){cache.active_pop_i=i;cache.pop_hide[i]=false;cache.$pop[i].style.display='block';cache.$last_show_pop=cache.$pop[i];}}
if(!cache.replaced[cache.active_pop_i]){cache.replaced[cache.active_pop_i]=true;var $imgs=cache.$pop[cache.active_pop_i].querySelectorAll('img');for(var i=0,len=$imgs.length;i<len;i++){$imgs[i].src=$imgs[i].getAttribute('data-url');$imgs[i].removeAttribute('data-url');}}
document.body.addEventListener(tools.click_handler,hide_pop);}
function pop(){for(var i=0,len=cache.$emotion_btns.length;i<len;i++){cache.$emotion_btns[i].addEventListener(tools.click_handler,show_pop);}}
function I(e){return document.getElementById(e);}});