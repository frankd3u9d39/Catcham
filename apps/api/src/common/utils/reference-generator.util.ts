import * as crypto from 'crypto';

export class ReferenceGenerator {
  static generateReportRef(): string {
    const year = new Date().getFullYear();
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `CTM-${year}-${rand}`;
  }

  static generateCaseNumber(): string {
    const year = new Date().getFullYear();
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `CAS-${year}-${rand}`;
  }
}
