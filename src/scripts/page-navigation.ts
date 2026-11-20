export function isPageNavigation(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return false;
  const link = event.target instanceof Element && event.target.closest<HTMLAnchorElement>("a[href]");
  if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return false;

  const url = new URL(link.href);
  return url.origin === location.origin && (url.pathname !== location.pathname || url.search !== location.search);
}

export function connectPageLoading() {
  const root = document.documentElement;
  const finishInitialLoad = async () => {
    const portrait = document.querySelector<HTMLImageElement>(".hero-portrait img");
    await Promise.allSettled([document.fonts?.ready, portrait?.decode()]);
    if (root.dataset.pageLoading === "initial") delete root.dataset.pageLoading;
  };

  if (document.readyState === "complete") void finishInitialLoad();
  else window.addEventListener("load", finishInitialLoad, { once: true });

  let showTimer = 0;
  let resetTimer = 0;
  const finishNavigation = () => {
    clearTimeout(showTimer);
    clearTimeout(resetTimer);
    if (root.dataset.pageLoading === "navigation") delete root.dataset.pageLoading;
  };
  document.addEventListener("click", (event) => {
    if (!isPageNavigation(event)) return;
    finishNavigation();
    showTimer = window.setTimeout(() => {
      if (!event.defaultPrevented) root.dataset.pageLoading = "navigation";
    }, 150);
    resetTimer = window.setTimeout(finishNavigation, 8000);
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) finishNavigation();
  });
  document.addEventListener("focusin", () => {
    if (root.dataset.pageLoading === "initial" && document.activeElement?.matches(":focus-visible")) {
      delete root.dataset.pageLoading;
    }
  });
}
