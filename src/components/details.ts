import { allContent } from "./content";
import { openDialog } from "./dialogs";

export function initDetails() {
  const dialog = document.querySelector<HTMLDialogElement>("#content-detail")!;
  const container = document.querySelector<HTMLElement>("#detail-content")!;
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLElement>("[data-detail]");
    if (!trigger) return;
    event.preventDefault();
    const item = allContent.find(item => item.id === trigger.dataset.detail);
    if (!item) throw new Error(`Unknown NUKITIS content: ${trigger.dataset.detail}`);
    container.innerHTML = `${item.image ? `<div class="detail-media${item.kind === "product" ? " detail-media--product" : ""}"><img src="${item.image}" alt="${item.imageAlt}" width="1200" height="800" />${item.kind !== "product" ? '<span class="media-placeholder-label">ORIGINAL MEDIA PLACEHOLDER</span>' : ""}</div>` : ""}<div class="detail-body"><p class="kicker">${item.category}</p><h2 id="detail-title">${item.title.replace("\n", " ")}</h2><p class="detail-lead">${item.description}</p>${item.body.map(paragraph => `<p>${paragraph}</p>`).join("")}${item.kind === "product" ? '<a class="primary-button" href="https://www.nukitis.com/">Visit the official store <span aria-hidden="true">&#8594;</span></a>' : ""}</div>`;
    const previousDialog = trigger.closest<HTMLDialogElement>("dialog");
    const focusTarget = previousDialog
      ? document.querySelector<HTMLElement>(previousDialog.id === "site-menu" ? ".menu-toggle" : ".search-toggle")!
      : trigger;
    openDialog(dialog, focusTarget);
    dialog.scrollTop = 0;
  });
}
