# Raiyan Uddin · QA Portfolio

Astro 4 static portfolio for Raiyan Uddin, a Software Quality Assurance Engineer based in Dhaka, Bangladesh. The site includes a filterable project showcase, case studies, professional experience, technical expertise, education, certificates, a résumé, and contact links.

## Run locally

Use Node.js 20 or later.

```sh
npm ci
npm run dev
```

Open [the local preview](http://127.0.0.1:4321/). To test a static production build locally, run `npm run build` followed by `npm run preview`.

## Local checks

```sh
npx playwright install chromium
npm run lint
npm run check
npm test
npm run build
```

Playwright reuses an Astro server on port 4321 or starts one for the test run. The suite checks routes, project filters, keyboard navigation, portfolio documents, responsive layouts, reduced motion, contact behavior, and automated accessibility rules.

## Content and design

- `src/data/projects.ts` drives the work galleries and case studies. The Projects page lists all entries. The homepage uses full-width project artwork with title buttons over each image in its scroll stack. The `cover` field supplies the artwork for galleries and case studies. The `coverAlt` field describes the image in the case study. Case studies with `group: "unlisted"` use `noindex` and are omitted from the sitemap. The `selectedWorkGroup` field supplies their category in the galleries and includes them in Selected Work.
- Gallery covers use a 16:10 canvas. Store a 2560 × 1600 WebP at the `cover` path and add 768 × 480 and 1280 × 800 variants with the `-768.webp` and `-1280.webp` suffixes.
- The covers use public UI captures from [MrMax](https://mrmax.jp/), [dNothi](https://d.nothi.gov.bd/login), [QA Brains](https://practice.qabrains.com/ecommerce/login), and the [BSEC IPO portal](https://ipo.sec.gov.bd/login), plus a published screen from [Mealkun](https://mealkun.jp/features/). Workflow illustrations follow the case studies and, for Restful Booker, the [published API documentation](https://restful-booker.herokuapp.com/apidoc/).
- `src/data/profile.ts` holds the biography, experience, education, and expertise.
- Timeline preview logos use published artwork from [BJIT](https://bjitgroup.com/), [Tappware](https://tappware.com/), [bKash Limited’s app listing](https://play.google.com/store/apps/details?id=com.bKash.customerapp), the [BRAC University Media Center](https://www.bracu.ac.bd/media-center), [Chittagong College](https://ctgcollege.gov.bd/), and [Nasirabad Govt. High School](https://www.nghsctg.edu.bd/).
- `src/data/certificates.ts` defines category filters and pairs certificate information with local WebP previews and the original PDFs.
- `src/styles/portfolio.css` holds the editorial design system and CSS animations. `src/scripts/portfolio.ts` handles progressive enhancements, including scroll reveals through IntersectionObserver.
- The hero serves responsive WebP versions of `public/images/hero-portrait.png`, with the original PNG as a fallback. On desktop, the color wipe starts from whichever edge the pointer enters and tracks movement along that axis. Touch-only devices show the portrait in color, and reduced-motion mode switches to an immediate full-color hover.
- The email links and local contact draft open Gmail in a browser tab with the recipient filled in. A Netlify production build emits the static Netlify Forms markup and sends one URL-encoded POST when that form is submitted.

The typography, framed hero, gallery, accordion, and experience panel draw on the publicly available [Dribbble reference](https://dribbble.com/shots/26995447-Personal-Portfolio-Website-Animations). The reference video also informed the hero reveal order, portrait color mask, project actions, case-study entrance, and related work. Browsers with native cross-document transitions animate page navigation, while direct loads and other browsers use the case-study entrance animation. Reduced motion keeps navigation and filtering immediate.

The cloud backdrop is a grayscale adaptation of [Cloudy Sky Background by Free Nature Stock](https://commons.wikimedia.org/wiki/File:Cloudy_Sky_Background.jpg), published under CC0. Manrope is bundled locally under the SIL Open Font License.
