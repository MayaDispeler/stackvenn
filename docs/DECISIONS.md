# Decisions log

Newest first. Each entry: what was decided, why, and who decided.

## 2026-10-30: Writing and ideas, not projects (Srihari)

**Rule:** Stackvenn is a publication for Srihari's writing and ideas, not a showcase of his projects. No project pages, no project Explained pieces, no "Open-source work" on the author page, no links from his repos' READMEs, and the ideas pipeline never reads his code repos.

**What stays:** the Explained format, for explaining topics and ideas. GitHub stays as a profile link under contact. No Amazon author page exists, so it is not in `sameAs`.

**Done:** PR #25 (an Explained piece about one of his projects) closed unmerged and its branch deleted; project mentions removed from code, docs and tests.

## 2026-10-30: Writing desk is Decap CMS (Claude, per Srihari's brief)

**Choice:** Decap CMS 3.16.3, loaded from unpkg with a Subresource Integrity hash, GitHub backend, `publish_mode: editorial_workflow`. Each save opens a draft pull request; the board moves it Draft → In review → Ready; Publish merges it. Srihari's Publish is his approval.

**Why not Sveltia CMS (yet):** it is lighter and better on phones, but its editorial workflow was reported as single-branch in March 2026, and the maintainer's later "feature complete" note has no date. Re-check before launch (TODO).

**Pinned to 3.16.3,** five weeks old: 3.17.2 and 3.17.3 were four days old when chosen.

**Login:** GitHub OAuth through `/api/auth` and `/api/callback` on our own edge Worker (no third-party auth service). Random state cookie, `public_repo` scope, token posted only to the same origin. Needs a GitHub OAuth app (issue #30).

**His words stay his:** the desk writes `written_by: srihari`; the slop check skips those stories.

## 2026-10-30: Preview hosts are never indexed (Srihari)

**Rule:** every host except `stackvenn.in` serves `X-Robots-Tag: noindex, nofollow` on every page and a disallow-all `robots.txt`. Production on `stackvenn.in` stays indexable.

**How:** a small edge Worker (`worker/index.js`) sits in front of the static assets. It decides by request hostname, so it also covers `*.workers.dev`, `wrangler dev`, `www.stackvenn.in` before its redirect, and any host added later. A build-time flag could not do this, because once the domain is attached the same deployment answers on both hosts. `run_worker_first` routes only pages and `robots.txt` through it; `/_astro/*`, `/pagefind/*` and the favicon skip it and stay free. Unit tests cover both cases (`npm run test:unit`, in CI).

**Cost:** page views now count as Worker requests (Workers Free: 100,000 a day). Hashed assets do not. Recorded in COSTS.md; the weekly cost check will watch it.

## 2026-10-29: No AI slop (Srihari asked; Claude chose the tools)

**Skills:** [blader/humanizer](https://github.com/blader/humanizer) (MIT, about 62k stars; 26 patterns from Wikipedia's "Signs of AI writing"; keeps meaning and voice, never adds facts) for the editing pass, and [hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop) (MIT, about 18k stars; drafting rules plus a 50-point score) for drafting. Vendored into `.claude/skills/` at pinned commits so every session and every GitHub Actions run uses the same version. Copied instead of run through `npx skills add`: the README supports copying SKILL.md, and it avoids executing an installer.

**Not chosen:** "No AI Slop" (new, little track record) and `unslop` (aimed at config files, not prose). A third overlapping skill would make it unclear which one fires.

**Enforcement:** `scripts/check-slop.mjs` runs in `npm run check` and CI. It fails on strong tells in Claude-written text, warns on weak ones, and self-tests every run.

**Scope:** Srihari's own words (migrated bodies, his `/admin` saves) are exempt; his voice and dashes stay. Humanizer's voice rule beats stop-slop's absolutes; VOICE.md will beat both.

## 2026-10-29: Editorial model, a publication rather than a blog (Srihari)

**The bar** is Medium, The Hindu, The Economic Times and Deccan Chronicle. "Essays", "Guides" and "Notes" are removed from the UI, URLs and docs.

**Sections are the navigation:** AI · Engineering · Careers · Work · Life · Society. Pillar mapping: agentic/retrieval/evals/cost → AI or Engineering (per story); shipping → Work; careers/work/life/society unchanged.

**Formats are kickers, never nav:** Explained (old guides, docs layout), Analysis, Opinion, Column (first: "2 AM"), Brief (old notes), Terms (old glossary), Tools.

**URLs, permanent from today:** `/<section>/<slug>` for every story, `/explained` hub, `/columns/2-am`, `/terms/<slug>`, `/tools/<slug>`, `/author/srihari-venkatesan`, section pagination at `/<section>/page/<n>`. Slugs are unique site-wide; `page`, `index`, `rss` and `feed` are reserved. All 19 new article URLs are in MIGRATION §1.

**Schema:** `title` → `headline`, `dek` → `standfirst`, `type` → `format`, `pillar` → `section`, `series: 2-am` → `column: 2-am`. Added `kicker` (override), `summary` ("Explained in 60 seconds", required for Explained), `dateline`, `cover_credit`. Stories live in `src/content/stories/`, terms in `terms/`, tools in `tools/`.

**Structured data:** Explained → TechArticle; Analysis → AnalysisNewsArticle; Opinion and Column → OpinionNewsArticle; Brief → BlogPosting. The Person entity moved to `/author/srihari-venkatesan#person`.

**iamsrihari.com 301s (Claude, from checking that repo):** no article ever had a page there (the current site links out or opens 2 AM pieces in an in-page reader; an old `/blog/<slug>` route held one internal draft). So the "301 map" is defensive: `/writing/<slug>` and `/blog/<slug>` for the 19 slugs → their new URLs.

**Formats for migrated stories are proposals** (MIGRATION §1: the three 2 AM pieces are Column; "9.2% If You Stay" and "Why AI is Not Free" are Analysis; the rest Opinion). Each migration PR confirms them.

**Lead story has no card surface** (supersedes DESIGN_SYSTEM's "Featured card"): "no cards-in-grids look; rules and type do the work."

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
