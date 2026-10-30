// Edge Worker in front of the static site. It only runs for pages and robots.txt
// (wrangler.jsonc `run_worker_first`); hashed assets go straight to the asset server, free.
//
// 1. Until a host is the production domain, nothing on it may be indexed: every response gets
//    `X-Robots-Tag: noindex, nofollow` and robots.txt disallows everything. That covers the
//    *.workers.dev preview, `wrangler dev`, and any other hostname that ever reaches this Worker.
// 2. The asset server answers `/x/` with a temporary 307; search engines need a permanent 301.
// 3. Pages are cached for an hour with stale-while-revalidate (REACHABILITY §2). Hashed assets
//    get their immutable header from public/_headers, so the two never stack.

import { cmsAuth } from './cms-auth.js';

/** Hosts that are allowed to be indexed. Everything else is a preview. */
export const PRODUCTION_HOSTS = new Set(['stackvenn.in']);

export const PREVIEW_ROBOTS = 'User-agent: *\nDisallow: /\n';
export const PAGE_CACHE = 'public, max-age=3600, stale-while-revalidate=86400';

/** @param {string} hostname */
export function isProduction(hostname) {
  return PRODUCTION_HOSTS.has(hostname.toLowerCase());
}

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: { fetch: (r: Request) => Promise<Response> }, GITHUB_CLIENT_ID?: string, GITHUB_CLIENT_SECRET?: string }} env
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    const production = isProduction(url.hostname);

    // Writing desk login (Decap CMS, GitHub OAuth).
    if (url.pathname === '/api/auth' || url.pathname === '/api/callback') {
      return cmsAuth(request, env);
    }

    if (!production && url.pathname === '/robots.txt') {
      return new Response(PREVIEW_ROBOTS, {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'x-robots-tag': 'noindex, nofollow',
          'cache-control': 'no-store',
        },
      });
    }

    const res = await env.ASSETS.fetch(request);
    let out;
    if (res.status === 307 && url.pathname.endsWith('/') && url.pathname !== '/') {
      out = new Response(null, {
        status: 301,
        headers: { location: res.headers.get('location') ?? '/' },
      });
    } else {
      out = new Response(res.body, res);
      if ((out.headers.get('content-type') ?? '').includes('text/html')) {
        out.headers.set('cache-control', PAGE_CACHE);
      }
    }
    // Previews are never indexed, and neither is the writing desk on any host.
    if (!production || url.pathname.startsWith('/admin'))
      out.headers.set('x-robots-tag', 'noindex, nofollow');
    return out;
  },
};
