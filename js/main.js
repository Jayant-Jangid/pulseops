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

  /* ==========================================================================
     7. Accessible Modal Windows (Trial & Authentication)
     ========================================================================== */
  const ModalController = {
    init() {
      this.triggers = document.querySelectorAll('[data-modal-target]');
      this.closeButtons = document.querySelectorAll('.modal-close-btn');
      this.backdrops = document.querySelectorAll('.modal-backdrop');

      this.setupTriggers();
      this.setupCloseEvents();
      this.setupTrialForm();
      this.setupLoginForm();
    },

    openModal(modalId, sourcePlan) {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      // Ensure form is visible and success state is hidden on modal open
      const form = modal.querySelector('form');
      const successState = modal.querySelector('.modal-success-card');
      const errorMsg = modal.querySelector('.form-error-msg');
      if (form) form.hidden = false;
      if (successState) successState.hidden = true;
      if (errorMsg) errorMsg.textContent = '';

      modal.hidden = false;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      // Set plan name if trigger provided one
      if (sourcePlan) {
        const planInput = modal.querySelector('#modal-selected-plan');
        if (planInput) planInput.value = sourcePlan;
      }

      // Auto-focus primary input
      const firstInput = modal.querySelector('input:not([readonly]), button');
      if (firstInput) firstInput.focus();
    },

    closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.hidden = true;
      document.body.style.overflow = '';
    },

    setupTriggers() {
      this.triggers.forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-modal-target');
          const plan = btn.getAttribute('data-plan');
          this.openModal(targetId, plan);
        });
      });

      // Sign In buttons
      const desktopLogin = document.getElementById('btn-login');
      const mobileLogin = document.getElementById('mobile-login-btn');
      if (desktopLogin) {
        desktopLogin.addEventListener('click', () => this.openModal('login-modal'));
      }
      if (mobileLogin) {
        mobileLogin.addEventListener('click', () => this.openModal('login-modal'));
      }
    },

    setupCloseEvents() {
      this.closeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const modal = btn.closest('.modal-backdrop');
          this.closeModal(modal);
        });
      });

      this.backdrops.forEach((backdrop) => {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            this.closeModal(backdrop);
          }
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openModal = document.querySelector('.modal-backdrop.is-open');
          if (openModal) {
            this.closeModal(openModal);
          }
        }
      });
    },

    setupTrialForm() {
      const form = document.getElementById('modal-trial-form');
      const successState = document.getElementById('modal-success-state');
      const dismissBtn = document.getElementById('modal-done-btn');
      const emailInput = document.getElementById('modal-email');
      const errorMsg = document.getElementById('modal-email-error');

      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(email)) {
          emailInput.classList.add('is-invalid');
          if (errorMsg) errorMsg.textContent = 'Please enter a valid business email.';
          emailInput.focus();
          return;
        }

        emailInput.classList.remove('is-invalid');
        if (errorMsg) errorMsg.textContent = '';

        const submitBtn = document.getElementById('modal-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Provisioning...';
        }

        setTimeout(() => {
          form.hidden = true;
          if (successState) {
            successState.hidden = false;
            const confirmEmail = document.getElementById('modal-confirm-email');
            if (confirmEmail) confirmEmail.textContent = email;
          }
        }, 700);
      });

      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
          const modal = dismissBtn.closest('.modal-backdrop');
          this.closeModal(modal);
          setTimeout(() => {
            form.reset();
            form.hidden = false;
            if (successState) successState.hidden = true;
            const submitBtn = document.getElementById('modal-submit-btn');
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Create Workspace';
            }
          }, 300);
        });
      }
    },

    setupLoginForm() {
      const form = document.getElementById('login-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email');
        const pass = document.getElementById('login-password');
        const emailError = document.getElementById('login-email-error');
        const passError = document.getElementById('login-pass-error');

        let valid = true;
        if (!email.value.trim()) {
          email.classList.add('is-invalid');
          if (emailError) emailError.textContent = 'Email address is required.';
          valid = false;
        } else {
          email.classList.remove('is-invalid');
          if (emailError) emailError.textContent = '';
        }

        if (!pass.value.trim()) {
          pass.classList.add('is-invalid');
          if (passError) passError.textContent = 'Password is required.';
          valid = false;
        } else {
          pass.classList.remove('is-invalid');
          if (passError) passError.textContent = '';
        }

        if (!valid) return;

        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Authenticating...';
        }

        setTimeout(() => {
          alert('Demonstration: Successfully authenticated as ' + email.value.trim());
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Sign In';
          }
          const modal = form.closest('.modal-backdrop');
          this.closeModal(modal);
          form.reset();
        }, 600);
      });
    }
  };

  /* ==========================================================================
     8. Footer Dynamic Year
     ========================================================================== */
  const FooterController = {
    init() {
      const yearElem = document.getElementById('current-year');
      if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
      }
    }
  };

  /* ==========================================================================
     DOM Ready Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = '';
    ThemeController.init();
    NavigationController.init();
    TelemetrySimulator.init();
    PricingController.init();
    FaqAccordion.init();
    ContactFormController.init();
    ModalController.init();
    FooterController.init();
  });
})();
