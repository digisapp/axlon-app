/**
 * Visitor attribution helpers, shared by the tracker and the lead form so a
 * lead is stamped with the same campaign that its visit was.
 */

const SESSION_KEY = 'ms_sid';
const ATTRIBUTION_KEY = 'ms_attr';

export interface Attribution {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

const EMPTY: Attribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_term: null,
  utm_content: null,
};

/**
 * A per-tab-session id, used to count unique visitors without a cookie or any
 * cross-site identifier. sessionStorage can throw (Safari private mode,
 * embedded webviews), so every access is guarded.
 */
export function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/**
 * First-touch attribution: the campaign that brought the visitor in is kept
 * for the whole session, so a lead submitted three pages later is still
 * credited to the ad that produced it rather than to an internal click.
 */
export function readAttribution(search: string, referrer: string): Attribution {
  const params = new URLSearchParams(search);
  const fromUrl: Attribution = {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  };

  const hasUrlAttribution = Object.values(fromUrl).some((v) => v !== null);
  if (hasUrlAttribution) {
    try {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(fromUrl));
    } catch {
      /* non-fatal */
    }
    return fromUrl;
  }

  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (stored) return { ...EMPTY, ...(JSON.parse(stored) as Partial<Attribution>) };
  } catch {
    /* non-fatal */
  }

  // No UTMs anywhere: fall back to the referring host so organic and referral
  // traffic isn't all lumped into "direct".
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, '');
      if (host && host !== window.location.hostname.replace(/^www\./, '')) {
        return { ...EMPTY, utm_source: host, utm_medium: 'referral' };
      }
    } catch {
      /* malformed referrer */
    }
  }

  return EMPTY;
}
