// Search: Ctrl/Cmd+K opens the modal, results come from the Pagefind index, Esc closes it,
// and /search?q= works as a page. Needs a full `npm run build` (Pagefind runs after Astro).
import { expect, test } from '@playwright/test';

test('Ctrl+K opens search, finds a story, Esc closes and restores focus', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('load');
  await page.keyboard.press('Control+k');
  const dialog = page.locator('#search-dialog');
  await expect(dialog).toBeVisible();
  const input = dialog.locator('[data-search-input]');
  await expect(input).toBeFocused();

  await input.fill('fixture');
  const hit = dialog.locator('[data-hit]').first();
  await expect(hit).toBeVisible();
  await expect(hit).toHaveAttribute('href', /^\/[a-z]+\/fixture-/);

  await page.keyboard.press('ArrowDown');
  await expect(hit).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('no match shows the plain-language empty state', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('load');
  await page.keyboard.press('Control+k');
  await page.locator('#search-dialog [data-search-input]').fill('zzqqxxnomatch');
  await expect(page.locator('#search-dialog .note')).toContainText('No match for');
});

test('/search?q= renders results as a page', async ({ page }) => {
  await page.goto('/search?q=fixture');
  await expect(page.locator('#search-page [data-hit]').first()).toBeVisible();
});

test('the header search link opens the modal instead of navigating', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('load');
  await page.locator('header [data-search-open]').click();
  await expect(page.locator('#search-dialog')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});
