# GEMINI Project Handoff

## Project Overview
- **Project Name**: Raiyan Uddin - Software QA Engineer Portfolio
- **Framework**: Astro (Static Web Application)
- **Live URL**: [https://raiyan437.github.io/My-Portfolio/](https://raiyan437.github.io/My-Portfolio/)
- **Repository**: [https://github.com/raiyan437/My-Portfolio.git](https://github.com/raiyan437/My-Portfolio.git)

---

## Directory Structure
```
Demo portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions automated deployment
├── docs/
│   └── gemini/                 # Project documentation suite
│       ├── GEMINI_Current_State.md
│       ├── GEMINI_Implementation_Log.md
│       ├── GEMINI_Project_Handoff.md
│       ├── GEMINI_GIT.md
│       ├── GEMINI_Notebook.md
│       ├── GEMINI_Architecture.md
│       ├── GEMINI_Roadmap.md
│       └── GEMINI_Technical_Audit.md
├── public/                     # Static assets served as-is
│   ├── assets/                 # Images & local CSS/JS libraries
│   ├── style.css               # Main portfolio CSS stylesheet
│   └── main.js                 # JS controller
├── src/
│   ├── components/             # Reusable Astro UI components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Preloader.astro
│   │   └── SocialLinks.astro
│   ├── layouts/
│   │   └── BaseLayout.astro    # Master page wrapper
│   └── pages/                  # Page routes
│       ├── index.astro         # Home page
│       ├── about.astro         # About page
│       ├── works.astro         # Works grid page
│       ├── contact.astro       # Contact page
│       └── works/              # 8 Project detail pages
├── astro.config.mjs            # Astro configuration with site & base URL
├── package.json                # Dependencies & scripts
└── .gitignore                  # Git ignore rules
```

---

## Local Development & Build Commands

### Start Local Dev Server
```powershell
npm run dev
```

### Build Production Bundle
```powershell
npm run build
```

### Push Updates to GitHub (Triggers Automated Deployment)
```powershell
git add .
git commit -m "Describe your changes"
git push origin main
```
