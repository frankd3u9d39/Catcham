import { Sha256ChecksumVO } from '../domain/value-objects/sha256-checksum.vo';

describe('Evidence Custody Integrity', () => {
  it('should validate 64-char sha256 checksums', () => {
    const valid = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    expect(new Sha256ChecksumVO(valid).value).toBe(valid);
  });
});
