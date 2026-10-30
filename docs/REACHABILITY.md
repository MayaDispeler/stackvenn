# Reachability — SEO, AI-search visibility and indexing (instructions for Claude)

Goal: every post is discoverable through Google, Bing, AI assistants, feeds and developer communities, from day one.
Work through the sections in order. Each item is a checkbox in `TODO.md`.

---

## 1. Domains and canonical host

- [ ] Canonical host: `https://stackvenn.in` (apex, no `www`). `www.stackvenn.in` → 301 to apex.
- [ ] `stackvenn.com` is reserved for a future startup. Don't touch it.
- [ ] `.in` is a country-code domain, so Google associates it with India by default. Global ranking is still possible. Offset this with `inLanguage: "en"`, no hreflang restrictions, globally relevant topics, and backlinks from international sites (GitHub, dev.to, Hashnode). Do **not** set an India-only target anywhere.
- [ ] iamsrihari.com: the Writing section lists Stackvenn posts (fetched from `/feed.json` at its build time), linking to stackvenn.in. It never hosts copies. Add `rel="me"` links both ways.
- [ ] 301 every old iamsrihari.com article URL to its new stackvenn.in URL (map in MIGRATION.md), so existing links and rankings carry over.
- [ ] Trailing-slash policy: pick one (no trailing slash) and enforce it with redirects.
- [x] Preview hosts are never indexed: `worker/index.js` adds `X-Robots-Tag: noindex, nofollow` and a disallow-all robots.txt on every host except stackvenn.in (DECISIONS 2026-10-30).

## 2. Cloudflare settings (via the Cloudflare MCP)

Cloudflare announced in July 2026 that bots are now grouped as **Search, Agent and Training**. For new domains from **15 September 2026**, Training and Agent crawlers are blocked by default on pages with ads. **Multi-purpose crawlers (Googlebot, Bingbot, Applebot) are checked against both the Search and Training policies, so blocking Training can block Google too.** For maximum reach:

- [ ] Under Security → bots / AI crawl settings, set **Search = Allow, Agent = Allow, Training = Allow** (Training is Srihari's call; allowing it maximises AI visibility). Record the final choice in `docs/DECISIONS.md`.
- [ ] Turn off "Block AI bots" and Cloudflare's managed robots.txt (we serve our own). Keep Bot Fight Mode off unless abuse appears.
- [ ] Turn on **Crawler Hints** (sends IndexNow pings automatically), Always Use HTTPS, HSTS (after 1 week stable), HTTP/3, Brotli and Early Hints.
- [ ] Caching: HTML cache 1h with stale-while-revalidate; hashed assets cached for 1 year and immutable.
- [ ] Weekly check (in the report workflow): fetch the home page and one post with Googlebot, Bingbot, GPTBot, ClaudeBot and PerplexityBot user agents. Expect 200 from our side (Cloudflare verifies real bots by IP, so this only proves we don't block them by UA). Also read Cloudflare's bot analytics for blocked verified bots, and alert if any search or AI bot is blocked.

## 3. robots.txt and crawl files

```
User-agent: *
Allow: /
Disallow: /api/
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Sitemap: https://stackvenn.in/sitemap-index.xml
```
- [ ] Check the current Content Signals syntax on Cloudflare's docs before shipping, and match Training to the Cloudflare decision above.
- [ ] `sitemap-index.xml` with `<lastmod>` taken from `updated` or `published`. Exclude drafts, `/admin`, section fronts with no stories, and the search page.
- [ ] `/llms.txt`: site summary, then sections (one per site section, plus Explained, Terms, Tools), each line `- [Headline](url.md): standfirst`. `/llms-full.txt`: the full markdown of all Explained pieces and Terms. This is a community proposal; Google doesn't use it, but it is cheap and some AI tools read it.
- [ ] Each story's `.md` twin is linked with `<link rel="alternate" type="text/markdown" href="….md">`.
- [ ] Full-content RSS (`/rss.xml`) and JSON Feed (`/feed.json`), with autodiscovery `<link>` tags on every page.

## 4. On-page SEO (enforced by a build-time check script)

- [ ] `<title>`: headline + " · Stackvenn"; aim for ≤ 60 characters total.
- [ ] Meta description = `standfirst` (120–160 chars). Fail the build if it is missing or duplicated.
- [ ] One H1; logical H2/H3; the first 100 words state what the reader will get, and include the main term naturally.
- [ ] Self-referencing canonical on every page (migrated posts keep their canonical rules from the PRD).
- [ ] Open Graph and Twitter cards with a generated 1200×630 OG image (title, overlap chip, Venn mark, on `--bg`).
- [ ] Descriptive slugs (3–6 words, lowercase, hyphens), never dates in URLs.
- [ ] Images: AVIF or WebP via astro:assets, explicit width and height, descriptive alt, lazy below the fold, LCP image prioritised.
- [ ] Internal links: each new story links to its section front plus at least 2 related stories, and gets at least 2 links from older stories (the publish workflow adds those as a PR). Breadcrumbs on every story (Stackvenn › Section › Headline).
- [ ] Show "Updated <date>" and keep a short changelog at the end of Explained pieces. Only bump `updated` for real content changes.
- [ ] Performance budget enforced in CI (Lighthouse CI): JS ≤ 50KB gzipped on content pages, LCP < 2.5s, CLS < 0.1.

## 5. Structured data (JSON-LD, validated in CI)

- [ ] Sitewide: `WebSite` (name, url), `Organization` (Stackvenn, logo), `Person` (Srihari: name, url → /author/srihari-venkatesan, `sameAs` → iamsrihari.com, LinkedIn, GitHub, Medium, Amazon author page).
- [ ] Explained: `TechArticle`. Analysis: `AnalysisNewsArticle`. Opinion and Column: `OpinionNewsArticle`. Brief: `BlogPosting`. Each includes headline, description, datePublished, dateModified, author (Person @id), publisher, image, `articleSection` (section) and `isPartOf` (column or path).
- [ ] `BreadcrumbList` on all stories; `DefinedTerm` on Terms pages; `Book` on the book page; `SoftwareApplication` or `WebApplication` on tools.
- [ ] Don't rely on FAQ or HowTo rich results (Google limited them). FAQ blocks are still welcome as plain content for readers and AI answers.

## 6. Search engines: connect and automate

One-time human steps are marked **[H]**. Everything else is Claude's.

- [ ] **[H]** Google Search Console: Srihari signs in once and adds a Domain property for stackvenn.in. Claude adds the DNS TXT verification record through Cloudflare.
- [ ] **[H]** Create a Google Cloud service account (free), add it as an Owner in Search Console, and store the JSON key as the `GSC_SA_KEY` secret.
- [ ] Automate: submit sitemaps via the Search Console API on each deploy; read Search Analytics (queries, pages, positions) weekly; use the URL Inspection API to track index status of new posts (respect its daily quota). Don't use Google's Indexing API, which is only for job postings and livestreams.
- [ ] **[H]** Bing Webmaster Tools: sign in and import from Search Console. Store an API key as `BING_API_KEY`.
- [ ] IndexNow: host the key file at `/<key>.txt` and ping on every publish or update (Cloudflare Crawler Hints also does this). This covers Bing, Yandex, Seznam and Naver.
- [ ] Weekly: the report workflow lists pages "Discovered/Crawled – not indexed" and opens fix tasks (thin content, missing internal links, duplicate titles).

## 7. AI-assistant visibility (GEO)

AI answers cite pages that are crawlable, clear, specific and trustworthy.
- [ ] Allow AI crawlers (§2–3). Keep pages server-rendered HTML (Astro static); no content behind client JS.
- [ ] Open each post with a 2–3 sentence direct answer or summary. Use definitions in the form "X is …". Put steps in numbered lists and comparisons in real tables.
- [ ] Original value AI can't make up: Srihari's own first-hand experience and argument, worked examples, diagrams, benchmarks with method notes.
- [ ] Cite sources inline and in a "Sources" list. Show author credentials on every post.
- [ ] Keep naming consistent ("Stackvenn", "Srihari Venkatesan") everywhere, including socials and GitHub, so assistants connect the entity.
- [ ] "Copy Markdown" and "Open in ChatGPT/Claude/Perplexity" buttons on Explained pages spread the page into AI conversations.
- [ ] Measure: PostHog channel breakdown for referrers chatgpt.com, chat.openai.com, perplexity.ai, claude.ai, gemini.google.com, copilot.microsoft.com, plus `utm_source=chatgpt.com`. Report monthly.

## 8. Off-site reach (earned, not spammed)

Claude prepares assets and drafts. Anything posted in communities is a human's decision.
- [ ] **Syndication with canonical:** dev.to and Hashnode (see MARKETING_AUTOMATION.md).
- [ ] **Old copies on LinkedIn and Medium stay up** (Srihari's choice). To help search engines treat stackvenn.in as the main version: migrated posts are revised and expanded (not word-for-word), carry their own canonical, and get internal links. [H, optional] On Medium, set each story's canonical link to the stackvenn.in URL (story settings → Advanced → "This story was originally published elsewhere"). LinkedIn has no canonical setting, so nothing is needed there.
- [ ] **daily.dev:** submit stackvenn.in as a source (one-time, **[H]** if a form login is needed). Dev blogs get large reach there.
- [ ] **Awesome lists:** at most 3 highly relevant ones (for example awesome-mcp, awesome-llm-evals), via a PR adding the tool or Explained piece. Only when it meets the list's contribution rules.
- [ ] **Communities** (manual, Srihari decides): Hacker News "Show HN" for tools and the /experiment page; relevant subreddits that follow their self-promotion rules; LinkedIn groups. Claude writes a tailored draft into the issue; it never posts.
- [ ] **Podcasts and newsletters:** monthly, Claude lists 5 relevant AI-engineering newsletters or podcasts that accept submissions and drafts a pitch per item in an issue labelled `human`.
- [ ] **Unlinked mentions:** monthly search for "Stackvenn" or "Srihari Venkatesan" mentions without links; draft polite outreach in an issue.

## 9. Keep it fresh

- [ ] Monthly: refresh posts ranking in positions 8–20 for any query with at least 100 impressions (improve intro, add a section, update data, add internal links) via a PR.
- [ ] Quarterly: prune or merge posts with no impressions after 6 months (301 into the stronger post).
- [ ] Re-test Explained pieces when a tool in `tested_with` ships a major version; update or add a "Version note" callout.
