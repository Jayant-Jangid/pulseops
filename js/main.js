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

  
  document.addEventListener('DOMContentLoaded', () => {
    ThemeController.init();
  });
})();
