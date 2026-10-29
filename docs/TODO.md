# TODO — Stackvenn build and launch plan

Work top to bottom. `[H]` = needs Srihari once (Claude opens a `human` issue with exact steps, then continues with other work). Everything else is Claude's.
Tick boxes in the PR that completes them.

## Phase 0 — One-time human setup (≈ 1 hour in total, done once)
- [x] [H] Create the GitHub repo `stackvenn` (public) and run `gh auth login` locally. Done by Claude: MayaDispeler/stackvenn.
- [ ] [H] Run `claude setup-token`, then `/install-github-app` in Claude Code, and choose the subscription token. This saves the `CLAUDE_CODE_OAUTH_TOKEN` secret.
- [ ] [H] Confirm stackvenn.in and iamsrihari.com are on Cloudflare DNS (leave stackvenn.com untouched; it is reserved); if not, change nameservers at the registrar. Create a scoped Cloudflare API token (Workers, Pages, D1, DNS edit, Zone settings).
- [ ] [H] Google Search Console sign-in plus a service account added as Owner (REACHABILITY §6).
- [ ] [H] Bing Webmaster Tools: import from GSC and create an API key.
- [ ] [H] Accounts and tokens: dev.to API key; Hashnode token + publication; Bluesky app password; Mastodon account + token; LinkedIn developer app with "Share on LinkedIn" + OpenID; Threads app; Resend account (Claude adds the DNS records).
- [ ] [H] Enable GitHub Discussions and install the Giscus app on the repo.
- [ ] [H] Decide the Training-crawler setting (default: Allow) and the masthead line (default in DESIGN.md §2).
- [ ] [H] Upload source material: the cream-blazer portrait, book cover, and any project numbers he approves for publishing.
- [x] [H] Grant Claude access to the iamsrihari.com repo (Local at Portfolio Pages/Portfolio; no action needed.) (for covers under `public/writing`, the Writing section and the Notion sync code).
- [ ] [H] LinkedIn data export: Settings → Data privacy → Get a copy of your data → tick **Articles** → request. LinkedIn emails a download link; put the zip in `imports/linkedin/`. This is the only reliable way to get the 11 LinkedIn article bodies (LinkedIn blocks automated fetching).
- [ ] [H] Medium export: Settings → Security and apps → Download your information. Put the zip in `imports/medium/`. (Claude first tries Medium's public RSS and page fetch; the export is the fallback.)
- [ ] [H] Kissflow post ("The Clockwork Efficiency"): confirm in an issue whether you hold the rights to republish it. If not, Claude writes a new essay on the same idea instead of copying it.

## Phase 1 — Foundation
- [ ] Install skills and tools (CLAUDE.md "Skills and tools"). Impeccable, frontend-design and project tooling done; UI UX Pro Max waits on Srihari running /plugin (blocked locally, see DECISIONS).
- [x] Add `imports/`, `.env*` and `*.pem` to `.gitignore` in the first commit (personal data exports must never be pushed).
- [x] Scaffold Astro + TypeScript strict + MDX + sitemap + Expressive Code; set up ESLint, Prettier and `astro check`.
- [x] `tokens.css` with both themes exactly as in DESIGN_SYSTEM.md §2; theme script with no flash; a contrast-check script in CI.
- [x] Self-hosted fonts (Schibsted Grotesk, Newsreader, JetBrains Mono) with metric-matched fallbacks.
- [x] Content collections with the zod schema (PRD §9); fail the build on invalid frontmatter.
- [x] Base layouts: Shell, Essay, Guide, List, Page. Run the Impeccable `critique` on wireframes first.
- [ ] Wrangler config; deploy a preview to Cloudflare; set up the custom domain; redirects (www, .in, trailing slash). **Partial:** Preview live at stackvenn.ksvhari007.workers.dev and trailing-slash handled; custom domain + www redirect wait on #2.
- [x] Playwright screenshot suite (360/390/768/1280/1440 × dark/light) and an axe accessibility suite in CI.

## Phase 2 — Components and pages
- [ ] Venn mark (SVG), logo, favicon set, overlap chip.
- [ ] Header, mobile drawer, footer, theme toggle, search modal (Pagefind), toast.
- [ ] Buttons, links, chips, meta badges, callouts, steps, tabs, code block, tables, figure + lightbox, sidenotes and footnotes.
- [ ] Home: masthead (one-time Venn animation), tabs, featured card, feed, pagination, right rail.
- [ ] Essay and note template: progress bar, share row, author card, related posts, series navigation, sources, Giscus on click.
- [ ] Guide template: sidebar (Paths / All guides), meta row, Copy Markdown, Open in ▾, TOC scroll-spy, heading anchors, prev/next, "Helpful?", Edit on GitHub, changelog.
- [ ] Topic hubs, series pages, About, Newsletter (+ issue archive), /experiment, glossary index and term page, tool page shell, book page, 404, search page.
- [ ] Run the Impeccable `polish` and `audit` on every page; fix all findings.

## Phase 3 — Reachability (REACHABILITY.md)
- [ ] Cloudflare bot and AI settings, Crawler Hints, HTTPS/HSTS, caching (§2).
- [ ] robots.txt with Content Signals, sitemap index, RSS, JSON Feed, llms.txt, llms-full.txt, `.md` twins (§3).
- [ ] SEO build checks: titles, descriptions, canonicals, H1, alt text, internal-link minimums, duplicate detection (§4).
- [ ] JSON-LD for all page types plus a validator in CI (§5).
- [ ] OG image generator (Satori) using the design tokens.
- [ ] GSC sitemap submission + URL Inspection tracking; Bing + IndexNow (§6).
- [ ] PostHog: cookieless setup (`persistence: 'memory'`), reverse proxy through a Cloudflare Worker, events (`post_view`, `engaged_read`, `scroll_50`, `copy_markdown`, `open_in_ai`, `search`, `subscribe_start`, `subscribe_confirm`, `share_click`, `helpful_vote`), web vitals, an AI-referrer channel group, and a "Stackvenn Reach" dashboard via the PostHog MCP.
- [ ] Cloudflare Web Analytics as the no-JS backup.

## Phase 4 — Newsletter and data services
- [ ] Worker endpoints `/api/subscribe`, `/api/confirm`, `/api/unsubscribe` with D1; double opt-in; rate limiting with Turnstile (free) on the form.
- [ ] Resend domain set-up (SPF, DKIM, DMARC via Cloudflare DNS); email template in brand tokens (with a light fallback for email clients).
- [ ] Optional P1: a D1-backed "helpful" counter (never shown publicly).

## Phase 5 — Seed content (PRD §10)
- [ ] `docs/VOICE.md` learned from Srihari's existing essays (tone, sentence length, recurring phrases, what he never says).
- [ ] Run the full migration in `docs/MIGRATION.md`: all 19 articles from `data/blog-posts.json` published in full on stackvenn.in, the book page, and the Notion sync retired.
- [ ] Book page.
- [ ] 5 pillar guides from real projects (draft PRs with `[[CONFIRM]]` items for Srihari).
- [ ] 20 glossary terms.
- [ ] Token-cost calculator tool.
- [ ] "Start here" series and /experiment month-0 baseline.
- [ ] iamsrihari.com: Writing section fed from stackvenn.in `/feed.json` (replacing the Notion feed), old `/writing/*` URLs 301 to stackvenn.in, `rel="me"` links, and the about page linking to Stackvenn.
- [ ] Repo READMEs (Orqestra, Savepoint, etc.) link to their guides.

## Phase 6 — Automation (MARKETING_AUTOMATION.md)
- [ ] deploy.yml, distribute.yml (+ `data/distribution.json`), newsletter.yml, ideas.yml, editorial gate, report.yml, refresh.yml, links.yml, tokens.yml, keepalive.yml, costs.yml.
- [ ] Dry-run mode for every channel (`DRY_RUN=true` posts to the workflow log only). Run one full dry run end to end before going live.
- [ ] `docs/COSTS.md` with every free-tier limit and the date it was checked.

## Phase 7 — Launch
- [ ] Pre-launch audit: Lighthouse 95+ on 5 key pages, axe clean, all JSON-LD valid, every redirect tested, Googlebot/AI-bot fetch test passes.
- [ ] Launch post: "I gave Claude a domain and zero budget. Here's the blog it built" (an essay plus a /experiment update).
- [ ] Distribution runs automatically. [H] Srihari optionally posts the prepared drafts to Hacker News, Reddit and X.
- [ ] Submit to daily.dev and Feedly (auto via RSS); add the newsletter to relevant directories (free).

## Phase 8 — Ongoing (automated)
- [ ] Weekly: ideas → 2 draft PRs; digest; growth report with 5 actions.
- [ ] Monthly: refresh PRs; experiment report; pitch list; unlinked mentions.
- [ ] Quarterly: prune or merge; original-data post; new tool; review this plan and the PRD metrics.
