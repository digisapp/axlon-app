// The staff form always sends every field, with '' for blanks. `email: ''`
// fails z.string().email(), so adding a staff member without an email was
// rejected with "Validation failed". Treat blank optional fields as absent.
export function normalizeStaffBody(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;
  const body: Record<string, unknown> = { ...(raw as Record<string, unknown>) };
  for (const key of ['email', 'phone_number']) {
    if (typeof body[key] === 'string' && (body[key] as string).trim() === '') body[key] = null;
  }
  // On edit the PIN field is left blank to mean "keep the current PIN".
  if (body.voice_pin === '' || body.voice_pin === null) delete body.voice_pin;
  return body;
}
