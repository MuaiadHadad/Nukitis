import { expect, test } from "@playwright/test";

test("homepage products route to the correct experience and history restores state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#nutrition-track").getByRole("link", { name: "Explore NUKITIS Chocolate" }).first().click();
  await expect(page).toHaveURL(/\/products\/chocolate$/);
  await expect(page.locator("body")).toHaveAttribute("data-page", "product");
  await expect(page.locator(".detail-hero")).toHaveAttribute("data-flavor", "chocolate");
  await page.getByRole("navigation", { name: "Choose a NUKITIS flavor" }).getByRole("link", { name: "Vanilla" }).click();
  await expect(page).toHaveURL(/\/products\/vanilla$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/products\/chocolate$/);
  await expect(page.locator(".detail-hero")).toHaveAttribute("data-flavor", "chocolate");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("body")).toHaveAttribute("data-page", "home");
});

test("direct Vanilla URL survives refresh", async ({ page }) => {
  await page.goto("/products/vanilla");
  await expect(page.locator(".detail-hero")).toHaveAttribute("data-flavor", "vanilla");
  await page.reload();
  await expect(page.locator(".detail-hero")).toHaveAttribute("data-flavor", "vanilla");
  await expect(page.getByRole("link", { name: "Shop Vanilla at the official NUKITIS store" })).toBeVisible();
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`next-flavor journey and browser history at ${viewport.width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto("/products/chocolate");
    const vanilla = page.getByRole("link", { name: "Discover NUKITIS Vanilla" });
    await vanilla.scrollIntoViewIfNeeded();
    await vanilla.click();
    await expect(page).toHaveURL(/\/products\/vanilla$/);
    const chocolate = page.getByRole("link", { name: "Discover NUKITIS Chocolate" });
    await chocolate.scrollIntoViewIfNeeded();
    await chocolate.click();
    await expect(page).toHaveURL(/\/products\/chocolate$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/products\/vanilla$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/products\/chocolate$/);
    expect(errors).toEqual([]);
  });
}
