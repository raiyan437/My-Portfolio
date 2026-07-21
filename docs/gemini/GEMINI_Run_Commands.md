# GEMINI Run Commands

## Purpose
Reference guide for development, build, preference, and deployment commands.

## Last Updated
2026-07-21

---

## 💻 Essential Commands

### 1. Start Development Server
```bash
npm run dev
# Starts Astro dev server at http://localhost:4321/My-Portfolio/
```

### 2. Build Production Static Site
```bash
npx astro build
# Generates 15 static routes in node_modules/.astro-out/
```

### 3. Preview Production Build
```bash
npx astro preview
# Serves static build locally for verification
```

### 4. Permanently Disable Astro DevToolbar
```bash
npx astro preferences disable devToolbar
```

### 5. Git Commit & Deploy to GitHub
```bash
git add .
git commit -m "Final portfolio release"
git push origin main
```
