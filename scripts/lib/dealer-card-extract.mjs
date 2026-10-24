// @ts-nocheck
/**
 * Dealer inventory card extraction, shared by scrape-dealer-inventory.mjs
 * and its tests.
 *
 *   extractCardsInPage(cfg, html?)  runs INSIDE the browser (passed to
 *       page.evaluate) and returns the raw text of every listing card.
 *       It must stay self-contained: no references to module scope.
 *   buildRawListing(card, dealer)   runs in Node and turns one card into the
 *       raw listing processListing() expects (or null when filtered out).
 */
import {
  parsePrice,
  parseLocation,
  normalizeCondition,
  parseYear,
  stripLabel,
  fieldsToListing,
} from './dealer-listing-parse.mjs';

// ─── Card extraction (runs inside the browser) ─────────────────────────────

/**
 * Pull the raw text of every listing card on the page (or in `html`, for
 * AJAX-fed grids). Self-contained: puppeteer serializes it into the page.
 * Selector lists are comma-separated and tried in order.
 */
export function extractCardsInPage(cfg, html) {
  const doc = html ? new DOMParser().parseFromString(html, 'text/html') : document;
  const base = location.href;
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const sels = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean);
  const abs = (u) => { try { return new URL(u, base).href; } catch { return null; } };
  // Descendant first (the historical behaviour), the card itself as fallback
  // (cards that ARE the link, e.g. <a class="card">).
  const own = (el, s) => {
    try { return el.querySelector(s) || (el.matches(s) ? el : null); } catch { return null; }
  };
  const textOf = (node) => {
    if (!node) return '';
    if (node.tagName === 'META') return clean(node.getAttribute('content'));
    if (node.tagName === 'INPUT') return clean(node.value || node.getAttribute('value'));
    if (node.tagName === 'LINK') return clean(node.getAttribute('href'));
    // Inline SVG icons carry <style> blocks whose CSS would otherwise end up
    // in the text (Royal's location read ".a{fill:#848f98;} Gaylord, MI").
    if (node.querySelector && node.querySelector('style, script, noscript')) {
      const copy = node.cloneNode(true);
      copy.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
      return clean(copy.textContent);
    }
    return clean(node.textContent);
  };
  // Whole-card text with a space between every text node, so adjacent
  // elements don't fuse ("2027In stock" defeats /\bin stock\b/).
  const spacedText = (node) => {
    const parts = [];
    const walker = doc.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: (t) => (t.parentElement && t.parentElement.closest('style, script, noscript')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    while (walker.nextNode()) parts.push(walker.currentNode.nodeValue);
    return clean(parts.join(' '));
  };
  const firstText = (el, selector) => {
    for (const s of sels(selector)) {
      const t = textOf(own(el, s));
      if (t) return t;
    }
    return '';
  };
  const junk = new RegExp(cfg.imageExclude || 'placeholder|no-thumb|no-image|noimage|default-img|coming-soon|spacer\\.|blank\\.|logo', 'i');
  const normImg = (u) => {
    if (!u || u.startsWith('data:')) return null;
    let url = abs(u.trim());
    if (!url) return null;
    try {
      // Next.js image optimizer URLs wrap the original — fetch the original.
      const p = new URL(url);
      if (p.pathname.endsWith('/_next/image') && p.searchParams.get('url')) url = abs(p.searchParams.get('url'));
    } catch { /* keep url */ }
    if (!url || junk.test(url)) return null;
    for (const [from, to] of cfg.imageReplace || []) url = url.replace(new RegExp(from), to);
    return url;
  };
  const imgCandidates = (n) => {
    const out = [];
    for (const a of ['data-src', 'data-lazy-src', 'data-original', 'nitro-lazy-src', 'src', 'content', 'value']) {
      const v = n.getAttribute(a);
      if (v) out.push(v);
    }
    const ss = n.getAttribute('srcset') || n.getAttribute('data-srcset');
    if (ss) {
      const parts = ss.split(',').map((p) => p.trim().split(/\s+/)[0]).filter(Boolean);
      if (parts.length) out.push(parts[parts.length - 1]);
    }
    return out;
  };
  const fieldsOf = (el) => {
    const out = {};
    if (!cfg.fieldSelector) return out;
    el.querySelectorAll(cfg.fieldSelector).forEach((f) => {
      let label = '';
      let value = '';
      if (cfg.fieldLabelSelector) {
        label = textOf(f.querySelector(cfg.fieldLabelSelector));
        value = textOf(f.querySelector(cfg.fieldValueSelector));
      } else {
        const t = textOf(f);
        const i = t.indexOf(':');
        if (i > 0) { label = t.slice(0, i); value = t.slice(i + 1); }
      }
      label = clean(label).replace(/:$/, '');
      value = clean(value);
      if (label && value && !(label in out)) out[label] = value;
    });
    return out;
  };

  const cardSel = sels(cfg.listingSelector).find((s) => { try { return doc.querySelectorAll(s).length > 0; } catch { return false; } });
  if (!cardSel) return { selector: null, cards: [] };

  const cards = [...doc.querySelectorAll(cardSel)].map((el) => {
    let link = null;
    for (const s of sels(cfg.linkSelector || 'a')) {
      const a = own(el, s);
      const href = a && a.getAttribute('href');
      if (href) { link = abs(href); break; }
    }
    const images = [];
    for (const s of sels(cfg.imageSelector || 'img')) {
      let nodes = [];
      try { nodes = [...el.querySelectorAll(s)]; } catch { nodes = []; }
      for (const n of nodes) {
        for (const c of imgCandidates(n)) {
          const u = normImg(c);
          if (u) { if (!images.includes(u)) images.push(u); break; }
        }
      }
      if (images.length) break;
    }
    const idAttr = cfg.idAttribute
      ? (el.getAttribute(cfg.idAttribute) || el.querySelector(`[${cfg.idAttribute}]`)?.getAttribute(cfg.idAttribute) || null)
      : null;
    return {
      title: firstText(el, cfg.titleSelector || 'h2, h3, .title'),
      priceText: cfg.priceSelector ? firstText(el, cfg.priceSelector) : '',
      link,
      images: images.slice(0, 10),
      idAttr,
      stockText: cfg.stockSelector ? firstText(el, cfg.stockSelector) : '',
      vinText: cfg.vinSelector ? firstText(el, cfg.vinSelector) : '',
      locationText: cfg.locationSelector ? firstText(el, cfg.locationSelector) : '',
      conditionText: cfg.conditionSelector ? firstText(el, cfg.conditionSelector) : '',
      yearText: cfg.yearSelector ? firstText(el, cfg.yearSelector) : '',
      makeText: cfg.makeSelector ? firstText(el, cfg.makeSelector) : '',
      modelText: cfg.modelSelector ? firstText(el, cfg.modelSelector) : '',
      fields: fieldsOf(el),
      text: spacedText(el).slice(0, 3000),
    };
  });
  return { selector: cardSel, cards };
}

// ─── Card → raw listing (Node side) ────────────────────────────────────────

/**
 * Turn one scraped card into the raw listing processListing() expects.
 * Returns null for cards the dealer config filters out (catalog tiles,
 * "call for availability" models, …) or that have no title.
 */
export function buildRawListing(card, dealer) {
  const cfg = dealer.scrapeConfig || {};
  if (!card.title) return null;
  if (cfg.includeIf && !new RegExp(cfg.includeIf, 'i').test(card.text)) return null;
  if (cfg.excludeIf && new RegExp(cfg.excludeIf, 'i').test(card.text)) return null;

  const fields = fieldsToListing(card.fields);
  const textMatch = (pattern) => {
    if (!pattern) return null;
    const m = card.text.match(new RegExp(pattern, 'i'));
    return m ? (m[1] ?? m[0]).trim() : null;
  };

  const stock = stripLabel(card.stockText) || textMatch(cfg.stockPattern) || fields.stock_number || null;
  const vinRaw = stripLabel(card.vinText) || fields.vin || null;
  const vin = vinRaw && /^[A-HJ-NPR-Z0-9]{6,17}$/i.test(vinRaw) ? vinRaw.toUpperCase() : null;
  const locationText = stripLabel(card.locationText) || fields.location || null;
  const { city, state } = parseLocation(locationText, cfg.cityStates || {});

  let title = card.title.replace(/\s+/g, ' ').trim();
  const leadingYear = title.match(/^(19[5-9]\d|20[0-4]\d)\b/);
  const year = parseYear(card.yearText) || fields.year || (leadingYear ? Number(leadingYear[1]) : null);
  if (year && !leadingYear) title = `${year} ${title}`;

  const price = parsePrice(card.priceText);
  const condition = normalizeCondition(card.conditionText)
    || fields.condition
    || (/\b(used|pre-?owned)\b/i.test(card.title) ? 'used' : null)
    || dealer.defaultCondition
    || null;

  // Stable per-unit id. Dealers without an explicit id source keep the
  // historical "last URL path segment" id so existing rows still dedupe.
  let sourceId = null;
  if (cfg.idAttribute && card.idAttr) sourceId = String(card.idAttr).trim();
  else if (cfg.idFrom === 'stock' && stock) sourceId = stock;
  else if (cfg.idFromLink && card.link) {
    const m = card.link.match(new RegExp(cfg.idFromLink));
    if (m) sourceId = m[1];
  }
  let link = card.link;
  if (!link && cfg.linkTemplate && sourceId) link = cfg.linkTemplate.replace('{id}', encodeURIComponent(sourceId));
  if (!sourceId && link) sourceId = link.split('/').filter(Boolean).pop()?.replace(/[^a-zA-Z0-9-]/g, '') || null;

  const specs = { ...fields.specs };
  for (const [key, pattern] of Object.entries(cfg.specPatterns || {})) {
    const v = textMatch(pattern);
    if (v) specs[key] = v;
  }

  return {
    title,
    price,
    price_type: price ? 'fixed' : 'call_for_price',
    images: card.images || [],
    source_url: link || null,
    source_listing_id: sourceId,
    stock_number: stock,
    vin,
    year,
    make: stripLabel(card.makeText) || fields.make || dealer.defaultMake || null,
    model: stripLabel(card.modelText) || fields.model || null,
    condition,
    city: city || (cfg.listingLocationFallback ? dealer.city : null) || null,
    state: state || (cfg.listingLocationFallback ? dealer.state : null) || null,
    location_text: locationText,
    specs,
  };
}
