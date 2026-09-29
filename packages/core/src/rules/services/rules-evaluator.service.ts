import { Injectable } from '@nestjs/common';

@Injectable()
export class RulesEvaluatorService {
  async evaluate(ruleSet: string, context: Record<string, unknown>): Promise<{ passed: boolean; actions: string[] }> {
    return { passed: true, actions: [] };
  }
}
