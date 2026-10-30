// Image lightbox: an article image opens in a native <dialog> with Enter, Esc closes it,
// and focus goes back to the image.
import { expect, test, type Page } from '@playwright/test';

const FIXTURE = '/work/fixture-typography';

async function openAndClose(page: Page) {
  const img = page.locator('.prose img[data-lightbox]').first();
  await expect(img).toHaveAttribute('role', 'button');
  await expect(img).toHaveAttribute('aria-label', /^Enlarge image: /);
  await img.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('#lightbox');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close image' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  expect(await img.evaluate((el) => el === document.activeElement)).toBe(true);
}

test('fixture story image opens with Enter, closes with Esc, focus returns', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(FIXTURE);
  await page.waitForLoadState('load');
  const count = await page.locator('.prose img').count();
  test.skip(
    count === 0,
    `${FIXTURE} has no images in .prose yet; covered by the injected test below`,
  );
  await openAndClose(page);
  expect(errors).toEqual([]);
});

// No story has an image yet, so this test injects a captioned figure into the fixture's HTML
// (as rehype-figure would emit it) before the page's script runs.
test('injected figure: Enter opens with caption, Esc closes, backdrop click closes', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(`**${FIXTURE}`, async (route) => {
    const res = await route.fetch();
    const html = (await res.text()).replace(
      /(<div class="prose[^"]*"[^>]*>)/,
      '$1<figure><img src="/favicon.svg" alt="Test diagram" width="64" height="64"><figcaption>Test caption</figcaption></figure>',
    );
    await route.fulfill({ response: res, body: html });
  });
  await page.goto(FIXTURE);
  await page.waitForLoadState('load');
  await expect(page.locator('.prose img')).toHaveCount(1);
  await openAndClose(page);

  const img = page.locator('.prose img[data-lightbox]').first();
  await img.press('Enter');
  const dialog = page.locator('#lightbox');
  await expect(dialog.locator('figcaption')).toHaveText('Test caption');
  await expect(dialog.locator('img')).toHaveAttribute('alt', 'Test diagram');
  await page.mouse.click(5, 300);
  await expect(dialog).toBeHidden();
  expect(errors).toEqual([]);
});
