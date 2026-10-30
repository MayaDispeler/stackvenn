# Design — Page layouts and behaviour

All visuals come from `DESIGN_SYSTEM.md`. This file describes **what goes where and how it behaves**.
Before building a page, run [[USE SKILL: impeccable]] `critique` against the wireframe below. After building, run `polish` and then `audit`.

**Editorial bar** (Srihari, 2026-10-29): a publication like Medium, The Hindu, The Economic Times or Deccan Chronicle. Newspaper hierarchy without newspaper clutter. Rules and type do the work; no cards in grids. Vocabulary: section, kicker, headline, standfirst, byline, dateline, pull quote.

---

## 1. Global shell

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ◐◑ Stackvenn   AI  Engineering  Careers  Work  Life  Society   [⌕ Search ⌘K] ☀☾▢ [Subscribe] │
└──────────────────────────────────────────────────────────────────────────────┘
```
- The nav is the six **sections**. Formats (Explained, Analysis, Opinion, Column, Brief) never appear in the nav.
- Sticky header, 60px, `--bg` with a 1px bottom border once scrolled; it hides on scroll down and shows on scroll up (mobile only).
- ≥1200px: full search field + 3-segment theme toggle. 960–1199px: search icon; the theme toggle moves into the menu (critique fix). <960px: logo, search icon and menu button opening a full-height drawer with sections, columns, Explained, theme toggle and Subscribe.
- Subscribe in the header uses the Primary (cream) style. The accent fill is reserved for the newsletter submit.
- The theme is set before first paint by an inline script that reads localStorage, to avoid a flash.
- Footer: sections, columns, Explained, RSS, newsletter, iamsrihari.com, "Built and run by Claude: see the experiment".

---

## 2. Front page: a newspaper front, quiet

Job: within 5 seconds, a visitor knows what Stackvenn is, sees what's important today, and opens one story.

```
┌───────────────────────────────────── 1280 ─────────────────────────────────────┐
│ ◐◑ STACKVENN                                         Thursday, 29 October 2026 │  masthead
│ Where AI engineering, software and work overlap.                        (IST) │
├════════════════════════════════════════════════════════════════════════════════┤  heavy rule
│ LEAD STORY                                   │ TOP STORIES                      │
│ [ image 16:10 ]                              │ KICKER                           │
│ KICKER                                       │ Headline two lines               │
│ Big headline in Newsreader display           │ ──────────────────────────────── │
│ Standfirst, two or three lines of italic     │ KICKER                           │
│ By Srihari Venkatesan · 29 Oct · 9 min       │ Headline                         │
│                                              │ ──────────────────────────────── │
│                                              │ (3–4 items)                      │
├──────────────────────────────────────────────┴──────────────────────────────────┤
│ AI ─────────────────────────────────────────────────────────────── More in AI → │  section band
│ [img] Headline + standfirst │ Headline + standfirst │ Headline + standfirst     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ CAREERS ─────── … (one band per section that has stories)                       │
├──────────────────────────────────────────────┬──────────────────────────────────┤
│ EXPLAINED strip: 3–4 headlines, level chips  │ MOST READ  1–5, numbered         │
├──────────────────────────────────────────────┴──────────────────────────────────┤
│ 2 AM · column block: name, one line, latest 3 headlines                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Newsletter: "Get one useful note a week"  [ email ] [Subscribe]                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Masthead:** Venn mark + "Stackvenn" wordmark, the date in IST (`Asia/Kolkata`, written at build and refreshed on the client so it's never stale), and the one-line promise (issue #7 decides the final line). The masthead is the page's only H1. The Venn animates together once on first load (400ms), and never delays LCP.
- **Lead story + Top stories:** editor-picked in `src/data/frontpage.json` (`lead`, `top`), falling back to the newest stories. The lead gets the image; top stories are text only, separated by hairlines.
- **Section bands:** a section label with a full-width rule and a "More in <Section> →" link, then up to 3 stories in columns (one with an image). Only sections with stories render. Bands are separated by rules, never boxes.
- **Most read:** `frontpage.json` `mostRead` (editor picks) until PostHog data exists, then refreshed at build. Numbered 1–5 in tabular mono numerals.
- **Explained strip** and **2 AM column block:** typographic lists, no cards.
- **Newsletter:** the only accent fill on the page (submit button).
- Below 960px everything stacks in this order: masthead, lead, top stories, sections, Most read, Explained, 2 AM, newsletter.
- Masthead height is driven by its content, never `100vh`.

---

## 3. Story page (Analysis, Opinion, Column, Brief)

```
              WORK ── 2 AM                              (section · kicker)
              The Headline Set in Newsreader Display
              Standfirst in italic, the one sentence that sells the read.
              ◐ AI × Work
              [avatar] By Srihari Venkatesan · Chennai, 12 Oct 2026 · Updated 20 Oct · 9 min read
              [share: link  in  x  bsky  whatsapp  email]
              ───────────────────────────────────────────
              Body in Newsreader 19/1.7, 680px column …
              Pull quote: Newsreader italic 1.6rem, 2px accent left rule
              Sidenotes float right at ≥1200px; otherwise inline footnotes
              ───────────────────────────────────────────
              Sources (numbered list, when present)
              Author box · Newsletter block
              More in Work (3 stories) · Most read
              [Load comments]  (Giscus loads on click)
```
- **Share row** (built 2026-10-30): text labels, not brand icons: Copy link · LinkedIn · X · WhatsApp · Email, as plain intent links (no SDKs). It sits under the byline and again at the end.
- **Sidenotes:** at ≥1200px each footnote also appears in the right margin beside its reference (aria-hidden); the footnote list stays for assistive tech.
- **Figures:** an image followed by an italic line becomes a figure with a caption at build (rehype-figure).
- **End of story:** share row, author box, comments ("Comments open soon" until Giscus, issue #6), then "More in <Section>" (3) and "Editor's picks" (the label becomes "Most read" only when PostHog has real data).
- The kicker row shows the section (link to its front) and the kicker: the format label, or the column name linking to `/columns/<column>`.
- The progress bar is fixed to the viewport top. The share row repeats at the end; there's no floating share bar.
- **Brief** uses a smaller headline (h1 size) and a roman (non-italic) standfirst.
- **Migrated stories** look exactly like new ones. At the end, one muted plain-text line: "First published on LinkedIn, Jan 2026. Revised for Stackvenn." Text only, no link to the other platform.

---

## 4. Explained page (docs layout; feature parity with a modern help centre)

```
┌──────────────┬───────────────────────────────────────────┬──────────────┐
│[Paths|All]   │ EXPLAINED · AI                (kicker)    │ ON THIS PAGE │
│              │ Build an MCP server in an afternoon (H1)  │ ▍Before you… │
│ AI ▾         │ Standfirst in muted Schibsted.            │  1. Set up   │
│  What is MCP │ [Level|Intermediate][Updated|12 Oct]      │  2. Tools    │
│ ▍Build MCP   │ [Tested with|Claude Opus 5.5]             │  3. Evaluate │
│  Tool design │            [⧉ Copy Markdown] [Open in ▾]  │  Where next  │
│ Engineering ▸│ ┌ EXPLAINED IN 60 SECONDS ──────────────┐ │              │
│ Work ▸       │ │ • three to five one-line takeaways    │ │              │
│              │ └───────────────────────────────────────┘ │              │
│              │ ## Before you begin                       │              │
│              │ ## 1. Set up the project                  │              │
│              │  ① step  ② step  ③ step                   │              │
│              │ [Tip callout]   Go deeper → linked piece  │              │
│              │ ← Prev in path        Next in path →      │              │
│              │ Was this helpful? 👍 👎 · Edit on GitHub  │              │
└──────────────┴───────────────────────────────────────────┴──────────────┘
```
- ≥1200px: three columns. 960–1199px: sidebar + content; the TOC is a collapsible "On this page" bar. <960px: the sidebar is a disclosure ("All Explained") under the header.
- The sidebar is sticky but never scrolls on its own: only the active section is expanded (no nested scroll).
- **Paths** view: curated ordered paths (`series`). **All Explained** view: grouped by section. The choice is remembered.
- **"Explained in 60 seconds"** box: 3–5 takeaways from the `summary` frontmatter, on `--surface`, directly under the meta row.
- "Open in ▾" builds URLs such as `https://claude.ai/new?q=` and `https://chatgpt.com/?q=`, with the prompt "Read https://stackvenn.in/… and help me apply it to my project." Verify each tool's query parameter when building, and drop any that no longer prefill.
- "Copy Markdown" fetches `<url>.md` and copies it, falling back to selecting the text.
- Every heading gets a hover "#" anchor. Pressing `/` focuses search.
- **Terms** (`/terms/<slug>`) use this layout without the sidebar paths: definition in the first sentence, an example, "Related terms" and "Used in".

---

## 5. Other pages

- **Section front** (`/<section>`): the section name as a large title, its one-line description, a lead story (image, headline, standfirst), then a rule-separated list. Paginated at `/<section>/page/<n>` with "Newer" / "Older" links. 10 stories per page after the lead; page 2 onward is titled "<Section>, page <n>". **Empty sections** show "The first <Section> stories are being written.", links to the sections that do have stories (with counts) and RSS, never a blank page.
- **Explained hub** (`/explained`): pieces grouped by section, with level and "Tested with".
- **Column page** (`/columns/2-am`): column name, one line about it, all pieces newest first.
- **Author page** (`/author/srihari-venkatesan`): portrait, a short bio, the expertise list with proof links (projects, talks, book), a "Hire / work with me" link to iamsrihari.com, all stories, and Person JSON-LD.
- **About** (`/about`): what Stackvenn is, how it's run, the editorial standards (sources, corrections, AI's role).
- **Newsletter:** promise, a past-issues list (each issue has a crawlable web page), and the form.
- **/experiment:** "This site is built and run by Claude." Live counters strip (stories, subscribers, weekly engaged reads; built at deploy from PostHog and D1), the automation diagram, and monthly reports. It is also the press and Hacker News hook.
- **Terms index** (`/terms`): A–Z.
- **Writing desk** (`/admin`): the CMS editor, `noindex`, excluded from the sitemap.
- **404:** "That page moved or never existed." Search box and 5 most-read stories.

---

## 6. Microcopy

Write plainly and from the reader's side. Use active voice.
- Subscribe success: "Check your inbox to confirm. One click and you're in."
- Copy Markdown: toast "Copied as Markdown".
- Empty search: "No match for 'x'. Try a broader term, or browse the sections."
- Newsletter error: "That email doesn't look right. Check it and try again."
- Never say "Welcome to my blog", "In today's fast-paced world" or "Unlock".

---

## 7. Responsive checklist

Test at 360, 390, 768, 1024, 1280 and 1440px, in both themes. There must be no horizontal page scroll; only code blocks and tables may scroll inside themselves. Touch targets are at least 44px. The sticky header must not cover anchor targets (`scroll-margin-top: 80px`).
