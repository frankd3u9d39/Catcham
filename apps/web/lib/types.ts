/** Shapes returned by the API. Kept in step with the DTOs in apps/api. */

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  agencyIds: string[];
  roleCodes: string[];
  permissions: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResponse {
  tokens: TokenPair;
  profile: AuthenticatedUser & {
    memberships: Array<{ agencyId: string; agencyName: string; roleCode: string }>;
  };
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ReportCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  severity: string;
}

export interface ReportListItem {
  id: string;
  referenceNumber: string;
  title: string;
  categoryName: string;
  categoryCode: string;
  status: string;
  priority: Priority;
  isAnonymous: boolean;
  stateCode: string | null;
  lgaCode: string | null;
  evidenceCount: number;
  createdAt: string;
  caseNumber: string | null;
}

export interface TimelineEntry {
  id: string;
  action: string;
  description: string;
  actorType: string;
  actorId: string | null;
  createdAt: string;
}

export interface ReportDetail {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  status: string;
  priority: Priority;
  isAnonymous: boolean;
  contactEmail: string | null;
  contactPhone: string | null;
  stateCode: string | null;
  lgaCode: string | null;
  addressText: string | null;
  latitude: number | null;
  longitude: number | null;
  occurredAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: ReportCategory;
  timeline: TimelineEntry[];
  investigations: Array<{
    id: string;
    caseNumber: string;
    status: string;
    agencyId: string;
    agency: { name: string; acronym: string };
  }>;
  evidence: EvidenceSummary[];
}

export interface SubmissionReceipt {
  referenceNumber: string;
  trackingCode?: string;
  status: string;
  routedTo: string | null;
  submittedAt: string;
}

export interface PublicReportStatus {
  referenceNumber: string;
  title: string;
  categoryName: string;
  status: string;
  submittedAt: string;
  updatedAt: string;
  timeline: Array<{ action: string; description: string; at: string }>;
}

export interface CaseListItem {
  id: string;
  caseNumber: string;
  title: string;
  agencyName: string;
  priority: Priority;
  status: string;
  dueAt: string | null;
  openTasks: number;
  evidenceCount: number;
  leadInvestigator: string | null;
  createdAt: string;
}

export interface TransitionOption {
  to: string;
  label?: string;
  permissions?: string[];
}

export interface CaseDetail {
  id: string;
  caseNumber: string;
  priority: Priority;
  status: string;
  dueAt: string | null;
  closedAt: string | null;
  closedReason: string | null;
  createdAt: string;
  supervisorId: string;
  agency: { id: string; name: string; acronym: string; category: string };
  report: ReportDetail;
  assignments: Array<{
    id: string;
    role: string;
    assignedAt: string;
    investigator: { id: string; fullName: string; email: string };
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    dueAt: string | null;
    completedAt: string | null;
    assignedToId: string | null;
  }>;
  notes: Array<{
    id: string;
    content: string;
    authorId: string;
    isConfidential: boolean;
    createdAt: string;
  }>;
  escalations: Array<{
    id: string;
    level: string;
    reason: string;
    raisedById: string;
    escalatedToId: string;
    resolvedAt: string | null;
    createdAt: string;
  }>;
  evidence: EvidenceSummary[];
  workflow: {
    currentState: string;
    isTerminal: boolean;
    available: TransitionOption[];
  };
  transitions: Array<{
    id: string;
    fromState: string;
    toState: string;
    actorId: string;
    note: string | null;
    createdAt: string;
  }>;
}

export interface EvidenceSummary {
  id: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  classification: string;
  createdAt: string;
}

export type ChainVerdict =
  | { valid: true; length: number }
  | { valid: false; length: number; brokenAtSequence: number; detail: string };

export interface CustodyTrail {
  entries: Array<{
    sequence: number;
    action: string;
    reason: string;
    performedBy: { id: string; fullName: string; email: string } | null;
    transferredTo: { id: string; fullName: string; email: string } | null;
    ipAddress: string | null;
    entryHash: string;
    createdAt: string;
  }>;
  integrity: ChainVerdict;
}

export interface AuditRecord {
  id: string;
  actorId: string | null;
  actorLabel: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface OverviewMetrics {
  reports: { total: number; last30Days: number; byStatus: Record<string, number> };
  investigations: { open: number; closed: number; byPriority: Record<string, number> };
  evidence: { total: number; archived: number; totalBytes: number };
  resolution: { medianDays: number | null; meanDays: number | null; closedSample: number };
}

export interface AgencyWorkload {
  agencyId: string;
  agencyName: string;
  acronym: string;
  openCases: number;
  closedCases: number;
  overdueCases: number;
  personnel: number;
}

export interface Workload {
  assigned: number;
  supervising: number;
  dueWithin24h: number;
  openTasks: number;
}

export interface Jurisdiction {
  code: string;
  name: string;
  level: 'FEDERAL' | 'STATE' | 'LGA';
  parentCode: string | null;
  centroidLat: number;
  centroidLng: number;
}

export interface AgencyNode {
  id: string;
  code: string;
  name: string;
  acronym: string;
  category: string;
  jurisdictionScope: string;
  personnel: number;
  openCases: number;
  departments: Array<{ id: string; name: string; code: string; offices: number }>;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  status: string;
  isMfaEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  memberships: Array<{
    agencyId: string;
    agencyName: string;
    roleCode: string;
    roleName: string;
  }>;
}

export interface BusinessRule {
  id: string;
  name: string;
  category: string;
  conditionsJson: string;
  action: string;
  actionParams: string | null;
  priority: number;
  isEnabled: boolean;
  createdAt: string;
}

export interface WorkflowSummary {
  id: string;
  name: string;
  version: number;
  initialState: string;
  isActive: boolean;
  states: string[];
  createdAt: string;
}
