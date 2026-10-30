// Writing-desk login (worker/cms-auth.js): state is checked, the token only goes to the same origin,
// and nothing in the response can break out of its script element.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cmsAuth } from '../../worker/cms-auth.js';
import worker from '../../worker/index.js';

const ENV = { GITHUB_CLIENT_ID: 'client-123', GITHUB_CLIENT_SECRET: 'secret-456' };
const ORIGIN = 'https://stackvenn.ksvhari007.workers.dev';
const tokenFetch = (body) => async () =>
  new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });

test('without credentials the endpoints say login is not set up (503)', async () => {
  const res = await cmsAuth(new Request(`${ORIGIN}/api/auth`), {});
  assert.equal(res.status, 503);
});

test('/api/auth redirects to GitHub with client id, scope, callback and a state cookie', async () => {
  const res = await cmsAuth(new Request(`${ORIGIN}/api/auth`), ENV);
  assert.equal(res.status, 302);
  const to = new URL(res.headers.get('location'));
  assert.equal(to.origin + to.pathname, 'https://github.com/login/oauth/authorize');
  assert.equal(to.searchParams.get('client_id'), 'client-123');
  assert.equal(to.searchParams.get('scope'), 'public_repo');
  assert.equal(to.searchParams.get('redirect_uri'), `${ORIGIN}/api/callback`);
  const state = to.searchParams.get('state');
  assert.ok(state && state.length > 20);
  assert.match(res.headers.get('set-cookie'), new RegExp(`cms_state=${state};.*HttpOnly; Secure`));
});

test('a callback whose state does not match the cookie is refused', async () => {
  const req = new Request(`${ORIGIN}/api/callback?code=abc&state=one`, {
    headers: { cookie: 'cms_state=two' },
  });
  const body = await (await cmsAuth(req, ENV, tokenFetch({ access_token: 'never' }))).text();
  assert.match(body, /authorization:github:error/);
  assert.doesNotMatch(body, /never/);
});

test('a valid callback posts the token to the same origin only', async () => {
  const req = new Request(`${ORIGIN}/api/callback?code=abc&state=s1`, {
    headers: { cookie: 'cms_state=s1' },
  });
  const body = await (await cmsAuth(req, ENV, tokenFetch({ access_token: 'gho_token' }))).text();
  assert.match(body, /authorization:github:success/);
  assert.match(body, /gho_token/);
  assert.match(body, new RegExp(`var origin = "${ORIGIN.replace(/[.]/g, '\\.')}"`));
  assert.match(body, /if \(e\.origin !== origin\) return;/);
});

test('a GitHub error is passed on as an error message', async () => {
  const req = new Request(`${ORIGIN}/api/callback?code=abc&state=s1`, {
    headers: { cookie: 'cms_state=s1' },
  });
  const body = await (
    await cmsAuth(req, ENV, tokenFetch({ error_description: 'bad code' }))
  ).text();
  assert.match(body, /authorization:github:error/);
  assert.match(body, /bad code/);
});

test('values cannot close the script element', async () => {
  const req = new Request(`${ORIGIN}/api/callback?code=abc&state=s1`, {
    headers: { cookie: 'cms_state=s1' },
  });
  const body = await (
    await cmsAuth(req, ENV, tokenFetch({ error_description: '</script><script>alert(1)</script>' }))
  ).text();
  assert.equal(body.match(/<\/script>/g)?.length, 1, 'only the real closing tag');
});

test('/admin is noindex even on stackvenn.in', async () => {
  const env = {
    ASSETS: {
      fetch: async () =>
        new Response('<!doctype html>', { headers: { 'content-type': 'text/html' } }),
    },
  };
  const res = await worker.fetch(new Request('https://stackvenn.in/admin/'), env);
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
});
