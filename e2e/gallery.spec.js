import { test, expect } from "@playwright/test";

test.describe("Gallery Application", () => {
  test("root URL redirects to /images", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/images/);
  });

  test("gallery page loads and displays images", async ({ page }) => {
    await page.goto("/images");

    // Should show wastepaperbasket branding
    await expect(page.locator("text=wastepaperbasket")).toBeVisible();

    // Should have image links to detail pages
    const imageLinks = page.locator('a[href^="/images/"]');
    await expect(imageLinks.first()).toBeVisible({ timeout: 10000 });

    const count = await imageLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("clicking an image navigates to detail view", async ({ page }) => {
    await page.goto("/images");

    // Wait for images to load
    const imageLinks = page.locator('a[href^="/images/"]');
    await expect(imageLinks.first()).toBeVisible({ timeout: 10000 });

    // Get the first image link href
    const firstHref = await imageLinks.first().getAttribute("href");
    expect(firstHref).toBeTruthy();

    // Click the first image
    await imageLinks.first().click();

    // Should navigate to the detail page
    await expect(page).toHaveURL(firstHref);

    // Should show the full image
    const mainImage = page.locator("main img");
    await expect(mainImage).toBeVisible();
  });

  test("detail page shows next navigation link", async ({ page }) => {
    await page.goto("/images");

    // Get the first image link and navigate to it
    const imageLinks = page.locator('a[href^="/images/"]');
    await expect(imageLinks.first()).toBeVisible({ timeout: 10000 });
    await imageLinks.first().click();

    // First image should have a next link but no prev link
    const nextLink = page.locator("#next-link");
    await expect(nextLink).toBeVisible();

    // prev link should not exist (first image)
    const prevLink = page.locator("#prev-link");
    await expect(prevLink).toHaveCount(0);
  });

  test("prev/next navigation works on detail page", async ({ page }) => {
    await page.goto("/images");

    // Navigate to first image
    const imageLinks = page.locator('a[href^="/images/"]');
    await expect(imageLinks.first()).toBeVisible({ timeout: 10000 });
    await imageLinks.first().click();

    const firstUrl = page.url();

    // Click next
    const nextLink = page.locator("#next-link");
    await expect(nextLink).toBeVisible();
    await nextLink.click();

    // URL should change
    await expect(page).not.toHaveURL(firstUrl);

    // Now we should have a prev link
    const prevLink = page.locator("#prev-link");
    await expect(prevLink).toBeVisible();

    // Click prev to go back
    await prevLink.click();
    await expect(page).toHaveURL(firstUrl);
  });

  test("keyboard arrow navigation works", async ({ page }) => {
    await page.goto("/images");

    // Navigate to first image
    const imageLinks = page.locator('a[href^="/images/"]');
    await expect(imageLinks.first()).toBeVisible({ timeout: 10000 });
    await imageLinks.first().click();

    // Wait for the page to be fully loaded
    await expect(page.locator("#next-link")).toBeVisible();
    const firstUrl = page.url();

    // Press right arrow to go to next image
    await page.keyboard.press("ArrowRight");

    // URL should change to next image
    await expect(page).not.toHaveURL(firstUrl);

    // Press left arrow to go back
    await page.keyboard.press("ArrowLeft");

    // Should be back to first image
    await expect(page).toHaveURL(firstUrl);
  });

  test("gallery works without JavaScript", async ({ browser }) => {
    // Create a context with JS disabled
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    // Gallery page loads
    await page.goto("/images");
    const imageLinks = page.locator('a[href^="/images/"]');
    await expect(imageLinks.first()).toBeVisible({ timeout: 10000 });

    // Navigate to detail page via click
    await imageLinks.first().click();
    await expect(page).toHaveURL(/\/images\/.+/);

    // Main image should be visible
    const mainImage = page.locator("main img");
    await expect(mainImage).toBeVisible();

    // Next link should work (it's a plain <a> tag)
    const nextLink = page.locator("#next-link");
    if ((await nextLink.count()) > 0) {
      await nextLink.click();
      // Should navigate to a different image
      await expect(page.locator("main img")).toBeVisible();
    }

    await context.close();
  });
});
