# GEMINI Architecture

## Purpose
This document details the architectural layout, design tokens, layering model, grid mechanics, and asset pipelines of the **Demo Portfolio** project.

## Last Updated
2026-07-20

## Current Status
- Architecture is locked and verified across desktop, tablet, and mobile viewports.

## Relevant Files
- [style.css](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/style.css) - Core CSS design system and theme specifications.
- [assets/bootstrap.min.css](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/assets/bootstrap.min.css) - Local grid framework.
- [assets/aos.css](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/assets/aos.css) - Scroll animation definitions.
- [main.js](file:///d:/Others/Google%20Antigravity/Demo%20portfolio/main.js) - Site event dispatcher and controller.

## Architecture Notes

### 1. Design Tokens & Color Palette
- **Background Dark**: `#0F0F0F` (Solid dark slate background)
- **Container Box Base**: `#0F0F0F`
- **Primary Color**: `#5B78F6` (Electric periwinkle/violet accent)
- **Button Dark**: `#323232`
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
- **Content Layering**: All child elements inside `.shadow-box` inherit `z-index: 2` and relative position, ensuring text, buttons, and links stack above the glass overlays.

### 3. Grid & Container Layout
- **Max Width**: Locked to `1170px !important` via `@media (min-width: 1200px)`.
- **Gutter Spacing**: 24px column gap (`gap-24`, `mb-24`, `mt-24`).
- **Responsive Stacking**: Stack to 100% width below 767px (`@media (max-width: 767px)`).

### 4. Interactive Components
- **Marquee Ticker**: Endless horizontal loop using `@keyframes marquee` scrolling text from `translateX(0)` to `translateX(-65.3%)`.
- **Preloader**: Vertical slide transition via `@keyframes preloader_slide` triggered by `.preloader.off`.
- **Mobile Navbar**: Sliding overlay menu (`.navbar.active`) toggled via `.show-menu` hamburger icon.

## Constraints
- **Framework Overhead**: Must remain standard static HTML/CSS/JS without heavy runtime bundlers (Webpack, Vite) for instant load performance.
- **Offline Compatibility**: All assets and CSS/JS scripts must reside in `./assets/` to run without internet dependency.

## Risks
- **External Web Font Fallback**: Iconoir relies on online web font files via CDN stylesheet. If internet access is completely blocked, icon vectors will default to text characters unless font files are downloaded locally.

## Future Considerations
- Migrate Iconoir font files (`iconoir.woff2`) to local `./assets/` directory for 100% air-gapped deployment.
- Integrate SSG (Static Site Generation) or templating if project pages scale beyond 10 static files.

## Outstanding Work
- None for core architecture.
