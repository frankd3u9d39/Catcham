import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { type Facts, matches, parseConditionSet } from './rules.engine';
import type { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

export interface RuleOutcome {
  ruleId: string;
  ruleName: string;
  action: string;
  params: Record<string, unknown>;
}

@Injectable()
export class RulesService {
  private readonly logger = new Logger(RulesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Runs every enabled rule in a category against `facts`, highest priority
   * first, and returns the actions of those that matched. A rule row with
   * unparseable conditions is skipped and logged rather than failing the request
   * that triggered evaluation.
   */
  async evaluate(category: string, facts: Facts): Promise<RuleOutcome[]> {
    const rules = await this.prisma.businessRule.findMany({
      where: { category, isEnabled: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });

    const outcomes: RuleOutcome[] = [];

    for (const rule of rules) {
      let conditions;
      try {
        conditions = parseConditionSet(rule.conditionsJson);
      } catch (error) {
        this.logger.warn(
          `Skipping rule ${rule.id} (${rule.name}): ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        continue;
      }

      if (matches(conditions, facts)) {
        outcomes.push({
          ruleId: rule.id,
          ruleName: rule.name,
          action: rule.action,
          params: parseParams(rule.actionParams),
        });
      }
    }

    return outcomes;
  }

  list(category?: string) {
    return this.prisma.businessRule.findMany({
      where: { category },
      orderBy: [{ category: 'asc' }, { priority: 'desc' }],
    });
  }

  async findById(id: string) {
    const rule = await this.prisma.businessRule.findUnique({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`No business rule with id ${id}.`);
    }
    return rule;
  }

  async create(dto: CreateRuleDto, actor: AuthenticatedUser) {
    // Validate before storing, so an unparseable rule never reaches the table.
    parseConditionSet(dto.conditionsJson);

    const rule = await this.prisma.businessRule.create({
      data: {
        name: dto.name,
        category: dto.category,
        conditionsJson: dto.conditionsJson,
        action: dto.action,
        actionParams: dto.actionParams ? JSON.stringify(dto.actionParams) : null,
        priority: dto.priority ?? 100,
        isEnabled: dto.isEnabled ?? true,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'RULE_CREATED',
      resource: 'business_rule',
      resourceId: rule.id,
      metadata: { name: rule.name, category: rule.category },
    });

    return rule;
  }

  async update(id: string, dto: UpdateRuleDto, actor: AuthenticatedUser) {
    await this.findById(id);

    if (dto.conditionsJson) {
      parseConditionSet(dto.conditionsJson);
    }

    const rule = await this.prisma.businessRule.update({
      where: { id },
      data: {
        name: dto.name,
        conditionsJson: dto.conditionsJson,
        action: dto.action,
        actionParams: dto.actionParams ? JSON.stringify(dto.actionParams) : undefined,
        priority: dto.priority,
        isEnabled: dto.isEnabled,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'RULE_UPDATED',
      resource: 'business_rule',
      resourceId: id,
      metadata: { ...dto },
    });

    return rule;
  }

  async remove(id: string, actor: AuthenticatedUser): Promise<void> {
    await this.findById(id);
    await this.prisma.businessRule.delete({ where: { id } });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'RULE_DELETED',
      resource: 'business_rule',
      resourceId: id,
    });
  }

  /** Dry run against caller-supplied facts, so a rule can be checked before enabling it. */
  async simulate(category: string, facts: Facts): Promise<RuleOutcome[]> {
    return this.evaluate(category, facts);
  }
}

function parseParams(value: string | null): Record<string, unknown> {
  if (!value) {
    return {};
  }
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}
