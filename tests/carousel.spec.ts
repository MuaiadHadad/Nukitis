import { expect, test } from "@playwright/test";

test("desktop scroll story keeps the product visual anchored and reveals chapters", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/products/chocolate");
  const story = page.locator(".detail-story");
  await story.scrollIntoViewIfNeeded();
  const visual = page.locator(".detail-story__product");
  await expect(visual).toBeVisible();
  const first = await visual.boundingBox();
  await page.evaluate(() => scrollBy({ top: 500, behavior: "instant" }));
  await expect(page.getByText("A single-serving format for the moments that ask more of you.")).toBeVisible();
  const second = await visual.boundingBox();
  expect(Math.abs(second!.y - first!.y)).toBeLessThan(150);
  await page.locator(".detail-information").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "The details we can see." })).toBeVisible();
});

test("mobile swipe navigates between individual product pages", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/products/chocolate");
  const cdp = await context.newCDPSession(page);
  const swipe = async (from: number, to: number) => {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: from, y: 380 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: to, y: 380 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };
  await swipe(330, 90);
  await expect(page).toHaveURL(/\/products\/vanilla$/);
  await expect(page.locator(".detail-hero")).toHaveAttribute("data-flavor", "vanilla");
  await swipe(60, 300);
  await expect(page).toHaveURL(/\/products\/chocolate$/);
  await expect(page.locator(".detail-hero")).toHaveAttribute("data-flavor", "chocolate");
  await context.close();
});

test("flavor navigation, artwork, and reduced motion remain accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/products/chocolate");
  const images = await page.locator(".detail-hero .product__image").evaluateAll(elements => elements.map(element => {
    const image = element as HTMLImageElement;
    return { loaded: image.complete && image.naturalWidth > 0, fit: getComputedStyle(image).objectFit };
  }));
  expect(images.every(({ loaded, fit }) => loaded && fit === "contain")).toBe(true);
  await page.getByRole("navigation", { name: "Choose a NUKITIS flavor" }).getByRole("link", { name: "Vanilla" }).click();
  await expect(page).toHaveURL(/\/products\/vanilla$/);
  await expect(page.getByRole("link", { name: "Shop Vanilla at the official NUKITIS store" })).toBeVisible();
  await expect(page.locator(".detail-hero__media")).toHaveCSS("transition-duration", "0s");
});
