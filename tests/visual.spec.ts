// Screenshots every template at every width in both themes (CLAUDE.md "How to work"),
// and fails on horizontal page scroll, nested scroll areas or console errors.
import { expect, test } from '@playwright/test';
import { PAGES, THEMES, WIDTHS } from './pages';

for (const page of PAGES) {
  for (const theme of THEMES) {
    for (const width of WIDTHS) {
      test(`${page.name} · ${theme} · ${width}px`, async ({ page: p }) => {
        const errors: string[] = [];
        p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
        p.on('pageerror', (e) => errors.push(e.message));

        await p.addInitScript((t) => localStorage.setItem('theme', t), theme);
        await p.setViewportSize({ width, height: 900 });
        const res = await p.goto(page.path);
        if (page.name !== '404') expect(res?.status()).toBe(200);
        await p.waitForLoadState('load');
        await p.evaluate(() => document.fonts.ready);

        await expect(p.locator('html')).toHaveAttribute('data-theme', theme);

        const overflow = await p.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, 'no horizontal page scroll').toBeLessThanOrEqual(0);

        // Only code blocks and tables may scroll inside themselves.
        const nested = await p.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>('body *')]
            .filter((el) => {
              const s = getComputedStyle(el);
              const scrolls =
                (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) ||
                (/(auto|scroll)/.test(s.overflowX) && el.scrollWidth > el.clientWidth + 1);
              return scrolls && !el.closest('pre, table, .expressive-code');
            })
            .map((el) => el.tagName + (el.className ? `.${el.className}` : '')),
        );
        expect(nested, 'no nested scroll areas').toEqual([]);

        await p.screenshot({
          path: `tests/screenshots/__output__/${page.name}-${theme}-${width}.png`,
          fullPage: true,
        });
        expect(errors, 'no console errors').toEqual([]);
      });
    }
  }
}
