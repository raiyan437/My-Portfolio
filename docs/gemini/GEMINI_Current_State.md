# GEMINI Current State

## Purpose
This document provides a comprehensive summary of the current operational state of **Raiyan Uddin's Software QA Engineer Portfolio** built with the **Astro framework** and deployed on **GitHub Pages**.

## Last Updated
2026-07-21

## Live Site URL
👉 **[https://raiyan437.github.io/My-Portfolio/](https://raiyan437.github.io/My-Portfolio/)**

## Current Status
- **Phase**: Complete & Deployed.
- **Framework**: Astro (Static Output).
- **Deployment**: Automated via GitHub Actions (`.github/workflows/deploy.yml`).
- **GitHub Repository**: `https://github.com/raiyan437/My-Portfolio.git` (`main` branch).
- **Personalized Pages**:
  - Home (`/My-Portfolio/`): Raiyan Uddin Software QA Engineer bio, marquee, skill pills, resume link, social SVGs, stats.
  - About (`/My-Portfolio/about/`): Experience timeline (*BJIT, Tappware, bKash*) & Education timeline (*BRAC University, Chittagong College, Nasirabad Govt High School*).
  - Works (`/My-Portfolio/works/`): Grid showcase for 8 QA & Web projects.
  - Contact (`/My-Portfolio/contact/`): Contact details (`raiyan.uddin.37.pro@gmail.com`, `+88 018 61277634`, `Dhaka, Bangladesh`).
  - 8 Project Detail Pages (`/My-Portfolio/works/*`):
    1. `mrmax`
    2. `qa-brains-java-playwright`
    3. `qa-brains-ts-playwright`
    4. `restful-booker`
    5. `gcc-mealkun`
    6. `bsec-ipo-system`
    7. `dnothi`
    8. `practice-management-system`

## Asset & Routing Architecture
- **Base URL**: `/My-Portfolio/`
- **Component Hierarchy**: `BaseLayout.astro` $\rightarrow$ `Header.astro`, `Footer.astro`, `Preloader.astro`, `SocialLinks.astro` $\rightarrow$ `<slot />`.
- **Assets**: Served from `public/` (`public/assets/`, `public/style.css`, `public/main.js`).

## Outstanding Work
- None. Project is 100% complete, verified, and live on GitHub Pages.
