(function (window, document) {
  'use strict';

  var lastFocus = null;

  function createOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'saw-livepreview-overlay';
    overlay.id = 'sawLivePreview';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Explore all our services');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<iframe title="LivePreview" src="nonspecific-products-sandbox/livepreview-original/index.html?v=20260821-2" allowtransparency="true"></iframe>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function openPreview(trigger) {
    var overlay = document.querySelector('.saw-livepreview-overlay') || createOverlay();
    lastFocus = trigger || document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('saw-livepreview-is-open');
  }

  function closePreview() {
    var overlay = document.querySelector('.saw-livepreview-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('saw-livepreview-is-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function addTrigger() {
    var mockup = document.querySelector('#demos img[alt*="Responsive website mockup"], #demos img[alt*="responsive website mockup"]');
    var row = mockup && mockup.closest('.row');
    if (!row || document.querySelector('.saw-preview-invite--primary')) return;
    var wrap = document.createElement('div');
    wrap.className = 'saw-preview-invite saw-preview-invite--primary';
    wrap.innerHTML = '<div class="saw-preview-invite__copy"><span class="saw-preview-invite__eyebrow">Your website is only the beginning</span>' +
      '<strong>Discover the other services that can help your business grow.</strong>' +
      '<p>This page focuses on business website design. Open our service showcase to explore WordPress, online stores, AI employees, business automation, marketing, reputation management, staffing, and more.</p></div>' +
      '<button class="saw-preview-trigger" type="button" data-livepreview-open data-livepreview-primary>Explore Our Services</button>';
    row.parentNode.insertBefore(wrap, row.nextSibling);
  }

  // Handle service preview activation before hero/slider navigation handlers.
  // Native button clicks cover mouse, touch, Enter, and Space.
  window.addEventListener('click', function (event) {
    var target = event.target;
    var trigger = target && target.closest && target.closest('[data-livepreview-open], [data-preview-open], #sawHeroServices');
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openPreview(trigger);
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closePreview();
  });

  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'saw-livepreview-close') closePreview();
    if (event.data && event.data.type === 'saw-livepreview-redesign-cart') {
      closePreview();
      var checkout = document.getElementById('checkout-cart');
      if (checkout) {
        window.setTimeout(function () {
          checkout.scrollIntoView({ behavior: 'smooth', block: 'start' });
          var redesignStep = document.querySelector('#sawWizard-box .sf-nav-step[data-step="3"]');
          if (redesignStep) redesignStep.click();
        }, 80);
      }
    }
  });

  function init() { addTrigger(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}(window, document));
