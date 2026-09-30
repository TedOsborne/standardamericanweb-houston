(function(){
  'use strict';
  var header=document.querySelector('.site-header'),toggle=document.querySelector('.menu-toggle'),drawer=document.querySelector('.fit-drawer'),overlay=document.querySelector('.drawer-overlay'),lastFocus=null;
  function setHeader(){if(header)header.classList.toggle('scrolled',window.scrollY>24)}
  setHeader();window.addEventListener('scroll',setHeader,{passive:true});
  if(toggle&&header){toggle.addEventListener('click',function(){var open=header.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(open))})}
  document.querySelectorAll('.nav-drop>button').forEach(function(button){button.addEventListener('click',function(){button.parentElement.classList.toggle('open')})});
  document.querySelectorAll('.nav-links a').forEach(function(link){link.addEventListener('click',function(){if(header)header.classList.remove('menu-open')})});
  function openDrawer(){lastFocus=document.activeElement;document.body.classList.add('drawer-open');drawer&&drawer.setAttribute('aria-hidden','false');setTimeout(function(){var c=document.querySelector('.drawer-close');if(c)c.focus()},50)}
  function closeDrawer(){document.body.classList.remove('drawer-open');drawer&&drawer.setAttribute('aria-hidden','true');if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  document.querySelectorAll('[data-open-fit]').forEach(function(el){el.addEventListener('click',openDrawer)});
  document.querySelectorAll('[data-close-fit]').forEach(function(el){el.addEventListener('click',closeDrawer)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.body.classList.contains('drawer-open'))closeDrawer()});
  var reveals=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver'in window)){reveals.forEach(function(el){el.classList.add('visible')});return}
  var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.12});
  reveals.forEach(function(el){observer.observe(el)});
})();
