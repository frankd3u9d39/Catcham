import { InvestigationEntity } from '../domain/entities/investigation.entity';

export interface IInvestigationRepository {
  findById(id: string): Promise<InvestigationEntity | null>;
  save(entity: InvestigationEntity): Promise<void>;
}
