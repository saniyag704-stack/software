/* ==========================================================================
   Skill GPS — Shared UI behaviour
   Theme, navigation, scroll reveal, counters and toasts.
   ========================================================================== */

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Theme ---------------- */
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('skillgps.theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = storedTheme || (prefersLight ? 'light' : 'dark');

  function setTheme(theme, persist = true) {
    root.setAttribute('data-theme', theme);
    if (persist) localStorage.setItem('skillgps.theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML =
        theme === 'dark'
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }

  setTheme(initialTheme, false);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------------- Navbar ---------------- */
  const nav = $('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('.nav-toggle');
  const mobileMenu = $('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !e.target.closest('.nav') && !e.target.closest('.mobile-menu')) {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- Active nav link ---------------- */
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $$('.nav-links a, .mobile-menu a').forEach((a) => {
    const href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (!href) return;
    const isHome = (page === '' || page === 'index.html') && (href === 'index.html' || href === './');
    if (href === page || isHome) a.classList.add('active');
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = Number(entry.target.dataset.delay || 0);
              setTimeout(() => entry.target.classList.add('in'), delay);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------------- Animated counters ---------------- */
  function animateCount(el) {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const decimals = Number(el.dataset.decimals || 0);
    if (reducedMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counters = $$('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      const co = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              co.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => co.observe(el));
    }
  }

  /* ---------------- Hero bars ---------------- */
  const heroBars = $$('.gps-skill .bar > span');
  if (heroBars.length) {
    setTimeout(() => {
      heroBars.forEach((bar) => {
        bar.style.width = (bar.dataset.value || 0) + '%';
      });
    }, 350);
  }

  /* ---------------- Toast ---------------- */
  const TOAST_ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-5M12 8h.01"/></svg>'
  };

  function toast(message, type = 'success', duration = 3400) {
    let wrap = $('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = (TOAST_ICONS[type] || TOAST_ICONS.info) + '<span></span>';
    el.querySelector('span').textContent = message;
    wrap.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 320);
    }, duration);
  }

  /* ---------------- Footer year ---------------- */
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------------- Export ---------------- */
  window.SkillGPSUI = { $, $$, toast, setTheme };
})();
