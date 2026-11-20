import { projectGroupLabels } from "../data/project-groups";
import { formatGalleryCount, type GalleryItem } from "../utils/gallery";
import { connectCustomCursor } from "./custom-cursor";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function oncePerFrame(update: () => void) {
  let frame = 0;
  return () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };
}

function watchScrollAndResize(element: HTMLElement, update: () => void) {
  const schedule = oncePerFrame(update);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(element);
  schedule();
  return schedule;
}

function connectScrollControls() {
  const progress = document.querySelector<HTMLElement>("[data-page-progress]");
  const backToTop = document.querySelector<HTMLAnchorElement>("[data-home-back-to-top]");
  if (!progress) return;

  const schedule = watchScrollAndResize(document.body, () => {
    if (backToTop) backToTop.hidden = window.scrollY < window.innerHeight;

    const root = document.documentElement;
    const distance = root.scrollHeight - root.clientHeight;
    progress.hidden = reducedMotion.matches || distance <= 0;
    if (progress.hidden) return;
    const fraction = Math.max(0, Math.min(1, window.scrollY / distance));
    progress.style.setProperty("--page-progress", String(fraction));
  });

  reducedMotion.addEventListener("change", schedule);
}

function positionHighlight(group: HTMLElement, item?: HTMLElement) {
  group.toggleAttribute("data-highlight", Boolean(item));
  if (!item) return;

  group.style.setProperty("--highlight-x", item.offsetLeft + "px");
  group.style.setProperty("--highlight-y", item.offsetTop + "px");
  group.style.setProperty("--highlight-width", item.offsetWidth + "px");
  group.style.setProperty("--highlight-height", item.offsetHeight + "px");
}

function connectNavHighlight() {
  const nav = document.querySelector<HTMLElement>(".desktop-nav");
  if (!nav) return;

  const links = [...nav.querySelectorAll<HTMLAnchorElement>("a")];
  const current = nav.querySelector<HTMLElement>("[aria-current]") ?? undefined;
  let hovered: HTMLAnchorElement | undefined;
  const update = () => {
    const focused = links.find((link) => link.matches(":focus-visible"));
    positionHighlight(nav, focused ?? hovered ?? current);
  };

  for (const link of links) {
    link.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      hovered = link;
      update();
    });
  }
  nav.addEventListener("pointerleave", () => {
    hovered = undefined;
    update();
  });
  nav.addEventListener("focusin", update);
  nav.addEventListener("focusout", () => requestAnimationFrame(update));
  window.addEventListener("resize", update);
  void document.fonts.ready.then(update);
  update();
}

function revealOnScroll() {
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const revealInset = 24;
  const exitMargin = 16;
  const stack = document.querySelector<HTMLElement>("[data-stack-ready]");

  const reset = (target: Element) => {
    target.classList.add("will-reveal");
    target.classList.remove("is-revealed");
  };

  const reveal = (target: Element) => {
    if (!target.classList.contains("will-reveal")) return;
    if (target.matches(":focus-within")) target.classList.remove("will-reveal", "is-revealed");
    else target.classList.add("is-revealed");
  };

  const entryObserver = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) reveal(target);
    }
  }, { rootMargin: `-${revealInset}px 0px` });

  // Keep a buffer between entry and exit so the reveal's own movement cannot reset it.
  const exitObserver = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) reset(target);
    }
  }, { rootMargin: `${exitMargin}px 0px` });

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    const { top, bottom, height } = element.getBoundingClientRect();
    const alreadyInView = height > 0 && top < window.innerHeight - revealInset && bottom > revealInset;
    if (!alreadyInView && !element.matches(":focus-within")) reset(element);
    if (element.parentElement !== stack) {
      entryObserver.observe(element);
      exitObserver.observe(element);
    }
  });

  document.addEventListener("focusin", (event) => {
    if (!(event.target instanceof Element)) return;
    event.target.closest(".will-reveal")?.classList.remove("will-reveal", "is-revealed");
  });

  if (!stack) return;
  const cards = [...stack.querySelectorAll<HTMLElement>(":scope > [data-reveal]")];

  watchScrollAndResize(stack, () => {
    if (reducedMotion.matches) return;

    const visibleCards = cards.filter((card) => !card.hidden);
    const bounds = visibleCards.map((card) => card.getBoundingClientRect());
    for (const card of cards) {
      if (card.hidden) reset(card);
    }

    for (const [index, card] of visibleCards.entries()) {
      const { top, bottom } = bounds[index];
      // A later card can cover a pinned card while both still intersect the viewport.
      const exposedBottom = Math.min(bottom, bounds[index + 1]?.top ?? bottom);
      const exposedHeight = exposedBottom - top;
      if (exposedHeight <= 1 || bottom < -exitMargin || top > window.innerHeight + exitMargin) {
        reset(card);
      } else if (exposedHeight >= revealInset && top < window.innerHeight - revealInset && exposedBottom > revealInset) {
        reveal(card);
      }
    }
  });

}

type PortraitEdge = "left" | "right" | "top" | "bottom";
type PointerPosition = Pick<PointerEvent, "clientX" | "clientY">;

function getPortraitEntryEdge(bounds: DOMRectReadOnly, pointer: PointerPosition, previous?: PointerPosition): PortraitEdge {
  const distances = ({ clientX, clientY }: PointerPosition) => ({
    left: clientX - bounds.left,
    right: bounds.right - clientX,
    top: clientY - bounds.top,
    bottom: bounds.bottom - clientY,
  });
  const currentDistances = distances(pointer);
  const previousDistances = previous && distances(previous);
  let entry: PortraitEdge = "left";
  let bestScore = -Infinity;

  for (const edge of ["left", "right", "top", "bottom"] as const) {
    const distance = currentDistances[edge];
    const before = previousDistances?.[edge];
    // For diagonal approaches, the last boundary crossed is the one that enters the portrait.
    // With no crossing to infer, use the closest edge to the pointer.
    const score = before !== undefined && before <= 0 && distance > before
      ? -before / (distance - before)
      : -distance;
    if (score > bestScore) {
      entry = edge;
      bestScore = score;
    }
  }
  return entry;
}

function connectPortraitWipe(desktopMotion: MediaQueryList) {
  const portrait = document.querySelector<HTMLElement>("[data-portrait-wipe]");
  const image = portrait?.querySelector("img");
  if (!portrait || !image) return;

  let previousPointer: PointerPosition | undefined;
  let from: PortraitEdge | undefined;
  let frame = 0;

  const track = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !desktopMotion.matches) return;
    previousPointer = { clientX: event.clientX, clientY: event.clientY };
    if (!from) return;

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = portrait.getBoundingClientRect();
      const vertical = from === "top" || from === "bottom";
      const length = vertical ? bounds.height : bounds.width;
      if (length === 0) return;
      const offset = vertical ? event.clientY - bounds.top : event.clientX - bounds.left;
      const distance = from === "right" || from === "bottom" ? length - offset : offset;
      const progress = Math.max(0, Math.min(1, distance / length));
      portrait.style.setProperty("--portrait-pointer-progress", (progress * 100) + "%");
    });
  };

  portrait.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch" || !desktopMotion.matches) return;

    const bounds = portrait.getBoundingClientRect();
    from = getPortraitEntryEdge(bounds, event, previousPointer);
    portrait.dataset.portraitWipeFrom = from;
    portrait.style.setProperty("--portrait-pointer-progress", "0%");
    // Commit the start of the new wipe before following the pointer.
    getComputedStyle(portrait, "::after").getPropertyValue("--portrait-wipe-progress");
    portrait.setAttribute("data-portrait-wiping", "");
    track(event);
  });

  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    from = undefined;
    portrait.removeAttribute("data-portrait-wiping");
  };

  window.addEventListener("pointermove", track, { passive: true });
  portrait.addEventListener("pointerleave", reset);
  portrait.addEventListener("pointercancel", reset);
  desktopMotion.addEventListener("change", () => {
    previousPointer = undefined;
    reset();
  });

  // The wipe must use the same responsive image as the visible portrait.
  const syncSource = () => {
    if (!image.currentSrc) return;
    portrait.style.setProperty("--portrait-source", `url("${image.currentSrc}")`);
    portrait.dataset.pointerReady = "";
  };
  image.addEventListener("load", syncSource);
  syncSource();
}

function connectPointerMotion() {
  const desktopMotion = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  connectPortraitWipe(desktopMotion);

  for (const surface of document.querySelectorAll<HTMLElement>("[data-depth]")) {
    let frame = 0;
    let pointer: PointerEvent;
    const update = () => {
      frame = 0;
      const bounds = surface.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = pointer.clientX - bounds.left;
      const y = pointer.clientY - bounds.top;
      surface.style.setProperty("--pointer-x", x + "px");
      surface.style.setProperty("--pointer-y", y + "px");
      surface.style.setProperty("--pointer-dx", normalizedOffset(x, bounds.width));
      surface.style.setProperty("--pointer-dy", normalizedOffset(y, bounds.height));
      surface.setAttribute("data-depth-active", "");
    };
    const track = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !desktopMotion.matches) return;
      pointer = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    surface.addEventListener("pointerenter", track, { passive: true });
    surface.addEventListener("pointermove", track, { passive: true });
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      surface.removeAttribute("data-depth-active");
      surface.style.removeProperty("--pointer-dx");
      surface.style.removeProperty("--pointer-dy");
    };
    surface.addEventListener("pointerleave", reset);
    desktopMotion.addEventListener("change", reset);
    surface.dataset.pointerReady = "";
  }
}

function normalizedOffset(position: number, length: number) {
  return String(Math.max(-1, Math.min(1, position / length * 2 - 1)));
}

function setProjectLinkContext(link: HTMLAnchorElement, filter?: string, fromSelectedWork = false) {
  const destination = new URL(link.href);
  if (filter) destination.searchParams.set("filter", filter);
  else destination.searchParams.delete("filter");
  destination.searchParams.delete("from");
  if (fromSelectedWork) destination.searchParams.set("from", "selected-work");
  link.href = destination.pathname + destination.search + destination.hash;
}

function connectGalleryFilters(
  gallery: HTMLElement,
  noun: GalleryItem,
  applyFilter: (filter: string | undefined, animate: boolean) => number,
) {
  const controls = gallery.querySelector<HTMLElement>("[data-filter-controls]");
  const status = gallery.querySelector<HTMLElement>("[data-filter-status]");
  if (!controls || !status) return;

  const buttons = [...controls.querySelectorAll<HTMLButtonElement>("button[data-filter]")];
  let active = buttons[0];
  if (!active) return;
  controls.hidden = false;

  const updateHighlight = () => positionHighlight(controls, active);
  if ("ResizeObserver" in window) new ResizeObserver(updateHighlight).observe(controls);
  void document.fonts.ready.then(updateHighlight);
  updateHighlight();

  const select = (button: HTMLButtonElement, animate: boolean) => {
    if (active === button) return;
    active = button;
    const filter = button.dataset.filter;
    const count = applyFilter(filter === "all" ? undefined : filter, animate);
    for (const option of buttons) option.setAttribute("aria-pressed", String(option === button));
    updateHighlight();
    status.textContent = formatGalleryCount(count, noun);
  };

  const restoreFilter = () => {
    const filter = new URLSearchParams(location.search).get("filter");
    select(buttons.find((button) => button.dataset.filter === filter) ?? buttons[0], false);
  };
  restoreFilter();
  window.addEventListener("popstate", restoreFilter);

  for (const button of buttons) {
    button.addEventListener("click", () => {
      if (button === active) return;
      const url = new URL(location.href);
      const filter = button.dataset.filter;
      if (filter && filter !== "all") url.searchParams.set("filter", filter);
      else url.searchParams.delete("filter");
      history.replaceState(history.state, "", url);
      select(button, !reducedMotion.matches);
    });
  }
}

function updateCardVisibility(card: HTMLElement, filter?: string) {
  const visible = filter === undefined || card.dataset.filterGroup === filter;
  card.hidden = !visible;
  return visible;
}

function connectProjectStack(gallery: HTMLElement, cards: HTMLElement[]) {
  const stack = gallery.querySelector<HTMLElement>("[data-project-stack]");
  if (!stack || !("ResizeObserver" in window)) return;

  const measure = () => {
    const first = cards.find((card) => !card.hidden);
    if (first) stack.style.setProperty("--project-stack-card-height", first.offsetHeight + "px");
  };
  stack.dataset.stackReady = "";
  new ResizeObserver(measure).observe(stack);
  return measure;
}

function connectProjectFilters() {
  const gallery = document.querySelector<HTMLElement>("[data-projects]");
  if (!gallery) return;

  const cards = [...gallery.querySelectorAll<HTMLElement>("[data-filter-group]")];
  const measureStack = connectProjectStack(gallery, cards);
  const projectLinks = gallery.querySelectorAll<HTMLAnchorElement>("[data-work-project]");
  const fullGalleryLink = gallery.querySelector<HTMLAnchorElement>("[data-work-index]");
  const workJump = document.querySelector<HTMLAnchorElement>("[data-work-jump]");
  const animations: Animation[] = [];
  const cancelAnimations = () => {
    for (const animation of animations) animation.cancel();
    animations.length = 0;
  };
  reducedMotion.addEventListener("change", cancelAnimations);

  connectGalleryFilters(gallery, "project", (filter, animate) => {
    const previous = animate && !measureStack && typeof gallery.animate === "function"
      ? new Map(cards.filter((card) => !card.hidden).map((card) => [card, card.getBoundingClientRect()]))
      : undefined;
    cancelAnimations();

    const visible = cards.filter((card) => updateCardVisibility(card, filter));
    measureStack?.();
    for (const link of projectLinks) setProjectLinkContext(link, filter, Boolean(fullGalleryLink));
    if (fullGalleryLink) setProjectLinkContext(fullGalleryLink, filter);
    if (workJump) setProjectLinkContext(workJump, filter);

    if (previous) {
      const positions = visible.map((card) => card.getBoundingClientRect());
      for (const [index, card] of visible.entries()) {
        const before = previous.get(card);
        const after = positions[index];
        const start = before
          ? { translate: (before.left - after.left) + "px " + (before.top - after.top) + "px" }
          : { translate: "0 .75rem", opacity: 0 };
        if (start.translate === "0px 0px") continue;
        animations.push(card.animate([start, { translate: "0px 0px", opacity: 1 }], {
          duration: 420,
          delay: before ? 0 : Math.min(index, 4) * 32,
          easing: "cubic-bezier(.22, 1, .36, 1)",
          fill: "backwards",
        }));
      }
    }
    return visible.length;
  });
  measureStack?.();
}

function connectProjectReturn() {
  const back = document.querySelector<HTMLAnchorElement>("[data-work-return]");
  if (!back) return;

  const params = new URLSearchParams(location.search);
  const requestedFilter = params.get("filter");
  const filter = requestedFilter && Object.hasOwn(projectGroupLabels, requestedFilter) ? requestedFilter : undefined;
  const fromSelectedWork = params.get("from") === "selected-work";
  if (!filter && !fromSelectedWork) return;

  if (fromSelectedWork && back.dataset.workReturn) back.href = back.dataset.workReturn;
  setProjectLinkContext(back, filter);
  for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-work-project]")) {
    setProjectLinkContext(link, filter, fromSelectedWork);
  }
}

function connectCertificateFilters(collection: HTMLElement) {
  const groups = [...collection.querySelectorAll<HTMLElement>("[data-certificate-group]")].map((element) => ({
    element,
    cards: element.querySelectorAll<HTMLElement>("[data-filter-group]"),
  }));

  connectGalleryFilters(collection, "certificate", (topic) => {
    let count = 0;
    for (const { element, cards } of groups) {
      let visible = 0;
      for (const card of cards) {
        if (updateCardVisibility(card, topic)) visible++;
      }
      element.hidden = visible === 0;
      count += visible;
    }
    return count;
  });
}

function connectCertificatePreviews(collection: HTMLElement) {
  const dialog = collection.querySelector<HTMLDialogElement>("[data-certificate-dialog]");
  if (!dialog || typeof dialog.showModal !== "function") return;
  const title = dialog.querySelector<HTMLElement>("#certificate-preview-title");
  const issuer = dialog.querySelector<HTMLElement>("[data-certificate-preview-issuer]");
  const image = dialog.querySelector<HTMLImageElement>("[data-certificate-preview-image]");
  const pdf = dialog.querySelector<HTMLAnchorElement>("[data-certificate-preview-pdf]");
  if (!title || !issuer || !image || !pdf) return;

  const isBackdrop = (event: MouseEvent) => {
    if (event.target !== dialog) return false;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    return event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom;
  };
  let pressedBackdrop = false;
  dialog.addEventListener("pointerdown", (event) => {
    pressedBackdrop = event.button === 0 && isBackdrop(event);
  });
  dialog.addEventListener("click", (event) => {
    if (pressedBackdrop && isBackdrop(event)) dialog.close();
    pressedBackdrop = false;
  });

  for (const button of collection.querySelectorAll<HTMLButtonElement>("[data-certificate-preview]")) {
    const card = button.closest(".certificate-card");
    const thumbnail = card?.querySelector<HTMLImageElement>(".certificate-media img");
    const name = card?.querySelector("h3")?.textContent;
    const issuedBy = card?.querySelector(".certificate-issuer")?.textContent;
    const pdfLink = card?.querySelector<HTMLAnchorElement>("[data-certificate-pdf]");
    if (!thumbnail || !name || !issuedBy || !pdfLink) continue;

    button.hidden = false;
    button.addEventListener("click", () => {
      title.textContent = name;
      issuer.textContent = issuedBy;
      image.src = thumbnail.currentSrc || thumbnail.src;
      image.alt = name + " certificate";
      pdf.href = pdfLink.href;
      button.focus({ preventScroll: true });
      dialog.showModal();
    });
  }
}

function connectCertificates() {
  const collection = document.querySelector<HTMLElement>("[data-certificates]");
  if (!collection) return;
  connectCertificateFilters(collection);
  connectCertificatePreviews(collection);
}

function connectHeader() {
  const menu = document.querySelector<HTMLDetailsElement>(".mobile-nav");
  const header = menu?.closest<HTMLElement>(".topbar");
  if (!menu || !header) return;

  const compactLayout = window.matchMedia("(max-width: 48rem)");
  compactLayout.addEventListener("change", () => {
    if (!compactLayout.matches) menu.open = false;
  });

  if (!header.closest(".site-shell--home")) {
    let lastY = Math.max(0, window.scrollY);
    const updateHeader = () => {
      const y = Math.max(0, window.scrollY);
      const scrolled = y > header.offsetHeight;
      header.toggleAttribute("data-scrolled", scrolled);
      if (!scrolled || (compactLayout.matches && menu.open)) {
        header.removeAttribute("data-scroll-hidden");
      } else {
        const distance = y - lastY;
        if (Math.abs(distance) < 8) return;
        header.toggleAttribute("data-scroll-hidden", distance > 0);
      }
      lastY = y;
    };

    window.addEventListener("scroll", oncePerFrame(updateHeader), { passive: true });
    compactLayout.addEventListener("change", updateHeader);
    menu.addEventListener("toggle", updateHeader);
    updateHeader();
  }

  menu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) menu.open = false;
  });

  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu.open) return;
    menu.open = false;
    menu.querySelector("summary")?.focus();
  });

  document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
  });
}

function connectEmailCopy() {
  const button = document.querySelector<HTMLButtonElement>("[data-copy-email]");
  const status = document.querySelector<HTMLElement>("[data-copy-status]");
  const email = button?.dataset.copyEmail;
  if (!button || !status || !email || !navigator.clipboard?.writeText) return;

  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = "Email address copied.";
    } catch {
      status.textContent = "Copy failed. Select the email address on this page to copy it manually.";
    }
  });
}

function connectContactForm() {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  const status = form?.querySelector<HTMLElement>("[data-contact-status]");
  const submit = form?.querySelector<HTMLButtonElement>("button[type='submit']");
  if (!form || !status || !submit) return;

  const draft = form.closest<HTMLDetailsElement>("[data-contact-draft]");
  if (draft) draft.hidden = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const fields = new FormData(form);
    const email = String(fields.get("email") ?? "").trim();
    const subject = String(fields.get("subject") ?? "").trim();
    const message = String(fields.get("message") ?? "").trim();

    if (!subject || !message) {
      status.textContent = "Please enter a subject and message.";
      return;
    }

    if (form.dataset.composeUrl) {
      const compose = new URL(form.dataset.composeUrl);
      compose.searchParams.set("su", subject);
      compose.searchParams.set("body", "From: " + email + "\r\n\r\n" + message);
      status.textContent = "If Gmail doesn’t open, use the email address on this page.";
      window.open(compose.href, "_blank", "noopener,noreferrer");
      return;
    }

    const payload = new URLSearchParams();
    for (const [key, value] of fields) {
      if (typeof value === "string") payload.append(key, value.trim());
    }

    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.textContent = "Sending message…";

    try {
      const response = await fetch(form.action, { method: "POST", body: payload });
      if (!response.ok) throw new Error("Contact form was rejected");
      form.reset();
      status.textContent = "Your message was sent.";
    } catch {
      status.textContent = "Your message couldn’t be sent. Try again or use the email address on this page.";
    } finally {
      submit.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
}

connectScrollControls();
connectNavHighlight();
connectCustomCursor(reducedMotion);
connectPointerMotion();
connectProjectFilters();
connectProjectReturn();
connectCertificates();
connectHeader();
connectEmailCopy();
connectContactForm();
revealOnScroll();
