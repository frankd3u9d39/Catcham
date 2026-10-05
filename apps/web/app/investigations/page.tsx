'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Paperclip, Search, User } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Pagination } from '@/components/ui/pagination';
import { useInvestigations } from '@/hooks/use-investigations';
import { useAgencies } from '@/hooks/use-platform';
import { useAuth } from '@/providers/auth-provider';
import { formatRelative, humanise, isOverdue, priorityBadge, statusBadge } from '@/lib/format';
import { INVESTIGATION_STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/options';

export default function InvestigationsPage() {
  return (
    <RequireAuth permissions={['investigation:read']}>
      <AppShell breadcrumbs={[{ label: 'Investigations' }]}>
        <CaseList />
      </AppShell>
    </RequireAuth>
  );
}

function CaseList() {
  const { user } = useAuth();
  const { data: agencies = [] } = useAgencies();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    status: '',
    priority: '',
    agencyId: '',
    assignedToMe: false,
    search: '',
  });
  const [searchDraft, setSearchDraft] = useState('');

  const query = useInvestigations({
    page: filters.page,
    pageSize: filters.pageSize,
    status: filters.status || undefined,
    priority: (filters.priority || undefined) as never,
    agencyId: filters.agencyId || undefined,
    assignedToMe: filters.assignedToMe || undefined,
    search: filters.search || undefined,
  });

  const myAgencies = agencies.filter((agency) => user?.agencyIds.includes(agency.id));

  function update(patch: Partial<typeof filters>) {
    setFilters((current) => ({ ...current, ...patch, page: patch.page ?? 1 }));
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Investigations</h1>
        <p className="text-xs text-neutral-500 mt-1">
          {query.data
            ? `${query.data.total} case${query.data.total === 1 ? '' : 's'} in your agencies`
            : 'Cases are scoped to the agencies you are a member of'}
        </p>
      </div>

      <Card className="mb-5">
        <CardContent className="p-4 space-y-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              update({ search: searchDraft.trim() });
            }}
          >
            <label className="sr-only" htmlFor="case-search">
              Search cases
            </label>
            <div className="flex items-center gap-2 px-3 h-10 rounded-md border border-neutral-200 bg-neutral-white focus-within:ring-2 focus-within:ring-brand-600">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                id="case-search"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Case number or report title"
                className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Status"
              value={filters.status}
              onChange={(event) => update({ status: event.target.value })}
              options={INVESTIGATION_STATUS_OPTIONS}
            />
            <Select
              label="Priority"
              value={filters.priority}
              onChange={(event) => update({ priority: event.target.value })}
              options={PRIORITY_OPTIONS}
            />
            <Select
              label="Agency"
              value={filters.agencyId}
              onChange={(event) => update({ agencyId: event.target.value })}
              options={[
                { value: '', label: 'All my agencies' },
                ...myAgencies.map((agency) => ({ value: agency.id, label: agency.acronym })),
              ]}
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={filters.assignedToMe}
              onChange={(event) => update({ assignedToMe: event.target.checked })}
              className="accent-brand-600 w-4 h-4"
            />
            <span className="text-sm text-neutral-700">Only cases assigned to me</span>
          </label>
        </CardContent>
      </Card>

      {query.isLoading ? (
        <LoadingState message="Loading cases" />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.data?.items.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8 text-neutral-400" />}
          title="No cases match these filters"
          description="Cases are created from reports. A supervisor opens one from the report detail screen."
        />
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {query.data?.items.map((item) => (
              <li key={item.id}>
                <Link href={`/investigations/${item.id}`} className="block h-full">
                  <Card className="h-full hover:border-neutral-300 transition-colors">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-neutral-500">
                          {item.caseNumber}
                        </span>
                        <Badge status={priorityBadge(item.priority)}>{item.priority}</Badge>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-neutral-900 line-clamp-2 flex-1">
                        {item.title}
                      </p>

                      <div className="mt-3">
                        <Badge status={statusBadge(item.status)} showIcon={false}>
                          {humanise(item.status)}
                        </Badge>
                      </div>

                      <dl className="mt-3 pt-3 border-t border-neutral-100 space-y-1.5 text-[11px] text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 shrink-0" />
                          <dt className="sr-only">Lead investigator</dt>
                          <dd className="truncate">
                            {item.leadInvestigator ?? 'No lead assigned'}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{item.agencyName}</span>
                          {item.evidenceCount > 0 && (
                            <span className="inline-flex items-center gap-0.5 shrink-0">
                              <Paperclip className="w-3 h-3" />
                              {item.evidenceCount}
                            </span>
                          )}
                        </div>
                        {item.dueAt && (
                          <div
                            className={
                              isOverdue(item.dueAt) ? 'text-red-600 font-medium' : undefined
                            }
                          >
                            Due {formatRelative(item.dueAt)}
                            {item.openTasks > 0 && ` · ${item.openTasks} open task${item.openTasks === 1 ? '' : 's'}`}
                          </div>
                        )}
                      </dl>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>

          {query.data && (
            <Pagination
              page={query.data.page}
              totalPages={query.data.totalPages}
              total={query.data.total}
              onPageChange={(page) => update({ page })}
            />
          )}
        </>
      )}
    </>
  );
}
