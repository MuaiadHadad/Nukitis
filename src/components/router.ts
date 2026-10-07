import { renderProductDetail, type ProductFlavor } from "./product-detail";
import { renderIngredientsPage } from "./ingredients";
import { renderCommerceRoute } from "./commerce";

type Flavor = "chocolate" | "vanilla";

function routeFromPath(pathname = window.location.pathname) {
  if (pathname === "/cart" || pathname === "/cart/") return { page: "cart" as const };
  if (pathname === "/checkout" || pathname === "/checkout/") return { page: "checkout" as const };
  const ingredientsMatch = pathname.match(/^\/products\/(chocolate|vanilla)\/ingredients\/?$/);
  if (ingredientsMatch) return { page: "ingredients" as const, flavor: ingredientsMatch[1] as Flavor };
  const match = pathname.match(/^\/products\/(chocolate|vanilla)\/?$/);
  return match ? { page: "product" as const, flavor: match[1] as Flavor } : { page: "home" as const };
}

export function initRouter() {
  const home = document.querySelector<HTMLElement>(".home-hero")!;
  const campaign = document.querySelector<HTMLElement>(".campaign")!;
  const editorial = document.querySelector<HTMLElement>(".editorial")!;
  const world = document.querySelector<HTMLElement>(".world-section")!;
  const transitionDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 260;
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;
  let entranceTimer: ReturnType<typeof setTimeout> | undefined;

  function runEntrance() {
    document.body.classList.remove("page-is-entering");
    requestAnimationFrame(() => {
      document.body.classList.add("page-is-entering");
      if (entranceTimer) window.clearTimeout(entranceTimer);
      entranceTimer = window.setTimeout(() => document.body.classList.remove("page-is-entering"), 1100);
    });
  }

  function render(pathname = window.location.pathname, restoreScroll = false) {
    const route = routeFromPath(pathname);
    document.body.dataset.page = route.page;
    home.hidden = route.page !== "home";
    campaign.hidden = route.page !== "product" && route.page !== "ingredients" && route.page !== "cart" && route.page !== "checkout";
    editorial.hidden = route.page !== "home";
    world.hidden = route.page !== "home";
    document.title = route.page === "home"
      ? "NUKITIS | Performance Nutrition"
      : route.page === "cart" ? "NUKITIS | Cart" : route.page === "checkout" ? "NUKITIS | Checkout" : `NUKITIS ${route.flavor === "chocolate" ? "Chocolate" : "Vanilla"} | ${route.page === "ingredients" ? "Ingredients" : "Protein Shake"}`;
    if (route.page === "product") {
      renderProductDetail(campaign, route.flavor as ProductFlavor, path => navigate(path));
    }
    if (route.page === "ingredients") renderIngredientsPage(campaign, route.flavor as ProductFlavor);
    if (route.page === "cart" || route.page === "checkout") renderCommerceRoute(campaign, route.page);
    if (!restoreScroll) window.scrollTo({ top: 0, behavior: "auto" });
    if (route.page === "home" && window.location.hash) {
      requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
    }
    runEntrance();
  }

  function navigate(pathname: string, replace = false, hash = "") {
    if (pathname === window.location.pathname && hash) {
      history[replace ? "replaceState" : "pushState"]({}, "", `${pathname}${hash}`);
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (pathname === window.location.pathname) return;
    document.body.classList.add("page-is-leaving");
    if (transitionTimer) window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      history[replace ? "replaceState" : "pushState"]({}, "", `${pathname}${hash}`);
      render(pathname);
      requestAnimationFrame(() => document.body.classList.remove("page-is-leaving"));
    }, transitionDuration);
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest<HTMLAnchorElement>('a[data-route], a[href^="/#"]');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (anchor.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    anchor.closest<HTMLDialogElement>("dialog")?.close();
    const url = new URL(anchor.href, window.location.href);
    navigate(url.pathname, false, url.hash);
  });

  window.addEventListener("popstate", () => render(window.location.pathname, true));
  render();
}
