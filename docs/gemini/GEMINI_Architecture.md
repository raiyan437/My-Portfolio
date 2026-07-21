# GEMINI Architecture

## Purpose
This document details the architectural layout, design tokens, layering model, component hierarchy, and asset pipelines of **Raiyan Uddin's Personal QA Engineering Portfolio**.

## Last Updated
2026-07-21

## Current Status
- Architecture is locked and verified across desktop, tablet, and mobile viewports.

## Relevant Files
- [public/style.css](file:///g:/Other%20computers/My%20Computer/Google%20Antigravity/Demo%20portfolio/public/style.css) - Core CSS design system and glassmorphism specifications.
- [src/layouts/BaseLayout.astro](file:///g:/Other%20computers/My%20Computer/Google%20Antigravity/Demo%20portfolio/src/layouts/BaseLayout.astro) - Primary HTML5 shell layout with SEO, favicon, and Back-to-Top button.
- [src/components/Header.astro](file:///g:/Other%20computers/My%20Computer/Google%20Antigravity/Demo%20portfolio/src/components/Header.astro) - Navigation topbar with active page indicators.
- [src/components/Footer.astro](file:///g:/Other%20computers/My%20Computer/Google%20Antigravity/Demo%20portfolio/src/components/Footer.astro) - Footer menu with dynamic copyright year.
- [src/components/SocialLinks.astro](file:///g:/Other%20computers/My%20Computer/Google%20Antigravity/Demo%20portfolio/src/components/SocialLinks.astro) - Reusable 6-icon social media links component.

## Architecture Notes

### 1. Design Tokens & Color Palette
- **Background Dark**: `#0F0F0F` (Solid dark slate background)
- **Container Box Base**: `#0F0F0F`
- **Primary Accent**: `#5B78F6` (Electric periwinkle/violet accent)
- **Text Primary**: `#FFFFFF`
- **Text Muted**: `#9F9F9F` / `#BCBCBC`

### 2. Glassmorphism Card System (`.shadow-box`)
Cards feature a multi-layer pseudo-element stack:
- **Base Card (`.shadow-box`)**: `position: relative; border-radius: 30px; background: #0F0F0F;`
- **Glowing Border Overlay (`.shadow-box::after`)**:
  - `position: absolute; margin: -1px; z-index: -1;`
  - `background: linear-gradient(120deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.01));`
  - Creates the subtle, high-end 1px metallic border highlight around each box.
- **Glass Texture Overlay (`.shadow-box::before`)**:
  - `position: absolute; width: 100%; height: 100%; z-index: 1; opacity: 0.25;`
  - `background: linear-gradient(120deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));`

### 3. Infinite Marquee Mechanics
- **4x Duplicated Array Track**: `quadMarquee = [...marqueeSkills, ...marqueeSkills, ...marqueeSkills, ...marqueeSkills]`.
- **Keyframe Key**: Translate from `translateX(0)` to `translateX(calc(-50% - 10px))` with `animation: skills-marquee 14s linear infinite`.
- **Overflow Clipping**: `.icon-boxes { overflow: hidden; position: relative; }` + `overflow-x: hidden` on `html, body`.

### 4. Build Architecture
- **Framework**: Astro 4.0 (`output: 'static'`).
- **Output Directory**: `node_modules/.astro-out` (bypasses Windows Google Drive file-locking).
- **Vite Polling Watcher**: `vite.server.watch.usePolling = true` for reliable live reloading.

## Outstanding Work
- None. Core architecture is fully implemented, documented, and verified.
