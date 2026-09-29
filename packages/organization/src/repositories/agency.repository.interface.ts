import { AgencyEntity } from '../domain/entities/agency.entity';

export interface IAgencyRepository {
  findById(id: string): Promise<AgencyEntity | null>;
  findAll(): Promise<AgencyEntity[]>;
}
