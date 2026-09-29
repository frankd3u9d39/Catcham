export class EmailVO {
  constructor(public readonly value: string) {
    if (!value || !value.includes('@')) {
      throw new Error('Invalid email address format');
    }
  }
}
