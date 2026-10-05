'use client';

import React, { useState } from 'react';
import { Building2, ChevronDown, ChevronRight, MapPin, Users } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useAgencyTree } from '@/hooks/use-platform';
import { humanise } from '@/lib/format';
import { AGENCY_CATEGORY_OPTIONS } from '@/lib/options';
import { api } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export default function OrganizationsPage() {
  return (
    <RequireAuth permissions={['organization:read']}>
      <AppShell breadcrumbs={[{ label: 'Organizations' }]}>
        <Organizations />
      </AppShell>
    </RequireAuth>
  );
}

function Organizations() {
  const [category, setCategory] = useState('');
  const query = useAgencyTree(category || undefined);
  const routing = useRoutingRules();

  if (query.isLoading) {
    return <LoadingState message="Loading the agency hierarchy" />;
  }

  if (query.error) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />;
  }

  const agencies = query.data ?? [];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Organizations</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Agencies, their departments and offices, plus which report categories route to
          each one.
        </p>
      </div>

      <Card className="mb-5">
        <CardContent className="p-4 max-w-xs">
          <Select
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            options={AGENCY_CATEGORY_OPTIONS}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-2">
          {agencies.length === 0 ? (
            <EmptyState
              icon={<Building2 className="w-8 h-8 text-neutral-400" />}
              title="No agencies in this category"
              description="Clear the filter to see every agency on the platform."
            />
          ) : (
            <ul className="space-y-3">
              {agencies.map((agency) => (
                <li key={agency.id}>
                  <AgencyNode agency={agency} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Routing rules</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {routing.isLoading ? (
                <LoadingState message="Loading routing" />
              ) : routing.data?.length === 0 ? (
                <p className="px-6 pb-5 text-sm text-neutral-500">No routing rules defined.</p>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {routing.data?.map((rule) => (
                    <li key={rule.id} className="p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-neutral-900 truncate">
                          {rule.category.name}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                          p{rule.priority}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-600">
                        → {rule.agency.acronym}
                        {rule.jurisdictionCode && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                            {rule.jurisdictionCode} only
                          </span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <p className="px-3.5 py-3 border-t border-neutral-100 text-[11px] text-neutral-500 leading-relaxed">
                Rules are evaluated highest priority first, and a jurisdiction-scoped rule
                beats a national one for the same category.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function AgencyNode({
  agency,
}: {
  agency: {
    id: string;
    code: string;
    name: string;
    acronym: string;
    category: string;
    jurisdictionScope: string;
    personnel: number;
    openCases: number;
    departments: Array<{ id: string; name: string; code: string; offices: number }>;
  };
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-neutral-50/70 transition-colors rounded-xl"
      >
        <span className="mt-0.5 text-neutral-400 shrink-0">
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-neutral-950">{agency.acronym}</span>
            <Badge status="neutral" showIcon={false}>
              {humanise(agency.category)}
            </Badge>
            <Badge status="info" showIcon={false}>
              {humanise(agency.jurisdictionScope)}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-neutral-600">{agency.name}</p>
          <p className="mt-1.5 text-[11px] text-neutral-400 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3" />
              {agency.personnel} staff
            </span>
            <span>{agency.openCases} case{agency.openCases === 1 ? '' : 's'}</span>
            <span>
              {agency.departments.length} department
              {agency.departments.length === 1 ? '' : 's'}
            </span>
          </p>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pl-11">
          {agency.departments.length === 0 ? (
            <p className="text-xs text-neutral-500">No departments recorded.</p>
          ) : (
            <ul className="space-y-1.5">
              {agency.departments.map((department) => (
                <li
                  key={department.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/60"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-neutral-900 truncate">
                      {department.name}
                    </p>
                    <p className="font-mono text-[10px] text-neutral-400">{department.code}</p>
                  </div>
                  <span className="text-[11px] text-neutral-500 inline-flex items-center gap-1 shrink-0">
                    <MapPin className="w-3 h-3" />
                    {department.offices} office{department.offices === 1 ? '' : 's'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}

function useRoutingRules() {
  return useQuery({
    queryKey: ['routing-rules'],
    queryFn: () =>
      api.get<
        Array<{
          id: string;
          priority: number;
          jurisdictionCode: string | null;
          agency: { name: string; acronym: string };
          category: { code: string; name: string };
        }>
      >('/organizations/routing-rules'),
    staleTime: 5 * 60_000,
  });
}
