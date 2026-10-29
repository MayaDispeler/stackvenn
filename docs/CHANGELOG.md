# Changelog

## 2026-10-29: Phase 1 foundation

- Astro 7.4 + TypeScript strict(est) + MDX + sitemap + Expressive Code; ESLint (with jsx-a11y), Prettier, `astro check`.
- `src/styles/tokens.css`: both themes exactly as DESIGN_SYSTEM.md §2, plus `--border-control` (see DECISIONS). No-flash theme script with Dark / Light / System.
- `scripts/check-contrast.mjs`: 40 token-pair checks parsed from tokens.css, run in `npm run check` and CI.
- Self-hosted Schibsted Grotesk, Newsreader and JetBrains Mono through the Astro font API with metric-matched fallbacks.
- Content collection with the PRD §9 zod schema; invalid frontmatter fails the build (dek 120–160, self canonical, guide-only level, cover alt text, type/folder match).
- Layouts: Shell, Page, List, Essay, Guide. Header, footer, theme toggle, Venn mark, overlap chip.
- Wrangler config (Workers static assets, no trailing slash, real 404); preview live at https://stackvenn.ksvhari007.workers.dev.
- Playwright suite: 4 templates × 5 widths × 2 themes, failing on horizontal scroll, nested scroll areas and console errors; axe WCAG 2.2 AA in both themes. CI workflow runs all of it.

## 2026-10-29: Phase 0

- Public repo created, Discussions enabled, 11 `human` issues + the pinned "Srihari: one-time setup" checklist (#12).
