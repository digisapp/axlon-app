/**
 * Splits chat text into plain-text and link tokens so AI replies can render
 * tappable links. The assistants are told to write plain text, so listing links
 * arrive as bare "axleyard.com/listing/<uuid>" strings — unreadable and
 * untappable on a phone. Marketplace URLs become short internal links
 * ("View listing"); other http(s) URLs stay external.
 */

export type LinkToken =
  | { type: 'text'; value: string }
  | { type: 'link'; href: string; label: string; internal: boolean };

const INTERNAL_HOST = /^(?:www\.)?axleyard\.com$/i;

// [label](url) | bare URL with scheme | bare axleyard.com URL without scheme
const LINK_PATTERN =
  /\[([^\]\n]{1,120})\]\(((?:https?:\/\/)?[^\s)]+)\)|(https?:\/\/[^\s<>"'`]+)|((?:www\.)?axleyard\.com\/[^\s<>"'`]*)/gi;

const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"]+$/;

function labelForPath(path: string): string | null {
  if (/^\/listing\/[\w-]+\/?$/.test(path)) return 'View listing';
  if (/^\/new-trailers\/[\w-]+\/[\w-]+\/?$/.test(path)) return 'View specs';
  return null;
}

function toLink(raw: string, explicitLabel?: string): Extract<LinkToken, { type: 'link' }> | null {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  if (INTERNAL_HOST.test(url.hostname)) {
    const href = `${url.pathname}${url.search}${url.hash}` || '/';
    const label = explicitLabel ?? labelForPath(url.pathname) ?? `${url.hostname.replace(/^www\./i, '')}${url.pathname}`;
    return { type: 'link', href, label, internal: true };
  }

  return {
    type: 'link',
    href: url.toString(),
    label: explicitLabel ?? raw.replace(/^https?:\/\//i, ''),
    internal: false,
  };
}

export function linkify(text: string): LinkToken[] {
  const tokens: LinkToken[] = [];
  let last = 0;

  const pushText = (value: string) => {
    if (!value) return;
    const prev = tokens[tokens.length - 1];
    if (prev?.type === 'text') prev.value += value;
    else tokens.push({ type: 'text', value });
  };

  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, mdLabel, mdUrl, schemeUrl, bareUrl] = match;
    const start = match.index ?? 0;
    pushText(text.slice(last, start));

    let raw = mdUrl ?? schemeUrl ?? bareUrl ?? '';
    let trailing = '';
    if (!mdUrl) {
      const punct = raw.match(TRAILING_PUNCTUATION)?.[0] ?? '';
      if (punct) {
        raw = raw.slice(0, -punct.length);
        trailing = punct;
      }
    }

    const link = raw ? toLink(raw, mdLabel?.trim()) : null;
    if (link) {
      tokens.push(link);
      pushText(trailing);
    } else {
      pushText(whole);
    }
    last = start + whole.length;
  }

  pushText(text.slice(last));
  return tokens;
}
