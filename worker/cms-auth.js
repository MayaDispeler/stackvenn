// GitHub OAuth for the /admin writing desk (Decap CMS), so login needs no third-party service.
//   GET /api/auth      → redirect to GitHub with a random state (also set as a short-lived cookie)
//   GET /api/callback  → check state, swap the code for a token, hand it to the opener page
// The token is posted only to the same origin that served /admin, and only after that page asks.
// Needs GITHUB_CLIENT_ID (wrangler var) and GITHUB_CLIENT_SECRET (wrangler secret); see the setup issue.

const STATE_COOKIE = 'cms_state';
const SCOPE = 'public_repo';

/** @param {string} body @param {number} status */
const html = (body, status = 200) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">${body}`,
    {
      status,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex, nofollow',
      },
    },
  );

/** Decap's popup handshake: announce, wait for the opener, then post the result to that origin only. */
function handshake(origin, status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  // Escape "<" so a value can never close the script element.
  const msg = JSON.stringify(message).replace(/</g, '\\u003c');
  const org = JSON.stringify(origin).replace(/</g, '\\u003c');
  return html(`<p>Signing you in…</p><script>
(function () {
  var origin = ${org};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(${msg}, origin);
    window.removeEventListener('message', receive);
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', origin);
})();
</script>`);
}

/** @param {Request} request @param {{ GITHUB_CLIENT_ID?: string, GITHUB_CLIENT_SECRET?: string }} env */
export async function cmsAuth(request, env, fetchImpl = fetch) {
  const url = new URL(request.url);
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return html(
      '<p>The writing desk login is not set up yet. See the setup issue on GitHub.</p>',
      503,
    );
  }

  if (url.pathname === '/api/auth') {
    const state = crypto.randomUUID();
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
    authorize.searchParams.set('scope', SCOPE);
    authorize.searchParams.set('state', state);
    return new Response(null, {
      status: 302,
      headers: {
        location: authorize.href,
        'set-cookie': `${STATE_COOKIE}=${state}; Path=/api; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
        'cache-control': 'no-store',
      },
    });
  }

  // /api/callback
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = (request.headers.get('cookie') ?? '')
    .split(';')
    .map((c) => c.trim().split('='))
    .find(([k]) => k === STATE_COOKIE)?.[1];
  if (!code || !state || !cookie || state !== cookie) {
    return handshake(url.origin, 'error', {
      message: 'Login expired or was tampered with. Please try again.',
    });
  }

  const res = await fetchImpl('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });
  const data = /** @type {{ access_token?: string, error_description?: string }} */ (
    await res.json().catch(() => ({}))
  );
  if (!data.access_token) {
    return handshake(url.origin, 'error', {
      message: data.error_description ?? 'GitHub did not return a token.',
    });
  }
  return handshake(url.origin, 'success', { token: data.access_token, provider: 'github' });
}
