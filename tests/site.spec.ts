import { expect, test } from "@playwright/test";

for (const width of [1920, 1440, 1024, 768, 430, 390, 375]) {
  test(`reference geometry and editorial media at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width >= 1024 ? 900 : width >= 768 ? 1024 : width === 375 ? 812 : width === 430 ? 932 : 844 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto("/");
    await expect(page.locator(".home-hero")).toBeVisible();
    await page.waitForTimeout(1400);
    const geometry = await page.evaluate(() => {
      const rect = (selector: string) => {
        const bounds = document.querySelector(selector)!.getBoundingClientRect();
        return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
      };
      return { hero: rect(".home-hero"), editorial: rect(".editorial"), heading: rect("#nutrition-title"), card: rect("#nutrition-track .content-card"), header: rect(".site-header"), logo: rect(".site-logo"), nav: rect(".desktop-nav"), viewport: window.innerWidth, width: document.documentElement.scrollWidth };
    });
    const viewportHeight = width >= 1024 ? 900 : width >= 768 ? 1024 : width === 375 ? 812 : width === 430 ? 932 : 844;
    const expectedHero = Math.max(width >= 1024 ? 650 : width >= 768 ? 620 : 600, viewportHeight);
    expect(geometry.hero.height).toBeCloseTo(expectedHero, 0);
    expect(geometry.editorial.y).toBeCloseTo(expectedHero, 0);
    expect(geometry.heading.x).toBe(width >= 1600 ? (width - 1472) / 2 : width >= 1024 ? 64 : width >= 768 ? 40 : 16);
    expect(geometry.width).toBeLessThanOrEqual(width);
    if (width >= 1024) {
      expect(geometry.logo.x + geometry.logo.width).toBeLessThanOrEqual(geometry.nav.x);
      const columns = width >= 1280 ? 4 : 3;
      expect(geometry.card.width).toBeCloseTo(((Math.min(width - 128, 1472)) - (columns - 1) * 24) / columns, 0);
      await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    } else {
      await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeHidden();
      if (width < 768) expect(geometry.logo.x + geometry.logo.width / 2).toBeCloseTo(width / 2, 0);
      else expect(geometry.logo.x).toBeLessThan(100);
    }
    await page.screenshot({ path: testInfo.outputPath(`homepage-${width}.png`) });
    for (const section of ["#nutrition", "#stories", "#events", "#training", "#performance", "#world", ".site-footer"]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    const broken = await page.locator("img").evaluateAll(images => images.filter(image => {
      const img = image as HTMLImageElement;
      return img.complete && img.naturalWidth === 0;
    }).map(image => image.getAttribute("src")));
    expect(broken).toEqual([]);
    expect(errors).toEqual([]);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: testInfo.outputPath(`homepage-full-${width}.png`), fullPage: true });
  });
}

test("menu traps focus, selects Vanilla, and returns focus after Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "NUKITIS navigation" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  expect(await menu.evaluate(dialog => dialog.contains(document.activeElement))).toBe(true);
  await page.waitForTimeout(350);
  await page.screenshot({ path: test.info().outputPath("mobile-menu.png") });
  await menu.getByRole("link", { name: "Vanilla Protein Shake", exact: true }).click();
  await expect(menu).not.toBeVisible();
  await expect(page.locator(".detail-hero")).toHaveAttribute("data-flavor", "vanilla");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("desktop dropdown, search, and original content details", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Nutrition", exact: true });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#nutrition-dropdown")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#nutrition-dropdown")).toBeHidden();
  await page.getByRole("button", { name: "Search NUKITIS" }).click();
  await page.getByRole("searchbox").fill("cycling");
  await expect(page.locator(".search-results")).toContainText("A different view from the saddle");
  await page.locator(".search-results").getByRole("button", { name: /A different view from the saddle/ }).click();
  await expect(page.getByRole("dialog", { name: "A different view from the saddle" })).toBeVisible();
  await expect(page.locator(".detail-body")).toContainText("A ride can be an adventure");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Search NUKITIS" })).toBeFocused();
  await page.getByRole("button", { name: "Search NUKITIS" }).click();
  await page.getByRole("searchbox").fill("<script>alert(1)</script>");
  await expect(page.locator(".search-results")).toContainText("No results yet");
});

test("rails, event tabs, and discovery pagination", async ({ page }) => {
  await page.goto("/");
  const stories = page.locator("#stories-track");
  await stories.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Next stories", exact: true }).click();
  await expect.poll(() => stories.evaluate(track => track.scrollLeft)).toBeGreaterThan(100);
  await stories.focus();
  await page.keyboard.press("Home");
  await expect.poll(() => stories.evaluate(track => track.scrollLeft)).toBeLessThan(2);
  await page.getByRole("tab", { name: "Past", exact: true }).click();
  await expect(page.locator("#events-track")).toContainText("Community moments");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Coming up" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#world-grid .content-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Load more" }).click();
  await expect(page.locator("#world-grid .content-card")).toHaveCount(16);
  await expect(page.getByRole("button", { name: "You're all caught up" })).toBeDisabled();
});

test("header remains fixed while scrolling; menus lock background scroll", async ({ page }) => {
  await page.goto("/");
  const header = page.locator(".site-header");
  const logo = page.locator(".site-logo");
  const logoAtTop = await logo.boundingBox();
  await page.evaluate(() => scrollTo({ top: 1000, behavior: "instant" }));
  await expect(header).toHaveClass(/is-scrolled/);
  await expect(header).toHaveCSS("position", "fixed");
  expect(await logo.boundingBox()).toEqual(logoAtTop);
  await expect(logo.locator("img")).toHaveCSS("opacity", "1");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(header).not.toHaveClass(/is-scrolled/);
  await page.getByRole("button", { name: "Open menu" }).click();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe("hidden");
});

test("video hero has autoplay safeguards and a reduced-motion poster", async ({ page }) => {
  await page.goto("/");
  const video = page.locator(".home-hero__video");
  await expect(page.locator(".home-hero__copy > *")).toHaveCount(2);
  await expect(page.locator(".home-hero__copy")).toHaveCSS("text-align", "left");
  await expect(page.locator(".home-hero").getByRole("link")).toHaveCount(0);
  await expect(video).toHaveAttribute("autoplay", "");
  await expect(video).toHaveAttribute("muted", "");
  await expect(video).toHaveAttribute("loop", "");
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).not.toHaveAttribute("controls", /.+/);
  await expect(video).toHaveCSS("pointer-events", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(video).toHaveCSS("display", "none");
  await expect(page.locator(".home-hero")).toHaveCSS("background-image", /hero-video-poster\.jpg/);
});

test("desktop rail drag scrolls without opening a story", async ({ page }) => {
  await page.goto("/");
  const track = page.locator("#stories-track");
  await track.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const box = (await track.boundingBox())!;
  const x = box.x + 500;
  const y = box.y + 120;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 180, y, { steps: 10 });
  await page.mouse.up();
  await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(50);
  await expect(page.locator("#content-detail")).not.toBeVisible();
});

test("mobile editorial rail swipes without opening a card", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  const track = page.locator("#stories-track");
  await track.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const box = (await track.boundingBox())!;
  const y = Math.round(box.y + 100);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 300, y }] });
  for (const x of [270, 230, 190, 150, 100]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
    await page.waitForTimeout(30);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(50);
  await expect(page.locator("#content-detail")).not.toBeVisible();
  await context.close();
});
