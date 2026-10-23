// @ts-nocheck
/**
 * Shared plumbing for dealer inventory adapters (scripts/dealers/*.mjs).
 *
 * Every adapter fetches through `politeClient`, which
 *   - identifies honestly with the AxleyardBot User-Agent,
 *   - reads the site's robots.txt once and refuses any disallowed URL,
 *   - waits max(1.5s, Crawl-delay) between requests to the same host, and
 *   - stops on a bot challenge (403/429, Cloudflare "Just a moment", etc.)
 *     with a DealerBlockedError instead of retrying or evading it.
 *
 * Pure helpers (decode, textOf, robots parsing, lowboy classification) are
 * exported for unit tests.
 */

export const USER_AGENT = 'AxleyardBot/1.0 (+https://axleyard.com; inventory@axleyard.com)';
export const MIN_DELAY_MS = 1500;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class DealerBlockedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DealerBlockedError';
    this.blocked = true;
  }
}

export class RobotsDisallowedError extends Error {
  constructor(url) {
    super(`robots.txt disallows ${url}`);
    this.name = 'RobotsDisallowedError';
    this.blocked = true;
  }
}

const ENTITIES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', deg: '°', frac12: '½', times: '×', reg: '®', trade: '™', hellip: '…' };

export const decode = (s) =>
  String(s ?? '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z0-9]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);

/** Visible text of an HTML fragment, whitespace-collapsed. */
export const textOf = (html) =>
  decode(
    String(html ?? '')
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h\d)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/[ \t ]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();

/** "$104,900" / "104900.00" → 104900; anything without a positive amount → null. */
export function parsePrice(value) {
  if (typeof value === 'number') return value > 0 ? value : null;
  const m = String(value ?? '').replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  const n = m ? Number(m[0]) : 0;
  return n > 0 ? Math.round(n) : null;
}

/** First 4-digit model year between 1950 and next year, or null. */
export function parseYear(value) {
  const max = new Date().getFullYear() + 2;
  for (const [y] of String(value ?? '').matchAll(/\b(19[5-9]\d|20\d\d)\b/g)) {
    const n = Number(y);
    if (n <= max) return n;
  }
  return null;
}

export function parseCondition(value) {
  const s = String(value ?? '').toLowerCase();
  if (/\bused\b|pre-?owned/.test(s)) return 'used';
  if (/\bnew\b/.test(s)) return 'new';
  return null;
}

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/i;
export const cleanVin = (v) => {
  const s = String(v ?? '').trim().toUpperCase();
  return VIN_RE.test(s) ? s : null;
};

// ── lowboy family ────────────────────────────────────────────────────────────
const LOWBOY_RE =
  /\b(low[\s-]?boy|lowbed|rgn|removable goose ?neck|detach(?:able)?|double[\s-]?drop|traveling[\s-]?axle|travel(?:ing)? axle|tag[\s-]?along|tagalong|hydraulic (?:detach|goose ?neck)|hdg|mechanical goose ?neck|fixed[\s-]?neck lowboy|extendable lowboy|stretch rgn)\b/i;

/** True when a raw listing is in the lowboy family (lowboy/RGN/detachable/double-drop/traveling-axle/tag-along). */
export function isLowboyFamily(listing) {
  const typeText = [listing.title, listing.model, listing.specs?.['Trailer Type'], listing.specs?.Type, listing.specs?.Category]
    .filter(Boolean)
    .join(' ');
  return LOWBOY_RE.test(typeText);
}

// ── robots.txt ───────────────────────────────────────────────────────────────

/**
 * Rules that apply to `agent` from a robots.txt body: the most specific
 * matching group (merged when a site repeats it), falling back to `*`.
 * A Crawl-delay written before any User-agent line is applied to everyone.
 */
export function parseRobots(body, agent = 'axleyardbot') {
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  let globalDelay = null;
  for (const raw of String(body ?? '').split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === 'user-agent') {
      if (!lastWasAgent) {
        current = { agents: [], rules: [], delay: null };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (key === 'crawl-delay') {
      const d = Number(value);
      if (!Number.isFinite(d)) continue;
      if (current) current.delay = d;
      else globalDelay = d;
    } else if ((key === 'allow' || key === 'disallow') && current) {
      current.rules.push({ allow: key === 'allow', path: value });
    }
  }

  const a = agent.toLowerCase();
  const named = groups.filter((g) => g.agents.some((x) => x !== '*' && x === a));
  const chosen = named.length ? named : groups.filter((g) => g.agents.includes('*'));
  const rules = chosen.flatMap((g) => g.rules).filter((r) => r.path !== '' || r.allow === false);
  const delays = [globalDelay, ...chosen.map((g) => g.delay)].filter((d) => d != null);
  return { rules, crawlDelay: delays.length ? Math.max(...delays) : null };
}

function ruleRegex(path) {
  const anchored = path.endsWith('$');
  const body = (anchored ? path.slice(0, -1) : path)
    .split('*')
    .map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${body}${anchored ? '$' : ''}`);
}

/** Longest matching rule wins; Allow wins ties; no match (or empty Disallow) → allowed. */
export function isAllowedByRobots(robots, url) {
  const u = new URL(url);
  const target = u.pathname + u.search;
  let best = null;
  for (const rule of robots.rules) {
    if (rule.path === '') continue; // "Disallow:" with no path allows everything
    if (!ruleRegex(rule.path).test(target)) continue;
    if (!best || rule.path.length > best.path.length || (rule.path.length === best.path.length && rule.allow)) {
      best = rule;
    }
  }
  return best ? best.allow : true;
}

// ── HTTP ─────────────────────────────────────────────────────────────────────

const CHALLENGE_RE =
  /<title>Just a moment\.\.\.<\/title>|_cf_chl_opt|Attention Required! \| Cloudflare|Pardon Our Interruption|<title>Access Denied<\/title>|captcha-delivery|px-captcha|Request unsuccessful\. Incapsula/i;

/** Throws DealerBlockedError if a response looks like a bot wall. */
export function assertNotChallenge(status, body, url) {
  if (status === 403 || status === 429) {
    throw new DealerBlockedError(`${url} answered HTTP ${status} to AxleyardBot — treating the dealer as blocked`);
  }
  if (CHALLENGE_RE.test(String(body ?? '').slice(0, 20000)) && String(body).length < 200000) {
    throw new DealerBlockedError(`${url} served a bot challenge page — treating the dealer as blocked`);
  }
}

/**
 * A per-site fetcher that honors robots.txt and spacing. `get(url, {as})`
 * returns text (default) or parsed JSON (`as: 'json'`).
 */
export function politeClient(baseUrl, { log = () => {}, minDelayMs = MIN_DELAY_MS, robotsAgent = 'axleyardbot' } = {}) {
  const origin = new URL(baseUrl).origin;
  let robots = null;
  let delayMs = minDelayMs;
  let last = 0;

  async function raw(url, accept) {
    const wait = last + delayMs - Date.now();
    if (wait > 0) await sleep(wait);
    last = Date.now();
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: accept }, redirect: 'follow' });
    const body = await res.text();
    last = Date.now();
    return { res, body };
  }

  async function loadRobots() {
    if (robots) return robots;
    const { res, body } = await raw(`${origin}/robots.txt`, 'text/plain');
    if (res.status === 403 || res.status === 429) assertNotChallenge(res.status, body, `${origin}/robots.txt`);
    robots = res.ok && !/<html/i.test(body.slice(0, 500)) ? parseRobots(body, robotsAgent) : { rules: [], crawlDelay: null };
    if (robots.crawlDelay) delayMs = Math.max(minDelayMs, robots.crawlDelay * 1000);
    if (delayMs !== minDelayMs) log(`   robots.txt Crawl-delay → ${delayMs / 1000}s between requests`);
    return robots;
  }

  async function get(url, { as = 'text', accept } = {}) {
    const abs = new URL(url, origin).href;
    if (new URL(abs).origin === origin) {
      const r = await loadRobots();
      if (!isAllowedByRobots(r, abs)) throw new RobotsDisallowedError(abs);
    }
    const { res, body } = await raw(abs, accept || (as === 'json' ? 'application/json' : 'text/html'));
    assertNotChallenge(res.status, body, abs);
    if (!res.ok) throw new Error(`${abs} returned HTTP ${res.status}`);
    if (as === 'json') {
      try {
        return JSON.parse(body);
      } catch {
        throw new Error(`${abs} did not return JSON`);
      }
    }
    return body;
  }

  return { get, loadRobots, get delayMs() { return delayMs; } };
}
