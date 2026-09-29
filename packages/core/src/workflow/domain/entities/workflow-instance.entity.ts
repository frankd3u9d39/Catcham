import { WorkflowStateVO } from '../value-objects/workflow-state.vo';

export class WorkflowInstanceEntity {
  id!: string;
  definitionId!: string;
  targetEntityType!: string;
  targetEntityId!: string;
  currentState!: WorkflowStateVO;
  history!: Array<{
    fromState: string;
    toState: string;
    transition: string;
    performedBy: string;
    timestamp: Date;
  }>;
  createdAt!: Date;
  updatedAt!: Date;
}
