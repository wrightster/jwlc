// Thin shim over @jw/shared/api — binds JWLC's site slug and re-exports
// everything else. Canonical source lives in jw-shared/src/api.ts; add shared
// logic there, not here.
//
// JWLC historically auto-normalized listing labels (active → "Available") inside
// its fetchers, so the shimmed list/detail fetchers keep doing that to preserve
// the site's existing labels.

import {
  fetchAllListings as sharedFetchAllListings,
  fetchListing as sharedFetchListing,
  fetchListings as sharedFetchListings,
  fetchTeam as sharedFetchTeam,
  fetchTeamMember as sharedFetchTeamMember,
  normalizeListingLabel,
  type ApiListing,
  type ListingsQuery,
} from '@jw/shared/api';

export * from '@jw/shared/api';

export const SITE_SLUG = 'jwlc';

export const fetchListings = async (q: ListingsQuery = {}): Promise<ApiListing[]> =>
  (await sharedFetchListings(SITE_SLUG, q)).map(normalizeListingLabel);

export const fetchAllListings = async (q: ListingsQuery = {}): Promise<ApiListing[]> =>
  (await sharedFetchAllListings(SITE_SLUG, q)).map(normalizeListingLabel);

export const fetchListing = async (slug: string): Promise<ApiListing | null> => {
  const listing = await sharedFetchListing(slug);

  return listing ? normalizeListingLabel(listing) : null;
};

export const fetchTeam = () => sharedFetchTeam(SITE_SLUG);
export const fetchTeamMember = (slug: string) => sharedFetchTeamMember(slug, SITE_SLUG);
