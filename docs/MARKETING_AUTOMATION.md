# Marketing Automation — distribution that runs itself (instructions for Claude)

Principle: **write once, publish on stackvenn.in, then distribute everywhere the readers already are, with each channel getting copy written for it.**
Everything runs in GitHub Actions (free for public repos) using `anthropics/claude-code-action@v1` with `claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}`.

---

## 1. Channels (zero-cost only)

| Channel | How | Cost | Notes |
|---|---|---|---|
| stackvenn.in | Git merge → deploy | Free | Source of truth |
| RSS + JSON Feed | Built at deploy | Free | Full content |
| Email newsletter | Worker + D1 list, Resend send | Free tier (check limits) | Double opt-in, List-Unsubscribe header |
| dev.to | Articles API, `canonical_url` | Free | Syndicate 3–7 days after publishing |
| Hashnode | GraphQL API, `originalArticleURL` | Free | Same delay |
| LinkedIn | Posts API ("Share on LinkedIn" product, `w_member_social`) | Free | Access tokens expire (about 60 days); the workflow opens a `human` re-auth issue 7 days before |
| Bluesky | AT Protocol, app password | Free | Link card via embed |
| Mastodon | API token (e.g. on fosstodon.org or hachyderm.io, following the server's rules) | Free | |
| Threads | Threads API (long-lived token, refreshable) | Free | Refresh the token automatically |
| X / Twitter | **No free API tier any more** (pay-per-use; posts with links cost more) | Paid | Skip automation. The share copy goes in the weekly issue for optional manual posting |
| Medium | API is deprecated for new integrations | — | Not used for new posts. Old stories stay; optional canonical fix in REACHABILITY §8 |
| Reddit / Hacker News | No automation | — | Claude drafts only; Srihari decides |

Verify each API's current terms and limits when implementing, and record them in `docs/COSTS.md`.

---

## 2. Secrets (GitHub Actions)

`CLAUDE_CODE_OAUTH_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `POSTHOG_API_KEY` (personal, read-only), `POSTHOG_PROJECT_ID`, `GSC_SA_KEY`, `BING_API_KEY`, `INDEXNOW_KEY`, `DEVTO_API_KEY`, `HASHNODE_TOKEN`, `HASHNODE_PUBLICATION_ID`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN`, `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD`, `MASTODON_INSTANCE`, `MASTODON_TOKEN`, `THREADS_TOKEN`, `THREADS_USER_ID`, `RESEND_API_KEY`.

Any missing secret means that channel is skipped with a warning, never a failed run.

---

## 3. Pipelines (`.github/workflows/`)

### 3.1 `ideas.yml`: weekly idea pipeline (Mon 06:00 IST, cron `30 0 * * 1`)
Claude:
1. Reads GSC queries with impressions but no matching post, PostHog search terms with no results, open `idea` issues, and Srihari's repos' recent commits and READMEs (his real work is the best source).
2. Scores ideas: search demand × Srihari's first-hand experience × gap vs existing results.
3. Opens up to **2 draft PRs** in `content/` with `status: review`. Each PR includes:
   - the full draft in Srihari's voice (learn the voice from `content/essays/*` and keep `docs/VOICE.md` updated);
   - a brief (target query, reader, promise, sources);
   - a `distribution/<slug>.md` file with per-channel copy;
   - a checklist of claims that need Srihari's confirmation, marked `[[CONFIRM: …]]`.
4. Never fabricates experience. If a draft needs a story or number only Srihari has, it asks in the PR instead of inventing it.

### 3.2 Editorial quality gate (runs on every content PR)
Fail the check if any of these is true:
- No first-hand element (code, data, decision, failure, or Srihari's experience).
- A number without a source, or an unresolved `[[CONFIRM]]`.
- Banned phrases: "in today's fast-paced world", "delve", "unlock", "game-changer", "it's important to note", "in conclusion", "revolutionize", "leverage" (as a verb).
- Readability: average sentence length over 22 words, or paragraphs over 5 sentences.
- Missing dek, sources, internal links, or alt text.
Claude also posts a review comment with a 1–10 usefulness score and the 3 biggest improvements.

### 3.3 `deploy.yml`: on push to `main`
Build → Pagefind → Lighthouse CI budgets → deploy to Cloudflare → submit sitemap (GSC API) → IndexNow ping for changed URLs → purge cache for changed paths → trigger `distribute.yml` for newly published slugs.

### 3.4 `distribute.yml`: staggered, idempotent
State lives in `data/distribution.json` (slug → channel → {id, url, postedAt}). The workflow never posts twice.

| When (after publish) | Action |
|---|---|
| +0h | Newsletter "new post" goes out only if the post is marked `newsletter: instant`; otherwise it waits for the weekly digest |
| +1h | LinkedIn post: hook line, 3 takeaways as short lines, link, 3 hashtags max |
| +2h | Bluesky and Mastodon: 1–2 sentence hook + link card |
| +4h | Threads post |
| +3 days | dev.to and Hashnode copies with canonical URL, the original's title, and a "Originally published on Stackvenn" footer |
| +7 days | Second LinkedIn angle (a different takeaway, no link in the body; link in the first comment if the API allows, otherwise in the body) |
| +30 / +90 days | Evergreen resurfacing on Bluesky, Mastodon and Threads, for guides only |

Per-channel copy rules:
- Write native copy for each channel; never paste the same text everywhere.
- No engagement bait ("Comment YES"), no tagging people who aren't involved, at most 3 hashtags.
- Always include `?utm_source=<channel>&utm_medium=social&utm_campaign=<slug>` on links (not on syndicated canonical links).
- Respect rate limits; back off on 429 errors; retry at most twice, then open a `human` issue.

### 3.5 `newsletter.yml`: weekly digest (Fri 18:00 IST, cron `30 12 * * 5`)
Content: the week's posts (title, dek, link), one "field note" paragraph written fresh by Claude from the week's work, and one older evergreen guide. The issue is also published as a web page at `/newsletter/<issue>`. Send in batches within the free daily limit. Track opens only through Resend's default (no extra pixel tracking).

### 3.6 `report.yml`: weekly growth report (Mon 08:00 IST, cron `30 2 * * 1`)
Pull GSC (clicks, impressions, CTR, position by page and query), PostHog (engaged reads, top pages, referrers including AI assistants, newsletter conversions), Cloudflare (bot analytics, cache hit), D1 (subscribers), and dev.to/Hashnode stats. Write `reports/2026-WNN.md` and open an issue containing:
- 5 numbers vs last week;
- top 3 wins and top 3 problems;
- **5 concrete next actions**, each created as its own issue with a `growth` label (for example "Refresh /guides/retrieval/hybrid-search: position 11 for 'hybrid search rag', 540 impressions").
Also update the `/experiment` page data.

### 3.7 `refresh.yml`: monthly (1st, 07:00 IST)
For posts at positions 8–20 with at least 100 impressions, or older than 9 months: open a refresh PR (better intro, a new section, updated versions and data, added internal links). Bump `updated` only when the content truly changed.

### 3.8 Hygiene
- `links.yml` weekly: lychee checks internal and external links and opens a fix PR.
- `tokens.yml` daily: checks token expiry for LinkedIn and Threads (refreshes Threads automatically) and opens `human` issues 7 days before expiry.
- `keepalive.yml` monthly: GitHub disables scheduled workflows in public repos after 60 days without activity, so commit `data/heartbeat.json` if nothing else was committed.
- `costs.yml` weekly: checks free-tier usage (Cloudflare, Resend, PostHog, GitHub minutes). Warn at 70% and degrade gracefully at 90%.

---

## 4. Growth plays Claude runs over time

1. **The experiment story:** publish monthly "This blog runs itself: month N" reports with real numbers (wins and failures). This is the most shareable asset; prepare a Show HN draft for month 3.
2. **Linkable tools:** the token-cost calculator, an eval-checklist generator, an MCP tool-schema linter. Each gets its own launch notes.
3. **Original data:** quarterly "State of my agent stack" with real cost and latency numbers from Srihari's projects (only what he approves).
4. **Series over one-offs:** "Start here", "Building Orqestra", "Evals from zero". Series keep readers and earn links.
5. **Glossary flywheel:** each guide links its terms; each term links back to guides.
6. **LinkedIn first:** Srihari's existing network is the fastest early channel. Optimise the LinkedIn copy hardest.
7. **Newsletter referral:** a "Forward this to one engineer who'd use it" line plus a web version. No paid referral tools.

## 5. Things Claude must never do

Link readers away to LinkedIn, Medium or Notion to read a post; reintroduce Notion or any external CMS; buy anything; use fake accounts, sock puppets or engagement pods; auto-like, auto-follow, auto-comment or auto-DM; scrape and repost others' content; post to Reddit or Hacker News; send email to anyone who didn't double-opt-in; publish without a merged PR; invent metrics, quotes or experience.
