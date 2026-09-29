import { DomainEvent } from '../../events/domain-event.base';

export class WorkflowTransitionedEvent extends DomainEvent {
  constructor(
    public readonly instanceId: string,
    public readonly fromState: string,
    public readonly toState: string,
    public readonly actorId: string,
  ) {
    super();
  }
}
