/*!
  LivePreview Responsive Digital Product Demo Bar
  @name main.js
  @author Max Lavrentiev
  @site http://www.avirtum.com
*/
'use strict';

$(document).ready(function() {
	//=====================================================
	// Global Vars
	//=====================================================
	var _history = window.History,
	_products = [],
	_tag = null, // current tag
	_year = null, // current year
	_search = null, // current search string
	_page = 1; // current page
	
	var $products = $('#product-list .product');
	$products.each(function(index, el) {
		var $product = $(el);
		$product.detach();
		_products.push($product);
		
		if($product.hasClass('active')) {
			_page = Math.floor(index / 4)+1;
		}
	});
	
	//=====================================================
	// Functions
	//=====================================================
	function filterProducts(tag, year, search) {
		var $list = $('#product-list'),
		$pagination = $('#pagination'),
		$row = null,
		index = 0;
		
		$list.empty(); // remove all products and fill again
		
		// show filtered products
		for(var i=0;i<_products.length;i++) {
			var $productWrap = $('<div></div>').addClass('col-xs-6 col-sm-3'),
			$product = _products[i],
			jsonProduct = $product.data('product');
			
			// test filters
			if(tag != null && tag != '*' && jsonProduct.tag.toLowerCase() != tag.toLowerCase()) {
				continue;
			}
			if(year != null && year != '*' && jsonProduct.year != year) {
				continue;
			}
			if(search && jsonProduct.title.toLowerCase().indexOf(search.toLowerCase()) == -1) {
				continue;
			}
			
			if(index % 4 == 0) {
				$list.append($row);
				$row = $('<div></div>').addClass('row');
			}
			$row.append($productWrap.append($product));
			
			index++;
		}
		$list.append($row);
		
		// update filters
		$('#filters a.active').removeClass('active');
		$('#filters a[data-tag="' + tag + '"]').addClass('active');
		$('#filters a[data-year="' + year + '"]').addClass('active');
		
		var $li = $('#filters a.active').closest('.has-child');
		if($li.length) {
			$li.find('> a').addClass('active');
		}
		
		// show pagination
		$pagination.empty();
		
		var $rows = $list.find('.row'),
		$pages = $('<ul></ul>'),
		$prev = $('<li></li>').addClass('nav prev').attr('data-page','prev').append($('<a></a>').attr('href','#').append($('<i></i>').addClass('fa fa-angle-left'))),
		$next = $('<li></li>').addClass('nav next').attr('data-page','next').append($('<a></a>').attr('href','#').append($('<i></i>').addClass('fa fa-angle-right')));
		
		if($rows.length<=1) {
			return;
		}
		
		$pages.append($prev);
		$rows.each(function(index, el) {
			var $page = $('<li></li>').addClass('hidden-xs').attr('data-page',index+1).append($('<a></a>').attr('href','#').text(index+1));
			$pages.append($page);
		});
		$pages.append($next);
		
		$pagination.append($pages);
	}
	
	function updateProductsView(page) {
		var $rows = $('#product-list .row').removeClass('active show');
		$rows.each(function(index, el) {
			if(index+1 == page) {
				var $row = $(el);
				$row.addClass('active');
				$row.get(0).offsetHeight;
				$row.addClass('show');
				
				$row.find('.product img').lazyload();
				
				return false;
			}
		});
		
		$('#pagination li').removeClass('active');
		$('#pagination li[data-page="' + page + '"]').addClass('active');
		
		$('#product-list .title span').ellipsis({row:2});
	}
	
	function updateIframe(device) {
		var $iframe = $('#iframe'),
		device = device || 'desktop';
		
		$('#product-devices a.active').removeClass('active');
		$('#product-devices a[data-device="' + device + '"]').addClass('active');
		
		if(device == 'desktop') {
			$iframe.removeClass('border');
		} else {
			$iframe.addClass('border');
		}
		
		$iframe.removeClass('desktop tabletlandscape tabletportrait mobilelandscape mobileportrait').addClass(device);
	}
	
	function showProduct(saveHistory) {
		var $product = $('#product-list .product.active'),
		productJson = $product.data('product');
		
		function _showProduct(productJson) {
			if(!productJson) {
				return;
			}
			
			if(productJson.preload) {
				$('body').removeClass('iframe-loaded');
			}
			
			$('#product-name').text(productJson.title);
			$('#iframe')[0].contentWindow.location.replace(productJson.url);
			$('#product-frame-close').attr('href', productJson.url);
			$('#buy').attr('href', productJson.buy).css({'display': (productJson.buy ? '' : 'none')});
			
			if(_history.enabled && saveHistory) {
				//var uri = new URI(window.location.href);
				//uri.removeSearch('product_id');
				//uri.addSearch({product_id: productJson.id});
				var url = $.query.set('id', productJson.id);
				
				_history.pushState({id: productJson.id}, null, url.toString());
			}
		}
		
		_showProduct(productJson);
	}
	
	function toggleProductsMenu() {
		var $el = $('#product-toggle');
		$el.toggleClass('active');
		
		if($el.hasClass('active')) {
			$('body').addClass('products-active');
			$('#product-list .title span').ellipsis({row:2});
		} else {
			$('body').removeClass('products-active');
		}
	}
	
	function hideDropdownMenu() {
		$('#filters li.dropdown').removeClass('dropdown');
	}
	
	//=====================================================
	// Init Handlers
	//=====================================================
	$('#product-toggle').on('click', function() {
		toggleProductsMenu();
	});
	
	$('#product-devices a').on('click', function() {
		updateIframe($(this).data('device'));
		return false;
	});
	
	$('#filter-tags a').on('click', function() {
		var $a = $(this),
		$li = $a.closest('li'),
		tag = $a.data('tag');
		
		if($li.hasClass('has-child')) {
			$li.toggleClass('dropdown');
		} else {
			_tag = tag;
			_year = null;
			_page = 1;
			filterProducts(_tag, _year, _search);
			updateProductsView(_page);
		}
		return false;
	});
	
	$('#filter-search input').on('input', function(e) {
		_search = $(this).val();
		_page = 1;
		
		filterProducts(_tag, _year, _search);
		updateProductsView(_page);
	});
	
	$('#filter-years a').on('click', function() {
		var $a = $(this),
		$li = $a.closest('li'),
		year = $a.data('year');
		
		if($li.hasClass('has-child')) {
			$li.toggleClass('dropdown');
		} else {
			_tag = null;
			_year = year;
			_page = 1;
			filterProducts(_tag, _year, _search);
			updateProductsView(_page);
		}
		return false;
	});
	
	$('body').on('click', function() {
		hideDropdownMenu();
	});
	
	$('#products').on('click', function(e) {
		if($(e.target).is($('#products'))) {
			toggleProductsMenu();
		}
	});
	
	$('#pagination').on('click', 'a', function() {
		var page = $(this).closest('li').data('page'),
		pages = $('#product-list .row').length;
		
		_page = (page > 0 ? page : _page);
		_page = (page == 'prev' ? _page-1 : _page);
		_page = (page == 'next' ? _page+1 : _page);
		
		_page = Math.min(Math.max(_page, 1), pages);
		
		updateProductsView(_page);
		
		return false;
	});
	
	$('#product-list').on('click', '.product', function() {
		var $product = $(this);
		
		$('#product-list .product.active').removeClass('active');
		$product.addClass('active');
		
		hideDropdownMenu();
		showProduct(true);
		toggleProductsMenu();
		
		return false;
	});
	
	$('#iframe').on('load', function(e) {
		setTimeout(function() {
			//=====================================================
			// Fixes
			//=====================================================
			var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			if(is_safari) {
				var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
				version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
				
				if(version[0] < 13) {
					//---------------------------------------------------------------------
					// Solution for Safari - 1
					// Redirect a user to a demo site if he using Safari
					/*
					$('.iframe-wrap').remove();
					$('#iframe').remove();
					$('#product-devices').css({'display':'none'});
					
					var $info = $('<div>').text('Select a theme demo from the product list above to see all we have to offer').css({
						'position':'absolute',
						'top':'50%',
						'left':'50%',
						'transform':'translate(-50%,-50%)',
						'min-width':'80%',
						'padding':'20px 10px',
						'color':'#9a9a9a',
						'background':'#272727',
						'box-shadow':'0 0 10px rgba(0,0,0,0.5)',
						'border':'1px solid rgba(0,0,0,0.3)',
						'border-radius':'10px',
						'text-align':'center'
					});
					$info.appendTo($('.page'));
					
					// redirect to a demo page
					$('#product-list').on('click', '.product', function(e) {
						e.stopImmediatePropagation();
						
						var $product = $(this);
						$('#product-list .product.active').removeClass('active');
						$product.addClass('active');
						
						var jsonProduct = $product.data('product');
						if(jsonProduct) {
							$('#buy').attr('href', jsonProduct.buy).css({'display': (jsonProduct.buy ? '' : 'none')});
							window.open(jsonProduct.url, '_blank');
						}
						
						return false;
					});
					toggleProductsMenu();
					*/
					
					//---------------------------------------------------------------------
					// Solution for Safari - 2
					// It uses iframe fixes, but Safari can have issues with rendering sometimes, depends on content data.
					$('.iframe-wrap').css({
						'-webkit-overflow-scrolling':'touch',
						'overflow-y':'auto'
					});
					
					$('#product-devices').css({
						'display':'none'
					});
					
					var w = $('body').width();
					
					$('#iframe').attr('scrolling', 'no')
					.removeClass('iframe')
					.css({
						'position':'absolute',
						'top':0,
						'left':0,
						'min-width':'100%',
						'min-height':'100%',
					})
					.width(w);
				}
			}
			
			$('body').addClass('iframe-loaded')
		}, 1000);
	});
	
	if(_history.enabled) {
		_history.Adapter.bind(window, 'statechange', function() { // Note: We are using statechange instead of popstate
			var state = _history.getState(); // Note: We are using History.getState() instead of event.state
			if(state.data && state.data.id) {
				var $product = $("#product-list .product[data-product-id='" + state.data.id + "']");
				
				if(!$product.hasClass('active')) {
					$('#product-list .product.active').removeClass('active');
					$product.addClass('active');
					
					showProduct(false);
				}
			}
		});
	}
	
	//=====================================================
	// Init Page
	//=====================================================
	filterProducts(_tag, _year);
	updateProductsView(_page);
	updateIframe();
	
	//=====================================================
	// Hide Preload Overlay
	//=====================================================
	setTimeout(function() {
		$('body').addClass('page-loaded');
		showProduct(true);
	}, 3000);
});