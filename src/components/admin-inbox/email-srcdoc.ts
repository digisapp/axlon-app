/**
 * The document an email body is rendered in (the sandboxed iframe's srcdoc).
 * Pure apart from DOMParser (present in browsers and in jsdom), so the theme
 * choice, the cleanup and the quote folding are unit tested.
 *
 * Two looks, picked per message:
 *
 * - "plain": the message has no design of its own (a typed reply, plain
 *   paragraphs). It is drawn in the admin's own colours, light or dark, like
 *   the rest of the page.
 * - "paper": the message carries backgrounds, layout tables or explicit dark
 *   text, i.e. it was designed for a white page. It is shown on white exactly
 *   as its sender built it. Forcing dark onto that produces black-on-black.
 *
 * No script ever runs inside the frame: the sandbox has no allow-scripts and
 * the document's CSP forbids scripts (the frame would also inherit the site's
 * nonce-based CSP). Quoted history is folded here, before rendering, behind a
 * native <details> toggle, and the parent measures the height from outside.
 */

export type EmailTheme = 'plain' | 'paper';

const NEUTRAL_BACKGROUND = /^(transparent|none|inherit|initial|unset|white|#fff|#ffffff|rgba?\(\s*255\s*,\s*255\s*,\s*255\s*(,\s*[\d.]+\s*)?\)|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))$/;

/** A text colour too dark to read on a dark surface. */
function isDarkTextColor(value: string): boolean {
  const v = value.trim().toLowerCase();
  if (v === 'black' || v === 'windowtext') return true;
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split('').map((c) => c + c).join('') : hex[1];
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    return 0.299 * r + 0.587 * g + 0.114 * b < 110;
  }
  const rgb = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) return 0.299 * +rgb[1] + 0.587 * +rgb[2] + 0.114 * +rgb[3] < 110;
  return false;
}

export function pickEmailTheme(html: string): EmailTheme {
  const h = html.toLowerCase();
  // Layout tables and bgcolor attributes mean a designed email.
  if (/<table\b/.test(h) || /\sbgcolor\s*=/.test(h)) return 'paper';
  // A real background (anything but white/transparent) means the same.
  for (const m of h.matchAll(/background(?:-color)?\s*:\s*([^;"']+)/g)) {
    const value = m[1].trim();
    if (/url\(/.test(value) || !NEUTRAL_BACKGROUND.test(value.split(/\s+/)[0])) return 'paper';
  }
  // Explicit dark text would vanish on a dark surface.
  for (const m of h.matchAll(/(?<![-\w])color\s*:\s*([^;"']+)/g)) {
    if (isDarkTextColor(m[1])) return 'paper';
  }
  if (/<font\b[^>]*\scolor\s*=\s*["']?(black|#000)/.test(h)) return 'paper';
  return 'plain';
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const QUOTE_ATTRIBUTION = /^\s*(On .{5,240}wrote:|El .{5,240}escribi[oó]:|Le .{5,240}a écrit\s?:|-{2,}\s*Original Message\s*-{2,})\s*$/i;

/**
 * A text/plain body as HTML, with the quoted history ("On … wrote:" and the
 * `>` lines after it) folded away.
 */
export function plainTextToEmailHtml(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n');
  let cut = lines.findIndex((line) => QUOTE_ATTRIBUTION.test(line));
  if (cut < 0) {
    // No attribution: a trailing block where every non-empty line is quoted.
    let i = lines.length - 1;
    while (i >= 0 && (lines[i].startsWith('>') || !lines[i].trim())) i--;
    if (i < lines.length - 1 && lines.slice(i + 1).some((l) => l.startsWith('>'))) cut = i + 1;
  }
  const own = (cut >= 0 ? lines.slice(0, cut) : lines).join('\n').replace(/\s+$/, '');
  const quoted = cut >= 0 ? lines.slice(cut).join('\n').trim() : '';
  if (!own.trim()) return `<div class="text-body">${escapeHtml(lines.join('\n'))}</div>`;
  const ownHtml = `<div class="text-body">${escapeHtml(own)}</div>`;
  return quoted
    ? `${ownHtml}<details class="quoted"><summary title="Show quoted text">•••</summary><div class="text-body">${escapeHtml(quoted)}</div></details>`
    : ownHtml;
}

/** Elements that have no business in a rendered email, removed with their content. */
const DROP_SELECTOR = 'script, noscript, iframe, frame, frameset, object, embed, applet, meta, base, link, form, input, button, select, textarea, svg script';
const QUOTE_SELECTOR = '.gmail_quote, blockquote[type="cite"], #divRplyFwdMsg, #appendonsend, .yahoo_quoted, blockquote';

function isBlank(node: Node): boolean {
  if (node.nodeType === 3) return !(node.textContent || '').trim();
  if (node.nodeType !== 1) return true;
  const el = node as Element;
  if (el.tagName === 'BR') return true;
  if (['IMG', 'HR', 'TABLE', 'DETAILS'].includes(el.tagName)) return false;
  return !(el.textContent || '').trim() && !el.querySelector('img, hr, table');
}

function foldQuoted(doc: Document, root: Element): void {
  const quote = root.querySelector(QUOTE_SELECTOR);
  if (!quote) return;

  let start: Element = quote;
  // Outlook's reply header block sits just before the quoted message.
  const prev = quote.previousElementSibling;
  if (prev && /wrote:\s*$/i.test((prev.textContent || '').trim())) start = prev;
  // Gmail wraps the attribution and the quote in one container.
  const parent = start.parentElement;
  if (parent && parent !== root && parent.firstElementChild === start && parent.lastElementChild === quote) start = parent;

  // Nothing to fold if the message is only a quote (a bare forward).
  const own = root.cloneNode(true) as Element;
  own.querySelector(QUOTE_SELECTOR)?.remove();
  if (!(own.textContent || '').replace(/\s+/g, '').length && !own.querySelector('img')) return;

  // The quote block runs from `start` up to and including the quote; a
  // signature after it stays visible.
  const nodes: Node[] = [];
  let node: Node | null = start;
  while (node) {
    nodes.push(node);
    if (node === quote || node.contains(quote)) break;
    node = node.nextSibling;
  }

  const details = doc.createElement('details');
  details.className = 'quoted';
  const summary = doc.createElement('summary');
  summary.title = 'Show quoted text';
  summary.textContent = '•••';
  details.appendChild(summary);
  start.parentNode!.insertBefore(details, start);
  for (const n of nodes) details.appendChild(n);

  // Trim the empty lines mail clients leave around the quote.
  let before = details.previousSibling;
  while (before && isBlank(before)) {
    const gone = before;
    before = before.previousSibling;
    gone.parentNode!.removeChild(gone);
  }
}

function trimTrailingBlank(container: Element): void {
  let last = container.lastChild;
  while (last) {
    if (isBlank(last)) {
      const gone = last;
      last = last.previousSibling;
      container.removeChild(gone);
      continue;
    }
    if (last.nodeType === 1 && !['DETAILS', 'IMG', 'TABLE'].includes((last as Element).tagName)) trimTrailingBlank(last as Element);
    break;
  }
}

/**
 * Cleans an HTML email body and folds its quoted history. Returns the inner
 * HTML for #email-root. Without DOMParser (server render) the body comes back
 * with only the dangerous elements stripped by pattern.
 */
export function prepareEmailHtml(html: string): string {
  if (typeof DOMParser === 'undefined') {
    return html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(script|style|iframe|object|embed|form|noscript)[\s\S]*?<\/\1>/gi, '')
      .replace(/<(meta|base|link)\b[^>]*>/gi, '');
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const root = doc.body;
  // Comments: Outlook's <!--[if mso]> blocks and conditional markup.
  const walker = doc.createTreeWalker(root, 128 /* NodeFilter.SHOW_COMMENT */);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  for (const c of comments) c.parentNode?.removeChild(c);
  root.querySelectorAll(DROP_SELECTOR).forEach((el) => el.remove());
  // Inline event handlers and javascript: URLs can't run here, but they have
  // no reason to survive either.
  root.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      else if ((name === 'href' || name === 'src' || name === 'action' || name === 'formaction') && /^\s*(javascript|vbscript):/i.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    }
  });
  // Every link opens in a new tab with no opener: a link carrying
  // rel="opener" (or target="_self") could otherwise reach back and replace
  // the admin tab with a look-alike page.
  root.querySelectorAll('a, area').forEach((el) => {
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });
  // Styles the email ships in <head> are kept: designed mail depends on them.
  const headStyles = Array.from(doc.head.querySelectorAll('style')).map((s) => s.outerHTML).join('');
  try { foldQuoted(doc, root); } catch { /* render unfolded */ }
  try { trimTrailingBlank(root); } catch { /* render untrimmed */ }
  return headStyles + root.innerHTML;
}

const BASE_CSS = `
  html, body { height: auto; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 14px 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    word-wrap: break-word;
    overflow-wrap: anywhere;
  }
  #email-root { max-width: 760px; }
  #email-root > :first-child { margin-top: 0; }
  img { max-width: 100%; height: auto; }
  img[width="1"], img[height="1"], img[width="0"], img[height="0"] { display: none !important; }
  pre { padding: 8px; overflow-x: auto; white-space: pre-wrap; }
  pre, code { border-radius: 4px; font-size: 13px; }
  table { border-collapse: collapse; max-width: 100%; }
  blockquote { margin: 8px 0; padding-left: 12px; }
  .text-body { white-space: pre-wrap; }
  [style*="Calibri" i], [style*="Aptos" i], [face*="Calibri" i], [face*="Aptos" i] {
    font-family: Calibri, Aptos, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
  }
  details.quoted { margin: 10px 0; }
  details.quoted > summary {
    display: block;
    width: fit-content;
    list-style: none;
    padding: 0 10px;
    height: 20px;
    line-height: 17px;
    font-size: 14px;
    letter-spacing: 1px;
    border-radius: 999px;
    cursor: pointer;
    user-select: none;
  }
  details.quoted > summary::-webkit-details-marker { display: none; }
  details.quoted[open] > summary { margin-bottom: 8px; }
`;

const PLAIN_LIGHT_CSS = `
  :root { color-scheme: light; }
  html, body { background: transparent; }
  body { color: #18181b; }
  a { color: #2563eb; }
  #email-root *:not(img) { background-color: transparent !important; }
  blockquote { border-left: 2px solid #d4d4d8; color: #52525b; }
  pre, code { background: #f4f4f5; }
  details.quoted > summary { background: #f4f4f5; color: #52525b; border: 1px solid #e4e4e7; }
  details.quoted > summary:hover { background: #e4e4e7; color: #18181b; }
  details.quoted .text-body, details.quoted { color: #52525b; }
`;

const PLAIN_DARK_CSS = `
  :root { color-scheme: dark; }
  html, body { background: transparent; }
  body { color: #e4e4e7; }
  a { color: #7cb7ff; }
  /* A plain reply sometimes carries a stray white background on a link or a
     span (Gmail signatures do); it would show as a white box here. */
  #email-root *:not(img) { background-color: transparent !important; }
  /* Logos are often dark artwork on a transparent PNG: give them a page. */
  img { background: #f4f4f5; border-radius: 6px; padding: 4px; }
  blockquote { border-left: 2px solid #3f3f46; color: #a1a1aa; }
  pre, code { background: rgba(255,255,255,0.06); }
  td, th { border-color: #3f3f46; }
  details.quoted > summary { background: rgba(255,255,255,0.08); color: #a1a1aa; border: 1px solid rgba(255,255,255,0.12); }
  details.quoted > summary:hover { background: rgba(255,255,255,0.14); color: #e4e4e7; }
  details.quoted .text-body, details.quoted { color: #a1a1aa; }
`;

const PAPER_CSS = `
  :root { color-scheme: light; }
  html, body { background: #ffffff; }
  body { color: #1a1a1a; }
  /* A designed email brings its own page background and margins. */
  body:has(#email-root > table:first-child) { padding: 0; }
  body:has(#email-root > table:first-child) #email-root { max-width: none; }
  a { color: #1a56db; }
  blockquote { border-left: 2px solid #d4d4d8; color: #52525b; }
  pre, code { background: #f4f4f5; }
  details.quoted > summary { background: #f4f4f5; color: #52525b; border: 1px solid #e4e4e7; }
  details.quoted > summary:hover { background: #e4e4e7; color: #18181b; }
`;

/** The CSP inside the frame: images, inline styles and fonts only. */
export const EMAIL_FRAME_CSP = "default-src 'none'; img-src 'self' https: data:; style-src 'unsafe-inline'; font-src https: data:;";

export function buildEmailSrcdoc(innerHtml: string, opts: { theme: EmailTheme; dark: boolean }): string {
  const look = opts.theme === 'paper' ? PAPER_CSS : opts.dark ? PLAIN_DARK_CSS : PLAIN_LIGHT_CSS;
  const scheme = opts.theme === 'paper' || !opts.dark ? 'light' : 'dark';
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${EMAIL_FRAME_CSP}">
<meta name="referrer" content="no-referrer">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="${scheme}">
<base target="_blank">
<style>${BASE_CSS}${look}</style>
</head>
<body><div id="email-root">${innerHtml}</div></body>
</html>`;
}

/** What the frame shows for a message: its HTML when it has some, else its text. */
export function emailFrameContent(html: string | null | undefined, text: string | null | undefined): { inner: string; theme: EmailTheme } | null {
  if (html && html.trim()) {
    const inner = prepareEmailHtml(html);
    return { inner, theme: pickEmailTheme(inner) };
  }
  if (text && text.trim()) return { inner: plainTextToEmailHtml(text), theme: 'plain' };
  return null;
}
