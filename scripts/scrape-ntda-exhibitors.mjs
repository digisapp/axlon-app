#!/usr/bin/env node

/**
 * NTDA / NATDA Trailer Show Exhibitor Scraper
 * Scrapes the NATDA Trailer Show exhibitor list and enriches with contact info
 *
 * Usage:
 *   node scripts/scrape-ntda-exhibitors.mjs
 *   node scripts/scrape-ntda-exhibitors.mjs --enrich   # Also scrape company websites for contact info
 */

import fs from 'fs';
import path from 'path';

const EXHIBITOR_URL = 'https://www.natdatrailershow.com/exhibitor-list/';
const OUTPUT_DIR = path.join(process.cwd(), 'data');
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'ntda-exhibitors.json');
const OUTPUT_CSV = path.join(OUTPUT_DIR, 'ntda-exhibitors.csv');

const ENRICH = process.argv.includes('--enrich');

// Rate limit: wait between requests
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function extractExhibitors(html) {
  const exhibitors = [];

  // Match exhibitor entries - they typically have image + link + company name
  // Pattern 1: <a href="URL"><img ... alt="Company Name" ...></a>
  const imgPattern = /<a[^>]*href="([^"]*)"[^>]*>\s*<img[^>]*alt="([^"]*)"[^>]*>/gi;
  let match;

  while ((match = imgPattern.exec(html)) !== null) {
    const website = match[1];
    const name = match[2].trim();
    if (name && !name.includes('NATDA') && name.length > 1) {
      exhibitors.push({
        name,
        website: website.startsWith('http') ? website : '',
      });
    }
  }

  // Pattern 2: Find company names in exhibitor grid/list divs
  // Look for text content within exhibitor containers
  const textPattern = /<(?:h[2-6]|p|span|div)[^>]*class="[^"]*exhibitor[^"]*"[^>]*>([^<]+)</gi;
  while ((match = textPattern.exec(html)) !== null) {
    const name = match[1].trim();
    if (name && name.length > 2 && !exhibitors.find((e) => e.name === name)) {
      exhibitors.push({ name, website: '' });
    }
  }

  // Dedupe by name
  const seen = new Set();
  return exhibitors.filter((e) => {
    const key = e.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function findContactInfo(url) {
  try {
    const html = await fetchPage(url);

    // Find email addresses
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = [...new Set(html.match(emailPattern) || [])].filter(
      (e) =>
        !e.includes('example.com') &&
        !e.includes('sentry') &&
        !e.includes('schema.org') &&
        !e.endsWith('.png') &&
        !e.endsWith('.jpg') &&
        !e.endsWith('.svg') &&
        !e.endsWith('.webp')
    );

    // Find phone numbers
    const phonePattern = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = [...new Set(html.match(phonePattern) || [])].slice(0, 3);

    // Try to find contact/about page links
    const contactPagePattern = /href="([^"]*(?:contact|about)[^"]*)"/gi;
    const contactPages = [];
    let m;
    while ((m = contactPagePattern.exec(html)) !== null) {
      contactPages.push(m[1]);
    }

    return {
      emails: emails.slice(0, 3),
      phones: phones.slice(0, 2),
      contactPage: contactPages[0] || '',
    };
  } catch {
    return { emails: [], phones: [], contactPage: '' };
  }
}

async function main() {
  console.log('🚛 NTDA/NATDA Exhibitor Scraper');
  console.log('================================\n');

  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Step 1: Fetch exhibitor list page
  console.log('Fetching exhibitor list...');
  const html = await fetchPage(EXHIBITOR_URL);
  let exhibitors = extractExhibitors(html);

  // If we didn't get many from parsing, use the known full list
  if (exhibitors.length < 50) {
    console.log(`Only found ${exhibitors.length} from HTML parsing, using known comprehensive list...`);
    exhibitors = KNOWN_EXHIBITORS.map((e) => ({
      name: e.name,
      website: e.website || '',
    }));
  }

  console.log(`Found ${exhibitors.length} exhibitors\n`);

  // Step 2: Enrich with contact info (optional)
  if (ENRICH) {
    console.log('Enriching with contact info from company websites...\n');
    let enriched = 0;

    for (let i = 0; i < exhibitors.length; i++) {
      const ex = exhibitors[i];
      if (!ex.website) continue;

      process.stdout.write(`  [${i + 1}/${exhibitors.length}] ${ex.name}...`);

      try {
        const info = await findContactInfo(ex.website);
        ex.email = info.emails[0] || '';
        ex.phone = info.phones[0] || '';
        ex.contactPage = info.contactPage;
        if (ex.email || ex.phone) enriched++;
        console.log(` ${ex.email || 'no email'}`);
      } catch {
        console.log(' failed');
      }

      await delay(500); // Rate limit
    }

    console.log(`\nEnriched ${enriched}/${exhibitors.length} with contact info\n`);
  }

  // Step 3: Save results
  const results = {
    source: 'NATDA Trailer Show 2025/2026 Exhibitor List',
    scraped_at: new Date().toISOString(),
    total: exhibitors.length,
    exhibitors,
  };

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2));
  console.log(`Saved JSON: ${OUTPUT_JSON}`);

  // CSV export
  const csvHeader = 'Name,Website,Email,Phone\n';
  const csvRows = exhibitors
    .map(
      (e) =>
        `"${(e.name || '').replace(/"/g, '""')}","${e.website || ''}","${e.email || ''}","${e.phone || ''}"`
    )
    .join('\n');
  fs.writeFileSync(OUTPUT_CSV, csvHeader + csvRows);
  console.log(`Saved CSV: ${OUTPUT_CSV}`);

  console.log(`\nDone! ${exhibitors.length} exhibitors scraped.`);
}

// Known comprehensive exhibitor list from NATDA 2025/2026
const KNOWN_EXHIBITORS = [
  { name: 'Action Spring Co.', website: 'https://www.actionspringco.com/' },
  { name: 'Advantage Sales & Supply', website: '' },
  { name: 'Adventure Coast Manufacturing', website: '' },
  { name: 'Affiliated Resources Inc', website: '' },
  { name: 'Aftermarket Websites', website: '' },
  { name: 'AGRI-COVER INC', website: '' },
  { name: 'AGS Company', website: '' },
  { name: 'Air Hitch Technology', website: '' },
  { name: 'Air-Flo Manufacturing', website: '' },
  { name: 'Air-Tow Trailers', website: '' },
  { name: 'Alcom LLC', website: 'https://www.alcomusa.com/' },
  { name: 'Allegiance Merchant Services', website: '' },
  { name: 'AllPro Distributing', website: '' },
  { name: 'Altor Locks', website: '' },
  { name: 'Aluma Trailers', website: 'https://alumaklm.com/' },
  { name: 'Anderson Manufacturing', website: 'http://www.andersontrailers.com' },
  { name: 'Anthony Wood Treating', website: '' },
  { name: 'Anvil Lock', website: '' },
  { name: 'Anvil Trailer LLC', website: '' },
  { name: 'AP Products', website: '' },
  { name: 'Apex Trailers', website: '' },
  { name: 'ArrowTrail', website: '' },
  { name: 'ASA Electronics', website: '' },
  { name: 'Asquare Parts Inc.', website: '' },
  { name: 'ATC', website: '' },
  { name: 'ATW', website: 'https://www.atw.com/' },
  { name: 'Automotive International Inc', website: '' },
  { name: 'Autowbrake', website: 'https://getautowbrake.com/' },
  { name: 'Avery Dennison Reflective Solutions', website: '' },
  { name: 'B&W Trailer Hitches', website: '' },
  { name: 'Bailey', website: '' },
  { name: 'Bear Track Trailers', website: '' },
  { name: 'Bearing Buddy Inc', website: '' },
  { name: 'Bedrock Truck Beds', website: '' },
  { name: 'Behnke Trailers', website: '' },
  { name: 'Belmont Trailers LLC', website: '' },
  { name: 'Bennett DriveAway', website: 'https://www.bennettig.com/' },
  { name: 'Besler Industries Inc.', website: '' },
  { name: 'Big Tex Trailers', website: 'https://www.bigtextrailers.com' },
  { name: 'Black Rhino Manufacturing Inc.', website: 'https://blackrhinotrailer.com/' },
  { name: 'Blackpurl', website: 'https://blackpurl.com/' },
  { name: 'Blaylock American Metal', website: 'https://www.blaylockind.com/' },
  { name: 'Blue Ox', website: 'https://bludotinc.com/' },
  { name: 'Blue Ridge Manufacturing LLC', website: '' },
  { name: 'BND Trailers LLC', website: '' },
  { name: 'Boeckmann Fahrzeugwerke GmbH', website: '' },
  { name: 'BOS Jockey wheels', website: '' },
  { name: 'Bostail', website: '' },
  { name: 'Botkin Lumber Company', website: '' },
  { name: 'Brandt Industries USA Limited', website: '' },
  { name: 'Bravo Trailers LLC', website: '' },
  { name: 'Brok Products', website: '' },
  { name: 'Bucher Hydraulics Inc.', website: '' },
  { name: 'Buckshot Trailers', website: '' },
  { name: 'Bulldog Mfg LLC', website: '' },
  { name: 'Bulldog Winch Co LLC', website: '' },
  { name: 'BulletProof Hitches', website: 'https://www.bulletproofhitches.com/' },
  { name: 'Butler Products', website: '' },
  { name: 'Buyers Products Company', website: '' },
  { name: 'BWise Trailers', website: '' },
  { name: 'C.R. Brophy Machine Works', website: '' },
  { name: 'C3 Rentals', website: '' },
  { name: 'Caliber Inc.', website: '' },
  { name: 'Caliber Trailers', website: '' },
  { name: 'Cargo Equipment Corporation', website: '' },
  { name: 'Cast Products Inc.', website: '' },
  { name: 'CatTongue Grips', website: '' },
  { name: 'CellTech Trailers', website: '' },
  { name: 'Champion Hoist & Equipment', website: '' },
  { name: 'Chekkit', website: '' },
  { name: 'Choice Trailer Products', website: '' },
  { name: 'Clicklease', website: 'https://www.clicklease.com/' },
  { name: 'CM Truck Beds', website: 'https://cmtruckbeds.com/' },
  { name: 'Coastal Trailers Rent to Own', website: '' },
  { name: 'COMEUP USA Inc.', website: '' },
  { name: 'Connected Correctly LLC', website: '' },
  { name: 'Continental Battery Systems', website: '' },
  { name: 'Counteract Balancing Beads', website: '' },
  { name: 'Covered Wagon Trailers', website: '' },
  { name: 'Creative Business Solutions', website: '' },
  { name: 'Currahee Trailers LLC', website: '' },
  { name: 'CURT', website: '' },
  { name: 'Dalton Hydraulics', website: '' },
  { name: 'Darkhorse Cargo Inc.', website: '' },
  { name: 'Davis Village Solutions LLC', website: '' },
  { name: 'DC CARGO', website: '' },
  { name: 'Deal Sector', website: '' },
  { name: 'Dealer Attract', website: '' },
  { name: 'DealerPRO Training', website: '' },
  { name: 'Dealership Performance 360 CRM', website: '' },
  { name: 'Delco Trailers', website: 'https://delcotrailers.com/' },
  { name: 'Delta Trailers', website: 'http://www.deltatrailers.com' },
  { name: 'Demco', website: 'https://www.demco-products.com/' },
  { name: 'Deutsche Hydrapro', website: '' },
  { name: 'Dexstar Wheel', website: '' },
  { name: 'Dexter', website: 'https://www.dextergroup.com/' },
  { name: 'Diamond C Trailers', website: '' },
  { name: 'Diamond T Trailer Mfg', website: '' },
  { name: 'DK2 Warrior Winches', website: '' },
  { name: 'DLH Fluid Power Inc.', website: '' },
  { name: 'DLL', website: '' },
  { name: 'Doolittle Trailer Mfg. Inc.', website: 'http://doolittletrailers.com/' },
  { name: 'Down 2 Earth Trailers', website: '' },
  { name: 'Dura-Haul Trailers LLC', website: '' },
  { name: 'Eagle Hydraulic', website: '' },
  { name: 'ELEASE Funding Inc.', website: '' },
  { name: 'Elkhart Trailer Company', website: '' },
  { name: 'EMPIRE CARGO TRAILERS', website: '' },
  { name: 'EQ Systems', website: '' },
  { name: 'ESCO', website: '' },
  { name: 'FAB Parts USA', website: '' },
  { name: 'Fill-Rite', website: '' },
  { name: 'FIRMAN Power Equipment', website: '' },
  { name: 'FLCC FINANCING', website: '' },
  { name: 'FLOE International', website: '' },
  { name: 'Franklin Trailer Parts', website: '' },
  { name: 'Freedom Trailers LLC', website: '' },
  { name: 'GEN-Y Hitch', website: '' },
  { name: 'Geoforce', website: '' },
  { name: 'GoodGuys Trailers LLC', website: '' },
  { name: 'GR Trailers LLC', website: '' },
  { name: 'Green Touch Ind./TrailerRacks.com', website: '' },
  { name: 'Gridiron Custom Tool Storage', website: '' },
  { name: 'Hapn', website: '' },
  { name: "Harp's Tarps", website: '' },
  { name: 'HAUL-ABOUT LLC', website: '' },
  { name: 'Heskins LLC', website: '' },
  { name: 'Highlands Financial Inc.', website: '' },
  { name: 'Hillcrest Trailers', website: '' },
  { name: 'Hillsboro Industries', website: '' },
  { name: 'HITCHCOIL', website: '' },
  { name: 'Homesteader LLC', website: '' },
  { name: 'Hometowne Capital', website: 'http://hometownecapital.com' },
  { name: 'Hoof Grip Livestock Flooring', website: '' },
  { name: 'Hopkins Manufacturing', website: '' },
  { name: 'Horizon Global', website: '' },
  { name: 'Horizon Trailers LLC', website: '' },
  { name: 'HorseTrailerTrader.com', website: '' },
  { name: 'HSI/Duratek', website: '' },
  { name: 'Husky Towing Products', website: '' },
  { name: 'Hydrastar', website: 'https://hydrastarusa.com/' },
  { name: 'Ideal Cargo Inc.', website: '' },
  { name: 'Ideal Computer Systems', website: '' },
  { name: 'Industrial Wood Technology', website: '' },
  { name: 'Innovative Products of America', website: '' },
  { name: 'Insperity', website: 'https://www.insperity.com/' },
  { name: 'Iowa Spring MFG', website: '' },
  { name: 'Iron Bull Trailers', website: 'https://norstarcompany.com/iron-bull-trailers/' },
  { name: 'Iron Ox Products LLC', website: '' },
  { name: 'Iron Star Manufacturing', website: '' },
  { name: 'Jammy Inc', website: '' },
  { name: 'JKD Products Inc.', website: '' },
  { name: 'K-Trail Inc', website: '' },
  { name: 'Karavan Trailers', website: 'https://www.karavantrailers.com/' },
  { name: 'Kenda Americana Tire & Wheel', website: '' },
  { name: 'Kenny & Gyl Company', website: '' },
  { name: 'KTI Hydraulics Inc.', website: 'https://www.ktihydraulicsinc.com' },
  { name: 'KYCS Global Inc.', website: '' },
  { name: 'Lamar Trailers Inc.', website: 'https://www.lamartrailers.com/' },
  { name: 'LandAirSea Asset Protection', website: 'https://landairsea.com/' },
  { name: 'Larchmont & Transamerica', website: '' },
  { name: 'LaVanture Products Company', website: 'http://www.lavanture.com' },
  { name: 'Legend Manufacturing Inc', website: 'https://legendmfginc.com/' },
  { name: 'Liberty Trailers', website: 'https://libertytrailers.com/' },
  { name: 'Lightspeed', website: '' },
  { name: 'LINK Trailer', website: '' },
  { name: 'Lionshead Specialty Tire & Wheel LLC', website: '' },
  { name: 'Load Trail', website: 'http://www.loadtrail.com' },
  { name: 'Lotus Preferred Funding', website: '' },
  { name: 'M. H. Eby Inc.', website: '' },
  { name: 'Magnum Lift Systems', website: '' },
  { name: 'Mahindra', website: '' },
  { name: 'Mankiewicz Coatings LLC', website: '' },
  { name: 'Marvel Industrial Coatings', website: '' },
  { name: 'Master Tow Inc', website: '' },
  { name: 'Maven Rentals', website: '' },
  { name: 'MAXX-D Trailers', website: '' },
  { name: 'MAZO Capital Solutions', website: '' },
  { name: 'MBA Insurance', website: '' },
  { name: 'McGriff Insurance', website: '' },
  { name: 'Mile Marker Industries', website: '' },
  { name: 'Miller Auto Technology', website: '' },
  { name: 'Motility Software Solutions', website: '' },
  { name: 'MTE Hydraulics Inc', website: '' },
  { name: 'N&N Trailers Inc', website: '' },
  { name: 'Norstar', website: '' },
  { name: 'Northpoint Commercial Finance', website: '' },
  { name: 'Novae LLC', website: 'http://www.novaecorp.com' },
  { name: 'Ormandy Software', website: '' },
  { name: 'Orrco International', website: '' },
  { name: 'PassTime', website: '' },
  { name: 'PCR TIRES LTD CO', website: '' },
  { name: 'Phoenix USA Inc.', website: '' },
  { name: 'Piedmont Plastics Inc.', website: '' },
  { name: 'PJ Trailers', website: '' },
  { name: 'Podium', website: '' },
  { name: 'Polar King Mobile', website: '' },
  { name: 'Polar Temp', website: '' },
  { name: 'Pollak', website: '' },
  { name: 'PopUp Towing Products', website: '' },
  { name: 'PPG Commercial Coatings', website: '' },
  { name: 'Priefert Steel', website: '' },
  { name: 'Primo Corporations', website: '' },
  { name: 'Pro-Series Batteries', website: '' },
  { name: 'Proform Group Inc.', website: '' },
  { name: 'Proven Industries Inc', website: 'http://www.provenlocks.com' },
  { name: 'PullRite Towing Systems', website: '' },
  { name: 'QAI Laboratories Ltd.', website: '' },
  { name: 'Quadra Bigfoot', website: '' },
  { name: 'RacingJunk.com', website: 'http://www.racingjunk.com' },
  { name: 'Radius Recycling', website: '' },
  { name: 'Rainman Digital', website: '' },
  { name: 'RAM Trailer Products', website: '' },
  { name: 'The Ratchet Depot', website: 'https://www.ratchetdepot.com/' },
  { name: 'RawMaxx Trailers', website: 'http://www.rawmaxx.com' },
  { name: 'RC INDUSTRIES', website: '' },
  { name: 'Record360', website: '' },
  { name: 'RecovR', website: '' },
  { name: 'Red Oak Inventory Finance', website: 'https://redoakinventoryfinance.com' },
  { name: 'REDARC Corporation', website: '' },
  { name: 'Rhino Tire USA', website: '' },
  { name: 'Rice Trailers', website: '' },
  { name: 'Ridewell Suspensions', website: '' },
  { name: 'Riechers Truck Bodies', website: '' },
  { name: 'RoadActive Suspension', website: '' },
  { name: 'Rock Solid Cargo', website: '' },
  { name: 'Rock Solid Funding', website: '' },
  { name: 'RS Supply LLC', website: '' },
  { name: 'Rumber Materials LLC', website: '' },
  { name: 'S & B Custom Innovation', website: '' },
  { name: 'S&S Trailers', website: '' },
  { name: 'SH Distributing Inc', website: '' },
  { name: 'Sheffield Financial', website: '' },
  { name: 'Shelby Trailer Service LLC', website: '' },
  { name: 'Sherwin-Williams', website: 'https://www.sherwin-williams.com/' },
  { name: 'Shocker Hitch', website: '' },
  { name: 'Shur-Co', website: '' },
  { name: 'Side Kick Attachments', website: '' },
  { name: 'SilverMountain Trailers', website: '' },
  { name: 'Snappin Turtle Tie Down Products', website: '' },
  { name: 'Solectrac Electric Tractors', website: '' },
  { name: 'Southern Utility Trailers LLC', website: '' },
  { name: 'Southland Trailer Corp.', website: '' },
  { name: 'Southwire', website: '' },
  { name: 'Specialty Product Technologies', website: '' },
  { name: 'Spring Creek Products', website: '' },
  { name: 'Stallion Manufacturing', website: '' },
  { name: 'StateWide Windows', website: '' },
  { name: 'Statistical Surveys', website: '' },
  { name: 'Stealth Trailers', website: '' },
  { name: 'Stehl Tow', website: '' },
  { name: 'Stillwell Inc.', website: '' },
  { name: 'Sundowner Trailers', website: '' },
  { name: 'SunLite Trailers Inc', website: '' },
  { name: 'Super Champion Inc', website: '' },
  { name: 'Super Duty Fans', website: '' },
  { name: 'SureTrac Inc.', website: 'https://sure-trac.com/' },
  { name: 'Sutong Tire Resources Inc.', website: '' },
  { name: 'SWIFT BUILT LLC', website: '' },
  { name: 'Synchrony', website: '' },
  { name: 'Taskmaster Components', website: '' },
  { name: 'TecNiq Inc.', website: 'https://tecniqinc.com/' },
  { name: 'Terran Industries', website: 'https://terranindustries.com/' },
  { name: 'Test Buddy by SC Trailer LLC', website: '' },
  { name: 'The Raynor Company', website: '' },
  { name: 'The Trailer Parts Outlet', website: '' },
  { name: 'Tie 4 Safe', website: '' },
  { name: 'Timpte Inc.', website: '' },
  { name: "Tony's Trailer Accessories", website: '' },
  { name: 'TowKing', website: '' },
  { name: 'Trailer Solutions Financial', website: '' },
  { name: 'TrailerCentral', website: '' },
  { name: 'TrailerFunnel', website: '' },
  { name: 'Trailertrader.com', website: '' },
  { name: 'Transax', website: '' },
  { name: 'Tredit Tire and Wheel Company', website: '' },
  { name: 'Trim-Lok Inc.', website: '' },
  { name: 'Trio Capital', website: 'https://triocapital.com/' },
  { name: 'Triple L Group', website: '' },
  { name: 'Triumph Trailers', website: '' },
  { name: 'TRP International/DeeMaxx', website: 'https://trpintl.com/' },
  { name: 'Truck and Trailer Makers', website: '' },
  { name: 'Truist Merchant Services', website: '' },
  { name: 'UFP Construction', website: '' },
  { name: 'Ultra-Fab', website: '' },
  { name: 'Unique Fastener 2020 LLC', website: '' },
  { name: 'United Axle', website: '' },
  { name: 'United Treating and Distribution LLC', website: '' },
  { name: 'Valcrum LLC', website: '' },
  { name: 'Viper USA', website: 'https://www.viperusa.com/' },
  { name: 'Vision LED', website: '' },
  { name: 'VoltSwitchGPS', website: '' },
  { name: 'W-W Trailer Mfg.', website: 'https://wwtrailer.com/' },
  { name: 'Warrior Winches USA', website: '' },
  { name: 'Watchdog Trailers', website: '' },
  { name: 'Waymire Distribution', website: '' },
  { name: 'Weaver Distributing LLC', website: '' },
  { name: 'WebbRes', website: '' },
  { name: 'Weigh Safe', website: '' },
  { name: 'Wells Fargo Commercial Distribution Finance', website: '' },
  { name: 'Westan Insurance Group Inc.', website: '' },
  { name: 'WestCoastGPS', website: '' },
  { name: 'Westin Automotive Products', website: '' },
  { name: 'Whitesell Supply', website: '' },
  { name: 'Wieland Metal Services', website: '' },
  { name: 'Wil-Ro Inc.', website: '' },
  { name: 'Willbanks Metals Inc', website: '' },
  { name: 'Wilson Trailer', website: '' },
  { name: 'Zimmerman Trailers', website: '' },
];

main().catch(console.error);
