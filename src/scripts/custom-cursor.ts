import { isPageNavigation } from "./page-navigation";

const interactiveSelector = 'a[href], button, input, select, textarea, summary, [role="button"]';
const nativeCursorSelector = 'input, select, textarea, [contenteditable], .contact-details address';
const darkSurfaceSelector = ".panel--dark, .button--dark, .brand-badge, .case-next, .footer-home, .expertise-item[open]";
const pointerStorageKey = "portfolio-pointer";

export function connectCustomCursor(reducedMotion: MediaQueryList) {
  const cursor = document.querySelector<HTMLElement>(".custom-cursor");
  const dot = cursor?.querySelector<HTMLElement>(".custom-cursor-dot");
  const ring = cursor?.querySelector<HTMLElement>(".custom-cursor-ring");
  if (!cursor || !dot || !ring) return;

  const desktopCursor = window.matchMedia("(hover: hover) and (pointer: fine) and (forced-colors: none)");
  const root = document.documentElement;
  const dialog = document.querySelector<HTMLDialogElement>("[data-certificate-dialog]");
  let hasPointer = false;
  let targetX = 0;
  let targetY = 0;
  let ringX = 0;
  let ringY = 0;
  let frame = 0;
  let visible = false;

  const position = (element: HTMLElement, x: number, y: number) => {
    element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };

  const followPointer = () => {
    const ease = reducedMotion.matches ? 1 : .18;
    ringX += (targetX - ringX) * ease;
    ringY += (targetY - ringY) * ease;
    const settled = Math.abs(targetX - ringX) + Math.abs(targetY - ringY) <= .2;
    if (settled) {
      ringX = targetX;
      ringY = targetY;
    }
    position(ring, ringX, ringY);
    frame = settled ? 0 : requestAnimationFrame(followPointer);
  };

  const updateTarget = (target: Element) => {
    let onDark = Boolean(target.closest(darkSurfaceSelector));
    if (dialog?.open && target === dialog) {
      const { left, top, right, bottom } = dialog.getBoundingClientRect();
      onDark = targetX < left || targetX > right || targetY < top || targetY > bottom;
    }
    cursor.toggleAttribute("data-interactive", Boolean(target.closest(interactiveSelector)));
    cursor.toggleAttribute("data-on-dark", onDark);
  };

  const hide = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    visible = false;
    root.classList.remove("custom-cursor-enabled");
    cursor.removeAttribute("data-visible");
  };

  const refresh = (target = document.elementFromPoint(targetX, targetY)) => {
    if (!hasPointer || !desktopCursor.matches || document.hidden || !target || target.closest(nativeCursorSelector)) {
      if (visible) hide();
      return;
    }

    position(dot, targetX, targetY);
    updateTarget(target);
    if (!visible) {
      visible = true;
      ringX = targetX;
      ringY = targetY;
      position(ring, ringX, ringY);
      root.classList.add("custom-cursor-enabled");
      cursor.toggleAttribute("data-visible", true);
    }
    if (!frame && (ringX !== targetX || ringY !== targetY)) frame = requestAnimationFrame(followPointer);
  };

  const forgetPointer = () => {
    hasPointer = false;
    if (visible) hide();
  };

  const track = (event: PointerEvent) => {
    if (event.pointerType === "touch") {
      forgetPointer();
      return;
    }
    hasPointer = true;
    targetX = event.clientX;
    targetY = event.clientY;
    refresh(event.target instanceof Element ? event.target : undefined);
  };
  for (const type of ["pointermove", "pointerover", "pointerdown"] as const) {
    window.addEventListener(type, track, { passive: true });
  }

  document.addEventListener("click", (event) => {
    if (!event.detail || !visible || !isPageNavigation(event)) return;
    try {
      sessionStorage.setItem(pointerStorageKey, [event.clientX, event.clientY, Date.now()].join(","));
    } catch {
      // Pointer tracking still works when storage is unavailable.
    }
  });
  const restore = () => {
    try {
      const saved = sessionStorage.getItem(pointerStorageKey);
      sessionStorage.removeItem(pointerStorageKey);
      const [x, y, savedAt] = (saved ?? "").split(",").map(Number);
      if ([x, y, savedAt].every(Number.isFinite) && Date.now() - savedAt < 15000) {
        hasPointer = true;
        targetX = x;
        targetY = y;
      }
    } catch {
      // Storage can be blocked by browser settings.
    }
    refresh();
  };

  if (dialog) {
    new MutationObserver(() => {
      (dialog.open ? dialog : document.body).append(cursor);
      refresh();
    }).observe(dialog, { attributeFilter: ["open"] });
  }

  document.documentElement.addEventListener("pointerleave", forgetPointer);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide();
    else refresh();
  });
  window.addEventListener("blur", hide);
  window.addEventListener("focus", () => refresh());
  window.addEventListener("pagehide", forgetPointer);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) restore();
  });
  desktopCursor.addEventListener("change", () => refresh());
  restore();
}
