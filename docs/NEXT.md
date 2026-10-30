# Next: resume here

A fresh session should be able to continue from this file alone. Update it after every merged PR.
Brief in force: Srihari's message of 2026-10-30 ("Continue Stackvenn from where you stopped"), Steps 1–4 below.

## How to work

- Node: `export PATH="<kit>/.tools/node-v22.23.4-win-x64:$PATH"` (system Node is too old). `<kit>` is the folder above this repo.
- Code and docs PRs: merge on green CI and a clean Impeccable audit. Content PRs (`content/*`) wait for Srihari. Never touch `cms/*` PRs.
- Every PR: `npm run check` (includes `npm run slop`), docs and TODO.md updated in the same PR, then this file.
- Lighthouse and screenshots only for pages touched; full suite at the end of each phase.
- Preview: `bash <kit>/.tools/rebuild-preview.sh`, then the dev server from `<kit>/stackvenn-preview` on :4321 with `SHOW_DRAFTS=true`. Tests use :4322.
- After each merged PR, one short paragraph on issue #12: what changed, the localhost path, what waits on Srihari.

## Done

- Phases 0–1, most of Phase 2 (see TODO.md). Lighthouse 95+ on /, /life and a story (mobile, both themes).
- Step 1 (writing, not projects): PR #25 closed unmerged, branch deleted; project content removed from code and docs.
- ~~Explained pieces about Srihari's projects; repo READMEs linking to them.~~ Struck: Stackvenn is for his writing and ideas, not his projects.

## In progress

- Branch `fix/writing-not-projects`: Step 1 PR. Last step: edits made; next run checks, open PR, merge on green, comment on #12, push the matching change to #29 (`content/about-pages`).

## Next steps, in order

1. Step 2a: Explained heading anchors, prev/next within a path (`series` + `order`), "Helpful?" button (wired; sends nothing until PostHog exists).
2. Step 2b: image lightbox (keyboard, Esc closes, any library ≤ 5 KB).
3. Step 2c: Newsletter page (form posts to the Step 4 dry-run Worker), /experiment (build numbers only, "coming soon" otherwise), Terms index + term page, then a draft content PR with 5 terms (MCP, RAG, hybrid retrieval, LLM-as-judge, token budget) with `[[CONFIRM]]` on claims.
4. Step 2d: Phase 2 summary on #12 with screenshots (front page, a story, a Terms page; dark/light; desktop/mobile) and the Lighthouse table.
5. Step 3 (Phase 3, no DNS): full RSS + JSON Feed + autodiscovery, llms.txt + llms-full.txt (published only); SEO build checks; JSON-LD on every page type + CI validator; OG images per story and section; PostHog (cookieless, proxy Worker, preview excluded, "Stackvenn Reach" dashboard); Cloudflare go-live script with dry-run, not run until #2.
6. Step 4 (Phase 4, no DNS): newsletter Worker + D1 + Turnstile in dry-run (logs instead of sending); wire the front page and newsletter forms.

## Waiting on Srihari

- Content PRs: #16 (2 AM + book), #17 (Medium; he reviews the 12 interpreted sentences himself), #29 (bio + /about).
- #30 (GitHub OAuth app for /admin), #2 (DNS), and the rest of the #12 checklist.
