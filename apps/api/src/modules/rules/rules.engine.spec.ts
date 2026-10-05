import { BadRequestException } from '@nestjs/common';
import { matches, parseConditionSet } from './rules.engine';

describe('rules engine', () => {
  describe('matches', () => {
    it('requires every condition in `all` to hold', () => {
      const conditions = {
        all: [
          { field: 'categoryCode', op: 'eq' as const, value: 'OIL_THEFT' },
          { field: 'severityScore', op: 'gte' as const, value: 7 },
        ],
      };

      expect(matches(conditions, { categoryCode: 'OIL_THEFT', severityScore: 9 })).toBe(true);
      expect(matches(conditions, { categoryCode: 'OIL_THEFT', severityScore: 3 })).toBe(false);
      expect(matches(conditions, { categoryCode: 'FRAUD', severityScore: 9 })).toBe(false);
    });

    it('requires at least one condition in `any` to hold', () => {
      const conditions = {
        any: [
          { field: 'stateCode', op: 'eq' as const, value: 'RI' },
          { field: 'stateCode', op: 'eq' as const, value: 'BY' },
        ],
      };

      expect(matches(conditions, { stateCode: 'BY' })).toBe(true);
      expect(matches(conditions, { stateCode: 'LA' })).toBe(false);
    });

    it('combines `all` and `any` conjunctively', () => {
      const conditions = {
        all: [{ field: 'isAnonymous', op: 'eq' as const, value: true }],
        any: [
          { field: 'priority', op: 'eq' as const, value: 'HIGH' },
          { field: 'priority', op: 'eq' as const, value: 'CRITICAL' },
        ],
      };

      expect(matches(conditions, { isAnonymous: true, priority: 'CRITICAL' })).toBe(true);
      expect(matches(conditions, { isAnonymous: false, priority: 'CRITICAL' })).toBe(false);
      expect(matches(conditions, { isAnonymous: true, priority: 'LOW' })).toBe(false);
    });

    it('does not match an empty condition set', () => {
      expect(matches({}, { anything: 1 })).toBe(false);
      expect(matches({ all: [], any: [] }, { anything: 1 })).toBe(false);
    });

    it('treats a missing fact as a failed comparison rather than a match', () => {
      expect(matches({ all: [{ field: 'absent', op: 'eq', value: undefined }] }, {})).toBe(true);
      expect(matches({ all: [{ field: 'absent', op: 'gte', value: 1 }] }, {})).toBe(false);
      expect(matches({ all: [{ field: 'absent', op: 'contains', value: 'x' }] }, {})).toBe(false);
    });

    it('compares dates numerically', () => {
      const conditions = {
        all: [{ field: 'occurredAt', op: 'lt' as const, value: new Date('2026-01-01').getTime() }],
      };

      expect(matches(conditions, { occurredAt: new Date('2025-06-01') })).toBe(true);
      expect(matches(conditions, { occurredAt: new Date('2026-06-01') })).toBe(false);
    });

    it('matches `contains` case-insensitively', () => {
      const conditions = { all: [{ field: 'title', op: 'contains' as const, value: 'pipeline' }] };

      expect(matches(conditions, { title: 'Suspected PIPELINE diversion' })).toBe(true);
      expect(matches(conditions, { title: 'Procurement fraud' })).toBe(false);
    });

    it('returns false for `in` when the expected value is not a list', () => {
      expect(matches({ all: [{ field: 'state', op: 'in', value: 'RI' }] }, { state: 'RI' })).toBe(
        false,
      );
    });
  });

  describe('parseConditionSet', () => {
    it('accepts a well-formed set', () => {
      const set = parseConditionSet('{"all":[{"field":"priority","op":"eq","value":"HIGH"}]}');

      expect(set.all).toEqual([{ field: 'priority', op: 'eq', value: 'HIGH' }]);
    });

    it('rejects malformed JSON', () => {
      expect(() => parseConditionSet('{not json')).toThrow(BadRequestException);
    });

    it('rejects an unknown operator', () => {
      expect(() =>
        parseConditionSet('{"all":[{"field":"priority","op":"regex","value":"x"}]}'),
      ).toThrow(/op must be one of/);
    });

    it('rejects a condition with no field', () => {
      expect(() => parseConditionSet('{"all":[{"op":"eq","value":1}]}')).toThrow(
        /field must be a non-empty string/,
      );
    });

    it('rejects a set with no conditions', () => {
      expect(() => parseConditionSet('{"all":[]}')).toThrow(/at least one condition/);
    });
  });
});
