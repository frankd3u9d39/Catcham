import { request } from '../api/client';
import { receiptStorage } from '../utils/storage';
import type {
  Jurisdiction,
  NearbyOffice,
  PublicReportStatus,
  ReportCategory,
  SubmissionReceipt,
  SubmitReportInput,
} from '../types';

/**
 * The citizen-facing API surface. Every call here is unauthenticated, matching
 * the /public and /geo endpoints, so the app works without an account.
 */
export const reportingService = {
  categories(): Promise<ReportCategory[]> {
    return request<ReportCategory[]>('/public/reports/categories');
  },

  states(): Promise<Jurisdiction[]> {
    return request<Jurisdiction[]>('/geo/jurisdictions', { query: { level: 'STATE' } });
  },

  lgas(stateCode: string): Promise<Jurisdiction[]> {
    return request<Jurisdiction[]>('/geo/jurisdictions', {
      query: { level: 'LGA', parentCode: stateCode },
    });
  },

  resolveLocation(latitude: number, longitude: number) {
    return request<{
      state?: { code: string; name: string };
      lga?: { code: string; name: string };
    }>('/geo/resolve', { query: { latitude, longitude } });
  },

  nearbyOffices(latitude: number, longitude: number, radiusKm = 50): Promise<NearbyOffice[]> {
    return request<NearbyOffice[]>('/geo/offices/nearby', {
      query: { latitude, longitude, radiusKm },
    });
  },

  /**
   * Submits the report and, when it is anonymous, stores the one-time tracking
   * code on the device. The server keeps only a hash, so if this write is lost
   * the report can no longer be tracked.
   */
  async submit(input: SubmitReportInput): Promise<SubmissionReceipt> {
    const receipt = await request<SubmissionReceipt>('/public/reports', {
      method: 'POST',
      body: input,
    });

    await receiptStorage.add({
      referenceNumber: receipt.referenceNumber,
      trackingCode: receipt.trackingCode ?? null,
      title: input.title,
      submittedAt: receipt.submittedAt,
    });

    return receipt;
  },

  track(referenceNumber: string, trackingCode: string): Promise<PublicReportStatus> {
    return request<PublicReportStatus>('/public/reports/track', {
      method: 'POST',
      body: {
        referenceNumber: referenceNumber.trim().toUpperCase(),
        trackingCode: trackingCode.trim().toUpperCase(),
      },
    });
  },
};
