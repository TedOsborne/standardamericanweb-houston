(function () {
    'use strict';

    function activateLordiconPlayback(widget) {
        if (!window.customElements || !window.customElements.whenDefined) {
            return;
        }

        window.customElements.whenDefined('lord-icon').then(function () {
            widget.querySelectorAll('lord-icon').forEach(function (icon) {
                var playFromStart = function () {
                    if (icon.playerInstance && typeof icon.playerInstance.playFromBeginning === 'function') {
                        icon.playerInstance.playFromBeginning();
                    }
                };

                icon.parentElement.addEventListener('mouseenter', playFromStart);
                icon.parentElement.addEventListener('focus', playFromStart);
            });
        });
    }

    function ensureLordiconRuntime(widget) {
        if (window.customElements && window.customElements.get('lord-icon')) {
            activateLordiconPlayback(widget);
            return;
        }

        var existingScript = document.querySelector('script[src="https://cdn.lordicon.com/fudrjiwc.js"]');
        if (existingScript) {
            existingScript.addEventListener('load', function () {
                activateLordiconPlayback(widget);
            }, { once: true });
            return;
        }

        var lordiconScript = document.createElement('script');
        lordiconScript.src = 'https://cdn.lordicon.com/fudrjiwc.js';
        lordiconScript.async = true;
        lordiconScript.setAttribute('data-lordicon-widget', 'true');
        lordiconScript.addEventListener('load', function () {
            activateLordiconPlayback(widget);
        }, { once: true });
        document.body.appendChild(lordiconScript);
    }

    function activateDotLottiePlayback(widget) {
        if (!window.customElements || !window.customElements.whenDefined) {
            return;
        }

        window.customElements.whenDefined('dotlottie-wc').then(function () {
            widget.querySelectorAll('dotlottie-wc').forEach(function (player) {
                var playFromStart = function () {
                    if (player.dotLottie) {
                        player.dotLottie.stop();
                        player.dotLottie.play();
                    }
                };

                player.parentElement.addEventListener('mouseenter', playFromStart);
                player.parentElement.addEventListener('focus', playFromStart);
            });
        });
    }

    function ensureDotLottieRuntime(widget) {
        if (window.customElements && window.customElements.get('dotlottie-wc')) {
            activateDotLottiePlayback(widget);
            return;
        }

        var source = 'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js';
        var existingScript = document.querySelector('script[data-dotlottie-widget]');
        if (existingScript) {
            existingScript.addEventListener('load', function () {
                activateDotLottiePlayback(widget);
            }, { once: true });
            return;
        }

        var playerScript = document.createElement('script');
        playerScript.type = 'module';
        playerScript.src = source;
        playerScript.setAttribute('data-dotlottie-widget', 'true');
        playerScript.addEventListener('load', function () {
            activateDotLottiePlayback(widget);
        }, { once: true });
        document.body.appendChild(playerScript);
    }

    function createFloatingWidget() {
        document.querySelectorAll('.prt_floting_customsett').forEach(function (widget) {
            widget.remove();
        });

        var primaryColor = '#1A1A1A';
        var secondaryColor = '#FF6600';
        var iconColors = 'primary:' + primaryColor + ',secondary:' + secondaryColor;

        var items = [
            {
                href: 'https://standardamericanweb.com/home-2026.html',
                label: 'Standard American Web home',
                tooltip: 'Visit Our Home Page',
                icon: 'https://cdn.lordicon.com/gmzxduhd.json'
            },
            {
                href: 'https://bit.ly/SAW-AI-Employees-from-LeadSpark',
                label: 'AI Employees',
                tooltip: 'AI Employees',
                icon: 'https://cdn.lordicon.com/dgiidarp.json'
            },
            {
                href: 'https://bit.ly/SAW-LeadSpark-Business-Automations',
                label: 'AI Business Automation',
                tooltip: 'AI Business Automation',
                icon: 'https://cdn.lordicon.com/cykiczdp.json'
            },
            {
                href: 'https://bit.ly/SAW-Talking-Website',
                label: 'Talking Websites',
                tooltip: 'Talking Websites',
                type: 'dotlottie',
                icon: 'https://assets-v2.lottiefiles.com/a/a5bff106-117e-11ee-bae8-0325cdcf9e8e/NkZKy1ycH7.lottie'
            },
            {
                href: 'https://bit.ly/SAW-SEO-Services-And-SoLoMo',
                label: 'SEO services',
                tooltip: 'SEO Services & SoLoMo',
                icon: 'https://cdn.lordicon.com/kbdsgbei.json'
            },
            {
                href: 'https://bit.ly/SAW-SocialBiz-Marketing-and-Managing',
                label: 'SocialBiz marketing and management',
                tooltip: 'SocialBiz Marketing & Management',
                icon: 'https://cdn.lordicon.com/flqcnwch.json'
            },
            {
                href: '#checkout-cart',
                label: 'Jump to checkout cart',
                tooltip: 'Jump to Checkout Cart',
                icon: 'https://cdn.lordicon.com/sjwcaomq.json',
                requiresTarget: 'checkout-cart'
            },
            {
                href: 'tel:16016401512',
                label: 'Call us',
                tooltip: 'Call Us',
                icon: 'https://cdn.lordicon.com/sfkskmhu.json'
            }
        ];

        var widget = document.createElement('nav');
        widget.className = 'prt_floting_customsett';
        widget.setAttribute('aria-label', 'Quick links');

        items.forEach(function (item) {
            if (item.requiresTarget && !document.getElementById(item.requiresTarget)) {
                return;
            }

            var link = document.createElement('a');
            link.href = item.href;
            link.className = 'tmtheme_fbar_icons';
            link.setAttribute('aria-label', item.label);

            if (item.href.charAt(0) === '#') {
                link.addEventListener('click', function (event) {
                    var target = document.querySelector(item.href);
                    if (!target) {
                        return;
                    }

                    event.preventDefault();
                    window.history.pushState(null, '', item.href);
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    [350, 900, 1600].forEach(function (delay) {
                        window.setTimeout(function () {
                            target.scrollIntoView({ behavior: 'auto', block: 'start' });
                        }, delay);
                    });
                });
            }

            var icon;
            if (item.type === 'dotlottie') {
                icon = document.createElement('dotlottie-wc');
                icon.setAttribute('src', item.icon);
                icon.style.filter = 'grayscale(1) sepia(1) saturate(7) hue-rotate(345deg) brightness(.82)';
            } else {
                icon = document.createElement('lord-icon');
                icon.setAttribute('src', item.icon);
                icon.setAttribute('trigger', 'hover');
                icon.setAttribute('stroke', '75');
                icon.setAttribute('colors', iconColors);
            }

            var tooltip = document.createElement('span');
            tooltip.className = 'tmtheme_fbar_tooltip';
            tooltip.setAttribute('role', 'tooltip');
            tooltip.textContent = item.tooltip;

            link.appendChild(icon);
            link.appendChild(tooltip);
            widget.appendChild(link);
        });

        document.body.appendChild(widget);
        ensureLordiconRuntime(widget);
        ensureDotLottieRuntime(widget);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingWidget);
    } else {
        createFloatingWidget();
    }
}());
