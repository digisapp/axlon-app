// @ts-nocheck
/**
 * Polite plain-HTTP fetching for the catalog scrapers whose sites render
 * their pages on the server (no puppeteer needed).
 *
 * Every request goes through one fetcher, which:
 *   - reads the host's robots.txt first and refuses disallowed paths,
 *   - spaces requests to the same host by max(minDelayMs, Crawl-delay),
 *     never less than 1.5s,
 *   - retries 429/5xx/network errors with backoff (honouring Retry-After),
 *   - identifies itself honestly instead of pretending to be a browser.
 *
 * It never tries to get past bot protection: a challenge page or a 403 is
 * returned as a failure and the scraper skips that page.
 */
import * as cheerio from 'cheerio';
import { sleep } from './manufacturer-scraper-utils.mjs';

export const CATALOG_USER_AGENT =
  'Mozilla/5.0 (compatible; AxleyardCatalogBot/1.0; +https://axleyard.com)';
const AGENT_TOKEN = 'axleyardcatalogbot';
const FLOOR_DELAY_MS = 1500;

/**
 * Parse robots.txt into the rule group that applies to us: a group naming
 * our agent token if there is one, otherwise the `*` group.
 * Returns { rules: [{ allow, pattern, re }], crawlDelaySec }.
 */
export function parseRobots(text) {
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const field = m[1].toLowerCase();
    const value = m[2].trim();
    if (field === 'user-agent') {
      if (!lastWasAgent || !current) {
        current = { agents: [], rules: [], crawlDelaySec: null };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (field === 'allow' || field === 'disallow') {
      // An empty Disallow means "allow everything".
      if (!value) continue;
      current.rules.push({ allow: field === 'allow', pattern: value, re: robotsPatternToRegex(value) });
    } else if (field === 'crawl-delay') {
      const n = parseFloat(value);
      if (Number.isFinite(n)) current.crawlDelaySec = n;
    }
  }
  const mine = groups.filter((g) => g.agents.some((a) => a !== '*' && AGENT_TOKEN.includes(a)));
  const chosen = mine.length ? mine : groups.filter((g) => g.agents.includes('*'));
  return {
    rules: chosen.flatMap((g) => g.rules),
    crawlDelaySec: chosen.reduce((max, g) => Math.max(max, g.crawlDelaySec || 0), 0) || null,
  };
}

function robotsPatternToRegex(pattern) {
  const anchored = pattern.endsWith('$');
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp('^' + body + (anchored ? '$' : ''));
}

/** Longest matching rule wins; on a tie Allow wins; no match means allowed. */
export function isAllowedByRobots(robots, url) {
  if (!robots) return true;
  const u = new URL(url);
  const path = u.pathname + u.search;
  let best = null;
  for (const rule of robots.rules) {
    if (!rule.re.test(path)) continue;
    if (
      !best ||
      rule.pattern.length > best.pattern.length ||
      (rule.pattern.length === best.pattern.length && rule.allow)
    ) {
      best = rule;
    }
  }
  return best ? best.allow : true;
}

/**
 * Create a fetcher. One per scraper run; it keeps per-host robots rules and
 * request timing.
 */
export function createPoliteFetcher({
  minDelayMs = 2000,
  userAgent = CATALOG_USER_AGENT,
  timeoutMs = 30_000,
  retries = 2,
} = {}) {
  const hosts = new Map(); // host -> { robots, lastAt, delayMs }

  async function waitTurn(state) {
    const wait = state.lastAt + state.delayMs - Date.now();
    if (wait > 0) await sleep(wait);
    state.lastAt = Date.now();
  }

  async function hostState(url) {
    const { host, origin } = new URL(url);
    let state = hosts.get(host);
    if (state) return state;
    state = { robots: null, lastAt: 0, delayMs: Math.max(minDelayMs, FLOOR_DELAY_MS) };
    hosts.set(host, state);
    try {
      state.lastAt = Date.now();
      const res = await fetch(`${origin}/robots.txt`, {
        headers: { 'User-Agent': userAgent },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok && /text\/plain/i.test(res.headers.get('content-type') || 'text/plain')) {
        state.robots = parseRobots(await res.text());
        if (state.robots.crawlDelaySec) {
          state.delayMs = Math.max(state.delayMs, state.robots.crawlDelaySec * 1000);
          console.log(`  robots.txt: Crawl-delay ${state.robots.crawlDelaySec}s for ${host}`);
        }
      }
    } catch (err) {
      console.warn(`  [WARN] robots.txt unavailable for ${host}: ${err.message}`);
    }
    return state;
  }

  /**
   * GET a URL. Resolves to { ok, status, url, text, contentType }, or null
   * when robots.txt disallows it or every attempt failed.
   */
  async function get(url, { headers = {} } = {}) {
    const state = await hostState(url);
    if (!isAllowedByRobots(state.robots, url)) {
      console.warn(`  [SKIP] robots.txt disallows ${url}`);
      return null;
    }
    for (let attempt = 0; attempt <= retries; attempt++) {
      await waitTurn(state);
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': userAgent, Accept: 'text/html,application/json;q=0.9,*/*;q=0.8', ...headers },
          redirect: 'follow',
          signal: AbortSignal.timeout(timeoutMs),
        });
        const text = await res.text();
        if ((res.status === 429 || res.status >= 500) && attempt < retries) {
          const retryAfter = parseInt(res.headers.get('retry-after') || '', 10);
          const backoff = Math.min(Number.isFinite(retryAfter) ? retryAfter * 1000 : 5000 * (attempt + 1), 60_000);
          console.warn(`  [WARN] HTTP ${res.status} on ${url}; retrying in ${Math.round(backoff / 1000)}s`);
          await sleep(backoff);
          continue;
        }
        return { ok: res.ok, status: res.status, url: res.url || url, text, contentType: res.headers.get('content-type') || '' };
      } catch (err) {
        console.warn(`  [WARN] Fetch failed (attempt ${attempt + 1}) for ${url}: ${err.message}`);
        if (attempt < retries) await sleep(5000 * (attempt + 1));
      }
    }
    return null;
  }

  /** GET an HTML page. Resolves to { $, html, url } or null on any failure. */
  async function html(url, opts) {
    const res = await get(url, opts);
    if (!res) return null;
    if (!res.ok) {
      console.warn(`  [SKIP] HTTP ${res.status} on ${url}`);
      return null;
    }
    return { $: cheerio.load(res.text), html: res.text, url: res.url };
  }

  /** GET a JSON document. Resolves to the parsed value or null. */
  async function json(url, opts = {}) {
    const res = await get(url, { ...opts, headers: { Accept: 'application/json', ...(opts.headers || {}) } });
    if (!res || !res.ok) {
      if (res) console.warn(`  [SKIP] HTTP ${res.status} on ${url}`);
      return null;
    }
    try {
      return JSON.parse(res.text);
    } catch {
      console.warn(`  [SKIP] Not JSON: ${url}`);
      return null;
    }
  }

  return { get, html, json };
}

// ---------------------------------------------------------------------------
// Small parsing helpers shared by the plain-HTTP scrapers
// ---------------------------------------------------------------------------

/** Whitespace-normalised text of a cheerio selection. */
export function textOf($el) {
  return ($el.text() || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

/** Absolute URL for an href/src on a page, or null. */
export function absoluteUrl(href, base) {
  if (!href) return null;
  try {
    return new URL(href.trim(), base).href;
  } catch {
    return null;
  }
}

/**
 * Inches from strings like `37 1/2"`, `22.5"`, `18 in`, `2' 6"`.
 * The first measurement wins (`36.5"-38"` → 36.5).
 */
export function parseInches(str) {
  if (!str) return null;
  const s = normalizeQuotes(str);
  const round = (n) => Math.round(n * 100) / 100;
  // Feet first (`2' 6"`): only when the first number is followed by a foot mark.
  const ft = /^\D*?(\d+(?:\.\d+)?)\s*'\s*-?\s*(?:(\d+(?:\.\d+)?)(?:\s+(\d+)\/(\d+))?)?/.exec(s);
  if (ft) {
    return round(parseFloat(ft[1]) * 12 + (ft[2] ? parseFloat(ft[2]) : 0) + (ft[3] ? +ft[3] / +ft[4] : 0));
  }
  const m = /(\d+(?:\.\d+)?)(?:[\s-]+(\d+)\/(\d+))?/.exec(s);
  if (!m) return null;
  return round(parseFloat(m[1]) + (m[2] ? +m[2] / +m[3] : 0));
}

function normalizeQuotes(str) {
  return String(str).replace(/[″”“]/g, '"').replace(/[′’‘]/g, "'");
}

/**
 * Feet from strings like `48'`, `29'11"`, `26' 11"`, `53 ft`, `30' -6"`.
 * The first measurement wins (`48'-53'` → 48).
 */
export function parseFeet(str) {
  if (!str) return null;
  const s = normalizeQuotes(str);
  const m = /(\d+(?:\.\d+)?)\s*(?:'|ft\.?|feet)\s*(?:-\s*)?(?:(\d+(?:\.\d+)?)\s*(?:"|in\b))?/i.exec(s);
  if (m) return Math.round((parseFloat(m[1]) + (m[2] ? parseFloat(m[2]) / 12 : 0)) * 100) / 100;
  const n = /(\d+(?:\.\d+)?)/.exec(s);
  return n ? parseFloat(n[1]) : null;
}

/** Pounds from `80,000`, `50,000 lbs in 10'`, `25,000#`. */
export function parsePounds(str) {
  if (!str) return null;
  const m = /(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)/.exec(String(str));
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, ''));
  return Number.isFinite(n) ? Math.round(n) : null;
}
