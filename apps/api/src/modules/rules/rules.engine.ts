import { BadRequestException } from '@nestjs/common';

export type ComparisonOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains';

export interface Condition {
  field: string;
  op: ComparisonOperator;
  value: unknown;
}

/** A rule matches when every `all` condition holds and at least one `any` does. */
export interface ConditionSet {
  all?: Condition[];
  any?: Condition[];
}

export type Facts = Record<string, unknown>;

/**
 * Evaluates a stored condition set against a flat fact object.
 *
 * Kept deliberately small: comparison operators only, no arithmetic and no
 * nested rule references. Anything that needs more than this belongs in a
 * service, where it can be tested and reviewed, rather than in database rows.
 */
export function matches(conditions: ConditionSet, facts: Facts): boolean {
  const all = conditions.all ?? [];
  const any = conditions.any ?? [];

  if (all.length === 0 && any.length === 0) {
    return false;
  }

  const allHold = all.every((condition) => evaluate(condition, facts));
  const anyHold = any.length === 0 || any.some((condition) => evaluate(condition, facts));

  return allHold && anyHold;
}

function evaluate(condition: Condition, facts: Facts): boolean {
  const actual = facts[condition.field];
  const expected = condition.value;

  switch (condition.op) {
    case 'eq':
      return actual === expected;
    case 'neq':
      return actual !== expected;
    case 'gt':
      return compareNumeric(actual, expected, (a, b) => a > b);
    case 'gte':
      return compareNumeric(actual, expected, (a, b) => a >= b);
    case 'lt':
      return compareNumeric(actual, expected, (a, b) => a < b);
    case 'lte':
      return compareNumeric(actual, expected, (a, b) => a <= b);
    case 'in':
      return Array.isArray(expected) && expected.includes(actual);
    case 'nin':
      return Array.isArray(expected) && !expected.includes(actual);
    case 'contains':
      return (
        typeof actual === 'string' &&
        typeof expected === 'string' &&
        actual.toLowerCase().includes(expected.toLowerCase())
      );
    default:
      return false;
  }
}

function compareNumeric(
  actual: unknown,
  expected: unknown,
  compare: (a: number, b: number) => boolean,
): boolean {
  const left = toComparableNumber(actual);
  const right = toComparableNumber(expected);

  return left !== null && right !== null && compare(left, right);
}

function toComparableNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === 'string') {
    const asNumber = Number(value);
    return Number.isFinite(asNumber) ? asNumber : null;
  }
  return null;
}

/**
 * Validates and parses a stored `conditionsJson` value. Invalid JSON in a rule
 * row is a configuration error, so it surfaces as a 400 on the write path and is
 * rejected before the row is saved.
 */
export function parseConditionSet(json: string): ConditionSet {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new BadRequestException('conditionsJson is not valid JSON.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new BadRequestException('conditionsJson must be an object.');
  }

  const record = parsed as Record<string, unknown>;
  const set: ConditionSet = {};

  for (const key of ['all', 'any'] as const) {
    const group = record[key];
    if (group === undefined) {
      continue;
    }
    if (!Array.isArray(group)) {
      throw new BadRequestException(`conditionsJson.${key} must be an array.`);
    }
    set[key] = group.map((entry, index) => parseCondition(entry, `${key}[${index}]`));
  }

  if (!set.all?.length && !set.any?.length) {
    throw new BadRequestException('conditionsJson must define at least one condition.');
  }

  return set;
}

const OPERATORS: ComparisonOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'nin',
  'contains',
];

function parseCondition(entry: unknown, path: string): Condition {
  if (typeof entry !== 'object' || entry === null) {
    throw new BadRequestException(`conditionsJson.${path} must be an object.`);
  }

  const record = entry as Record<string, unknown>;

  if (typeof record.field !== 'string' || record.field.length === 0) {
    throw new BadRequestException(`conditionsJson.${path}.field must be a non-empty string.`);
  }
  if (!OPERATORS.includes(record.op as ComparisonOperator)) {
    throw new BadRequestException(
      `conditionsJson.${path}.op must be one of: ${OPERATORS.join(', ')}.`,
    );
  }

  return { field: record.field, op: record.op as ComparisonOperator, value: record.value };
}
