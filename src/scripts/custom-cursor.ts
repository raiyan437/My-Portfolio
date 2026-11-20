const interactiveSelector = 'a[href], button, input, select, textarea, summary, [role="button"]';
const nativeCursorSelector = 'input, select, textarea, [contenteditable], .contact-details address';
const darkSurfaceSelector = ".panel--dark, .button--dark, .brand-badge, .case-next, .footer-home, .expertise-item[open]";

export function connectCustomCursor(reducedMotion: MediaQueryList) {
  const cursor = document.querySelector<HTMLElement>(".custom-cursor");
  const dot = cursor?.querySelector<HTMLElement>(".custom-cursor-dot");
  const ring = cursor?.querySelector<HTMLElement>(".custom-cursor-ring");
  if (!cursor || !dot || !ring) return;

  const desktopCursor = window.matchMedia("(hover: hover) and (pointer: fine) and (forced-colors: none)");
  const root = document.documentElement;
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

  const updateTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return;
    cursor.toggleAttribute("data-interactive", Boolean(target.closest(interactiveSelector)));
    cursor.toggleAttribute("data-on-dark", Boolean(target.closest(darkSurfaceSelector)));
  };

  const hide = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    visible = false;
    root.classList.remove("custom-cursor-enabled");
    cursor.removeAttribute("data-visible");
  };

  window.addEventListener("pointermove", (event) => {
    const usesNativeCursor = event.target instanceof Element && event.target.closest(nativeCursorSelector);
    if (!desktopCursor.matches || event.pointerType === "touch" || usesNativeCursor) {
      if (visible) hide();
      return;
    }

    targetX = event.clientX;
    targetY = event.clientY;
    position(dot, targetX, targetY);
    if (!visible) {
      visible = true;
      ringX = targetX;
      ringY = targetY;
      position(ring, ringX, ringY);
      updateTarget(event.target);
      root.classList.add("custom-cursor-enabled");
      cursor.toggleAttribute("data-visible", true);
    }
    if (!frame) frame = requestAnimationFrame(followPointer);
  }, { passive: true });

  window.addEventListener("pointerover", (event) => {
    if (visible && event.pointerType !== "touch") updateTarget(event.target);
  }, { passive: true });
  document.addEventListener("pointerdown", (event) => {
    if (visible && event.pointerType === "touch") hide();
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", hide);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide();
  });
  window.addEventListener("blur", hide);
  window.addEventListener("pageswap", hide);
  desktopCursor.addEventListener("change", hide);
}
