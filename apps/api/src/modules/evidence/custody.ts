import { sha256Hex } from '../../common/utils/crypto.util';
import type { CustodyAction } from '../../common/constants';

export interface CustodyEntryInput {
  evidenceId: string;
  sequence: number;
  action: CustodyAction;
  performedById: string | null;
  transferredToId: string | null;
  reason: string;
  createdAt: Date;
  previousHash: string | null;
}

export interface CustodyLink {
  sequence: number;
  action: string;
  performedById: string | null;
  transferredToId: string | null;
  reason: string;
  createdAt: Date;
  previousHash: string | null;
  entryHash: string;
}

/**
 * Hash-chained custody ledger.
 *
 * Each entry's hash covers its own fields plus the previous entry's hash, so the
 * chain can be re-derived from the stored rows and compared. Editing or deleting
 * a row changes every hash after it, which `verifyChain` detects. This gives
 * tamper *evidence*, not tamper prevention: an attacker with write access to the
 * whole table could recompute the chain, so the audit log and filesystem
 * permissions remain the other half of the control.
 */
export function computeEntryHash(input: CustodyEntryInput): string {
  // A stable field order matters: the hash is only comparable if it is derived
  // the same way every time.
  const payload = [
    input.evidenceId,
    String(input.sequence),
    input.action,
    input.performedById ?? '',
    input.transferredToId ?? '',
    input.reason,
    input.createdAt.toISOString(),
    input.previousHash ?? 'GENESIS',
  ].join('\u001f');

  return sha256Hex(payload);
}

export type ChainVerdict =
  | { valid: true; length: number }
  | { valid: false; length: number; brokenAtSequence: number; detail: string };

export function verifyChain(
  evidenceId: string,
  entries: readonly CustodyLink[],
): ChainVerdict {
  const ordered = [...entries].sort((left, right) => left.sequence - right.sequence);
  let previousHash: string | null = null;

  for (const [index, entry] of ordered.entries()) {
    const expectedSequence = index + 1;

    if (entry.sequence !== expectedSequence) {
      return {
        valid: false,
        length: ordered.length,
        brokenAtSequence: entry.sequence,
        detail: `Expected sequence ${expectedSequence} but found ${entry.sequence}; an entry is missing.`,
      };
    }

    if (entry.previousHash !== previousHash) {
      return {
        valid: false,
        length: ordered.length,
        brokenAtSequence: entry.sequence,
        detail: 'Recorded previousHash does not match the preceding entry.',
      };
    }

    const recomputed = computeEntryHash({
      evidenceId,
      sequence: entry.sequence,
      action: entry.action as CustodyAction,
      performedById: entry.performedById,
      transferredToId: entry.transferredToId,
      reason: entry.reason,
      createdAt: entry.createdAt,
      previousHash: entry.previousHash,
    });

    if (recomputed !== entry.entryHash) {
      return {
        valid: false,
        length: ordered.length,
        brokenAtSequence: entry.sequence,
        detail: 'Entry contents do not match the recorded hash.',
      };
    }

    previousHash = entry.entryHash;
  }

  return { valid: true, length: ordered.length };
}
