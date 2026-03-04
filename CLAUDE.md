# JWLC — Julie Wright Land Company

## Project Overview

Real estate website for a North Carolina land brokerage. Astro 5 with SSR (Node.js adapter), Tailwind CSS 4, TypeScript strict mode.

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
├── components/     # Astro components (FontSwitcher, ListingCard, ServiceIcon)
├── data/           # Static data as TypeScript (listings, services, team, testimonials)
├── layouts/        # Layout.astro — main layout with nav + footer
├── pages/          # File-based routing
│   ├── listings/[id].astro  # Dynamic property detail pages
│   └── *.astro              # Static pages (index, about, services, contact, etc.)
└── styles/
    └── global.css  # Tailwind imports, @theme tokens, component classes, animations
```

- **No database** — all content lives in `src/data/*.ts` files
- **No React/Vue** — pure Astro components only
- **SSR mode** via `@astrojs/node` standalone adapter
- **Image optimization** via Sharp

## Design System

### Brand Colors (defined in `global.css` @theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `crimson-700` | `#be3528` | Primary accent, CTAs, links |
| `crimson-900` | `#612827` | Dark accent, hover states |
| `brand-light` | `#faca83` | Light accent, selection highlight |
| `earth-50`–`earth-950` | Brown scale | Text, backgrounds, borders |
| `forest-*` | Greens | Sparingly for land/nature imagery |

### Typography

- **Display**: `DM Serif Display` (headings) — variable weight via `--font-display-weight`
- **Body**: `Libre Franklin` (body text) — variable weight via `--font-body-weight`
- Fonts are switchable at dev time via the `FontSwitcher` component

### Component Classes

- `.btn-primary` / `.btn-secondary` / `.btn-nav` — button styles
- `.section-label` — uppercase tracking label (crimson)
- `.section-heading` — large display heading
- `.animate-fade-up` / `.animate-fade-in` — entrance animations

## Conventions

- Use Tailwind utility classes; extend via `global.css` @theme tokens when needed
- Reference brand colors by their token names (e.g., `bg-crimson-700`, `text-earth-900`)
- Keep data changes in `src/data/*.ts` — don't hardcode content in page files
- `FontSwitcher.astro` is dev-only; it renders only in dev mode
- Static assets (images, SVGs, favicon) go in `public/`
- Property images go in `public/images/listings/{listing-id}/`
