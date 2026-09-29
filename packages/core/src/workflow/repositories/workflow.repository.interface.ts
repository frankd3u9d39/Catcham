import { WorkflowInstanceEntity } from '../domain/entities/workflow-instance.entity';

export interface IWorkflowRepository {
  findById(id: string): Promise<WorkflowInstanceEntity | null>;
  save(instance: WorkflowInstanceEntity): Promise<void>;
}
