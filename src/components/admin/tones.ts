/**
 * Shared colour tones for admin status/intent chips, with dark-mode pairs.
 *
 * Admin pages used to hand-roll `bg-green-100 text-green-700` per page with no
 * dark variant, which renders as a pale slab with low-contrast text in dark
 * mode. Pick a tone here instead. Static strings so Tailwind can see them.
 */
export const TONE = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
} as const;

export type Tone = keyof typeof TONE;

/** Lead / call intent (buy, lease, rent, browsing). */
export const INTENT_TONE: Record<string, string> = {
  buy: TONE.green,
  lease: TONE.blue,
  rent: TONE.purple,
  browsing: TONE.gray,
};

/**
 * Turn a stored enum ("phone_call", "in_progress", "new") into a label
 * ("Phone call", "In progress", "New"). Returns '' for empty input.
 * Hyphens are kept: trade-in timelines store ranges like "1-2_weeks" → "1-2 weeks".
 */
export function formatEnum(value: string | null | undefined): string {
  if (!value) return '';
  const spaced = value.replace(/_+/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
