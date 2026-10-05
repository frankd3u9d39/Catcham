import { randomBytes, randomInt } from 'node:crypto';

/** Characters without visually ambiguous pairs, so codes survive being read aloud. */
const CODE_ALPHABET = 'ACDEFGHJKLMNPQRSTUVWXY34679';

/**
 * Human-facing identifiers. References are shown to citizens and quoted in
 * correspondence, so they stay short and case-insensitive on lookup.
 */
export const references = {
  /** e.g. CTM-2026-7F3A91 */
  reportReference(now: Date = new Date()): string {
    return `CTM-${now.getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  },

  /** e.g. CAS-2026-04B2C8 */
  caseNumber(now: Date = new Date()): string {
    return `CAS-${now.getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  },

  /**
   * The one-time code an anonymous submitter needs, alongside the reference, to
   * track their report. Only its hash is stored.
   */
  trackingCode(length = 10): string {
    let code = '';
    for (let index = 0; index < length; index += 1) {
      code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
    }
    return code;
  },

  /** Opaque key for an evidence blob on disk. */
  storageKey(extension: string): string {
    const now = new Date();
    const datePrefix = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    return `${datePrefix}/${randomBytes(16).toString('hex')}${extension}`;
  },
};
