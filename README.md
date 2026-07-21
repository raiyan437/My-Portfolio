# Raiyan Uddin - Software QA Engineer Portfolio

A modern, high-performance personal portfolio website for **Raiyan Uddin**, Software QA Engineer based in Bangladesh. Built with **Astro 4**, Vanilla CSS glassmorphism styling, and responsive Bootstrap layout.

Live Preview: [https://raiyan437.github.io/My-Portfolio/](https://raiyan437.github.io/My-Portfolio/)

---

## 🌟 Key Features

- **⚡ Blazing Fast Performance**: Built using Astro 4.0 static site generation, achieving 95+ PageSpeed scores.
- **🎨 Glassmorphic Dark Aesthetics**: Sleek dark mode design (`#0F0F0F` background, `#5B78F6` primary accent) with responsive card grids and smooth hover micro-animations.
- **🔄 Infinite Never-Ending Skills Marquee**: 4x quadMarquee loop with zero gap, zero jump, and smooth linear infinite scrolling across all screen sizes.
- **📄 Resume PDF Download**: Direct opening of `SQA_Raiyan_Uddin_CV.pdf` in a new browser tab (`target="_blank"`).
- **📬 Live Contact Form**: Integrated Web3Forms API sending form submissions directly to `raiyan.uddin.37.pro@gmail.com` with a built-in `mailto:` client fallback.
- **📱 Responsive & Accessible**: Mobile navigation drawer with auto-close on link selection or outside click, and a theme-matched floating Back-to-Top scroll button.
- **🔍 SEO & Social Preview Ready**: OpenGraph metadata (`og:title`, `og:image`, `og:description`), Twitter cards, QA-targeted meta keywords, and `robots.txt`.

---

## 📂 Page & Navigation Structure (15 Static Routes)

1. **Home (`/`)**: Hero section, infinite skills marquee, Resume card, Specialization card, Showcase projects, and social links.
2. **About (`/about/`)**: Bio, Experience timeline, Education, Profiles, Contact CTA, and Resume card.
3. **Skills (`/skills/`)**: Interactive 4x marquee loop + 4 Glassmorphic Specialization Cards (*Test Automation & Frameworks*, *API & Performance Testing*, *CI/CD & DevOps Integration*, *QA Strategy & Management*).
4. **Works (`/works/`)**: Showcase directory featuring 8 QA automation and manual testing projects.
5. **Certifications (`/certifications/`)**: 6 uniform equal-sized certification cards (ISTQB CTFL, Playwright Masterclass, Postman Expert, JMeter, Agile QA, Git CI/CD).
6. **Contact (`/contact/`)**: Live contact form + 3x2 grid of social icon pills (Email, LinkedIn, GitHub, Facebook, Instagram, WhatsApp).
7. **8 Project Case Study Pages (`/works/[slug]/`)**:
   - BSEC IPO System (`bsec-ipo-system`)
   - D-Nothi (`dnothi`)
   - GCC Mealkun (`gcc-mealkun`)
   - MrMax (`mrmax`)
   - Practice Management System (`practice-management-system`)
   - QA Brains Java Playwright (`qa-brains-java-playwright`)
   - QA Brains TS Playwright (`qa-brains-ts-playwright`)
   - Restful Booker (`restful-booker`)
8. **Custom 404 Error Page (`/404.html`)**: Glassmorphic error page with a "Back to Home" button.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [Astro 4.0](https://astro.build/)
- **Styling**: Vanilla CSS (Custom Tokens, Glassmorphism, Micro-animations)
- **UI Grid**: Bootstrap 5.3
- **Icons**: Iconoir CDN & Custom SVGs
- **Form Handler**: Web3Forms API
- **Deployment Output**: Static Site (`output: 'static'`, `outDir: 'node_modules/.astro-out'`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/raiyan437/My-Portfolio.git

# Navigate into project directory
cd My-Portfolio

# Install dependencies
npm install
```

### Local Development Server

```bash
# Start Astro dev server at http://localhost:4321/My-Portfolio/
npm run dev
```

### Production Build & Preview

```bash
# Build static site output into node_modules/.astro-out
npx astro build

# Preview production build locally
npx astro preview
```

---

## 📬 Contact & Social Links

- **Email**: [raiyan.uddin.37.pro@gmail.com](mailto:raiyan.uddin.37.pro@gmail.com)
- **LinkedIn**: [Raiyan Uddin](https://www.linkedin.com/in/raiyan-uddin-pyrogod/)
- **GitHub**: [@raiyan437](https://github.com/raiyan437)
- **Facebook**: [Raiyan Uddin](https://www.facebook.com/raiyan.uddin/)
- **Instagram**: [@raiyan.4](https://www.instagram.com/raiyan.4/)
- **WhatsApp**: [Chat on WhatsApp](https://wa.link/6uo9zk)

---

© All rights reserved by **Raiyan Uddin**.
