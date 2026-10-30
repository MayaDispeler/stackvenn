// Lighthouse, mobile, both themes (TODO Phase 2, end-of-phase check; CLAUDE.md asks for 95+ in all four).
//   node scripts/lighthouse.mjs <base-url> [path ...]
// Theme: the site follows the system colour scheme by default, so Chromium is told which one to prefer.
// Reports land in lighthouse-results/ (git-ignored). Exits 1 if any score is under 95.
import fs from 'node:fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';

// --draft=<path> marks a page that is a draft on purpose: its intended noindex is not scored (is-crawlable skipped).
const args = process.argv.slice(2);
const DRAFTS = new Set(args.filter((a) => a.startsWith('--draft=')).map((a) => a.slice(8)));
const [base = 'http://localhost:4322', ...paths] = args.filter((a) => !a.startsWith('--'));
const PATHS = paths.length ? paths : ['/'];
const THEMES = { dark: 0, light: 1 }; // blink PreferredColorScheme: kDark = 0, kLight = 1
const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];
const MIN = 95;

fs.mkdirSync('lighthouse-results', { recursive: true });
const rows = [];
let failed = false;

for (const [theme, scheme] of Object.entries(THEMES)) {
  const chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', `--blink-settings=preferredColorScheme=${scheme}`],
  });
  try {
    for (const path of PATHS) {
      const result = await lighthouse(`${base}${path}`, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: CATS,
        ...(DRAFTS.has(path) ? { skipAudits: ['is-crawlable'] } : {}),
      });
      const lhr = result.lhr;
      const scores = Object.fromEntries(
        CATS.map((c) => [c, Math.round((lhr.categories[c]?.score ?? 0) * 100)]),
      );
      const name = `${path.replace(/\W+/g, '_') || 'home'}-${theme}`;
      fs.writeFileSync(`lighthouse-results/${name}.json`, result.report);
      rows.push({
        path,
        theme,
        ...scores,
        lcp: lhr.audits['largest-contentful-paint']?.displayValue,
        cls: lhr.audits['cumulative-layout-shift']?.displayValue,
      });
      if (Object.values(scores).some((s) => s < MIN)) failed = true;
    }
  } finally {
    await chrome.kill();
  }
}

console.log('\n| Page | Theme | Perf | A11y | Best | SEO | LCP | CLS |');
console.log('|---|---|---|---|---|---|---|---|');
for (const r of rows) {
  const mark = (n) => (n < MIN ? `**${n}**` : String(n));
  console.log(
    `| ${r.path}${DRAFTS.has(r.path) ? ' (draft)' : ''} | ${r.theme} | ${mark(r.performance)} | ${mark(r.accessibility)} | ${mark(r['best-practices'])} | ${mark(r.seo)} | ${r.lcp} | ${r.cls} |`,
  );
}
if (failed) {
  console.error(`\nAt least one score is under ${MIN}. Reports: lighthouse-results/`);
  process.exit(1);
}
