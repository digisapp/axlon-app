// @ts-nocheck
/**
 * Pure helpers that turn the raw text scraped from a dealer's inventory card
 * into clean listing fields. No puppeteer / Supabase imports so they can be
 * exercised in isolation.
 */

const MIN_PRICE = 100;
const MAX_PRICE = 10_000_000;

/**
 * Parse a price out of card text. Returns a number, or null when the dealer
 * shows "Call for price" / nothing / something that isn't a plausible price.
 *
 * The old parser grabbed the FIRST number in the text, so a title glued to a
 * price ("2024 Peterbilt 579$83,999") priced the truck at $2,024 and
 * "Contact for price (800) 777-3383" became $800. Only a currency-marked
 * amount, or text that is nothing but an amount, counts now.
 */
export function parsePrice(text) {
  if (text == null) return null;
  const t = String(text).replace(/ /g, ' ').trim();
  if (!t) return null;

  let raw = null;
  const currency = t.match(/(?:US\s*\$|USD\s*\$?|\$)\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (currency) {
    raw = currency[1];
  } else if (/^\s*(?:USD\s*)?[\d,]+(?:\.\d{1,2})?\s*(?:USD)?\s*$/i.test(t)) {
    raw = t.replace(/[^\d.,]/g, '');
  }
  if (!raw) return null;

  // "28,999.00" → 28999 ; reject grouping that isn't thousands ("1,2,3").
  if (raw.includes(',') && !/^\d{1,3}(,\d{3})+(\.\d{1,2})?$/.test(raw)) return null;
  const value = Number(raw.replace(/,/g, ''));
  if (!Number.isFinite(value) || value < MIN_PRICE || value > MAX_PRICE) return null;
  return Math.round(value * 100) / 100;
}

const US_STATES = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA', colorado: 'CO',
  connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA', hawaii: 'HI', idaho: 'ID',
  illinois: 'IL', indiana: 'IN', iowa: 'IA', kansas: 'KS', kentucky: 'KY', louisiana: 'LA',
  maine: 'ME', maryland: 'MD', massachusetts: 'MA', michigan: 'MI', minnesota: 'MN',
  mississippi: 'MS', missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK', oregon: 'OR',
  pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC', 'south dakota': 'SD',
  tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT', virginia: 'VA', washington: 'WA',
  'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY', 'district of columbia': 'DC',
};
const STATE_CODES = new Set(Object.values(US_STATES));
const CA_PROVINCES = new Set(['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT']);

function toStateCode(s) {
  if (!s) return null;
  const t = s.trim().replace(/\.$/, '');
  if (/^[A-Za-z]{2}$/.test(t) && STATE_CODES.has(t.toUpperCase())) return t.toUpperCase();
  return US_STATES[t.toLowerCase()] || null;
}

/**
 * "Venus, Texas, US" → { city: 'Venus', state: 'TX' }
 * "French Camp, CA"  → { city: 'French Camp', state: 'CA' }
 * "Salt Lake City"   → { city: 'Salt Lake City', state: cityStates[...] ?? null }
 * "N/A" / ""         → { city: null, state: null }
 * Non-US locations (e.g. "Delhi, ON, CA") keep the city and leave state null.
 */
export function parseLocation(text, cityStates = {}) {
  const empty = { city: null, state: null };
  if (!text) return empty;
  // "Manchester, IA | XL Specialized" — drop the trailing annotation;
  // "Salt Lake City +1" (unit listed at several branches) — keep the first.
  const t = String(text).replace(/\s+/g, ' ').split('|')[0].replace(/\s*\+\s*\d+\s*$/, '').trim();
  if (!t || /^(n\/?a|none|tbd|-|call)$/i.test(t)) return empty;

  const parts = t.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1 && /^(us|usa|united states)$/i.test(parts[parts.length - 1])) parts.pop();
  // Canada ("Delhi, ON, CA" / "St-Evariste, QC, Canada"): listings are US-only
  // fields, so keep the city and don't mistake "CA" for California.
  const last = parts[parts.length - 1] || '';
  const prev = parts[parts.length - 2] || '';
  if (/^canada$/i.test(last) || (/^ca$/i.test(last) && CA_PROVINCES.has(prev.toUpperCase())) || (parts.length === 2 && CA_PROVINCES.has(last.toUpperCase()))) {
    return { city: parts[0], state: null };
  }

  if (parts.length >= 2) {
    const state = toStateCode(parts[parts.length - 1]);
    const city = parts.slice(0, parts.length - 1).join(', ');
    if (state) return { city, state };
    return { city: parts[0], state: null };
  }
  const city = parts[0];
  const mapped = cityStates[city];
  // Map values are a state code ('UT') or "City, ST" to also rename a branch
  // label ("Dallas I-20" → Dallas, TX).
  if (mapped && mapped.includes(',')) {
    const [c, st] = mapped.split(',').map((x) => x.trim());
    return { city: c, state: toStateCode(st) };
  }
  // A bare state ("Montana", "TX") is a state, not a city.
  const bareState = toStateCode(city);
  if (bareState && !mapped) return { city: null, state: bareState };
  return { city, state: mapped || null };
}

/** Map a dealer's wording to the listings.condition enum ('new' | 'used'). */
export function normalizeCondition(text) {
  if (!text) return null;
  const t = String(text).toLowerCase();
  // schema.org itemCondition URLs ("https://schema.org/NewCondition")
  if (/(used|refurbished|damaged)condition\b/.test(t)) return 'used';
  if (/newcondition\b/.test(t)) return 'new';
  if (/\b(used|pre-?owned|preowned|certified)\b/.test(t)) return 'used';
  if (/\bnew\b/.test(t)) return 'new';
  return null;
}

/** First plausible model year (1950–2049) in the text. */
export function parseYear(text) {
  if (!text) return null;
  const m = String(text).match(/\b(19[5-9]\d|20[0-4]\d)\b/);
  return m ? Number(m[1]) : null;
}

/** Strip a leading "Stock #:", "VIN:", "Location:", "MLS Number" style label. */
export function stripLabel(text) {
  if (!text) return '';
  return String(text)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(stock\s*(number|no\.?|#)?|vin|location|mls\s*number|serial(\s*number)?)\s*[:#]?\s*/i, '')
    .trim();
}

/**
 * Normalize a "Label: value" spec map scraped from a card into listing fields.
 * Keys are matched case-insensitively. Unknown labels are kept as specs.
 */
export function fieldsToListing(fields = {}) {
  const out = { specs: {} };
  for (const [rawKey, rawVal] of Object.entries(fields)) {
    const key = rawKey.toLowerCase().replace(/[:#]/g, '').trim();
    const val = String(rawVal ?? '').replace(/\s+/g, ' ').trim();
    if (!val || /^n\/?a$/i.test(val)) continue;
    if (key === 'location') out.location = val;
    else if (/^stock(\s*(number|no\.?))?$/.test(key)) out.stock_number = val;
    else if (key === 'vin' || key === 'serial number') out.vin = val;
    else if (key === 'year') out.year = parseYear(val);
    else if (key === 'manufacturer' || key === 'make') out.make = val;
    else if (key === 'model') out.model = val;
    else if (key === 'condition' || key === 'status') out.condition = normalizeCondition(val);
    else out.specs[rawKey.replace(/[:]/g, '').trim()] = val;
  }
  return out;
}
