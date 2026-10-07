let returnFocus: HTMLElement | null = null;

export function closeDialog(dialog: HTMLDialogElement) {
  if (!dialog.open || dialog.classList.contains("is-closing")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dialog.close();
    return;
  }
  dialog.classList.add("is-closing");
  window.setTimeout(() => dialog.open && dialog.close(), 220);
}

export function openDialog(dialog: HTMLDialogElement, trigger?: HTMLElement) {
  for (const open of document.querySelectorAll<HTMLDialogElement>("dialog[open]")) open.close();
  returnFocus = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  dialog.showModal();
  document.documentElement.classList.add("overlay-open");
  document.dispatchEvent(new CustomEvent("nukitis:overlay", { detail: true }));
}

export function initDialogs() {
  document.querySelectorAll<HTMLDialogElement>("dialog").forEach(dialog => {
    dialog.querySelectorAll<HTMLButtonElement>("[data-close-dialog]").forEach(button => {
      button.addEventListener("click", () => closeDialog(dialog));
    });
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(dialog);
    });
    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener("close", () => {
      dialog.classList.remove("is-closing");
      if (document.querySelector("dialog[open]")) return;
      document.documentElement.classList.remove("overlay-open");
      document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
      document.dispatchEvent(new CustomEvent("nukitis:overlay", { detail: false }));
      returnFocus?.focus({ preventScroll: true });
      returnFocus = null;
    });
  });
}
