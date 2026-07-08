/**
 * Serialize an object for safe injection into a
 * `<script type="application/ld+json">` tag via dangerouslySetInnerHTML.
 *
 * JSON.stringify does not escape the "<" character, so content containing
 * "</script><script>..." would break out of the tag and execute
 * (stored XSS via scraped listing titles/descriptions). Escaping "<"
 * as its unicode escape sequence is valid JSON and neutralizes the attack.
 */
export function jsonLdString(obj: object): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
