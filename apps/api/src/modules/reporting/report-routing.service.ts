import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RulesService } from '../rules/rules.service';
import type { Priority } from '../../common/constants';

export interface RoutingInput {
  categoryId: string;
  categoryCode: string;
  categorySeverity: string;
  stateCode?: string | null;
  lgaCode?: string | null;
  isAnonymous: boolean;
  title: string;
}

export interface RoutingDecision {
  agencyId: string | null;
  agencyName: string | null;
  priority: Priority;
  requiresSupervisorReview: boolean;
  /** Names of the rules that fired, for the report timeline. */
  appliedRules: string[];
  reason: string;
}

/**
 * Decides which agency owns a report and at what priority.
 *
 * Two inputs combine: routing rules in the database pick the agency by category
 * and jurisdiction, and the business rules engine can override the priority or
 * force supervisor review. Rules win over the category default, and an explicit
 * triage decision by an officer wins over both.
 */
@Injectable()
export class ReportRoutingService {
  private readonly logger = new Logger(ReportRoutingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rules: RulesService,
  ) {}

  async decide(input: RoutingInput): Promise<RoutingDecision> {
    const agency = await this.selectAgency(input);
    const outcomes = await this.rules.evaluate('REPORT_TRIAGE', {
      categoryCode: input.categoryCode,
      categorySeverity: input.categorySeverity,
      stateCode: input.stateCode ?? null,
      lgaCode: input.lgaCode ?? null,
      isAnonymous: input.isAnonymous,
      title: input.title,
    });

    let priority = normalisePriority(input.categorySeverity);
    let requiresSupervisorReview = false;
    let routedByRule: string | null = null;

    for (const outcome of outcomes) {
      switch (outcome.action) {
        case 'SET_PRIORITY': {
          const requested = outcome.params.priority;
          if (typeof requested === 'string') {
            priority = normalisePriority(requested);
          }
          break;
        }
        case 'ROUTE_TO_AGENCY': {
          const requested = outcome.params.agencyId;
          if (typeof requested === 'string') {
            routedByRule = requested;
          }
          break;
        }
        case 'REQUIRE_SUPERVISOR_REVIEW':
          requiresSupervisorReview = true;
          break;
        case 'FLAG_FOR_ESCALATION':
          priority = 'CRITICAL';
          requiresSupervisorReview = true;
          break;
        default:
          this.logger.warn(`Rule ${outcome.ruleName} returned unknown action ${outcome.action}`);
      }
    }

    const resolved = routedByRule
      ? await this.prisma.agency.findFirst({ where: { id: routedByRule, isActive: true } })
      : agency;

    return {
      agencyId: resolved?.id ?? null,
      agencyName: resolved?.name ?? null,
      priority,
      requiresSupervisorReview,
      appliedRules: outcomes.map((outcome) => outcome.ruleName),
      reason: describe(resolved?.name ?? null, routedByRule !== null, outcomes.length),
    };
  }

  /**
   * Routing rules are ordered by priority. A rule scoped to the report's LGA or
   * state outranks a national rule for the same category, so jurisdiction-specific
   * routing is expressed by giving those rules a higher priority at seed time.
   */
  private async selectAgency(input: RoutingInput) {
    const jurisdictionCodes = [input.lgaCode, input.stateCode].filter(
      (code): code is string => typeof code === 'string' && code.length > 0,
    );

    const rules = await this.prisma.routingRule.findMany({
      where: {
        categoryId: input.categoryId,
        isEnabled: true,
        OR: [{ jurisdictionCode: null }, { jurisdictionCode: { in: jurisdictionCodes } }],
      },
      orderBy: { priority: 'desc' },
      include: { agency: true },
    });

    // Prefer a jurisdiction-specific match at equal priority.
    const scoped = rules.find((rule) => rule.jurisdictionCode !== null && rule.agency.isActive);
    const national = rules.find((rule) => rule.agency.isActive);

    return scoped?.agency ?? national?.agency ?? null;
  }
}

function normalisePriority(value: string): Priority {
  const upper = value.toUpperCase();
  return upper === 'LOW' || upper === 'MEDIUM' || upper === 'HIGH' || upper === 'CRITICAL'
    ? upper
    : 'MEDIUM';
}

function describe(agencyName: string | null, routedByRule: boolean, ruleCount: number): string {
  if (!agencyName) {
    return 'No routing rule matched; the report needs manual assignment.';
  }
  if (routedByRule) {
    return `Routed to ${agencyName} by a business rule.`;
  }
  return ruleCount > 0
    ? `Routed to ${agencyName} by category and jurisdiction; ${ruleCount} rule(s) adjusted the priority.`
    : `Routed to ${agencyName} by category and jurisdiction.`;
}
