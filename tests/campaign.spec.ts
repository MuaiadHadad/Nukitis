import { expect, test } from "@playwright/test";

const viewports = [
  { width: 1920, height: 1080 }, { width: 1440, height: 900 }, { width: 1366, height: 768 },
  { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 430, height: 932 },
  { width: 390, height: 844 }, { width: 375, height: 812 },
];

for (const viewport of viewports) {
  test(`individual product detail at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/products/chocolate");
    const hero = page.locator(".detail-hero");
    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("data-flavor", "chocolate");
    await expect(page.getByRole("heading", { name: "NUKITIS Chocolate", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Shop Chocolate at the official NUKITIS store" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    expect((await hero.boundingBox())!.height).toBeGreaterThanOrEqual(viewport.height - 4);
    const image = hero.locator(".product__image");
    await expect(image).toHaveCSS("object-fit", "contain");
    expect((await image.boundingBox())!.width).toBeGreaterThan(viewport.width * .42);
    await expect(page.getByRole("heading", { name: "Built around the serving." })).toBeAttached();
    await expect(page.getByRole("heading", { name: "Product facts. Clearly presented." })).toBeAttached();
    await expect(page.getByRole("link", { name: "Discover NUKITIS Vanilla" })).toBeAttached();
    await page.screenshot({ path: testInfo.outputPath(`detail-chocolate-${viewport.width}.png`) });
  });
}
