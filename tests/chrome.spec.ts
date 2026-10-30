// Site chrome: the mobile menu drawer opens as a modal, keeps focus inside, and closes on Esc.
import { expect, test } from '@playwright/test';

test('mobile drawer opens, traps focus, closes on Esc', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('load');
  const button = page.locator('[data-drawer-open]');
  await button.click();
  const drawer = page.locator('#site-drawer');
  await expect(drawer).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer.getByRole('link', { name: 'Careers' })).toBeVisible();
  for (let i = 0; i < 25; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('#site-drawer'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('404 offers search and stories', async ({ page }) => {
  await page.goto('/404');
  await expect(page.locator('#search-page [data-search-input]')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'That page moved or never existed.' }),
  ).toBeVisible();
});
