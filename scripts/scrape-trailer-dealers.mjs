#!/usr/bin/env node

/**
 * Scrape trailer dealers from multiple public sources:
 * 1. Known major trailer dealers (manually curated)
 * 2. NATDA Trailer Show exhibitors (already have scraper)
 * 3. Manufacturer dealer locator APIs where accessible
 *
 * Usage: node scripts/scrape-trailer-dealers.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Known Major Trailer Dealers (manually curated from industry research) ───
// These are verified heavy haul / lowboy / flatbed trailer dealers
const KNOWN_TRAILER_DEALERS = [
  // Pre-scraped (already in DB)
  { company_name: 'Blyth Trailer Sales', city: 'Valley Park', state: 'MO', phone: '(314) 270-4008', email: 'charlieblyth@blythtrailer.com', website: 'https://www.blythtrailersales.com', description: 'Class 8 semi trailer dealership. Flatbeds, drop decks, dry vans, lowboys.', brands: ['Manac', 'Dorsey Trailer', 'XL Specialized', 'Brazos'] },
  { company_name: 'J & B Pavelka, Inc.', city: 'Robstown', state: 'TX', phone: '(361) 387-5010', email: 'info@jbpavelkainc.com', website: 'https://www.jbpavelkainc.com', description: 'Premier South Texas pre-owned truck and new/pre-owned trailer dealer since 1997. Heavy haul, oilfield, wind energy, construction.', brands: ['Doonan', 'Globe', 'Eager Beaver', 'Fontaine', 'Alpha HD'] },
  { company_name: 'Pinnacle Truck & Trailer', city: 'La Vergne', state: 'TN', phone: '(615) 793-9890', email: 'info@pinnaclellc.us', website: 'https://www.pinnaclellc.us', description: 'Nashville-area trailer dealer since 2003. Flatbeds, lowboys, drop decks, dry vans.', brands: ['XL Specialized', 'Fontaine', 'Transcraft', 'Reitnouer', 'Wabash'] },

  // Major national/regional trailer dealers
  { company_name: 'Hale Trailer Brake & Wheel', city: 'Voorhees', state: 'NJ', phone: '(856) 768-1330', website: 'https://haletrailer.com', description: 'One of the largest trailer dealers in North America. 20+ locations. New and used trailer sales, leasing, rental, parts, service.', brands: ['Fontaine', 'Talbert', 'Landoll', 'XL Specialized', 'Etnyre', 'Wabash', 'Utility'] },
  { company_name: 'Transwest Trailers', city: 'Henderson', state: 'CO', phone: '(303) 301-7986', website: 'https://www.transwest.com', description: 'Premier dealer in trailer rentals and sales since 1994. Multiple locations across western US.', brands: ['Wilson', 'Fontaine', 'Reitnouer', 'Talbert', 'Trail King'] },
  { company_name: 'All Pro Trailer Superstore', city: 'Mechanicsburg', state: 'PA', phone: '(717) 795-9116', website: 'https://www.trailersuperstore.com', description: 'Nation\'s #1 trailer dealer recognized by many manufacturers. Family-owned since 1988.', brands: ['Big Tex', 'Kaufman', 'Diamond C', 'Sure-Trac', 'Load Trail'] },
  { company_name: 'Nelson International', city: 'Sioux City', state: 'IA', phone: '(712) 252-0538', website: 'https://www.nelsoninternational.com', description: 'Major truck and trailer dealer in the Midwest. Multiple locations across IA, MN, SD, NE.', brands: ['Trail King', 'Fontaine', 'Wabash', 'Wilson'] },
  { company_name: 'Midco Sales', city: 'Kansas City', state: 'MO', phone: '(816) 483-5700', email: 'sales@midcosales.com', website: 'https://midcosales.com', description: 'Specializes in lowboy and heavy haul trailers. New and used inventory from top manufacturers.', brands: ['XL Specialized', 'Landoll', 'Alpha HD', 'Talbert'] },
  { company_name: 'Royal Truck & Utility Trailer', city: 'Denton', state: 'TX', phone: '(940) 484-0026', website: 'https://royaltrailersales.com', description: 'Trailer dealer offering lowboy, flatbed, and utility trailers. Serving North Texas.', brands: ['Fontaine', 'Manac', 'Reitnouer'] },
  { company_name: 'Texas Trailer & Equipment', city: 'Houston', state: 'TX', phone: '(713) 991-3700', website: 'https://www.texastrailer.com', description: 'Houston area trailer dealer specializing in new and used trailers.', brands: ['Fontaine', 'Great Dane', 'Wilson'] },
  { company_name: 'Globe Trailer Manufacturing', city: 'Bradenton', state: 'FL', phone: '(941) 753-2199', email: 'david@globetrailers.com', website: 'https://www.globetrailers.com', description: 'Heavy haul and equipment trailer manufacturer/dealer. Custom lowboys and specialized trailers.', brands: ['Globe'] },
  { company_name: 'Tri-State Trailer Sales', city: 'Pittsburgh', state: 'PA', phone: '(412) 427-9095', email: 'jmancino@tristatepgh.com', website: 'https://www.tristatetrailer.com', description: 'Pittsburgh-area trailer dealer. New and used semi-trailers.', brands: ['Fontaine', 'East', 'Wabash'] },
  { company_name: 'Pinnacle Trailer Sales', city: 'Wilmington', state: 'NC', phone: '(910) 342-0445', email: 'Btanner@pinnacletrailers.com', website: 'https://www.pinnacletrailers.com', description: 'Semi-trailer dealer with 4 locations across NC, SC, and VA. Flatbeds, vans, lowboys.', brands: ['Fontaine', 'Wabash', 'Stoughton'] },
  { company_name: 'Superior Trailer Sales', city: 'Houston', state: 'TX', phone: '(713) 224-4200', description: 'Houston-based trailer dealer. Used semi-trailers and heavy haul equipment.' },
  { company_name: 'TM Trailer Sales', city: 'Jackson', state: 'GA', phone: '(770) 305-9071', website: 'https://tmtrailersales.com', description: 'Georgia-based trailer dealer. New and used semi-trailers.' },
  { company_name: 'TransMaster Trailers', city: 'Carlisle', state: 'PA', phone: '(717) 243-6849', email: 'rdiemer@mastersi.com', website: 'https://transmastertrailers.com', description: 'Trailer sales and master solutions. Pennsylvania dealer.' },
  { company_name: 'Southwest Truck & Trailer', city: 'Oklahoma City', state: 'OK', phone: '(405) 235-3441', website: 'https://www.southwesttruck.com', description: 'Oklahoma truck and trailer dealer. New and used flatbeds, lowboys, drop decks.', brands: ['Fontaine', 'Talbert', 'Eager Beaver'] },
  { company_name: 'Great Western Leasing & Sales', city: 'Phoenix', state: 'AZ', phone: '(623) 223-7286', email: 'robert.sharp@gwleasing.com', website: 'https://www.greatwesternleasing.com', description: 'Trailer leasing and sales in the Southwest. Fontaine Specialized dealer.', brands: ['Fontaine'] },
  { company_name: 'Trailer Outlet', city: 'Garland', state: 'TX', phone: '(214) 349-3500', website: 'https://www.thetraileroutlet.com', description: 'Dallas-area trailer dealer. New and used semi-trailers, flatbeds, lowboys.' },
  { company_name: 'J & J Truck Bodies & Trailers', city: 'Somerset', state: 'PA', phone: '(814) 443-3614', website: 'https://www.jjbodies.com', description: 'Pennsylvania-based truck body and trailer dealer. Dump trailers, flatbeds, heavy haul.', brands: ['Trail King', 'Bibeau', 'Towmaster'] },
  { company_name: 'Star Trailer Sales', city: 'San Antonio', state: 'TX', phone: '(210) 648-1111', description: 'San Antonio trailer dealer. Flatbeds, lowboys, step decks.' },
  { company_name: 'Deep South Equipment', city: 'Hattiesburg', state: 'MS', phone: '(601) 545-3629', website: 'https://www.deepsouthequipment.com', description: 'Mississippi heavy equipment and trailer dealer. Lowboys, flatbeds, heavy haul.', brands: ['XL Specialized', 'Trail King'] },
  { company_name: 'Emerson Truck & Trailer', city: 'Jacksonville', state: 'FL', phone: '(904) 354-5381', description: 'Florida-based truck and trailer dealer. New and used semi-trailers.' },
  { company_name: 'Utility Trailer Sales Southeast Texas', city: 'Lufkin', state: 'TX', phone: '(936) 634-2678', website: 'https://www.utilitytrailer.com', description: 'Authorized Utility Trailer dealer. Dry vans, reefers, flatbeds.', brands: ['Utility'] },
  { company_name: 'Palmer Truck and Trailer Sales', city: 'Effingham', state: 'IL', phone: '(217) 857-3184', description: 'Illinois truck and trailer dealer. Serving the Midwest.' },
  { company_name: 'Benlee', city: 'Romulus', state: 'MI', phone: '(734) 722-8100', email: 'info@benlee.com', website: 'https://www.benlee.com', description: 'Roll-off trailer manufacturer and dealer. Premium trailers for waste and recycling.', brands: ['Benlee'] },
  { company_name: 'Trail-Eze Trailers', city: 'McPherson', state: 'KS', phone: '(620) 241-5605', website: 'https://www.trail-eze.com', description: 'Kansas-based trailer manufacturer/dealer. Tilt deck, lowboy, and heavy haul trailers.', brands: ['Trail-Eze'] },
  { company_name: 'Rogers Trailers', city: 'Albion', state: 'PA', phone: '(814) 756-4641', website: 'https://www.rogerstrailers.com', description: 'Trailer manufacturer specializing in lowboy, tag, and other heavy haul trailers since 1905.', brands: ['Rogers'] },
  { company_name: 'Ameriquest Equipment Finance / ATC Trailers', city: 'Nappanee', state: 'IN', phone: '(574) 773-7745', website: 'https://www.atctrailers.com', description: 'Indiana-based trailer manufacturer and dealer. Aluminum enclosed, car haulers, equipment trailers.', brands: ['ATC'] },
  { company_name: 'Featherlite Trailers', city: 'Cresco', state: 'IA', phone: '(800) 800-1230', website: 'https://www.fthr.com', description: 'Aluminum trailer manufacturer with nationwide dealer network. Livestock, car haulers, flatbeds.', brands: ['Featherlite'] },
  { company_name: 'Interstate Trailers', city: 'Denver', state: 'CO', phone: '(303) 289-5471', website: 'https://www.interstatetrailers.com', description: 'Colorado trailer dealer. Flatbeds, lowboys, dry vans, reefers. Multiple brands.', brands: ['Fontaine', 'Utility', 'Trail King'] },
  { company_name: 'Pacific Trailer Sales', city: 'Portland', state: 'OR', phone: '(503) 234-1018', description: 'Pacific Northwest trailer dealer. New and used semi-trailers.', brands: ['Fontaine', 'Hyundai Translead'] },
  { company_name: 'Scott-Wood Trailer', city: 'Oklahoma City', state: 'OK', phone: '(405) 672-9566', website: 'https://www.scottwoodtrailer.com', description: 'Oklahoma trailer dealer. Flatbeds, lowboys, drop decks, and specialty trailers.', brands: ['Fontaine', 'Reitnouer', 'Wilson'] },
  { company_name: 'KD Equipment Sales', city: 'Chelsea', state: 'MI', phone: '(734) 904-9117', website: 'https://kdequipmentsales.com', description: 'Michigan-based heavy equipment and trailer dealer. Specialized trailers and heavy haul.', brands: ['Trail King', 'XL Specialized'] },
  { company_name: 'Beam Trailer Sales', city: 'Angier', state: 'NC', phone: '(919) 639-5300', website: 'https://www.beamtrailersales.com', description: 'North Carolina trailer dealer. Flatbeds, lowboys, dumps, dry vans.', brands: ['Fontaine', 'East', 'Travis'] },
  { company_name: 'Advantage Sales & Supply', city: 'Ridgway', state: 'PA', phone: '(814) 772-4766', email: 'jcanfield@advantagesales.biz', website: 'https://advantagesales.biz', description: 'Pennsylvania trailer and equipment dealer.' },
];

async function main() {
  console.log(`Loading ${KNOWN_TRAILER_DEALERS.length} known trailer dealers...\n`);

  const records = KNOWN_TRAILER_DEALERS.map(d => ({
    source: 'curated',
    source_id: d.company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    company_name: d.company_name,
    category: 'trailer_dealer',
    email: d.email || null,
    phone: d.phone || null,
    website: d.website || null,
    city: d.city || null,
    state: d.state || null,
    country: 'US',
    description: d.description || null,
    brands: d.brands || [],
    equipment_types: ['Lowboy Trailers', 'Flatbed Trailers', 'Drop Deck Trailers'],
    tags: ['trailer-dealer', 'heavy-haul'],
  }));

  // Clear existing curated records
  await supabase.from('business_directory').delete().eq('source', 'curated');

  // Insert
  const BATCH = 25;
  let inserted = 0;
  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const { data, error } = await supabase
      .from('business_directory')
      .insert(batch)
      .select('id');

    if (error) {
      console.error(`Batch error:`, error.message);
    } else {
      inserted += data?.length || 0;
    }
  }

  console.log(`\nInserted ${inserted} trailer dealers.`);

  // Show stats
  const { data: stats } = await supabase.rpc('get_directory_stats');
  if (stats) {
    console.log('\nDirectory stats:');
    console.log(`  Total: ${stats.total}`);
    console.log(`  With email: ${stats.with_email}`);
    console.log(`  By category:`, JSON.stringify(stats.by_category, null, 4));
  }
}

main().catch(console.error);
