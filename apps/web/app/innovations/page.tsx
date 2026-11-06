'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Pagination } from '@/components/ui/pagination';
import { useReportCategories, useReports } from '@/hooks/use-reports';
import { useJurisdictions } from '@/hooks/use-platform';
import { DEFAULT_REPORT_CATEGORIES, DEFAULT_STATES } from '@/lib/reference-data';
import { formatRelative, humanise, priorityBadge, statusBadge } from '@/lib/format';

export default function InnovationsPage() {
  return (
    <RequireAuth permissions={['report:read']}>
      <AppShell breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Innovations' }]}>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-brand-600 mb-4">
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
        <Suspense fallback={<LoadingState message="Loading submitted innovations" />}>
          <InnovationQueue />
        </Suspense>
      </AppShell>
    </RequireAuth>
  );
}

function InnovationQueue() {
  const searchParams = useSearchParams();

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

  function update(patch: Partial<typeof filters>) {
    setFilters((current) => ({ ...current, ...patch, page: patch.page ?? 1 }));
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Submitted Innovations</h1>
        <p className="text-xs text-neutral-500 mt-1">
          All citizen-submitted incident reports and innovations routed to your agencies.
        </p>
      </div>

      <Card className="mb-5">
        <CardContent className="p-4 space-y-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              update({ search: searchDraft, page: 1 });
            }}
          >
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-neutral-700">Search innovations</label>
              <input
                type="text"
                className="flex h-11 sm:h-10 w-full rounded-md border border-neutral-200 bg-neutral-white px-3 py-2 text-base sm:text-sm ring-offset-neutral-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.currentTarget.value)}
                placeholder="Search by reference number, title, or category..."
              />
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
                Search
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {query.isError ? (
        <ErrorState error={new Error('Unable to load submitted innovations. Please try again later.')} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">State</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {query.data?.items.map((report) => (
                  <tr key={report.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <Link href={`/innovations/${report.id}`}>
                        <span className="font-mono text-[11px] font-bold text-neutral-500">
                          {report.referenceNumber}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top">
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
                    </td>
                    <td className="px-4 py-3 align-top">
                      {report.categoryName}
                      {report.isAnonymous && <span className="text-indigo-600"> · Anonymous</span>}
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
                    <td className="px-4 py-3 align-top text-right text-xs text-neutral-500 whitespace-nowrap">
                      {formatRelative(report.createdAt)}
                    </td>
                  </tr>
                ))}
                {query.data?.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                      No submitted innovations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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