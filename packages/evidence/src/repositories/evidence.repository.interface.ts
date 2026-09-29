import { EvidenceEntity } from '../domain/entities/evidence.entity';

export interface IEvidenceRepository {
  findById(id: string): Promise<EvidenceEntity | null>;
  save(evidence: EvidenceEntity): Promise<void>;
}
