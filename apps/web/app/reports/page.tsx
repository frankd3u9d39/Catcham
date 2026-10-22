'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FileText, Paperclip, Search } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Pagination } from '@/components/ui/pagination';
import { useReportCategories, useReports } from '@/hooks/use-reports';
import { useJurisdictions } from '@/hooks/use-platform';
import { DEFAULT_REPORT_CATEGORIES, DEFAULT_STATES } from '@/lib/reference-data';
import { formatRelative, humanise, priorityBadge, statusBadge } from '@/lib/format';
import { REPORT_STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/options';

export default function ReportsPage() {
  return (
    <RequireAuth permissions={['report:read']}>
      <AppShell breadcrumbs={[{ label: 'Reports' }]}>
        {/* ReportQueue reads useSearchParams, which opts its subtree out of
            prerendering, so it sits behind a Suspense boundary. */}
        <Suspense fallback={<LoadingState message="Loading reports" />}>
          <ReportQueue />
        </Suspense>
      </AppShell>
    </RequireAuth>
  );
}

function ReportQueue() {
  const searchParams = useSearchParams();

  // The topbar search and the dashboard links both land here with query params,
  // so those seed the initial filter state.
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    status: searchParams.get('status') ?? '',
    priority: searchParams.get('priority') ?? '',
    categoryId: '',
    stateCode: '',
    search: searchParams.get('search') ?? '',
  });
  const [searchDraft, setSearchDraft] = useState(filters.search);

  const { data: rawCategories = [] } = useReportCategories();
  const { data: rawStates = [] } = useJurisdictions('STATE');
  const categories = rawCategories.length > 0 ? rawCategories : DEFAULT_REPORT_CATEGORIES;
  const states = rawStates.length > 0 ? rawStates : DEFAULT_STATES;

  const query = useReports({
    page: filters.page,
    pageSize: filters.pageSize,
    status: filters.status || undefined,
    priority: (filters.priority || undefined) as never,
    categoryId: filters.categoryId || undefined,
    stateCode: filters.stateCode || undefined,
    search: filters.search || undefined,
  });

  /** Any filter change resets to page 1, otherwise the view can land out of range. */
  function update(patch: Partial<typeof filters>) {
    setFilters((current) => ({ ...current, ...patch, page: patch.page ?? 1 }));
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Reports</h1>
        <p className="text-xs text-neutral-500 mt-1">
          {query.data
            ? `${query.data.total} report${query.data.total === 1 ? '' : 's'} match the current filters`
            : 'Incoming reports across every category and jurisdiction'}
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
            <label className="sr-only" htmlFor="report-search">
              Search reports
            </label>
            <div className="flex items-center gap-2 px-3 h-10 rounded-md border border-neutral-200 bg-neutral-white focus-within:ring-2 focus-within:ring-brand-600">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                id="report-search"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Reference number, title or description"
                className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchDraft('');
                    update({ search: '' });
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-900 shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              label="Status"
              value={filters.status}
              onChange={(event) => update({ status: event.target.value })}
              options={REPORT_STATUS_OPTIONS}
            />
            <Select
              label="Priority"
              value={filters.priority}
              onChange={(event) => update({ priority: event.target.value })}
              options={PRIORITY_OPTIONS}
            />
            <Select
              label="Category"
              value={filters.categoryId}
              onChange={(event) => update({ categoryId: event.target.value })}
              options={[
                { value: '', label: 'All categories' },
                ...categories.map((category) => ({ value: category.id, label: category.name })),
              ]}
            />
            <Select
              label="State"
              value={filters.stateCode}
              onChange={(event) => update({ stateCode: event.target.value })}
              options={[
                { value: '', label: 'All states' },
                ...states.map((state) => ({ value: state.code, label: state.name })),
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {query.isLoading ? (
        <LoadingState message="Loading reports" />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.data?.items.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8 text-neutral-400" />}
          title="No reports match these filters"
          description="Widen the filters, or clear the search term, to see more of the queue."
        />
      ) : (
        <>
          {/* Table on wide screens, cards on narrow ones: a 7-column table is
              unreadable on a phone. */}
          <Card className="hidden lg:block overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-left">
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    Reference
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    Report
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    Priority
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    Location
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    Received
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {query.data?.items.map((report) => (
                  <tr key={report.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <Link
                        href={`/reports/${report.id}`}
                        className="font-mono text-xs font-bold text-brand-700 hover:underline"
                      >
                        {report.referenceNumber}
                      </Link>
                      {report.caseNumber && (
                        <p className="mt-1 font-mono text-[10px] text-neutral-400">
                          {report.caseNumber}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top max-w-sm">
                      <Link
                        href={`/reports/${report.id}`}
                        className="font-medium text-neutral-900 hover:underline line-clamp-2"
                      >
                        {report.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-neutral-500 flex items-center gap-2">
                        {report.categoryName}
                        {report.isAnonymous && <span className="text-indigo-600">Anonymous</span>}
                        {report.evidenceCount > 0 && (
                          <span className="inline-flex items-center gap-0.5">
                            <Paperclip className="w-3 h-3" />
                            {report.evidenceCount}
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Badge status={priorityBadge(report.priority)}>{report.priority}</Badge>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Badge status={statusBadge(report.status)} showIcon={false}>
                        {humanise(report.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-neutral-600">
                      {report.stateCode ?? '—'}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-neutral-500 whitespace-nowrap">
                      {formatRelative(report.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <ul className="lg:hidden space-y-3">
            {query.data?.items.map((report) => (
              <li key={report.id}>
                <Link href={`/reports/${report.id}`}>
                  <Card className="hover:border-neutral-300 transition-colors">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-neutral-500">
                          {report.referenceNumber}
                        </span>
                        <Badge status={priorityBadge(report.priority)}>{report.priority}</Badge>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900">{report.title}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge status={statusBadge(report.status)} showIcon={false}>
                          {humanise(report.status)}
                        </Badge>
                        {report.isAnonymous && (
                          <Badge status="confidential" showIcon={false}>
                            Anonymous
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">
                        {report.categoryName}
                        {report.stateCode && ` · ${report.stateCode}`} ·{' '}
                        {formatRelative(report.createdAt)}
                      </p>
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
