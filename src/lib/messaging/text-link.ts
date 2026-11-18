//==============================================================================
// Tap-to-text (Brett, 18 Nov 2026): a Text button that opens the phone's own
// Messages app with the number and the message filled in. The person presses
// Send, so the text goes from their own phone and plan: no texting service,
// no GoHighLevel, no Twilio. Research: ~/dev/TSAI-Site/docs/crm/SMS-TEXTING-RESEARCH.md.
// Same file as TSAI-Site lib/text-link.ts; keep the two in step.
// Pure, no imports (the Hub page and node --test both load it):
//   node --test --experimental-strip-types scripts/text-link-unit-test.ts
//==============================================================================

/** A US/Canada number as "+1XXXXXXXXXX", or null. Takes (801) 555-1234, 801.555.1234, +1 801 555 1234, 18015551234. */
export function usPhone(raw: unknown): string | null {
  if (typeof raw !== 'string' || /[a-z]/i.test(raw)) return null;
  let d = raw.replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  if (d.length !== 10 || !/^[2-9]\d{2}[2-9]/.test(d)) return null;
  return `+1${d}`;
}

/** "+18015551234" → "(801) 555-1234". */
export function showPhone(e164: string): string {
  const d = e164.replace(/^\+1/, '');
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : e164;
}

/** Twenty's People "phones" field → "+1XXXXXXXXXX" (US/Canada numbers only), or null. */
export function twentyPhone(phones: unknown): string | null {
  if (!phones || typeof phones !== 'object') return null;
  const p = phones as { primaryPhoneNumber?: unknown; primaryPhoneCallingCode?: unknown };
  const code = typeof p.primaryPhoneCallingCode === 'string' ? p.primaryPhoneCallingCode.trim() : '';
  if (code && code !== '+1') return null;
  return usPhone(p.primaryPhoneNumber);
}

/** The Twenty "phones" value for a number we add (only used when the person has no number yet). */
export function twentyPhoneValue(e164: string) {
  return { primaryPhoneNumber: e164.replace(/^\+1/, ''), primaryPhoneCountryCode: 'US', primaryPhoneCallingCode: '+1', additionalPhones: [] };
}

/** iPhone, iPad and Mac Messages read "&body="; Android reads "?body=". */
export const isApple = (userAgent: string) => /iPhone|iPad|iPod|Macintosh/.test(userAgent);

/** The link behind the Text button. */
export function smsHref(e164: string, body: string, apple: boolean): string {
  const text = body.trim();
  return `sms:${e164}${text ? `${apple ? '&' : '?'}body=${encodeURIComponent(text)}` : ''}`;
}

export const telHref = (e164: string) => `tel:${e164}`;
