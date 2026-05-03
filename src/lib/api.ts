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
  is_public: boolean;
  url: string | null;
  expires_at: string | null;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  contract: 'Contract',
  addendum: 'Addendum',
  disclosure: 'Disclosure',
  inspection_report: 'Inspection Report',
  appraisal: 'Appraisal',
  title_report: 'Title Report',
  survey: 'Survey',
  plat: 'Plat',
  hoa_docs: 'HOA Docs',
  tax_record: 'Tax Record',
  insurance: 'Insurance',
  license: 'License',
  marketing: 'Marketing',
  photo: 'Photo',
  correspondence: 'Correspondence',
  other: 'Other',
};

export function documentTypeLabel(type: string | null | undefined): string {
  if (!type) return 'Document';
  return (
    DOCUMENT_TYPE_LABELS[type] ??
    type
      .split('_')
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
      .join(' ')
  );
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

export interface ApiTeamMember {
  id: number;
  slug: string;
  name: string;
  title: string | null;
  short_bio: string | null;
  bio: string | null;

  public_email: string | null;
  public_phone: string | null;

  license_number: string | null;
  license_state: string | null;
  license_expiry: string | null;

  specialties: string[];
  social_links: Record<string, string>;
  years_experience: number | null;

  sort_order: number | null;
  published_at: string | null;

  primary_photo: ApiPhoto | null;
  photos?: ApiPhoto[];
  photo_count?: number;
  marketing_sites?: string[];
}

export async function fetchTeam(): Promise<ApiTeamMember[]> {
  try {
    const res = await fetch(`${BASE_URL}/team?site=jwlc&per_page=100`);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as ApiTeamMember[];
  } catch {
    return [];
  }
}

export async function fetchTeamMember(slug: string): Promise<ApiTeamMember | null> {
  try {
    const res = await fetch(`${BASE_URL}/team/${slug}?site=jwlc`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as ApiTeamMember;
  } catch {
    return null;
  }
}
