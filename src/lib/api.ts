const BASE_URL = 'https://office.jwrgnc.com/api/v1';

export interface ApiPhoto {
  id: string;
  order: number;
  caption: string | null;
  is_primary: boolean;
  urls: {
    thumbnail: string;
    web: string;
    full: string;
    original: string;
  };
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

export async function fetchListings(): Promise<ApiListing[]> {
  const res = await fetch(`${BASE_URL}/listings?site=jwlc&per_page=50`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data as ApiListing[];
}

export async function fetchListing(slug: string): Promise<ApiListing | null> {
  const res = await fetch(`${BASE_URL}/listings/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data as ApiListing;
}
