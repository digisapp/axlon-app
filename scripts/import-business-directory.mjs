/**
 * Import businesses from SCRA, ConExpo, and pre-scraped dealers
 * into the business_directory table.
 *
 * Usage: node scripts/import-business-directory.mjs [--source scra|conexpo|scraped|all]
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sourceArg = process.argv.find(a => a.startsWith('--source='))?.split('=')[1] || 'all';

// ---------- Auto-categorize based on name/description keywords ----------
function guessCategory(name, description, serviceCodes, equipmentTypes) {
  const text = `${name} ${description || ''} ${(serviceCodes || []).join(' ')} ${(equipmentTypes || []).join(' ')}`.toLowerCase();

  // Trailer dealers
  if (/trailer\s*(sales|dealer|inc|llc|co\b)/.test(text) && !/manufact/.test(text)) return 'trailer_dealer';
  // Trailer manufacturers
  if (/trailer.*(manufact|mfg|fabricat)/.test(text) || /(manufact|mfg|fabricat).*trailer/.test(text)) return 'trailer_manufacturer';
  // Truck manufacturers/dealers
  if (/truck.*(manufact|mfg)/.test(text) || /(manufact|mfg).*truck/.test(text)) return 'truck_manufacturer';
  if (/truck\s*(sales|dealer|inc|llc)/.test(text) && !/trailer/.test(text)) return 'equipment_dealer';
  // Crane & rigging
  if (/crane|rigging/.test(text)) return 'crane_rigging';
  // Heavy haul / transportation
  if (/heavy\s*haul|transport|logistics|trucking|freight|carrier/.test(text)) return 'transportation';
  // Equipment dealers
  if (/equipment\s*(sales|dealer|rental)/.test(text) || /lowboy|flatbed|drop.?deck/.test(text)) return 'equipment_dealer';
  // Parts / services
  if (/parts|component|axle|brake|wheel|tire|hydraulic|repair|service|welding/.test(text)) return 'parts_supplier';
  if (/software|tech|gps|telematics|scale|weigh/.test(text)) return 'services';

  return 'uncategorized';
}

// ---------- Parse address string into components ----------
function parseAddress(addr) {
  if (!addr) return {};
  // Try to extract city, state, zip from end of address
  const match = addr.match(/([A-Za-z\s]+),?\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/);
  if (match) {
    return { city: match[1].trim(), state: match[2], zip: match[3] };
  }
  const stateMatch = addr.match(/,?\s+([A-Z]{2})\s*$/);
  if (stateMatch) return { state: stateMatch[1] };
  return {};
}

// ---------- SCRA ----------
function loadSCRA() {
  const raw = JSON.parse(readFileSync(resolve('data/scra-directory.json'), 'utf8'));
  console.log(`SCRA: ${raw.length} records`);

  return raw.map(r => {
    const parsed = parseAddress(r.address);
    const primaryContact = r.personnel?.find(p => p.name && p.name !== 'Member Get') || {};
    const email = r.email && !r.email.includes('scranet.org') ? r.email : (primaryContact.email || null);

    return {
      source: 'scra',
      source_id: r.id || r.name,
      company_name: r.name,
      category: guessCategory(r.name, '', r.service_codes, []),
      email,
      phone: r.phone || null,
      website: r.website || null,
      address: r.address || null,
      city: r.city || parsed.city || null,
      state: r.state || parsed.state || null,
      zip: r.zip || parsed.zip || null,
      country: r.country || 'US',
      description: null,
      contact_name: primaryContact.name || null,
      contact_title: primaryContact.title || null,
      contact_email: primaryContact.email || null,
      tags: r.service_codes || [],
      raw_data: r,
    };
  });
}

// ---------- ConExpo ----------
function loadConExpo() {
  const raw = JSON.parse(readFileSync(resolve('data/conexpo-exhibitors.json'), 'utf8'));
  const exhibitors = raw.exhibitors || [];
  console.log(`ConExpo: ${exhibitors.length} exhibitors`);

  return exhibitors.map(r => {
    const primaryContact = r.contacts?.find(c => c.email) || r.contacts?.[0] || {};

    return {
      source: 'conexpo',
      source_id: r.id,
      company_name: r.name,
      category: guessCategory(r.name, r.description, [], []),
      email: primaryContact.email || null,
      phone: r.phone || primaryContact.phone || null,
      website: r.website || null,
      address: r.address?.street || null,
      city: r.address?.city || null,
      state: r.address?.state || null,
      zip: r.address?.zip || null,
      country: r.address?.country || 'US',
      description: r.description || null,
      contact_name: primaryContact.name || null,
      contact_title: primaryContact.title || null,
      contact_email: primaryContact.email || null,
      tags: [],
      raw_data: r,
    };
  });
}

// ---------- Pre-scraped dealers ----------
function loadScraped() {
  const files = [
    'blyth-trailer-sales.json',
    'jb-pavelka.json',
    'pinnacle-truck-trailer.json',
  ];

  const results = [];
  for (const file of files) {
    try {
      const raw = JSON.parse(readFileSync(resolve(`data/dealers/${file}`), 'utf8'));
      const d = raw.dealer || raw;
      const primaryContact = raw.sales_contacts?.[0] || {};

      results.push({
        source: 'scraped',
        source_id: d.id || d.company_name,
        company_name: d.company_name,
        category: 'trailer_dealer',
        email: d.email || primaryContact.email || null,
        phone: d.phone || primaryContact.phone || null,
        website: d.website || null,
        address: d.address || null,
        city: d.city || null,
        state: d.state || null,
        zip: d.zip || null,
        country: 'US',
        description: d.about || null,
        contact_name: primaryContact.name || null,
        contact_title: primaryContact.role || null,
        contact_email: primaryContact.email || null,
        brands: d.brands || [],
        equipment_types: d.equipment_types || [],
        tags: [],
        raw_data: raw,
      });
    } catch (e) {
      console.error(`Error loading ${file}:`, e.message);
    }
  }

  console.log(`Scraped dealers: ${results.length}`);
  return results;
}

// ---------- Main ----------
async function main() {
  let businesses = [];

  if (sourceArg === 'all' || sourceArg === 'scra') businesses.push(...loadSCRA());
  if (sourceArg === 'all' || sourceArg === 'conexpo') businesses.push(...loadConExpo());
  if (sourceArg === 'all' || sourceArg === 'scraped') businesses.push(...loadScraped());

  console.log(`\nTotal businesses to import: ${businesses.length}`);

  // Category breakdown
  const catCounts = {};
  businesses.forEach(b => { catCounts[b.category] = (catCounts[b.category] || 0) + 1; });
  console.log('\nAuto-categorized:');
  Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  // Clear existing data for the sources we're importing
  const sourcesToImport = [...new Set(businesses.map(b => b.source))];
  for (const src of sourcesToImport) {
    const { error } = await supabase.from('business_directory').delete().eq('source', src);
    if (error) console.error(`Error clearing ${src}:`, error.message);
    else console.log(`Cleared existing ${src} records`);
  }

  // Insert in batches
  const BATCH_SIZE = 50;
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
    const batch = businesses.slice(i, i + BATCH_SIZE);

    const { data, error } = await supabase
      .from('business_directory')
      .insert(batch)
      .select('id');

    if (error) {
      console.error(`\nBatch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message);
      skipped += batch.length;
    } else {
      inserted += data?.length || 0;
    }

    process.stdout.write(`\rImported ${inserted}/${businesses.length}...`);
  }

  console.log(`\n\nDone! Inserted: ${inserted}, Skipped/errors: ${skipped}`);
}

main().catch(console.error);
