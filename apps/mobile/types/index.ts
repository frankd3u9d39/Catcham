/** Shapes returned by the API. Mirrors the DTOs in apps/api. */

export interface ReportCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  severity: string;
}

export interface Jurisdiction {
  code: string;
  name: string;
  level: 'FEDERAL' | 'STATE' | 'LGA';
  parentCode: string | null;
  centroidLat: number;
  centroidLng: number;
}

export interface SubmitReportInput {
  title: string;
  description: string;
  categoryId: string;
  isAnonymous: boolean;
  contactEmail?: string;
  contactPhone?: string;
  stateCode?: string;
  lgaCode?: string;
  addressText?: string;
  latitude?: number;
  longitude?: number;
  occurredAt?: string;
}

export interface SubmissionReceipt {
  referenceNumber: string;
  /** Returned once, at submission. Anonymous submitters need it to track the report. */
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

/** A receipt kept on the device so the submitter can find it again. */
export interface SavedReceipt {
  referenceNumber: string;
  trackingCode: string | null;
  title: string;
  submittedAt: string;
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
  profile: AuthenticatedUser;
}

export interface NearbyOffice {
  id: string;
  name: string;
  agencyName: string;
  agencyAcronym: string;
  stateCode: string;
  address: string | null;
  distanceKm: number;
}
