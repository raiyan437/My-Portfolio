import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { orderedProjects, projects, selectedProjects } from "../src/data/projects";

const unlistedRoutes = projects.filter(({ group }) => group === "unlisted").map(({ slug }) => "/works/" + slug + "/");
const productProjects = orderedProjects.filter(({ group, selectedWorkGroup }) =>
  (group === "unlisted" ? selectedWorkGroup : group) === "product",
);

const routeHeadings: [string, string][] = [
  ["/about/", "About me"],
  ["/skills/", "Technical expertise"],
  ["/experience/", "Experience"],
  ["/works/", "All work"],
  ["/certifications/", "Certifications"],
  ["/contact/", "Let’s talk testing."],
  ...projects.map(({ slug, title }): [string, string] => ["/works/" + slug + "/", title]),
];

test.beforeEach(async ({ context, baseURL }) => {
  await context.route("http{,s}://**/*", async (route) => {
    if (new URL(route.request().url()).origin === baseURL) await route.continue();
    else await route.abort();
  });
});

test("serves existing routes and preserves noindex on unlisted projects", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", ({ message }) => errors.push(message));

  for (const [route, heading] of routeHeadings) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toContainText(heading);
    if (unlistedRoutes.includes(route)) {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
  }

  const missing = await page.goto("/missing-local-page/");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to home", exact: true })).toHaveAttribute("href", "/");
  await expect(page.getByRole("link", { name: "Browse projects", exact: true })).toHaveAttribute("href", "/works/");
  expect(errors).toEqual([]);
});

test("filters work and opens a case study", async ({ page }) => {
  await page.goto("/");
  const selectedTitles = await page.locator("#work .project-card h3").allTextContents();

  await page.goto("/works/");
  const cards = page.locator(".project-card:visible");
  await expect(cards).toHaveCount(projects.length);
  const galleryTitles = await cards.locator("h3").allTextContents();
  expect(galleryTitles.filter((title) => selectedTitles.includes(title))).toEqual(selectedTitles);
  await expect(cards.getByText("View case study", { exact: true })).toHaveCount(0);
  const loadingModes = await cards.locator("img").evaluateAll((images) => images.map((image) => image.getAttribute("loading")));
  expect(loadingModes).toEqual(projects.map((_, index) => index < 2 ? "eager" : "lazy"));

  const filter = page.getByRole("button", { name: "Product QA" });
  const filterBar = page.getByRole("group", { name: "Filter projects" });
  await expect(filterBar).toHaveAttribute("data-highlight", "");
  const highlightX = () => filterBar.evaluate((element: HTMLElement) => parseFloat(element.style.getPropertyValue("--highlight-x")));
  const before = await highlightX();
  await filter.click();
  await expect.poll(highlightX).toBeGreaterThan(before);
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/\/works\/\?filter=product$/);
  await expect(page.getByRole("status")).toHaveText(productProjects.length + " projects shown.");
  await expect(cards.locator("h3")).toHaveText(productProjects.map(({ title }) => title));

  await page.getByRole("link", { name: "BSEC IPO System" }).click();
  await expect(page).toHaveURL(/works\/bsec-ipo-system\/\?filter=product$/);
  await expect(page.getByRole("heading", { name: "My contribution" })).toBeVisible();
  const deliverable = page.getByRole("region", { name: "What the work delivered" });
  await expect(deliverable).toContainText("regression checks");
  await expect(deliverable.locator("details")).toHaveCount(0);
  await expect(page.locator(".case-checks dt")).toHaveText(["Role-based approvals", "Financial forms", "Document uploads"]);
  await page.getByRole("link", { name: /Next project/ }).click();
  await expect(page).toHaveURL(/works\/dnothi\/\?filter=product$/);
  await page.getByRole("link", { name: "Back to projects" }).click();
  await expect(page).toHaveURL(/\/works\/\?filter=product$/);
  await expect(filter).toHaveAttribute("aria-pressed", "true");
});

test("restores a homepage filter after visiting a case study", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?filter=automation#work");
  const work = page.locator("#work");
  const filter = work.getByRole("button", { name: "Automation" });
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: "Explore my work" })).toHaveAttribute("href", "/?filter=automation#work");
  await expect(work.getByRole("link", { name: "View all work" })).toHaveAttribute("href", "/works/?filter=automation");
  const firstProject = work.getByRole("link", { name: "QA Brains Automation · TypeScript" });
  await firstProject.click();
  const backLink = page.getByRole("link", { name: "Back to projects" });
  await expect(backLink).toHaveAttribute("href", "/?filter=automation#work");
  await page.goBack();
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  await firstProject.click();
  await expect(backLink).toHaveAttribute("href", "/?filter=automation#work");
  await backLink.click();
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  await work.getByRole("button", { name: "All", exact: true }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(work.locator(".project-card:visible")).toHaveCount(selectedProjects.length);
  await expect(work.locator(".section-backdrop")).toHaveAttribute("data-word", "Portfolio");
  const first = work.locator(".project-card").first();
  await expect(first.getByRole("heading")).toHaveText(selectedProjects[0].title);
  await expect(first.locator(".project-copy")).toHaveCount(0);
  await expect(first.getByRole("link")).toHaveAttribute("href", "/works/" + selectedProjects[0].slug + "/?from=selected-work");
});

test("returns from an unfiltered homepage case study to Selected Work", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#work");
  await page.locator("#work").getByRole("link", { name: "BSEC IPO System", exact: true }).click();
  await expect(page).toHaveURL(/works\/bsec-ipo-system\/\?from=selected-work$/);
  await page.getByRole("link", { name: /Next project/ }).click();
  await expect(page).toHaveURL(/works\/dnothi\/\?from=selected-work$/);
  await page.getByRole("link", { name: "Back to projects" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work").getByRole("status")).toHaveText(selectedProjects.length + " projects shown.");
});

test("lists product projects in Selected Work and preserves the filter when returning", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?filter=product#work");
  const work = page.locator("#work");
  await expect(work.getByRole("button", { name: "Product QA" })).toHaveAttribute("aria-pressed", "true");
  await expect(work.locator(".project-card:visible h3")).toHaveText(productProjects.map(({ title }) => title));

  for (const { title, slug } of productProjects.slice(0, 2)) {
    const link = work.getByRole("link", { name: title, exact: true });
    await link.scrollIntoViewIfNeeded();
    await link.locator("img").evaluate((image: HTMLImageElement) => image.decode());
    await link.click();
    await expect(page.locator("main h1")).toHaveText(title);
    await expect(page).toHaveURL("/works/" + slug + "/?filter=product&from=selected-work");
    const back = page.getByRole("link", { name: "Back to projects" });
    await expect(back).toHaveAttribute("href", "/?filter=product#work");
    await back.click();
    await expect(page).toHaveURL("/?filter=product#work");
  }
});

for (const [width, height] of [[1440, 900], [390, 844], [320, 640]]) {
  test("stacks Selected Work on scroll at " + width + " px", async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const stack = page.locator("[data-project-stack]");
    const cards = stack.locator(".project-card");
    const first = cards.first();
    const second = cards.nth(1);
    const last = cards.last();
    await expect(first).toHaveCSS("position", "sticky");
    const firstBox = (await first.boundingBox())!;
    const secondBox = (await second.boundingBox())!;
    const lastBox = (await last.boundingBox())!;
    const hero = (await page.locator(".hero").boundingBox())!;
    for (const card of [firstBox, secondBox, lastBox]) {
      expect(card.x).toBeCloseTo(hero.x, 0);
      expect(card.width).toBeCloseTo(hero.width, 0);
      expect(card.height).toBeCloseTo(Math.min(hero.width * 3 / 5, height * .74), 0);
    }
    await expect(page.locator("#work")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    const pin = await first.evaluate((element) => parseFloat(getComputedStyle(element).top));
    const scrollTo = (top: number) => page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);

    await scrollTo(secondBox.y - pin - firstBox.height / 2);
    expect((await first.boundingBox())!.y).toBeCloseTo(pin, 0);
    expect((await second.boundingBox())!.y).toBeGreaterThan(pin);
    const topProject = await second.evaluate((element) => {
      const { left, top, width } = element.getBoundingClientRect();
      return document.elementFromPoint(left + width / 2, top + 10)?.closest(".project-card")?.querySelector("h3")?.textContent;
    });
    expect(topProject).toBe(selectedProjects[1].title);

    await expect(first).toHaveCSS("opacity", "1");
    await scrollTo(secondBox.y - pin + 5);
    expect((await first.boundingBox())!.y).toBeCloseTo((await second.boundingBox())!.y, 0);
    await expect(first).toHaveClass(/will-reveal/);
    await expect(first).not.toHaveClass(/is-revealed/);
    await scrollTo(secondBox.y - pin - 65);
    await expect(first.locator(".project-visual")).toHaveCSS("animation-name", "showcase-image-in");

    await scrollTo(lastBox.y - pin + 100);
    expect((await last.boundingBox())!.y).toBeLessThan(pin - 50);
    await scrollTo(firstBox.y - pin + 5);
    expect((await first.boundingBox())!.y).toBeCloseTo(pin, 0);
    expect((await second.boundingBox())!.y).toBeGreaterThan(pin + firstBox.height / 2);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(first).toHaveCSS("position", "static");
    await expect(cards).toHaveCount(selectedProjects.length);
  });
}

test("shows the loader while an eager page image is still loading", async ({ page }) => {
  let releaseImage!: () => void;
  const imageDelay = new Promise<void>((resolve) => { releaseImage = resolve; });
  await page.route(/hero-portrait(?:-\d+)?\.(?:webp|png)(?:\?.*)?$/, async (route) => {
    await imageDelay;
    await route.continue();
  });

  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const loader = page.locator(".page-loader");
    await expect(loader).toHaveCSS("opacity", "1");
    await expect.poll(() => loader.locator(".page-loader-track").evaluate((track) => (
      getComputedStyle(track, "::after").animationName
    ))).toBe("loader-sweep");
    await expect(page.locator(".hero-role")).toHaveCSS("animation-play-state", "paused");
    releaseImage();
    await expect(loader).toBeHidden();
    await expect(page.locator(".hero-role")).toHaveCSS("opacity", "1");
  } finally {
    releaseImage();
  }
});

test("shows the loader for a slow internal link and clears it on the new page", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/works/");
  let releasePage!: () => void;
  const navigationDelay = new Promise<void>((resolve) => { releasePage = resolve; });
  await page.route("**/experience/", async (route) => {
    await navigationDelay;
    await route.continue();
  });

  const click = page.getByRole("link", { name: "Experience", exact: true }).click();
  try {
    await expect(page.locator('html[data-page-loading="navigation"] .page-loader')).toBeVisible();
  } finally {
    releasePage();
    await click;
  }
  await expect(page).toHaveURL("/experience/");
  await expect(page.locator(".page-loader")).toBeHidden();
});

test("the homepage intro waits for Manrope before revealing text", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  let releaseFont!: () => void;
  const fontDelay = new Promise<void>((resolve) => { releaseFont = resolve; });
  await page.route(/manrope-latin-wght-normal[^/]*\.woff2(?:\?.*)?$/, async (route) => {
    await fontDelay;
    await route.continue();
  });

  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const title = page.locator(".name-mask > span").first();
    await expect(title).toHaveCSS("animation-play-state", "paused");
    await expect(title).toHaveCSS("opacity", "0");
    releaseFont();
    await expect(title).toHaveCSS("animation-play-state", "running");
    await expect(title).toHaveCSS("opacity", "1");
  } finally {
    releaseFont();
  }
});

test("the desktop highlight tracks navigation and the reading line follows scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  const projects = nav.getByRole("link", { name: "Projects", exact: true });
  await projects.hover();
  await expect(nav).toHaveAttribute("data-highlight", "");
  await expect(projects).toHaveCSS("text-decoration-line", "none");
  await expect.poll(() => projects.evaluate((link) => Number(getComputedStyle(link).scale))).toBeGreaterThan(1);
  const highlightX = () => nav.evaluate((element: HTMLElement) => parseFloat(element.style.getPropertyValue("--highlight-x")));
  const before = await highlightX();
  await nav.getByRole("link", { name: "Expertise" }).hover();
  await expect.poll(highlightX).toBeGreaterThan(before);
  await page.mouse.move(1, 30);
  await expect(nav).not.toHaveAttribute("data-highlight", "");

  const track = page.locator("[data-page-progress]");
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: "instant" }));
  await expect.poll(() => track.evaluate((element: HTMLElement) => parseFloat(element.style.getPropertyValue("--page-progress")))).toBeGreaterThan(.4);
  await expect(track).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(track).toBeHidden();
});

test("top-bar links open their own pages from the homepage and other pages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const nav = page.getByRole("navigation", { name: "Main" });

  for (const [name, route] of [["Projects", "/works/"], ["Expertise", "/skills/"], ["Experience", "/experience/"]]) {
    const link = nav.getByRole("link", { name, exact: true });
    for (const start of ["/", "/about/"]) {
      await page.goto(start);
      await expect(link).toHaveAttribute("href", route);
      await link.click();
      await expect(page).toHaveURL(route);
      await expect(link).toHaveAttribute("aria-current", "page");
    }
  }
});

for (const width of [1440, 390]) {
  test("the homepage header scrolls away and the arrow returns to the top at " + width + " px", async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const header = page.locator(".topbar");
    const backToTop = page.locator("[data-home-back-to-top]");
    const scrollTo = (top: number) => page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
    await expect(header).toBeInViewport();
    await expect(backToTop).toBeHidden();

    await scrollTo(1600);
    await expect(header).not.toBeInViewport();
    await scrollTo(1300);
    await expect(header).not.toBeInViewport();
    await expect(header).not.toHaveAttribute("data-scrolled", "");
    await expect(backToTop).toBeInViewport();
    await expect(backToTop).toHaveAccessibleName("Back to top of homepage");

    await backToTop.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/#top");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(header).toBeInViewport();
    await expect(backToTop).toBeHidden();
  });
}

test("the main menus expose projects and certifications, and the hero has recognizable social marks", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const brand = page.locator(".topbar").getByRole("link", { name: "Raiyan Uddin home" });
  await expect(brand).toHaveText("");
  await expect(brand.locator("img")).toHaveAttribute("src", "/assets/logo.png");
  const footerBrand = page.locator(".footer-home");
  await expect(footerBrand).toHaveText("Raiyan Uddin");
  await expect(footerBrand.locator("img")).toHaveAttribute("src", "/assets/logo.png");
  const profiles = page.locator(".social-links--hero");
  const socialLinks = profiles.getByRole("link");
  const getButtonSizes = () => socialLinks.evaluateAll((items) => items.map((item) => {
    const { width, height } = item.getBoundingClientRect();
    return [Math.round(width), Math.round(height)].join("x");
  }));
  await expect(socialLinks).toHaveCount(4);
  expect(new Set(await getButtonSizes()).size).toBe(1);

  const contact = page.locator(".topbar").getByRole("link", { name: "Contact", exact: true });
  await expect(contact).toHaveCount(1);
  await expect(contact).toHaveAttribute("href", "/contact/");
  await expect(page.locator("#work .project-card h3")).toHaveText(selectedProjects.map(({ title }) => title));
  const hero = page.locator(".hero");
  const heroActions = hero.locator(".hero-actions").getByRole("link");
  await expect(hero.locator(".hero-role")).toHaveCSS("animation-name", "intro-in");
  await expect(hero.locator(".hero-description")).toHaveCSS("animation-name", "intro-in");
  await expect(heroActions.first()).toHaveCSS("animation-name", "intro-in");
  await expect(heroActions.last()).toHaveCSS("animation-name", "intro-in");
  await heroActions.first().focus();
  await expect(heroActions.first()).toHaveCSS("animation-name", "none");
  await expect(heroActions.last()).toHaveCSS("animation-name", "none");
  const nav = page.getByRole("navigation", { name: "Main" });
  await nav.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/works\/$/);
  await nav.getByRole("link", { name: "Certifications", exact: true }).click();
  await expect(page).toHaveURL(/\/certifications\/$/);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".mobile-nav summary").click();
  await expect(nav.getByRole("link", { name: "Projects", exact: true })).toHaveAttribute("href", "/works/");
  await expect(nav.getByRole("link", { name: "Expertise", exact: true })).toHaveAttribute("href", "/skills/");
  await expect(nav.getByRole("link", { name: "Experience", exact: true })).toHaveAttribute("href", "/experience/");
  await expect(nav.getByRole("link", { name: "Certifications", exact: true })).toHaveAttribute("href", "/certifications/");
  await expect(nav.getByRole("link", { name: "Contact", exact: true })).toHaveAttribute("href", "/contact/");
  await expect(profiles.locator("svg path")).toHaveCount(4);
  expect(new Set(await getButtonSizes()).size).toBe(1);
});

test("case studies open with a native transition and recommend two other public projects", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/works/");
  await page.getByRole("link", { name: "BSEC IPO System" }).click();
  await expect(page).toHaveURL(/works\/bsec-ipo-system\/$/);
  if (await page.evaluate(() => "onpagereveal" in window)) {
    await expect(page.locator("html")).toHaveAttribute("data-native-transition", "");
  }
  await expect(page.getByRole("link", { name: "Contact me" }).first()).toHaveAttribute("href", "/contact/");
  const caseSections = await page.locator(".case-study > :is(.case-contribution, .case-image, .case-content, .case-actions)")
    .evaluateAll((elements) => elements.map((element) => element.className.split(" ")[0]));
  expect(caseSections).toEqual(["case-contribution", "case-image", "case-content", "case-actions"]);

  const related = page.getByRole("region", { name: "More work" });
  const links = related.getByRole("link");
  await expect(links).toHaveCount(2);
  const paths = await links.evaluateAll((elements) => elements.map((element) => element.getAttribute("href")));
  expect(new Set(paths).size).toBe(2);
  expect(paths).not.toContain("/works/bsec-ipo-system/");
  expect(paths).not.toContain("/works/dnothi/");
  for (const route of unlistedRoutes) expect(paths).not.toContain(route);
  await expect(related.locator(".project-category")).toHaveCount(2);

  await links.last().click();
  await expect(page).toHaveURL(new RegExp(paths[1] + "$"));
  await page.goBack();
  await expect(page).toHaveURL(/works\/bsec-ipo-system\/$/);
});

test("uses the case-study entrance when the browser skips a native transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    window.addEventListener("pagereveal", (event) => {
      if (!event.viewTransition) return;
      event.viewTransition.skipTransition();
      document.documentElement.setAttribute("data-test-transition-skipped", "");
    });
  });
  const errors: string[] = [];
  page.on("pageerror", ({ message }) => errors.push(message));
  await page.goto("/works/");
  test.skip(!(await page.evaluate(() => "onpagereveal" in window)), "Native view transitions are unavailable");
  await page.getByRole("link", { name: "BSEC IPO System" }).click();
  await expect(page).toHaveURL(/works\/bsec-ipo-system\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-test-transition-skipped", "");
  await expect(page.locator("html")).not.toHaveAttribute("data-native-transition", "");
  await expect(page.locator(".case-study")).toHaveCSS("animation-name", "case-in");
  expect(errors).toEqual([]);
});

test("keeps the résumé and all certificate PDFs available", async ({ page, request, baseURL }) => {
  await page.goto("/");
  const heroResume = await page.locator(".hero").getByRole("link", { name: "View résumé" }).getAttribute("href");
  expect(heroResume).toBeTruthy();
  await page.goto("/about/");
  const resume = await page.getByRole("link", { name: "View résumé" }).getAttribute("href");
  expect(resume).toBe(heroResume);
  expect((await request.head(new URL(resume!, baseURL).href)).status()).toBe(200);

  await page.goto("/certifications/");
  const featured = page.getByRole("region", { name: "Featured credentials" });
  await expect(featured.getByRole("heading", { level: 3 })).toHaveText([
    "Information Security", "AI-ization with GitHub Copilot & Claude", "Artificial Intelligence Fundamentals",
  ]);
  const eager = page.locator('.certificate-card img[loading="eager"]');
  await expect(eager).toHaveCount(3);
  await expect(page.locator('.certificate-card img[loading="lazy"]')).toHaveCount(11);
  const certificateLinks = await page.locator(".certificate-card a").evaluateAll(
    (links) => links.map((link) => (link as HTMLAnchorElement).href),
  );
  expect(certificateLinks).toHaveLength(14);
  for (const href of certificateLinks) {
    const response = await request.head(href);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  }
});

test("filters certificates and previews them in the page by keyboard", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/certifications/");
  const controls = page.getByRole("group", { name: "Filter certifications" });
  const cards = page.locator(".certificate-card:visible");
  await controls.getByRole("button", { name: "Community" }).click();
  await expect(page).toHaveURL(/certifications\/\?filter=community$/);
  await page.reload();
  await expect(controls.getByRole("button", { name: "Community" })).toHaveAttribute("aria-pressed", "true");
  await expect(cards.locator("h3")).toHaveText(["Fight Against Winter", "Project Chana Piyaju"]);
  await expect(page.getByRole("region", { name: "Featured credentials" })).toBeHidden();
  await expect(page.getByRole("status")).toHaveText("2 certificates shown.");

  const preview = cards.first().getByRole("button", { name: "Preview Fight Against Winter" });
  const originalPDF = await cards.first().getByRole("link", { name: "Open PDF for Fight Against Winter" }).getAttribute("href");
  await preview.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Fight Against Winter" });
  await expect(dialog.getByRole("img", { name: "Fight Against Winter certificate" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Open PDF" })).toHaveAttribute("href", new URL(originalPDF!, page.url()).href);
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(preview).toBeFocused();

  await preview.click();
  await dialog.getByRole("img").click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
  await expect(preview).toBeFocused();

  await controls.getByRole("button", { name: "All", exact: true }).click();
  await expect(cards).toHaveCount(14);
});

test("mobile menu responds to the keyboard and scroll navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator(".mobile-nav summary");
  const menu = page.locator(".mobile-nav");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();

  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(toggle).toBeFocused();

  await page.keyboard.press("Space");
  await menu.getByRole("link", { name: "Expertise" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/skills/");
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(page.getByRole("heading", { level: 1, name: "Technical expertise" })).toBeVisible();
  const item = page.getByText("API & performance testing", { exact: true });
  await item.click();
  await expect(item.locator("..")).toHaveJSProperty("tagName", "SUMMARY");
  await expect(page.getByText("Apache JMeter", { exact: true })).toBeVisible();
});

test("the compact mobile header returns on upward scroll and keeps an open menu in reach", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/certifications/");
  const header = page.locator(".topbar");
  const menu = page.locator(".mobile-nav");
  const scrollTo = (top: number) => page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
  const headerBottom = () => header.evaluate((element) => element.getBoundingClientRect().bottom);
  await scrollTo(1200);
  await expect(header).toHaveAttribute("data-scroll-hidden", "");
  await expect.poll(headerBottom).toBeLessThan(0);

  await scrollTo(1120);
  await expect(header).not.toHaveAttribute("data-scroll-hidden", "");
  await expect.poll(headerBottom).toBeGreaterThan(40);
  await expect.poll(headerBottom).toBeLessThan(85);

  await menu.locator("summary").click();
  await expect(menu).toHaveAttribute("open", "");
  await scrollTo(1300);
  await expect(header).not.toHaveAttribute("data-scroll-hidden", "");
  await menu.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/works\/$/);
});

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test("homepage fits a " + width + " px viewport", async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main h1")).toHaveText(/Raiyan\s+Uddin/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);

    const name = await page.locator(".hero-name").boundingBox();
    expect(name).not.toBeNull();
    const words = await page.locator(".name-mask").evaluateAll(
      (elements) => elements.map((element) => element.getBoundingClientRect().toJSON()),
    );
    expect(words[0].left).toBeGreaterThanOrEqual(name!.x - 1);
    expect(words[1].right).toBeLessThanOrEqual(name!.x + name!.width + 1);
  });
}

test("wipes color from any edge the pointer enters", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const portrait = page.locator(".hero-portrait");
  const image = portrait.locator("img");
  const revealOpacity = () => portrait.evaluate((element) => getComputedStyle(element, "::after").opacity);
  await expect(portrait).toHaveAttribute("data-pointer-ready", "");
  await portrait.evaluate((element) => {
    for (const animation of element.getAnimations()) {
      const timing = animation.effect?.getComputedTiming();
      if (typeof timing?.activeDuration !== "number") continue;
      animation.pause();
      animation.currentTime = (timing.delay ?? 0) + timing.activeDuration / 2;
    }
  });
  await expect(portrait).toHaveCSS("pointer-events", "none");
  const bounds = await image.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await expect(image).toHaveCSS("filter", "grayscale(1)");
  await expect.poll(revealOpacity).toBe("0");

  await portrait.evaluate((element) => {
    for (const animation of element.getAnimations()) animation.finish();
  });
  await page.mouse.move(0, 0);
  await expect(image).toHaveAttribute("src", "/images/hero-portrait.png");
  expect(await image.evaluate((element: HTMLImageElement) => element.currentSrc)).toMatch(/hero-portrait-\d+\.webp$/);
  const settledBounds = await image.boundingBox();
  const portraitFrame = await portrait.boundingBox();
  expect(portraitFrame).not.toBeNull();
  expect(settledBounds).not.toBeNull();
  expect(settledBounds!.width).toBeCloseTo(settledBounds!.height);
  expect(portraitFrame!.height).toBeLessThan(settledBounds!.height);
  const { x, y, width, height } = portraitFrame!;
  const wipeProgress = () => portrait.evaluate((element) =>
    parseFloat(getComputedStyle(element, "::after").getPropertyValue("--portrait-wipe-progress")),
  );
  const mask = () => portrait.evaluate((element) => getComputedStyle(element, "::after").maskImage);
  const top = y + 12;
  const bottom = y + height - 12;

  await page.mouse.move(x - 15, top);
  await page.mouse.move(x + width * .6, top);
  await expect(portrait).toHaveAttribute("data-portrait-wipe-from", "left");
  await expect(portrait).toHaveAttribute("data-portrait-wiping", "");
  await expect.poll(revealOpacity).toBe("1");
  await expect(image).toHaveCSS("filter", "grayscale(1)");
  await expect.poll(wipeProgress).toBeCloseTo(60, 0);
  const leftMask = await mask();
  expect(leftMask).toContain("linear-gradient(to right");
  expect(leftMask.match(/linear-gradient\(/g)).toHaveLength(1);
  await page.mouse.move(x + width * .8, bottom);
  await expect.poll(wipeProgress).toBeCloseTo(80, 0);

  await page.mouse.move(x + width + 15, bottom);
  await page.mouse.move(x + width * .4, bottom);
  await expect(portrait).toHaveAttribute("data-portrait-wipe-from", "right");
  await expect.poll(wipeProgress).toBeCloseTo(60, 0);
  expect(await mask()).toContain("linear-gradient(to left");
  await page.mouse.move(x + width * .2, top);
  await expect.poll(wipeProgress).toBeCloseTo(80, 0);
  await expect(portrait).toHaveAttribute("data-portrait-wipe-from", "right");

  const centerX = x + width / 2;
  await page.mouse.move(centerX, y - 15);
  await page.mouse.move(centerX, y + height * .6);
  await expect(portrait).toHaveAttribute("data-portrait-wipe-from", "top");
  expect(await mask()).toMatch(/^linear-gradient\((?:to bottom, )?rgb/);
  await expect.poll(wipeProgress).toBeCloseTo(60, 0);
  await page.mouse.move(x + width * .8, y + height * .6);
  await expect.poll(wipeProgress).toBeCloseTo(60, 0);
  await page.mouse.move(x + width * .8, y + height * .8);
  await expect.poll(wipeProgress).toBeCloseTo(80, 0);

  await page.mouse.move(centerX, y + height + 15);
  await page.mouse.move(centerX, y + height * .4);
  await expect(portrait).toHaveAttribute("data-portrait-wipe-from", "bottom");
  expect(await mask()).toContain("linear-gradient(to top");
  await expect.poll(wipeProgress).toBeCloseTo(60, 0);
  await page.mouse.move(centerX, y + height * .2);
  await expect.poll(wipeProgress).toBeCloseTo(80, 0);

  await page.mouse.move(x - 24, y - 140);
  await page.mouse.move(x + width * .12, y + height * .5);
  await expect(portrait).toHaveAttribute("data-portrait-wipe-from", "top");
  await expect.poll(wipeProgress).toBeCloseTo(50, 0);

  expect(await image.boundingBox()).toEqual(settledBounds);
  await page.mouse.move(0, 0);
  await expect(portrait).not.toHaveAttribute("data-portrait-wiping", "");
  await expect.poll(revealOpacity).toBe("0");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(portrait).toHaveCSS("animation-name", "none");
  expect(await image.evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThan(0.001);
  await image.hover();
  await expect(image).toHaveCSS("filter", "grayscale(0)");
});

test("uses the Styleco dot and trailing ring and restores the high-contrast cursor", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "none" });
  await page.goto("/works/");
  const cursor = page.locator(".custom-cursor");
  const ring = cursor.locator(".custom-cursor-ring");
  const dot = cursor.locator(".custom-cursor-dot");
  await page.mouse.move(65, 320);
  await expect(cursor).toHaveAttribute("data-visible", "");
  await expect(dot).toHaveCSS("width", "8px");
  await expect(ring).toHaveCSS("width", "40px");
  const centerX = (layer: typeof ring) => layer.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return bounds.left + bounds.width / 2;
  });
  await expect.poll(() => centerX(dot)).toBeCloseTo(65, 1);
  await expect.poll(() => centerX(ring)).toBeCloseTo(65, 1);

  const contact = page.locator(".topbar-contact");
  await contact.hover();
  await expect(cursor).toHaveAttribute("data-interactive", "");
  await expect(cursor).toHaveAttribute("data-on-dark", "");
  await expect(ring).toHaveCSS("width", "56px");
  await expect(contact).toHaveCSS("cursor", "none");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(60, 260);
  await expect.poll(() => centerX(ring)).toBeCloseTo(60, 1);
  await page.emulateMedia({ forcedColors: "active" });
  await expect(cursor).toHaveCSS("display", "none");
  await expect(page.locator("html")).not.toHaveClass(/custom-cursor-enabled/);
});

test("restores the custom cursor at the click position on a new page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator(".page-loader")).toBeHidden();
  const link = page.locator(".desktop-nav").getByRole("link", { name: "Projects", exact: true });
  const bounds = (await link.boundingBox())!;
  const x = Math.round(bounds.x + bounds.width / 2);
  const y = Math.round(bounds.y + bounds.height / 2);
  await page.mouse.click(x, y);
  await expect(page).toHaveURL("/works/");
  const cursor = page.locator(".custom-cursor");
  await expect(cursor).toHaveAttribute("data-visible", "");
  const ring = (await cursor.locator(".custom-cursor-ring").boundingBox())!;
  expect(ring.x + ring.width / 2).toBeCloseTo(x, 0);
  expect(ring.y + ring.height / 2).toBeCloseTo(y, 0);
});

test("keeps the custom cursor visible when opening and closing a certificate preview", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/certifications/");
  await page.getByRole("button", { name: /^Preview / }).first().click();

  const dialog = page.getByRole("dialog");
  const cursor = dialog.locator(".custom-cursor");
  await expect(dialog).toBeVisible();
  await expect(cursor).toHaveAttribute("data-visible", "");
  await expect(cursor.locator(".custom-cursor-ring")).toHaveCSS("opacity", "1");
  await expect(cursor).toHaveCSS("visibility", "visible");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator("body > .custom-cursor")).toHaveAttribute("data-visible", "");
});

test("tilts the project image with the pointer and retains keyboard access", async ({ page }) => {
  await page.goto("/works/");
  const project = page.locator(".project-card").first();
  const media = project.locator(".project-media");
  const pointerX = () => media.evaluate((element) => Number.parseFloat(element.style.getPropertyValue("--pointer-x")));
  await media.hover({ position: { x: 100, y: 100 } });
  await expect(media).toHaveAttribute("data-depth-active", "");
  await expect(media).toHaveCSS("perspective", "900px");
  await expect(media.locator(".project-visual")).toHaveCSS("transform", /^matrix3d\(/);
  await expect(page.locator(".custom-cursor-dot")).toHaveCSS("opacity", "1");
  await expect.poll(pointerX).toBeCloseTo(100, 0);
  await media.hover({ position: { x: 175, y: 120 } });
  await expect.poll(pointerX).toBeCloseTo(175, 0);

  await page.mouse.move(0, 0);
  await expect(media).not.toHaveAttribute("data-depth-active", "");
  const caseLink = project.getByRole("link");
  const caseUrl = await caseLink.evaluate((link: HTMLAnchorElement) => link.href);
  await caseLink.focus();
  await expect(caseLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(caseUrl);
});

test("opens one expertise panel at a time by keyboard", async ({ page }) => {
  await page.goto("/skills/");
  const details = page.locator(".expertise-item");
  await expect(page.locator(".expertise-item[open]")).toHaveCount(0);
  await details.nth(0).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details.nth(0).locator(".expertise-content")).toBeVisible();
  await details.nth(1).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details.nth(1).locator(".expertise-content")).toBeVisible();
  await expect(details.locator("img")).toHaveCount(0);
  await expect(details.nth(0)).not.toHaveAttribute("open", "");
  await expect(details.locator("a")).toHaveCount(0);
});

test("shows role scope wherever experience appears without project links", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/#experience", "/about/", "/experience/"]) {
    await page.goto(route);
    const experience = page.locator(".experience-section");
    const scopes = experience.locator(".timeline-detail");
    await expect(scopes).toHaveCount(2);
    await expect(scopes.first()).toContainText("regression");
    await expect(scopes.last()).toContainText("end-to-end web tests");
    await expect(experience.locator('a[href*="/works/"]')).toHaveCount(0);
  }
});

test("shows pointer-following previews for experience and education", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const route of ["/", "/about/"]) {
    await page.goto(route);
    for (const [section, organization] of [["experience", "BJIT"], ["education", "BRAC University"]]) {
      const row = page.locator("." + section + "-section .timeline li").first();
      const preview = row.locator(".timeline-preview");
      await row.scrollIntoViewIfNeeded();
      const bounds = await row.boundingBox();
      expect(bounds).not.toBeNull();
      const moveTo = (fraction: number) => row.hover({ position: { x: Math.round(bounds!.width * fraction), y: 34 } });
      const left = () => preview.evaluate((element) => parseFloat(getComputedStyle(element).left));

      await moveTo(.35);
      await expect(preview).toHaveCSS("opacity", "1");
      await expect(preview.locator("strong")).toHaveText(organization);
      const logo = preview.locator("img");
      await expect.poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      const initial = await left();
      await moveTo(.57);
      await expect.poll(left).toBeGreaterThan(initial + 50);

      await page.mouse.move(0, 0);
      await expect(preview).toHaveCSS("opacity", "0");
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".timeline-preview:visible")).toHaveCount(0);
});

test.describe("Touch layout", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test("shows original colors at the source aspect ratio", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".custom-cursor")).toHaveCSS("display", "none");
    const image = page.locator(".hero-portrait img");
    await expect(image).toBeVisible();
    await expect(image).toHaveCSS("filter", "none");
    const size = await image.evaluate((element: HTMLImageElement) => ({
      rendered: element.clientWidth / element.clientHeight,
      original: element.naturalWidth / element.naturalHeight,
    }));
    expect(size.rendered).toBeCloseTo(size.original);
    const firstProject = await page.locator("#work .project-card").first().boundingBox();
    expect(firstProject!.y).toBeLessThan(844);
    const showcase = page.locator("#work .project-card").first();
    await expect(showcase.locator(".project-category")).toHaveCount(0);
    const label = await showcase.locator(".project-title-chip").boundingBox();
    const media = await showcase.locator(".project-media").boundingBox();
    const leftInset = label!.x - media!.x;
    const bottomInset = media!.y + media!.height - label!.y - label!.height;
    expect(leftInset).toBeGreaterThan(0);
    expect(leftInset).toBeLessThan(24);
    expect(bottomInset).toBeCloseTo(leftInset, 0);
    expect(label!.height).toBeLessThan(38);
    await page.setViewportSize({ width: 390, height: 664 });
    const heading = await page.getByRole("heading", { name: "Selected work" }).boundingBox();
    expect(heading!.y + heading!.height).toBeLessThan(664);
  });

  test("keeps the main calls to action visible in a short landscape viewport", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.locator(".hero");
    await expect(hero.getByRole("link", { name: "Explore my work" })).toBeInViewport({ ratio: 1 });
    await expect(hero.getByRole("link", { name: "View résumé" })).toBeInViewport({ ratio: 1 });
    const introItems = hero.locator(".hero-role, .hero-description, .hero-actions > a");
    expect(await introItems.evaluateAll((items) => items.map((item) => getComputedStyle(item).animationName))).toEqual([
      "none", "none", "none", "none",
    ]);
  });

  test("shows timeline roles and links directly on touch devices", async ({ page }) => {
    await page.goto("/about/");
    const experience = page.locator(".experience-section");
    await expect(experience.locator(".timeline-dates")).toHaveText(["2025 – Present", "2023 – 2025", "2022"]);
    await expect(experience.locator("details")).toHaveCount(0);
    await expect(page.locator(".timeline-preview:visible")).toHaveCount(0);
    const websites = [
      ["BJIT", "https://bjitgroup.com/"],
      ["Tappware Solutions Limited", "https://tappware.com/"],
      ["bKash", "https://www.bkash.com/en"],
      ["BRAC University", "https://www.bracu.ac.bd/"],
      ["Chittagong College", "https://ctgcollege.gov.bd/"],
      ["Nasirabad Govt. High School", "https://www.nghsctg.edu.bd/"],
    ];
    for (const [name, href] of websites) {
      const link = page.getByRole("link", { name, exact: true });
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });
});

test("reveals content when scrolled into view and honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/works/");
  const project = page.locator(".project-card").last();
  await project.scrollIntoViewIfNeeded();
  await expect(project).toHaveCSS("animation-name", "gallery-card-in");
  await expect(project.locator(".tags li").first()).toHaveCSS("animation-name", "detail-item-in");

  await page.goto("/");
  const showcase = page.locator("#work .project-card").first();
  await expect(showcase).toHaveCSS("opacity", "0");
  await showcase.scrollIntoViewIfNeeded();
  await expect(showcase).toHaveCSS("animation-name", "page-fade-in");
  await expect(showcase).toHaveCSS("position", "sticky");
  await expect(showcase.locator(".project-visual")).toHaveCSS("animation-name", "showcase-image-in");
  const projectTitle = showcase.locator(".project-title-chip");
  await expect(projectTitle).toHaveCSS("animation-delay", "0.155s");

  const experience = page.locator("#experience .section-heading");
  await expect(experience).toHaveClass(/will-reveal/);
  await expect(experience).toHaveCSS("opacity", "0");
  await experience.scrollIntoViewIfNeeded();
  await expect(experience).toHaveClass(/is-revealed/);
  await expect(experience.getByRole("heading")).toHaveCSS("animation-name", "heading-unveil");
  await expect(experience).toHaveCSS("opacity", "1");

  await experience.evaluate((element) => {
    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().bottom + 40, behavior: "instant" });
  });
  await expect(experience).not.toHaveClass(/is-revealed/);
  await experience.scrollIntoViewIfNeeded();
  await expect(experience.getByRole("heading")).toHaveCSS("animation-name", "heading-unveil");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(experience).not.toHaveClass(/is-revealed/);
  await experience.scrollIntoViewIfNeeded();
  await expect(experience.getByRole("heading")).toHaveCSS("animation-name", "heading-unveil");

  const certifications = page.getByRole("link", { name: "View certifications" });
  await expect(certifications).toHaveCSS("opacity", "0");
  await certifications.evaluate((link) => {
    link.focus({ preventScroll: true });
    link.blur();
  });
  await expect(certifications).toHaveCSS("opacity", "1");

  const footerLinks = page.locator(".social-links--footer li");
  await expect(footerLinks.last()).toHaveClass(/will-reveal/);
  await footerLinks.last().scrollIntoViewIfNeeded();
  await expect(footerLinks.last()).toHaveClass(/is-revealed/);
  await expect(footerLinks.last()).toHaveCSS("animation-delay", "0.18s");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(experience.getByRole("heading")).toHaveCSS("animation-name", "none");
  await expect(showcase.locator(".project-visual")).toHaveCSS("animation-name", "none");
  await expect(projectTitle).toHaveCSS("opacity", "1");
  await page.reload();
  await expect(page.locator(".will-reveal")).toHaveCount(0);
  expect(await page.locator("html").evaluate((element) => getComputedStyle(element).scrollBehavior)).toBe("auto");
});

test("waits until the visitor reaches the case-study preview before wiping it in", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await page.goto("/works/bsec-ipo-system/");
  const preview = page.locator(".case-image");
  await expect(preview).toHaveClass(/will-reveal/);
  await expect(preview.locator("img")).toHaveCSS("animation-name", "none");
  await preview.scrollIntoViewIfNeeded();
  await expect(preview.locator("img")).toHaveCSS("animation-name", "image-unveil");
  await expect(preview).toHaveCSS("opacity", "1");
});

test.describe("JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test("keeps essential navigation usable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator(".project-card:visible")).toHaveCount(selectedProjects.length);
    const toggle = page.locator(".mobile-nav summary");
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".mobile-nav")).toHaveAttribute("open", "");
    await expect(page.locator(".mobile-nav").getByRole("link", { name: "Projects" })).toBeVisible();
  });
});

test("email buttons and the local contact draft open Gmail with the recipient filled in", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const gmailCompose = (url: URL) => url.origin === "https://mail.google.com" && url.pathname === "/mail/";
  await context.route(gmailCompose, (route) => route.fulfill({ body: "Gmail compose" }));
  const posted: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posted.push(request.url());
  });
  await page.goto("/contact/");
  const email = page.getByRole("link", { name: "Email me" });
  const [emailRequest] = await Promise.all([
    context.waitForEvent("request", (request) => gmailCompose(new URL(request.url()))),
    email.click(),
  ]);
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator("[data-copy-status]")).toHaveText("Email address copied.");
  const address = await page.evaluate(() => navigator.clipboard.readText());
  const emailUrl = new URL(emailRequest.url());
  expect(Object.fromEntries(emailUrl.searchParams)).toEqual({ view: "cm", fs: "1", to: address });
  await expect(email).toHaveAttribute("target", "_blank");
  await expect(page.getByLabel("Your email")).toBeHidden();
  await page.getByText("Write an email draft", { exact: true }).click();
  await page.getByLabel("Your email").fill("local@example.test");
  await page.getByLabel("Subject").fill("Portfolio review & QA");
  await page.getByLabel("Message").fill("Local verification only");
  const [draftRequest] = await Promise.all([
    context.waitForEvent("request", (request) => gmailCompose(new URL(request.url()))),
    page.getByRole("button", { name: "Open email draft" }).click(),
  ]);
  const draftUrl = new URL(draftRequest.url());
  expect(Object.fromEntries(draftUrl.searchParams)).toEqual({
    view: "cm", fs: "1", to: address,
    su: "Portfolio review & QA", body: "From: local@example.test\r\n\r\nLocal verification only",
  });
  await expect(page).toHaveURL(/\/contact\/$/);
  expect(posted).toEqual([]);

  await page.goto("/");
  for (const region of [page.locator(".hero-profiles"), page.locator(".site-footer")]) {
    const link = region.getByRole("link", { name: "Email", exact: true });
    await expect(link).toHaveAttribute("href", emailUrl.href);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});

for (const route of ["/", "/works/", "/skills/", "/experience/", "/contact/", "/certifications/"]) {
  test("has no automated WCAG A or AA violations on " + route, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target }) => target) }))).toEqual([]);
  });
}
