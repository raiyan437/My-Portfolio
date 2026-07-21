# GEMINI Roadmap

## Purpose
Roadmap tracking completed milestones and post-launch enhancement possibilities for **Raiyan Uddin's Portfolio**.

## Last Updated
2026-07-21

---

## 🎯 Completed Milestones (Phase 1) ✅

- [x] **Core Page Architecture**: Built 15 static Astro routes (Home, About, Skills, Works, Certifications, Contact, 8 Case Studies, 404 Page).
- [x] **Top Bar & Footer Navigation**: Synced 6-item navigation order (`Home` → `About` → `Skills` → `Works` → `Certifications` → `Contact`).
- [x] **Infinite Skills Marquee**: 4x quadMarquee loop with zero gap and zero jump on `skills.astro`.
- [x] **Resume PDF Integration**: Integrated `SQA_Raiyan_Uddin_CV.pdf` on Home and About pages (`target="_blank"`).
- [x] **Contact Form Integration**: Web3Forms API sending form entries to `raiyan.uddin.37.pro@gmail.com` with mailto fallback.
- [x] **SEO & Social Sharing**: OpenGraph preview tags, Twitter metadata, meta keywords, `robots.txt`.
- [x] **UX & Accessibility**: Glassmorphic Back-to-Top scroll button, horizontal scrollbar fix (`overflow-x: hidden`), mobile menu auto-close outside click handler.
- [x] **Documentation**: Complete `README.md`, `walkthrough.md`, `project_audit.md`, and `docs/gemini/` suite.

---

## 🚀 Post-Launch Enhancements (Phase 2)

- [ ] **GitHub Actions Auto-Deploy Workflow**: Add `.github/workflows/deploy.yml` for automated GitHub Pages publishing on `git push`.
- [ ] **Full-Screen Image Lightbox Modal**: Add modal image zoom for project case study screenshots.
- [ ] **Automatic XML Sitemap**: Integrate `@astrojs/sitemap` package for automatic sitemap compilation.
- [ ] **Custom Domain**: Attach a personal domain (e.g. `raiyanuddin.dev`) via GitHub Pages CNAME.
