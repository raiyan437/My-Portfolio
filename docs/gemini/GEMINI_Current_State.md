# GEMINI Current State

## Purpose
This document provides a comprehensive summary of the current operational state of **Raiyan Uddin's Software QA Engineer Portfolio** built with **Astro 4** and configured for **GitHub Pages**.

## Last Updated
2026-07-21

## Live Site URL
👉 **[https://raiyan437.github.io/My-Portfolio/](https://raiyan437.github.io/My-Portfolio/)**

## Current Status
- **Phase**: Complete, Documented & Verified.
- **Framework**: Astro 4.0 (Static Output).
- **Build Output**: `output: 'static'`, `outDir: 'node_modules/.astro-out'`.
- **GitHub Repository**: `https://github.com/raiyan437/My-Portfolio.git` (`main` branch).
- **Pages (15 Static Routes)**:
  1. Home (`/My-Portfolio/`)
  2. About (`/My-Portfolio/about/`)
  3. Skills (`/My-Portfolio/skills/`)
  4. Works (`/My-Portfolio/works/`)
  5. Certifications (`/My-Portfolio/certifications/`)
  6. Contact (`/My-Portfolio/contact/`)
  7. 8 Project Detail Case Study Pages (`/My-Portfolio/works/*`):
     - `mrmax`
     - `qa-brains-java-playwright`
     - `qa-brains-ts-playwright`
     - `restful-booker`
     - `gcc-mealkun`
     - `bsec-ipo-system`
     - `dnothi`
     - `practice-management-system`
  8. Custom 404 Error Page (`/404.html`)

## Key Features & Assets
- **Top Bar & Footer Navigation**: Synced 6-item menu order (`Home` → `About` → `Skills` → `Works` → `Certifications` → `Contact`).
- **Tab Branding**: Page title tags cleaned of template text + topbar logo favicon (`logo.png`).
- **4x Infinite Skills Marquee**: Never-ending 4x duplicated marquee track with zero gap and zero jump on `skills.astro`.
- **CV PDF Integration**: `SQA_Raiyan_Uddin_CV.pdf` linked on Home and About pages (`target="_blank"`).
- **Live Contact Form**: Web3Forms API integration sending submissions to `raiyan.uddin.37.pro@gmail.com` + mailto fallback.
- **3x2 Social Links Grid**: Email, LinkedIn, GitHub, Facebook, Instagram, WhatsApp.
- **UX & Performance**: Theme-matched Back-to-Top scroll button, `overflow-x: hidden` horizontal scrollbar fix, and OpenGraph/Twitter card metadata.

## Build Status
- **Static Build**: 15/15 routes compile cleanly in ~3.8 seconds with 0 errors (`npx astro build`).
