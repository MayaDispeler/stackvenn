# Design System — Stackvenn

Source palette: **Combination 16, Shift 1** (near-black `#0A0A0A`, warm cream `#E6D5BD`, red-orange `#D5360C`). This is the same palette as iamsrihari.com, so the two sites read as one family.

Character: **a warm, quiet reading room with one hot wire.** Cream type on near-black, generous space, and a single red-orange accent that marks the overlap: the point where two stacks meet.

Implement every value here as tokens in `src/styles/tokens.css`. Components never use raw values.

---

## 1. Brand mark: the Venn

- Two overlapping circles of equal size, overlapping by 40% of the diameter.
- Left circle: 1.5px stroke in `--text`. Right circle: 1.5px stroke in `--accent`. The lens where they overlap: solid `--accent`.
- Use it as: the logo (with "Stackvenn" set in Schibsted Grotesk 600), the favicon (lens only), the topic-overlap chip, section-band dividers on the front page (small, 16px) and the loading state of search.
- Never animate it in a loop. Never fill both circles.

**Overlap chip** (the signature component): a mini Venn (14px) plus the label `AI × Work`. Every story shows its two stacks this way, in the byline block.

---

## 2. Colour tokens

Dark is the default theme. Light is available through the toggle and "System".

```css
:root, :root[data-theme="dark"] {
  color-scheme: dark;
  --bg:            #0A0A0A;  /* page */
  --surface:       #131211;  /* cards, sidebars, inputs */
  --raised:        #1B1917;  /* menus, modal, hover rows */
  --border:        #2C2824;  /* hairlines */
  --border-strong: #3D3832;  /* inputs, focusable outlines */
  --border-control:#6D655A;  /* input and control outlines, 3.45:1 (added 2026-10-29, WCAG 1.4.11) */
  --text:          #E6D5BD;  /* headings, primary copy      13.8:1 on bg */
  --text-soft:     #BDB09C;  /* article body                 9.3:1 on bg */
  --text-muted:    #948A7B;  /* meta, captions, placeholders 5.8:1 on bg */
  --accent:        #D5360C;  /* fills, marks, lines, large text only (4.1:1) */
  --accent-text:   #F0643A;  /* links and small accent text  6.2:1 on bg */
  --accent-hover:  #E8481C;
  --on-accent:     #FFFFFF;  /* label on accent fill         4.8:1 */
  --code-bg:       #161412;
  --success:       #3FB97A;  /* 7.9:1 */
  --warning:       #E0A93B;  /* 9.3:1 */
  --info:          #7FA7D9;  /* 7.9:1 */
  --selection:     rgba(213, 54, 12, 0.35);
  --focus:         #F0643A;
}

:root[data-theme="light"] {
  color-scheme: light;
  --bg:            #F7F2E8;  /* warm paper */
  --surface:       #FFFCF6;
  --raised:        #EFE7D8;
  --border:        #DDD2BF;
  --border-strong: #C7B9A2;
  --border-control:#8C8273;  /* 3.39:1 */
  --text:          #101010;  /* 17.0:1 */
  --text-soft:     #3A3631;  /* 10.7:1 */
  --text-muted:    #6B6358;  /* 5.3:1 on bg, 4.8:1 on raised */
  --accent:        #D5360C;  /* fills and marks */
  --accent-text:   #B02A06;  /* links  5.9:1 */
  --accent-hover:  #B02A06;
  --on-accent:     #FFFFFF;
  --code-bg:       #F0E9DC;
  --success:       #186A41;
  --warning:       #8A5A00;
  --info:          #2D5B91;
  --selection:     rgba(213, 54, 12, 0.22);
  --focus:         #B02A06;
}
/* "System" applies the light block inside @media (prefers-color-scheme: light) when no data-theme is set. */
```

### Colour rules
- `--accent` is never used for body-size text. Links use `--accent-text` with an underline (1px, offset 3px; 2px on hover).
- **One accent moment per screen region.** For example, the active nav item, one highlighted phrase, or the primary CTA. Not all three in one view.
- Dark mode uses borders, not shadows, for separation. Light mode may use one soft shadow (`0 1px 2px rgb(16 16 16 / .06)`) on raised menus only.
- Images are never filtered or tinted. Cover thumbnails get a 1px `--border` frame so bright covers sit calmly on the dark page.
- Status colours are semantic only (callouts, form states). They never act as brand accents.
- Verify every pair in CI with a contrast script. Fail the build below: body text 7:1, meta 4.5:1, UI borders on inputs 3:1 (use `--border-control`; `--border-strong` is only 1.7:1).

---

## 3. Typography

All three faces are on Google Fonts under the OFL licence. Self-host them through Astro fonts or `@fontsource`, subset to Latin plus Latin-Ext, and use `font-display: swap` with metric-matched fallbacks to avoid layout shift.

| Role | Family | Use |
|---|---|---|
| UI + headings (Explained) | **Schibsted Grotesk** (400, 500, 600, 700) | Nav, buttons, chips, kickers, Explained headings, labels. A newspaper-born grotesk, editorial without being cute. |
| Reading + display (stories) | **Newsreader** (variable, opsz 6–72, 400, 500, italic) | Story body text, headlines (display optical size), standfirsts, pull quotes. Designed for on-screen reading. |
| Mono | **JetBrains Mono** (400, 500) | Code, file names, keyboard hints, the "Tested with" row, data. |

Fallbacks: `"Schibsted Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif`; `"Newsreader", Georgia, "Times New Roman", serif`; `"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace`.

### Type scale (fluid; rem at a 16px root)

| Token | Size | Line height | Usage |
|---|---|---|---|
| `--fs-display` | clamp(2.5rem, 5vw, 3.75rem) | 1.05 | Story headline (Newsreader opsz 72, 500), lead-story headline |
| `--fs-h1` | clamp(2rem, 3.6vw, 2.75rem) | 1.1 | Explained H1 (Schibsted 700, letter-spacing −0.02em), Brief headline |
| `--fs-h2` | 1.625rem | 1.25 | Section heading |
| `--fs-h3` | 1.25rem | 1.35 | Sub-section |
| `--fs-standfirst` | 1.25rem | 1.5 | Standfirst (Newsreader italic for stories; Schibsted 400 `--text-muted` for Explained) |
| `--fs-body` | 1.1875rem (19px) | 1.7 | Article body (Newsreader, `--text-soft`) |
| `--fs-ui` | 0.9375rem (15px) | 1.5 | UI text, list standfirsts |
| `--fs-meta` | 0.8125rem (13px) | 1.4 | Meta rows, captions, chips |
| `--fs-eyebrow` | 0.75rem | 1.2 | Uppercase, letter-spacing 0.12em, Schibsted 600 |
| `--fs-code` | 0.875rem | 1.6 | Code blocks |

Rules: prose measure 62–72 characters; `text-wrap: balance` on headings and `pretty` on paragraphs; tabular numbers in tables and stats; no all-caps outside eyebrows; one weight change per hierarchy step.

---

## 4. Space, layout and shape

- Spacing scale (4px base): `--s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px`.
- Paragraph spacing 1.1em; space above H2 is `--s-8` and below is `--s-4`.
- Containers: page max 1280px. Story column 680px (`--w-story`). Explained content 740px (`--w-explained`). Explained sidebar 264px. TOC 224px. List column 728px plus a 320px rail.
- Side gutter: `max(16px, env(safe-area-inset-left))` (and the right equivalent); 24px from 768px up.
- Breakpoints: 640 / 960 / 1200. Below 960, the Explained sidebar becomes a disclosure and the TOC becomes a collapsible "On this page" bar under the title.
- Radius: `--r-sm: 6px` (chips, code, inputs), `--r-md: 10px` (cards, callouts, modal), `--r-full` (pills, buttons, avatar). Never mix radii within one component.
- Borders: 1px `--border` everywhere. A selected or active state adds a 2px left bar in `--accent` (sidebar and TOC only).

---

## 5. Motion

- Durations: 120ms (hover, press), 200ms (menus, toggles), 320ms (modal, drawer). Easing `cubic-bezier(.2,.7,.2,1)`.
- One orchestrated moment only: on the home page masthead, the two Venn circles slide together and the lens fills once on first load (400ms). Everything else is micro-interaction.
- Respect `prefers-reduced-motion`: no transforms, instant state changes.

---

## 6. Iconography

Lucide icons, 1.5px stroke, 16 or 20px, `currentColor`. No emoji in UI chrome. No icon without a text label, except universally understood ones (search, close, copy, theme), which still need an `aria-label`.

---

## 7. Components

Each component needs these states: default, hover, focus-visible (2px `--focus` ring, 2px offset), active, disabled, and loading where relevant.

**Buttons** (height 40px, padding 0 16px, `--r-full`, Schibsted 600 15px)
- Primary: `--text` fill, `--bg` label (13.8:1). Use it for the one main action per view: Subscribe, Read the story.
- Accent: `--accent` fill, `--on-accent` label. Reserved for the newsletter submit only.
- Secondary: `--surface` fill, 1px `--border-strong`, `--text` label.
- Ghost: transparent, `--text-soft` label; hover fills `--raised`.
- Icon button: 36px square, ghost style.

**Links:** `--accent-text` with an underline. In nav and headline links, links are `--text` with no underline; the hover underline is in `--accent`.

**Chips:** height 26px, `--surface`, 1px `--border`, `--fs-meta`, `--text-soft`. Selected filter: `--text` fill with `--bg` label. Overlap chip: Venn glyph + `AI × Work`.

**Meta badge row** (Explained): small bordered pill groups, each a label + value, separated by a 1px divider, for example `Level | Intermediate`, `Updated | 12 Oct 2026`, `Tested with | Claude Opus 5.5`.

**Action buttons** (Explained): "Copy Markdown" (copy icon, shows a "Copied" toast) and "Open in ▾" (menu: ChatGPT, Claude, Perplexity, View as Markdown). Secondary-button style, 32px tall.

**Kicker row** (stories): section label (`--text`, links to its front) · a 24px `--border-strong` rule · the kicker (format label or column name) in `--accent-text`. All `--fs-eyebrow`, uppercase. This is the header region's one accent moment.

**Story list item** (fronts and lists): kicker (eyebrow, `--text-muted`), headline (Newsreader 500, `--fs-h3`, `--text`), standfirst (`--text-muted`, max 2 lines in bands), meta (section · date · reading time). Hairline divider, no card background. Optional thumbnail on the right (112×112 desktop / 80×80 mobile) with a 1px `--border` frame. Hover underlines the headline in `--accent`.

**Lead story** (front page and section fronts): no card and no surface. Cover image 16:10 with a 1px `--border` frame, kicker, headline in Newsreader display, italic standfirst, byline meta. Type and rules carry the hierarchy (Srihari, 2026-10-29: no cards in grids).

**Section band** (front page): the section label in eyebrow style above a full-width 1px `--text` rule, a "More in <Section> →" link on the right, then up to 3 story list items in columns.

**"Explained in 60 seconds" box:** `--surface`, 1px `--border`, `--r-md`, padding `--s-5`. Eyebrow label "Explained in 60 seconds", then 3–5 bullet lines in `--text` with `--accent` markers.

**Callouts:** `--surface` background, a 3px left border in the semantic colour, an icon and a bold label (Note, Tip, Warning, Danger). Danger uses `--accent`.

**Steps:** numbered with a 28px circle (1px `--border-strong`, number in mono) and a vertical connector line in `--border`. The step title is h3.

**Code block:** `--code-bg`, `--r-sm`, a filename tab in mono `--fs-meta`, a copy button top-right (appears on hover and is always visible on touch), line highlights with a `--selection` background, and a horizontal scroll inside the block only. Use the "github-dark-dimmed" theme in dark mode and "github-light" in light mode, adjusting any token below 4.5:1.

**Sidebar tree:** group header (Schibsted 600 `--fs-ui`, chevron), items `--text-muted` turning `--text` on hover. Active item: `--text`, a 2px `--accent` left bar and a `--raised` background. View switch at top: a two-segment control (Paths | All Explained).

**TOC:** "On this page" label (eyebrow), items `--fs-meta`, active item `--accent-text` with a 2px left bar, scroll-spy driven by IntersectionObserver.

**Search modal:** 640px wide, `--raised`, `--r-md`. Input 52px tall with a search icon and an Esc hint. Results are grouped by type, with the matched term marked using a `--selection` background. Arrow keys move, Enter opens.

**Theme toggle:** a three-segment control (sun, moon, monitor) with aria-pressed, as on the help-centre reference.

**Newsletter block:** `--surface`, `--r-md`. Title "Get one useful note a week", an email input, the accent submit button, and the microcopy "No spam. One click to unsubscribe."

**Reading progress:** a 2px bar at the top in `--accent`; hidden with reduced motion.

**Author card:** 48px avatar (the cream-blazer portrait), name, one-line role, link to /about and iamsrihari.com.

**Toast:** `--text` background, `--bg` text, bottom-centre, 1.6s.

---

## 8. Accessibility

- Skip link; landmarks (header, nav, main, aside, footer); one H1 per page; headings never skip levels.
- 44×44px minimum touch targets; visible focus on every control; menus and the modal trap focus and restore it on close.
- Images need meaningful alt text. Decorative SVGs use `aria-hidden`.
- Respect user font-size settings (rem only); the layout must survive 200% zoom.

---

## 9. Anti-patterns (reject in review)

Purple or blue gradients, glassmorphism, glows on everything, bento grids of identical cards, emoji section markers, centred body text, shadows in dark mode, more than one accent moment per region, Inter as the default face, stock illustrations, fake stats or testimonials, "Welcome to my blog" copy, infinite scroll, autoplay media, cookie walls (PostHog runs cookieless, see REACHABILITY.md).
