export class CaseNumberVO {
  constructor(public readonly value: string) {
    if (!value || !value.startsWith('CAS-')) {
      throw new Error('Invalid case number format');
    }
  }
}
