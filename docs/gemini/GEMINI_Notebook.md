# GEMINI Notebook

## Purpose
Engineering notebook recording design decisions, technical constraints, bug fixes, and solutions discovered during development of **Raiyan Uddin's Portfolio**.

## Last Updated
2026-07-21

---

## 💡 Key Engineering Solutions & Learnings

### 1. Windows Google Drive Sync File Locking (`EBUSY` / `EINVAL`)
- **Problem**: When Astro built static assets into `dist/` or `build_output/`, Windows Google Drive file watcher continuously locked files, causing `EBUSY: resource busy or locked` build crashes.
- **Solution**: Set `outDir: 'node_modules/.astro-out'` in `astro.config.mjs`. Because `node_modules` is ignored by cloud sync tools, file-locking errors were completely eliminated.
- **Watch Mode Fix**: Enabled `vite.server.watch.usePolling = true` with a 500ms interval for reliable live reload (HMR) detection on Windows.

### 2. Seamless 100% Continuous Infinite Marquee
- **Problem**: Translating marquee text from `0%` to `-100%` created visible jumps or empty gaps when icon count was small or screen width was large (e.g. 1170px+ desktop monitors).
- **Solution**: Duplicated the marquee skills array 4 times (`quadMarquee = [...skills, ...skills, ...skills, ...skills]`) and set `@keyframes skills-marquee` to translate from `0%` to `calc(-50% - 10px)` with `.icon-boxes { overflow: hidden; }`. This ensures `Set 3+4` slide into `Set 1+2`'s exact visual coordinates seamlessly with 0 gap on any monitor width.

### 3. Contact Form Submission without Backend Overhead
- **Problem**: Contact form required live email delivery to `raiyan.uddin.37.pro@gmail.com` without introducing server-side runtime code (Node.js/Express).
- **Solution**: Integrated client-side `fetch` submitting JSON to Web3Forms API (`api.web3forms.com/submit`). Added an automatic fallback to `window.location.href = mailto:...` if offline or API key is unconfigured.

### 4. DevToolbar Removal
- **Problem**: Astro devToolbar overlay appeared on dev previews and interfered with mobile responsiveness testing.
- **Solution**: Configured `devToolbar: { enabled: false }` in `astro.config.mjs` and executed `npx astro preferences disable devToolbar`.
