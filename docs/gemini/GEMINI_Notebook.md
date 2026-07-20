# GEMINI Notebook - Comprehensive Project Reference for NotebookLM

## Purpose
This document serves as the master source document designed for direct ingestion into **NotebookLM** (Notebook: `portfolio`). It consolidates the complete architectural specifications, file maps, design system rules, implementation history, and technical audit data into a single, comprehensive reference for querying the project in NotebookLM.

## Last Updated
2026-07-21

## Current Status
- **Phase**: Complete & Optimized for NotebookLM.
- **Scope**: Covers full Gridx portfolio replica, local assets, 8 project detail pages in `/Works/`, CSS design tokens, JavaScript event controllers, and repository governance rules.

## Relevant Files
- [index.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/index.html) - Main Entrance Dashboard
- [about.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/about.html) - Biography & Timeline
- [works.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/works.html) - 8 Project Grid Showcase
- [Works/](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/Works) - 8 Project Detail HTML Files (`dynamic.html`, `diesel-h1.html`, `seven-studio.html`, `raven-studio.html`, `submarine.html`, `hydra-merc.html`, `nova-design.html`, `zenith-agency.html`)
- [contact.html](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/contact.html) - Contact Page & Form
- [style.css](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/style.css) - Main Design System (2,000+ lines)
- [main.js](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/main.js) - Site Interactive Controller
- [docs/gemini/](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/docs/gemini) - Gemini Documentation Memory

---

## 1. Project Overview & Tech Stack

### Core Technology Stack
- **Structure**: Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`)
- **Styling**: Vanilla CSS3 + Localized Bootstrap v4 (`assets/bootstrap.min.css`)
- **Animations**: AOS (Animate On Scroll) library + CSS `@keyframes`
- **Logic**: Vanilla JavaScript (`main.js`)
- **Design Inspiration**: 100% replica of the **Gridx** dark glassmorphism portfolio template (`https://wpriverthemes.com/gridx/`).

### Page List & Purpose
1. **Home (`index.html`)**: Dashboard layout containing profile summary card, marquee ticker banner, credentials card, project showcase card, blog card, specialization services box, social profiles card, client stats box, and contact CTA.
2. **About (`about.html`)**: Personal story layout, profile portrait card, Experience timeline (Bluebase Designs, Larsen & Toubro), and Education timeline (UC, UT).
3. **Works (`works.html`)**: 8-project grid showcasing Dynamic, Diesel H1, Seven Studio, Raven Studio, Submarine, Hydra Merc, Nova Design, and Zenith Agency.
4. **Project Details (`Works/*.html`)**: 8 standalone detail pages inside `/Works/` featuring hero banners, dual info blocks, showcase images, sub-grid photo galleries, project overview meta cards, and next-project navigation buttons.
5. **Contact (`contact.html`)**: Contact details (Mail, Phone, Location), social channel links, and contact form with simulated submission feedback.

---

## 2. Architectural Design System & CSS Engine

### Design Tokens & Color Palette
- `--bg-dark` / Body Background: `#0F0F0F` (Solid dark slate background)
- Card Base Background: `#0F0F0F`
- `--primary_color`: `#5B78F6` (Electric periwinkle/violet accent)
- `--dark` (Buttons): `#323232`
- `--text-muted`: `#9F9F9F` / `#BCBCBC`
- Text Highlight: `#FFFFFF`

### Glassmorphism Card System (`.shadow-box`)
All cards utilize a multi-layer CSS pseudo-element architecture:
- **Base Container (`.shadow-box`)**:
  ```css
  position: relative;
  border-radius: 30px;
  background: #0F0F0F;
  ```
- **Glowing Metallic Border (`.shadow-box::after`)**:
  ```css
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  margin: -1px;
  z-index: -1;
  border-radius: 30px;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.01));
  ```
- **Glass Overlay Surface (`.shadow-box::before`)**:
  ```css
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  z-index: 1;
  opacity: 0.25;
  border-radius: 30px;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  ```
- **Content Stacking**: Child elements inside `.shadow-box` receive `z-index: 2` and relative position, ensuring text, buttons, and links sit above glass overlays.

### Grid & Container Width Locking
- **Max Width**: Standardized to `1170px !important` via `@media (min-width: 1200px)` in `style.css` to override standard Bootstrap container expansions.
- **Gutter Spacing**: 24px column gap (`gap-24`, `mb-24`, `mt-24`).
- **Responsive Breakpoints**:
  - `> 1200px`: Locked to 1170px grid.
  - `992px - 1199px`: Responsive padding scaling.
  - `768px - 991px`: Mobile menu trigger activated (`.show-menu`).
  - `< 767px`: Vertical 100% width column stacking.

---

## 3. Directory Structure & File Map

```
Demo portfolio/
├── index.html                  # Homepage (Grid Dashboard)
├── about.html                  # About Page (Biography & Timelines)
├── works.html                  # Works Page (8-Project Grid Showcase)
├── contact.html                # Contact Page (Details & Form)
├── style.css                   # Core Design System (2,038 lines)
├── main.js                     # Site Preloader, Nav Toggle, & AOS Logic
├── Works/                      # Standalone Project Detail HTML Files
│   ├── dynamic.html            # Web Designing (Dynamic)
│   ├── diesel-h1.html          # Photography (Diesel H1)
│   ├── seven-studio.html       # Mobile Designing (Seven Studio)
│   ├── raven-studio.html       # Branding (Raven Studio)
│   ├── submarine.html          # Mobile Designing (Submarine)
│   ├── hydra-merc.html         # Web Designing (Hydra Merc)
│   ├── nova-design.html        # UI/UX Design (Nova Design)
│   └── zenith-agency.html      # Architecture (Zenith Agency)
├── assets/                     # 29 Local Visual Assets & Libraries
│   ├── bootstrap.min.css       # Localized Bootstrap CSS
│   ├── bootstrap.bundle.min.js # Localized Bootstrap JS Bundle
│   ├── aos.css                 # Localized AOS Animation CSS
│   ├── aos.js                  # Localized AOS Script
│   ├── bg1.png                 # Card Background Overlay Pattern
│   ├── logo.svg                # Brand Header Logo
│   ├── me.png                  # Profile Image
│   ├── me2.png                 # About Page Bio Portrait
│   ├── sign.png                # Credentials Signature Graphic
│   ├── project-dt-1.jpeg       # Project Detail Showcase Banner
│   ├── project3-1.jpeg         # Project Detail Gallery Image
│   └── project1.jpeg - project6.jpeg # Project Grid Images
└── docs/
    └── gemini/                 # Project Memory Documentation
        ├── GEMINI_Current_State.md
        ├── GEMINI_Architecture.md
        ├── GEMINI_Implementation_Log.md
        ├── GEMINI_Project_Handoff.md
        ├── GEMINI_Technical_Audit.md
        ├── GEMINI_Roadmap.md
        └── GEMINI_Notebook.md
```

---

## 4. Key Implementation Milestones

1. **Pixel-Perfect Gridx Copy**: Built clean HTML structure matching Gridx elementor containers (`.about-me-box-wrap`, `.about-credentials-wrap`, `.about-services-box-wrap`, `.about-profile-box-wrap`, `.about-client-box-wrap`, `.about-contact-box-wrap`, `.contact-form`, `.project-details-wrap`).
2. **100% Asset Localization**: Downloaded and hosted all visual images, background patterns, and vendor CSS/JS libraries (`bootstrap.min.css`, `aos.css`, `bootstrap.bundle.min.js`, `aos.js`) locally in `./assets/`.
3. **Dedicated Works Directory**: Created `/Works/` containing 8 individual detail pages linking sequentially to each other via "Next Project" action buttons.
4. **Locked Container Widths**: Applied `max-width: 1170px !important` to eliminate grid width variations across screen sizes.
5. **Google Chrome Preference**: Documented and configured Google Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`) as the mandatory browser for all preview and testing operations.

---

## 5. NotebookLM Ingestion Q&A Context Guide

When querying the **portfolio** notebook in NotebookLM, refer to these key operational topics:

### Q: What tech stack is used in this portfolio?
**A**: Pure HTML5, Vanilla CSS3 (with localized Bootstrap v4 and custom glassmorphism styling), AOS scroll animations, and vanilla JavaScript (`main.js`). No build tools or Node.js runtime required.

### Q: How is the glassmorphism card effect implemented?
**A**: Via `.shadow-box` containers in `style.css`. `::after` creates the metallic gradient border (`margin: -1px`), `::before` creates the 25% opacity glass overlay, and child elements sit on top at `z-index: 2`.

### Q: How are project detail pages structured?
**A**: Stored inside the `/Works/` folder as 8 individual HTML files (`dynamic.html`, `diesel-h1.html`, `seven-studio.html`, `raven-studio.html`, `submarine.html`, `hydra-merc.html`, `nova-design.html`, `zenith-agency.html`). Each file links to `../style.css`, `../assets/...`, and `../main.js`.

### Q: What is the mandatory browser for testing?
**A**: Google Chrome located at `C:\Program Files\Google\Chrome\Application\chrome.exe`.

### Q: Where is project documentation stored?
**A**: Inside `/docs/gemini/` using the mandatory `GEMINI_` prefix rule.

---

## 6. Outstanding Work & Next Milestones
- **Automated Testing**: Optional setup of Playwright E2E test suite targeting Chrome.
- **Personalization**: Customizing bio copy, experience dates, and personal project links.
- **Production Deployment**: Static hosting on GitHub Pages, Netlify, or Vercel.
