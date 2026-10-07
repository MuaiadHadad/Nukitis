export function initScrollMotion() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("reveal-pending");
      entry.target.classList.add("reveal-ready");
      observer.unobserve(entry.target);
    });
  }, { threshold: .06, rootMargin: "0px 0px 18% 0px" });
  const observeElements = () => {
    document.querySelectorAll<HTMLElement>(
      ".content-section .section-heading, .content-section .rail, .feature-banner, .world-section > h2, .discovery-grid, .site-footer .footer-grid, .detail-reveal",
    ).forEach((element, index) => {
      if (element.classList.contains("reveal-ready") || element.classList.contains("reveal-pending")) return;
      if (element.getBoundingClientRect().top < window.innerHeight * .92) {
        element.classList.add("reveal-ready");
        return;
      }
      element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 70}ms`);
      element.classList.add("reveal-pending");
      observer.observe(element);
    });
  };
  observeElements();
  document.addEventListener("nukitis:content-rendered", observeElements);
  reduced.addEventListener("change", () => {
    if (!reduced.matches) return;
    observer.disconnect();
    document.querySelectorAll(".reveal-pending").forEach(element => element.classList.remove("reveal-pending"));
  });
}
