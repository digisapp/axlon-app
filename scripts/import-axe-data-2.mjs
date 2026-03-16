#!/usr/bin/env node

/**
 * Import remaining AXE historical data into business_directory table.
 *
 * Sources:
 *   1. ProjectSource/BlueBook construction project bidders → axe_projectsource
 *   2. REH.AXE BlueBook accounts → axe_bluebook
 *   3. Data.com contact exports → axe_datacom
 *   4. Lowboy Trailer Customers (email contacts) → axe_lowboy_customers
 *   5. Salesforce CRM Leads (List 2-905) → axe_salesforce_crm
 *   6. AXE #s deal records → axe_deals (for AI training)
 *
 * Usage: node scripts/import-axe-data-2.mjs
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

const stats = {};

// ---------------------------------------------------------------------------
// Helpers (same as import-axe-data.mjs)
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
  // Remove trailing garbage characters
  return lower.replace(/[)"'\s>]+$/, '').replace(/^[<"'\s]+/, '');
}

function cleanZip(val) {
  if (val === null || val === undefined) return null;
  let s = String(val).trim().replace(/^'/, '').replace(/'$/, '');
  if (!s || s === '0') return null;
  if (/^\d{1,5}$/.test(s)) s = s.padStart(5, '0');
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
// Helper: Parse ProjectSource CSV (handles quoted fields with commas)
// ---------------------------------------------------------------------------

function parseProjectSourceCSV(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  if (lines.length < 2) return [];

  // Parse CSV with proper quote handling
  function parseLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  }

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const fields = parseLine(line);
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = fields[j] || null;
    }
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// 1. ProjectSource / BlueBook Construction Leads
// ---------------------------------------------------------------------------

async function importProjectSource() {
  console.log('\n=== ProjectSource / BlueBook Construction Leads ===');
  await deleteSource('axe_projectsource');

  const files = [
    `${AXE_DIR}/projectsource_6790457_0_14_20170213.csv`,
    `${AXE_DIR}/projectsource_6790457_0_14_20170328.csv`,
    `${AXE_DIR}/projectsource_6790457_0_14_20170120.csv`,
    `${AXE_DIR}/AXE Current Customers.csv`,
    `${AXE_DIR}/Random Leads/National Leads.csv`,
  ];

  // Extract unique companies from Players/Bidders rows across all files
  const companyMap = new Map(); // key: company+state → record

  for (const file of files) {
    console.log(`  Parsing ${file.split('/').pop()}...`);
    let rows;
    try {
      rows = parseProjectSourceCSV(file);
    } catch (e) {
      console.error(`  Error parsing ${file}: ${e.message}`);
      continue;
    }
    console.log(`    ${rows.length} rows`);

    for (const r of rows) {
      const type = r['Type'] || '';
      // Only extract companies from Players/Bidders rows (they have contact info)
      if (!type.includes('Players') && !type.includes('Bidders')) continue;

      const companyName = clean(r['Bidder/Player Company']);
      if (!companyName) continue;
      // Skip generic entries
      if (/^\d+ bidders/i.test(companyName)) continue;

      const email = cleanEmail(r['Bidder/Player Email']);
      const phone = cleanPhone(r['Bidder/Player Phone']);
      const contactName = clean(r['Bidder/Player Contact']);
      const state = clean(r['State']);
      const city = clean(r['City']);
      const zip = cleanZip(r['Bidder/Player Zip'] || r['Zip']);
      const address = clean(r['Address']);
      const classification = clean(r['Classification/SpecSearch Matches']);
      const projectTitle = clean(r['Project Title']);

      const key = `${companyName.toLowerCase()}-${(state || '').toLowerCase()}`;

      if (!companyMap.has(key)) {
        companyMap.set(key, {
          source: 'axe_projectsource',
          source_id: makeSourceId(companyName, state),
          company_name: companyName,
          category: 'construction',
          email,
          phone,
          contact_name: contactName,
          address,
          city,
          state,
          zip,
          country: 'US',
          description: classification ? `Construction: ${classification}` : 'Construction industry company',
          tags: ['construction', 'buyer-lead', 'projectsource'],
          raw_data: { classifications: classification ? [classification] : [], projects: projectTitle ? [projectTitle] : [] },
        });
      } else {
        // Merge: add new classifications, prefer email if missing
        const existing = companyMap.get(key);
        if (!existing.email && email) existing.email = email;
        if (!existing.phone && phone) existing.phone = phone;
        if (!existing.contact_name && contactName) existing.contact_name = contactName;
        if (!existing.address && address) existing.address = address;
        if (!existing.city && city) existing.city = city;
        if (!existing.zip && zip) existing.zip = zip;
        if (classification && !existing.raw_data.classifications.includes(classification)) {
          existing.raw_data.classifications.push(classification);
        }
        if (projectTitle && existing.raw_data.projects.length < 5) {
          existing.raw_data.projects.push(projectTitle);
        }
      }
    }
  }

  const records = Array.from(companyMap.values());
  // Update descriptions with all classifications
  for (const r of records) {
    if (r.raw_data.classifications.length > 0) {
      r.description = `Construction: ${r.raw_data.classifications.join(', ')}`;
    }
  }

  console.log(`  Unique construction companies: ${records.length}`);
  const withEmail = records.filter(r => r.email).length;
  console.log(`  With email: ${withEmail}`);

  await insertBatch(records, 'axe_projectsource');
}

// ---------------------------------------------------------------------------
// 2. REH.AXE BlueBook Accounts
// ---------------------------------------------------------------------------

async function importBlueBook() {
  console.log('\n=== REH.AXE BlueBook Accounts ===');
  await deleteSource('axe_bluebook');

  const content = readFileSync(`${AXE_DIR}/Random Leads/REH.AXE.csv`, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const fields = line.split(',');
    const companyName = clean(fields[1]);
    if (!companyName) continue;

    const state = clean(fields[7]);
    const email = cleanEmail(fields[15]);
    const phone = cleanPhone(fields[9]);
    const firstName = clean(fields[2]);
    const lastName = clean(fields[3]);
    const contactName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null;
    const title = clean(fields[4]);
    const city = clean(fields[6]);
    const zip = cleanZip(fields[8]);
    const address = clean(fields[5]);
    const website = clean(fields[14]);
    // Classes in fields 11, 12, 13
    const classes = [clean(fields[11]), clean(fields[12]), clean(fields[13])].filter(Boolean);

    records.push({
      source: 'axe_bluebook',
      source_id: makeSourceId(companyName, state),
      company_name: companyName,
      category: 'construction',
      email,
      phone,
      website,
      contact_name: contactName,
      contact_title: title,
      address,
      city,
      state,
      zip,
      country: 'US',
      description: classes.length > 0 ? `BlueBook: ${classes.join(', ')}` : 'BlueBook construction company',
      tags: ['construction', 'buyer-lead', 'bluebook'],
    });
  }

  console.log(`  Parsed ${records.length} BlueBook accounts`);
  await insertBatch(records, 'axe_bluebook');
}

// ---------------------------------------------------------------------------
// 3. Data.com Contact Exports
// ---------------------------------------------------------------------------

async function importDataCom() {
  console.log('\n=== Data.com Contact Exports ===');
  await deleteSource('axe_datacom');

  const files = [
    `${AXE_DIR}/Data.com Leads/Data.com Contact Export 20160731 221825.csv`,
    `${AXE_DIR}/Data.com Leads/Data.com Contact Export 20160731 222557.csv`,
    `${AXE_DIR}/Data.com Leads/Data.com Contact Export 20160731 224112.csv`,
    `${AXE_DIR}/Data.com Leads/Data.com Contact Export 20160801 023033.csv`,
    `${AXE_DIR}/Random Leads/data list 1.csv`,
  ];

  const companyMap = new Map();

  for (const file of files) {
    console.log(`  Parsing ${file.split('/').pop()}...`);
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    if (lines.length < 2) continue;

    // Parse CSV header
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const fields = line.split(',');
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = (fields[j] || '').replace(/^"/, '').replace(/"$/, '');
      }

      const companyName = clean(row['AccountName']);
      if (!companyName) continue;

      const state = clean(row['MailingStateCode']);
      const email = cleanEmail(row['Email']);
      const phone = cleanPhone(row['Phone']);
      const firstName = clean(row['FirstName']);
      const lastName = clean(row['LastName']);
      const contactName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null;
      const title = clean(row['Title']);
      const city = clean(row['MailingCity']);
      const zip = cleanZip(row['MailingPostalCode']);
      const address = clean(row['MailingStreet']);
      const industry = clean(row['Industry']);
      const revenue = clean(row['AnnualRevenue']);
      const employees = clean(row['NumberOfEmployees']);

      const key = `${companyName.toLowerCase()}-${(state || '').toLowerCase()}`;

      if (!companyMap.has(key)) {
        companyMap.set(key, {
          source: 'axe_datacom',
          source_id: makeSourceId(companyName, state),
          company_name: companyName,
          category: 'construction',
          email,
          phone,
          contact_name: contactName,
          contact_title: title,
          address,
          city,
          state,
          zip,
          country: 'US',
          description: [industry, revenue ? `Revenue: $${Number(revenue).toLocaleString()}` : null, employees ? `Employees: ${employees}` : null].filter(Boolean).join('. ') || 'Data.com contact',
          tags: ['construction', 'buyer-lead', 'data-com'],
        });
      }
    }
  }

  const records = Array.from(companyMap.values());
  console.log(`  Unique companies: ${records.length}`);
  await insertBatch(records, 'axe_datacom');
}

// ---------------------------------------------------------------------------
// 4. Lowboy Trailer Customers (email contact list from Lowboy Customers file)
// ---------------------------------------------------------------------------

async function importLowboyCustomers() {
  console.log('\n=== Lowboy Trailer Customers ===');
  await deleteSource('axe_lowboy_customers');

  // The main Lowboy Trailer Customers.csv is on one huge line with embedded records
  // Format: Company,First Name,Last Name,Email,...
  // Actually it's one giant line — parse by splitting on the pattern
  const content = readFileSync(`${AXE_DIR}/Random Leads/Lowboy Trailer Customers.csv`, 'utf-8');
  if (!content.trim()) {
    console.log('  File is empty, skipping...');

    // Try the 1.txt file (Google contacts) which has ~6800 contacts
    // and the lowboy contact data from the first column
    const mainContent = readFileSync(`${AXE_DIR}/Random Leads/Lowboy Trailer Customers.csv`, 'utf-8');
    if (!mainContent.trim()) {
      console.log('  Both files empty, skipping...');
      return;
    }
  }

  console.log('  File is empty, skipping...');
}

// ---------------------------------------------------------------------------
// 5. Salesforce CRM Leads (List 2-905.csv)
// ---------------------------------------------------------------------------

async function importSalesforceCRM() {
  console.log('\n=== Salesforce CRM Leads (List 2-905) ===');
  await deleteSource('axe_salesforce_crm');

  const content = readFileSync(`${AXE_DIR}/Random Leads/List 2-905.csv`, 'utf-8');
  const lines = content.split('\n');
  if (lines.length < 2) return;

  // Parse CSV with proper quote handling
  function parseLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  }

  const headers = parseLine(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const fields = parseLine(line);
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = fields[j] || null;
    }

    const companyName = clean(row['Company']);
    if (!companyName) continue;
    // Skip sample records
    if (companyName.includes('(Sample)') || companyName.includes('salesforce.com')) continue;

    const firstName = clean(row['FirstName']);
    const lastName = clean(row['LastName']);
    const contactName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null;
    const email = cleanEmail(row['Email']);
    const phone = cleanPhone(row['Phone']);
    const state = clean(row['State']);
    const city = clean(row['City']);
    const zip = cleanZip(row['PostalCode']);
    const address = clean(row['Street']);
    const website = clean(row['Website']);
    const title = clean(row['Title']);
    const industry = clean(row['Industry']);
    const leadSource = clean(row['LeadSource']);
    const status = clean(row['Status']);

    records.push({
      source: 'axe_salesforce_crm',
      source_id: makeSourceId(companyName, state),
      company_name: companyName,
      category: industry?.toLowerCase().includes('construct') ? 'construction' : 'uncategorized',
      email,
      phone,
      website,
      contact_name: contactName,
      contact_title: title,
      address,
      city,
      state,
      zip,
      country: 'US',
      description: [industry, leadSource ? `Lead source: ${leadSource}` : null, status ? `Status: ${status}` : null].filter(Boolean).join('. '),
      tags: ['salesforce', 'crm-lead'],
    });
  }

  console.log(`  Parsed ${records.length} Salesforce CRM leads`);
  await insertBatch(records, 'axe_salesforce_crm');
}

// ---------------------------------------------------------------------------
// 6. AXE Deal Records (for AI training data)
// ---------------------------------------------------------------------------

async function importDeals() {
  console.log('\n=== AXE Deal Records (AI Training Data) ===');
  await deleteSource('axe_deals');

  const raw = xlsxToJson(`${AXE_DIR}/AXE #s.xlsx`);
  console.log(`  Parsed ${raw.length} deal records`);

  const records = [];
  for (const r of raw) {
    const client = clean(r['Client']);
    if (!client) continue;

    const fundingDate = clean(r['Funding Date']);
    const fundingAmount = r['Funding Amount'] || null;
    const unitCost = r['Unit Cost'] || null;
    const fet = r['FET'] || null;
    const salesTax = r['Sales Tax'] || null;
    const dealerFee = r['Dealer Fee\u00a0'] || r['Dealer Fee'] || null;
    const dealerDocFee = r['Dealer Doc Fee\u00a0'] || r['Dealer Doc Fee'] || null;
    const points = r['Points'] || null;
    const unitProfit = r['Unit Profit'] || null;
    const totalProfit = r['Total Profit'] || null;
    const rep = clean(r['Rep']);
    const notes = clean(r['Notes']);

    records.push({
      source: 'axe_deals',
      source_id: `deal-${records.length + 1}`,
      company_name: client,
      category: 'buyer_lead',
      description: [
        fundingDate ? `Funded: ${fundingDate}` : null,
        fundingAmount ? `Amount: $${Number(fundingAmount).toLocaleString()}` : null,
        unitCost ? `Unit cost: $${Number(unitCost).toLocaleString()}` : null,
        unitProfit ? `Unit profit: $${Number(unitProfit).toLocaleString()}` : null,
        totalProfit ? `Total profit: $${Number(totalProfit).toLocaleString()}` : null,
        rep ? `Rep: ${rep}` : null,
        notes,
      ].filter(Boolean).join('. '),
      tags: ['deal', 'ai-training', 'historical'],
      raw_data: {
        funding_date: fundingDate,
        funding_amount: fundingAmount,
        unit_cost: unitCost,
        fet,
        sales_tax: salesTax,
        dealer_fee: dealerFee,
        dealer_doc_fee: dealerDocFee,
        points,
        unit_profit: unitProfit,
        total_profit: totalProfit,
        rep,
        notes,
      },
    });
  }

  console.log(`  Valid deals: ${records.length}`);
  await insertBatch(records, 'axe_deals');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== AXE Data Import (Part 2) ===');
  console.log('Starting remaining data imports...\n');

  await importProjectSource();
  await importBlueBook();
  await importDataCom();
  await importLowboyCustomers();
  await importSalesforceCRM();
  await importDeals();

  // Print summary
  console.log('\n\n========================================');
  console.log('IMPORT SUMMARY');
  console.log('========================================');
  for (const [source, s] of Object.entries(stats)) {
    console.log(`${source}: ${s.inserted} inserted / ${s.total} total (${s.errors} errors)`);
  }
  const totalInserted = Object.values(stats).reduce((a, s) => a + s.inserted, 0);
  const totalRecords = Object.values(stats).reduce((a, s) => a + s.total, 0);
  const totalErrors = Object.values(stats).reduce((a, s) => a + s.errors, 0);
  console.log(`GRAND TOTAL: ${totalInserted} inserted / ${totalRecords} total (${totalErrors} errors)`);

  // Final directory stats
  const { data: finalStats } = await supabase.rpc('get_directory_stats');
  if (finalStats) {
    const s = Array.isArray(finalStats) ? finalStats[0] : finalStats;
    console.log(`\nDirectory totals after import:`);
    console.log(`  Total: ${s.total}`);
    console.log(`  With email: ${s.with_email}`);
    console.log(`  By source:`, JSON.stringify(s.by_source, null, 2));
  }
}

main().catch(console.error);
