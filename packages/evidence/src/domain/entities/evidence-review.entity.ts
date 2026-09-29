export class EvidenceReviewEntity {
  id!: string;
  evidenceId!: string;
  reviewerId!: string;
  findings!: string;
  admissibilityAssessment!: 'ADMISSIBLE' | 'QUESTIONABLE' | 'INADMISSIBLE';
  reviewedAt!: Date;
}
