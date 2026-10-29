// axe accessibility run (WCAG 2.2 AA) on every template, in both themes, desktop and mobile.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { PAGES, THEMES } from './pages';

for (const page of PAGES) {
  for (const theme of THEMES) {
    for (const width of [390, 1280]) {
      test(`axe: ${page.name} · ${theme} · ${width}px`, async ({ page: p }) => {
        await p.addInitScript((t) => localStorage.setItem('theme', t), theme);
        await p.setViewportSize({ width, height: 900 });
        await p.goto(page.path);
        const results = await new AxeBuilder({ page: p })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const summary = results.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
        );
        expect(summary).toEqual([]);
      });
    }
  }
}
