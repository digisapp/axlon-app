/**
 * Validate and normalize phone number to E.164 format
 */
export function validateE164Phone(phone: string): { valid: boolean; normalized: string } {
  if (!phone) return { valid: false, normalized: '' };

  // Strip all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Handle various formats
  if (cleaned.startsWith('+')) {
    const digits = cleaned.slice(1);
    if (digits.length === 11 && digits.startsWith('1')) {
      return { valid: true, normalized: cleaned };
    } else if (digits.length === 10) {
      return { valid: true, normalized: `+1${digits}` };
    }
  } else if (cleaned.startsWith('1') && cleaned.length === 11) {
    return { valid: true, normalized: `+${cleaned}` };
  } else if (cleaned.length === 10) {
    return { valid: true, normalized: `+1${cleaned}` };
  }

  return { valid: false, normalized: cleaned };
}
