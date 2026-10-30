// Preview hosts must never be indexed; stackvenn.in must stay indexable (DECISIONS 2026-10-30).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker, { PAGE_CACHE, PREVIEW_ROBOTS } from '../../worker/index.js';

const PRODUCTION_ROBOTS = 'User-agent: *\nAllow: /\n';

/** A stand-in for the static asset binding, shaped like Workers static assets responses. */
const env = {
  ASSETS: {
    fetch: async (req) => {
      const { pathname } = new URL(req.url);
      if (pathname === '/robots.txt') {
        return new Response(PRODUCTION_ROBOTS, { headers: { 'content-type': 'text/plain' } });
      }
      if (pathname.length > 1 && pathname.endsWith('/')) {
        return new Response(null, { status: 307, headers: { location: pathname.slice(0, -1) } });
      }
      return new Response('<!doctype html><title>x</title>', {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'public, max-age=0, must-revalidate',
          'x-content-type-options': 'nosniff',
        },
      });
    },
  },
};

const get = (url) => worker.fetch(new Request(url), env);

const PREVIEW_HOSTS = [
  'stackvenn.ksvhari007.workers.dev',
  'localhost:8787',
  'www.stackvenn.in',
  'stackvenn.com',
];

for (const host of PREVIEW_HOSTS) {
  test(`preview host ${host}: pages carry noindex, nofollow`, async () => {
    const res = await get(`https://${host}/careers/career-growth-paradox`);
    assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff', 'other headers survive');
  });

  test(`preview host ${host}: robots.txt disallows everything`, async () => {
    const res = await get(`https://${host}/robots.txt`);
    assert.equal(await res.text(), PREVIEW_ROBOTS);
    assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
  });
}

test('preview redirects are noindex too', async () => {
  const res = await get('https://stackvenn.ksvhari007.workers.dev/careers/');
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
});

test('production stackvenn.in: pages have no X-Robots-Tag', async () => {
  const res = await get('https://stackvenn.in/careers/career-growth-paradox');
  assert.equal(res.headers.get('x-robots-tag'), null);
});

test('production stackvenn.in: robots.txt is the real one', async () => {
  const res = await get('https://stackvenn.in/robots.txt');
  assert.equal(await res.text(), PRODUCTION_ROBOTS);
  assert.equal(res.headers.get('x-robots-tag'), null);
});

test('production host match ignores case', async () => {
  const res = await get('https://StackVenn.IN/');
  assert.equal(res.headers.get('x-robots-tag'), null);
});

test('trailing slash: the 307 becomes a permanent 301', async () => {
  const res = await get('https://stackvenn.in/careers/');
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), '/careers');
});

test('pages get the one-hour cache header, replacing the asset default', async () => {
  const res = await get('https://stackvenn.in/careers');
  assert.equal(res.headers.get('cache-control'), PAGE_CACHE);
});
