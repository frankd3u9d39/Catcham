import { BadRequestException } from '@nestjs/common';
import type { PermissionSlug } from '../../common/constants';

export interface TransitionRule {
  to: string;
  /** Permissions the actor must hold to take this transition. */
  permissions?: PermissionSlug[];
  /** Human-readable label for the action, shown on the case detail screen. */
  label?: string;
}

export interface StateDefinition {
  transitions: TransitionRule[];
  /** Terminal states have no outgoing transitions and close the case. */
  terminal?: boolean;
}

export type StateMachine = Record<string, StateDefinition>;

export interface TransitionCheck {
  machine: StateMachine;
  from: string;
  to: string;
  actorPermissions: readonly PermissionSlug[];
}

/**
 * A state machine held in the database rather than in code, so an agency can
 * change its case progression without a deployment. The engine is pure: it
 * answers whether a transition is legal, and the caller persists the result.
 */
export function parseStateMachine(statesJson: string): StateMachine {
  let parsed: unknown;
  try {
    parsed = JSON.parse(statesJson);
  } catch {
    throw new BadRequestException('statesJson is not valid JSON.');
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new BadRequestException('statesJson must be an object keyed by state name.');
  }

  const machine: StateMachine = {};

  for (const [state, definition] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof definition !== 'object' || definition === null) {
      throw new BadRequestException(`statesJson.${state} must be an object.`);
    }

    const record = definition as Record<string, unknown>;
    const transitions = record.transitions ?? [];

    if (!Array.isArray(transitions)) {
      throw new BadRequestException(`statesJson.${state}.transitions must be an array.`);
    }

    machine[state] = {
      terminal: record.terminal === true,
      transitions: transitions.map((entry, index) => {
        if (typeof entry !== 'object' || entry === null) {
          throw new BadRequestException(`statesJson.${state}.transitions[${index}] must be an object.`);
        }
        const transition = entry as Record<string, unknown>;
        if (typeof transition.to !== 'string' || transition.to.length === 0) {
          throw new BadRequestException(
            `statesJson.${state}.transitions[${index}].to must be a state name.`,
          );
        }
        return {
          to: transition.to,
          label: typeof transition.label === 'string' ? transition.label : undefined,
          permissions: Array.isArray(transition.permissions)
            ? (transition.permissions.filter((p): p is string => typeof p === 'string') as PermissionSlug[])
            : undefined,
        };
      }),
    };
  }

  // Every transition target must be a declared state, otherwise a case can
  // reach a state with no way out.
  for (const [state, definition] of Object.entries(machine)) {
    for (const transition of definition.transitions) {
      if (!machine[transition.to]) {
        throw new BadRequestException(
          `statesJson.${state} transitions to "${transition.to}", which is not a declared state.`,
        );
      }
    }
  }

  return machine;
}

export type TransitionVerdict =
  | { allowed: true; transition: TransitionRule }
  | { allowed: false; reason: string };

export function checkTransition(check: TransitionCheck): TransitionVerdict {
  const current = check.machine[check.from];

  if (!current) {
    return { allowed: false, reason: `"${check.from}" is not a state in this workflow.` };
  }
  if (current.terminal) {
    return { allowed: false, reason: `"${check.from}" is a terminal state.` };
  }

  const transition = current.transitions.find((candidate) => candidate.to === check.to);
  if (!transition) {
    const options = current.transitions.map((candidate) => candidate.to).join(', ') || 'none';
    return {
      allowed: false,
      reason: `Cannot move from "${check.from}" to "${check.to}". Allowed: ${options}.`,
    };
  }

  const held = new Set(check.actorPermissions);
  const missing = (transition.permissions ?? []).filter((permission) => !held.has(permission));
  if (missing.length > 0) {
    return {
      allowed: false,
      reason: `This transition requires: ${missing.join(', ')}.`,
    };
  }

  return { allowed: true, transition };
}

/** Transitions the actor may take from a state, for rendering action buttons. */
export function availableTransitions(
  machine: StateMachine,
  from: string,
  actorPermissions: readonly PermissionSlug[],
): TransitionRule[] {
  const held = new Set(actorPermissions);

  return (machine[from]?.transitions ?? []).filter((transition) =>
    (transition.permissions ?? []).every((permission) => held.has(permission)),
  );
}

export function isTerminal(machine: StateMachine, state: string): boolean {
  return machine[state]?.terminal === true;
}
