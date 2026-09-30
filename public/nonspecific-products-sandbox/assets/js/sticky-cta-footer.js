(function () {
    'use strict';

    var loader = document.currentScript;
    if (!loader) {
        return;
    }

    var pageType = loader.getAttribute('data-page-type');
    var pageRoot = loader.getAttribute('data-page-root') || '.';
    var validTypes = ['business', 'wordpress', 'shopify'];

    if (validTypes.indexOf(pageType) === -1) {
        return;
    }

    function addStylesheet() {
        if (document.querySelector('link[data-saw-sticky-cta-styles]')) {
            return;
        }

        var stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = new URL('../css/sticky-cta-footer.css?v=20260816-4', loader.src).href;
        stylesheet.setAttribute('data-saw-sticky-cta-styles', 'true');
        document.head.appendChild(stylesheet);
    }

    function landingPageUrl(filename) {
        var prefix = pageRoot === '.' ? '' : pageRoot.replace(/\/$/, '') + '/';
        return new URL(prefix + filename, window.location.href).href;
    }

    function createFooter() {
        if (document.querySelector('.saw-sticky-cta')) {
            return;
        }

        var websiteOffers = [
            {
                type: 'business',
                label: 'Build a Business Website',
                href: landingPageUrl('website-design.html')
            },
            {
                type: 'wordpress',
                label: 'Explore WordPress Development',
                href: landingPageUrl('wordpress-development.html')
            },
            {
                type: 'shopify',
                label: 'Launch a Shopify Store',
                href: landingPageUrl('online-store-development.html')
            }
        ];

        var items = websiteOffers.filter(function (offer) {
            return offer.type !== pageType;
        });

        items.push(
            {
                type: 'redesign',
                label: 'Redesign My Website',
                href: 'https://bit.ly/SAW-single-product-website-redesign'
            },
            {
                type: 'call',
                label: 'Call For Help',
                href: 'tel:16016401512'
            }
        );

        var footer = document.createElement('nav');
        footer.className = 'saw-sticky-cta';
        footer.setAttribute('aria-label', 'Website services and contact options');
        footer.setAttribute('aria-hidden', 'true');
        footer.setAttribute('data-page-type', pageType);

        var inner = document.createElement('div');
        inner.className = 'saw-sticky-cta__inner';

        items.forEach(function (item) {
            var link = document.createElement('a');
            link.className = 'saw-sticky-cta__button saw-sticky-cta__button--' + item.type;
            link.href = item.href;
            link.textContent = item.label;
            link.tabIndex = -1;
            inner.appendChild(link);
        });

        footer.appendChild(inner);
        document.body.appendChild(footer);

        var visible = false;
        var ticking = false;

        function updateVisibility() {
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            var shouldShow = window.scrollY > viewportHeight;

            if (shouldShow !== visible) {
                visible = shouldShow;
                footer.classList.toggle('is-visible', visible);
                footer.setAttribute('aria-hidden', visible ? 'false' : 'true');
                document.body.classList.toggle('saw-sticky-cta-visible', visible);

                footer.querySelectorAll('a').forEach(function (link) {
                    link.tabIndex = visible ? 0 : -1;
                });
            }

            ticking = false;
        }

        function requestUpdate() {
            if (ticking) {
                return;
            }

            ticking = true;
            window.requestAnimationFrame(updateVisibility);
        }

        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        updateVisibility();
    }

    addStylesheet();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFooter);
    } else {
        createFooter();
    }
}());
