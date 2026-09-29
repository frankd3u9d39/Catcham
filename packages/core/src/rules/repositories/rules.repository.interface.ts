import { BusinessRuleEntity } from '../domain/entities/business-rule.entity';

export interface IRulesRepository {
  findActiveByCategory(category: string): Promise<BusinessRuleEntity[]>;
}
