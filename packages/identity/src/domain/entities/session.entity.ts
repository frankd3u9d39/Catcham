export class SessionEntity {
  id!: string;
  userId!: string;
  refreshTokenHash!: string;
  ipAddress!: string;
  userAgent!: string;
  expiresAt!: Date;
}
