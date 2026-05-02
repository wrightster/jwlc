# JWLC — Julie Wright Land Company

## Project Overview

Real estate website for a North Carolina land brokerage. Astro 5 with SSR (Node.js adapter), Tailwind CSS 4, TypeScript strict mode. All pages use `export const prerender = true` (static output). Sister site to **JWRG** (`~/code/jwrg`) — both consume the same backend at `office.jwrgnc.com`.

> **Read this first when editing:** `~/code/jwrg/SHARED_FRONTEND_GUIDE.md`. It defines rules that apply to both JWLC and JWRG (API client contract, image handling, status mapping, etc.). This CLAUDE.md only covers JWLC-specific details.

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
│   └── ListingRow.astro     # Row view for a listing (list layout)
├── data/           # Static site content as TypeScript
│   ├── services.ts     # Service interface + data
│   ├── team.ts         # TeamMember interface + broker profiles
│   └── testimonials.ts # Testimonial interface + quotes
├── layouts/
│   └── Layout.astro    # Main shell: fixed nav + footer + FontSwitcher
├── lib/
│   └── api.ts          # API client: fetchListings(), fetchListing(slug)
├── pages/
│   ├── dev/
│   │   └── styleguide.astro  # Dev-only design system reference (redirects in prod)
│   ├── listings/
│   │   └── [slug].astro      # Dynamic property detail page
│   └── *.astro               # index, about, listings, services, contact, testimonials
└── styles/
    └── global.css    # @import tailwindcss + @theme tokens + all component classes
```

- **Listings via API** — property data fetched from `office.jwrgnc.com/api/v1` (filtered by `?site=jwlc`) via `src/lib/api.ts`; services, team, and testimonials still live in `src/data/*.ts`. See `~/code/jwrg/SHARED_FRONTEND_GUIDE.md` for the contract.
- **No React/Vue** — pure Astro components only
- **SSR mode** via `@astrojs/node` standalone adapter, all pages prerendered
- **Image handling** — Sharp + Astro's `<Image>` for **local assets only** (team photos, hero shots in `public/images/`). Listing images come from the API as pre-rendered URLs and must not be re-optimized client-side. See `~/code/jwrg/SHARED_FRONTEND_GUIDE.md` §"Image handling".

---

## Design System

### Brand Colors (defined in `global.css` @theme)

All color tokens use the `--color-*` naming. In Tailwind use `bg-red-600`, `text-earth-900`, etc.

### Color Name Aliases

The user may refer to colors by these descriptive names — map them as follows:

| User may say | Hex | Token |
|---|---|---|
| Dark Accent, Red Clay | `#b52126` | `red-600` |
| Light Accent, Muted Gold | `#ffcf7d` | `gold-300` |
| Medium Neutral, Fine Sand | `#ebd9bc` | `earth-100` |
| Light Neutral, Clean Bone | `#edeae6` | `earth-50` |
| Dark Neutral, Rich Soil | `#3a3023` | `earth-900` |

### Key Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `red-600` | `#b52126` | Dark Accent / Red Clay — CTAs, links, footer bg, section labels, hover states |
| `gold-300` | `#ffcf7d` | Light Accent / Muted Gold — selection highlight, pending badge bg |
| `earth-50` | `#edeae6` | Page background, service icon wrapper bg |
| `earth-100` | `#ebd9bc` | Banners, card backgrounds, team section bg |
| `earth-200` | `#e8d9bb` | Dividers, input borders |
| `earth-400` | `#bb9d72` | Placeholders, borders |
| `earth-500` | `#a48a63` | Subtle labels, muted text (county, address) |
| `earth-600` | `#8d7350` | Secondary / muted text |
| `earth-700` | `#745d42` | Body text on light bg |
| `earth-900` | `#3a3023` | Main dark text, dark section backgrounds |
| `light-text` | `#ffffff` | White text on dark backgrounds |

Full red and gold palettes (50–950) are defined in `global.css` for use when lighter/darker shades are needed.

### Typography

- **Display font**: `Gabarito` — used for all `h1–h5`, `.font-display`, buttons, labels
  - Weight controlled via `--font-display-weight` CSS variable (default 700)
- **Body font**: `Anek Latin` — used for all body text
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

Listings are managed in the office Filament admin (`office.jwrgnc.com`) — the website fetches them automatically. To publish on JWLC, ensure `jwlc` is in the listing's `marketing_sites` set. No code changes needed.

Key API fields the site uses: `slug` (URL path), `marketing_title`, `address`, `city`, `county`, `status`, `status_label`, `list_price`, `lot_size_acres`, `description`, `primary_photo`, `photos`, `agent`.

> Backend asks should go in `~/code/jwrg/OFFICE_MCP_REQUESTS.md` rather than ad-hoc messages to the office Claude.

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
- Team photos → `public/images/team/{firstname-lastname}.jpg`
- Topo SVG overlay → `public/FallTopo_v2.svg`
- All pages use `export const prerender = true` except `src/pages/dev/styleguide.astro`

## Known Quirks

- The `listings.astro` filter uses client-side JS against `data-county`, `data-status`, etc. attributes rendered from the API response
- `nav-logo-icon` uses CSS `mask-image` to color the SVG — changing nav accent color works via the `--color-nav-accent` CSS variable (set by FontSwitcher in dev, hardcoded to `red-600` in prod)
- The topo SVG width calculation script in `Layout.astro` uses `getBoundingClientRect()` to handle zoom-independent sizing
- Listing detail page breaks descriptions into 3-sentence paragraphs client-side
- **`<script define:vars>` blocks are plain JavaScript — no TypeScript.** Astro treats these as `is:inline` (no TS transform), so any TS syntax (type annotations, `as` casts, `?:` params) causes a silent `SyntaxError` that kills all event listeners on the page.

## Sister Site (JWRG)

`~/code/jwrg` is the Julie Wright Realty Group site (full-service residential brokerage). Same backend, different brand/audience. When changing shared concerns (API client, image handling, status mapping), make the change in both repos and update `~/code/jwrg/SHARED_FRONTEND_GUIDE.md` if the rule itself changes.
