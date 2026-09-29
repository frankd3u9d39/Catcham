export class EvidenceIntegrityValidator {
  static verifyChecksum(calculated: string, original: string): boolean {
    return calculated.toLowerCase() === original.toLowerCase();
  }
}
