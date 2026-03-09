/**
 * Sanitize a search string for use in Supabase PostgREST .or() filter expressions.
 * Strips characters that could break out of the filter syntax.
 */
export function sanitizeSearchFilter(input: string): string {
  // Remove PostgREST filter metacharacters: ( ) , . and backslashes
  // Also strip any control characters
  return input
    .replace(/[\\(),."']/g, '')
    .replace(/[\x00-\x1f\x7f]/g, '')
    .trim()
    .slice(0, 200); // Cap length to prevent abuse
}
