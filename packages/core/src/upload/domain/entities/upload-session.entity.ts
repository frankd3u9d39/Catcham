export class UploadSessionEntity {
  id!: string;
  fileKey!: string;
  fileName!: string;
  mimeType!: string;
  sizeBytes!: number;
  uploadedBy!: string;
  status!: 'PENDING' | 'COMPLETED' | 'QUARANTINED';
}
