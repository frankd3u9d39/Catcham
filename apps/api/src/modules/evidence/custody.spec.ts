import { computeEntryHash, verifyChain, type CustodyLink } from './custody';

const EVIDENCE_ID = '11111111-1111-4111-8111-111111111111';

function buildChain(
  entries: Array<{ action: string; reason: string; performedById?: string | null }>,
): CustodyLink[] {
  const chain: CustodyLink[] = [];
  let previousHash: string | null = null;

  entries.forEach((entry, index) => {
    const sequence = index + 1;
    const createdAt = new Date(Date.UTC(2026, 0, 1, 0, index));
    const performedById = entry.performedById ?? 'officer-1';

    const entryHash = computeEntryHash({
      evidenceId: EVIDENCE_ID,
      sequence,
      action: entry.action as never,
      performedById,
      transferredToId: null,
      reason: entry.reason,
      createdAt,
      previousHash,
    });

    chain.push({
      sequence,
      action: entry.action,
      performedById,
      transferredToId: null,
      reason: entry.reason,
      createdAt,
      previousHash,
      entryHash,
    });

    previousHash = entryHash;
  });

  return chain;
}

describe('chain of custody', () => {
  it('verifies an intact chain', () => {
    const chain = buildChain([
      { action: 'INTAKE', reason: 'Uploaded with the original report' },
      { action: 'VIEWED', reason: 'Reviewed during triage' },
      { action: 'DOWNLOADED', reason: 'Exported for the forensic lab' },
    ]);

    expect(verifyChain(EVIDENCE_ID, chain)).toEqual({ valid: true, length: 3 });
  });

  it('accepts an empty chain', () => {
    expect(verifyChain(EVIDENCE_ID, [])).toEqual({ valid: true, length: 0 });
  });

  it('detects an altered reason', () => {
    const chain = buildChain([
      { action: 'INTAKE', reason: 'Uploaded with the original report' },
      { action: 'VIEWED', reason: 'Reviewed during triage' },
    ]);

    chain[1]!.reason = 'Reviewed by someone else';
    const verdict = verifyChain(EVIDENCE_ID, chain);

    expect(verdict.valid).toBe(false);
    expect(verdict.valid === false && verdict.brokenAtSequence).toBe(2);
    expect(verdict.valid === false && verdict.detail).toContain('do not match the recorded hash');
  });

  it('detects a changed actor', () => {
    const chain = buildChain([
      { action: 'INTAKE', reason: 'Uploaded' },
      { action: 'TRANSFERRED', reason: 'Handed to the lab' },
    ]);

    chain[1]!.performedById = 'officer-impostor';

    expect(verifyChain(EVIDENCE_ID, chain).valid).toBe(false);
  });

  it('detects a removed entry', () => {
    const chain = buildChain([
      { action: 'INTAKE', reason: 'Uploaded' },
      { action: 'VIEWED', reason: 'Reviewed' },
      { action: 'DOWNLOADED', reason: 'Exported' },
    ]);

    const withoutMiddle = [chain[0]!, chain[2]!];
    const verdict = verifyChain(EVIDENCE_ID, withoutMiddle);

    expect(verdict.valid).toBe(false);
    expect(verdict.valid === false && verdict.detail).toContain('an entry is missing');
  });

  it('detects a re-pointed previousHash', () => {
    const chain = buildChain([
      { action: 'INTAKE', reason: 'Uploaded' },
      { action: 'VIEWED', reason: 'Reviewed' },
    ]);

    chain[1]!.previousHash = 'f'.repeat(64);

    expect(verifyChain(EVIDENCE_ID, chain).valid).toBe(false);
  });

  it('binds entries to their evidence id', () => {
    const chain = buildChain([{ action: 'INTAKE', reason: 'Uploaded' }]);

    // The same rows re-parented to another evidence record must not verify.
    expect(verifyChain('22222222-2222-4222-8222-222222222222', chain).valid).toBe(false);
  });

  it('is order-insensitive on input', () => {
    const chain = buildChain([
      { action: 'INTAKE', reason: 'Uploaded' },
      { action: 'VIEWED', reason: 'Reviewed' },
    ]);

    expect(verifyChain(EVIDENCE_ID, [chain[1]!, chain[0]!])).toEqual({ valid: true, length: 2 });
  });
});
