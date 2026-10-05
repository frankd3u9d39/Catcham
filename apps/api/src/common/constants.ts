/**
 * Allowed values for the TEXT columns that stand in for enums under SQLite.
 * Validation DTOs and the clients both read from here, so adding a value is a
 * single-place change.
 */

export const ACCOUNT_STATUSES = [
  'ACTIVE',
  'SUSPENDED',
  'DEACTIVATED',
  'PENDING_VERIFICATION',
] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const AGENCY_CATEGORIES = [
  'LAW_ENFORCEMENT',
  'REGULATORY',
  'EMERGENCY',
  'ENERGY',
  'CIVIL_AUTHORITY',
  'PRIVATE_PARTNER',
] as const;
export type AgencyCategory = (typeof AGENCY_CATEGORIES)[number];

export const JURISDICTION_LEVELS = ['FEDERAL', 'STATE', 'LGA'] as const;
export type JurisdictionLevel = (typeof JURISDICTION_LEVELS)[number];

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const REPORT_STATUSES = [
  'SUBMITTED',
  'TRIAGED',
  'ROUTED',
  'UNDER_INVESTIGATION',
  'RESOLVED',
  'REJECTED',
  'CLOSED',
] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const INVESTIGATION_STATUSES = [
  'INITIATED',
  'EVIDENCE_COLLECTION',
  'EVIDENCE_REVIEW',
  'SUPERVISOR_REVIEW',
  'REFERRED',
  'CLOSED',
] as const;
export type InvestigationStatus = (typeof INVESTIGATION_STATUSES)[number];

export const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const ASSIGNMENT_ROLES = ['LEAD', 'ASSISTANT', 'SPECIALIST'] as const;
export type AssignmentRole = (typeof ASSIGNMENT_ROLES)[number];

export const ESCALATION_LEVELS = ['SUPERVISOR', 'AGENCY_HEAD', 'INTER_AGENCY'] as const;
export type EscalationLevel = (typeof ESCALATION_LEVELS)[number];

export const EVIDENCE_CLASSIFICATIONS = [
  'PUBLIC',
  'INTERNAL',
  'CONFIDENTIAL',
  'RESTRICTED',
] as const;
export type EvidenceClassification = (typeof EVIDENCE_CLASSIFICATIONS)[number];

export const CUSTODY_ACTIONS = [
  'INTAKE',
  'VIEWED',
  'DOWNLOADED',
  'TRANSFERRED',
  'ANNOTATED',
  'ARCHIVED',
] as const;
export type CustodyAction = (typeof CUSTODY_ACTIONS)[number];

export const NOTIFICATION_CHANNELS = ['EMAIL', 'IN_APP'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_STATUSES = ['PENDING', 'SENT', 'FAILED'] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export const ACTOR_TYPES = ['CITIZEN', 'ANONYMOUS', 'OFFICER', 'SYSTEM'] as const;
export type ActorType = (typeof ACTOR_TYPES)[number];

/** Permission slugs, in `resource:action` form. Seeded into the permissions table. */
export const PERMISSIONS = {
  REPORT_READ: 'report:read',
  REPORT_TRIAGE: 'report:triage',
  REPORT_REJECT: 'report:reject',
  INVESTIGATION_READ: 'investigation:read',
  INVESTIGATION_CREATE: 'investigation:create',
  INVESTIGATION_ASSIGN: 'investigation:assign',
  INVESTIGATION_TRANSITION: 'investigation:transition',
  INVESTIGATION_CLOSE: 'investigation:close',
  INVESTIGATION_ESCALATE: 'investigation:escalate',
  EVIDENCE_READ: 'evidence:read',
  EVIDENCE_UPLOAD: 'evidence:upload',
  EVIDENCE_DOWNLOAD: 'evidence:download',
  EVIDENCE_TRANSFER: 'evidence:transfer',
  AUDIT_READ: 'audit:read',
  ANALYTICS_READ: 'analytics:read',
  ORGANIZATION_READ: 'organization:read',
  ORGANIZATION_MANAGE: 'organization:manage',
  USER_READ: 'user:read',
  USER_MANAGE: 'user:manage',
  RULE_MANAGE: 'rule:manage',
  WORKFLOW_MANAGE: 'workflow:manage',
} as const;
export type PermissionSlug = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_CODES = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  AGENCY_ADMIN: 'AGENCY_ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  INVESTIGATOR: 'INVESTIGATOR',
  INTAKE_OFFICER: 'INTAKE_OFFICER',
  AUDITOR: 'AUDITOR',
  CITIZEN: 'CITIZEN',
} as const;
export type RoleCode = (typeof ROLE_CODES)[keyof typeof ROLE_CODES];

export const CASE_WORKFLOW_NAME = 'investigation-default';
