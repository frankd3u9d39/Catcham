'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, apiRequest } from '@/lib/api-client';
import type { CustodyTrail, EvidenceSummary, Page } from '@/lib/types';

export function useEvidenceList(filters: {
  reportId?: string;
  investigationId?: string;
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const enabled = Boolean(filters.reportId ?? filters.investigationId);

  return useQuery({
    queryKey: ['evidence', filters],
    queryFn: () => api.get<Page<EvidenceSummary>>('/evidence', { ...filters }),
    enabled,
  });
}

export function useCustodyTrail(evidenceId: string | undefined) {
  return useQuery({
    queryKey: ['custody', evidenceId],
    queryFn: () => api.get<CustodyTrail>(`/evidence/${evidenceId}/custody`),
    enabled: Boolean(evidenceId),
  });
}

export function useIntegrityCheck(evidenceId: string | undefined) {
  return useQuery({
    queryKey: ['evidence-integrity', evidenceId],
    queryFn: () =>
      api.get<{
        fileIntact: boolean;
        storedHash: string;
        currentHash: string | null;
      }>(`/evidence/${evidenceId}/integrity`),
    enabled: Boolean(evidenceId),
    // Re-hashing reads the whole file, so this is only fetched on demand.
    staleTime: Infinity,
  });
}

export function useUploadEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      file: File;
      reportId?: string;
      investigationId?: string;
      classification?: string;
    }) => {
      const form = new FormData();
      form.append('file', input.file);

      if (input.reportId) {
        form.append('reportId', input.reportId);
      }
      if (input.investigationId) {
        form.append('investigationId', input.investigationId);
      }
      if (input.classification) {
        form.append('classification', input.classification);
      }

      return apiRequest<EvidenceSummary>('/evidence', { method: 'POST', body: form });
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['evidence'] });
      if (variables.investigationId) {
        void queryClient.invalidateQueries({
          queryKey: ['investigation', variables.investigationId],
        });
      }
      if (variables.reportId) {
        void queryClient.invalidateQueries({ queryKey: ['report', variables.reportId] });
      }
    },
  });
}

export function useTransferCustody() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { evidenceId: string; transferredToId: string; reason: string }) =>
      api.post(`/evidence/${input.evidenceId}/custody/transfer`, {
        transferredToId: input.transferredToId,
        reason: input.reason,
      }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['custody', variables.evidenceId] });
    },
  });
}

export function useAnnotateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { evidenceId: string; text: string }) =>
      api.post(`/evidence/${input.evidenceId}/annotations`, { text: input.text }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['custody', variables.evidenceId] });
      void queryClient.invalidateQueries({ queryKey: ['evidence'] });
    },
  });
}

