export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly fullName: string,
    public readonly roleId: string,
    public readonly organizationId?: string,
  ) {}
}
