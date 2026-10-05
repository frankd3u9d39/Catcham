import { BadRequestException } from '@nestjs/common';
import {
  availableTransitions,
  checkTransition,
  isTerminal,
  parseStateMachine,
  type StateMachine,
} from './workflow.engine';
import { PERMISSIONS } from '../../common/constants';

const machine: StateMachine = {
  INITIATED: {
    transitions: [{ to: 'EVIDENCE_COLLECTION', permissions: [PERMISSIONS.INVESTIGATION_TRANSITION] }],
  },
  EVIDENCE_COLLECTION: {
    transitions: [
      { to: 'SUPERVISOR_REVIEW', permissions: [PERMISSIONS.INVESTIGATION_TRANSITION] },
      { to: 'CLOSED', permissions: [PERMISSIONS.INVESTIGATION_CLOSE] },
    ],
  },
  SUPERVISOR_REVIEW: {
    transitions: [
      { to: 'EVIDENCE_COLLECTION', permissions: [PERMISSIONS.INVESTIGATION_TRANSITION] },
      { to: 'CLOSED', permissions: [PERMISSIONS.INVESTIGATION_CLOSE] },
    ],
  },
  CLOSED: { transitions: [], terminal: true },
};

describe('workflow engine', () => {
  describe('checkTransition', () => {
    it('allows a declared transition when the actor holds the permission', () => {
      const verdict = checkTransition({
        machine,
        from: 'INITIATED',
        to: 'EVIDENCE_COLLECTION',
        actorPermissions: [PERMISSIONS.INVESTIGATION_TRANSITION],
      });

      expect(verdict.allowed).toBe(true);
    });

    it('rejects a transition the actor lacks permission for', () => {
      const verdict = checkTransition({
        machine,
        from: 'EVIDENCE_COLLECTION',
        to: 'CLOSED',
        actorPermissions: [PERMISSIONS.INVESTIGATION_TRANSITION],
      });

      expect(verdict).toEqual({
        allowed: false,
        reason: `This transition requires: ${PERMISSIONS.INVESTIGATION_CLOSE}.`,
      });
    });

    it('rejects a transition that the machine does not declare', () => {
      const verdict = checkTransition({
        machine,
        from: 'INITIATED',
        to: 'CLOSED',
        actorPermissions: [PERMISSIONS.INVESTIGATION_CLOSE],
      });

      expect(verdict.allowed).toBe(false);
      expect(verdict.allowed === false && verdict.reason).toContain('Allowed: EVIDENCE_COLLECTION');
    });

    it('rejects any transition out of a terminal state', () => {
      const verdict = checkTransition({
        machine,
        from: 'CLOSED',
        to: 'EVIDENCE_COLLECTION',
        actorPermissions: [PERMISSIONS.INVESTIGATION_TRANSITION],
      });

      expect(verdict.allowed).toBe(false);
      expect(verdict.allowed === false && verdict.reason).toContain('terminal state');
    });

    it('rejects an unknown source state', () => {
      const verdict = checkTransition({
        machine,
        from: 'NOT_A_STATE',
        to: 'CLOSED',
        actorPermissions: [],
      });

      expect(verdict.allowed).toBe(false);
    });
  });

  describe('availableTransitions', () => {
    it('lists only the transitions the actor can take', () => {
      const transitions = availableTransitions(machine, 'EVIDENCE_COLLECTION', [
        PERMISSIONS.INVESTIGATION_TRANSITION,
      ]);

      expect(transitions.map((transition) => transition.to)).toEqual(['SUPERVISOR_REVIEW']);
    });

    it('returns nothing for an unknown state', () => {
      expect(availableTransitions(machine, 'NOT_A_STATE', [])).toEqual([]);
    });
  });

  it('identifies terminal states', () => {
    expect(isTerminal(machine, 'CLOSED')).toBe(true);
    expect(isTerminal(machine, 'INITIATED')).toBe(false);
  });

  describe('parseStateMachine', () => {
    it('parses a valid definition', () => {
      const parsed = parseStateMachine(
        '{"A":{"transitions":[{"to":"B","label":"Advance"}]},"B":{"transitions":[],"terminal":true}}',
      );

      expect(parsed.A?.transitions[0]).toEqual({
        to: 'B',
        label: 'Advance',
        permissions: undefined,
      });
      expect(parsed.B?.terminal).toBe(true);
    });

    it('rejects a transition to an undeclared state', () => {
      expect(() => parseStateMachine('{"A":{"transitions":[{"to":"GHOST"}]}}')).toThrow(
        /not a declared state/,
      );
    });

    it('rejects malformed JSON', () => {
      expect(() => parseStateMachine('nope')).toThrow(BadRequestException);
    });

    it('rejects a transition with no target', () => {
      expect(() => parseStateMachine('{"A":{"transitions":[{}]}}')).toThrow(/must be a state name/);
    });
  });
});
