# JWLC — Julie Wright Land Company

## Project Overview

Real estate website for a North Carolina land brokerage. Astro 5 with SSR (Node.js adapter), Tailwind CSS 4, TypeScript strict mode. All pages use `export const prerender = true` (static output).

## Environments

- **Local dev**: `npm run dev` → localhost:4321
- **Staging**: https://land.jwrglc.com
- **Deploy**: Push to master triggers deploy via Ploi webhook (see `.claude/settings.local.json` for token)

## Commands

- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Production build to `./dist/`
- `npm run start` — Run production server (`node ./dist/server/entry.mjs`)

## Architecture

```
src/
├── components/     # Astro components
│   ├── FontSwitcher.astro   # Dev-only design testing panel (fonts, colors)
│   ├── ListingCard.astro    # Card view for a listing (grid layout)
│   ├── ListingRow.astro     # Row view for a listing (list layout)
│   └── ServiceIcon.astro    # Inline SVG icons for service cards
├── data/           # All site content as TypeScript
│   ├── listings.ts     # Listing interface + 16 properties
│   ├── services.ts     # Service interface + 6 services
│   ├── team.ts         # TeamMember interface + 5 brokers
│   └── testimonials.ts # Testimonial interface + 7 quotes
├── layouts/
│   └── Layout.astro    # Main shell: fixed nav + footer + FontSwitcher
├── pages/
│   ├── dev/
│   │   └── styleguide.astro  # Dev-only design system reference (redirects in prod)
│   ├── listings/
│   │   └── [id].astro        # Dynamic property detail page
│   └── *.astro               # index, about, listings, services, contact, testimonials
└── styles/
    └── global.css    # @import tailwindcss + @theme tokens + all component classes
```

- **No database** — all content lives in `src/data/*.ts` files
- **No React/Vue** — pure Astro components only
- **SSR mode** via `@astrojs/node` standalone adapter, all pages prerendered
- **Image optimization** via Sharp

---

## Design System

### Brand Colors (defined in `global.css` @theme)

All color tokens use the `--color-*` naming. In Tailwind use `bg-red-600`, `text-earth-900`, etc.

### Color Name Aliases

The user may refer to colors by these descriptive names — map them as follows:

| User may say | Hex | Token |
|---|---|---|
| Dark Accent, Red Clay | `#be3528` | `red-600` |
| Light Accent, Muted Gold | `#fac984` | `gold-300` |
| Medium Neutral, Fine Sand | `#f2e6c9` | `earth-100` |
| Light Neutral, Clean Bone | `#f7f7f2` | `earth-50` |
| Dark Neutral, Rich Soil | `#3d3225` | `earth-900` |

### Key Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `red-600` | `#be3528` | Dark Accent / Red Clay — CTAs, links, footer bg, section labels, hover states |
| `gold-300` | `#faca83` | Light Accent / Muted Gold — selection highlight, pending badge bg |
| `earth-50` | `#f7f7f2` | Page background, service icon wrapper bg |
| `earth-100` | `#f2e6c9` | Banners, card backgrounds, team section bg |
| `earth-200` | `#e8d9bb` | Dividers, input borders |
| `earth-400` | `#bb9d72` | Placeholders, borders |
| `earth-500` | `#a48a63` | Subtle labels, muted text (county, address) |
| `earth-600` | `#8d7350` | Secondary / muted text |
| `earth-700` | `#745d42` | Body text on light bg |
| `earth-900` | `#3d3225` | Main dark text, dark section backgrounds |
| `light-text` | `#ffffff` | White text on dark backgrounds |

Full red and gold palettes (50–950) are defined in `global.css` for use when lighter/darker shades are needed.

### Typography

- **Display font**: `Jost` — used for all `h1–h5`, `.font-display`, buttons, labels
  - Weight controlled via `--font-display-weight` CSS variable (default 700)
- **Body font**: `Funnel Sans` — used for all body text
  - Weight controlled via `--font-body-weight` CSS variable (default 400)
- Fonts loaded via Google Fonts in `Layout.astro`; switchable at dev time via `FontSwitcher`

### Component Classes (all defined in `global.css`)

**Buttons** — shared: `px-7 py-2 font-display border-2 rounded-sm tracking-wide`
- `.btn-primary` — red outline, red fill on hover
- `.btn-secondary` — earth-900 outline, dark fill on hover
- `.btn-nav` — uses `--color-nav-accent` CSS variable
- Add `<svg class="btn-icon">` inside for animated right-arrow

**Typography**
- `.section-label` — uppercase, tracked, red, `text-xs`
- `.section-heading` — display font, `text-4xl md:text-5xl`, earth-900
- `.page-banner-title` — italic display, `text-4xl md:text-6xl`, red

**Layout**
- `.content-wrap` — `max-w-7xl mx-auto px-6 lg:px-8`
- `.cta-wrap` — `max-w-3xl mx-auto px-6 lg:px-8 text-center`

**Page Section Patterns**
- `.page-banner` — `bg-earth-100` header sections (About, Services, etc.)
- `.cta-dark` — `bg-earth-900` CTA block with `.cta-dark-heading` / `.cta-dark-body`
- `.cta-light` — `bg-earth-100/50 border-t` CTA block
- `.cta-btn-row` — `flex flex-wrap justify-center gap-4 mt-8`

**Badges**
- `.listing-status-badge[data-status="available|pending|sold"]` — color-coded status pill
- `.team-tag` — small pill tag for broker specialties

---

## Workflows

### Adding a New Listing

1. Add entry to `src/data/listings.ts` — copy an existing object as template:
   ```ts
   {
     id: "kebab-case-id",          // used for URL and image path
     title: "...",
     price: "$xxx,xxx",
     acreage: "x.x acres",
     location: "Descriptive location name",
     address: "Optional street address",  // omit if not available
     city: "City Name",
     county: "County",             // must match filter options in listings.astro
     description: "1-2 sentence teaser",
     fullDescription: "Full property description for detail page",
     status: "available",          // "available" | "pending" | "sold"
     featured: true,               // omit or false if not homepage-featured
     imageCount: N,                // number of images you're adding
     broker: "Broker Name",        // should match a name in team.ts
     brokerPhone: "(919) xxx-xxxx",
   }
   ```
2. Create image directory: `public/images/listings/{id}/`
3. Add images named `1.jpg`, `2.jpg`, … `N.jpg` (matching `imageCount`)
4. Run `node scripts/check-listings.js` to verify everything is in order
5. If `featured: true`, confirm only ~5 listings are featured (homepage shows 3)

### Adding a Team Member

1. Add entry to `src/data/team.ts`
2. Add photo to `public/images/team/{firstname-lastname}.jpg`
3. Photo dimensions: ~300×300px square, JPG

### Updating a Service

Edit `src/data/services.ts`. The `photo` field accepts a URL (currently Unsplash) or a `/images/...` local path.

---

## Component Usage Guide

### `ListingCard.astro`
```astro
<ListingCard listing={listing} index={0} />
```
- Used in: homepage featured grid, listings page grid view
- Shows: image, county/acreage overlay, status badge, title, description, price, "View Details" link
- `index` prop is optional (used for staggered animation)

### `ListingRow.astro`
```astro
<ListingRow listing={listing} />
```
- Used in: listings page list view only
- Shows: thumbnail, title/status/county, acreage, price, "View Details" link

### `ServiceIcon.astro`
```astro
<ServiceIcon icon="handshake" class="service-card-icon" />
```
- Available icons: `'handshake' | 'clipboard' | 'map' | 'scroll' | 'arrows' | 'trees'`
- Renders inline SVG; apply size/color via the `class` prop

---

## Tailwind v4 Notes

- Config is in `global.css` using `@theme {}` block — not `tailwind.config.js`
- Arbitrary values work normally: `opacity-[0.09]`, `w-[42%]`, `text-[11px]`
- Custom tokens become Tailwind utilities automatically: `bg-red-600`, `text-earth-900`, etc.
- CSS variables in `@theme` are also available as `var(--color-red-600)` in non-Tailwind CSS
- `--btn-bg` is a local CSS variable used to pass context color into button hover states (set on section wrappers like `.page-banner`, `.cta-dark`)

---

## Dev Tools

- **Style guide**: `http://localhost:4321/dev/styleguide` — visual reference for all design tokens, components, and patterns. Redirects to `/` in production.
- **FontSwitcher**: Fixed bottom-right panel in dev mode — switch fonts, weights, and nav colors live. Use "Copy Config" to get CSS variables for `global.css`.
---

## File Conventions

- Static assets (images, SVGs, favicon) → `public/`
- Property images → `public/images/listings/{listing-id}/1.jpg`, `2.jpg`, …
- Team photos → `public/images/team/{firstname-lastname}.jpg`
- Topo SVG overlay → `public/FallsLakeTopoContours.svg` (used with `filter: invert(1)` on dark sections, `opacity-[0.09]`)
- All pages use `export const prerender = true` except `src/pages/dev/styleguide.astro`

## Known Quirks

- The `listings.astro` filter uses client-side JS; county/status values must exactly match what's used in `listings.ts`
- `nav-logo-icon` uses CSS `mask-image` to color the SVG — changing nav accent color works via the `--color-nav-accent` CSS variable (set by FontSwitcher in dev, hardcoded to `red-600` in prod)
- The topo SVG width calculation script in `Layout.astro` uses `getBoundingClientRect()` to handle zoom-independent sizing
- Listing detail page breaks descriptions into 3-sentence paragraphs client-side
