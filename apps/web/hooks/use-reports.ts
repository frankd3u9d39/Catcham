'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { DEFAULT_REPORT_CATEGORIES } from '@/lib/reference-data';
import type {
  Page,
  Priority,
  ReportCategory,
  ReportDetail,
  ReportListItem,
} from '@/lib/types';

export interface ReportFilters {
  page?: number;
  pageSize?: number;
  status?: string;
  priority?: Priority;
  categoryId?: string;
  stateCode?: string;
  search?: string;
}

export function useReports(filters: ReportFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => api.get<Page<ReportListItem>>('/reports', { ...filters }),
    // The triage queue changes as other officers work it.
    staleTime: 15_000,
    enabled,
  });
}

export function useReport(id: string | undefined) {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => api.get<ReportDetail>(`/reports/${id}`),
    enabled: Boolean(id),
  });
}

export function useReportCategories() {
  return useQuery({
    queryKey: ['report-categories'],
    queryFn: async () => {
      try {
        const remote = await api.public<ReportCategory[]>('/public/reports/categories');
        if (Array.isArray(remote) && remote.length > 0) {
          return remote;
        }
      } catch {
        // Fallback to embedded reference categories if remote endpoint is offline/unreachable
      }
      return DEFAULT_REPORT_CATEGORIES;
    },
    // Reference data; it only changes when an administrator edits it.
    staleTime: 60 * 60 * 1000,
    initialData: DEFAULT_REPORT_CATEGORIES,
  });
}

export function useTriageReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      id: string;
      priority: Priority;
      agencyId?: string;
      note?: string;
    }) => api.post<ReportDetail>(`/reports/${input.id}/triage`, input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
      void queryClient.invalidateQueries({ queryKey: ['report', variables.id] });
    },
  });
}

export function useRejectReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; reason: string }) =>
      api.post<ReportDetail>(`/reports/${input.id}/reject`, { reason: input.reason }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
      void queryClient.invalidateQueries({ queryKey: ['report', variables.id] });
    },
  });
}
