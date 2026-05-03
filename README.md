# JWLC — Julie Wright Land Company

Public marketing website for **Julie Wright Land Company**, a North Carolina land brokerage. Astro 5 SSR with Tailwind 4. Sister site to [`jwrg`](https://github.com/wrightster/jwrg) (full-service residential); both consume the same back-office API at `office.jwrgnc.com`.

> 🧭 **First time here?** This repo is one of three siblings in the JWRG platform workspace. Read [wrightster/jwrg-workspace](https://github.com/wrightster/jwrg-workspace) for the full setup — clone the meta repo and run `bootstrap.sh` to get all three projects in place at once.

## Stack

- **Astro 5** with `@astrojs/node` (standalone SSR adapter)
- **Tailwind CSS 4** (config in `src/styles/global.css` `@theme` block — no `tailwind.config.js`)
- **TypeScript strict**
- **Sharp** for local image optimization (listing photos come pre-rendered from the office API; never re-optimize API URLs through `<Image>`)

## Quick start

```bash
nvm use                  # Node 22 (see .nvmrc)
npm ci
npm run dev              # http://localhost:4321
```

| Command | Action |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `./dist/` |
| `npm run start` | Run the production Node server (`HOST=127.0.0.1 PORT=4321 node ./dist/server/entry.mjs`) |
| `npm run preview` | Astro preview |

## Where things live

```
src/
├── components/   ListingCard, ListingRow, FontSwitcher (dev only)
├── data/         Static site content (services, team, testimonials)
├── layouts/      Layout shell (nav + footer + topo SVG overlay)
├── lib/api.ts    Office API client + types — keep in sync with jwrg/src/lib/api.ts
├── pages/        Routes (index, about, listings/[slug], services, contact, testimonials, dev/styleguide)
└── styles/       global.css with Tailwind @theme tokens + component classes
```

## API contract

Talks to `https://office.jwrgnc.com/api/v1`, filtered by `?site=jwlc`. The shared contract (and rules that apply to **both** JWRG and JWLC) is documented in [`SHARED_FRONTEND_GUIDE.md`](https://github.com/wrightster/jwrg-workspace/blob/main/SHARED_FRONTEND_GUIDE.md). When changing the API client, update **both** sites' `src/lib/api.ts` in the same session.

## Brand

Red clay + earth + muted gold. Gabarito (display) + Anek Latin (body). All tokens and component classes (`.btn-primary`, `.section-heading`, etc.) live in `src/styles/global.css`.

`/dev/styleguide` (dev only — redirects to `/` in prod) is a visual reference for tokens, components, and patterns. The `FontSwitcher` panel in dev mode lets you swap fonts/weights/nav colors live and copy the resulting CSS variables.

## Deploy

Deploys to a DigitalOcean droplet managed by Ploi.io at `land.jwrgnc.com`. Push to `master` triggers the deploy webhook. The Node SSR daemon binds to `127.0.0.1:4321` (set in `package.json`'s `start` script — keeps it on Astro's default port; the JWRG sister site uses 4342 on the same host).

## Going deeper

- [`CLAUDE.md`](./CLAUDE.md) — guidance for Claude Code sessions in this repo
- [`plan/audit.md`](./plan/audit.md) — site-audit punch list
- [`../SHARED_FRONTEND_GUIDE.md`](../SHARED_FRONTEND_GUIDE.md) — cross-site rules (lives in the workspace meta repo)
