import type { ProductFlavor } from "./product-detail";

interface IngredientPageProduct {
  flavor: ProductFlavor;
  name: string;
  shortName: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  accent: string;
  heroBackground: string;
  next: ProductFlavor;
  intro: string;
}

const products: Record<ProductFlavor, IngredientPageProduct> = {
  chocolate: {
    flavor: "chocolate",
    name: "NUKITIS Chocolate",
    shortName: "Chocolate",
    image: "/images/nukitis-chocolate-1320.png",
    width: 1320,
    height: 1167,
    alt: "NUKITIS Chocolate Protein Shake box with individual sachets.",
    accent: "#915019",
    heroBackground: "#ead7bd",
    next: "vanilla",
    intro: "A closer look at what is verified, what is still to be confirmed, and how to read the original NUKITIS pack.",
  },
  vanilla: {
    flavor: "vanilla",
    name: "NUKITIS Vanilla",
    shortName: "Vanilla",
    image: "/images/nukitis-vanilla-1320.png",
    width: 1320,
    height: 1219,
    alt: "NUKITIS Vanilla Protein Shake box with individual sachets.",
    accent: "#735716",
    heroBackground: "#efdfad",
    next: "chocolate",
    intro: "A closer look at what is verified, what is still to be confirmed, and how to read the original NUKITIS pack.",
  },
};

let ingredientsController: AbortController | undefined;

function productImage(product: IngredientPageProduct, priority = false) {
  return `<img class="ingredients-product-image" src="${product.image}" width="${product.width}" height="${product.height}" alt="${product.alt}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" draggable="false">`;
}

function ingredientMarkup(product: IngredientPageProduct) {
  const next = products[product.next];
  return `<article class="ingredients-page ingredients-page--${product.flavor}" style="--ingredients-accent:${product.accent};--ingredients-hero:${product.heroBackground}" data-ingredients-flavor="${product.flavor}">
    <section class="ingredients-hero" aria-labelledby="ingredients-title">
      <div class="ingredients-hero__copy">
        <p class="ingredients-eyebrow">PRODUCT / INGREDIENTS</p>
        <h1 id="ingredients-title" aria-label="${product.name} Ingredients">${product.name}<br><span aria-hidden="true">Ingredients</span></h1>
        <p>${product.intro}</p>
        <nav class="ingredients-subnav" aria-label="${product.shortName} product information">
          <a href="/products/${product.flavor}" data-route="/products/${product.flavor}">Product</a>
          <a class="is-current" href="/products/${product.flavor}/ingredients" data-route="/products/${product.flavor}/ingredients" aria-current="page">Ingredients</a>
          <a href="/products/${product.flavor}#nutrition" data-route="/products/${product.flavor}#nutrition">Nutrition</a>
        </nav>
      </div>
      <div class="ingredients-hero__product">${productImage(product, true)}</div>
      <span class="ingredients-scroll-cue" aria-hidden="true">SCROLL TO EXPLORE <b>↓</b></span>
    </section>

    <section class="ingredients-intro ingredients-reveal" aria-labelledby="ingredient-story-title">
      <div class="ingredients-shell ingredients-intro__grid">
        <p class="ingredients-eyebrow">THE LABEL, FIRST</p>
        <div><h2 id="ingredient-story-title">Know what is<br>in the sachet.</h2><p>Ingredient information is part of the product, not an afterthought. This page only publishes product facts that are currently verified in the NUKITIS project data.</p></div>
      </div>
    </section>

    <section class="ingredients-feature" aria-labelledby="verified-title">
      <div class="ingredients-feature__visual"><div class="ingredients-feature__product ingredients-reveal">${productImage(product)}</div></div>
      <div class="ingredients-feature__content">
        <header class="ingredients-reveal"><p class="ingredients-eyebrow">VERIFIED INFORMATION</p><h2 id="verified-title">The details<br>we can see.</h2><p>Read the approved physical label for the complete ingredient declaration, allergens, preparation directions, and dietary suitability.</p></header>
        <div class="ingredients-blocks">
          <article class="ingredients-block ingredients-reveal"><span>01</span><h3>Serving format</h3><strong>20 × 40 g</strong><p>Twenty individually packed servings are shown on the supplied NUKITIS packaging.</p></article>
          <article class="ingredients-block ingredients-reveal"><span>02</span><h3>Protein shown</h3><strong>35 g</strong><p>The supplied packaging shows 35 g protein for one serving.</p></article>
          <article class="ingredients-block ingredients-reveal ingredients-block--pending"><span>03</span><h3>Ingredients &amp; allergens</h3><strong>Pending approved data</strong><p>TODO: Add verified ${product.shortName} ingredient and allergen information. No ingredient list is currently approved in the project data.</p><a href="/products/${product.flavor}" data-route="/products/${product.flavor}">Return to ${product.shortName} product page <span aria-hidden="true">→</span></a></article>
        </div>
      </div>
    </section>

    <section class="ingredients-note ingredients-reveal" aria-labelledby="reading-title">
      <div class="ingredients-shell ingredients-note__grid"><p class="ingredients-eyebrow">A NOTE ON PRODUCT DATA</p><div><h2 id="reading-title">The label is<br>the source of truth.</h2><p>Formulas, allergens, and nutritional declarations can change. Until approved NUKITIS product data is available here, use the physical pack and official store information for the complete declaration.</p></div></div>
    </section>

    <section class="ingredients-next ingredients-next--${next.flavor}" aria-labelledby="next-ingredients-title">
      <a href="/products/${next.flavor}/ingredients" data-route="/products/${next.flavor}/ingredients">
        <div class="ingredients-next__copy ingredients-reveal"><p class="ingredients-eyebrow">NEXT FLAVOR</p><h2 id="next-ingredients-title">Discover<br>${next.shortName}<br>Ingredients.</h2><span>Explore ${next.shortName} <b aria-hidden="true">→</b></span></div>
        <div class="ingredients-next__media ingredients-reveal">${productImage(next)}</div>
      </a>
    </section>
  </article>`;
}

export function renderIngredientsPage(container: HTMLElement, flavor: ProductFlavor) {
  ingredientsController?.abort();
  ingredientsController = new AbortController();
  container.innerHTML = ingredientMarkup(products[flavor]);
  document.dispatchEvent(new CustomEvent("nukitis:content-rendered"));
}
