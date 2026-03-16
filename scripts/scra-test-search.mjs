#!/usr/bin/env node
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const URL = 'https://www.scranet.org/SCRA/SCRA/Content/membership/Search/Search_by_name.aspx?hkey=ba7c5a62-391a-48eb-8eb6-9399b0499674';

async function test() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

  console.log('Loading page...');
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

  console.log('Clicking Search...');
  await page.click('#pseudoSearchbtn');

  console.log('Waiting for results...');
  await page.waitForSelector('.radiusresult', { timeout: 15000 }).catch(() => {
    console.log('No .radiusresult found in 15s');
  });

  await new Promise(r => setTimeout(r, 5000));

  const resultInfo = await page.evaluate(() => {
    const results = document.querySelectorAll('.radiusresult');

    return {
      resultCount: results.length,
      firstResults: Array.from(results).slice(0, 5).map(r => {
        // Get all the structured data from each result
        const name = r.querySelector('.name')?.textContent?.trim() || '';
        const address = r.querySelector('.address')?.textContent?.trim() || '';
        const contact = r.querySelector('.contact')?.textContent?.trim() || '';
        const links = Array.from(r.querySelectorAll('a')).map(a => ({
          href: a.href,
          text: a.textContent?.trim(),
        }));
        const allText = r.textContent?.trim();

        return { name, address, contact, links, allText: allText?.substring(0, 800), html: r.innerHTML?.substring(0, 2000) };
      }),
      // Check for pagination or "show more"
      pagInfo: document.querySelector('.mat-paginator')?.textContent?.trim()?.substring(0, 200) || 'no mat-paginator',
      // Look for any scroll/infinite load indicators
      showMore: document.querySelector('[class*="more"]')?.textContent?.trim() || 'no show more',
    };
  });

  console.log('\n=== RESULTS ===');
  console.log('Count:', resultInfo.resultCount);
  console.log('Pagination:', resultInfo.pagInfo);
  console.log('Show More:', resultInfo.showMore);

  resultInfo.firstResults.forEach((r, i) => {
    console.log(`\n--- Result ${i + 1} ---`);
    console.log('Name:', r.name);
    console.log('Address:', r.address);
    console.log('Contact:', r.contact);
    console.log('Links:', JSON.stringify(r.links));
    console.log('HTML:', r.html);
  });

  await browser.close();
}

test().catch(console.error);
