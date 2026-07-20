(function () {
    'use strict';

    var STORAGE_KEY = 'theme';
    var root = document.documentElement;
    var themeToggle = document.querySelector('.theme-toggle');
    var themeColorMeta = {
        dark: document.querySelector('meta[name="theme-color"][media*="dark"]'),
        light: document.querySelector('meta[name="theme-color"][media*="light"]')
    };

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            /* private-mode / storage disabled — theme just won't persist */
        }
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        }
        var activeMeta = themeColorMeta[theme];
        if (activeMeta) {
            document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
                m.content = activeMeta.content;
            });
        }
    }

    applyTheme(root.getAttribute('data-theme') || 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            storeTheme(next);
            applyTheme(next);
        });
    }

    if (window.matchMedia && !getStoredTheme()) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
            if (!getStoredTheme()) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.getElementById('nav-links');

    function closeNav() {
        if (!navLinks || !navToggle) return;
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navLinks.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeNav();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.site-nav')) closeNav();
        });
    }

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealTargets = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window && !prefersReducedMotion && revealTargets.length) {
        root.classList.add('js-reveal-ready');

        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

        revealTargets.forEach(function (target, index) {
            target.style.transitionDelay = Math.min(index, 5) * 60 + 'ms';
            revealObserver.observe(target);
        });
    }

    var sections = document.querySelectorAll('main section[id]');
    var navAnchors = document.querySelectorAll('#nav-links a');

    if ('IntersectionObserver' in window && sections.length && navAnchors.length) {
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navAnchors.forEach(function (anchor) {
                    var isActive = anchor.getAttribute('href') === '#' + entry.target.id;
                    anchor.classList.toggle('active', isActive);
                    if (isActive) {
                        anchor.setAttribute('aria-current', 'true');
                    } else {
                        anchor.removeAttribute('aria-current');
                    }
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(function (section) {
            navObserver.observe(section);
        });
    }

    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
})();
