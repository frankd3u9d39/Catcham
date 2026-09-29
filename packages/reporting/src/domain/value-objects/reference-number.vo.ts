export class ReferenceNumberVO {
  constructor(public readonly value: string) {
    if (!value || !value.startsWith('CTM-')) {
      throw new Error('Invalid CATCHAM reference number format');
    }
  }
}
