export class EvaluateRulesCommand {
  constructor(public readonly ruleSet: string, public readonly context: Record<string, unknown>) {}
}
