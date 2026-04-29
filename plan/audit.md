# JWLC Site Audit

## Broken / Immediately Wrong

- [x] **`check-listings.js` will crash.** Reads `src/data/listings.ts` (line 13) which no longer exists — architecture moved to API-based listings. Running it throws file-not-found. Broker cross-check logic also parses fields (`imageCount`, `broker`) that no longer exist.

- [x] **No API error handling in SSR pages.** `index.astro` and `listings.astro` call `fetchListings()` with no try/catch. `[id].astro` calls both `fetchListing()` and `fetchListings()`. API downtime causes unhandled promise rejections → 500s with no graceful fallback.

- [x] **`coming_soon` and `under_contract` have no CSS badge styling.** The API returns these statuses and the filter offers them as options, but `.listing-status-badge`, `.listing-card-status`, and `.listing-row-status` only style `available`, `active`, `pending`, and `sold`. Those two statuses render with no background/color on their badge.

---

## Functional Gaps

- [ ] **Status filter label vs. badge are inconsistent.** `normalizeLabel()` in `api.ts` rewrites `status_label` of `active` listings to `"Available"`, so the badge says "Available". But the filter dropdown option for that status says "Active". Users filtering by "Active" get listings whose badge says "Available".

- [ ] **Price range slider has a hardcoded $500k ceiling.** HTML inputs have `max="500000"`. The JS reads actual prices from `data-price` attributes but doesn't adjust the slider max dynamically (unlike acreage). Any listing above $500k is silently capped.

- [ ] **Listing detail page makes two API calls.** `[id].astro` calls `fetchListings()` just to populate 3 "More Properties" cards — every detail page visit costs 2 serial API round trips, fetching up to 50 listings to use 3.

- [ ] **`per_page=50` hard limit in `fetchListings()`.** If the API ever exceeds 50 listings, the extras silently disappear. No pagination is handled.

---

## Stale Documentation

- [ ] **CLAUDE.md describes the old static-data architecture.** "No database — all content lives in `src/data/*.ts`", the listing interface, the "Adding a New Listing" workflow, `imageCount`, `brokerPhone`, `featured: true`, and references to the validator script are all pre-API-migration. Outdated for anyone following it.

- [ ] **CLAUDE.md color token hex values are wrong.** Examples: `red-600` documented as `#be3528` but CSS has `#b52126`; `earth-50` documented as `#f7f7f2` but CSS has `#edeae6`; `earth-100` documented as `#f2e6c9` but CSS has `#ebd9bc`.

- [ ] **FontSwitcher "current" labels don't match active CSS fonts.** FontSwitcher labels first display as "Jost (current)" and first body as "Funnel Sans (current)". But `global.css` defines `'Gabarito'` / `'Anek Latin'` and `Layout.astro` loads those from Google Fonts. The "Copy Config" output would emit wrong font family names.

---

## Dead Code & Orphaned Assets

- [ ] **~100 JPGs in `public/images/listings/` are orphaned.** All listing photos are now served via API URLs. The 15 local listing image folders are never referenced by any current code path and are being deployed needlessly.

- [ ] **`FallsLakeTopoContours.svg` is orphaned in two places** (`public/` and `assets/`). CLAUDE.md says it's used with `filter: invert(1)` on dark sections but no code does this — the site uses `FallTopo_v2.svg` everywhere.

- [ ] **`ServiceIcon.astro` is effectively unused in production.** Only imported in `dev/styleguide.astro`. The services page inlines all SVGs directly.

- [ ] **Status badge CSS logic duplicated across three classes.** `.listing-status-badge`, `.listing-card-status`, and `.listing-row-status` each repeat the same status-to-color rules. Adding a new status requires editing all three.

---

## SEO & Accessibility

- [ ] **No Open Graph or Twitter Card meta tags.** `Layout.astro` only outputs `<title>` and `<meta name="description">`. Social sharing shows no image and poor formatting.

- [ ] **No `<link rel="canonical">`.** With SSR and possible query strings, duplicate content indexing is a risk.

- [ ] **Lightbox doesn't trap focus.** When open, keyboard focus can still move behind the modal (nav links, listing text, etc.). `role="dialog"` elements should trap focus within them.

- [ ] **Custom select dropdowns have no keyboard navigation.** Filter dropdowns respond only to clicks. Arrow key navigation, Home/End, and type-to-search (expected of `role="listbox"`) are absent.

---

## Minor / Polish

- [ ] **About page "Core Values" stat card renders an empty value.** `{ value: '—', detail: 'Integrity, Knowledge, Relationships' }` strips the em dash but renders nothing in its place — the large number area is blank.

- [ ] **`[id].astro` parameter named `id` but receives a `slug`.** `Astro.params.id` is used throughout but `ListingCard` links to `/listings/${listing.slug}`. Benign but potentially confusing.

- [ ] **`listing-row-acreage` may overlap price at narrow widths.** Acreage is `absolute top-2.5 right-4` inside `.listing-row-right` alongside price and "View Details" — potential overlap at small container widths.
