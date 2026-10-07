import { allContent } from "./content";
import { initDialogs, openDialog, closeDialog } from "./dialogs";

export function initNavigation() {
  initDialogs();
  const header = document.querySelector<HTMLElement>(".site-header")!;
  const menu = document.querySelector<HTMLDialogElement>("#site-menu")!;
  const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
  const search = document.querySelector<HTMLDialogElement>("#site-search")!;
  const searchInput = document.querySelector<HTMLInputElement>("#search-input")!;
  const results = document.querySelector<HTMLElement>("#search-results")!;
  menuToggle.addEventListener("click", () => {
    openDialog(menu, menuToggle);
    menuToggle.setAttribute("aria-expanded", "true");
  });
  document.querySelector<HTMLButtonElement>(".search-toggle")!.addEventListener("click", event => {
    openDialog(search, event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined);
    renderResults();
    searchInput.focus();
  });
  function renderResults() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const items = allContent.filter(item =>
      `${item.title} ${item.category} ${item.description}`.toLocaleLowerCase().includes(query),
    ).slice(0, 8);
    results.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.textContent = "No results yet. Try a flavor or a discipline.";
      results.append(empty);
    }
    for (const item of items) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.detail = item.id;
      const category = document.createElement("span");
      category.textContent = item.category;
      const title = document.createElement("strong");
      title.textContent = item.title.replace("\n", " ");
      button.append(category, title);
      results.append(button);
    }
  }
  searchInput.addEventListener("input", renderResults);
  document.getElementById("search-form")!.addEventListener("submit", event => event.preventDefault());

  const groups = [...document.querySelectorAll<HTMLElement>(".nav-group")];
  function closeDropdowns(except?: HTMLElement) {
    groups.forEach(group => {
      if (group === except) return;
      group.querySelector<HTMLButtonElement>(".nav-trigger")!.setAttribute("aria-expanded", "false");
      group.querySelector<HTMLElement>(".nav-dropdown")!.hidden = true;
    });
  }
  groups.forEach(group => {
    const trigger = group.querySelector<HTMLButtonElement>(".nav-trigger")!;
    const dropdown = group.querySelector<HTMLElement>(".nav-dropdown")!;
    let openedByHover = false;
    const show = () => {
      closeDropdowns(group);
      dropdown.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    };
    trigger.addEventListener("click", () => {
      if (dropdown.hidden || openedByHover) show();
      else closeDropdowns();
      openedByHover = false;
    });
    group.addEventListener("pointerenter", event => {
      if (event.pointerType === "mouse" && dropdown.hidden) {
        show();
        openedByHover = true;
      }
    });
    group.addEventListener("pointerleave", () => {
      if (!group.contains(document.activeElement)) closeDropdowns();
    });
    group.addEventListener("focusout", event => {
      if (!(event.relatedTarget instanceof Node) || !group.contains(event.relatedTarget)) closeDropdowns();
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const expanded = document.querySelector<HTMLButtonElement>('.nav-trigger[aria-expanded="true"]');
    closeDropdowns();
    expanded?.focus();
  });
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(".nav-group")) closeDropdowns();
    const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
    if (!anchor) return;
    closeDropdowns();
    if (menu.open) closeDialog(menu);
    const flavor = anchor.dataset.selectFlavor;
    if (flavor) document.querySelector<HTMLButtonElement>(`.flavor-indicator[data-flavor="${flavor}"]`)!.click();
  });
  let lastY = window.scrollY;
  let queued = false;
  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 80);
      if (Math.abs(y - lastY) > 4) {
        header.classList.toggle("is-hidden", y > 180 && y > lastY && !header.contains(document.activeElement));
        lastY = y;
      }
      queued = false;
    });
  }, { passive: true });
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
}
