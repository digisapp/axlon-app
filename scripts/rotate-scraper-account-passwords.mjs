/**
 * Rotate passwords for scraper/seed placeholder dealer accounts.
 *
 * These accounts were originally created by scraper/seed scripts with
 * guessable hardcoded passwords (e.g. `<DealerName>2024!`, `TempPassword123!`).
 * The scripts have been fixed to generate random passwords, but any accounts
 * already created in production still have the old guessable passwords.
 *
 * This script sets a new cryptographically random password on each affected
 * account. Nobody needs to know these passwords — the accounts are placeholder
 * dealer profiles managed entirely via the Supabase admin API.
 *
 * Usage: node scripts/rotate-scraper-account-passwords.mjs
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in env.
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Exact emails of accounts created by scraper/seed scripts with hardcoded passwords.
const AFFECTED_EMAILS = [
  // .mjs scrapers/seeds (formerly `<DealerName>2024!`)
  'inventory@jhtt.com',              // scrape-jhtt.mjs
  'inventory@midcosales.com',        // scrape-midco.mjs
  'inventory@royaltrailersales.com', // scrape-royal.mjs
  'sales@tecequipment.com',          // scrape-tec.mjs
  'inventory@baskintrucksales.com',  // scrape-baskin.mjs
  'sales@customtruck.com',           // scrape-customtruck.mjs
  'sales@dgpeterbilt.com',           // scrape-dgpeterbilt.mjs
  'mail@blackmontrailers.com',       // scrape-blackmon.mjs / seed-blackmon-trailers.mjs
  'sales@lmitennessee.com',          // scrape-lmi.mjs
  'josephequipment@aol.com',         // scrape-joseph-equipment.mjs
  'sales@luckystrailers.com',        // scrape-luckys.mjs
  'info@semitrailers.net',           // scrape-iloca-semitrailers.mjs
  'inventory@tntsales.biz',          // scrape-tnt.mjs
  'sales@preferredlowboys.com',      // scrape-preferred-lowboys.mjs
  'sales@westerntruck.com',          // scrape-westerntruck.mjs
  'sales@renostrailer.com',          // scrape-renos-trailer.mjs
  'tim@lowboydealer.com',            // seed-tm-trailer-sales.mjs
  'dan@veskernaequipment.com',       // seed-veskerna-equipment.mjs
  'sales@blackwellsales.net',        // seed-blackwell-sales.mjs
  'sales@youngtrucktrailer.com',     // seed-young-truck-trailer.mjs
  'sales@lubbocktrucksales.com',     // seed-lubbock-truck-sales.mjs
  'sales@tristatetrailer.com',       // seed-tristate-trailer.mjs
  'truckpaper@dealers.axlon.ai',     // scrape-truckpaper.mjs
  // .ts scripts (formerly `TempPassword123!`)
  'info@pinnaclellc.us',             // seed-pinnacle-truck-trailer.ts
  'info@jbpavelkainc.com',           // scrape-jb-pavelka.ts
  'charlieblyth@blythtrailer.com',   // seed-blyth-trailer-sales.ts
];

async function findUsersByEmail() {
  // auth.admin has no getUserByEmail — page through all users and index by email.
  const byEmail = new Map();
  let page = 1;
  const perPage = 1000;

  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`listUsers failed on page ${page}: ${error.message}`);
    }
    for (const user of data.users) {
      if (user.email) byEmail.set(user.email.toLowerCase(), user);
    }
    if (data.users.length < perPage) break;
    page++;
  }

  return byEmail;
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.');
    process.exit(1);
  }

  console.log(`Rotating passwords for ${AFFECTED_EMAILS.length} scraper/seed accounts...\n`);

  const byEmail = await findUsersByEmail();

  let rotated = 0;
  let notFound = 0;
  let failed = 0;

  for (const email of AFFECTED_EMAILS) {
    const user = byEmail.get(email.toLowerCase());
    if (!user) {
      console.log(`  NOT FOUND: ${email}`);
      notFound++;
      continue;
    }

    const newPassword = crypto.randomBytes(24).toString('base64url');
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (error) {
      console.log(`  FAILED:    ${email} (${error.message})`);
      failed++;
    } else {
      console.log(`  ROTATED:   ${email}`);
      rotated++;
    }
  }

  console.log(`\nDone. Rotated: ${rotated}, not found: ${notFound}, failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
