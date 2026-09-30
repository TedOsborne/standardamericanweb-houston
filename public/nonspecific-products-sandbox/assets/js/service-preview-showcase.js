(function (window, document) {
  'use strict';

  var source = document.currentScript;
  var currentService = source ? source.getAttribute('data-current-service') || 'business' : 'business';
  var lastFocus = null;

  var services = {
    business: {
      title: 'Business Website Design', short: 'Business Website', category: 'Website Development', accent: '#ff6600',
      headline: 'Make the first visit feel like the right decision.',
      description: 'A conversion-focused business website explains your value quickly, builds confidence, and guides prospects toward a call, quote, booking, or purchase.',
      card: 'Turn attention into trust—and trust into action.',
      benefits: ['Responsive presentation across every screen', 'Clear offers, proof, and conversion paths', 'A professional foundation built to grow'],
      poster: 'nonspecific-products-sandbox/assets/images/barber-mockup-responsive-html.webp',
      video: 'https://standardamericanweb.com/videos/code-writing.mp4',
      link: 'https://bit.ly/SAW-Business-Website-Educational-Pg', cta: 'Explore Business Websites'
    },
    microsite: {
      title: 'MicroSite Website Development', short: 'MicroSite', category: 'Website Development', accent: '#c7ff00',
      headline: 'One focused offer. One clear audience. One decisive next step.',
      description: 'A MicroSite removes distraction and concentrates the page around the service, campaign, or offer most likely to turn interested visitors into qualified opportunities.',
      card: 'A focused conversion path without website clutter.',
      benefits: ['Purpose-built around one conversion goal', 'Fast, mobile-first customer journey', 'Ideal for campaigns, offers, and local services'],
      poster: 'nonspecific-products-sandbox/assets/images/microsite/001-MicroSites.png',
      link: 'https://bit.ly/SAW-499-MicroSite-ls', cta: 'Explore MicroSites'
    },
    wordpress: {
      title: 'WordPress Development', short: 'WordPress', category: 'Website Development', accent: '#006fa4',
      headline: 'Flexible enough for today. Structured to grow tomorrow.',
      description: 'Custom WordPress development gives your team an editable, expandable platform without sacrificing professional presentation, usability, or conversion strategy.',
      card: 'Own an editable platform that can grow with you.',
      benefits: ['Editable pages and content architecture', 'Custom design beyond a stock theme', 'Scalable foundation for future integrations'],
      poster: 'nonspecific-products-sandbox/assets/images/wordpress/001-wordpress.png',
      video: 'https://bundles.standardamericanweb.com/dub-landing-pg/myself-niche/media/001-wordpress.mp4',
      link: 'https://bit.ly/SAW-WordPress-Educational-Landing-Pg', cta: 'Explore WordPress Development'
    },
    shopify: {
      title: 'Shopify Online Store Development', short: 'Shopify Store', category: 'Website Development', accent: '#5b893c',
      headline: 'Turn product interest into a smoother path to checkout.',
      description: 'A professionally structured Shopify store helps customers understand products, trust the business, navigate confidently, and complete purchases with less friction.',
      card: 'Create a cleaner journey from product to purchase.',
      benefits: ['Conversion-minded product presentation', 'Mobile-first shopping and checkout flow', 'A store structure ready for marketing and growth'],
      poster: 'nonspecific-products-sandbox/assets/images/shopify/Shopify-Development.png',
      video: 'https://bundles.standardamericanweb.com/dub-landing-pg/myself-niche/media/video-shopify.mp4',
      link: 'https://bit.ly/SAW-Shopify-Dev-Educational-Pg', cta: 'Explore Shopify Development'
    },
    redesign: {
      title: 'Website Redesign', short: 'Website Redesign', category: 'Website Development', accent: '#efaf00',
      headline: 'Keep what works. Repair what blocks conversion.',
      description: 'A strategic redesign modernizes the experience, clarifies the message, improves mobile usability, and rebuilds the path from first impression to action.',
      card: 'Transform an outdated site into a sharper sales asset.',
      benefits: ['Modernized visual credibility', 'Stronger hierarchy and calls to action', 'Improved mobile experience and usability'],
      poster: 'nonspecific-products-sandbox/assets/images/microsite/002-MicroSites.png',
      link: 'https://bit.ly/SAW-single-product-website-redesign', cta: 'Plan My Website Redesign'
    },
    'ai-employees': {
      title: 'LeadSpark AI Employees', short: 'AI Employees', category: 'AI & Automation', accent: '#70d629',
      headline: 'Give every new opportunity an immediate, consistent response.',
      description: 'Role-specific AI Employees help answer, guide, qualify, and follow up with prospects so your human team can focus on conversations and work that require human judgment.',
      card: 'Support your team with always-ready digital specialists.',
      benefits: ['Fast responses when your team is busy', 'Consistent qualification and follow-up', 'Supports people instead of replacing them'],
      poster: 'nonspecific-products-sandbox/assets/images/MicroSites.png',
      video: 'https://standardamericanweb.com/videos/ai-employees.mp4',
      link: 'https://bit.ly/SAW-AI-Employees-from-LeadSpark', cta: 'Meet the AI Employees'
    },
    'ai-automation': {
      title: 'AI Business Automation', short: 'AI Automation', category: 'AI & Automation', accent: '#8b5cf6',
      headline: 'Move leads forward without relying on memory and manual follow-up.',
      description: 'Connected automations can capture inquiries, trigger responses, organize opportunities, send reminders, and keep routine next steps moving behind the scenes.',
      card: 'Connect the repetitive work so opportunities keep moving.',
      benefits: ['Automated responses and reminders', 'Connected CRM and follow-up workflows', 'Fewer leads lost between manual handoffs'],
      poster: 'nonspecific-products-sandbox/assets/images/MicroSites.png',
      video: 'https://standardamericanweb.com/videos/ai-business-automations.mp4',
      link: 'https://bit.ly/SAW-LeadSpark-Business-Automations', cta: 'Explore Business Automation'
    },
    seo: {
      title: 'SEO Services', short: 'SEO', category: 'Visibility & Marketing', accent: '#ff5a1f',
      headline: 'Build a stronger path from search visibility to customer action.',
      description: 'Search optimization improves the technical, content, and relevance signals that help qualified prospects discover and understand your business.',
      card: 'Help the right prospects find—and choose—your business.',
      benefits: ['Search-focused page optimization', 'Technical and structured-data foundations', 'Content aligned with customer intent'],
      poster: 'https://bundles.standardamericanweb.com/dub-landing-pg/myself-niche/images/background/bg15-seo.png',
      video: 'https://bundles.standardamericanweb.com/dub-landing-pg/myself-niche/media/video-seo.mp4',
      link: 'https://bit.ly/SAW-SEO-Services-And-SoLoMo', cta: 'Explore SEO Services'
    },
    socialbiz: {
      title: 'SocialBiz Marketing & Management', short: 'SocialBiz', category: 'Visibility & Marketing', accent: '#ed20c2',
      headline: 'Stay visible and credible without living inside social media.',
      description: 'SocialBiz helps maintain a more consistent brand presence with planned content, active management, and messaging designed to keep the business recognizable.',
      card: 'Build consistent visibility without another daily task.',
      benefits: ['Planned, on-brand social content', 'More consistent publishing and presence', 'Ongoing management and performance insight'],
      poster: 'https://bundles.standardamericanweb.com/dub-landing-pg/myself-niche/images/background/001-socialbiz.png',
      video: 'https://bundles.standardamericanweb.com/dub-landing-pg/myself-niche/media/001-socialbiz.mp4',
      link: 'https://bit.ly/SAW-SocialBiz-Marketing-and-Managing', cta: 'Explore SocialBiz'
    },
    'talking-websites': {
      title: 'Talking Websites', short: 'Talking Websites', category: 'AI & Automation', accent: '#13b7d8',
      headline: 'Answer questions and guide visitors before they leave.',
      description: 'A Talking Website adds an interactive guidance layer that helps visitors hear answers, understand their options, and move toward the right call, booking, or next step.',
      card: 'Turn a passive page into a guided customer experience.',
      benefits: ['Immediate guidance for common questions', 'A more engaging path through the offer', 'Direct visitors toward calls and bookings'],
      poster: 'nonspecific-products-sandbox/assets/images/MicroSites.png',
      link: 'https://bit.ly/SAW-Talking-Website', cta: 'Hear What a Talking Website Can Do'
    },
    'website-insurance': {
      title: 'Website Insurance & Continuity', short: 'Website Continuity', category: 'Protection & Support', accent: '#d9b877',
      headline: 'Protect access before access becomes a business crisis.',
      description: 'Website Continuity documents critical domains, hosting, administrative access, renewals, backups, authorized contacts, and succession instructions so the website is less dependent on one person.',
      card: 'Protect the access and knowledge your website depends on.',
      benefits: ['Documented ownership, access, and billing', 'Backup and renewal continuity planning', 'Clear authorized-contact and succession records'],
      poster: 'nonspecific-products-sandbox/assets/images/MicroSites.png',
      video: 'https://standardamericanweb.com/videos/beneficiary.mp4',
      link: 'https://bit.ly/SAW-Website-Continuity', cta: 'Explore Website Continuity'
    },
    solomo: {
      title: 'SoLoMo: Social, Local & Mobile', short: 'SoLoMo', category: 'Visibility & Marketing', accent: '#38bdf8',
      headline: 'Strengthen the local signals customers use when they are ready to act.',
      description: 'SoLoMo is a focused local-visibility system connecting social activity, Google Business Profile and Maps signals, mobile discovery, and local conversion alignment.',
      card: 'Connect social, local, and mobile discovery in one system.',
      benefits: ['Google Business Profile and Maps alignment', 'Mobile-first local discovery signals', 'A focused 90-day visibility framework'],
      poster: 'https://bundles.standardamericanweb.com/dub-landing-pg/myself-niche/images/background/bg15-seo.png',
      video: 'https://bundles.standardamericanweb.com/dub-landing-pg/myself-niche/media/video-seo.mp4',
      link: 'https://bit.ly/SAW-SoLoMo', cta: 'Explore SoLoMo'
    },
    'remote-staffing': {
      title: 'Remote Staffing & Hire-a-Geek', short: 'Remote Staffing', category: 'Protection & Support', accent: '#54c733',
      headline: 'Bring in focused technical help without adding a full-time position.',
      description: 'Remote Staffing and Hire-a-Geek give businesses access to targeted design, development, SEO, social, and technical assistance for clearly defined work and ongoing support needs.',
      card: 'Add specialized technical capacity only when you need it.',
      benefits: ['Specialists matched to the work required', 'Useful for focused fixes and ongoing support', 'Hire-a-Geek projects begin with a five-hour minimum'],
      poster: 'nonspecific-products-sandbox/assets/images/MicroSites.png',
      video: 'https://bundles.standardamericanweb.com/dub-landing-pg/media/Matrix-Rain-Plus-Developer-Optimized.mp4',
      link: 'https://bit.ly/SAW-Hire-A-Geek-Hour', cta: 'Explore Remote Staffing'
    }
  };

  var serviceOrder = ['business', 'microsite', 'wordpress', 'shopify', 'redesign', 'ai-employees', 'ai-automation', 'seo', 'socialbiz', 'talking-websites', 'website-insurance', 'solomo', 'remote-staffing'];

  function mediaMarkup(item) {
    if (item.video) {
      return '<video muted loop playsinline preload="metadata"' + (item.poster ? ' poster="' + item.poster + '"' : '') + '>' +
        '<source src="' + item.video + '" type="video/mp4"></video>';
    }
    return '<img src="' + item.poster + '" alt="' + item.title + ' service preview">';
  }

  function cardMarkup(id) {
    var item = services[id];
    return '<article class="saw-preview-card" data-preview-card="' + id + '" style="--card-accent:' + item.accent + '">' +
      '<button class="saw-preview-card__select" type="button" data-preview-select="' + id + '" style="--card-image:url(&quot;' + item.poster + '&quot;)" aria-label="Preview ' + item.title + '">' +
      '<strong>' + item.short + '</strong><small>' + item.card + '</small></button>' +
      '<a class="saw-preview-card__link" href="' + item.link + '">Visit service page →</a></article>';
  }

  function createOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'saw-preview-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<section class="saw-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="saw-preview-title">' +
      '<header class="saw-preview-toolbar"><div class="saw-preview-toolbar__brand">' +
      '<img src="nonspecific-products-sandbox/assets/images/logo-daylight-fire-orange.png" alt="Standard American Web">' +
      '<span>Interactive Website &amp; Business Solutions Showcase</span></div>' +
      '<button class="saw-preview-close" type="button" data-preview-close aria-label="Close service showcase">&times;</button></header>' +
      '<div class="saw-preview-stage"><div class="saw-preview-stage__media"></div><div class="saw-preview-stage__copy"></div></div>' +
      '<footer class="saw-preview-catalog"><div class="saw-preview-catalog__header"><strong>Explore all 13 solutions</strong><span>Select a card to preview it. Use its link to visit the full service page.</span></div>' +
      '<div class="saw-preview-cards">' + serviceOrder.map(cardMarkup).join('') + '</div></footer></section>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function renderService(id) {
    var chosen = services[id] ? id : 'business';
    var item = services[chosen];
    var overlay = document.querySelector('.saw-preview-overlay');
    if (!overlay) return;
    var media = overlay.querySelector('.saw-preview-stage__media');
    var copy = overlay.querySelector('.saw-preview-stage__copy');
    media.innerHTML = mediaMarkup(item);
    copy.style.setProperty('--service-accent', item.accent);
    copy.innerHTML = '<span class="saw-preview-badge">' + item.category + '</span>' +
      '<h2 id="saw-preview-title">' + item.headline + '</h2><p>' + item.description + '</p>' +
      '<ul class="saw-preview-benefits">' + item.benefits.map(function (benefit) { return '<li>' + benefit + '</li>'; }).join('') + '</ul>' +
      '<div class="saw-preview-stage__actions"><a href="' + item.link + '">' + item.cta + ' →</a><span>Opens the complete service page</span></div>';
    overlay.querySelectorAll('[data-preview-card]').forEach(function (card) {
      var active = card.getAttribute('data-preview-card') === chosen;
      card.classList.toggle('is-active', active);
      card.querySelector('button').setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    var activeCard = overlay.querySelector('[data-preview-card="' + chosen + '"]');
    if (activeCard && overlay.classList.contains('is-open')) {
      var cardRail = activeCard.parentElement;
      cardRail.scrollTo({
        left: activeCard.offsetLeft - ((cardRail.clientWidth - activeCard.offsetWidth) / 2),
        behavior: 'smooth'
      });
    }
    var video = media.querySelector('video');
    if (video && overlay.classList.contains('is-open')) video.play().catch(function () {});
  }

  function openPreview(id, trigger) {
    var overlay = document.querySelector('.saw-preview-overlay');
    lastFocus = trigger || document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('saw-preview-is-open');
    renderService(id || currentService);
    overlay.querySelector('.saw-preview-close').focus();
    var video = overlay.querySelector('.saw-preview-stage__media video');
    if (video) video.play().catch(function () {});
  }

  function closePreview() {
    var overlay = document.querySelector('.saw-preview-overlay');
    if (!overlay) return;
    var video = overlay.querySelector('video');
    if (video) video.pause();
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('saw-preview-is-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function invite(kind, title, text, label) {
    var section = document.createElement('section');
    section.className = 'saw-preview-invite saw-preview-invite--' + kind;
    section.innerHTML = '<div class="saw-preview-invite__copy"><span class="saw-preview-invite__eyebrow">Interactive service preview</span>' +
      '<strong>' + title + '</strong><p>' + text + '</p></div>' +
      '<button class="saw-preview-trigger" type="button" data-preview-open="' + currentService + '">' + label + '</button>';
    return section;
  }

  function addInvites() {
    var mockup = document.querySelector('#demos img[alt*="Responsive website mockup"], #demos img[alt*="responsive website mockup"]');
    var mockupRow = mockup && mockup.closest('.row');
    if (mockupRow && !document.querySelector('.saw-preview-invite--primary')) {
      mockupRow.parentNode.insertBefore(invite('primary', 'See every solution before choosing one.', 'Preview website development, AI, automation, visibility, marketing, protection, and support in one polished showcase.', 'Explore All 13 Solutions'), mockupRow.nextSibling);
    }

    var featureTitle = document.querySelector('#features .section-title');
    if (featureTitle && !document.querySelector('.saw-preview-invite--compact')) {
      featureTitle.appendChild(invite('compact', 'Want to see how this service fits the larger system?', 'Compare the current solution with the services that can strengthen visibility, response, follow-up, and continuity.', 'Preview & Compare Services'));
    }

    var footer = document.querySelector('footer.prt-bgcolor-darkgrey, body > footer');
    if (footer && !document.querySelector('.saw-preview-invite--final')) {
      footer.parentNode.insertBefore(invite('final', 'Choose with confidence before taking the next step.', 'Open the complete visual catalog, compare all thirteen solutions, and continue to the service page that best matches your goal.', 'Compare All Solutions'), footer);
    }
  }

  function bindEvents() {
    document.addEventListener('click', function (event) {
      var opener = event.target.closest('[data-preview-open]');
      if (opener) {
        event.preventDefault();
        openPreview(opener.getAttribute('data-preview-open'), opener);
        return;
      }
      var selector = event.target.closest('[data-preview-select]');
      if (selector) {
        event.preventDefault();
        renderService(selector.getAttribute('data-preview-select'));
        return;
      }
      if (event.target.closest('[data-preview-close]') || event.target === document.querySelector('.saw-preview-overlay')) closePreview();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('saw-preview-is-open')) closePreview();
    });
  }

  function init() {
    if (document.querySelector('.saw-preview-overlay')) return;
    createOverlay();
    renderService(currentService);
    addInvites();
    bindEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}(window, document));
