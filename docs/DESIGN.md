# Design — Page layouts and behaviour

All visuals come from `DESIGN_SYSTEM.md`. This file describes **what goes where and how it behaves**.
Before building a page, run [[USE SKILL: impeccable]] `critique` against the wireframe below. After building, run `polish` and then `audit`.

---

## 1. Global shell

```
┌───────────────────────────────────────────────────────────────────────┐
│ ◐◑ Stackvenn   Guides  Essays  Notes  Topics▾  About   [⌕ Search ⌘K] ☀☾▢ [Subscribe] │
└───────────────────────────────────────────────────────────────────────┘
```
- Sticky header, 60px, `--bg` with a 1px bottom border once scrolled; it hides on scroll down and shows on scroll up (mobile only).
- Mobile: logo, search icon, menu button. The menu opens a full-height drawer with nav, topics, theme toggle and Subscribe.
- The theme is set before first paint by an inline script that reads localStorage, to avoid a flash.

---

## 2. Home: simple and powerful (Medium-like)

Job: within 5 seconds, a visitor understands what Stackvenn is and opens one post.

```
┌──────────────────────────────── 1280 ────────────────────────────────┐
│  [Venn animates together once]                                       │
│  Field notes where AI, engineering and work overlap.      (display)  │
│  From an engineer who ships agentic AI in production.     (dek)      │
│  [ your@email.com            ] [Subscribe]   12-min reads, weekly    │
├──────────────────────────────────────────────┬───────────────────────┤
│ Latest · Guides · Essays · Notes             │ START HERE            │
│ ──────────────────────────────────────────── │ 1 What MCP really is  │
│ [FEATURED card: cover right, title, dek]     │ 2 Your first eval     │
│ ──────────────────────────────────────────── │ 3 Token budgets       │
│ ◐ AI × Work                                  │                       │
│ Title of the post in bold            [thumb] │ TOPICS (chips)        │
│ Two-line dek in muted text …                 │ Agentic · Retrieval … │
│ 12 Oct · 9 min · Guide                       │                       │
│ ──────────────────────────────────────────── │ NEWSLETTER block      │
│ (repeat ×10)                                 │                       │
│ [ ← Newer ]                   [ Older → ]    │ AUTHOR card           │
└──────────────────────────────────────────────┴───────────────────────┘
```
- The tabs are real links (`/`, `/guides/`, `/essays/`, `/notes/`), styled as tabs. The rail stacks under the feed below 960px.
- Masthead copy is final unless Srihari edits it. Masthead height is driven by its content, never `100vh`.
- Thumbnails: the post cover, or the generated OG image cropped square.

---

## 3. Essay and field note

```
              ◐ AI × Work · Essay
              The Title Set in Newsreader Display
              Italic dek sentence that tells you why to read.
              [avatar] Srihari Venkatesan · 12 Oct 2026 · Updated 20 Oct · 9 min
              [share: link  in  x  bsky  whatsapp]
              ───────────────────────────────────────────
              Body in Newsreader 19/1.7, 680px column …
              Pull quote: Newsreader italic 1.6rem, 2px accent left rule
              Sidenotes float right at ≥1200px; otherwise inline footnotes
              ───────────────────────────────────────────
              Sources (numbered list, when present)
              Author card · Newsletter block
              Related (3 feed items) · Prev/Next in series
              [Load comments]  (Giscus loads on click)
```
- The progress bar sits under the header. The share row repeats at the end; there is no floating share bar.
- Field notes use the same layout with a smaller title (h1 size) and no dek italics.
- **Migrated posts** look exactly like new ones. At the end, show one muted plain-text line: "First published on LinkedIn, Jan 2026. Revised for Stackvenn." It is text only, with no link to the other platform.
- **2 AM column posts** show a small "2 AM" eyebrow (mono, uppercase) and link to `/series/2-am`.

---

## 4. Guide (docs layout; feature parity with a modern help centre)

```
┌──────────────┬───────────────────────────────────────────┬──────────────┐
│[Paths|All]   │ AGENTIC SYSTEMS (eyebrow)                 │ ON THIS PAGE │
│              │ Build an MCP server in an afternoon (H1)  │ ▍Before you… │
│ Agentic ▾    │ Dek in muted Schibsted.                   │  1. Set up   │
│  What is MCP │ [Level|Intermediate][Updated|12 Oct]      │  2. Tools    │
│ ▍Build MCP   │ [Tested with|Claude Opus 5.5]             │  3. Evaluate │
│  Tool design │            [⧉ Copy Markdown] [Open in ▾]  │  Where next  │
│ Retrieval ▸  │ ───────────────────────────────────────── │              │
│ Evals ▸      │ Intro paragraph …                         │              │
│ Cost ▸       │ ## Before you begin                       │              │
│ Shipping ▸   │ ## 1. Set up the project                  │              │
│ Work ▸       │  ① step  ② step  ③ step                   │              │
│              │ [Tip callout]                             │              │
│              │ Go deeper → linked guide                  │              │
│              │ ─────────────────────────────────────────│              │
│              │ ← Prev in path        Next in path →      │              │
│              │ Was this helpful? 👍 👎 · Edit on GitHub  │              │
└──────────────┴───────────────────────────────────────────┴──────────────┘
```
- **Paths** view: curated ordered learning paths (series). **All guides** view: the tree grouped by pillar. The choice is remembered.
- "Open in ▾" builds URLs such as `https://claude.ai/new?q=` and `https://chatgpt.com/?q=`, with the URL-encoded prompt "Read https://stackvenn.in/… and help me apply it to my project." Verify the query-parameter format of each tool when building, and drop any that no longer prefill.
- "Copy Markdown" fetches `<url>.md` and copies it, falling back to selecting the text.
- Every heading gets a hover "#" anchor. Pressing `/` focuses search.
- Below 960px: the sidebar becomes a drawer opened from an "All guides" button under the header; the TOC becomes a collapsible bar.

---

## 5. Other pages

- **Topic hub** (`/topics/<pillar>`): pillar intro (150 words, written for search), a "Start with" list of 3 guides, then the full feed filtered to the pillar.
- **Series:** ordered list with progress dots (read state in localStorage).
- **About:** portrait, a short story, the expertise list with proof links (projects, talks, book), a "Hire / work with me" link to iamsrihari.com, and Person JSON-LD.
- **Newsletter:** promise, a past-issues list (each issue has a web page, which is crawlable), and the form.
- **/experiment:** "This site is built and run by Claude." It shows a live counters strip (posts, subscribers, weekly engaged reads; built at deploy from PostHog and D1), the automation diagram, and monthly reports. It is also the press and Hacker News hook.
- **Glossary:** an A–Z index; each term page has a definition in the first sentence, an example, "Related terms" and a "Used in" guide list.
- **404:** "That page moved or never existed." It shows a search box and 5 popular posts.

---

## 6. Microcopy

Write plainly and from the reader's side. Use active voice.
- Subscribe success: "Check your inbox to confirm. One click and you're in."
- Copy Markdown: toast "Copied as Markdown".
- Empty search: "No match for 'x'. Try a broader term, or browse topics."
- Newsletter error: "That email doesn't look right. Check it and try again."
- Never say "Welcome to my blog", "In today's fast-paced world" or "Unlock".

---

## 7. Responsive checklist

Test at 360, 390, 768, 1024, 1280 and 1440px, in both themes. There must be no horizontal page scroll; only code blocks and tables may scroll inside themselves. Touch targets are at least 44px. The sticky header must not cover anchor targets (`scroll-margin-top: 80px`).
