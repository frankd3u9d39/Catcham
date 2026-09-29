export class EvidenceEntity {
  id!: string;
  originalFileName!: string;
  storageKey!: string;
  bucket!: string;
  mimeType!: string;
  sizeBytes!: number;
  sha256Hash!: string;
  reportId?: string;
  investigationId?: string;
  classification!: 'PUBLIC' | 'CONFIDENTIAL' | 'RESTRICTED' | 'TOP_SECRET';
  isArchived!: boolean;
  createdAt!: Date;
}
