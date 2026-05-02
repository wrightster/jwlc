const BASE_URL = 'https://office.jwrgnc.com/api/v1';

export interface ApiPhotoVariant {
  width: number | null;
  height: number | null;
  jpg: string | null;
  webp: string | null;
  avif: string | null;
}

export interface ApiPhoto {
  id: string;
  order: number;
  caption: string | null;
  alt: string | null;
  is_primary: boolean;
  urls: {
    '400': ApiPhotoVariant;
    '800': ApiPhotoVariant;
    '1200': ApiPhotoVariant;
    '1600': ApiPhotoVariant;
    original: string | null;
  };
}

/**
 * Pick a single jpg URL for a photo at a target width rung.
 * Falls back to `original` if the requested rung hasn't rendered yet
 * (conversions queue async on the office side; URLs may briefly be null).
 */
export function photoSrc(
  photo: ApiPhoto | null | undefined,
  width: 400 | 800 | 1200 | 1600 = 800,
): string | null {
  if (!photo) return null;
  const variant = photo.urls[String(width) as '400' | '800' | '1200' | '1600'];
  return variant?.jpg ?? photo.urls.original;
}

export interface ApiListing {
  id: string;
  slug: string;
  mls_number: string | null;
  marketing_title: string | null;
  status: 'active' | 'coming_soon' | 'pending' | 'under_contract' | 'sold';
  status_label: string;
  featured: boolean;
  property_type: string;
  listing_type: string;
  address: string;
  address_line_2: string | null;
  city: string;
  state: string;
  zip: string;
  county: string;
  latitude: number | null;
  longitude: number | null;
  list_price: string;
  original_price: string | null;
  sold_price: string | null;
  bedrooms: number | null;
  bathrooms_full: number | null;
  bathrooms_half: number | null;
  sqft: number | null;
  lot_size_sqft: number | null;
  lot_size_acres: string | null;
  year_built: number | null;
  garage_spaces: number | null;
  stories: number | null;
  hoa_fee: string | null;
  hoa_frequency: string | null;
  description: string;
  full_description: string | null;
  directions: string | null;
  features: string[];
  virtual_tour_url: string | null;
  list_date: string | null;
  sold_date: string | null;
  days_on_market: number | null;
  agent: { name: string; phone: string } | null;
  primary_photo: ApiPhoto | null;
  photo_count: number;
  // Only present on detail endpoint
  photos?: ApiPhoto[];
  documents?: ApiDocument[];
}

export interface ApiDocument {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  sort_order: number;
  url: string | null;
  expires_at: string | null;
}

export function formatPrice(price: string): string {
  const n = parseFloat(price);
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function formatAcres(acres: string | null): string {
  if (!acres) return '—';
  const n = parseFloat(acres);
  return n % 1 === 0 ? n.toFixed(0) + ' ac' : n + ' ac';
}

function normalizeLabel(listing: ApiListing): ApiListing {
  if (listing.status === 'active') return { ...listing, status_label: 'Available' };
  return listing;
}

export async function fetchListings(perPage = 50): Promise<ApiListing[]> {
  const res = await fetch(`${BASE_URL}/listings?site=jwlc&per_page=${perPage}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return (json.data as ApiListing[]).map(normalizeLabel);
}

export async function fetchAllListings(): Promise<ApiListing[]> {
  const first = await fetch(`${BASE_URL}/listings?site=jwlc&per_page=50&page=1`);
  if (!first.ok) throw new Error(`API error: ${first.status}`);
  const firstJson = await first.json();
  const all: ApiListing[] = [...firstJson.data];
  const lastPage: number = firstJson.meta?.last_page ?? 1;
  if (lastPage > 1) {
    const rest = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, i) => i + 2).map(async page => {
        const res = await fetch(`${BASE_URL}/listings?site=jwlc&per_page=50&page=${page}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return (await res.json()).data as ApiListing[];
      })
    );
    all.push(...rest.flat());
  }
  return all.map(normalizeLabel);
}

export async function fetchListing(slug: string): Promise<ApiListing | null> {
  const res = await fetch(`${BASE_URL}/listings/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return normalizeLabel(json.data as ApiListing);
}
