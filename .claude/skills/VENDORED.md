# Vendored skills

Copied verbatim (MIT) so every Claude session on this repo, including GitHub Actions runs, loads the same version. Update by re-copying from upstream and changing the pinned commit here in the same PR.

| Skill | Upstream | Pinned commit | Added | Use it for |
|---|---|---|---|---|
| `humanizer` | https://github.com/blader/humanizer | `0ef9fe5bc3572734fd3ae6c448fe00a30cd5dcf0` | 2026-10-29 | The editing pass. 26 patterns from Wikipedia's "Signs of AI writing"; keeps meaning and voice; never adds facts. |
| `stop-slop` | https://github.com/hardikpandya/stop-slop | `8da1f030185bdfe8471220585162991eaeb970e9` | 2026-10-29 | The drafting checklist and the 50-point score (revise below 35). |

How Stackvenn applies them is in `CLAUDE.md` → "No AI slop". `scripts/check-slop.mjs` enforces the strongest patterns in CI.
