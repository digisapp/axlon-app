#!/usr/bin/env node

/**
 * Import Tow & Trucking Industry List into business_directory as 'buyer_lead' category.
 * These are potential buyers of trailers, not dealers.
 *
 * Usage: node scripts/import-tow-trucking-leads.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Use xlsx-lite approach — parse XLSX with a lightweight method
// Since we can't guarantee xlsx package is installed, we'll convert to JSON first
import { execSync } from 'child_process';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // Convert XLSX to JSON via Python
  console.log('Converting XLSX to JSON...');
  const jsonStr = execSync(`python3 -c "
import openpyxl, json
wb = openpyxl.load_workbook('/Users/examodels/Desktop/trailer data/Tow & Trucking Industry List 2018.xlsx')
ws = wb['Sheet1']
headers = [cell.value for cell in next(ws.iter_rows(max_row=1))]
rows = []
for row in ws.iter_rows(min_row=2, values_only=True):
    d = {}
    for i, h in enumerate(headers):
        if h and i < len(row):
            d[h] = row[i]
    if d.get('Company Name'):
        rows.append(d)
print(json.dumps(rows))
"`, { maxBuffer: 50 * 1024 * 1024 }).toString();

  const raw = JSON.parse(jsonStr);
  console.log(`Parsed ${raw.length} contacts from XLSX`);

  // Deduplicate by company — keep first contact per company as primary
  const companyMap = new Map();
  for (const r of raw) {
    const key = (r['Company Name'] || '').toLowerCase().trim();
    if (!key) continue;

    if (!companyMap.has(key)) {
      companyMap.set(key, {
        company_name: r['Company Name'],
        contact_name: r['Contact Name'] || null,
        contact_title: r['Job Title'] || null,
        contact_email: r['Contact Email'] || null,
        email: r['Contact Email'] || null,
        phone: r['Phone Number'] || null,
        website: r['Web site'] || null,
        address: r['Company Address'] || null,
        city: r['City'] || null,
        state: r['State'] || null,
        zip: String(r['Zipcode'] || ''),
        country: r['Country'] || 'United States',
        revenue: r['Revenue Size'] || null,
        employees: r['Employees Size'] || null,
        extra_contacts: [],
      });
    } else {
      // Add extra contacts
      const existing = companyMap.get(key);
      if (r['Contact Email'] && r['Contact Email'] !== existing.email) {
        existing.extra_contacts.push({
          name: r['Contact Name'],
          title: r['Job Title'],
          email: r['Contact Email'],
        });
      }
    }
  }

  const companies = Array.from(companyMap.values());
  console.log(`Unique companies: ${companies.length}`);

  // Normalize state names to abbreviations
  const stateMap = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
    'District of Columbia': 'DC',
  };

  // Build records
  const records = companies.map(c => {
    const stateAbbr = stateMap[c.state] || c.state || null;
    return {
      source: 'tow_trucking_list',
      source_id: c.company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 100),
      company_name: c.company_name,
      category: 'towing',
      email: c.email,
      phone: c.phone,
      website: c.website,
      address: c.address,
      city: c.city,
      state: stateAbbr,
      zip: c.zip || null,
      country: 'US',
      description: c.revenue ? `Tow/trucking company. Revenue: ${c.revenue}, Employees: ${c.employees}` : 'Tow/trucking company.',
      contact_name: c.contact_name,
      contact_title: c.contact_title,
      contact_email: c.contact_email,
      tags: ['towing', 'buyer-lead', 'trucking'],
      raw_data: c.extra_contacts.length > 0 ? { extra_contacts: c.extra_contacts } : null,
    };
  });

  // Clear existing tow_trucking_list records
  console.log('Clearing existing tow_trucking_list records...');
  const { error: delError } = await supabase.from('business_directory').delete().eq('source', 'tow_trucking_list');
  if (delError) console.error('Delete error:', delError.message);

  // Insert in batches
  const BATCH_SIZE = 50;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from('business_directory')
      .insert(batch)
      .select('id');

    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message);
      errors += batch.length;
    } else {
      inserted += data?.length || 0;
    }
    process.stdout.write(`\rInserted ${inserted}/${records.length}...`);
  }

  console.log(`\n\nDone! Inserted: ${inserted}, Errors: ${errors}`);

  // Stats
  const { data: stats } = await supabase.rpc('get_directory_stats');
  if (stats) {
    console.log('\nDirectory stats:');
    console.log(`  Total: ${stats.total}`);
    console.log(`  With email: ${stats.with_email}`);
    console.log(`  By source:`, JSON.stringify(stats.by_source, null, 4));
    console.log(`  By category:`, JSON.stringify(stats.by_category, null, 4));
  }
}

main().catch(console.error);
