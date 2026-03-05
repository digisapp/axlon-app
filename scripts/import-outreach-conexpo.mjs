#!/usr/bin/env node

/**
 * Import CONEXPO-CON/AGG exhibitor data into the outreach_contacts table.
 *
 * Prerequisites:
 *   - Run migration 037_outreach_contacts.sql first
 *   - Run scraper first: node scripts/scrape-conexpo-exhibitors.mjs
 *   - Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 *
 * Usage:
 *   node scripts/import-outreach-conexpo.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'conexpo-exhibitors.json');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Import CONEXPO Exhibitors → outreach_contacts      ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`Data file not found: ${DATA_FILE}`);
    console.error('Run the CONEXPO scraper first: node scripts/scrape-conexpo-exhibitors.mjs');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const exhibitors = raw.exhibitors || [];
  console.log(`Loaded ${exhibitors.length} exhibitors from ${DATA_FILE}\n`);

  const BATCH_SIZE = 100;
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < exhibitors.length; i += BATCH_SIZE) {
    const batch = exhibitors.slice(i, i + BATCH_SIZE);

    const rows = batch.map(e => {
      const addr = e.address || {};
      const personnel = (e.contacts || []).map(c => ({
        name: c.name || '',
        title: c.title || '',
        email: c.email || '',
      })).filter(p => p.name || p.email);

      // Get primary contact email if no company email
      const primaryEmail = personnel.find(p => p.email)?.email || null;

      return {
        name: e.name,
        website: e.website || null,
        email: primaryEmail,
        phone: e.phone || null,
        address: addr.street || null,
        city: addr.city || null,
        state: addr.state || null,
        zip: addr.zip || null,
        country: addr.country || null,
        source: 'conexpo',
        source_id: e.id || null,
        service_codes: [],
        personnel,
        status: 'new',
        notes: e.description ? e.description.substring(0, 2000) : null,
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

    process.stdout.write(`  ${Math.min(i + BATCH_SIZE, exhibitors.length)}/${exhibitors.length} processed\r`);
  }

  console.log(`\n\n── Results ──────────────────────────────────────`);
  console.log(`Imported:  ${imported}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Errors:    ${errors}`);
  console.log(`─────────────────────────────────────────────────\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
