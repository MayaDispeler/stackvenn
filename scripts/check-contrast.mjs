// Fails CI when a token pair drops below its DESIGN_SYSTEM.md §2 threshold.
// Reads src/styles/tokens.css directly, so the check always tests what ships.
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Selector not found: ${selector}`);
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
  );
}

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, minimum, why]
const pairs = [
  ['text', 'bg', 7, 'body text'],
  ['text', 'surface', 7, 'body text'],
  ['text-soft', 'bg', 7, 'article body'],
  ['text-soft', 'surface', 7, 'article body'],
  ['text-muted', 'bg', 4.5, 'meta'],
  ['text-muted', 'surface', 4.5, 'meta'],
  ['text-muted', 'raised', 4.5, 'meta'],
  ['accent-text', 'bg', 4.5, 'links'],
  ['accent-text', 'surface', 4.5, 'links'],
  ['accent-text', 'raised', 4.5, 'links'],
  ['on-accent', 'accent', 4.5, 'accent button label'],
  ['bg', 'text', 7, 'primary button label'],
  ['focus', 'bg', 3, 'focus ring'],
  ['border-control', 'bg', 3, 'input outline (WCAG 1.4.11)'],
  ['border-control', 'surface', 3, 'input outline (WCAG 1.4.11)'],
  ['border-control', 'raised', 3, 'input outline (WCAG 1.4.11)'],
  ['accent', 'bg', 3, 'accent marks and large text'],
  ['success', 'bg', 4.5, 'status'],
  ['warning', 'bg', 4.5, 'status'],
  ['info', 'bg', 4.5, 'status'],
];

const themes = {
  dark: block(":root[data-theme='dark']"),
  light: block(":root[data-theme='light']"),
};

let failures = 0;
for (const [name, t] of Object.entries(themes)) {
  for (const [fg, bg, min, why] of pairs) {
    if (!t[fg] || !t[bg]) {
      console.error(`✗ ${name}: missing token --${fg} or --${bg}`);
      failures++;
      continue;
    }
    const r = ratio(t[fg], t[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      `${ok ? '✓' : '✗'} ${name.padEnd(5)} --${fg} on --${bg}: ${r.toFixed(2)}:1 (min ${min}, ${why})`,
    );
  }
}

if (failures) {
  console.error(`\n${failures} contrast check(s) failed.`);
  process.exit(1);
}
console.log('\nAll contrast checks passed.');
