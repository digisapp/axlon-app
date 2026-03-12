import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: products } = await s.from('manufacturer_products')
  .select('id, name, manufacturer:manufacturers!manufacturer_id(name), images:manufacturer_product_images(url, is_primary)')
  .eq('is_active', true);

const byMfr = {};
for (const p of products) {
  const mfr = p.manufacturer?.name || 'Unknown';
  if (!byMfr[mfr]) byMfr[mfr] = { total: 0, withImages: 0, noImages: 0, imgCount: 0 };
  byMfr[mfr].total++;
  const imgCount = p.images?.length || 0;
  byMfr[mfr].imgCount += imgCount;
  if (imgCount > 0) byMfr[mfr].withImages++;
  else byMfr[mfr].noImages++;
}

console.log('CURRENT IMAGE STATUS');
console.log('='.repeat(75));
console.log('Manufacturer'.padEnd(28), 'Prod'.padEnd(6), 'W/Img'.padEnd(7), 'NoImg'.padEnd(7), 'TotImg'.padEnd(8), 'Status');
console.log('-'.repeat(75));
for (const [mfr, d] of Object.entries(byMfr).sort((a, b) => a[0].localeCompare(b[0]))) {
  const status = d.noImages === 0 ? 'OK' : d.withImages > 0 ? 'PARTIAL' : 'BROKEN';
  console.log(mfr.padEnd(28), String(d.total).padEnd(6), String(d.withImages).padEnd(7), String(d.noImages).padEnd(7), String(d.imgCount).padEnd(8), status);
}
