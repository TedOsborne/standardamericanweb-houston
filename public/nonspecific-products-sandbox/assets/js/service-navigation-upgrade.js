(function (window, document) {
  'use strict';

  function initSolutionsMenu() {
    var menu = document.querySelector('.saw-solutions-menu');
    if (!menu) return;

    var toggle = menu.querySelector('.saw-solutions-menu__toggle');
    var panel = menu.querySelector('.saw-solutions-mega');
    if (!toggle || !panel) return;

    function setOpen(open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });

    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  function initCoverflow() {
    var root = document.querySelector('[data-saw-service-coverflow]');
    if (!root) return;

    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-saw-service-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-saw-service-dot]'));
    var previous = root.querySelector('[data-saw-service-prev]');
    var next = root.querySelector('[data-saw-service-next]');
    var currentLabel = root.querySelector('[data-saw-service-current]');
    var totalLabel = root.querySelector('[data-saw-service-total]');
    var viewport = root.querySelector('.saw-service-coverflow__viewport');
    var activeIndex = 0;
    var autoplayTimer = null;
    var touchStartX = 0;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!slides.length) return;
    if (totalLabel) totalLabel.textContent = String(slides.length).padStart(2, '0');

    function signedOffset(index) {
      var raw = index - activeIndex;
      var half = slides.length / 2;
      if (raw > half) raw -= slides.length;
      if (raw < -half) raw += slides.length;
      return raw;
    }

    function render() {
      slides.forEach(function (slide, index) {
        var offset = signedOffset(index);
        var distance = Math.abs(offset);
        slide.style.setProperty('--offset', offset);
        slide.style.setProperty('--distance', distance);
        slide.dataset.distance = String(Math.min(distance, 4));
        slide.setAttribute('aria-hidden', index === activeIndex ? 'false' : 'true');
        slide.tabIndex = index === activeIndex ? 0 : -1;
      });

      dots.forEach(function (dot, index) {
        var active = index === activeIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });

      if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
      root.style.setProperty('--active-index', activeIndex);
    }

    function goTo(index, userInitiated) {
      activeIndex = (index + slides.length) % slides.length;
      render();
      if (userInitiated) restartAutoplay();
    }

    function stopAutoplay() {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    function startAutoplay() {
      if (reducedMotion || document.hidden) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(function () {
        goTo(activeIndex + 1, false);
      }, 6500);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    previous && previous.addEventListener('click', function () { goTo(activeIndex - 1, true); });
    next && next.addEventListener('click', function () { goTo(activeIndex + 1, true); });

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () { goTo(index, true); });
    });

    slides.forEach(function (slide, index) {
      slide.addEventListener('click', function (event) {
        if (index !== activeIndex) {
          event.preventDefault();
          goTo(index, true);
        }
      });
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(activeIndex - 1, true);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(activeIndex + 1, true);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        goTo(0, true);
      }
      if (event.key === 'End') {
        event.preventDefault();
        goTo(slides.length - 1, true);
      }
    });

    if (viewport) {
      viewport.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].clientX;
      }, { passive: true });

      viewport.addEventListener('touchend', function (event) {
        var delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 45) goTo(activeIndex + (delta < 0 ? 1 : -1), true);
      }, { passive: true });
    }

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', function (event) {
      if (!root.contains(event.relatedTarget)) startAutoplay();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) startAutoplay();
        else stopAutoplay();
      }, { threshold: 0.2 });
      observer.observe(root);
    } else {
      startAutoplay();
    }

    render();
  }

  function init() {
    initSolutionsMenu();
    initCoverflow();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);
