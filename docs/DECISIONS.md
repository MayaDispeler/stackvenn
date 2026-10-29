# Decisions log

Newest first. Each entry: what was decided, why, and who decided.

## 2026-10-29: Merge policy, living docs, Node pin (Srihari)

**Merge policy.** Claude may merge code, design and infra PRs once CI is fully green and, for UI PRs, the Impeccable audit is clean. Content PRs (new or migrated articles) wait for Srihari. His own saves in the `/admin` writing desk count as approval; Claude's drafts still go through PRs. Recorded in CLAUDE.md.

**Living docs.** A decision that changes the plan updates the affected spec docs and `docs/TODO.md` in the same PR. Struck TODO items keep a one-line reason.

**Node pinned** to 22.23.4 in `.nvmrc`; `engines` requires ≥22.23.4; CI uses `node-version-file: .nvmrc`. TypeScript stays on 6.x.

## 2026-10-29: Phase 0 and Phase 1

**GitHub owner is `MayaDispeler`.** Repo: https://github.com/MayaDispeler/stackvenn (public). Chosen by Srihari when asked which of the two logged-in gh accounts to use.

**Notion signed image URLs stripped from `data/blog-posts.json` before the first commit.** The 2 AM posts embedded 6 pre-signed S3 URLs carrying temporary AWS credentials. The repo is public, so the query strings were removed. All 14 inline images (Notion, Unsplash, Pollinations) were downloaded while the URLs were still valid into `assets-staging/posts/<slug>/` with a `map.tsv` mapping file → original URL. They move to `src/assets/posts/<slug>/` in the migration PR. (Claude)

**Design-system addition: `--border-control`.** DESIGN_SYSTEM.md §2 requires input borders at 3:1 (WCAG 1.4.11), but `--border-strong` measures 1.71:1 (dark) and 1.73:1 (light). Every spec token is kept exactly; one token is added in the same warm hue for input and control outlines only: dark `#6D655A` (3.45:1 on bg), light `#8C8273` (3.39:1 on bg). `scripts/check-contrast.mjs` enforces it. Every other ratio in the spec was verified and is accurate. (Claude; Srihari can veto.)

**Pre-build critique fixes applied to DESIGN.md wireframes** (Impeccable critique, 29/40, `.impeccable/critique/`):
1. Masthead microcopy "12-min reads, weekly" dropped: it's a cadence/length promise the site can't back yet (Golden rule 2). "Start here" will list only posts that exist.
2. Header Subscribe uses the Primary (cream) style, never accent; the accent fill is reserved for the newsletter submit (one accent moment per region). On the home page the rail omits its newsletter block because the masthead carries one.
3. Guide layout: 3 columns at ≥1200px; 960–1199px is sidebar + content with the TOC as a collapsible bar; <960px sidebar in a disclosure. The sidebar is sticky but never scrolls on its own: only the active pillar is expanded (no nested scroll).
4. Header: full search field + 3-segment theme toggle at ≥1200px; below that, search is an icon and the theme toggle lives in the menu.
5. Reading-progress bar is fixed to the viewport top, so it doesn't move when the mobile header hides.

**Impeccable craft-floor defaults overridden by the pinned brief.** The craft floor bans eyebrows above headings and coloured side borders over 1px. DESIGN_SYSTEM.md pins the guide pillar eyebrow, the "2 AM" mono label, 3px callout borders and 2px active bars. The brief wins, as both the START_PROMPT and Impeccable say.

**Draft visibility.** `status: draft` is excluded from production builds. `review` and `approved` both ship, because the merge is the approval gate (AUTOPUBLISH=false). Drafts render in `astro dev` and when `SHOW_DRAFTS=true` (CI test builds). Layout fixtures (`fixture-*.mdx`) are permanent drafts.

**Toolchain pins.** TypeScript 6.x (not 7): `@astrojs/check` and `typescript-eslint` don't support TS 7 yet. Astro 7.4 requires Node ≥22.23.4. CI uses Node 22 latest. Locally a checksum-verified portable Node 22.23.4 was used, because the machine has 22.16 and no version manager. (Claude)

**Fonts** use the stable Astro font API with the `npm` provider (`@fontsource-variable/*` packages): self-hosted under `/_astro/fonts`, Latin + Latin-Ext, with Astro's generated metric-matched fallbacks.

**One raw-colour exception to Golden rule 10.** `<meta name="theme-color">` in `Head.astro` holds `#0a0a0a` / `#f7f2e8`, because meta tags can't read CSS variables. The values mirror `--bg`.

**URLs: no trailing slash.** Astro `trailingSlash: 'never'` + `build.format: 'file'`, and Workers static assets `html_handling: 'drop-trailing-slash'` redirects `/x/` → `/x`. `www.stackvenn.in` → apex needs the zone on Cloudflare (issue #2) and will be a zone Redirect Rule.

**UI UX Pro Max not installed yet.** CLAUDE.md names `uipro-cli`; its README says the package is now `ui-ux-pro-max-cli` and `uipro-cli` is stale. The installer was blocked by the local permission policy, so Srihari installs it with `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` then `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill`. It is reference-only, so nothing is blocked. Impeccable and frontend-design were already installed.

**iamsrihari.com repo access.** The repo is local at `Portfolio Pages/Portfolio` (remote MayaDispeler/Portfolio), so the Phase 0 "grant access" step needs no action.
