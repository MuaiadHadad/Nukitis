import type { ProductFlavor } from "./product-detail";

export interface CommerceProduct {
  flavor: ProductFlavor;
  name: string;
  shortName: string;
  image: string;
  alt: string;
  priceCents: number | null;
  currency: string;
}

interface CartItem {
  flavor: ProductFlavor;
  quantity: number;
}

const CART_KEY = "nukitis-cart-v1";
const MAX_QUANTITY = 20;

export const commerceProducts: Record<ProductFlavor, CommerceProduct> = {
  chocolate: {
    flavor: "chocolate",
    name: "NUKITIS Chocolate",
    shortName: "Chocolate",
    image: "/images/nukitis-chocolate-640.webp",
    alt: "NUKITIS Chocolate Protein Shake box and individual sachets.",
    priceCents: null,
    currency: "EUR",
  },
  vanilla: {
    flavor: "vanilla",
    name: "NUKITIS Vanilla",
    shortName: "Vanilla",
    image: "/images/nukitis-vanilla-640.webp",
    alt: "NUKITIS Vanilla Protein Shake box and individual sachets.",
    priceCents: null,
    currency: "EUR",
  },
};

let items: CartItem[] = readCart();
let drawer: HTMLDialogElement | null = null;
let lastTrigger: HTMLElement | null = null;

function readCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem =>
      typeof item === "object" && item !== null &&
      (item as CartItem).flavor in commerceProducts &&
      Number.isInteger((item as CartItem).quantity) &&
      (item as CartItem).quantity > 0,
    ).map(item => ({ flavor: item.flavor, quantity: Math.min(MAX_QUANTITY, item.quantity) }));
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent("nukitis:cart-updated"));
}

function itemCount() {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function formatPrice(product: CommerceProduct) {
  return product.priceCents === null ? "Price pending" : new Intl.NumberFormat("en-IE", {
    style: "currency", currency: product.currency,
  }).format(product.priceCents / 100);
}

function totalLabel() {
  if (items.some(item => commerceProducts[item.flavor].priceCents === null)) return "Price pending";
  const cents = items.reduce((total, item) => total + (commerceProducts[item.flavor].priceCents || 0) * item.quantity, 0);
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function cartMarkup() {
  if (!items.length) {
    return `<div class="cart-empty"><p class="commerce-eyebrow">YOUR CART</p><h2>Your cart is empty.</h2><p>Discover NUKITIS Chocolate and Vanilla.</p><a class="primary-button" href="/#nutrition" data-route="/#nutrition">Explore products <span aria-hidden="true">→</span></a></div>`;
  }
  return `<div class="cart-content"><div class="cart-items">${items.map(item => {
    const product = commerceProducts[item.flavor];
    return `<article class="cart-item">
      <img src="${product.image}" width="160" height="145" alt="${product.alt}" loading="lazy">
      <div class="cart-item__body"><p class="commerce-eyebrow">${product.shortName}</p><h3>${product.name}</h3><p class="cart-item__price">${formatPrice(product)}</p>
        <div class="cart-item__actions"><div class="quantity-control" aria-label="Quantity for ${product.name}"><button type="button" data-cart-action="decrease" data-flavor="${product.flavor}" aria-label="Decrease ${product.shortName} quantity">−</button><output>${item.quantity}</output><button type="button" data-cart-action="increase" data-flavor="${product.flavor}" aria-label="Increase ${product.shortName} quantity">+</button></div><button class="text-button" type="button" data-cart-action="remove" data-flavor="${product.flavor}">Remove</button></div>
      </div>
    </article>`;
  }).join("")}</div><aside class="cart-summary"><p class="commerce-eyebrow">SUMMARY</p><div><span>Subtotal</span><strong>${totalLabel()}</strong></div><p class="commerce-note">Shipping, tax, and payment are calculated only after approved store configuration is connected.</p><a class="primary-button${items.some(item => commerceProducts[item.flavor].priceCents === null) ? " is-disabled" : ""}" href="/checkout" data-route="/checkout" aria-disabled="${items.some(item => commerceProducts[item.flavor].priceCents === null)}">Checkout <span aria-hidden="true">→</span></a><a class="outline-button" href="/cart" data-route="/cart">View full cart</a><a class="outline-button" href="/#nutrition" data-route="/#nutrition">Continue shopping</a></aside></div>`;
}

function renderDrawer() {
  if (!drawer) return;
  const content = drawer.querySelector<HTMLElement>("[data-cart-drawer-content]");
  if (content) content.innerHTML = cartMarkup();
  const count = document.querySelector<HTMLElement>("[data-cart-count]");
  if (count) {
    count.textContent = String(itemCount());
    count.hidden = itemCount() === 0;
  }
}

function setQuantity(flavor: ProductFlavor, delta: number) {
  const item = items.find(entry => entry.flavor === flavor);
  if (!item) return;
  item.quantity = Math.max(0, Math.min(MAX_QUANTITY, item.quantity + delta));
  if (!item.quantity) items = items.filter(entry => entry !== item);
  saveCart();
  renderDrawer();
  renderCartPageIfVisible();
}

function addToCart(flavor: ProductFlavor, quantity: number) {
  if (!commerceProducts[flavor] || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return;
  const item = items.find(entry => entry.flavor === flavor);
  if (item) item.quantity = Math.min(MAX_QUANTITY, item.quantity + quantity);
  else items.push({ flavor, quantity });
  saveCart();
  renderDrawer();
  openCart();
}

function openCart(trigger?: HTMLElement) {
  if (!drawer) return;
  lastTrigger = trigger || null;
  renderDrawer();
  if (!drawer.open) drawer.showModal();
}

function closeCart() {
  if (!drawer?.open) return;
  drawer.close();
  lastTrigger?.focus();
}

function renderCartPageIfVisible() {
  const page = document.querySelector<HTMLElement>("[data-commerce-page]");
  if (page?.dataset.commercePage === "cart") page.innerHTML = `<section class="commerce-page commerce-cart-page"><div class="commerce-shell"><a class="back-link" href="/" data-route="/">← NUKITIS home</a><p class="commerce-eyebrow">NUKITIS STORE</p><h1>Your cart.</h1>${cartMarkup()}</div></section>`;
}

function renderSummary() {
  return `<aside class="checkout-summary"><p class="commerce-eyebrow">ORDER SUMMARY</p>${items.length ? items.map(item => `<div class="checkout-summary__item"><span>${commerceProducts[item.flavor].shortName} × ${item.quantity}</span><strong>${formatPrice(commerceProducts[item.flavor])}</strong></div>`).join("") : `<p>Your cart is empty.</p>`}<div class="checkout-summary__total"><span>Total</span><strong>${totalLabel()}</strong></div><p class="commerce-note">No payment details are collected by this site. A payment provider must be configured before orders can be placed.</p></aside>`;
}

export function renderCommerceRoute(container: HTMLElement, page: "cart" | "checkout") {
  if (page === "cart") {
    container.innerHTML = `<div data-commerce-page="cart"></div>`;
    renderCartPageIfVisible();
    return;
  }
  container.innerHTML = `<section class="commerce-page checkout-page" data-commerce-page="checkout"><div class="commerce-shell"><a class="back-link" href="/cart" data-route="/cart">← Back to cart</a><div class="checkout-layout"><div><p class="commerce-eyebrow">CHECKOUT</p><h1>Complete your order.</h1><p class="commerce-lead">A calm, secure checkout prepared for the NUKITIS store.</p><div class="checkout-status" role="status"><strong>Checkout is not available yet.</strong><span>Pricing, delivery, and a secure payment provider have not been configured in this project. Your cart is saved and no order will be submitted.</span></div><form class="checkout-form" data-checkout-form><fieldset><legend>Contact</legend><label>Email<input name="email" type="email" autocomplete="email" required><small data-error-for="email"></small></label></fieldset><fieldset><legend>Delivery</legend><div class="form-grid"><label>First name<input name="firstName" autocomplete="given-name" required><small data-error-for="firstName"></small></label><label>Last name<input name="lastName" autocomplete="family-name" required><small data-error-for="lastName"></small></label></div><label>Morada<input name="address" autocomplete="street-address" required><small data-error-for="address"></small></label><div class="form-grid"><label>Código postal<input name="postalCode" inputmode="numeric" autocomplete="postal-code" required><small data-error-for="postalCode"></small></label><label>Localidade<input name="city" autocomplete="address-level2" required><small data-error-for="city"></small></label></div><label>Country<select name="country" autocomplete="country"><option value="PT">Portugal</option></select></label></fieldset><button class="primary-button place-order" type="submit" disabled>Place order</button><p class="commerce-note">Payment and order creation will be enabled only after server-side pricing, shipping, and provider integration are available.</p></form></div>${renderSummary()}</div></div></section>`;
  const form = container.querySelector<HTMLFormElement>("[data-checkout-form]");
  form?.addEventListener("submit", event => event.preventDefault());
}

export function initCommerce() {
  drawer = document.querySelector<HTMLDialogElement>("#cart-drawer");
  const cartButton = document.querySelector<HTMLButtonElement>("[data-cart-open]");
  cartButton?.addEventListener("click", () => openCart(cartButton));
  drawer?.addEventListener("click", event => {
    if (event.target === drawer) closeCart();
  });
  drawer?.querySelector("[data-cart-close]")?.addEventListener("click", closeCart);
  document.addEventListener("keydown", event => { if (event.key === "Escape" && drawer?.open) closeCart(); });
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    const action = event.target.closest<HTMLElement>("[data-cart-action]");
    if (action) {
      const flavor = action.dataset.flavor as ProductFlavor;
      if (action.dataset.cartAction === "increase") setQuantity(flavor, 1);
      if (action.dataset.cartAction === "decrease") setQuantity(flavor, -1);
      if (action.dataset.cartAction === "remove") { items = items.filter(item => item.flavor !== flavor); saveCart(); renderDrawer(); renderCartPageIfVisible(); }
      return;
    }
    const add = event.target.closest<HTMLButtonElement>("[data-add-to-cart]");
    if (add) addToCart(add.dataset.addToCart as ProductFlavor, Number(document.querySelector<HTMLInputElement>(`[data-quantity="${add.dataset.addToCart}"]`)?.value || 1));
  });
  renderDrawer();
}

export function commerceQuantity(flavor: ProductFlavor) {
  return `<div class="purchase-panel" data-purchase="${flavor}"><p class="commerce-eyebrow">READY WHEN YOU ARE</p><div class="purchase-panel__row"><div><strong>Price pending</strong><small>Official store pricing will appear here when configured.</small></div><div class="quantity-control" aria-label="Quantity for ${commerceProducts[flavor].name}"><button type="button" data-quantity-action="decrease" aria-label="Decrease quantity">−</button><input data-quantity="${flavor}" type="number" min="1" max="${MAX_QUANTITY}" value="1" inputmode="numeric" aria-label="Quantity"><button type="button" data-quantity-action="increase" aria-label="Increase quantity">+</button></div></div><button class="primary-button add-to-cart" type="button" data-add-to-cart="${flavor}">Add to cart <span aria-hidden="true">→</span></button><p class="commerce-note">TODO: connect approved price, stock, shipping, tax, and payment configuration before launch.</p></div>`;
}

export function initQuantityControls() {
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>("[data-quantity-action]");
    if (!button) return;
    const panel = button.closest<HTMLElement>("[data-purchase]");
    const input = panel?.querySelector<HTMLInputElement>("input[type=number]");
    if (!input) return;
    const next = Number(input.value) + (button.dataset.quantityAction === "increase" ? 1 : -1);
    input.value = String(Math.max(1, Math.min(MAX_QUANTITY, Number.isFinite(next) ? next : 1)));
  });
}
