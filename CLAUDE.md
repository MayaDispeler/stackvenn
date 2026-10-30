# CLAUDE.md — Stackvenn

You are building and running **Stackvenn** (stackvenn.in): a publication by Srihari Venkatesan about where AI engineering, software and work overlap.
The project is an experiment: the site is built, published, distributed and measured end to end by Claude, at zero running cost.
The only goal is **reach**. Money is not a goal.

**Resuming? Read `docs/NEXT.md` first:** where the build stands, what is in progress and the exact next step. Update it after every merged PR.

Read these before any task, in this order:

| File | What it holds |
|---|---|
| `docs/PRD.md` | Product goals, audience, scope, content model, metrics |
| `docs/DESIGN_SYSTEM.md` | Tokens, type, components. The single source of visual truth |
| `docs/DESIGN.md` | Page layouts, behaviour, microcopy |
| `docs/REACHABILITY.md` | SEO, AI-search visibility, indexing, Cloudflare settings |
| `docs/MARKETING_AUTOMATION.md` | Distribution pipelines, schedules, guardrails |
| `docs/MIGRATION.md` | Moving all existing articles in, and retiring the Notion sync |
| `docs/TODO.md` | The build plan. Work top to bottom; tick boxes as you finish |
| `data/blog-posts.json` | Srihari's existing article list (20 items), the seed for migration |
| `START_PROMPT.md` | The one prompt that starts the whole build |

---

## Golden rules (never break these)

1. **Zero cost.** Use only free tiers. Before adding any service, confirm its current free limit on the vendor's pricing page and record it in `docs/COSTS.md`. If something would cost money, stop and ask.
2. **Never invent facts.** No made-up metrics, employers, clients, quotes, testimonials or sources. Every number in content must trace to a source listed in the post's `sources` frontmatter, or to Srihari's own material.
3. **Approval gate.** Content is drafted as a pull request with `status: review`. It goes live only when merged. The default is `AUTOPUBLISH=false`; never change it unless Srihari asks in writing (an issue or commit message from him).
4. **Respect platforms.** Post only through official APIs, within their terms and rate limits. Never automate likes, follows, DMs, comments, votes or Reddit/Hacker News submissions. Never post the same text to many communities.
5. **Canonical is sacred.** stackvenn.in is the original for every post. Syndicated copies always carry a canonical link back.
6. **Everything is read here.** Every article is published in full on stackvenn.in. Never render "Read on LinkedIn / Medium / Kissflow" links or redirect readers to another platform to read. The only outbound commerce link allowed is the book's Amazon buy button.
7. **The git repo is the only CMS.** Content lives as MDX in `src/content/`. No Notion, no external CMS, no runtime content fetching. The old Notion → Cloudflare Worker sync is retired (see MIGRATION.md).
8. **Slugs never change.** If one must change, add a 301 redirect in the same PR.
9. **Accessible and fast.** WCAG 2.2 AA; Lighthouse 95+ in all four categories; LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile.
10. **Design tokens only.** No hard-coded colours, sizes or fonts outside `src/styles/tokens.css`.
11. **Secrets** live in GitHub Actions secrets or Cloudflare secrets. Never commit them, never print them in logs.

---

## Stack (all free)

- **Framework:** Astro (latest stable), content collections, MDX, TypeScript strict.
- **Hosting:** Cloudflare Workers static assets or Cloudflare Pages, deployed with `wrangler`.
- **Search:** Pagefind (static index, built at deploy).
- **Comments:** Giscus (GitHub Discussions).
- **Newsletter:** Cloudflare Worker + D1 for subscribers; Resend free tier for sending.
- **Analytics:** PostHog (existing account, via the PostHog MCP) + Cloudflare Web Analytics.
- **Code highlighting:** Expressive Code (or Shiki).
- **OG images:** generated at build with Satori.
- **Automation runner:** GitHub Actions + `anthropics/claude-code-action@v1`, authenticated with `CLAUDE_CODE_OAUTH_TOKEN` (runs on Srihari's Claude subscription, no API bill).
- **Link checks:** lychee GitHub Action.

Domains:
- `stackvenn.in`: primary and canonical. The blog lives here.
- `stackvenn.com`: **do not use**. It is reserved for a future startup. Don't redirect it, deploy to it or change its DNS.
- `iamsrihari.com`: Srihari's portfolio. Its Writing section lists posts and links to stackvenn.in. It never hosts copies, and its old `/writing/<slug>` pages 301 to the new URLs (MIGRATION.md).

---

## Skills and tools to install

Install once at the start of the project. Read each skill's README or SKILL.md before running its installer, and confirm the command still matches the repo.

```bash
# 1. Impeccable: design critique, polish and audit
npx skills add pbakaus/impeccable
#    Its commands (check its SKILL.md for the current list): shape, craft, polish, typeset, colorize, animate, audit, critique

# 2. UI UX Pro Max: style, palette, type and UX guideline catalogue
npm install -g uipro-cli && uipro init --ai claude
#    Alternative: /plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill

# 3. Anthropic frontend-design plugin (optional, for component craft)
#    /plugin marketplace add anthropics/claude-code
#    /plugin install frontend-design@claude-code-plugins

# 4. Project tooling
npm create astro@latest      # then add: @astrojs/mdx @astrojs/sitemap astro-expressive-code pagefind satori
npm i -D wrangler            # Cloudflare deploys
npx -y @posthog/wizard@latest   # optional: PostHog setup (or wire it by hand via the PostHog MCP)
```

When to use which skill:
- [[USE SKILL: ui-ux-pro-max]] when choosing or checking layout, spacing, type scale and component states. It is a reference, not a source of new styles; `DESIGN_SYSTEM.md` wins on any conflict.
- [[USE SKILL: impeccable]]: `critique` before building a page, `polish` after, `audit` before every merge that touches UI.
- [[USE SKILL: frontend-design]] (optional) when crafting individual components.
- [[USE SKILL: stop-slop]] while drafting any prose, and [[USE SKILL: humanizer]] before committing it (see "No AI slop" below). Both are vendored in `.claude/skills/`.
- [[USE SKILL: add any SEO or analytics skill here]]

MCP servers available to you: **Cloudflare** (DNS, Workers, Pages, D1, R2, settings), **PostHog** (events, dashboards, insights, surveys) and **GitHub**.

---

## No AI slop (Srihari, 2026-10-29)

Nothing Stackvenn publishes may read as machine-made. Two vendored skills (`.claude/skills/`, pinned in `.claude/skills/VENDORED.md`) and one CI check enforce it.

- **While drafting** any prose (Explained pieces, Analysis, Briefs, Terms, standfirsts, summaries, UI copy, newsletter issues, distribution posts, PR and issue bodies): follow [[USE SKILL: stop-slop]]. Score the draft on its 5 dimensions; **below 35/50, revise** before showing anyone.
- **Before any prose is committed:** run [[USE SKILL: humanizer]] over it (file mode for content files). It keeps every fact and adds none, which matches golden rule 2.
- **CI:** `npm run slop` (inside `npm run check`) fails on strong tells: chatbot residue, staged run-ups, one-line closers, "not X but Y", stock AI words, the MARKETING_AUTOMATION banned phrases, em/en dashes in our copy, and the retired words "essay/guide/field note" in UI copy. It self-tests on every run.
- **Quoted third-party text** (a publisher's blurb, a quotation) is wrapped in `<!-- slop-ignore: reason -->` … `<!-- /slop-ignore -->` in .astro files, with the reason stated. Never use it for our own copy.
- **Srihari's own words are exempt.** Migrated story bodies (`migrated: true`) and anything he writes in `/admin` keep his voice, dashes included; MIGRATION.md §3 governs them. Never "humanize" his text. Headlines and standfirsts of migrated stories are still checked, because Claude edits those.
- **Conflicts:** `docs/VOICE.md` (once written) beats both skills. Humanizer's "keep the writer's voice" beats stop-slop's absolutes (for example "no adverbs at all" is a check, not a rule for his voice).

## Merge policy and living docs (Srihari, 2026-10-29)

- **Code, design and infra PRs:** Claude may merge them once CI is fully green and, for any PR that touches UI, the Impeccable `audit` is clean.
- **Content PRs** (new or migrated articles): only Srihari merges. That includes every pull request the `/admin` writing desk opens (branches `cms/*`): Claude never merges, edits or closes those. Saves Srihari makes himself in the `/admin` writing desk count as his approval.
- **Living docs:** when a decision changes the plan, update every affected doc (PRD, DESIGN, DESIGN_SYSTEM, REACHABILITY, MARKETING_AUTOMATION, MIGRATION) and `docs/TODO.md` in the **same PR**. TODO.md always reflects reality: tick what's done, add new items, and strike items that no longer apply (`~~item~~`, with a one-line reason).
- **Toolchain:** Node is pinned in `.nvmrc` (and `engines`); CI reads `.nvmrc`. TypeScript stays on 6.x until `@astrojs/check` and `typescript-eslint` support 7.

## How to work on any task

1. Read the relevant doc sections. Restate the goal in one line in the PR description.
2. Make small branches and small PRs. Use a conventional commit message.
3. Run `npm run check` (astro check, lint, types), `npm run build`, Pagefind indexing and Playwright screenshots at 390, 768 and 1440px in both themes.
4. Run the Impeccable `audit` on any UI change, and an axe accessibility run.
5. Update `docs/TODO.md` checkboxes and `docs/CHANGELOG.md`.
6. If a step needs a human (account creation, login, CAPTCHA, payment), open a GitHub issue labelled `human` with exact click-by-click steps, then continue with other work.

## Definition of done (for every page or feature)

- Both themes pass contrast checks (see the ratios in `DESIGN_SYSTEM.md`).
- Keyboard-only use works and focus is visible.
- Per-page title, description, canonical, Open Graph image and JSON-LD are present and valid.
- No console errors, and no layout shift from fonts or images.
- The page appears in `sitemap.xml`; content pages also appear in `llms.txt` and in RSS.
