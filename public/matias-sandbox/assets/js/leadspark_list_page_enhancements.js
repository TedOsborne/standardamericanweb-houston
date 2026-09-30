/*
===============================================================================
LEADSPARK LIST PAGE ENHANCEMENTS JS
Standard American Web™
Purpose:
- Premium motion effects
- Hero parallax / depth
- Magnetic CTA buttons
- Scroll reveal system
- Feature card tilt + spotlight
- Animated counters
- Video background rotation / failover
- Floating line connectors
- Section progress glow
- Smooth performance with graceful fallback

Searchable section markers are intentionally large for easy find/replace.
===============================================================================
*/

(function () {
  'use strict';

  /* ===========================================================================
     GLOBAL SETTINGS / HELPERS
  =========================================================================== */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document.documentElement;
  const body = document.body;

  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const rafThrottle = (fn) => {
    let ticking = false;
    return function (...args) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
    };
  };

  /* ===========================================================================
     CSS INJECTION FOR JS-POWERED EFFECTS
  =========================================================================== */
  function injectEnhancementStyles() {
    const style = document.createElement('style');
    style.id = 'leadspark-enhancement-styles';
    style.textContent = `
      .ls-js-ready .ls-reveal,
      .ls-js-ready [data-ls-reveal] {
        opacity: 0;
        transform: translateY(26px);
        transition: opacity .75s ease, transform .75s cubic-bezier(.22,1,.36,1);
        will-change: opacity, transform;
      }
      .ls-js-ready .ls-reveal.is-visible,
      .ls-js-ready [data-ls-reveal].is-visible {
        opacity: 1;
        transform: translateY(0);
      }
      .ls-magnetic-wrap {
        position: relative;
        display: inline-flex;
        will-change: transform;
        transition: transform .18s ease;
      }
      .ls-magnetic-wrap > * {
        will-change: transform;
        transition: transform .18s ease, box-shadow .25s ease, filter .25s ease;
      }
      .ls-tilt-card {
        transform-style: preserve-3d;
        will-change: transform;
        transition: transform .18s ease, box-shadow .3s ease, border-color .3s ease;
        position: relative;
        overflow: hidden;
      }
      .ls-tilt-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(201,243,29,.14), transparent 24%);
        opacity: 0;
        transition: opacity .25s ease;
        pointer-events: none;
      }
      .ls-tilt-card:hover::before {
        opacity: 1;
      }
      .ls-glow-progress-line {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        width: 0;
        z-index: 99999;
        background: linear-gradient(90deg, #c9f31d 0%, #7fd900 65%, #ff6600 100%);
        box-shadow: 0 0 18px rgba(201,243,29,.55);
        pointer-events: none;
      }
      .ls-orb-follow {
        position: fixed;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(201,243,29,.95) 0%, rgba(201,243,29,.18) 60%, rgba(201,243,29,0) 72%);
        pointer-events: none;
        z-index: 9998;
        mix-blend-mode: screen;
        filter: blur(.25px);
        opacity: .65;
        transform: translate(-50%, -50%);
      }
      .ls-counter-ready {
        opacity: 1;
      }
      .ls-section-is-active {
        --ls-section-glow: 0 0 0 1px rgba(201,243,29,.12), 0 0 40px rgba(201,243,29,.08);
        box-shadow: var(--ls-section-glow);
      }
      .ls-video-fade {
        transition: opacity .45s ease;
      }
      .ls-connector-line {
        position: absolute;
        height: 2px;
        transform-origin: left center;
        background: linear-gradient(90deg, rgba(201,243,29,.85), rgba(201,243,29,.08));
        pointer-events: none;
        box-shadow: 0 0 16px rgba(201,243,29,.22);
        opacity: .75;
      }
      .ls-connector-node {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #c9f31d;
        box-shadow: 0 0 0 4px rgba(201,243,29,.11), 0 0 18px rgba(201,243,29,.65);
        pointer-events: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .ls-js-ready .ls-reveal,
        .ls-js-ready [data-ls-reveal],
        .ls-magnetic-wrap,
        .ls-magnetic-wrap > *,
        .ls-tilt-card {
          transition: none !important;
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: HERO DEPTH / PARALLAX
  =========================================================================== */
  function initHeroDepth() {
    if (reduceMotion) return;

    const hero = qs('[data-ls-hero], .ls-hero, .leadspark-hero, header.hero, .banner__section');
    if (!hero) return;

    const depthItems = qsa('[data-depth]', hero);
    if (!depthItems.length) return;

    const moveDepth = rafThrottle((event) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (event.clientX - cx) / rect.width;
      const dy = (event.clientY - cy) / rect.height;

      depthItems.forEach((item) => {
        const depth = parseFloat(item.getAttribute('data-depth') || '14');
        const x = dx * depth * 18;
        const y = dy * depth * 14;
        item.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    });

    const resetDepth = () => {
      depthItems.forEach((item) => {
        item.style.transform = 'translate3d(0,0,0)';
      });
    };

    hero.addEventListener('mousemove', moveDepth, { passive: true });
    hero.addEventListener('mouseleave', resetDepth, { passive: true });
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: MAGNETIC CTA BUTTONS
  =========================================================================== */
  function initMagneticButtons() {
    if (reduceMotion) return;

    const targets = qsa('[data-magnetic], .ls-magnetic, .cmn--btn, .ls-cta, .google-gradient-button, .google-gradient-button-green-orange');
    if (!targets.length) return;

    targets.forEach((button) => {
      if (button.closest('.ls-magnetic-wrap')) return;

      const wrap = document.createElement('span');
      wrap.className = 'ls-magnetic-wrap';
      button.parentNode.insertBefore(wrap, button);
      wrap.appendChild(button);

      const onMove = (event) => {
        const rect = wrap.getBoundingClientRect();
        const relX = event.clientX - rect.left - rect.width / 2;
        const relY = event.clientY - rect.top - rect.height / 2;
        const x = clamp(relX * 0.15, -14, 14);
        const y = clamp(relY * 0.16, -10, 10);
        wrap.style.transform = `translate(${x * 0.45}px, ${y * 0.45}px)`;
        button.style.transform = `translate(${x}px, ${y}px)`;
      };

      const reset = () => {
        wrap.style.transform = 'translate(0,0)';
        button.style.transform = 'translate(0,0)';
      };

      wrap.addEventListener('mousemove', onMove, { passive: true });
      wrap.addEventListener('mouseleave', reset, { passive: true });
      wrap.addEventListener('mouseup', reset, { passive: true });
    });
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: REVEAL ON SCROLL SYSTEM
  =========================================================================== */
  function initRevealSystem() {
    const revealEls = qsa('[data-ls-reveal], .ls-reveal, .ls-feature-card, .ls-proof-card, .ls-stat-card, .ls-section-reveal');
    if (!revealEls.length) return;

    body.classList.add('ls-js-ready');

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -7% 0px'
    });

    revealEls.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
      io.observe(el);
    });
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: TILT / SPOTLIGHT FEATURE CARDS
  =========================================================================== */
  function initTiltCards() {
    if (reduceMotion) return;

    const cards = qsa('[data-tilt], .ls-tilt-card, .ls-feature-card, .ls-proof-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.classList.add('ls-tilt-card');

      const move = rafThrottle((event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 8;
        const ry = (px - 0.5) * 10;

        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });

      const reset = () => {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
      };

      card.addEventListener('mousemove', move, { passive: true });
      card.addEventListener('mouseleave', reset, { passive: true });
    });
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: ANIMATED COUNTERS
  =========================================================================== */
  function initAnimatedCounters() {
    const counters = qsa('[data-counter]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = parseInt(el.getAttribute('data-duration') || '1500', 10);
      const start = performance.now();

      const tick = (now) => {
        const progress = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      el.classList.add('ls-counter-ready');
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.55 });

    counters.forEach((counter) => io.observe(counter));
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: HERO VIDEO ROTATION / FAILOVER
     HTML recommendation:
     <video data-ls-hero-video muted autoplay playsinline loop></video>
     and optionally data-video-poster on wrapper.
  =========================================================================== */
  function initHeroVideoRotation() {
    const video = qs('[data-ls-hero-video]');
    if (!video) return;

    const sources = [
      'https://standardamericanweb.com/matias-sandbox/assets/img/leadspark-list-page/videos/Neon-Green.mp4',
      'https://standardamericanweb.com/matias-sandbox/assets/img/leadspark-list-page/videos/Abstract-Green-Glowing-Particles.mp4',
      'https://standardamericanweb.com/matias-sandbox/assets/img/leadspark-list-page/videos/Green-Digital-Technology-Particle.mp4'
    ];

    video.classList.add('ls-video-fade');

    let current = 0;
    let hasStarted = false;

    function loadVideo(index) {
      if (!sources[index]) return;
      video.style.opacity = '0.2';
      video.src = sources[index];
      video.load();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {});
      }
    }

    video.addEventListener('canplay', () => {
      video.style.opacity = '1';
      hasStarted = true;
    });

    video.addEventListener('ended', () => {
      current = (current + 1) % sources.length;
      loadVideo(current);
    });

    video.addEventListener('error', () => {
      current = (current + 1) % sources.length;
      if (current < sources.length) loadVideo(current);
    });

    if (!hasStarted) loadVideo(current);
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: SECTION PROGRESS GLOW
  =========================================================================== */
  function initProgressGlow() {
    const progress = document.createElement('div');
    progress.className = 'ls-glow-progress-line';
    body.appendChild(progress);

    const update = rafThrottle(() => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const percent = (scrollTop / max) * 100;
      progress.style.width = `${percent}%`;
    });

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: DESKTOP CURSOR ORB
  =========================================================================== */
  function initCursorOrb() {
    if (reduceMotion || window.innerWidth < 992) return;

    const orb = document.createElement('div');
    orb.className = 'ls-orb-follow';
    body.appendChild(orb);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    window.addEventListener('mousemove', (event) => {
      tx = event.clientX;
      ty = event.clientY;
    }, { passive: true });

    const animate = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      orb.style.left = `${x}px`;
      orb.style.top = `${y}px`;
      requestAnimationFrame(animate);
    };

    animate();
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: ACTIVE SECTION HIGHLIGHTING
     Add data-ls-section to any major section you want softly highlighted while in view.
  =========================================================================== */
  function initActiveSectionHighlight() {
    const sections = qsa('[data-ls-section]');
    if (!sections.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('ls-section-is-active', entry.isIntersecting && entry.intersectionRatio > 0.38);
      });
    }, {
      threshold: [0.2, 0.38, 0.6]
    });

    sections.forEach((section) => io.observe(section));
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: CONNECTOR LINES BETWEEN VISUAL NODES
     HTML recommendation:
     Wrap the visual zone with [data-ls-connectors]
     and each point with [data-node="name"]
     plus lines via data-from / data-to placeholders if desired.
  =========================================================================== */
  function initConnectorLines() {
    if (window.innerWidth < 992) return;

    const zones = qsa('[data-ls-connectors]');
    if (!zones.length) return;

    zones.forEach((zone) => {
      const pairs = qsa('[data-connect-from][data-connect-to]', zone);
      if (!pairs.length) return;

      const draw = () => {
        qsa('.ls-connector-line, .ls-connector-node', zone).forEach((el) => el.remove());
        const zoneRect = zone.getBoundingClientRect();

        pairs.forEach((pair) => {
          const from = qs(`[data-node="${pair.getAttribute('data-connect-from')}"]`, zone);
          const to = qs(`[data-node="${pair.getAttribute('data-connect-to')}"]`, zone);
          if (!from || !to) return;

          const a = from.getBoundingClientRect();
          const b = to.getBoundingClientRect();
          const ax = a.left + a.width / 2 - zoneRect.left;
          const ay = a.top + a.height / 2 - zoneRect.top;
          const bx = b.left + b.width / 2 - zoneRect.left;
          const by = b.top + b.height / 2 - zoneRect.top;
          const length = Math.hypot(bx - ax, by - ay);
          const angle = Math.atan2(by - ay, bx - ax) * (180 / Math.PI);

          const line = document.createElement('div');
          line.className = 'ls-connector-line';
          line.style.left = `${ax}px`;
          line.style.top = `${ay}px`;
          line.style.width = `${length}px`;
          line.style.transform = `rotate(${angle}deg)`;
          zone.appendChild(line);

          const nodeA = document.createElement('div');
          nodeA.className = 'ls-connector-node';
          nodeA.style.left = `${ax - 4}px`;
          nodeA.style.top = `${ay - 4}px`;
          zone.appendChild(nodeA);

          const nodeB = document.createElement('div');
          nodeB.className = 'ls-connector-node';
          nodeB.style.left = `${bx - 4}px`;
          nodeB.style.top = `${by - 4}px`;
          zone.appendChild(nodeB);
        });
      };

      const redraw = rafThrottle(draw);
      draw();
      window.addEventListener('resize', redraw, { passive: true });
      window.addEventListener('scroll', redraw, { passive: true });
    });
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: SMART STAGGER FOR LISTS / GRIDS
  =========================================================================== */
  function initSmartStagger() {
    qsa('[data-stagger]').forEach((wrap) => {
      qsa(':scope > *', wrap).forEach((child, index) => {
        child.classList.add('ls-reveal');
        child.style.transitionDelay = `${index * 80}ms`;
      });
    });
  }

  /* ===========================================================================
     SEARCHABLE SECTION MARKER: INITIALIZER
  =========================================================================== */
  function initAll() {
    injectEnhancementStyles();
    initSmartStagger();
    initRevealSystem();
    initHeroDepth();
    initMagneticButtons();
    initTiltCards();
    initAnimatedCounters();
    initHeroVideoRotation();
    initProgressGlow();
    initCursorOrb();
    initActiveSectionHighlight();
    initConnectorLines();
    doc.classList.add('ls-enhancements-loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
})();
