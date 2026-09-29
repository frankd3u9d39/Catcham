export class PasswordHashVO {
  constructor(public readonly hash: string) {
    if (!hash || hash.length < 20) {
      throw new Error('Invalid password hash');
    }
  }
}
