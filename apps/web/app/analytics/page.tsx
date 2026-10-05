'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, HardDrive, Timer } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import {
  useAgencyWorkload,
  useCategoryBreakdown,
  useOverdueCases,
  useOverviewMetrics,
  useReportVolume,
} from '@/hooks/use-platform';
import { formatBytes, formatDate, humanise, priorityBadge } from '@/lib/format';

export default function AnalyticsPage() {
  return (
    <RequireAuth permissions={['analytics:read']}>
      <AppShell breadcrumbs={[{ label: 'Analytics' }]}>
        <Analytics />
      </AppShell>
    </RequireAuth>
  );
}

function Analytics() {
  const overview = useOverviewMetrics();
  const workload = useAgencyWorkload();
  const volume = useReportVolume(30);
  const categories = useCategoryBreakdown();
  const overdue = useOverdueCases();

  if (overview.isLoading) {
    return <LoadingState message="Calculating metrics" />;
  }

  if (overview.error || !overview.data) {
    return <ErrorState error={overview.error} onRetry={() => void overview.refetch()} />;
  }

  const metrics = overview.data;
  const resolution = metrics.resolution;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Analytics</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Counts are platform-wide. The overdue list is scoped to your agencies.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Metric
          label="Reports"
          value={metrics.reports.total.toLocaleString()}
          hint={`${metrics.reports.last30Days} in the last 30 days`}
        />
        <Metric
          label="Open cases"
          value={metrics.investigations.open.toLocaleString()}
          hint={`${metrics.investigations.closed} closed`}
        />
        <Metric
          label="Median resolution"
          value={resolution.medianDays !== null ? `${resolution.medianDays}d` : '—'}
          hint={
            resolution.closedSample > 0
              ? `${resolution.closedSample} closed case${resolution.closedSample === 1 ? '' : 's'}`
              : 'No cases closed yet'
          }
          icon={<Timer className="w-4 h-4" />}
        />
        <Metric
          label="Evidence stored"
          value={formatBytes(metrics.evidence.totalBytes)}
          hint={`${metrics.evidence.total} file${metrics.evidence.total === 1 ? '' : 's'}, ${metrics.evidence.archived} archived`}
          icon={<HardDrive className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Reports per day</CardTitle>
          </CardHeader>
          <CardContent>
            {volume.isLoading ? (
              <LoadingState message="Loading volume" />
            ) : (
              <VolumeChart data={volume.data ?? []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">By category</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.isLoading ? (
              <LoadingState message="Loading categories" />
            ) : categories.data?.length === 0 ? (
              <p className="text-sm text-neutral-500">No reports yet.</p>
            ) : (
              <BarList
                items={(categories.data ?? []).map((row) => ({
                  label: row.name,
                  value: row.count,
                }))}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Workload by agency</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {workload.isLoading ? (
              <LoadingState message="Loading workload" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-y border-neutral-200 text-left">
                      <th scope="col" className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                        Agency
                      </th>
                      <th scope="col" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 text-right">
                        Open
                      </th>
                      <th scope="col" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 text-right">
                        Closed
                      </th>
                      <th scope="col" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 text-right">
                        Overdue
                      </th>
                      <th scope="col" className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 text-right">
                        Staff
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {workload.data?.map((agency) => (
                      <tr key={agency.agencyId}>
                        <td className="px-4 py-2.5">
                          <span className="font-semibold text-neutral-900">
                            {agency.acronym}
                          </span>
                          <span className="block text-[11px] text-neutral-500 truncate max-w-[220px]">
                            {agency.agencyName}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {agency.openCases}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-neutral-500">
                          {agency.closedCases}
                        </td>
                        <td
                          className={`px-3 py-2.5 text-right tabular-nums ${
                            agency.overdueCases > 0 ? 'text-red-600 font-semibold' : 'text-neutral-400'
                          }`}
                        >
                          {agency.overdueCases}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-neutral-500">
                          {agency.personnel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Past due in your agencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdue.isLoading ? (
              <LoadingState message="Checking due dates" />
            ) : overdue.data?.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Every open case in your agencies is within its due date.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {overdue.data?.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/investigations/${item.id}`}
                      className="block p-3 rounded-lg border border-red-200 bg-red-50/60 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-neutral-600">
                          {item.caseNumber}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge status={priorityBadge(item.priority)}>{item.priority}</Badge>
                          <span className="text-[11px] font-semibold text-red-700">
                            {item.daysOverdue}d
                          </span>
                        </div>
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-neutral-900 line-clamp-2">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {item.agency} · {humanise(item.status)} · was due{' '}
                        {formatDate(item.dueAt)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            {label}
          </p>
          {icon && <span className="text-neutral-300 shrink-0">{icon}</span>}
        </div>
        <p className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1.5 tabular-nums">
          {value}
        </p>
        <p className="text-[11px] text-neutral-500 mt-0.5">{hint}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Inline bar chart drawn with divs rather than a charting dependency: the shape
 * is a single series of daily counts, which does not justify the bundle cost.
 */
function VolumeChart({ data }: { data: Array<{ date: string; count: number }> }) {
  if (data.length === 0) {
    return <p className="text-sm text-neutral-500">No data for this window.</p>;
  }

  const peak = Math.max(1, ...data.map((point) => point.count));
  const total = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <figure>
      <div className="flex items-end gap-px h-32" role="img" aria-label={`${total} reports over ${data.length} days`}>
        {data.map((point) => (
          <div
            key={point.date}
            className="flex-1 bg-brand-200 hover:bg-brand-400 rounded-t transition-colors min-h-[2px]"
            style={{ height: `${Math.max(2, (point.count / peak) * 100)}%` }}
            title={`${point.date}: ${point.count} report${point.count === 1 ? '' : 's'}`}
          />
        ))}
      </div>
      <figcaption className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
        <span>{data[0]?.date}</span>
        <span className="text-neutral-600 font-medium">
          {total} total · peak {peak}/day
        </span>
        <span>{data[data.length - 1]?.date}</span>
      </figcaption>
    </figure>
  );
}

function BarList({ items }: { items: Array<{ label: string; value: number }> }) {
  const peak = Math.max(1, ...items.map((item) => item.value));

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-neutral-700 truncate">{item.label}</span>
            <span className="text-neutral-500 tabular-nums shrink-0">{item.value}</span>
          </div>
          <div className="mt-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full"
              style={{ width: `${(item.value / peak) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
