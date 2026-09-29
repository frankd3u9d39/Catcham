export class BusinessRuleEntity {
  id!: string;
  name!: string;
  category!: string;
  conditions!: Record<string, unknown>;
  action!: string;
  priority!: number;
  isEnabled!: boolean;
}
