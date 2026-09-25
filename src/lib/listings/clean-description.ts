/**
 * Some scraped descriptions captured the dealer site's contact form instead of
 * the listing copy — e.g. a Gravity Forms block matched a `[class*=description]`
 * selector and stored "Name(Required) First Last Company Name Email(Required)
 * Phone Questions/Comments". Cut that form text; null when nothing real is left.
 */
const FORM_START = /\bName\s*\(\s*Required\s*\)/i;
const FORM_FIELD = /\b(?:Email|Phone|Questions\s*\/\s*Comments|Company Name)\b/i;

export function cleanListingDescription(description: string | null | undefined): string | null {
  if (!description) return null;
  const start = description.search(FORM_START);
  const text =
    start >= 0 && FORM_FIELD.test(description.slice(start)) ? description.slice(0, start) : description;
  const trimmed = text.trim();
  return trimmed.length > 0 ? trimmed : null;
}
