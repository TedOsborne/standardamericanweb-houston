const LARGE_GIFS = new Set([
  '/matias-sandbox/assets/img/gifs/car-detail-02-gif.gif',
  '/matias-sandbox/assets/img/gifs/real-estate.gif',
  '/nonspecific-products-sandbox/assets/images/shopify/shopify-gif.gif',
  '/nonspecific-products-sandbox/assets/images/shopify/uzno98kckrjcr7qy3no4.gif',
  '/nonspecific-products-sandbox/assets/images/wordpress/wordpress-gif.gif',
]);

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    if (!LARGE_GIFS.has(pathname)) return env.ASSETS.fetch(request);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    const upstream = await fetch(
      `https://raw.githubusercontent.com/TedOsborne/standardamericanweb-houston/main/large-assets${pathname}`,
      { method: request.method },
    );
    if (!upstream.ok) return new Response('Media unavailable', { status: 502 });
    const headers = new Headers({
      'Content-Type': 'image/gif',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    });
    const length = upstream.headers.get('content-length');
    if (length) headers.set('Content-Length', length);
    return new Response(request.method === 'HEAD' ? null : upstream.body, { status: 200, headers });
  },
};
