/**
 * Select options for the status and priority filters. These mirror the
 * constants in apps/api/src/common/constants.ts; the API rejects anything else,
 * so the two lists must stay in step.
 */

import { humanise } from './format';

function toOptions(values: readonly string[], allLabel: string) {
  return [
    { value: '', label: allLabel },
    ...values.map((value) => ({ value, label: humanise(value) })),
  ];
}

export const REPORT_STATUSES = [
  'SUBMITTED',
  'TRIAGED',
  'ROUTED',
  'UNDER_INVESTIGATION',
  'RESOLVED',
  'REJECTED',
  'CLOSED',
] as const;

export const INVESTIGATION_STATUSES = [
  'INITIATED',
  'EVIDENCE_COLLECTION',
  'EVIDENCE_REVIEW',
  'SUPERVISOR_REVIEW',
  'REFERRED',
  'CLOSED',
] as const;

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as const;

export const ASSIGNMENT_ROLES = ['LEAD', 'ASSISTANT', 'SPECIALIST'] as const;

export const ESCALATION_LEVELS = ['SUPERVISOR', 'AGENCY_HEAD', 'INTER_AGENCY'] as const;

export const EVIDENCE_CLASSIFICATIONS = [
  'PUBLIC',
  'INTERNAL',
  'CONFIDENTIAL',
  'RESTRICTED',
] as const;

export const AGENCY_CATEGORIES = [
  'LAW_ENFORCEMENT',
  'REGULATORY',
  'EMERGENCY',
  'ENERGY',
  'CIVIL_AUTHORITY',
  'PRIVATE_PARTNER',
] as const;

export const REPORT_STATUS_OPTIONS = toOptions(REPORT_STATUSES, 'All statuses');
export const INVESTIGATION_STATUS_OPTIONS = toOptions(INVESTIGATION_STATUSES, 'All statuses');
export const PRIORITY_OPTIONS = toOptions(PRIORITIES, 'All priorities');
export const AGENCY_CATEGORY_OPTIONS = toOptions(AGENCY_CATEGORIES, 'All categories');

/** Without a blank first entry, for forms where a value is required. */
export const PRIORITY_CHOICES = PRIORITIES.map((value) => ({ value, label: humanise(value) }));
export const ASSIGNMENT_ROLE_CHOICES = ASSIGNMENT_ROLES.map((value) => ({
  value,
  label: humanise(value),
}));
export const ESCALATION_LEVEL_CHOICES = ESCALATION_LEVELS.map((value) => ({
  value,
  label: humanise(value),
}));
export const CLASSIFICATION_CHOICES = EVIDENCE_CLASSIFICATIONS.map((value) => ({
  value,
  label: humanise(value),
}));
