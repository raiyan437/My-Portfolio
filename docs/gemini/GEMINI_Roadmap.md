# GEMINI Roadmap

## Purpose
This document outlines the project roadmap, upcoming feature enhancements, automated testing integration, and deployment milestones for the **Demo Portfolio** project.

## Last Updated
2026-07-20

## Current Status
- Milestone 1 (Design & Replication) complete.
- Milestone 2 (Testing & Customization) pending execution.

## Relevant Files
- [index.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/index.html)
- [about.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/about.html)
- [works.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/works.html)
- [contact.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/contact.html)

## Decisions
- Structure project improvements into clear, sequential milestones.

## Planned Work & Milestones

### Phase 1: Core Design & Asset Localization (COMPLETED)
- [x] Replicate Gridx portfolio design with 100% fidelity.
- [x] Localize visual assets into `./assets/`.
- [x] Localize CSS and JS vendor libraries (`bootstrap.min.css`, `aos.css`, `bootstrap.bundle.min.js`, `aos.js`).
- [x] Standardize 1170px container max-width.
- [x] Create project documentation memory inside `/docs/gemini/`.

### Phase 2: Automated Testing Setup (PLANNED)
- [ ] Initialize `npm` package configuration (`package.json`).
- [ ] Install Playwright testing framework (`@playwright/test`).
- [ ] Script automated End-to-End (E2E) tests covering:
  - Header navigation links routing across all pages.
  - Preloader fade-out lifecycle.
  - Contact form validation and submission feedback.
  - Mobile viewport toggle menu.

### Phase 3: Personalization & Dynamic Backend Integration (PLANNED)
- [ ] Replace default profile placeholder copy with user's personal content, bio, experience, and education.
- [ ] Connect contact form submission to a real email backend endpoint (e.g. Formspree, EmailJS, or serverless function).

### Phase 4: Production Deployment (PLANNED)
- [ ] Deploy static portfolio site to GitHub Pages, Netlify, or Vercel.
- [ ] Configure custom domain name and SSL certificates.

## Outstanding Work
- Initiate Phase 2 when requested by user.
