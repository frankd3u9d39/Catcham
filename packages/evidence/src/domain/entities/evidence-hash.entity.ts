export class EvidenceHashEntity {
  id!: string;
  evidenceId!: string;
  algorithm!: string;
  hashValue!: string;
  verifiedAt!: Date;
}
