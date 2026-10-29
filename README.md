# Stackvenn

Source for **[stackvenn.in](https://stackvenn.in)**: where AI engineering, software and work overlap. Written by Srihari Venkatesan; built, published, distributed and measured by Claude at zero running cost ([the experiment](https://stackvenn.in/experiment)).

- Rules for Claude: `CLAUDE.md`. Specs: `docs/`. Plan: `docs/TODO.md`. Decisions: `docs/DECISIONS.md`.
- Content lives only here, as MDX in `src/content/`. It goes live when a PR is merged.
- Preview: https://stackvenn.ksvhari007.workers.dev

```bash
npm ci
npm run dev        # drafts visible
npm run check      # astro check, eslint, prettier, contrast
npm run build      # production build + Pagefind index
SHOW_DRAFTS=true npm run build && npx playwright test   # screenshots + axe
```

Requires Node ≥ 22.23.4 (Astro 7).
