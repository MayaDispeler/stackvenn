# Costs: every service is on a free tier

Golden rule 1: before adding a service, confirm its free limit on the vendor's own page and record it here with the date checked. The weekly `costs.yml` (Phase 6) warns at 70% and degrades at 90%.

| Service | What we use | Free limit | Source | Checked |
|---|---|---|---|---|
| Cloudflare Workers static assets | Hosting the whole site | Requests to static assets are **free and unlimited**. 20,000 files per Worker version, 25 MiB per file | https://developers.cloudflare.com/workers/platform/pricing/ · /limits/ | 2026-10-29 |
| Cloudflare Workers (dynamic) | Edge Worker for page requests (noindex on preview hosts), Phase 4 newsletter API, PostHog proxy | 100,000 requests/day, 10 ms CPU per invocation | https://developers.cloudflare.com/workers/platform/pricing/ | 2026-10-29 |
| Cloudflare Workers Logs | Debugging | 200,000 log events/day, 3-day retention | https://developers.cloudflare.com/workers/platform/pricing/ | 2026-10-29 |
| Cloudflare DNS zone | stackvenn.in | Free plan, $0 | https://www.cloudflare.com/plans/ | pending (#2) |
| GitHub Actions | CI and all automation | Standard GitHub-hosted runners in **public** repositories are free (larger runners are billed, so never use them) | https://docs.github.com/en/billing/concepts/product-billing/github-actions | 2026-10-29 |
| GitHub Discussions + Giscus | Comments | Free | — | 2026-10-29 |

To add as each phase starts: D1, Turnstile, Resend, PostHog, Cloudflare Web Analytics, Search Console API, Bing Webmaster API, dev.to, Hashnode, Bluesky, Mastodon, LinkedIn, Threads.
