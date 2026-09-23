/**
 * Voices for the main-line phone agent (xAI Grok Voice). One list for the
 * admin picker and the API that saves it, so they cannot drift apart again:
 * the old hard-coded list offered "Mika", which xAI does not have, and
 * rejected every voice added since the original five.
 *
 * Descriptions are xAI's own. Stored capitalised; the agent lowercases the ID.
 */
export const XAI_VOICES = [
  { value: 'Iris', description: 'Female, friendly and upbeat. Built for sales and support' },
  { value: 'Ara', description: 'Female, warm and friendly' },
  { value: 'Celeste', description: 'Female, confident and reassuring. Built for support' },
  { value: 'Ursa', description: 'Female, friendly, warm and steady' },
  { value: 'Aurora', description: 'Female, serene and steady. Built for support' },
  { value: 'Carina', description: 'Female, soft and soothing' },
  { value: 'Luna', description: 'Female, gentle and patient' },
  { value: 'Liora', description: 'Female, calm and grounded' },
  { value: 'Eve', description: 'Female, energetic. Sounds British to some listeners' },
  { value: 'Rex', description: 'Male, authoritative' },
  { value: 'Sal', description: 'Male, professional' },
  { value: 'Leo', description: 'Male, British accent' },
] as const;

export type XaiVoice = (typeof XAI_VOICES)[number]['value'];

export const XAI_VOICE_IDS = XAI_VOICES.map((v) => v.value) as [XaiVoice, ...XaiVoice[]];
