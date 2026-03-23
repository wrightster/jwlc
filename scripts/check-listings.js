#!/usr/bin/env node
/**
 * JWLC Listing Validator
 * Checks that all listing image files exist and data fields are valid.
 * Run from project root: node scripts/check-listings.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Parse listings.ts ────────────────────────────────────────────────────────

const src = readFileSync(join(ROOT, 'src/data/listings.ts'), 'utf8');

// Extract each listing object as a raw block between { ... }
// Strategy: find all id: "..." and imageCount: N pairs
const listingBlocks = [];
const blockRegex = /\{([^{}]+)\}/gs;
let match;
while ((match = blockRegex.exec(src)) !== null) {
  const block = match[1];
  const idMatch = block.match(/\bid:\s*["']([^"']+)["']/);
  const imageCountMatch = block.match(/\bimageCount:\s*(\d+)/);
  const statusMatch = block.match(/\bstatus:\s*["'](available|pending|sold)["']/);
  const titleMatch = block.match(/\btitle:\s*["']([^"']+)["']/);
  const priceMatch = block.match(/\bprice:\s*["']([^"']+)["']/);
  const acreageMatch = block.match(/\bacreage:\s*["']([^"']+)["']/);
  const countyMatch = block.match(/\bcounty:\s*["']([^"']+)["']/);
  const cityMatch = block.match(/\bcity:\s*["']([^"']+)["']/);

  if (idMatch && imageCountMatch) {
    listingBlocks.push({
      id: idMatch[1],
      imageCount: parseInt(imageCountMatch[1], 10),
      status: statusMatch?.[1] ?? '???',
      title: titleMatch?.[1] ?? '???',
      price: priceMatch?.[1] ?? '???',
      acreage: acreageMatch?.[1] ?? '???',
      county: countyMatch?.[1] ?? '???',
      city: cityMatch?.[1] ?? '???',
    });
  }
}

// ── Parse team.ts for broker name validation ──────────────────────────────────

const teamSrc = readFileSync(join(ROOT, 'src/data/team.ts'), 'utf8');
const teamNames = [...teamSrc.matchAll(/\bname:\s*["']([^"']+)["']/g)].map(m => m[1]);
// Also extract broker fields from listings for cross-check
const brokerFields = [...src.matchAll(/\bbroker:\s*["']([^"']+)["']/g)].map(m => m[1]);

// ── Validation ────────────────────────────────────────────────────────────────

let errors = 0;
let warnings = 0;

const RESET  = '\x1b[0m';
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';

console.log(`\n${BOLD}JWLC Listing Validator${RESET}`);
console.log(`${DIM}Checking ${listingBlocks.length} listings…${RESET}\n`);

for (const listing of listingBlocks) {
  const listingDir = join(ROOT, 'public/images/listings', listing.id);
  const lineErrors = [];
  const lineWarnings = [];

  // Check image directory exists
  if (!existsSync(listingDir)) {
    lineErrors.push(`Image directory missing: public/images/listings/${listing.id}/`);
  } else {
    // Check each expected image file
    for (let i = 1; i <= listing.imageCount; i++) {
      const imgPath = join(listingDir, `${i}.jpg`);
      if (!existsSync(imgPath)) {
        lineErrors.push(`Missing image: ${listing.id}/${i}.jpg (imageCount=${listing.imageCount})`);
      }
    }
  }

  // Warn if imageCount is 0
  if (listing.imageCount === 0) {
    lineWarnings.push('imageCount is 0 — no images will display');
  }

  // Report
  const statusColor = listing.status === 'available' ? GREEN
                    : listing.status === 'pending'   ? YELLOW
                    : DIM;
  const statusLabel = `[${listing.status}]`;

  if (lineErrors.length === 0 && lineWarnings.length === 0) {
    console.log(`  ${GREEN}✓${RESET} ${BOLD}${listing.id}${RESET} ${DIM}${statusColor}${statusLabel}${RESET} ${DIM}— ${listing.imageCount} image(s)${RESET}`);
  } else {
    console.log(`  ${lineErrors.length ? RED + '✗' : YELLOW + '⚠'}${RESET} ${BOLD}${listing.id}${RESET} ${statusColor}${statusLabel}${RESET}`);
    for (const err of lineErrors)  { console.log(`      ${RED}Error:${RESET}   ${err}`); errors++; }
    for (const w of lineWarnings)  { console.log(`      ${YELLOW}Warning:${RESET} ${w}`); warnings++; }
  }
}

// ── Broker cross-check ────────────────────────────────────────────────────────

console.log(`\n${BOLD}Broker Name Check${RESET} ${DIM}(broker field vs team.ts names)${RESET}`);
const uniqueBrokers = [...new Set(brokerFields)];
for (const broker of uniqueBrokers) {
  const inTeam = teamNames.includes(broker);
  // Mary Ammons is a broker listed in listings but not in team.ts — known case
  if (inTeam) {
    console.log(`  ${GREEN}✓${RESET} "${broker}" — found in team.ts`);
  } else {
    console.log(`  ${YELLOW}⚠${RESET} "${broker}" — ${YELLOW}not found in team.ts${RESET} (may be intentional)`);
    warnings++;
  }
}

// ── Team photo check ──────────────────────────────────────────────────────────

console.log(`\n${BOLD}Team Photo Check${RESET}`);
const photoMatches = [...teamSrc.matchAll(/\bphoto:\s*["']([^"']+)["']/g)];
for (const m of photoMatches) {
  const photoPath = join(ROOT, 'public', m[1]);
  if (existsSync(photoPath)) {
    console.log(`  ${GREEN}✓${RESET} ${m[1]}`);
  } else {
    console.log(`  ${RED}✗${RESET} ${RED}Missing:${RESET} ${m[1]}`);
    errors++;
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
if (errors === 0 && warnings === 0) {
  console.log(`${GREEN}${BOLD}All checks passed.${RESET} ${listingBlocks.length} listings, no issues.\n`);
} else {
  if (errors > 0)   console.log(`${RED}${BOLD}${errors} error(s)${RESET} found — images are missing and will 404.`);
  if (warnings > 0) console.log(`${YELLOW}${BOLD}${warnings} warning(s)${RESET} found — review above.`);
  console.log('');
  if (errors > 0) process.exit(1);
}
