#!/usr/bin/env node

/**
 * Import AXE historical data into business_directory table.
 *
 * Sources:
 *   1. NTDA Convention Attendees (2016 + 2018) → axe_ntda
 *   2. Salesforce Lead Report with Equipment Prefs → axe_salesforce (imported first for equipment data)
 *   3. Salesforce CRM Leads (leadsss.xlsx) → axe_salesforce
 *   4. ConExpo 2017 Badge Scans → axe_conexpo_2017
 *   5. Open Opportunities → axe_opportunities
 *
 * Usage: node scripts/import-axe-data.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BATCH_SIZE = 50;
const AXE_DIR = '/Users/examodels/Desktop/axe data';

// Stats tracker
const stats = {};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSourceId(companyName, state) {
  const raw = `${(companyName || '').toLowerCase()}-${(state || '').toLowerCase()}`;
  return raw.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
}

function clean(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  if (!s || s === 'N/A' || s === 'NA' || s === 'n/a' || s === 'DK' || s === 'None') return null;
  return s;
}

function cleanPhone(val) {
  const p = clean(val);
  if (!p) return null;
  return p.replace(/[^\d()+\-.\s]/g, '').trim() || null;
}

function cleanEmail(val) {
  const e = clean(val);
  if (!e) return null;
  const lower = e.toLowerCase().trim();
  if (!lower.includes('@') || !lower.includes('.')) return null;
  return lower;
}

function cleanZip(val) {
  if (val === null || val === undefined) return null;
  let s = String(val).trim().replace(/^'/, '').replace(/'$/, '');
  if (!s || s === '0') return null;
  // Pad US zips to 5 digits
  if (/^\d{1,5}$/.test(s)) {
    s = s.padStart(5, '0');
  }
  return s;
}

function xlsxToJson(filePath, sheetName) {
  const sheet = sheetName ? `wb['${sheetName}']` : 'wb.active';
  const jsonStr = execSync(`python3 -c "
import openpyxl, json, sys
wb = openpyxl.load_workbook('${filePath}')
ws = ${sheet}
headers = [cell.value for cell in next(ws.iter_rows(max_row=1))]
rows = []
for row in ws.iter_rows(min_row=2, values_only=True):
    d = {}
    for i, h in enumerate(headers):
        if h and i < len(row):
            v = row[i]
            if hasattr(v, 'isoformat'):
                v = v.isoformat()
            d[str(h).strip()] = v
    rows.append(d)
print(json.dumps(rows))
"`, { maxBuffer: 100 * 1024 * 1024 }).toString();
  return JSON.parse(jsonStr);
}

async function deleteSource(source) {
  console.log(`  Deleting existing '${source}' records...`);
  const { error } = await supabase.from('business_directory').delete().eq('source', source);
  if (error) console.error(`  Delete error for ${source}:`, error.message);
}

async function insertBatch(records, source) {
  let inserted = 0;
  let errors = 0;

  // Deduplicate within the batch by source_id
  const seen = new Set();
  const deduped = [];
  for (const r of records) {
    const key = `${r.source}|${r.source_id}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(r);
    }
  }

  for (let i = 0; i < deduped.length; i += BATCH_SIZE) {
    const batch = deduped.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from('business_directory')
      .insert(batch)
      .select('id');

    if (error) {
      // Try inserting one by one on batch error (handles dupe source_id conflicts)
      for (const record of batch) {
        const { data: d2, error: e2 } = await supabase
          .from('business_directory')
          .insert([record])
          .select('id');
        if (e2) {
          errors++;
        } else {
          inserted += d2?.length || 0;
        }
      }
    } else {
      inserted += data?.length || 0;
    }
    process.stdout.write(`\r  Inserted ${inserted}/${deduped.length} (${errors} errors)...`);
  }

  console.log(`\r  Inserted ${inserted}/${deduped.length} (${errors} errors)      `);
  stats[source] = { total: deduped.length, inserted, errors };
}

// ---------------------------------------------------------------------------
// 1. NTDA Convention Attendees
// ---------------------------------------------------------------------------

async function importNtda() {
  console.log('\n=== NTDA Convention Attendees ===');
  await deleteSource('axe_ntda');

  // -- 2016 list --
  console.log('  Parsing 2016 NTDA attendee list...');
  const raw2016 = xlsxToJson(`${AXE_DIR}/26th Annual NTDA Convention - Attendee List.xlsx`);
  console.log(`  2016 list: ${raw2016.length} rows`);

  const validTypes2016 = ['Allied', 'Dealer'];
  const filtered2016 = raw2016.filter(r => validTypes2016.includes(clean(r['Category'])));
  console.log(`  After filtering (Dealer/Allied only): ${filtered2016.length}`);

  // Track companies we've seen for dedup with 2018
  const seenCompanyState = new Set();

  const records2016 = [];
  for (const r of filtered2016) {
    const company = clean(r['Company']);
    if (!company) continue;
    const state = clean(r['US State']) || null;
    const category = clean(r['Category']) === 'Dealer' ? 'trailer_dealer' : 'trailer_manufacturer';
    const sourceId = makeSourceId(company, state);
    const key = `${company.toLowerCase()}|${(state || '').toLowerCase()}`;
    seenCompanyState.add(key);

    const firstName = clean(r['First Name']);
    const lastName = clean(r['Last Name']);
    const contactName = [firstName, lastName].filter(Boolean).join(' ') || null;

    records2016.push({
      source: 'axe_ntda',
      source_id: sourceId,
      company_name: company,
      category,
      email: cleanEmail(r['Email Address']),
      phone: cleanPhone(r['Work Phone']),
      address: clean(r['Address Line 1']),
      city: clean(r['City']),
      state,
      zip: cleanZip(r['Zip (Postal Code)']),
      country: clean(r['Country']) === 'Canada' ? 'CA' : 'US',
      contact_name: contactName,
      contact_title: clean(r['Job Title']),
      contact_email: cleanEmail(r['Email Address']),
      tags: ['ntda-convention-2016', category === 'trailer_dealer' ? 'dealer' : 'allied'],
      raw_data: { ntda_year: 2016, ntda_category: clean(r['Category']) },
    });
  }

  // -- 2018 list (Sheet1 = "Registrants by Last Name") --
  console.log('  Parsing 2018 NTDA registrations...');
  const raw2018 = xlsxToJson(
    `${AXE_DIR}/NTDA Convention Registrations as of 092418.xlsx`,
    'Registrants by Last Name'
  );
  console.log(`  2018 list: ${raw2018.length} rows`);

  const validTypes2018 = ['Dealer Registrant', 'Allied Registrant'];
  const filtered2018 = raw2018.filter(r => validTypes2018.includes(clean(r['Registrant Type'])));
  console.log(`  After filtering (Dealer/Allied only): ${filtered2018.length}`);

  let deduped2018 = 0;
  for (const r of filtered2018) {
    const company = clean(r['Company']);
    if (!company) continue;
    const state = clean(r['State']) || null;
    const key = `${company.toLowerCase()}|${(state || '').toLowerCase()}`;

    // Skip if already in 2016 list
    if (seenCompanyState.has(key)) {
      deduped2018++;
      continue;
    }
    seenCompanyState.add(key);

    const regType = clean(r['Registrant Type']);
    const category = regType === 'Dealer Registrant' ? 'trailer_dealer' : 'trailer_manufacturer';
    const sourceId = makeSourceId(company, state);

    const firstName = clean(r['First Name']);
    const lastName = clean(r['Last Name']);
    const contactName = [firstName, lastName].filter(Boolean).join(' ') || null;

    records2016.push({
      source: 'axe_ntda',
      source_id: sourceId,
      company_name: company,
      category,
      email: cleanEmail(r['E-Mail Address']),
      phone: cleanPhone(r['Phone Number']),
      address: clean(r['Address 1']),
      city: clean(r['City']),
      state,
      zip: cleanZip(r['Zip']),
      country: clean(r['Country']) === 'Canada' ? 'CA' : 'US',
      contact_name: contactName,
      contact_title: clean(r['Title']),
      contact_email: cleanEmail(r['E-Mail Address']),
      tags: ['ntda-convention-2018', category === 'trailer_dealer' ? 'dealer' : 'allied'],
      raw_data: { ntda_year: 2018, ntda_registrant_type: regType },
    });
  }

  console.log(`  Deduped 2018 vs 2016: ${deduped2018} skipped`);
  console.log(`  Total NTDA records to insert: ${records2016.length}`);
  await insertBatch(records2016, 'axe_ntda');
}

// ---------------------------------------------------------------------------
// 2. Salesforce Lead Report (HTML-as-XLS) — import FIRST for equipment data
// ---------------------------------------------------------------------------

async function importSalesforceReport() {
  console.log('\n=== Salesforce Lead Report (Equipment/Manufacturer data) ===');
  // Don't delete here — we'll delete axe_salesforce once, before this runs

  console.log('  Parsing HTML-as-XLS file...');
  const html = readFileSync(`${AXE_DIR}/report1485016682565.xls`, 'latin1');

  // Parse HTML table rows
  const rows = [];
  const trRegex = /<tr>(.*?)<\/tr>/gs;
  let match;
  let isHeader = true;
  const headers = [];

  while ((match = trRegex.exec(html)) !== null) {
    const cells = [];
    const tdRegex = /<t[hd][^>]*>(.*?)<\/t[hd]>/gs;
    let cellMatch;
    while ((cellMatch = tdRegex.exec(match[1])) !== null) {
      // Decode HTML entities
      let val = cellMatch[1]
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
      cells.push(val);
    }

    if (isHeader) {
      headers.push(...cells);
      isHeader = false;
    } else if (cells.length > 0) {
      const obj = {};
      for (let i = 0; i < headers.length && i < cells.length; i++) {
        obj[headers[i]] = cells[i];
      }
      rows.push(obj);
    }
  }

  console.log(`  Parsed ${rows.length} rows from HTML table`);

  const records = [];
  for (const r of rows) {
    const company = clean(r['Company / Account']);
    if (!company) continue;

    const firstName = clean(r['First Name']);
    const lastName = clean(r['Last Name']);
    const contactName = [firstName, lastName].filter(Boolean).join(' ') || null;
    const email = cleanEmail(r['Email']);

    // Build source_id from company (no state in this data)
    const sourceId = makeSourceId(company, '');

    const equipmentType = clean(r['Equipment Type']);
    const manufacturer = clean(r['Manufacturer']);
    const leadSource = clean(r['Lead Source']);
    const rating = clean(r['Rating']);

    const tags = ['sf-report'];
    if (leadSource) tags.push(`source:${leadSource}`);
    if (rating) tags.push(`rating:${rating}`);

    records.push({
      source: 'axe_salesforce',
      source_id: sourceId,
      company_name: company,
      category: 'uncategorized',
      email,
      address: clean(r['Street']),
      contact_name: contactName,
      contact_title: clean(r['Title']),
      contact_email: email,
      equipment_types: equipmentType ? [equipmentType] : [],
      brands: manufacturer ? [manufacturer] : [],
      tags,
      raw_data: {
        lead_owner: clean(r['Lead Owner']),
        lead_source: leadSource,
        rating,
        equipment_type: equipmentType,
        manufacturer,
      },
    });
  }

  console.log(`  Records to insert: ${records.length}`);
  await insertBatch(records, 'axe_salesforce_report');
  // We'll track this separately, then the main leadsss import won't overwrite
  // Actually — to keep them in same source, insert these first as axe_salesforce
  // and let leadsss skip dupes via upsert ignoreDuplicates
}

// ---------------------------------------------------------------------------
// 3. Salesforce CRM Leads (leadsss.xlsx)
// ---------------------------------------------------------------------------

async function importSalesforceLeads() {
  console.log('\n=== Salesforce CRM Leads (leadsss.xlsx) ===');

  console.log('  Parsing XLSX...');
  const raw = xlsxToJson(`${AXE_DIR}/leadsss.xlsx`);
  console.log(`  Parsed ${raw.length} rows`);

  const records = [];
  for (const r of raw) {
    const company = clean(r['Company / Account']);
    if (!company) continue;

    const firstName = clean(r['First Name']);
    const lastName = clean(r['Last Name']);
    const contactName = [firstName, lastName].filter(Boolean).join(' ') || null;
    const state = clean(r['State/Province']) || null;
    const email = cleanEmail(r['Email']);
    const leadSource = clean(r['Lead Source']);

    const sourceId = makeSourceId(company, state);

    const tags = ['salesforce-crm'];
    if (leadSource) tags.push(`source:${leadSource}`);

    records.push({
      source: 'axe_salesforce',
      source_id: sourceId,
      company_name: company,
      category: 'uncategorized',
      email,
      phone: cleanPhone(r['Phone']),
      address: clean(r['Street']),
      city: clean(r['City']),
      state,
      zip: cleanZip(r['Zip/Postal Code']),
      contact_name: contactName,
      contact_title: clean(r['Title']),
      contact_email: email,
      tags,
      raw_data: { lead_source: leadSource },
    });
  }

  console.log(`  Records to insert (will skip dupes from report): ${records.length}`);
  await insertBatch(records, 'axe_salesforce_leads');
}

// ---------------------------------------------------------------------------
// 4. ConExpo 2017 Badge Scans
// ---------------------------------------------------------------------------

async function importConexpo2017() {
  console.log('\n=== ConExpo 2017 Badge Scans ===');
  await deleteSource('axe_conexpo_2017');

  console.log('  Parsing CSV...');
  const csvText = readFileSync(`${AXE_DIR}/leads-export-1489613582466.csv`, 'utf-8');
  const lines = csvText.split('\n');

  // Parse CSV with proper quote handling
  function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += c;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseCSVLine(lines[0].replace(/^\uFEFF/, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = parseCSVLine(line);
    const obj = {};
    for (let j = 0; j < headers.length && j < cells.length; j++) {
      obj[headers[j]] = cells[j];
    }
    rows.push(obj);
  }

  console.log(`  Parsed ${rows.length} rows`);

  const records = [];
  for (const r of rows) {
    const company = clean(r['Company']);
    if (!company) continue;

    const firstName = clean(r['FirstName']);
    const lastName = clean(r['LastName']);
    const contactName = [firstName, lastName].filter(Boolean).join(' ') || null;
    const state = clean(r['StateCode']) || null;
    const email = cleanEmail(r['Email']);

    const sourceId = makeSourceId(company, state);

    const primaryBusiness = clean(r['What is your Primary Business']);
    const purchaseTimeframe = clean(r['Purchase Timeframe']);
    const purchaseAuth = clean(r['Purchase Authorization']);
    const equipmentInterest = clean(r['Which types of equipment/services are you involved in the purchase or rental of']);

    const tags = ['conexpo-2017'];
    if (primaryBusiness) tags.push(`biz:${primaryBusiness}`);
    if (purchaseTimeframe) tags.push(`timeframe:${purchaseTimeframe}`);
    if (purchaseAuth) tags.push(`auth:${purchaseAuth}`);

    records.push({
      source: 'axe_conexpo_2017',
      source_id: sourceId,
      company_name: company,
      category: 'uncategorized',
      email,
      phone: cleanPhone(r['Phone1']),
      address: clean(r['Address1']),
      city: clean(r['City']),
      state,
      zip: cleanZip(r['ZipCode']),
      country: clean(r['CountryCode']) || 'US',
      contact_name: contactName,
      contact_title: clean(r['Title']),
      contact_email: email,
      tags,
      raw_data: {
        primary_business: primaryBusiness,
        purchase_timeframe: purchaseTimeframe,
        purchase_authorization: purchaseAuth,
        equipment_interest: equipmentInterest,
        primary_show: clean(r['Primary Show']),
        reg_type: clean(r['RegTypeCode']),
        captured_date: clean(r['Captured Date']),
        captured_by: clean(r['Captured By']),
      },
    });
  }

  console.log(`  Records to insert: ${records.length}`);
  await insertBatch(records, 'axe_conexpo_2017');
}

// ---------------------------------------------------------------------------
// 5. Open Opportunities
// ---------------------------------------------------------------------------

async function importOpenOpportunities() {
  console.log('\n=== Open Opportunities ===');
  await deleteSource('axe_opportunities');

  console.log('  Parsing XLSX...');
  const raw = xlsxToJson(`${AXE_DIR}/open opp.xlsx`);
  console.log(`  Parsed ${raw.length} rows`);

  const records = [];
  for (const r of raw) {
    const company = clean(r['Account Name']);
    if (!company) continue;

    const state = clean(r['Shipping State/Province']) || null;
    const email = cleanEmail(r['Contact: Email']);
    const sourceId = makeSourceId(company, state);
    const leadSource = clean(r['Lead Source']);
    const oppName = clean(r['Opportunity Name']);

    const tags = ['open-opportunity'];
    if (leadSource) tags.push(`source:${leadSource}`);

    let description = null;
    if (oppName && oppName !== company && oppName !== 'N/A') {
      description = `Opportunity: ${oppName}`;
    }

    records.push({
      source: 'axe_opportunities',
      source_id: sourceId,
      company_name: company,
      category: 'uncategorized',
      email,
      phone: cleanPhone(r['Phone']),
      city: clean(r['Mailing City']),
      state,
      address: clean(r['Shipping Address Line 1']),
      contact_email: email,
      description,
      tags,
      raw_data: {
        opportunity_name: oppName,
        lead_source: leadSource,
        close_date: r['Close Date'] || null,
        created_date: r['Created Date'] || null,
      },
    });
  }

  console.log(`  Records to insert: ${records.length}`);
  await insertBatch(records, 'axe_opportunities');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('='.repeat(60));
  console.log('AXE Data Import — importing into business_directory');
  console.log('='.repeat(60));

  // Delete axe_salesforce once before both report + leads imports
  await deleteSource('axe_salesforce');

  // 1. NTDA Convention Attendees
  await importNtda();

  // 2. Salesforce Report (has equipment/manufacturer data — import first)
  await importSalesforceReport();

  // 3. Salesforce CRM Leads (skips dupes from report)
  await importSalesforceLeads();

  // 4. ConExpo 2017
  await importConexpo2017();

  // 5. Open Opportunities
  await importOpenOpportunities();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('IMPORT SUMMARY');
  console.log('='.repeat(60));

  let grandTotal = 0;
  let grandInserted = 0;
  let grandErrors = 0;

  for (const [source, s] of Object.entries(stats)) {
    console.log(`  ${source}: ${s.inserted} inserted / ${s.total} total (${s.errors} errors)`);
    grandTotal += s.total;
    grandInserted += s.inserted;
    grandErrors += s.errors;
  }

  console.log('-'.repeat(60));
  console.log(`  GRAND TOTAL: ${grandInserted} inserted / ${grandTotal} total (${grandErrors} errors)`);

  // Fetch overall directory stats
  const { data: dirStats } = await supabase.rpc('get_directory_stats');
  if (dirStats) {
    console.log('\nDirectory totals after import:');
    console.log(`  Total records: ${dirStats.total}`);
    console.log(`  With email: ${dirStats.with_email}`);
    console.log(`  By source:`, JSON.stringify(dirStats.by_source, null, 4));
  }
}

main().catch(err => {
  console.error('\nFATAL ERROR:', err);
  process.exit(1);
});
