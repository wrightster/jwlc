import type { APIRoute } from 'astro';

// Environment-aware robots.txt. Production (Astro.site === the real host) allows
// all crawlers and points to the sitemap; any non-production build blocks
// everything so staging never gets indexed. JWLC is live on its production host
// today, so this serves the allow-list form.

const PROD_HOST = 'juliewrightlandcompany.com';

export const GET: APIRoute = ({ site }) => {
  const isProduction = site?.host === PROD_HOST;

  const body = isProduction
    ? `User-agent: *\nAllow: /\n\nSitemap: https://${PROD_HOST}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
