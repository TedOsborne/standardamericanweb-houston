https://checkoutlinks.standardamericanweb.com/saw-1500-microsite-html-dev-ls-857443https://checkoutlinks.standardamericanweb.com/saw-1500-microsite-html-dev-ls-857443https://checkoutlinks.standardamericanweb.com/saw-1500-microsite-html-dev-ls-857443
  /*------------------------------------------------------------------------------*/
  /* One Page setting
  /*------------------------------------------------------------------------------*/  

    var $doc = $(document),
        $sections = $('.section'),
        $menu = $('.menu > ul > li'),
        $body = $('html,body');

    var topToIndex = function(scrollTop) {
      var offsetTop = 0,
          indexlastSection;
      $sections.each(function(i){
        offsetTop = $(this).offset().top;
        if ( scrollTop > offsetTop ) {
            indexlastSection = i;
        }
      })
      return indexlastSection;
    }

    var retrieveActive = function() {
      var scrollTop = $doc.scrollTop(),
          activeIndex = topToIndex(scrollTop);
      $('#debug').text( scrollTop )
      
      $sections.removeClass('active').eq(activeIndex).addClass('active')
      $menu.removeClass('active').eq(activeIndex).addClass('active')
      
      return activeIndex;
    }

    $(function() {
        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
              if (target.length) {
                
                    if ( $(window).width() > 992) { 

                        $body.animate({
                        scrollTop: target.offset().top - 80
                        }, 400);
                        return false;
                    }
                    else {

                       $body.animate({
                        scrollTop: target.offset().top
                        }, 400);
                        return false; 
                    }

              }
            }
        });
    });


    $('.site-navigation .menu  ul  li').click(function (e) {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
        else {
            $(this).addClass("active");
        }
    });


    /* footer_customheading */
 jQuery(window).load(function(){
    var $li = jQuery('.footer_customheading span');
    $li.hide().first().show().addClass('active');

    function footerloop() {
        jQuery('.footer_customheading .active').each(function(index){
            var $this = jQuery(this);
            var $next = $this.next().length > 0 ? $this.next() : $li.first();

            $this.hide().removeClass('active');
            $next.show().addClass('active');

            if( $next.index() == 0) {
               // clearInterval(myTimer);
                setTimeout(function(){
                    //myTimer=setInterval(function(){loop()},1000);
                }, 3000);
            }
        });
    }

    setInterval(function(){footerloop()},2000);//timer running every 2 seconds


});

 
/*------------------------------------------------------------------------------*/
/* Preloader
/*------------------------------------------------------------------------------*/
   // makes sure the whole site is loaded
    $(window).on("load", function () {
        $(".loader-blob").fadeOut();
        $("#preloader").delay(300).fadeOut('slow',function(){
        $(this).remove();
      }); 

    });


/*------------------------------------------------------------------------------*/
/* Fixed-header
/*------------------------------------------------------------------------------*/

$(window).scroll(function(){
    if ( matchMedia( 'only screen and (min-width: 1200px)' ).matches ) 
    {
        if ($(window).scrollTop() >= 30 ) {
            $('.prt-stickable-header').addClass('fixed-header');
            $('.prt-stickable-header').addClass('visible-title');
        }
        else {

            $('.prt-stickable-header').removeClass('fixed-header');
            $('prt-stickable-header').removeClass('visible-title');
            }
    }
});


/*------------------------------------------------------------------------------*/
/* Menu
/*------------------------------------------------------------------------------*/

    $('ul li:has(ul)').addClass('has-submenu');
    $('ul li ul').addClass('sub-menu');


    $("ul.dropdown li").on({

        mouseover: function(){
           $(this).addClass("hover");
        },  
        mouseout: function(){
           $(this).removeClass("hover");
        }, 

    });
    
    var $menu = $('#menu'), $menulink = $('#menu-toggle-form'), $menuTrigger = $('.has-submenu > a');
    $menulink.on('click',function (e) {

        $menulink.toggleClass('active');
        $menu.toggleClass('active');
    });

    $menuTrigger.on('click',function (e) {
        e.preventDefault();
        var t = $(this);
        t.toggleClass('active').next('ul').toggleClass('active');
    });

    $('ul li:has(ul)');

/*------------------------------------------------------------------------------*/
/* Tab
/*------------------------------------------------------------------------------*/ 

    $('.prt-tabs').each(function() {
        $(this).children('.content-tab').children().hide();
        $(this).children('.content-tab').children().first().show();
        $(this).find('.tabs').children('li').on('click', function(e) {  
        var liActive = $(this).index(),
        contentActive = $(this).siblings().removeClass('active').parents('.prt-tabs').children('.content-tab').children().eq(liActive);
        contentActive.addClass('active').fadeIn('slow');
        contentActive.siblings().removeClass('active');
        $(this).addClass('active').parents('.prt-tabs').children('.content-tab').children().eq(liActive).siblings().hide();
        e.preventDefault();
        });
    });

    $(document).ready(function() {
        $('.prt-tabs.slider-tab > .tabs').children('li').on('click', function(e) {  
            var tab = $(this).closest('.prt-tabs > .tabs > .tab'), 
            index = $(this).closest('.prt-tabs > .tabs > li').index();
            $(this).parents('.prt-tabs').children(' .tabs').children('li.active ').removeClass('active'); 
            $(this).addClass('active'); 
            $(this).addClass('active').parents('.prt-tabs').children('.content-tab').find('.content-inner').not('.content-inner:eq(' + index + ')').slideUp();
            $(this).addClass('active').parents('.prt-tabs').children('.content-tab').find('.content-inner:eq(' + index + ')').slideDown();
            e.preventDefault();
        });
    });
/*------------------------------------------------------------------------------*/
/* Accordion
/*------------------------------------------------------------------------------*/

    var allPanels = $('.accordion > .toggle').children('.toggle-content').hide();

    $('.toggle-title').on('click',function(e) {

        e.preventDefault();
        var $this = $(this);
            $this.parent().parent().find('.toggle .toggle-title a').removeClass('active');

        if ($this.next().hasClass('show')) {

            $this.next().removeClass('show');   
            $this.next().slideUp('easeInExpo');

        } else {
            $this.parent().parent().find('.toggle .toggle-content').removeClass('show');
            $this.parent().parent().find('.toggle .toggle-content').slideUp('easeInExpo');
            $this.next().toggleClass('show');
            $this.next().removeClass('show');
            $this.next().slideToggle('easeInExpo');
           $this.next().parent().children().children().addClass('active');

        }

    });

/*------------------------------------------------------------------------------*/
/* Slick_slider
/*------------------------------------------------------------------------------*/
    $(".slick_slider").slick({
        infinite: true,
        arrows: false,
        dots: false,                   
        autoplay: true,
        centerMode : false,
        autoplaySpeed: 0,
        speed: 5000,
        cssEase: "linear",
        pauseOnHover: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerPadding:'30px',

        responsive: [{

            breakpoint: 1360,
            settings: {
            slidesToShow: 4,
            slidesToScroll: 3
            }
        },
        {

            breakpoint: 1024,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3
            }
        },
        {

            breakpoint: 680,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    $(".slick_slider_rtl").slick({
        infinite: true,
        arrows: false,
        dots: false,                   
        autoplay: true,
        centerMode : false,
        rtl: true,
        autoplaySpeed: 0,
        speed: 5000,
        cssEase: "linear",
        pauseOnHover: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerPadding:'30px',

        responsive: [{

            breakpoint: 1360,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3
            }
        },
        {

            breakpoint: 1024,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3
            }
        },
        {

            breakpoint: 680,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });




    
/*------------------------------------------------------------------------------*/
/* Show & Hide
/*------------------------------------------------------------------------------*/

 $('.close-icon').click(function() {
    $('.top-instruction').hide(0);
    $('.close-icon').hide(0);
});


/*------------------------------------------------------------------------------*/
/* Back to top
/*------------------------------------------------------------------------------*/

// ===== Scroll to Top ==== 
jQuery('#totop').hide();
jQuery(window).scroll(function() {
    "use strict";
    if (jQuery(this).scrollTop() >= 100) {        // If page is scrolled more than 50px
        jQuery('#totop').fadeIn(200);    // Fade in the arrow
        jQuery('#totop').addClass('top-visible');
    } else {
        jQuery('#totop').fadeOut(200);   // Else fade out the arrow
        jQuery('#totop').removeClass('top-visible');
    }
});
jQuery('#totop').click(function() {      // When arrow is clicked
    jQuery('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
    return false;
});
  
