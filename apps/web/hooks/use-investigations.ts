'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { CaseDetail, CaseListItem, Page, Priority, Workload } from '@/lib/types';

export interface CaseFilters {
  page?: number;
  pageSize?: number;
  status?: string;
  priority?: Priority;
  agencyId?: string;
  assignedToMe?: boolean;
  search?: string;
}

export function useInvestigations(filters: CaseFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['investigations', filters],
    queryFn: () => api.get<Page<CaseListItem>>('/investigations', { ...filters }),
    staleTime: 15_000,
    enabled,
  });
}

export function useInvestigation(id: string | undefined) {
  return useQuery({
    queryKey: ['investigation', id],
    queryFn: () => api.get<CaseDetail>(`/investigations/${id}`),
    enabled: Boolean(id),
  });
}

export function useWorkload(enabled = true) {
  return useQuery({
    queryKey: ['workload'],
    queryFn: () => api.get<Workload>('/investigations/my-workload'),
    staleTime: 30_000,
    enabled,
  });
}

/** Invalidates both the case and the list, since a write changes its row too. */
function useCaseMutation<TInput extends { id: string }, TResult>(
  mutationFn: (input: TInput) => Promise<TResult>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['investigation', variables.id] });
      void queryClient.invalidateQueries({ queryKey: ['investigations'] });
      void queryClient.invalidateQueries({ queryKey: ['workload'] });
    },
  });
}

export function useOpenInvestigation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      reportId: string;
      agencyId: string;
      supervisorId: string;
      priority?: Priority;
      dueAt?: string;
    }) => api.post<{ id: string; caseNumber: string }>('/investigations', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['investigations'] });
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useTransitionCase() {
  return useCaseMutation((input: { id: string; toState: string; note?: string }) =>
    api.post<CaseDetail>(`/investigations/${input.id}/transition`, {
      toState: input.toState,
      note: input.note,
    }),
  );
}

export function useCloseCase() {
  return useCaseMutation((input: { id: string; reason: string }) =>
    api.post<CaseDetail>(`/investigations/${input.id}/close`, { reason: input.reason }),
  );
}

export function useAssignInvestigator() {
  return useCaseMutation((input: { id: string; investigatorId: string; role: string }) =>
    api.post(`/investigations/${input.id}/assignments`, {
      investigatorId: input.investigatorId,
      role: input.role,
    }),
  );
}

export function useUnassignInvestigator() {
  return useCaseMutation((input: { id: string; assignmentId: string }) =>
    api.delete(`/investigations/${input.id}/assignments/${input.assignmentId}`),
  );
}

export function useCreateTask() {
  return useCaseMutation(
    (input: {
      id: string;
      title: string;
      description?: string;
      assignedToId?: string;
      dueAt?: string;
    }) =>
      api.post(`/investigations/${input.id}/tasks`, {
        title: input.title,
        description: input.description,
        assignedToId: input.assignedToId,
        dueAt: input.dueAt,
      }),
  );
}

export function useUpdateTask() {
  return useCaseMutation(
    (input: { id: string; taskId: string; status?: string; assignedToId?: string }) =>
      api.patch(`/investigations/${input.id}/tasks/${input.taskId}`, {
        status: input.status,
        assignedToId: input.assignedToId,
      }),
  );
}

export function useAddNote() {
  return useCaseMutation((input: { id: string; content: string; isConfidential?: boolean }) =>
    api.post(`/investigations/${input.id}/notes`, {
      content: input.content,
      isConfidential: input.isConfidential ?? false,
    }),
  );
}

export function useEscalateCase() {
  return useCaseMutation(
    (input: { id: string; escalatedToId: string; level: string; reason: string }) =>
      api.post(`/investigations/${input.id}/escalations`, {
        escalatedToId: input.escalatedToId,
        level: input.level,
        reason: input.reason,
      }),
  );
}
