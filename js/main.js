/**
 * PulseOps - Front-End Interactions & Application Controller
 * High-performance vanilla JavaScript (Zero dependencies, Zero emojis)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Theme Management (Dark / Light with System Preference Fallback)
     ========================================================================== */
  const ThemeController = {
    STORAGE_KEY: 'pulseops_theme_preference',

    init() {
      this.toggleBtn = document.getElementById('theme-toggle');
      if (!this.toggleBtn) return;

      // Determine initial theme: saved in localStorage or system preference
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

      this.applyTheme(initialTheme);

      this.toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
      });

      // Listen for OS system theme changes if user hasn't set explicit preference
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
      if (this.toggleBtn) {
        this.toggleBtn.setAttribute(
          'aria-label',
          theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        );
      }
    }
  };

  /* ==========================================================================
     2. Navigation, Sticky Header & ScrollSpy
     ========================================================================== */
  const NavigationController = {
    init() {
      this.header = document.getElementById('site-header');
      this.menuBtn = document.getElementById('mobile-menu-btn');
      this.mobileNav = document.getElementById('mobile-nav');
      this.desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
      this.mobileLinks = document.querySelectorAll('.mobile-nav-link');
      this.sections = document.querySelectorAll('main > section[id]');

      this.setupMobileMenu();
      this.setupSmoothScroll();
      this.setupScrollSpy();
      this.setupHeaderScrollElevation();
    },

    setupMobileMenu() {
      if (!this.menuBtn || !this.mobileNav) return;

      const toggleMenu = (open) => {
        const isExpanded = open !== undefined ? open : this.menuBtn.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;

        this.menuBtn.setAttribute('aria-expanded', String(nextState));
        this.mobileNav.hidden = !nextState;

        if (nextState) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      };

      this.menuBtn.addEventListener('click', () => toggleMenu());

      // Close menu on navigation link click
      this.mobileLinks.forEach((link) => {
        link.addEventListener('click', () => toggleMenu(false));
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.menuBtn.getAttribute('aria-expanded') === 'true') {
          toggleMenu(false);
          this.menuBtn.focus();
        }
      });
    },

    setupSmoothScroll() {
      const allAnchors = document.querySelectorAll('a[href^="#"]');
      allAnchors.forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#' || targetId === '') return;

          const targetElem = document.querySelector(targetId);
          if (targetElem) {
            e.preventDefault();
            targetElem.scrollIntoView({ behavior: 'smooth' });

            // Accessibility: shift focus to targeted landmark or heading
            targetElem.setAttribute('tabindex', '-1');
            targetElem.focus({ preventScroll: true });
          }
        });
      });
    },

    setupScrollSpy() {
      if (!('IntersectionObserver' in window) || this.sections.length === 0) return;

      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.getAttribute('id');
            this.desktopLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, observerOptions);

      this.sections.forEach((section) => observer.observe(section));
    },

    setupHeaderScrollElevation() {
      if (!this.header) return;

      const handleScroll = () => {
        if (window.scrollY > 20) {
          this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)';
        } else {
          this.header.style.boxShadow = 'none';
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
  };

  
  document.addEventListener('DOMContentLoaded', () => {
    ThemeController.init();
    NavigationController.init();
  });
})();
