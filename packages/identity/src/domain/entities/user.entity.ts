export class UserEntity {
  id!: string;
  email!: string;
  fullName!: string;
  passwordHash!: string;
  isActive!: boolean;
  isMfaEnabled!: boolean;
  primaryAgencyId?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
