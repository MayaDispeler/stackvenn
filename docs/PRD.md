# PRD — Stackvenn

Owner: Srihari Venkatesan · Builder and operator: Claude · Status: v1.1 (editorial model) · Last updated: 2026-10-29

## 1. One-liner

**Stackvenn is where AI engineering, software and work overlap: reporting, analysis and explainers from someone who ships agentic AI in production.**

The name is the idea. Each post sits in the overlap of two "stacks" (for example AI × Work, or Engineering × Careers), and the site shows that overlap visually.

## 2. Why this exists

- Reach is the goal. It builds an audience and an author reputation that a future Stackvenn startup can launch to.
- It is also an experiment: can a publication be built, run, distributed and measured end to end by Claude at zero cost? The experiment is itself content ("This blog runs itself: month N results"), which is one of the strongest reach hooks the site has.

## 3. Goals and non-goals

**Goals**
1. Become a go-to source for *production* AI engineering (agentic systems, RAG, MCP, evals, token budgets, failure modes).
2. Grow organic search, AI-assistant citations, subscribers and backlinks month over month.
3. Strengthen Srihari's personal brand as a senior AI engineer (supports iamsrihari.com).

**Non-goals**
- Revenue, ads, paywalls or sponsorships.
- Mass-produced AI content. Google's spam policies treat scaled, low-value content made mainly to rank as abuse, and it would also damage Srihari's name. Volume is never the strategy; usefulness is.
- Generic "AI news" coverage, which cannot compete with large outlets.

## 4. Audience

| Persona | Need | What wins them |
|---|---|---|
| AI and software engineers (primary) | Working patterns for agents, RAG, MCP, evals; real numbers | Reproducible Explained pieces, code, architectures, honest failure stories |
| Hiring managers and tech leads | Signal on how this person thinks | Clear writing, depth, results with numbers, decision logs |
| Founders and product people | What AI can actually do for a business | Case studies, cost and ROI framing, plain language |
| Career readers (from the existing 19 articles) | Perspective on work, growth and productivity | Short, sharp Opinion and Column pieces with a strong point of view |

## 5. Positioning, editorial model and sections

Wedge: **"AI engineering in production, explained by someone who ships it."**

**The bar is a publication, not a hobby blog** (Srihari, 2026-10-29): Medium, The Hindu, The Economic Times, Deccan Chronicle. The words "essays", "guides" and "notes" are not used in the UI, URLs or docs.

**Sections** are the main navigation, as in a newspaper. Each has a section front at `/<section>`.

| Section | Covers | Old pillars mapped here |
|---|---|---|
| **AI** | Agents, MCP, retrieval, evals, model cost | agentic, retrieval, evals, cost (chosen per story) |
| **Engineering** | Building, testing and running software | agentic, retrieval, evals, cost (chosen per story) |
| **Careers** | Promotions, pay, switching jobs | careers |
| **Work** | Productivity, process, adopting tools, ROI | work, shipping |
| **Life** | Mindset, learning, habits | life |
| **Society** | Values, public life, systems | society |

**Columns** are named series with a voice. The first is **"2 AM"**, Srihari's late-night column (3 pieces), at `/columns/2-am`.

## 6. Formats (shown as a kicker above the headline, never in the nav)

| Format | What it is | Layout | Cadence target |
|---|---|---|---|
| **Explained** | Step-by-step, evergreen, searchable (the old "guides") | Docs layout, 3 columns, with an "Explained in 60 seconds" box | 2 per month |
| **Analysis** | Data- or argument-led long read | Story page | 1–2 per month |
| **Opinion** | Point-of-view piece | Story page | 1–2 per month |
| **Column** | A piece in a named column (first: 2 AM) | Story page, column kicker | As written |
| **Brief** | Short dispatch, 300–700 words (the old "notes") | Story page, compact | 1–2 per week |
| **Terms** | One precise definition plus example and links (the old glossary) | Docs layout, short | Batch of 20 at launch |
| **Tools** | Free interactive asset (calculator, checklist) | Tool page | 1 per quarter |
| **Book** | *The Mellivora Paradox* landing page | Feature page | Once |

Cadence is a target, not a quota. Never publish to hit a number.

**Newsroom vocabulary** used in components, schema and docs: kicker, headline, standfirst, byline, dateline, "Updated", pull quote, "Explained in 60 seconds".

## 7. Information architecture and URLs (stable forever)

Nothing was live before 2026-10-29, so these are set once and never change. A slug or section change needs a 301 in the same PR.

```
/                                Front page (newspaper hierarchy)
/<section>                       Section front: ai, engineering, careers, work, life, society
/<section>/page/<n>              Section front, page n (crawlable pagination)
/<section>/<slug>                Every story: Explained, Analysis, Opinion, Column, Brief
/explained                       Hub for the Explained format, grouped by section
/columns/<column>                Column page, e.g. /columns/2-am
/terms   /terms/<slug>           Terms (A–Z index and term page)
/tools/<slug>                    Tools
/author/srihari-venkatesan       Author page (Person entity, links to iamsrihari.com)
/author/srihari-venkatesan/page/<n>  Author page, stories page n
/about/srihari                   301 to /author/srihari-venkatesan
/about                           The publication page: what Stackvenn is, masthead, formats, editorial standards, corrections policy, independence
/newsletter                      Subscribe page and issue archive
/experiment                      "How this site runs itself": live stats and monthly reports
/book/the-mellivora-paradox
/search                          Search results (with a ⌘/Ctrl+K modal everywhere)
/admin                           Writing desk (git-based CMS; noindex)
/rss.xml  /feed.json  /sitemap-index.xml  /robots.txt  /llms.txt  /llms-full.txt
/<any-story-url>.md              Raw markdown twin of every story
```

Slugs are unique across the whole site. `page`, `index`, `rss` and `feed` are reserved and fail the build.

## 8. Features

Priority: **P0** = launch, **P1** = within 30 days of launch, **P2** = later.

### Global
- P0 Header: Venn logo + "Stackvenn"; **section nav** (AI · Engineering · Careers · Work · Life · Society); search with ⌘K / Ctrl K hint; theme toggle (Dark / Light / System); Subscribe.
- P0 Search modal (Pagefind): full text, filter by section and format, keyboard navigation, recent searches (localStorage).
- P0 Mobile menu drawer: sections, columns, Explained, theme toggle, Subscribe.
- P0 Footer: sections, columns, Explained, RSS, newsletter, iamsrihari.com, "Built and run by Claude: see the experiment".
- P0 Themes: dark default (brand), light, system; remembered per viewer; no flash on load.
- P1 English only at launch. P2 to evaluate Hindi or Tamil editions, human-reviewed only.

### Front page (newspaper hierarchy without newspaper clutter)
- P0 Masthead: Venn mark, "Stackvenn", today's date in IST, a one-line promise.
- P0 Lead story (big headline, standfirst, image) with 3–4 "Top stories" beside it. Editor-picked in `src/data/frontpage.json`, falling back to the latest.
- P0 A rule-separated band per section (headlines + standfirsts; one with an image).
- P0 "Most read" (editor picks until PostHog data exists, then refreshed at build).
- P0 An "Explained" strip, the "2 AM" column block, and the newsletter sign-up.
- Rules and type do the work: no cards in grids.

### Section front
- P0 Section name as a large title, a lead story, then a list; paginated at `/<section>/page/<n>`, never infinite scroll.

### Story page (Analysis, Opinion, Column, Brief)
- P0 Kicker (format or column name), headline, standfirst, byline with avatar, dateline + "Updated", reading time.
- P0 Reading progress bar; pull quotes; footnotes as sidenotes on wide screens; images with captions and lightbox; code blocks with copy.
- P0 Share: copy link, LinkedIn, X (intent link only), Bluesky, WhatsApp, Email.
- P0 Ends with: sources, author box, newsletter CTA, "More in <Section>", "Most read".
- P1 Comments (Giscus, lazy-loaded on click).
- P1 "Helpful?" reaction (no counts shown).

### Explained page (docs layout, feature parity with a modern help centre)
- P0 Left sidebar: **Paths** (curated order) / **All Explained** (by section); collapsible; active state; sticky, never scrolling on its own.
- P0 Kicker (Explained · Section), headline, standfirst, **"Explained in 60 seconds"** box (3–5 takeaways).
- P0 Meta row: Level, reading time, Updated, **Tested with** (tool and model versions).
- P0 Actions: **Copy Markdown** · **Open in ▾** (ChatGPT, Claude, Perplexity, View .md). The prompt says "Read <url> and help me apply it".
- P0 Right "On this page" TOC with scroll-spy.
- P0 Content components: numbered steps, callouts (Note / Tip / Warning / Danger), tabs, code with filename, "Go deeper" links, comparison tables.
- P0 Footer: prev and next in path, "Edit on GitHub", last updated, changelog.
- P1 Copy-link anchors on every heading.

### Other pages
- P0 Section fronts, column page, Explained hub, author page, about, newsletter, 404 (with search), RSS and JSON feeds, `/experiment`.
- P1 Terms index (A–Z), tools pages, book page.
- P1 Newsletter: double opt-in, weekly digest, one-click unsubscribe.

### Writing desk (`/admin`)
- P0 A free, git-based web editor (Decap CMS or Sveltia CMS, GitHub backend, OAuth proxy on a free Cloudflare Worker) with collections matching §9 and a mobile-friendly editor. Srihari's own saves count as approval; Claude's drafts still go through PRs.

## 9. Content model (frontmatter, validated with zod in `src/content.config.ts`)

Files: stories in `src/content/stories/<slug>.mdx`, terms in `src/content/terms/`, tools in `src/content/tools/`.

```yaml
headline: string          # ≤ 60 chars preferred for SERP
standfirst: string        # 120–160 chars; doubles as meta description
format: explained | analysis | opinion | column | brief | term | tool
section: ai | engineering | careers | work | life | society
kicker: string?           # override; default = format label, or the column name
column: 2-am?             # required when format = column
overlap: [string, string] # the two stacks this story joins, e.g. ["AI", "Work"]
series: string?           # path slug (Explained) or reading series
order: number?
level: beginner | intermediate | advanced?   # Explained only (required there)
tested_with: string[]?    # e.g. ["Claude Opus 5.5", "LangGraph 1.x"]
summary: string[]?        # "Explained in 60 seconds", 3–5 lines; Explained only (required there)
dateline: string?         # place, e.g. "Chennai"
published: date
updated: date?
status: draft | review | approved   # draft never ships; review/approved ship once merged
canonical: url?           # always self (stackvenn.in)
first_published: { platform: LinkedIn|Medium|Kissflow|2 AM, date, url }?  # record only, NEVER rendered as a link
migrated: bool?
sources: [{ title, url }] # required if the story states facts or numbers
cover: image?  cover_alt: string?  cover_credit: string?
distribute: { devto, hashnode, bluesky, mastodon, threads, linkedin: bool }
corrections: [{ date, text }]   # rendered at the end as "Correction, <date>: …" (policy at /about#corrections)
faq: [{ q, a }]?
```

## 10. Seed content (launch with depth, not volume)

1. **Migrate all 19 existing articles** in `data/blog-posts.json` (3 from the "2 AM" column, 11 LinkedIn, 4 Medium, 1 Kissflow), published **in full** at their new URLs (`MIGRATION.md`). The copies on LinkedIn and Medium stay up, but Stackvenn never links readers there.
2. **Book page** for *The Mellivora Paradox* (Amazon link, synopsis, sample chapter if allowed).
3. **5 Explained pieces** built from real work: Orqestra (97 agents, 101 skills), Savepoint, Stack Failure Drill, hybrid-retrieval RAG at Kissflow (only the numbers already public on iamsrihari.com).
4. **20 Terms** (MCP, RAG, hybrid retrieval, LLM-as-judge, token budget, harness engineering…).
5. **1 tool:** an LLM token-cost calculator.
6. **"Start here" path** and the **/experiment** page with a month-0 baseline.

## 11. Success metrics (reach only)

North star: **Engaged reads per week**, meaning post views with 30 seconds or more of engagement or at least 50% scroll (PostHog).

| Leading indicator | Source | 90-day direction |
|---|---|---|
| Indexed pages / submitted | Google Search Console, Bing Webmaster | ≥ 90% |
| Search impressions and clicks | GSC | Growing every week |
| AI-assistant referrals (chatgpt.com, perplexity.ai, claude.ai, gemini, copilot) | PostHog referrer | First non-zero, then growing |
| Referring domains | GSC Links + Bing | Growing |
| Subscribers (email + RSS estimate) | D1, feed stats | Growing |
| Syndication views | dev.to and Hashnode APIs | Tracked |
| Core Web Vitals | CrUX via GSC, PostHog web vitals | All "Good" |

Be honest in reports. A brand-new domain usually takes months to earn search trust. Early reach will come mostly from LinkedIn, syndication, communities and GitHub.

## 12. Constraints and assumptions

- Zero running cost. Free tiers can change, so `docs/COSTS.md` tracks every limit and the weekly report flags usage above 70%.
- Content lives only in this repo as MDX. The Notion → Cloudflare Worker sync (`2am-api.ksvhari007.workers.dev`) is retired; nothing is fetched from Notion at build or runtime.
- Readers never leave the site to read. No "Read on LinkedIn/Medium" links anywhere.
- Srihari does no routine work. The only human steps are one-time account set-ups (see TODO Phase 0) and merging content PRs from his phone.
- The repo can be public (the content is public anyway), which gives free GitHub Actions minutes. Secrets stay in GitHub secrets.

## 13. Risks

| Risk | Mitigation |
|---|---|
| Thin or AI-generic content hurts rankings and reputation | Approval gate; every post needs first-hand experience, code or data; editorial checklist in MARKETING_AUTOMATION.md |
| Cloudflare bot defaults block Google or AI crawlers | Explicit settings and weekly crawl test (REACHABILITY.md §2) |
| Platform API changes or lost tokens (LinkedIn tokens expire) | Distribution is idempotent; failures open a `human` issue; never block publishing |
| Duplicate-content confusion from syndication | Canonical tags everywhere; syndicate 3–7 days after publishing |
| Free-tier limits hit | Weekly cost report; degrade gracefully (for example, fall back to RSS-only for the newsletter) |
| GitHub disables scheduled workflows after 60 days of no repo activity (public repos) | Regular publishing keeps it active; add a monthly keep-alive commit |
