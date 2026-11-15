# PulseOps - Landing Page Interface

A responsive, high-performance landing page for PulseOps, a synthetic endpoint monitoring and infrastructure status platform. Built as part of the Front-End Development Internship Assignment for Sankar Group.

---

## Overview

PulseOps is a synthetic monitoring SaaS designed for systems and site reliability engineers. It tracks HTTP response latency, SSL certificate lifecycles, and background cron heartbeats across a global probe network. This project delivers a production-grade, responsive landing page interface emphasizing accessibility, usable interactions, and clean layout structure without reliance on heavy runtime frameworks.

---

## Features Implemented

- Navigation Bar: Sticky navigation header with brand mark, section anchor links, theme toggle switch, account sign-in trigger, primary trial action, and an accessible mobile drawer menu with focus management.
- Hero Section: Technical value proposition, primary and secondary call-to-action triggers, assurance indicators, and a live interactive telemetry dashboard component.
- Interactive Diagnostic Probe Simulator: Functional in-browser probe runner allowing users to simulate multi-region network pings with realistic latency calculations, status codes, and regional consensus verification.
- 90-Day Telemetry Visualizer: Dynamic uptime bar chart with individual day inspection states and historical incident indicators.
- Core Infrastructure Features: Six structured feature cards detailing multi-node consensus, multi-channel alert routing, SSL expiration tracking, branded status pages, cron heartbeats, and synthetic assertions.
- System Architecture Workflow: Step-by-step breakdown explaining endpoint registration, consensus polling, and alert triage, paired with sample configuration code blocks.
- Performance Metrics Ribbon: Highlighting probe nodes, notification latency, uptime guarantees, and daily check throughput.
- Interactive Pricing Matrix: Monthly and annual billing frequency toggle with dynamic calculation of annual discount rates across Starter, Team, and Enterprise tiers.
- FAQ Accordion: Accessible expand-and-collapse disclosure panels with keyboard navigation support.
- Contact and Demo Form: Client-side validation enforcing full name length, business email formatting via regular expression, message length, and consent confirmation, accompanied by an animated loading state and persistent confirmation ticket view.
- Accessible Modal Dialogs: Modal components for workspace provisioning and authentication testing featuring background scroll locking, escape key dismissal, and backdrop click handling.
- Theme Switcher: Persistent dark and light mode toggle with system preference fallback and zero flash of unstyled content.

---

## Technologies Used

- HTML5: Semantic landmark elements (header, nav, main, section, article, aside, footer), form controls, and ARIA attributes for screen readers.
- CSS3: Custom properties (CSS variables) for modular theme tokens, responsive Flexbox and Grid layouts, CSS clamp typography scaling, and focus-visible indicators.
- JavaScript (ES6+): Modular vanilla script with zero third-party dependencies, handling DOM manipulation, IntersectionObserver for scroll-spy navigation, validation routines, and state transitions.
- Web Fonts: Google Fonts (Inter for user interface text, JetBrains Mono for telemetry metrics, status codes, and code snippets).

---

## Design Choices and Challenges Solved

The user interface was designed with a grounded, utilitarian dark-slate aesthetic inspired by modern developer infrastructure tools rather than generic AI landing page templates. I avoided arbitrary glowing gradients, neon mesh blobs, and vague marketing buzzwords in favor of concrete telemetry metrics, precise microcopy, and purposeful typography. 

One primary challenge was making the dashboard preview interactive without backend dependencies; this was solved by developing an asynchronous probe simulator in vanilla JavaScript that mimics multi-region network requests with realistic latency jitter and verification states. Another challenge was ensuring seamless accessibility across interactive components; I implemented full ARIA attributes, keyboard escape listeners, and focus transitions for both the mobile navigation drawer and the modal dialogues. Form validation was structured with real-time feedback and inline accessible error descriptions rather than default browser tooltips to maintain visual and functional consistency.

---

## Project Structure

```
pulseops-landing/
|-- index.html          # Semantic HTML5 markup and page structure
|-- css/
|   \-- styles.css      # CSS variables, typography, layouts, and responsive queries
|-- js/
|   \-- main.js         # Navigation, theme toggle, simulator, and validation logic
|-- assets/
|   \-- icons/          # Vector SVG icons
|-- screenshots/        # Visual walkthrough captures
|-- .gitignore          # Version control ignore specifications
|-- LICENSE             # MIT License
\-- README.md           # Project documentation and specifications
```

---

## Local Setup Instructions

No build step, package manager, compiler, or backend runtime is required. The website runs natively in any modern web browser.

### Option 1: Direct Browser Launch (Recommended)
1. Navigate into the `pulseops-landing` folder.
2. Double-click `index.html` or right-click and select "Open with" (Chrome, Firefox, Edge, or Safari).
3. The site and all interactions will work immediately.

### Option 2: VS Code Live Server (Optional)
If using Visual Studio Code:
1. Open the `pulseops-landing` folder in VS Code.
2. Right-click `index.html` and click "Open with Live Server".

---

