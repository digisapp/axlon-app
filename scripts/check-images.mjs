import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // Get image URLs
  const { data, error } = await supabase
    .from('listing_images')
    .select('url, thumbnail_url')
    .limit(1000);

  if (error) { console.log('Error:', error.message); return; }

  const domains = {};
  const httpUrls = [];
  let emptyCount = 0;
  const invalidUrls = [];

  for (const img of data) {
    if (img.url === null || img.url === undefined || img.url.trim() === '') {
      emptyCount++;
      continue;
    }
    try {
      const u = new URL(img.url);
      domains[u.hostname] = (domains[u.hostname] || 0) + 1;
      if (u.protocol === 'http:') httpUrls.push(img.url);
    } catch(e) {
      invalidUrls.push(img.url);
    }
  }

  console.log('=== IMAGE DOMAINS (count) ===');
  Object.entries(domains).sort((a, b) => b[1] - a[1]).forEach(([d, c]) => console.log(`  ${d}: ${c}`));

  console.log('\n=== HTTP (not HTTPS) URLs ===', httpUrls.length);
  httpUrls.slice(0, 5).forEach(u => console.log('  ', u));

  console.log('\n=== Invalid URLs ===', invalidUrls.length);
  invalidUrls.slice(0, 5).forEach(u => console.log('  ', u));

  console.log('\n=== Empty/null URLs ===', emptyCount);

  // Total count
  const { count } = await supabase.from('listing_images').select('*', { count: 'exact', head: true });
  console.log('\nTotal images in DB:', count);

  // Test a sample of URLs to see which are actually accessible
  console.log('\n=== TESTING SAMPLE URLs (HEAD requests) ===');
  const sampleUrls = data.map(img => img.url).filter(u => u && u.startsWith('http'));

  // Test 20 random URLs from different domains
  const testedDomains = new Set();
  const toTest = [];
  for (const u of sampleUrls) {
    try {
      const hostname = new URL(u).hostname;
      if (!testedDomains.has(hostname) || toTest.length < 20) {
        testedDomains.add(hostname);
        toTest.push(u);
      }
    } catch(e) {}
    if (toTest.length >= 30) break;
  }

  let broken = 0;
  let working = 0;
  for (const testUrl of toTest) {
    try {
      const resp = await fetch(testUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const status = resp.status;
      const ct = resp.headers.get('content-type') || 'unknown';
      const isImage = ct.includes('image');
      const icon = (status >= 200 && status < 400 && isImage) ? 'OK' : 'BROKEN';
      if (icon === 'BROKEN') broken++;
      else working++;
      console.log(`  [${icon}] ${status} ${ct.split(';')[0]} - ${testUrl.substring(0, 100)}`);
    } catch (e) {
      broken++;
      console.log(`  [FAIL] ${e.message.substring(0, 30)} - ${testUrl.substring(0, 100)}`);
    }
  }
  console.log(`\nSample results: ${working} working, ${broken} broken out of ${toTest.length} tested`);
}

main();
