export class Sha256ChecksumVO {
  constructor(public readonly value: string) {
    if (!value || value.length !== 64 || !/^[a-fA-F0-9]{64}$/.test(value)) {
      throw new Error('Invalid SHA-256 hash checksum');
    }
  }
}
