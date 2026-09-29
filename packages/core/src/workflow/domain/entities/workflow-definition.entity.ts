export class WorkflowDefinitionEntity {
  id!: string;
  name!: string;
  version!: number;
  initialState!: string;
  states!: string[];
  transitions!: Array<{
    name: string;
    from: string;
    to: string;
    requiredRole?: string;
  }>;
  isActive!: boolean;
  createdAt!: Date;
}
