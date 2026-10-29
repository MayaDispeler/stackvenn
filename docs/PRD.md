# PRD — Stackvenn

Owner: Srihari Venkatesan · Builder and operator: Claude · Status: v1.0 · Last updated: 2026-10-29

## 1. One-liner

**Stackvenn is where AI engineering, software and work overlap: practical field notes from someone who ships agentic AI in production.**

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
| AI and software engineers (primary) | Working patterns for agents, RAG, MCP, evals; real numbers | Reproducible guides, code, architectures, honest failure stories |
| Hiring managers and tech leads | Signal on how this person thinks | Clear writing, depth, results with numbers, decision logs |
| Founders and product people | What AI can actually do for a business | Case studies, cost and ROI framing, plain language |
| Career readers (from the existing 19 essays) | Perspective on work, growth and productivity | Short, sharp essays with a strong point of view |

## 5. Positioning and content pillars

Wedge: **"AI engineering in production, explained by someone who ships it."**

Pillars (max 6, used as topic hubs):
1. **Agentic systems:** orchestration, tools, MCP, multi-agent patterns.
2. **Retrieval:** RAG, hybrid search, chunking, evaluation.
3. **Evals and reliability:** LLM-as-judge, regression suites, graceful degradation.
4. **Cost and performance:** token budgets, caching, latency, inference cost.
5. **Shipping AI at work:** adoption, workflows, ROI, RevOps and Ops automation.
6. **Careers** · 7. **Work and productivity** · 8. **Life and mindset** · 9. **Society and values:** the existing essay categories from `data/blog-posts.json`, kept as topic hubs. The old "AI and technology" category maps to the AI pillars above.

**Columns (series with a voice):** "2 AM" is Srihari's existing late-night essay column (3 posts). Keep it as a named series with its own page at `/series/2-am` and its tagline from the posts ("A 2am essay for …").

## 6. Content types (each has its own layout)

| Type | Purpose | Layout | Cadence target |
|---|---|---|---|
| **Guide** | Evergreen, searchable how-to or reference ("pillar" pages) | Docs layout, 3 columns (like a help centre) | 2 per month |
| **Essay** | Point of view, story, opinion | Medium-like single column | 2 per month |
| **Field note** | Short (300–700 words) lesson from real work | Essay layout, compact | 1–2 per week |
| **Glossary term** | One precise definition plus example and links | Docs layout, short | Batch of 20 at launch, then as needed |
| **Tool** | Free interactive asset (calculator, checklist, template) | Tool page | 1 per quarter |
| **Book** | *The Mellivora Paradox* landing page | Feature page | Once |

Cadence is a target, not a quota. Never publish to hit a number.

## 7. Information architecture and URLs (stable forever)

```
/                          Home (Medium-like feed)
/guides/                   Guides index, grouped by pillar
/guides/<pillar>/<slug>    Guide (docs layout)
/essays/<slug>             Essay
/notes/<slug>              Field note
/glossary/  /glossary/<term>
/tools/<slug>
/topics/<pillar>           Topic hub: pillar intro + all posts
/series/<slug>             Ordered series ("Start here", "Building Orqestra")
/about                     Author page (Person entity, links to iamsrihari.com)
/newsletter                Subscribe page
/experiment                "How this site runs itself": live stats and monthly reports
/book/the-mellivora-paradox
/search                    Search results (with a ⌘/Ctrl+K modal everywhere)
/rss.xml  /feed.json  /sitemap.xml  /robots.txt  /llms.txt  /llms-full.txt
/<any-post-url>.md         Raw markdown twin of every post
```

## 8. Features

Priority: **P0** = launch, **P1** = within 30 days of launch, **P2** = later.

### Global
- P0 Top bar: Venn logo + "Stackvenn"; nav (Guides, Essays, Notes, Topics ▾, About); search button with ⌘K / Ctrl K hint; theme toggle (Dark / Light / System); Subscribe button.
- P0 Search modal (Pagefind): full text, filter by type and topic, keyboard navigation, recent searches (localStorage).
- P0 Footer: about blurb, topics, RSS, newsletter, socials, iamsrihari.com link, "Built and run by Claude: see the experiment".
- P0 Themes: dark default (brand), light, and system; remembered per viewer; no flash on load.
- P1 Language: English only at launch. P2 to evaluate Hindi or Tamil editions, human-reviewed only.

### Home (Medium-like, simple and powerful)
- P0 Masthead: one-line promise + subscribe field.
- P0 Tabs: Latest · Guides · Essays · Notes (filter in place; each tab has a real crawlable URL).
- P0 Featured post (one, editor-picked in config).
- P0 Feed list: title, dek, topic overlap chip, reading time, date, thumbnail on the right. Paginated pages (`/page/2`), not infinite scroll, so everything stays crawlable.
- P0 Right rail (desktop): Start here (series), topics, newsletter, short author card.
- P1 "Most read this month" (from PostHog, refreshed at build).

### Essay and field-note page
- P0 Single 680px column; title, dek, author line, date, updated date, reading time, topic overlap chip.
- P0 Reading progress bar; footnotes as hover sidenotes on wide screens; images with captions and lightbox; code blocks with copy.
- P0 Share: copy link, LinkedIn, X (intent link only), Bluesky, WhatsApp, Email.
- P0 Ends with: author card, newsletter CTA, related posts (3, same pillar), previous and next in series.
- P1 Comments (Giscus, lazy-loaded on click).
- P1 "Helpful?" reaction (👍/👎 via a PostHog survey or event; no counts shown).

### Guide page (docs layout, feature parity with a modern help centre)
- P0 Left sidebar: view switch **Paths** (curated learning order) / **All guides** (by pillar); collapsible tree; active state; scrolls independently.
- P0 Eyebrow (pillar), H1, dek.
- P0 Meta row: Level (Beginner / Intermediate / Advanced), reading time, Updated date, **Tested with** (tool and model versions).
- P0 Actions: **Copy Markdown** · **Open in ▾** (ChatGPT, Claude, Perplexity, View .md). The prompt opened says "Read <url> and help me apply it", which spreads the page into AI tools.
- P0 Right "On this page" TOC with scroll-spy.
- P0 Content components: numbered steps, callouts (Note / Tip / Warning / Danger), tabs (for example Python | TypeScript), code with filename, "Go deeper" links, comparison tables.
- P0 Footer: prev and next in path, "Edit on GitHub", last updated, changelog of the guide.
- P1 Copy-link anchors on every heading; deep link to any step.

### Other pages
- P0 Topic hub, series page, about, newsletter, 404 (with search), RSS and JSON feeds, `/experiment`.
- P1 Glossary index (A–Z), tools pages, book page.
- P1 Newsletter: double opt-in, weekly digest, one-click unsubscribe.

## 9. Content model (frontmatter, validated with zod)

```yaml
title: string            # ≤ 60 chars preferred for SERP
dek: string              # 1 sentence, 120–160 chars; doubles as meta description
type: guide | essay | note | glossary | tool
pillar: agentic | retrieval | evals | cost | shipping | careers | work | life | society
overlap: [string, string]  # the two stacks this post joins, e.g. ["AI", "Work"]
series: string?           # slug
order: number?            # position in series/path
level: beginner | intermediate | advanced?   # guides only
tested_with: string[]?    # e.g. ["Claude Opus 5.5", "LangGraph 1.x"]
published: date
updated: date?
status: draft | review | approved
canonical: url?           # always self (stackvenn.in); never points to LinkedIn/Medium
first_published: { platform: LinkedIn|Medium|Kissflow|2 AM, date, url }?  # record only, NEVER rendered as a link
migrated: bool?           # true for imported posts
sources: [{ title, url }] # required if the post states facts or numbers
cover: image?             # optional; OG image is generated if absent
distribute: { devto: bool, hashnode: bool, bluesky: bool, mastodon: bool, threads: bool, linkedin: bool }
faq: [{ q, a }]?          # optional Q&A block rendered at the end
```

## 10. Seed content (launch with depth, not volume)

1. **Migrate all 19 existing articles** listed in `data/blog-posts.json` (3 from Notion "2 AM", 11 LinkedIn, 4 Medium, 1 Kissflow), published **in full** on stackvenn.in. See `MIGRATION.md`. The copies on LinkedIn and Medium stay where they are, but the blog never links readers there.
2. **Book page** for *The Mellivora Paradox* (Amazon link, synopsis, sample chapter if allowed).
3. **5 pillar guides** built from real work: Orqestra (97 agents, 101 skills), Savepoint, Stack Failure Drill, hybrid-retrieval RAG at Kissflow (only the numbers already public on iamsrihari.com).
4. **20 glossary terms** (MCP, RAG, hybrid retrieval, LLM-as-judge, token budget, harness engineering…).
5. **1 tool:** an LLM token-cost calculator (a linkable asset).
6. **"Start here" series** and the **/experiment** page with month-0 baseline.

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
