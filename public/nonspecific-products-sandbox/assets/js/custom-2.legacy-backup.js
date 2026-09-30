/**
Core script to handle the entire theme and core functions
**/
var MySelf = function(){
	/* Search Bar ============ */
	var screenWidth = $( window ).width();
	
	var kenburnSlider = function(){
		if($("#kenburn").length > 0)
		{ 
			$("#kenburn").slippry({
				 transition: 'kenburns',
				 useCSS: false,
				 speed: 3000,
				 pause: 3000,
				 auto: true,
				 kenZoom: 105,
				 preload: 'visible',
				 autoHover: false
			});
		}
	}
	
	var parallex = function(){
		if($(".parallax").length > 0)
		{ 
			var currentX = '';
			var currentY = '';
			var movementConstant = .015;
			$(document).on('mousemove',function(e) {
				  if(currentX == '') currentX = e.pageX;
				  var xdiff = e.pageX - currentX;
				  currentX = e.pageX;
				   if(currentY == '') currentY = e.pageY;
				  var ydiff = e.pageY - currentY;
				  currentY = e.pageY; 
				  $('.parallax div').each(function(i, el) {
					  var movement = (i + 1) * (xdiff * movementConstant);
					  var movementy = (i + 1) * (ydiff * movementConstant);
					  var newX = $(el).position().left + movement;
					  var newY = $(el).position().top + movementy;
					  $(el).css('left', newX + 'px');
					  $(el).css('top', newY + 'px');
				  });
			});
		}
	}
	
	var handleSideBarMenu = function(){
		
		jQuery('.menu-btn').on('click', function(){
			jQuery('.header-nav, .menu-btn').toggleClass('active');
		});
		
		if(screenWidth < 999)
		{
			jQuery('.header-nav, .menu-btn').removeClass('active');
		}
		
	}
	
	/* WOW ANIMATION ============ */
	var wow_animation = function(){
		if($('.wow').length > 0)
		{
			var wow = new WOW(
			{
			  boxClass:     'wow',      // animated element css class (default is wow)
			  animateClass: 'animated', // animation css class (default is animated)
			  offset:       -200,          // distance to the element when triggering the animation (default is 0)
			  mobile:       false       // trigger animations on mobile devices (true is default)
			});
			wow.init();	
		}	
	}
	
	
	var handlePlaceholderAnimation = function()
	{
		if(jQuery('.dezPlaceAni').length)
		{
		
			$('.dezPlaceAni input, .dezPlaceAni textarea').on('focus',function(){
			  $(this).parents('.form-group, .news-box').addClass('focused');
			});
			
			$('.dezPlaceAni input, .dezPlaceAni textarea').on('blur',function(){
			  var inputValue = $(this).val();
			  if ( inputValue == "" ) {
				$(this).removeClass('filled');
				$(this).parents('.form-group, .news-box').removeClass('focused');  
			  } else {
				$(this).addClass('filled');
			  }
			})
		}
	}
	
	var handleVideoFullScreen = function()
	{
		if(jQuery('.video').length)
		{
		
			var $windowHeight = $(window).height();
			var $videoHeight = $(".video").outerHeight();
			var $scale = $windowHeight / $videoHeight;

			if ($videoHeight <= $windowHeight) {
				$(".video").css({
					"-webkit-transform" : "scale("+$scale+") translateY(-50%)",
					"transform" : "scale("+$scale+") translateY(-50%)"
				});
			};
		}
		
		if(screenWidth < 1025)
		{
			$("#video-iframe").remove();
		}	
	}
	
	/* Masonry Box ============ */
	var masonryBox = function(){
		'use strict';
		/* masonry by  = bootstrap-select.min.js */
		if(jQuery('#masonry, .masonry').length)
		{
			var self = $("#masonry, .masonry");
			if(jQuery('.card-container').length)
		    {
				self.imagesLoaded(function () {
					self.masonry({
						gutterWidth: 15,
						isAnimated: true,
						itemSelector: ".card-container"
					});
				});
			}
		}
		if(jQuery('.filters').length)
		{
			jQuery(".filters").on('click','li',function(e) {
				e.preventDefault();
				var filter = $(this).attr("data-filter");
				self.masonryFilter({
					filter: function () {
						if (!filter) return true;
						//return $(this).attr("data-filter") == filter;
						return $(this).hasClass(filter);
					}
				});
			});
		}
		/* masonry by  = bootstrap-select.min.js end */
	}
	
	/* Light Gallery ============ */
	var lightGallery = function (){
		if(($('#lightgallery, .lightgallery').length > 0)){
			$('#lightgallery, .lightgallery').lightGallery({
				selector : '.check-km',
				loop:true,
				thumbnail:true,
				exThumbImage: 'data-exthumbimage'
			});
		}
	}
	
	var reposition = function (){
		'use strict';
		var modal = jQuery(this),
		dialog = modal.find('.modal-dialog');
		modal.css('display', 'block');
		
		/* Dividing by two centers the modal exactly, but dividing by three 
		 or four works better for larger screens.  */
		dialog.css("margin-top", Math.max(0, (jQuery(window).height() - dialog.height()) / 2));
	}
	
	/* Header Fixed ============ */
	var headerFix = function(){
		'use strict';
		/* Main navigation fixed on top  when scroll down function custom */		
		jQuery(window).bind('scroll', function () {
			if(jQuery('.sticky-header').length)
			{
				var menu = jQuery('.sticky-header');
				if ($(window).scrollTop() > menu.offset().top) {
					menu.addClass('is-fixed');
				} else {
					menu.removeClass('is-fixed');
				}
			}
		});
		/* Main navigation fixed on top  when scroll down function custom end*/
	}
	
	var pointerEffect = function(){
		/* 
			pointer.js was created by OwL for use on websites, 
			 and can be found at https://seattleowl.com/pointer.
		*/

		const pointer = document.createElement("div")
		pointer.id = "pointer-dot"
		const ring = document.createElement("div")
		ring.id = "pointer-ring"
		document.body.insertBefore(pointer, document.body.children[0])
		document.body.insertBefore(ring, document.body.children[0])

		let mouseX = -100
		let mouseY = -100
		let ringX = -100
		let ringY = -100
		let isHover = false
		let mouseDown = false
		const init_pointer = (options) => {

			window.onmousemove = (mouse) => {
				mouseX = mouse.clientX
				mouseY = mouse.clientY
			}

			window.onmousedown = (mouse) => {
				mouseDown = true
			}

			window.onmouseup = (mouse) => {
				mouseDown = false
			}

			const trace = (a, b, n) => {
				return (1 - n) * a + n * b;
			}
			window["trace"] = trace

			const getOption = (option) => {
				let defaultObj = {
					pointerColor: "#750c7e",
					ringSize: 15,
					ringClickSize: (options["ringSize"] || 15) - 5,
				}
				if (options[option] == undefined) {
					return defaultObj[option]
				} else {
					return options[option]
				}
			}

			const render = () => {
				ringX = trace(ringX, mouseX, 0.2)
				ringY = trace(ringY, mouseY, 0.2)

				if (document.querySelector(".p-action-click:hover")) {
					pointer.style.borderColor = getOption("pointerColor")
					isHover = true
				} else {
					pointer.style.borderColor = "white"
					isHover = false
				}
				ring.style.borderColor = getOption("pointerColor")
				if (mouseDown) {
					ring.style.padding = getOption("ringClickSize") + "px"
				} else {
					ring.style.padding = getOption("ringSize") + "px"
				}

				pointer.style.transform = `translate(${mouseX}px, ${mouseY}px)`
				ring.style.transform = `translate(${ringX - (mouseDown ? getOption("ringClickSize") : getOption("ringSize"))}px, ${ringY - (mouseDown ? getOption("ringClickSize") : getOption("ringSize"))}px)`

				requestAnimationFrame(render)
			}
			requestAnimationFrame(render)
		}

		init_pointer({});
	}
	
	/* Counter Number ============ */
	var counter = function(){
		if(jQuery('.counter').length)
		{
			jQuery('.counter').counterUp({
				delay: 20,
				time: 1000
			});	
		}
	}
	
	/* Function ============ */
	return {
		init:function(){
			masonryBox();
			//wow_animation();
			headerFix();
			handleSideBarMenu();
			handlePlaceholderAnimation();
			lightGallery();
			kenburnSlider();
			parallex();
			pointerEffect();
			jQuery('.modal').on('show.bs.modal', reposition);
		},
		load:function(){
			handleVideoFullScreen();
			counter();
		},
		resize:function(){
			screenWidth = $( window ).width();
			handleSideBarMenu();
			setTimeout(function(){
			  masonryBox();
			},2000);
			handleVideoFullScreen();
		},
	}
	
}();

/* Document.ready Start */	
jQuery(document).ready(function() {
  MySelf.init();
});
/* Document.ready END */
/* Window Load START */
jQuery(window).on("load", function (e) {
	MySelf.load();
	setTimeout(function(){
		jQuery('#loading-area').remove();
	}, 1000);
});
/*  Window Load END */
/* Window resize START */
jQuery(window).on("resize", function (e) {
	MySelf.resize();
});
/*  Window resize END */