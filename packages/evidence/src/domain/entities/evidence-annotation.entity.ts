export class EvidenceAnnotationEntity {
  id!: string;
  evidenceId!: string;
  authorId!: string;
  annotationText!: string;
  metadataJson?: string;
  createdAt!: Date;
}
