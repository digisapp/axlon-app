#!/usr/bin/env node
/**
 * Quick test to understand SC&RA directory page structure
 */
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

  // Get all form elements
  const formInfo = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, select, button, textarea'));
    const forms = Array.from(document.querySelectorAll('form'));

    return {
      forms: forms.map(f => ({ action: f.action, method: f.method, id: f.id })),
      inputs: inputs.map(el => ({
        tag: el.tagName,
        type: el.type || '',
        id: el.id || '',
        name: el.name || '',
        placeholder: el.placeholder || '',
        value: el.value?.substring(0, 50) || '',
        className: el.className?.substring(0, 80) || '',
      })).filter(i => !i.id.includes('__') || i.id === '__VIEWSTATE'),
      // Look for search-related elements
      searchElements: Array.from(document.querySelectorAll('[id*="earch"], [class*="search"], [id*="Query"], [id*="query"]')).map(el => ({
        tag: el.tagName,
        id: el.id,
        className: el.className?.substring(0, 100),
        text: el.textContent?.substring(0, 100),
      })),
      // Look for any results containers
      resultContainers: Array.from(document.querySelectorAll('.radiusresult, .SearchResultsList, [class*="result"], [id*="result"], [id*="Result"]')).map(el => ({
        tag: el.tagName,
        id: el.id,
        className: el.className?.substring(0, 100),
        childCount: el.children.length,
        text: el.textContent?.substring(0, 200),
      })),
      // All links
      pageText: document.body?.innerText?.substring(0, 3000),
    };
  });

  console.log('\n=== FORMS ===');
  console.log(JSON.stringify(formInfo.forms, null, 2));

  console.log('\n=== SEARCH ELEMENTS ===');
  console.log(JSON.stringify(formInfo.searchElements, null, 2));

  console.log('\n=== RESULT CONTAINERS ===');
  console.log(JSON.stringify(formInfo.resultContainers, null, 2));

  console.log('\n=== RELEVANT INPUTS ===');
  const relevantInputs = formInfo.inputs.filter(i =>
    !i.id.includes('__') &&
    !i.id.includes('ClientState') &&
    !i.id.includes('StyleSheet') &&
    i.id !== ''
  );
  console.log(JSON.stringify(relevantInputs, null, 2));

  console.log('\n=== PAGE TEXT (first 3000 chars) ===');
  console.log(formInfo.pageText);

  await browser.close();
}

test().catch(console.error);
