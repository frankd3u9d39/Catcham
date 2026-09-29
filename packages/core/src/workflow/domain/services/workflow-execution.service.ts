import { Injectable } from '@nestjs/common';
import { WorkflowInstanceEntity } from '../entities/workflow-instance.entity';
import { WorkflowStateVO } from '../value-objects/workflow-state.vo';

@Injectable()
export class WorkflowExecutionService {
  async executeStep(instance: WorkflowInstanceEntity, nextState: string): Promise<WorkflowInstanceEntity> {
    instance.currentState = new WorkflowStateVO(nextState);
    return instance;
  }
}
