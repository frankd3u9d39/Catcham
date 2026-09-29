export class EvidenceVersionEntity {
  id!: string;
  evidenceId!: string;
  versionNumber!: number;
  derivedStorageKey!: string;
  changeDescription!: string;
  createdAt!: Date;
}
