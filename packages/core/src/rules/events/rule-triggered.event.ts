import { DomainEvent } from '../../events/domain-event.base';

export class RuleTriggeredEvent extends DomainEvent {
  constructor(public readonly ruleId: string, public readonly actionTaken: string) {
    super();
  }
}
