export class RegisterEvidenceCommand {
  constructor(
    public readonly fileKey: string,
    public readonly originalFileName: string,
    public readonly mimeType: string,
    public readonly sha256Checksum: string,
    public readonly reportId?: string,
    public readonly investigationId?: string,
    public readonly registeredByUserId?: string,
  ) {}
}
