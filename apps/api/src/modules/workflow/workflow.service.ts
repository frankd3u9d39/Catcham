import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  availableTransitions,
  checkTransition,
  isTerminal,
  parseStateMachine,
  type StateMachine,
  type TransitionRule,
} from './workflow.engine';
import { CASE_WORKFLOW_NAME, type PermissionSlug } from '../../common/constants';

@Injectable()
export class WorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  /** The active definition for a workflow name, highest version first. */
  async activeDefinition(name: string = CASE_WORKFLOW_NAME) {
    const definition = await this.prisma.workflowDefinition.findFirst({
      where: { name, isActive: true },
      orderBy: { version: 'desc' },
    });

    if (!definition) {
      throw new NotFoundException(
        `No active workflow definition named "${name}". Run the database seed.`,
      );
    }

    return { ...definition, machine: parseStateMachine(definition.statesJson) };
  }

  async listDefinitions() {
    const definitions = await this.prisma.workflowDefinition.findMany({
      orderBy: [{ name: 'asc' }, { version: 'desc' }],
    });

    return definitions.map((definition) => ({
      ...definition,
      states: Object.keys(parseStateMachine(definition.statesJson)),
    }));
  }

  /**
   * Validates a transition and records it. Returns the target state so the
   * caller can update the aggregate in the same transaction it owns.
   */
  async assertTransitionAllowed(
    machine: StateMachine,
    from: string,
    to: string,
    actorPermissions: readonly PermissionSlug[],
  ): Promise<TransitionRule> {
    const verdict = checkTransition({ machine, from, to, actorPermissions });

    if (!verdict.allowed) {
      throw new BadRequestException(verdict.reason);
    }

    return verdict.transition;
  }

  async recordTransition(input: {
    definitionId: string;
    investigationId: string;
    fromState: string;
    toState: string;
    actorId: string;
    note?: string;
  }) {
    return this.prisma.workflowTransition.create({ data: input });
  }

  historyFor(investigationId: string) {
    return this.prisma.workflowTransition.findMany({
      where: { investigationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  nextStatesFor(
    machine: StateMachine,
    currentState: string,
    actorPermissions: readonly PermissionSlug[],
  ) {
    return {
      currentState,
      isTerminal: isTerminal(machine, currentState),
      available: availableTransitions(machine, currentState, actorPermissions),
    };
  }

  /**
   * Publishes a new version of a workflow and deactivates the previous one.
   * Existing cases keep their state string; transitions are re-evaluated against
   * the new definition on their next move.
   */
  async publishDefinition(input: {
    name: string;
    initialState: string;
    statesJson: string;
  }) {
    const machine = parseStateMachine(input.statesJson);

    if (!machine[input.initialState]) {
      throw new BadRequestException(
        `initialState "${input.initialState}" is not one of the declared states.`,
      );
    }

    const latest = await this.prisma.workflowDefinition.findFirst({
      where: { name: input.name },
      orderBy: { version: 'desc' },
    });

    return this.prisma.$transaction(async (tx) => {
      await tx.workflowDefinition.updateMany({
        where: { name: input.name, isActive: true },
        data: { isActive: false },
      });

      return tx.workflowDefinition.create({
        data: {
          name: input.name,
          version: (latest?.version ?? 0) + 1,
          initialState: input.initialState,
          statesJson: input.statesJson,
          isActive: true,
        },
      });
    });
  }
}
