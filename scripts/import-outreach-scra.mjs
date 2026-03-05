#!/usr/bin/env node

/**
 * Import SC&RA directory data into the outreach_contacts table.
 *
 * Prerequisites:
 *   - Run migration 037_outreach_contacts.sql first
 *   - Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 *
 * Usage:
 *   node scripts/import-outreach-scra.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'scra-directory.json');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars');
  console.error('Example: SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-outreach-scra.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse the messy address field into components
function parseAddress(raw) {
  if (!raw) return {};

  // Pattern: "3350 Highway 53 Huntsville, AL 35806 United States"
  // Try to extract city, state, zip
  const match = raw.match(/(.+?)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\s*(.*)?$/);
  if (match) {
    const beforeCityState = match[1];
    const parts = beforeCityState.split(/,\s*/);
    const city = parts.length > 1 ? parts[parts.length - 1].trim() : '';
    const street = parts.length > 1 ? parts.slice(0, -1).join(', ').trim() : beforeCityState;

    return {
      address: street || raw,
      city,
      state: match[2],
      zip: match[3],
      country: (match[4] || 'United States').trim(),
    };
  }

  // Try simpler pattern with just state and country
  const simpleMatch = raw.match(/(.+),\s*([A-Z]{2})\s*(.*)?$/);
  if (simpleMatch) {
    return {
      address: simpleMatch[1].trim(),
      city: '',
      state: simpleMatch[2],
      zip: '',
      country: (simpleMatch[3] || '').trim() || 'United States',
    };
  }

  return { address: raw, city: '', state: '', zip: '', country: '' };
}

function cleanPhoneField(value, addressPart) {
  if (!value) return null;
  // The scraper sometimes put address numbers in fax/toll_free fields
  // If the value looks like just a street number, ignore it
  if (/^\d{1,5}$/.test(value.trim())) return null;
  // If it matches the start of the address, it's a scraping artifact
  if (addressPart && value.trim() === addressPart.trim().split(' ')[0]) return null;
  return value.trim() || null;
}

async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  Import SC&RA Directory → outreach_contacts     ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`Data file not found: ${DATA_FILE}`);
    console.error('Run the SC&RA scraper first: node scripts/scrape-scra-directory.mjs');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const companies = Array.isArray(raw) ? raw : raw.companies || [];
  console.log(`Loaded ${companies.length} companies from ${DATA_FILE}\n`);

  // Parse service_codes — they come in as "I-InternationalT-Transportation" format
  function parseServiceCodes(codes) {
    if (!codes || !Array.isArray(codes)) return [];
    const parsed = [];
    for (const code of codes) {
      // Split joined codes like "I-InternationalT-Transportation"
      const parts = code.match(/[A-Z]-[A-Za-z]+/g);
      if (parts) parsed.push(...parts);
      else if (code.trim()) parsed.push(code.trim());
    }
    return [...new Set(parsed)];
  }

  const BATCH_SIZE = 100;
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < companies.length; i += BATCH_SIZE) {
    const batch = companies.slice(i, i + BATCH_SIZE);

    const rows = batch.map(c => {
      const addr = parseAddress(c.address);
      const personnel = (c.personnel || [])
        .filter(p => p.name && p.name !== 'Member Get')
        .map(p => ({
          name: p.name || '',
          title: (p.title || '').replace(/^a-/, ''),
          email: p.email || '',
        }))
        .filter(p => p.name || p.email);

      return {
        name: c.name,
        website: c.website || null,
        email: c.email || null,
        phone: c.phone || null,
        fax: cleanPhoneField(c.fax, c.address),
        toll_free: cleanPhoneField(c.toll_free, c.address),
        address: addr.address || c.address || null,
        city: addr.city || c.city || null,
        state: addr.state || c.state || null,
        zip: addr.zip || c.zip || null,
        country: addr.country || c.country || 'United States',
        source: 'scra',
        source_id: c.id || null,
        service_codes: parseServiceCodes([...(c.service_codes || []), ...(c.allied_codes || [])]),
        personnel,
        status: 'new',
        member_since: c.member_since || null,
      };
    });

    const { data, error } = await supabase
      .from('outreach_contacts')
      .insert(rows)
      .select('id');

    if (error) {
      console.error(`  Batch error at ${i}: ${error.message}`);
      errors += batch.length;
    } else {
      imported += data?.length || 0;
      skipped += batch.length - (data?.length || 0);
    }

    process.stdout.write(`  ${Math.min(i + BATCH_SIZE, companies.length)}/${companies.length} processed\r`);
  }

  console.log(`\n\n── Results ──────────────────────────────────────`);
  console.log(`Imported:  ${imported}`);
  console.log(`Skipped:   ${skipped} (duplicates)`);
  console.log(`Errors:    ${errors}`);
  console.log(`─────────────────────────────────────────────────\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
