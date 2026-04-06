/**
 * build-outreach-lists.mjs
 *
 * Segments SCRA, CONEXPO, and NTDA data into prioritized outreach CSVs.
 * Outputs:
 *   data/outreach-tier1-scra.csv     — SCRA carriers & rigging (highest intent, direct emails)
 *   data/outreach-tier2-conexpo.csv  — CONEXPO dealers & equipment companies (US only, with contacts)
 *   data/outreach-summary.txt        — Quick stats and talking points
 *
 * Run: node scripts/build-outreach-lists.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../data');

// ─── Load raw data ──────────────────────────────────────────────────────────

const scraRaw = JSON.parse(readFileSync(join(dataDir, 'scra-directory.json'), 'utf-8'));
const conexpoRaw = JSON.parse(readFileSync(join(dataDir, 'conexpo-exhibitors.json'), 'utf-8'));
const ntdaRaw = JSON.parse(readFileSync(join(dataDir, 'ntda-exhibitors.json'), 'utf-8'));

// ─── SCRA segmentation ───────────────────────────────────────────────────────
// Target: carriers (T), rigging (R), crane (C), heavy lift — US companies with real emails

const SCRA_TARGET_CODES = ['T-Transportation', 'R-Rigging', 'C-Crane', 'H-Heavy'];
const SCRA_EXCLUDE_CODES = ['I-Insurance', 'F-Financial', 'L-Legal', 'P-Publishing'];

function scraScore(company) {
  let score = 0;
  const codes = company.service_codes || [];
  const codesStr = codes.join(' ');

  // Core target codes
  if (codesStr.includes('R-Rigging')) score += 40;
  if (codesStr.includes('C-Crane') || codesStr.toLowerCase().includes('crane')) score += 35;
  if (codesStr.includes('T-Transportation')) score += 25;
  if (codesStr.toLowerCase().includes('heavy') || codesStr.toLowerCase().includes('H-')) score += 20;

  // Has direct email (not scranet.org)
  const email = company.email || '';
  if (email && !email.includes('scranet.org') && email.includes('@')) score += 30;

  // Has website
  if (company.website && company.website.length > 8 && !company.website.endsWith('/')) score += 10;

  // Has phone
  if (company.phone && company.phone.length > 7) score += 10;

  // Penalize non-target allied codes
  const allied = (company.allied_codes || []).join(' ');
  if (SCRA_EXCLUDE_CODES.some(c => allied.includes(c) || codesStr.includes(c))) score -= 20;

  return score;
}

function extractScraPersonnel(company) {
  const personnel = company.personnel || [];
  // Filter out generic/placeholder contacts
  const real = personnel.filter(p =>
    p.name &&
    p.name.trim() !== '' &&
    !p.name.toLowerCase().includes('member get') &&
    !p.name.toLowerCase().includes('a-member') &&
    p.name.trim().length > 3
  );
  if (real.length > 0) return real[0];
  return null;
}

function parseStateFromAddress(address) {
  if (!address) return '';
  // Try to extract state from address string like "... Huntsville, AL 35806 United States"
  const match = address.match(/,\s+([A-Z]{2})\s+\d{5}/);
  return match ? match[1] : '';
}

const scraFiltered = scraRaw
  .filter(c => {
    const codes = (c.service_codes || []).join(' ');
    const hasTargetCode = SCRA_TARGET_CODES.some(code => codes.includes(code));
    const hasEmail = c.email && c.email.includes('@') && !c.email.includes('scranet.org');
    const isUS = c.address && (c.address.includes('United States') || c.address.includes(', AL ') || !c.address.includes('Canada'));
    return hasTargetCode && hasEmail && isUS;
  })
  .map(c => {
    const personnel = extractScraPersonnel(c);
    const state = c.state || parseStateFromAddress(c.address);
    const score = scraScore(c);
    const codes = (c.service_codes || []).join(', ');

    // Determine vertical for personalized outreach
    let vertical = 'Heavy Haul / Specialized Transport';
    if (codes.toLowerCase().includes('rigging')) vertical = 'Crane & Rigging';
    else if (codes.toLowerCase().includes('crane')) vertical = 'Crane & Rigging';
    else if (codes.toLowerCase().includes('transport')) vertical = 'Specialized Transport';

    return {
      company: c.name,
      vertical,
      email: c.email,
      phone: c.phone || '',
      website: c.website || '',
      state,
      contact_name: personnel?.name || '',
      contact_title: personnel?.title || '',
      member_since: c.member_since || '',
      service_codes: codes,
      score,
      linkedin_search: `"${c.name}" owner OR CEO OR president site:linkedin.com`,
      outreach_template: vertical.includes('Crane') ? 'crane-rigging' : 'heavy-haul',
    };
  })
  .filter(c => c.score >= 40)
  .sort((a, b) => b.score - a.score);

// ─── CONEXPO segmentation ────────────────────────────────────────────────────
// Target: US equipment dealers, manufacturers, rental companies with direct contacts

const CONEXPO_TARGET_KEYWORDS = [
  'dealer', 'equipment', 'trailer', 'crane', 'excavat', 'loader', 'bulldoz',
  'heavy', 'fleet', 'transport', 'rental', 'lifting', 'rigging', 'haul',
  'construction equip', 'machinery', 'trucking',
];

const CONEXPO_EXCLUDE_KEYWORDS = [
  'insurance', 'software', 'saas', 'consulting', 'staffing', 'recruiting',
  'marketing', 'printing', 'apparel', 'clothing', 'media', 'publishing',
  'finance', 'bank', 'accounting', 'legal', 'law firm',
  'toolbox', 'toolboxes', 'parts only', 'wear parts', 'spare parts',
];

function conexpoScore(exhibitor) {
  let score = 0;
  const desc = (exhibitor.description || '').toLowerCase();
  const name = (exhibitor.name || '').toLowerCase();
  const combined = name + ' ' + desc;

  // Target keyword matches
  CONEXPO_TARGET_KEYWORDS.forEach(kw => {
    if (combined.includes(kw)) score += 15;
  });

  // Exclude keyword matches
  CONEXPO_EXCLUDE_KEYWORDS.forEach(kw => {
    if (combined.includes(kw)) score -= 25;
  });

  // Has a direct contact with email
  const contacts = exhibitor.contacts || [];
  const realContacts = contacts.filter(c => c.email && c.email.includes('@'));
  if (realContacts.length > 0) score += 40;

  // Has phone
  if (exhibitor.phone) score += 10;

  // Has website
  if (exhibitor.website && exhibitor.website.length > 8) score += 10;

  // US only
  const country = exhibitor.address?.country || '';
  if (country !== 'UNITED STATES') score -= 50;

  // Dealer/rental specific bonus
  if (combined.includes('dealer') || combined.includes('dealership')) score += 20;
  if (combined.includes('rental') || combined.includes('rent')) score += 15;
  if (combined.includes('trailer') || combined.includes('lowboy') || combined.includes('heavy haul')) score += 25;
  if (combined.includes('crane') || combined.includes('rigging')) score += 25;

  return score;
}

const conexpoFiltered = conexpoRaw.exhibitors
  .filter(e => {
    const country = e.address?.country || '';
    if (country && country !== 'UNITED STATES') return false;
    const score = conexpoScore(e);
    return score >= 30;
  })
  .map(e => {
    const contacts = (e.contacts || []).filter(c => c.email && c.email.includes('@'));
    const primaryContact = contacts[0] || {};
    const score = conexpoScore(e);

    const desc = (e.description || '').toLowerCase();
    const name = (e.name || '').toLowerCase();
    let vertical = 'Equipment Dealer / Manufacturer';
    if (name.includes('crane') || desc.includes('crane') || desc.includes('rigging')) vertical = 'Crane & Rigging';
    else if (name.includes('trailer') || desc.includes('trailer') || desc.includes('lowboy')) vertical = 'Trailer / Heavy Haul';
    else if (desc.includes('rental') || desc.includes('rent')) vertical = 'Equipment Rental';
    else if (desc.includes('dealer') || desc.includes('dealership')) vertical = 'Equipment Dealer';

    return {
      company: e.name,
      vertical,
      contact_name: primaryContact.name || '',
      contact_title: primaryContact.title || '',
      contact_email: primaryContact.email || '',
      phone: e.phone || '',
      website: e.website || '',
      city: e.address?.city || '',
      state: e.address?.state || '',
      description_snippet: (e.description || '').slice(0, 120).replace(/\n/g, ' '),
      score,
      outreach_template: vertical.includes('Crane') ? 'crane-rigging' : vertical.includes('Dealer') ? 'equipment-dealer' : 'heavy-haul',
    };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 300); // Top 300

// ─── CSV builder ─────────────────────────────────────────────────────────────

function toCSV(rows, columns) {
  const escape = val => {
    const str = String(val ?? '').replace(/"/g, '""');
    return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
  };
  const header = columns.join(',');
  const lines = rows.map(row => columns.map(col => escape(row[col])).join(','));
  return [header, ...lines].join('\n');
}

// ─── Write Tier 1: SCRA ───────────────────────────────────────────────────────

const scraCSV = toCSV(scraFiltered, [
  'company', 'vertical', 'email', 'phone', 'website', 'state',
  'contact_name', 'contact_title', 'member_since', 'service_codes',
  'score', 'outreach_template', 'linkedin_search',
]);

writeFileSync(join(dataDir, 'outreach-tier1-scra.csv'), scraCSV);
console.log(`✓ SCRA Tier 1: ${scraFiltered.length} companies → data/outreach-tier1-scra.csv`);

// ─── Write Tier 2: CONEXPO ───────────────────────────────────────────────────

const conexpoCSV = toCSV(conexpoFiltered, [
  'company', 'vertical', 'contact_name', 'contact_title', 'contact_email',
  'phone', 'website', 'city', 'state', 'score', 'outreach_template', 'description_snippet',
]);

writeFileSync(join(dataDir, 'outreach-tier2-conexpo.csv'), conexpoCSV);
console.log(`✓ CONEXPO Tier 2: ${conexpoFiltered.length} companies → data/outreach-tier2-conexpo.csv`);

// ─── Vertical breakdown ───────────────────────────────────────────────────────

function countBy(arr, field) {
  return arr.reduce((acc, item) => {
    acc[item[field]] = (acc[item[field]] || 0) + 1;
    return acc;
  }, {});
}

const scraVerticals = countBy(scraFiltered, 'vertical');
const conexpoVerticals = countBy(conexpoFiltered, 'vertical');

const topScraStates = Object.entries(
  scraFiltered.reduce((acc, c) => { if (c.state) acc[c.state] = (acc[c.state] || 0) + 1; return acc; }, {})
).sort((a, b) => b[1] - a[1]).slice(0, 10);

const topConexpoStates = Object.entries(
  conexpoFiltered.reduce((acc, c) => { if (c.state) acc[c.state] = (acc[c.state] || 0) + 1; return acc; }, {})
).sort((a, b) => b[1] - a[1]).slice(0, 10);

// ─── Write summary ────────────────────────────────────────────────────────────

const summary = `
AXLON AI — OUTREACH LIST SUMMARY
Generated: ${new Date().toLocaleDateString()}
═══════════════════════════════════════════════════════════════

TIER 1 — SCRA (Specialized Carriers & Rigging Association)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total qualified prospects: ${scraFiltered.length}
Direct company emails available: ${scraFiltered.filter(c => c.email).length}
Named contacts found: ${scraFiltered.filter(c => c.contact_name).length}

By vertical:
${Object.entries(scraVerticals).map(([v, n]) => `  ${v.padEnd(35)} ${n}`).join('\n')}

Top states:
${topScraStates.map(([s, n]) => `  ${s.padEnd(10)} ${n} companies`).join('\n')}

Top 10 prospects (highest score):
${scraFiltered.slice(0, 10).map((c, i) =>
  `  ${String(i+1).padStart(2)}. ${c.company.padEnd(40)} ${c.vertical.padEnd(30)} ${c.email}`
).join('\n')}

File: data/outreach-tier1-scra.csv

─────────────────────────────────────────────────────────────

TIER 2 — CONEXPO-CON/AGG 2026 Exhibitors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total qualified prospects: ${conexpoFiltered.length}
With direct contact email: ${conexpoFiltered.filter(c => c.contact_email).length}
With named contact: ${conexpoFiltered.filter(c => c.contact_name).length}

By vertical:
${Object.entries(conexpoVerticals).map(([v, n]) => `  ${v.padEnd(35)} ${n}`).join('\n')}

Top states:
${topConexpoStates.map(([s, n]) => `  ${s.padEnd(10)} ${n} companies`).join('\n')}

Top 10 prospects (highest score):
${conexpoFiltered.slice(0, 10).map((c, i) =>
  `  ${String(i+1).padStart(2)}. ${c.company.padEnd(40)} ${c.vertical.padEnd(25)} ${c.contact_email || c.phone}`
).join('\n')}

File: data/outreach-tier2-conexpo.csv

═══════════════════════════════════════════════════════════════

OUTREACH TEMPLATES (use the "outreach_template" column)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[crane-rigging]
Subject: AI for crane & rigging operations — quick question
Hi {{contact_name || "there"}},
Noticed {{company}} is in the crane and rigging space.
We help rigging companies automate quoting, document processing, and lead follow-up using AI — typically saving 15-20 hours/week in admin work.
Would you be open to a 15-min call to see if this is relevant for your operation?

[heavy-haul]
Subject: Cutting dispatcher workload with AI — {{company}}
Hi {{contact_name || "there"}},
We've been working with lowboy and heavy haul operators to automate dispatch coordination and capture more inbound loads using AI.
Would you be against a quick 15-minute call to see what's possible?

[equipment-dealer]
Subject: AI lead follow-up for equipment dealers
Hi {{contact_name || "there"}},
We work with equipment dealers to build AI systems that reply to every inbound inquiry instantly and keep leads warm automatically.
Most dealers we work with see a 25-30% improvement in lead conversion within 90 days.
Worth a 15-minute call?

─────────────────────────────────────────────────────────────

RECOMMENDED SEQUENCE
1. Week 1: Send LinkedIn connection requests to all Tier 1 SCRA crane/rigging contacts
2. Week 1: Email top 25 SCRA prospects (sort by score desc, crane/rigging first)
3. Week 2: Email top 25 CONEXPO prospects with direct contact emails
4. Week 2-3: Follow up with everyone who opened but didn't reply (3-day cadence)
5. Month 2: Work down the rest of the list in batches of 20/week

GOAL: 12-15 free assessments booked → 2 founding partners signed
`;

writeFileSync(join(dataDir, 'outreach-summary.txt'), summary.trim());
console.log(`✓ Summary → data/outreach-summary.txt`);
console.log('');
console.log(summary);
