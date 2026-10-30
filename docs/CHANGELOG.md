# Changelog

## 2026-10-30: Author page, corrections

- Author page with portrait, line, dateline, sections, work and education timelines, book, open-source work, every story (paginated), copyable email, ProfilePage + Person JSON-LD.
- `/about/srihari` 301s to the author page.
- Schema field `corrections`, rendered as "Correction, <date>: …".

## 2026-10-30: Drawer, footer, 404, column page

- Mobile menu is a native dialog drawer: sections, Explained, 2 AM, author, theme, Subscribe; focus trapped, Esc closes.
- Footer: sections, more (Explained, 2 AM column, author), follow (newsletter, RSS, iamsrihari.com).
- 404 with inline search and five stories.
- 2 AM column page with its own masthead and CreativeWorkSeries JSON-LD.

## 2026-10-30: Search

- Ctrl/Cmd+K or `/` opens search (native dialog: focus trapped and restored, Esc closes).
- Pagefind indexes story bodies only, with section and format filters; results grouped by format; arrow keys; recent searches.
- `/search?q=` works as a page and without JavaScript; it is noindex.

## 2026-10-30: Explained page

- Copy Markdown and Open in (ChatGPT, Claude, Perplexity, View as Markdown) on every Explained piece.
- `/<section>/<slug>.md`: a clean Markdown twin of every story.
- MDX components: `Steps` and `Callout` (Note, Tip, Warning, Danger).
- Edit on GitHub links to the real file (.md or .mdx).

## 2026-10-30: Section fronts

- All six sections: large title, description, lead story, paginated list (`/<section>/page/<n>`), CollectionPage JSON-LD, designed empty state.
- Fixed a missing space in the lead story meta line (front page too).

## 2026-10-30: Story page

- Byline with avatar, share row (top and end), figures with captions, sidenotes at ≥1200px, author box, comments placeholder, More in <Section>, Editor's picks.
- Dates use fixed three-letter months ("1 Sep 2025").
- Added @astrojs/markdown-remark so rehype plugins run under Astro 7.

## 2026-10-30: Preview safety

- Edge Worker marks every host except stackvenn.in as noindex, nofollow and serves a disallow-all robots.txt there.
- Production robots.txt added (Content Signals follow in Phase 3).
- Unit tests for the Worker run in CI.

## 2026-10-29: No AI slop

- Vendored the humanizer and stop-slop skills (`.claude/skills/`, pinned in VENDORED.md).
- `npm run slop`: self-testing check for strong AI-writing tells and retired vocabulary, part of `npm run check`.
- 2 AM column description no longer says "Essays".

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
