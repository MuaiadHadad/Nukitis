export type ProductFlavor = "chocolate" | "vanilla";
import { commerceQuantity } from "./commerce";

interface ProductDetail {
  flavor: ProductFlavor;
  name: string;
  shortName: string;
  eyebrow: string;
  introduction: string;
  story: string;
  image: string;
  png: string;
  width: number;
  height: number;
  alt: string;
  next: ProductFlavor;
  approvedIngredients: string[] | null;
  approvedNutrition: Record<string, string> | null;
}

const productDetails: Record<ProductFlavor, ProductDetail> = {
  chocolate: {
    flavor: "chocolate",
    name: "NUKITIS Chocolate",
    shortName: "Chocolate",
    eyebrow: "THE RICH ORIGINAL",
    introduction: "Rich chocolate performance nutrition in an individually packed format made to move with your day.",
    story: "Twenty individual sachets bring the NUKITIS Chocolate format together in one black-and-gold box.",
    image: "/images/nukitis-chocolate-1320.webp",
    png: "/images/nukitis-chocolate-1320.png",
    width: 1320,
    height: 1167,
    alt: "Black and gold NUKITIS Chocolate Protein Shake box with two standing sachets and one sachet lying in front.",
    next: "vanilla",
    approvedIngredients: null,
    approvedNutrition: null,
  },
  vanilla: {
    flavor: "vanilla",
    name: "NUKITIS Vanilla",
    shortName: "Vanilla",
    eyebrow: "SMOOTH VANILLA",
    introduction: "A smooth vanilla expression of the same individually packed NUKITIS performance format.",
    story: "Twenty individual sachets bring the NUKITIS Vanilla format together in one gold-and-cream collection.",
    image: "/images/nukitis-vanilla-1320.webp",
    png: "/images/nukitis-vanilla-1320.png",
    width: 1320,
    height: 1219,
    alt: "Black and gold NUKITIS Vanilla Protein Shake box with two standing sachets and one sachet lying in front.",
    next: "chocolate",
    approvedIngredients: null,
    approvedNutrition: null,
  },
};

let detailController: AbortController | undefined;

function productPicture(product: ProductDetail, priority = false) {
  return `<picture><source type="image/webp" srcset="/images/nukitis-${product.flavor}-640.webp 640w, /images/nukitis-${product.flavor}-960.webp 960w, ${product.image} 1320w" sizes="(min-width: 1024px) 52vw, 94vw"><img class="product__image" src="${product.png}" width="${product.width}" height="${product.height}" alt="${product.alt}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" draggable="false"></picture>`;
}

function detailMarkup(product: ProductDetail) {
  const next = productDetails[product.next];
  return `<article class="product-detail detail--${product.flavor}" data-detail-flavor="${product.flavor}">
    <section class="detail-hero hero" aria-labelledby="product-title" data-flavor="${product.flavor}">
      <div class="detail-hero__wash" aria-hidden="true"></div>
      <div class="detail-hero__media product product-panel--${product.flavor}">${productPicture(product, true)}</div>
      <div class="detail-hero__copy">
        <p class="detail-eyebrow">${product.eyebrow}</p>
        <h1 class="headline" id="product-title">${product.name}</h1>
        <p>${product.introduction}</p>
        <div class="detail-hero__facts" aria-label="Verified pack information"><span><strong>35 g</strong> protein</span><span><strong>20</strong> individual servings</span></div>
        <a class="shop-button" href="https://www.nukitis.com/" aria-label="Shop ${product.shortName} at the official NUKITIS store">Shop ${product.shortName} <span aria-hidden="true">&#8594;</span></a>
        <a class="detail-ingredients-link" href="/products/${product.flavor}/ingredients" data-route="/products/${product.flavor}/ingredients">Explore ingredients <span aria-hidden="true">&#8594;</span></a>
        ${commerceQuantity(product.flavor)}
      </div>
      <nav class="detail-flavors" aria-label="Choose a NUKITIS flavor">
        <a class="flavor-indicator${product.flavor === "chocolate" ? " is-active" : ""}" href="/products/chocolate" data-route="/products/chocolate" aria-current="${product.flavor === "chocolate" ? "page" : "false"}"><span class="flavor-indicator__track"></span><span>Chocolate</span></a>
        <a class="flavor-indicator${product.flavor === "vanilla" ? " is-active" : ""}" href="/products/vanilla" data-route="/products/vanilla" aria-current="${product.flavor === "vanilla" ? "page" : "false"}"><span class="flavor-indicator__track"></span><span>Vanilla</span></a>
      </nav>
      <span class="detail-scroll-cue" aria-hidden="true">SCROLL TO DISCOVER <b>&darr;</b></span>
    </section>

    <section class="detail-story" aria-labelledby="story-title">
      <div class="detail-story__sticky">
        <div class="detail-story__copy detail-reveal">
          <p class="detail-eyebrow">NUKITIS PROTEIN SHAKE</p>
          <h2 id="story-title">Performance nutrition.<br>Precisely portioned.</h2>
          <p>${product.story}</p>
        </div>
        <div class="detail-story__product" aria-hidden="true">${productPicture(product)}</div>
        <p class="detail-story__statement detail-reveal">A single-serving format for the moments that ask more of you.</p>
      </div>
    </section>

    <section class="detail-benefits" aria-labelledby="benefits-title">
      <div class="detail-shell">
        <header class="detail-chapter detail-reveal"><p class="detail-eyebrow">THE FORMAT</p><h2 id="benefits-title">Built around the serving.</h2></header>
        <div class="detail-benefit-grid">
          <article class="detail-benefit detail-reveal"><span>01</span><h3>Individually packed</h3><p>Each serving is packed in its own sachet as shown in the supplied product artwork.</p></article>
          <article class="detail-benefit detail-reveal"><span>02</span><h3>20 servings</h3><p>One box presents twenty individual 40 g sachets.</p></article>
          <article class="detail-benefit detail-reveal"><span>03</span><h3>Two flavors</h3><p>Choose the rich Chocolate expression or the smooth Vanilla expression.</p></article>
        </div>
      </div>
    </section>

    <section class="detail-information" aria-labelledby="information-title">
      <div class="detail-information__visual" aria-hidden="true"><div class="detail-information__product">${productPicture(product)}</div></div>
      <div class="detail-information__content">
        <header class="detail-chapter detail-reveal"><p class="detail-eyebrow">PRODUCT INFORMATION</p><h2 id="information-title">The details we can see.</h2><p>Only verified information from the supplied NUKITIS packaging is presented as product fact.</p></header>
        <div class="detail-info-cards">
          <article class="detail-info-card detail-reveal"><span>01</span><h3>Protein</h3><strong>35 g</strong><p>Shown on the supplied packaging as the protein amount for one serving.</p></article>
          <article class="detail-info-card detail-reveal"><span>02</span><h3>Pack format</h3><strong>20 × 40 g</strong><p>Twenty individually packed servings in each box.</p></article>
          <article class="detail-info-card detail-reveal"><span>03</span><h3>Ingredients &amp; allergens</h3><strong>${product.approvedIngredients ? product.approvedIngredients.join(", ") : "Consult the official label"}</strong><p>${product.approvedIngredients ? "Approved ingredient information for this flavor." : "The complete ingredient and allergen list is awaiting approved product data. Consult the physical label or official NUKITIS store before use."}</p></article>
        </div>
      </div>
    </section>

    <section class="detail-nutrition" aria-labelledby="nutrition-detail-title">
      <div class="detail-shell detail-nutrition__grid">
        <header class="detail-chapter detail-reveal"><p class="detail-eyebrow">NUTRITION</p><h2 id="nutrition-detail-title">Product facts.<br>Clearly presented.</h2><p>The supplied packaging verifies the values below. Read the approved physical label for the complete nutrition declaration, ingredients, allergens, preparation directions, and dietary suitability.</p></header>
        <dl class="nutrition-list detail-reveal">
          <div><dt>Protein shown per serving</dt><dd>35 g</dd></div>
          <div><dt>Individual serving size</dt><dd>40 g</dd></div>
          <div><dt>Servings per box</dt><dd>20</dd></div>
          <div class="is-pending"><dt>Complete nutrition declaration</dt><dd>${product.approvedNutrition ? "Available on approved label" : "Pending approved label data"}</dd></div>
        </dl>
      </div>
    </section>

    <section class="next-product next-product--${next.flavor}" aria-labelledby="next-product-title">
      <a href="/products/${next.flavor}" data-route="/products/${next.flavor}" aria-label="Discover NUKITIS ${next.shortName}">
        <div class="next-product__copy detail-reveal"><p class="detail-eyebrow">NEXT FLAVOR</p><h2 id="next-product-title">Discover<br>${next.shortName}.</h2><span>Explore ${next.shortName} <b aria-hidden="true">&#8594;</b></span></div>
        <div class="next-product__media detail-reveal">${productPicture(next)}</div>
      </a>
    </section>
  </article>`;
}

export function renderProductDetail(container: HTMLElement, flavor: ProductFlavor, navigate: (path: string) => void) {
  detailController?.abort();
  detailController = new AbortController();
  const { signal } = detailController;
  const product = productDetails[flavor];
  container.innerHTML = detailMarkup(product);

  const hero = container.querySelector<HTMLElement>(".detail-hero")!;
  let gesture: { id: number; x: number; y: number } | undefined;
  hero.addEventListener("pointerdown", event => {
    if (!event.isPrimary || event.button !== 0 || (event.target instanceof Element && event.target.closest("a, button"))) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    hero.setPointerCapture(event.pointerId);
  }, { signal });
  hero.addEventListener("pointerup", event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = undefined;
    if (Math.abs(dx) > 54 && Math.abs(dx) > Math.abs(dy) * 1.2) navigate(`/products/${dx < 0 ? "vanilla" : "chocolate"}`);
  }, { signal });
  hero.addEventListener("pointercancel", () => { gesture = undefined; }, { signal });

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, hero.offsetHeight)));
      hero.style.setProperty("--detail-scroll", progress.toFixed(4));
    };
    window.addEventListener("scroll", () => {
      if (!frame) frame = requestAnimationFrame(update);
    }, { passive: true, signal });
  }
  document.dispatchEvent(new CustomEvent("nukitis:content-rendered"));
}
