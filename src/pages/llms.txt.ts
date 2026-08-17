import type { APIRoute } from 'astro';
import { fetchListings } from '../lib/api';
import { services } from '../data/services';

// /llms.txt — markdown index for language models (llmstxt.org): the site's
// structure plus the live land inventory, so a model can answer "what land does
// JWLC have for sale?" without crawling every page.
//
// SSR, and the fetch is caught: a backend hiccup should thin this file, not 500
// it. JWLC has no src/data/site.ts (unlike JWRG), so the constants are here.
export const prerender = false;

const BASE = 'https://juliewrightlandcompany.com';
const SITE_NAME = 'Julie Wright Land Company';

const PAGES: Array<{ path: string; title: string; note: string }> = [
  { path: '/', title: 'Home', note: 'brokerage overview and featured land listings' },
  { path: '/listings', title: 'Listings', note: 'every active land, farm, and acreage listing' },
  { path: '/services', title: 'Services', note: 'what we do — land brokerage, valuation, and representation' },
  { path: '/about', title: 'About', note: 'the brokerage and the team' },
  { path: '/testimonials', title: 'Testimonials', note: 'client feedback' },
  { path: '/contact', title: 'Contact', note: 'phone, email, office address, and enquiry form' },
];

const money = (v: string | null | undefined): string | undefined => {
  if (!v) return undefined;
  const n = parseFloat(v);
  return Number.isNaN(n) || n <= 0 ? undefined : `$${Math.round(n).toLocaleString('en-US')}`;
};

export const GET: APIRoute = async () => {
  const listings = await fetchListings().catch(() => []);

  const out: string[] = [];
  out.push(`# ${SITE_NAME}`);
  out.push('');
  out.push(
    '> Land brokerage for North Carolina — farms, timber and hunting tracts, homesites, and development acreage. ' +
      'The land-specialist arm of Julie Wright Realty Group.',
  );
  out.push('');
  out.push(
    `${SITE_NAME} sells land rather than houses: acreage, farms, and development tracts across the greater Triangle region ` +
      'and surrounding North Carolina counties. Listings below are read live from our office system each time this file is ' +
      'requested, so they match the site.',
  );
  out.push('');

  out.push('## Pages');
  out.push('');
  for (const p of PAGES) out.push(`- [${p.title}](${BASE}${p.path}): ${p.note}`);
  out.push('');

  if (listings.length) {
    out.push('## Current listings');
    out.push('');
    for (const l of listings) {
      const bits: string[] = [];
      if (l.status_label) bits.push(l.status_label.toLowerCase());
      const price = money(l.status === 'sold' ? (l.sold_price ?? l.list_price) : l.list_price);
      if (price) bits.push(price);
      if (l.lot_size_acres) bits.push(`${l.lot_size_acres} acres`);
      const where = [l.city, l.state].filter(Boolean).join(', ');
      if (where) bits.push(where);
      const name = l.marketing_title || l.address || l.slug;
      out.push(`- [${name}](${BASE}/listings/${l.slug}): ${bits.join(', ')}`);
    }
    out.push('');
  }

  if (services?.length) {
    out.push('## Services');
    out.push('');
    for (const s of services) {
      const title = (s as { title?: string; name?: string }).title ?? (s as { name?: string }).name;
      const desc = (s as { description?: string }).description;
      if (title) out.push(`- ${title}${desc ? `: ${desc}` : ''}`);
    }
    out.push('');
  }

  out.push('## Brokerage');
  out.push('');
  out.push(`- ${SITE_NAME} LLC — NC firm license C29157`);
  out.push('- 10931 Strickland Rd, Ste 111, Raleigh, NC 27615-2085');
  out.push('- Sister brokerage for residential sales: [Julie Wright Realty Group](https://juliewrightrealtygroup.com)');
  out.push('');

  out.push('## Notes');
  out.push('');
  out.push('- Listings here are land and acreage. Residential homes are handled by Julie Wright Realty Group at juliewrightrealtygroup.com.');
  out.push('- Listing data is our own inventory, not the full MLS.');
  out.push('');

  return new Response(out.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
