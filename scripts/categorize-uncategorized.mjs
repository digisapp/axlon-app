#!/usr/bin/env node

/**
 * Use xAI (Grok) to auto-categorize uncategorized businesses in the directory.
 * Sends batches of companies to the AI for classification.
 *
 * Usage: node scripts/categorize-uncategorized.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const XAI_API_KEY = process.env.XAI_API_KEY;
const XAI_MODEL = 'grok-4-1-fast-non-reasoning';
const BATCH_SIZE = 40; // Companies per AI call

const VALID_CATEGORIES = [
  'trailer_dealer',
  'crane_rigging',
  'truck_manufacturer',
  'trailer_manufacturer',
  'transportation',
  'equipment_dealer',
  'parts_supplier',
  'services',
  'towing',
  'construction',
  'buyer_lead',
  'other',
];

const SYSTEM_PROMPT = `You are a business classification expert for the heavy haul trailer and construction equipment industry.

Given a list of businesses with their name, description, tags, and other info, classify each into ONE of these categories:

- trailer_dealer: Sells or rents trailers (lowboy, flatbed, drop deck, etc.)
- crane_rigging: Crane rental, rigging, heavy lifting companies
- truck_manufacturer: Makes trucks or truck chassis
- trailer_manufacturer: Makes trailers
- transportation: Trucking, hauling, freight, logistics companies
- equipment_dealer: Sells/rents heavy equipment (excavators, loaders, etc.) but NOT trailers
- parts_supplier: Sells parts, tires, accessories, or supplies
- services: Repair, maintenance, welding, inspection, consulting, insurance, finance
- towing: Tow truck companies, roadside assistance, vehicle recovery
- construction: General contractors, paving, excavating, concrete, building, civil engineering
- buyer_lead: Companies that would BUY trailers/equipment (energy, mining, oil & gas, utilities, farms)
- other: Does not fit any category above

Return ONLY a JSON array of objects with "id" and "category" fields. No explanation needed.`;

async function classifyBatch(businesses) {
  const prompt = businesses.map(b => {
    const parts = [`ID: ${b.id}`, `Company: ${b.company_name}`];
    if (b.description) parts.push(`Desc: ${b.description}`);
    if (b.tags?.length) parts.push(`Tags: ${b.tags.join(', ')}`);
    if (b.source) parts.push(`Source: ${b.source}`);
    if (b.brands?.length) parts.push(`Brands: ${b.brands.join(', ')}`);
    if (b.equipment_types?.length) parts.push(`Equipment: ${b.equipment_types.join(', ')}`);
    return parts.join(' | ');
  }).join('\n');

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: XAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Classify these ${businesses.length} businesses:\n\n${prompt}` },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`xAI API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  // Extract JSON from response (may be wrapped in markdown code block)
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('  Failed to parse AI response:', content.slice(0, 200));
    return [];
  }

  try {
    const results = JSON.parse(jsonMatch[0]);
    // Validate categories
    return results.filter(r =>
      r.id && r.category && VALID_CATEGORIES.includes(r.category)
    );
  } catch (e) {
    console.error('  JSON parse error:', e.message);
    return [];
  }
}

async function main() {
  if (!XAI_API_KEY) {
    console.error('XAI_API_KEY not set');
    process.exit(1);
  }

  console.log('=== Auto-Categorize Uncategorized Businesses ===\n');

  // Fetch all uncategorized businesses
  let allUncategorized = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('business_directory')
      .select('id, company_name, description, tags, source, brands, equipment_types')
      .eq('category', 'uncategorized')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error('Fetch error:', error.message);
      break;
    }
    if (!data || data.length === 0) break;
    allUncategorized.push(...data);
    page++;
  }

  console.log(`Found ${allUncategorized.length} uncategorized businesses\n`);
  if (allUncategorized.length === 0) return;

  let totalCategorized = 0;
  let totalErrors = 0;
  const categoryCounts = {};

  // Process in batches
  for (let i = 0; i < allUncategorized.length; i += BATCH_SIZE) {
    const batch = allUncategorized.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allUncategorized.length / BATCH_SIZE);

    process.stdout.write(`Batch ${batchNum}/${totalBatches} (${batch.length} companies)...`);

    try {
      const results = await classifyBatch(batch);

      if (results.length === 0) {
        console.log(' no results');
        totalErrors += batch.length;
        continue;
      }

      // Update each classified business
      for (const { id, category } of results) {
        const { error } = await supabase
          .from('business_directory')
          .update({ category, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          totalErrors++;
        } else {
          totalCategorized++;
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      }

      const missed = batch.length - results.length;
      if (missed > 0) totalErrors += missed;

      console.log(` ${results.length} classified`);
    } catch (err) {
      console.log(` ERROR: ${err.message}`);
      totalErrors += batch.length;

      // Rate limit — wait and retry
      if (err.message.includes('429') || err.message.includes('rate')) {
        console.log('  Rate limited, waiting 30s...');
        await new Promise(r => setTimeout(r, 30000));
        i -= BATCH_SIZE; // Retry this batch
      }
    }

    // Small delay between batches to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n========================================');
  console.log('CATEGORIZATION COMPLETE');
  console.log('========================================');
  console.log(`Categorized: ${totalCategorized}`);
  console.log(`Errors/Missed: ${totalErrors}`);
  console.log('\nCategory breakdown:');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

  // Check remaining uncategorized
  const { count } = await supabase
    .from('business_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'uncategorized');
  console.log(`\nRemaining uncategorized: ${count}`);
}

main().catch(console.error);
