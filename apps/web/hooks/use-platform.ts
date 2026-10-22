'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { getDefaultJurisdictions } from '@/lib/reference-data';
import type {
  AgencyNode,
  AgencyWorkload,
  AuditRecord,
  BusinessRule,
  Jurisdiction,
  OverviewMetrics,
  Page,
  UserSummary,
  WorkflowSummary,
} from '@/lib/types';

const REFERENCE_STALE_TIME = 60 * 60 * 1000;

export function useOverviewMetrics() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: () => api.get<OverviewMetrics>('/analytics/overview'),
    staleTime: 60_000,
  });
}

export function useAgencyWorkload() {
  return useQuery({
    queryKey: ['analytics', 'agency-workload'],
    queryFn: () => api.get<AgencyWorkload[]>('/analytics/agency-workload'),
    staleTime: 60_000,
  });
}

export function useReportVolume(days = 30) {
  return useQuery({
    queryKey: ['analytics', 'report-volume', days],
    queryFn: () => api.get<Array<{ date: string; count: number }>>('/analytics/report-volume', { days }),
    staleTime: 5 * 60_000,
  });
}

export function useCategoryBreakdown() {
  return useQuery({
    queryKey: ['analytics', 'category-breakdown'],
    queryFn: () =>
      api.get<Array<{ categoryId: string; code: string; name: string; count: number }>>(
        '/analytics/category-breakdown',
      ),
    staleTime: 5 * 60_000,
  });
}

export function useOverdueCases(enabled = true) {
  return useQuery({
    queryKey: ['analytics', 'overdue'],
    queryFn: () =>
      api.get<
        Array<{
          id: string;
          caseNumber: string;
          title: string;
          agency: string;
          priority: string;
          status: string;
          dueAt: string | null;
          daysOverdue: number;
        }>
      >('/analytics/overdue'),
    staleTime: 60_000,
    enabled,
  });
}

export function useAuditLog(filters: {
  page?: number;
  pageSize?: number;
  resource?: string;
  resourceId?: string;
  action?: string;
  actorId?: string;
}) {
  return useQuery({
    queryKey: ['audit', filters],
    queryFn: () => api.get<Page<AuditRecord>>('/audit', { ...filters }),
  });
}

export function useAgencyTree(category?: string) {
  return useQuery({
    queryKey: ['organizations', 'tree', category],
    queryFn: () => api.get<AgencyNode[]>('/organizations/tree', { category }),
    staleTime: 5 * 60_000,
  });
}

export function useAgencies() {
  return useQuery({
    queryKey: ['organizations', 'agencies'],
    queryFn: () =>
      api.get<
        Array<{
          id: string;
          code: string;
          name: string;
          acronym: string;
          category: string;
          jurisdictionScope: string;
        }>
      >('/organizations/agencies'),
    staleTime: REFERENCE_STALE_TIME,
  });
}

export function useJurisdictions(level?: 'FEDERAL' | 'STATE' | 'LGA', parentCode?: string) {
  return useQuery({
    queryKey: ['jurisdictions', level, parentCode],
    queryFn: async () => {
      try {
        const remote = await api.public<Jurisdiction[]>(buildJurisdictionPath(level, parentCode));
        if (Array.isArray(remote) && remote.length > 0) {
          return remote;
        }
      } catch {
        // Fallback to authoritative reference states and LGAs if remote endpoint is offline
      }
      return getDefaultJurisdictions(level, parentCode);
    },
    staleTime: REFERENCE_STALE_TIME,
    initialData: () => getDefaultJurisdictions(level, parentCode),
  });
}

function buildJurisdictionPath(level?: string, parentCode?: string): string {
  const params = new URLSearchParams();
  if (level) {
    params.set('level', level);
  }
  if (parentCode) {
    params.set('parentCode', parentCode);
  }

  const query = params.toString();
  return `/geo/jurisdictions${query ? `?${query}` : ''}`;
}

export function useUsers(filters: { page?: number; pageSize?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => api.get<Page<UserSummary>>('/users', { ...filters }),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () =>
      api.get<
        Array<{
          id: string;
          code: string;
          name: string;
          description: string | null;
          permissions: Array<{ permission: { slug: string } }>;
        }>
      >('/users/roles'),
    staleTime: REFERENCE_STALE_TIME,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      email: string;
      fullName: string;
      password: string;
      phoneNumber?: string;
    }) => api.post<UserSummary>('/users', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useGrantMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { userId: string; agencyId: string; roleId: string }) =>
      api.post<UserSummary>(`/users/${input.userId}/memberships`, {
        agencyId: input.agencyId,
        roleId: input.roleId,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useBusinessRules(category?: string) {
  return useQuery({
    queryKey: ['rules', category],
    queryFn: () => api.get<BusinessRule[]>('/rules', { category }),
  });
}

export function useRuleMetadata() {
  return useQuery({
    queryKey: ['rules', 'metadata'],
    queryFn: () => api.get<{ categories: string[]; actions: string[] }>('/rules/metadata'),
    staleTime: REFERENCE_STALE_TIME,
  });
}

export function useCreateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      name: string;
      category: string;
      conditionsJson: string;
      action: string;
      actionParams?: Record<string, unknown>;
      priority?: number;
    }) => api.post<BusinessRule>('/rules', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });
}

export function useToggleRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; isEnabled: boolean }) =>
      api.patch<BusinessRule>(`/rules/${input.id}`, { isEnabled: input.isEnabled }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });
}

export function useSimulateRule() {
  return useMutation({
    mutationFn: (input: { category: string; facts: Record<string, unknown> }) =>
      api.post<Array<{ ruleId: string; ruleName: string; action: string; params: unknown }>>(
        '/rules/simulate',
        input,
      ),
  });
}

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: () => api.get<WorkflowSummary[]>('/workflows'),
    staleTime: 5 * 60_000,
  });
}

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: () =>
      api.get<
        Page<{
          id: string;
          channel: string;
          subject: string;
          body: string;
          readAt: string | null;
          createdAt: string;
        }>
      >('/notifications', { unreadOnly }),
    refetchInterval: 60_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.get<{ count: number }>('/notifications/unread-count'),
    refetchInterval: 60_000,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<{ updated: number }>('/notifications/read-all'),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
