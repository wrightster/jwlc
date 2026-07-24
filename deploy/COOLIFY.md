# jwlc on Coolify

jwlc runs on the shared **Coolify** droplet (same box as jwrg), migrated off Ploi
2026-07. Zero-downtime rolling deploys. The canonical, fully-annotated runbook is
**`../../jwrg/deploy/COOLIFY-PILOT.md`** — this file only notes jwlc-specifics.

## jwlc-specific facts
- **Repo**: `wrightster/jwlc` (PUBLIC), default branch **`master`**.
- **Domain**: `juliewrightlandcompany.com` (+ `www`), Cloudflare zone
  `4c13839fa68f0408534cb7fdaa25d70d` (dns-only A records → droplet).
- **Container**: `Dockerfile` (multi-stage, curl + `0.0.0.0:4321` bind),
  health check `GET /healthz` (`src/pages/healthz.ts`). Same pattern as jwrg.
- **`site`** in `astro.config.mjs` is already the production domain — no change
  needed for cutover.
- **Legacy redirects**: none yet. If the old Dakno `juliewrightlandcompany.com`
  had indexed URLs, port them the jwrg way (astro.config `redirects` + SSR
  catch-all routes) — see the jwrg runbook. Not done as of migration.

## Auto-deploy
Push to `master` → GitHub Actions (`.github/workflows/deploy-coolify.yml`) →
Coolify deploy API over Tailscale. jwlc is public, so the 3 secrets + `COOLIFY_HOST`
come from **org**-level settings; only the repo variable **`COOLIFY_APP_UUID`**
is jwlc-specific (and gates the workflow).

## Coolify app
Project `julie-wright-sites`, server `localhost`
(`ibuz0zh31a8fy00sshxp2ou7`). App uuid: recorded in the workspace memory /
`COOLIFY_APP_UUID` repo variable once created. Deploy manually via
`GET http://100.94.121.24:8000/api/v1/deploy?uuid=<app-uuid>&force=false`
(Tailscale + `~/.config/coolify/token`), or just push to `master`.
