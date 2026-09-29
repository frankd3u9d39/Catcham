export class InvestigationNoteEntity {
  id!: string;
  investigationId!: string;
  authorId!: string;
  content!: string;
  isConfidential!: boolean;
  createdAt!: Date;
}
