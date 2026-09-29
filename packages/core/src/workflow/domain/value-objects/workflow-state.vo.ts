export class WorkflowStateVO {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Workflow state cannot be empty');
    }
  }
}
