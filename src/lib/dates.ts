/**
 * Date-only ("YYYY-MM-DD") helpers.
 *
 * `new Date('2026-09-20')` is parsed by JS as UTC midnight, so anyone west of
 * UTC renders it as the previous day. These helpers parse a bare date as LOCAL
 * midnight while leaving full ISO timestamps alone.
 */

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse a date-only string as local midnight; full ISO timestamps pass through. */
export function parseDateOnly(value: string): Date {
  const match = DATE_ONLY.exec(value.trim());
  if (!match) return new Date(value);
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/** Format a date-only string (or ISO timestamp) with the viewer's locale. */
export function formatDateOnly(
  value: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!value) return '';
  const date = parseDateOnly(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, options);
}
