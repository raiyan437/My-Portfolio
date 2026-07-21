# Workspace Rules for My-Portfolio

## Base URL & Routing Guidelines
- Always use Astro's `import.meta.env.BASE_URL` normalized with a trailing slash for all internal links, images, stylesheets, scripts, and asset URLs:
  ```astro
  ---
  const rawBase = import.meta.env.BASE_URL;
  const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';
  ---
  <a href={`${base}about/`}>About</a>
  <img src={`${base}assets/logo.png`} alt="Logo" />
  ```
- **NEVER** hardcode absolute root paths (e.g. `href="/style.css"`, `src="/assets/logo.png"`). Absolute root paths fail when deployed under GitHub Pages subpaths (`/My-Portfolio/`).
- **NEVER** hardcode fixed repository names (e.g. `href="/My-Portfolio/..."`). Fixed strings fail during local development (`npm run dev`).
- Always run `npm run build` after making modifications to verify clean compilation and output HTML structure in `dist/`.
