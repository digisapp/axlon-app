/**
 * Guards for the public forms (contact, apply, listing inquiry) against the
 * bots that have been using them, and for the mail those forms trigger.
 *
 * The attack seen since September: a bot fills a form with a random name, a
 * random 10-digit "message" and a third party's real email address, so that
 * the "we received your message" auto-reply bombs that person. The per-IP
 * rate limit does nothing against a few submissions a day from rotating IPs.
 * In October the same bot moved to the listing inquiry form with a new
 * shape: two random words for a name ("Vzxwnz Gsfqlp") and a random token
 * for a message ("WgBTDDJvBnXCBqeY").
 *
 * Pure functions, unit tested against every bot row seen so far
 * (form-guard.test.ts). The one database check lives in
 * instant-reply-guard.ts.
 */

export interface FormSignalsInput {
  name: string | null | undefined;
  message: string | null | undefined;
  /** A company name, where the form asks for one (signup). */
  company?: string | null;
  /** The address the form would email. */
  email?: string | null;
  /** A field real people never see (CSS-hidden); any value means a bot. */
  honeypot?: string | null;
  /** Date.now() when the form was first shown, sent by the browser. */
  startedAt?: number | null;
  /** Date.now() at submission (injectable for tests). */
  now?: number;
}

/** Fewer milliseconds than this between opening a form and sending it is a bot. */
export const MIN_FILL_MS = 3000;

/** The honeypot field's name: looks like a real field to a form filler. */
export const HONEYPOT_FIELD = 'website';

/** Reasons a submission looks automated. Empty means it looks like a person. */
export function botSignals(input: FormSignalsInput): string[] {
  const reasons: string[] = [];
  if (input.honeypot && input.honeypot.trim()) reasons.push('honeypot filled');

  const now = input.now ?? Date.now();
  if (typeof input.startedAt === 'number' && Number.isFinite(input.startedAt)) {
    const elapsed = now - input.startedAt;
    // A clock skew in the future reads as 0 ms, which is also "too fast".
    if (elapsed < MIN_FILL_MS) reasons.push(`filled in ${Math.max(0, elapsed)} ms`);
  }

  const name = (input.name ?? '').trim();
  // "gdlOIndfiDUtAdyoidSyq": one long token with case flipping mid-word, or
  // "YuCDFAMLLONAmmujobb": capitals run on inside a word — or
  // "Vzxwnz Gsfqlp": words no language produces.
  const oneToken = name.length >= 12 && !/\s/.test(name);
  if (
    (oneToken && (caseFlips(name) >= 3 || /[a-z][A-Z]{4,}[a-z]/.test(name))) ||
    looksLikeRandomText(name)
  ) {
    reasons.push('random-looking name');
  }

  const message = (input.message ?? '').trim();
  // A bare number (the bots send a random 10-digit "message").
  if (message && /^[\d\s().+-]{6,}$/.test(message)) reasons.push('message is only a number');
  // A message of one to three words, one of them keyboard noise
  // ("WgBTDDJvBnXCBqeY"). Prose is never judged this way: a real question
  // runs longer, and a model name or a surname inside it is not held against it.
  if (message && message.split(/\s+/).length <= 3 && looksLikeRandomText(message)) {
    reasons.push('random-looking message');
  }

  if (input.company && looksLikeRandomCompany(input.company)) reasons.push('random-looking company');

  if (input.email && isDottedGmail(input.email)) reasons.push('dotted gmail address');

  return reasons;
}

/**
 * Gmail ignores dots in the local part, so "j.o.h.n.s.m.i.t.h@gmail.com" is
 * John's inbox under a name no rate limit has seen before. Bots lean on it;
 * people almost never write their own address with three or more dots.
 */
export function isDottedGmail(email: string): boolean {
  const [local, domain] = (email || '').trim().toLowerCase().split('@');
  if (!local || !/^(gmail|googlemail)\.com$/.test(domain ?? '')) return false;
  return (local.match(/\./g) ?? []).length >= 3;
}

/**
 * The inbox an address actually reaches, for rate caps: lower-cased, any
 * "+tag" dropped, and for Gmail the dots removed and googlemail.com folded
 * into gmail.com. "Sar.ah.Young+1@googlemail.com" and "sarahyoung@gmail.com"
 * are one inbox, and the bots rotate exactly those spellings to get past a
 * per-address limit.
 */
export function canonicalEmail(email: string): string {
  const trimmed = (email || '').trim().toLowerCase();
  const at = trimmed.lastIndexOf('@');
  if (at < 0) return trimmed;
  let local = trimmed.slice(0, at).replace(/\+.*$/, '');
  let domain = trimmed.slice(at + 1);
  if (domain === 'googlemail.com') domain = 'gmail.com';
  if (domain === 'gmail.com') local = local.replace(/\./g, '');
  return `${local}@${domain}`;
}

/** Lower-case letter followed by an upper-case one, counted across the string. */
function caseFlips(text: string): number {
  let flips = 0;
  for (let i = 1; i < text.length; i++) {
    if (/[a-z]/.test(text[i - 1]) && /[A-Z]/.test(text[i])) flips++;
  }
  return flips;
}

/**
 * Letter pairs that essentially never occur in English words or in surnames,
 * including the Polish, German, Scandinavian and Vietnamese ones that trip a
 * naive "too many consonants" test. Derived from a 236k-word dictionary plus
 * 600 trailer-industry business names: every pair below appears fewer than
 * 40 times in that corpus, and the Slavic digraphs (sz, cz, rz, dz, zh …)
 * are left out on purpose.
 */
const RARE_PAIRS = new Set(
  (
    'bk bq bx bz cb cd cf cg cj cm cp cv cw cx dk dq dx fb fc fd fg fh fk fm fn fp fq fv fw fx fz ' +
    'gc gj gk gq gv gx gz hj hk hq hx hz jb jc jd jf jg jh jj jk jl jm jn jp jq jr js jt jv jw jx jy jz ' +
    'kc kg kq kv kx kz lq lx mg mj mk mq mx mz pd pj pq pv px pz qa qb qc qd qe qf qg qh qi qj qk ql qm ' +
    'qn qo qp qq qr qs qt qv qw qx qy qz rx sx tj tq tx uq uu uw vb vc vd vf vg vh vj vk vl vm vn vp vq ' +
    'vr vs vt vv vw vx vz wc wg wj wq wv wx wz xb xd xf xg xj xk xm xn xq xr xv xw xx xz yj yq yv yy ' +
    'zf zg zj zk zm zn zp zq zr zv zx'
  ).split(' ')
);

const LEGAL_SUFFIXES = new Set(['llc', 'inc', 'co', 'corp', 'ltd', 'llp', 'plc', 'gmbh', 'lp', 'pllc']);

/**
 * Whether a short text reads as keyboard noise: "Qgnbxxwroa LLC",
 * "Vzxwnz Gsfqlp", "WgBTDDJvBnXCBqeY" — what the bots type for a company, a
 * name or a message. Each word of five letters or more is judged on its own;
 * one unpronounceable word condemns the text.
 *
 * Tuned for precision, not recall: it catches 20 of the 26 company names the
 * signup bots used while passing every surname, brand and dictionary word
 * tried against it (Szczepanski, Nguyen, Stoltzfus, Krzyzewski, WestCoastGPS,
 * matchstick). The honeypot and the fill time catch what this misses.
 */
export function looksLikeRandomText(text: string): boolean {
  for (const token of (text || '').match(/[A-Za-z]+/g) ?? []) {
    const parts = token
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .split(' ');
    // A plain word is judged as typed. A camel-case join ("VoltSwitchGPS",
    // "JCPenney") is judged by its parts, since the join itself is not a
    // word — unless the case flips three or more times, which is noise
    // ("WgBTDDJvBnXCBqeY"), not a brand gluing words together.
    if (parts.length === 1 ? isRandomToken(token) : parts.some(isRandomToken) || caseFlips(token) >= 3) {
      return true;
    }
  }
  return false;
}

function isRandomToken(token: string): boolean {
  let word = token.toLowerCase();
  if (LEGAL_SUFFIXES.has(word)) return false;
  // McGriff, MacPherson: judge the surname, not the prefix join.
  word = word.replace(/^ma?c(?=[a-z]{3,})/, '');
  if (word.length < 5) return false;
  return isRandomWord(word);
}

/** The company-name reading of {@link looksLikeRandomText}. */
export const looksLikeRandomCompany = looksLikeRandomText;

function isRandomWord(word: string): boolean {
  const vowelish = (c: string) => 'aeiouy'.includes(c);
  const vowels = [...word].filter(vowelish).length;
  // No vowel at all, y included: "dlcxk", "qsrkfxkfkv".
  if (vowels === 0) return true;

  const pairs: string[] = [];
  for (let i = 1; i < word.length; i++) pairs.push(word[i - 1] + word[i]);
  const rare = pairs.filter((p) => RARE_PAIRS.has(p));
  // Two impossible pairs in one word: "qgnbxxwroa", "cpaofx".
  if (rare.length >= 2) return true;
  // One impossible pair past the first letter, in a word that is mostly
  // consonants: "kunqzdm" (qz), but not "Zwick" or "Hrafn", whose odd pair
  // is the opening cluster of a real name.
  const innerRare = rare.some((p) => !word.startsWith(p));
  if (word.length >= 6 && innerRare && vowels / word.length <= 0.2) return true;

  // Seven consonants in a row: "vfhqrrto". English compounds reach six
  // ("latchstring"), never seven.
  let run = 0;
  for (const c of word) {
    run = vowelish(c) ? 0 : run + 1;
    if (run >= 7) return true;
  }
  return false;
}

/**
 * Local parts that are machines, not people: an automatic reply to one of
 * these either bounces or starts a loop.
 */
const AUTOMATED_LOCAL_PART = /^(no-?reply|do-?not-?reply|mailer-daemon|postmaster|bounces?|notifications?|alerts?|auto-?reply|newsletter|abuse|security|subpoena\w*)\b/i;

/** Addresses that are SMS or paging gateways: mail to them is a text message someone pays for. */
const GATEWAY_DOMAINS = /@(vtext\.com|txt\.att\.net|tmomail\.net|messaging\.sprintpcs\.com|vzwpix\.com|mms\.att\.net|pm\.sprint\.com|email\.uscc\.net)$/i;

/**
 * Whether an automatic email may go to this address at all, ignoring rate.
 * Returns the reason it may not, or null.
 */
export function autoMailBlockedReason(to: string, message?: string | null): string | null {
  const address = (to || '').trim().toLowerCase();
  if (!address.includes('@')) return 'no address';
  if (AUTOMATED_LOCAL_PART.test(address.split('@')[0])) return 'automated address';
  if (GATEWAY_DOMAINS.test(address)) return 'SMS gateway address';
  if (message && /\b(?:https?:\/\/|www\.)\S+/i.test(message)) return 'message contains a link';
  return null;
}
