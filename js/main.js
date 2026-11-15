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

  /* ==========================================================================
     5. FAQ Accessible Accordion
     ========================================================================== */
  const FaqAccordion = {
    init() {
      this.triggers = document.querySelectorAll('.faq-trigger');

      this.triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
          const targetId = trigger.getAttribute('aria-controls');
          const panel = document.getElementById(targetId);

          if (!panel) return;

          // Toggle state
          trigger.setAttribute('aria-expanded', String(!isExpanded));
          panel.hidden = isExpanded;
        });
      });
    }
  };

  /* ==========================================================================
     6. Form Validation & Submission (Zero Emojis, Robust Handling)
     ========================================================================== */
  const ContactFormController = {
    init() {
      this.form = document.getElementById('contact-form');
      this.successCard = document.getElementById('contact-success-state');
      this.resetBtn = document.getElementById('btn-reset-form');

      if (!this.form) return;

      this.nameInput = document.getElementById('contact-name');
      this.emailInput = document.getElementById('contact-email');
      this.messageInput = document.getElementById('contact-message');
      this.consentInput = document.getElementById('contact-consent');
      this.submitBtn = document.getElementById('btn-submit-contact');

      this.setupLiveValidation();
      this.setupSubmit();
      this.setupReset();
    },

    validateField(field, errorElemId, validationFn, errorMsg) {
      const errorElem = document.getElementById(errorElemId);
      const isValid = validationFn(field.value);

      if (!isValid) {
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
        if (errorElem) errorElem.textContent = errorMsg;
        return false;
      } else {
        field.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
        if (errorElem) errorElem.textContent = '';
        return true;
      }
    },

    setupLiveValidation() {
      // Name validation: minimum 2 characters
      this.nameInput.addEventListener('blur', () => {
        this.validateField(
          this.nameInput,
          'name-error',
          (val) => val.trim().length >= 2,
          'Please enter your full name (minimum 2 characters).'
        );
      });

      // Email validation: standard RFC compliant email pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      this.emailInput.addEventListener('blur', () => {
        this.validateField(
          this.emailInput,
          'email-error',
          (val) => emailRegex.test(val.trim()),
          'Please provide a valid business email address.'
        );
      });

      // Message validation: minimum 10 characters
      this.messageInput.addEventListener('blur', () => {
        this.validateField(
          this.messageInput,
          'message-error',
          (val) => val.trim().length >= 10,
          'Please describe your requirements (minimum 10 characters).'
        );
      });

      // Consent checkbox
      this.consentInput.addEventListener('change', () => {
        const errorElem = document.getElementById('consent-error');
        if (!this.consentInput.checked) {
          if (errorElem) errorElem.textContent = 'Please confirm consent to proceed.';
        } else {
          if (errorElem) errorElem.textContent = '';
        }
      });
    },

    setupSubmit() {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const isNameValid = this.validateField(
          this.nameInput,
          'name-error',
          (val) => val.trim().length >= 2,
          'Please enter your full name (minimum 2 characters).'
        );

        const isEmailValid = this.validateField(
          this.emailInput,
          'email-error',
          (val) => emailRegex.test(val.trim()),
          'Please provide a valid business email address.'
        );

        const isMsgValid = this.validateField(
          this.messageInput,
          'message-error',
          (val) => val.trim().length >= 10,
          'Please describe your requirements (minimum 10 characters).'
        );

        const consentError = document.getElementById('consent-error');
        let isConsentValid = true;
        if (!this.consentInput.checked) {
          isConsentValid = false;
          if (consentError) consentError.textContent = 'Please confirm consent to proceed.';
        } else {
          if (consentError) consentError.textContent = '';
        }

        if (!isNameValid || !isEmailValid || !isMsgValid || !isConsentValid) {
          // Focus first invalid element
          const firstInvalid = this.form.querySelector('.is-invalid, input:invalid');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        // Display loading state
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnSpinner = this.submitBtn.querySelector('.btn-spinner');
        this.submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Submitting Request...';
        if (btnSpinner) btnSpinner.hidden = false;

        // Simulate asynchronous dispatch
        setTimeout(() => {
          this.submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Send Request';
          if (btnSpinner) btnSpinner.hidden = true;

          // Populate success state details
          const userName = this.nameInput.value.trim();
          const userEmail = this.emailInput.value.trim();
          const randomId = 'PL-' + Math.floor(100000 + Math.random() * 900000);

          const nameDisplay = document.getElementById('success-user-name');
          const emailDisplay = document.getElementById('success-user-email');
          const ticketDisplay = document.getElementById('success-ticket-id');

          if (nameDisplay) nameDisplay.textContent = userName;
          if (emailDisplay) emailDisplay.textContent = userEmail;
          if (ticketDisplay) ticketDisplay.textContent = randomId;

          // Switch views
          this.form.hidden = true;
          this.successCard.hidden = false;
          this.successCard.focus();
        }, 800);
      });
    },

    setupReset() {
      if (!this.resetBtn) return;
      this.resetBtn.addEventListener('click', () => {
        this.form.reset();
        this.form.hidden = false;
        this.successCard.hidden = true;
        this.nameInput.focus();
      });
    }
  };

  
  document.addEventListener('DOMContentLoaded', () => {
    ThemeController.init();
    NavigationController.init();
    TelemetrySimulator.init();
    PricingController.init();
    FaqAccordion.init();
    ContactFormController.init();
  });
})();
