# Next: resume here

A fresh session should be able to continue from this file alone. Update it after every merged PR.

## Priority (Srihari, 2026-10-30)

Product first. Srihari is travelling and reviews the UI meanwhile. Marketing, reachability (Phase 3), the newsletter Worker (Phase 4) and automation (Phase 6) resume on **Tuesday 3 Nov 2026**. Until then, only product fixes he asks for.

## How to work

- Node: `export PATH="<kit>/.tools/node-v22.23.4-win-x64:$PATH"` (system Node is too old). `<kit>` is the folder above this repo.
- Code and docs PRs: merge on green CI and a clean Impeccable audit. Content PRs (`content/*`) wait for Srihari. Never touch `cms/*` PRs.
- Every PR: `npm run check` (includes `npm run slop`), docs and TODO.md updated in the same PR, then this file.
- Lighthouse and screenshots only for pages touched; full suite at the end of each phase.
- Preview: `bash scripts/rebuild-preview.sh` (expects the `preview` worktree at `<kit>/stackvenn-preview`: `git worktree add ../stackvenn-preview preview`), then `SHOW_DRAFTS=true npx astro dev --port 4321` from `<kit>/stackvenn-preview`. Tests use :4322.
- Deployed preview (main only, noindex): https://stackvenn.ksvhari007.workers.dev (`npm run deploy`).
- After each merged PR, one short paragraph on issue #12: what changed, the localhost path, what waits on Srihari.

## Done (2026-10-30)

- Phases 0–1. Phase 2 product pages: front page, section fronts, story, Explained (anchors, path pager, Helpful?), column, author, search, 404, book (in #16), newsletter, /experiment, Terms index + term page, image lightbox, /admin desk.
- Step 1, writing not projects (#33): PR #25 closed unmerged; project content removed everywhere.
- ~~Explained pieces about Srihari's projects; repo READMEs linking to them.~~ Struck: Stackvenn is for his writing and ideas, not his projects.

## In progress

- Nothing on a branch. Waiting for Srihari's UI feedback.

## Next steps, in order (from Tue 3 Nov)

1. Apply any UI changes Srihari asks for.
2. Phase 2 leftovers: tool page shell, tabs and footnote styling, Explained Paths view + changelog (need a first series). Phase 2 summary on #12 with screenshots (front page, a story, a Terms page; dark/light; desktop/mobile) and Lighthouse for /terms, /newsletter, /experiment.
3. Phase 3 (no DNS): full RSS + JSON Feed + autodiscovery, llms.txt + llms-full.txt (published only); SEO build checks; JSON-LD on every page type + CI validator; OG images per story and section; PostHog (cookieless, proxy Worker, preview excluded, "Stackvenn Reach" dashboard; `src/lib/analytics.ts` `track()` is the hook); Cloudflare go-live script with dry-run, not run until #2.
4. Phase 4 (no DNS): newsletter Worker + D1 + Turnstile in dry-run at `/api/subscribe` (the /newsletter form already posts there); wire the front-page form.

## Waiting on Srihari (ordered by what it unblocks)

1. #2 DNS for stackvenn.in: unblocks go-live, custom domain, Search Console.
2. Content PRs #16 (2 AM + book), #17 (Medium; he checks the 12 interpreted sentences), #29 (bio + /about), #38 (5 starter terms, `[[CONFIRM]]` marks): unblocks a populated site, /experiment counts, Terms.
3. #30 GitHub OAuth app: unblocks /admin login.
4. #6 Giscus, #8 portrait, the rest of the #12 checklist.
