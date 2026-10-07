export function initRails() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll<HTMLElement>("[data-rail]").forEach(rail => {
    const track = rail.querySelector<HTMLElement>(".rail__track")!;
    const previous = rail.querySelector<HTMLButtonElement>(".rail__arrow--previous")!;
    const next = rail.querySelector<HTMLButtonElement>(".rail__arrow--next")!;
    function update() {
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    }
    function move(direction: number) {
      const card = track.querySelector<HTMLElement>(".content-card");
      if (!card) return;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap);
      track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reduced.matches ? "instant" : "smooth" });
    }
    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    track.addEventListener("scroll", update, { passive: true });
    let drag: { id: number; x: number; scroll: number; moved: boolean } | undefined;
    let suppressClick = false;
    track.addEventListener("pointerdown", (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      suppressClick = false;
      drag = { id: event.pointerId, x: event.clientX, scroll: track.scrollLeft, moved: false };
    });
    track.addEventListener("pointermove", (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      const delta = event.clientX - drag.x;
      if (Math.abs(delta) > 8 && !drag.moved) {
        drag.moved = true;
        track.setPointerCapture(event.pointerId);
        track.classList.add("is-dragging");
      }
      if (drag.moved) {
        event.preventDefault();
        track.scrollLeft = drag.scroll - delta;
      }
    });
    function stopDrag() {
      if (!drag) return;
      suppressClick = drag.moved;
      if (track.hasPointerCapture(drag.id)) track.releasePointerCapture(drag.id);
      drag = undefined;
      track.classList.remove("is-dragging");
    }
    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
    track.addEventListener("lostpointercapture", stopDrag);
    track.addEventListener("pointerleave", () => { if (drag && !drag.moved) stopDrag(); });
    track.addEventListener("click", event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, { capture: true });
    track.addEventListener("dragstart", event => event.preventDefault());
    track.addEventListener("keydown", event => {
      if (event.target !== track || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home" || event.key === "End") {
        track.scrollTo({ left: event.key === "Home" ? 0 : track.scrollWidth, behavior: reduced.matches ? "instant" : "smooth" });
      } else move(event.key === "ArrowRight" ? 1 : -1);
    });
    new ResizeObserver(update).observe(track);
    document.addEventListener("nukitis:rail-update", update);
    update();
  });
}
