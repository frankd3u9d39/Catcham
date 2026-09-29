export class ExecuteTransitionCommand {
  constructor(
    public readonly instanceId: string,
    public readonly transitionName: string,
    public readonly triggeredByUserId: string,
    public readonly payload?: Record<string, unknown>,
  ) {}
}
