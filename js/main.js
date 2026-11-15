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

  /* ==========================================================================
     3. Hero Diagnostic Probe Simulator & 90-Day Telemetry Bar
     ========================================================================== */
  const TelemetrySimulator = {
    init() {
      this.probeBtn = document.getElementById('btn-run-probe');
      this.probeInput = document.getElementById('probe-url-input');
      this.probesList = document.getElementById('probes-list');
      this.timelineTrack = document.getElementById('timeline-bars-track');

      this.setupTimelineNodes();
      this.setupInteractiveProbes();
    },

    setupTimelineNodes() {
      if (!this.timelineTrack) return;
      this.timelineTrack.innerHTML = '';

      // Generate 60 nodes representing 60 days of historical uptime
      const totalNodes = 60;
      // Index 38 represents a planned 3-minute maintenance window
      const maintenanceDayIndex = 38;

      for (let i = 0; i < totalNodes; i++) {
        const bar = document.createElement('div');
        bar.className = 'timeline-bar-node';
        bar.setAttribute('tabindex', '0');

        const dayNumber = totalNodes - i;
        if (i === maintenanceDayIndex) {
          bar.classList.add('degraded');
          bar.setAttribute('title', `Day -${dayNumber}: 99.85% (Scheduled Kernel Update, 3m)`);
          bar.setAttribute('aria-label', `Day -${dayNumber}: 99.85% uptime`);
        } else {
          bar.setAttribute('title', `Day -${dayNumber}: 100.00% Operational (0 incidents)`);
          bar.setAttribute('aria-label', `Day -${dayNumber}: 100.00% uptime`);
        }

        this.timelineTrack.appendChild(bar);
      }
    },

    setupInteractiveProbes() {
      if (!this.probeBtn || !this.probeInput || !this.probesList) return;

      this.probeBtn.addEventListener('click', () => {
        const targetUrl = this.probeInput.value.trim();
        if (!targetUrl) {
          this.probeInput.focus();
          return;
        }

        this.runSimulation();
      });

      this.probeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.probeBtn.click();
        }
      });
    },

    runSimulation() {
      const rows = this.probesList.querySelectorAll('.probe-row');
      this.probeBtn.disabled = true;
      this.probeBtn.textContent = 'Probing...';

      // Set rows to testing state
      rows.forEach((row) => {
        const indicator = row.querySelector('.node-indicator');
        const latencyElem = row.querySelector('.probe-latency');
        const statusElem = row.querySelector('.probe-status');
        const consensusElem = row.querySelector('.probe-consensus');

        if (indicator) {
          indicator.className = 'node-indicator probing';
        }
        if (latencyElem) latencyElem.textContent = 'Testing...';
        if (statusElem) {
          statusElem.textContent = '---';
          statusElem.className = 'probe-status font-mono';
        }
        if (consensusElem) consensusElem.textContent = 'In-Flight';
      });

      // Stagger simulated node resolutions
      const regions = [
        { selector: '[data-region="iad"]', baseLatency: 28, jitter: 8 },
        { selector: '[data-region="fra"]', baseLatency: 44, jitter: 12 },
        { selector: '[data-region="bom"]', baseLatency: 82, jitter: 15 },
        { selector: '[data-region="syd"]', baseLatency: 108, jitter: 18 }
      ];

      regions.forEach((region, idx) => {
        setTimeout(() => {
          const row = this.probesList.querySelector(region.selector);
          if (!row) return;

          const measuredLatency = region.baseLatency + Math.floor(Math.random() * region.jitter);
          const indicator = row.querySelector('.node-indicator');
          const latencyElem = row.querySelector('.probe-latency');
          const statusElem = row.querySelector('.probe-status');
          const consensusElem = row.querySelector('.probe-consensus');

          if (indicator) indicator.className = 'node-indicator online';
          if (latencyElem) latencyElem.textContent = `${measuredLatency} ms`;
          if (statusElem) {
            statusElem.textContent = '200 OK';
            statusElem.className = 'probe-status font-mono text-success';
          }
          if (consensusElem) consensusElem.textContent = 'Verified';

          // Reset button on final region probe completion
          if (idx === regions.length - 1) {
            this.probeBtn.disabled = false;
            this.probeBtn.textContent = 'Run Probe';
          }
        }, 300 + idx * 220);
      });
    }
  };

  /* ==========================================================================
     4. Pricing Calculator & Annual Billing Toggle
     ========================================================================== */
  const PricingController = {
    init() {
      this.toggleSwitch = document.getElementById('billing-toggle');
      this.priceAmounts = document.querySelectorAll('.price-amount');
      this.teamNote = document.getElementById('team-billing-note');
      this.enterpriseNote = document.getElementById('enterprise-billing-note');

      if (!this.toggleSwitch) return;

      this.toggleSwitch.addEventListener('click', () => {
        const isAnnual = this.toggleSwitch.getAttribute('aria-checked') === 'true';
        const nextState = !isAnnual;

        this.toggleSwitch.setAttribute('aria-checked', String(nextState));
        this.updatePrices(nextState);
      });
    },

    updatePrices(isAnnual) {
      this.priceAmounts.forEach((el) => {
        const monthly = el.getAttribute('data-monthly');
        const annual = el.getAttribute('data-annual');
        el.textContent = isAnnual ? annual : monthly;
      });

      if (this.teamNote) {
        this.teamNote.textContent = isAnnual
          ? 'Billed annually ($228/year - Save $60)'
          : 'Billed monthly ($288/year)';
      }

      if (this.enterpriseNote) {
        this.enterpriseNote.textContent = isAnnual
          ? 'Billed annually ($852/year - Save $216)'
          : 'Billed monthly ($1,068/year)';
      }
    }
  };

  
  document.addEventListener('DOMContentLoaded', () => {
    ThemeController.init();
    NavigationController.init();
    TelemetrySimulator.init();
    PricingController.init();
  });
})();
