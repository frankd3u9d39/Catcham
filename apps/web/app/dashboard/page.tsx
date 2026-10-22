'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  CheckSquare,
  Clock,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useAuth } from '@/providers/auth-provider';
import { useInvestigations, useWorkload } from '@/hooks/use-investigations';
import { useReports } from '@/hooks/use-reports';
import { useOverdueCases } from '@/hooks/use-platform';
import { useSearchParams } from 'next/navigation';
import { CitizenSidebar } from '@/components/layout/citizen-sidebar';
import { CitizenDashboardView } from '@/components/portal/citizen-dashboard-view';
import {
  formatRelative,
  humanise,
  isOverdue,
  priorityBadge,
  statusBadge,
} from '@/lib/format';

export default function DashboardPage() {
  return (
    <React.Suspense fallback={<LoadingState message="Loading dashboard..." />}>
      <DashboardContainer />
    </React.Suspense>
  );
}

function DashboardContainer() {
  const { user, can } = useAuth();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get('tab');

  const [viewMode, setViewMode] = React.useState<'citizen' | 'officer' | null>(null);
  const [activeTab, setActiveTab] = React.useState(urlTab || 'overview');
  const [complaintCount, setComplaintCount] = React.useState(0);

  React.useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const isOfficer =
    can('report:read') ||
    can('investigation:read') ||
    can('analytics:read') ||
    (user?.roleCodes && user.roleCodes.length > 0);

  // If user has no officer permissions, they are a Citizen.
  // If user is an officer, default to 'officer' unless they toggle 'citizen' mode.
  const currentMode = viewMode ?? (isOfficer ? 'officer' : 'citizen');

  if (currentMode === 'citizen') {
    return (
      <RequireAuth>
        <AppShell
          breadcrumbs={[{ label: 'Citizen Portal' }, { label: humanise(activeTab) }]}
          customSidebar={
            <CitizenSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              complaintCount={complaintCount}
              isOfficer={Boolean(isOfficer)}
              onToggleOfficerMode={() =>
                setViewMode(currentMode === 'citizen' ? 'officer' : 'citizen')
              }
            />
          }
        >
          {isOfficer && (
            <div className="mb-5 bg-emerald-950/80 border border-emerald-500/30 rounded-xl p-3 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-white shadow-sm">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  <strong>Officer Simulation Mode:</strong> You are previewing the citizen complainant dashboard.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('officer')}
                className="text-xs font-bold text-emerald-300 hover:text-white underline self-start sm:self-auto cursor-pointer"
              >
                Return to Agency Command View &rarr;
              </button>
            </div>
          )}
          <CitizenDashboardView
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onComplaintCountChange={setComplaintCount}
          />
        </AppShell>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Agency Dashboard' }]}>
        <div className="mb-4 bg-slate-900 border border-slate-700/80 rounded-xl p-3 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-white shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-200">
              Agency Command Portal ({user?.roleCodes.map(humanise).join(', ') || 'Officer'})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setViewMode('citizen')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline self-start sm:self-auto flex items-center gap-1 cursor-pointer"
          >
            <span>Switch to Citizen Complainant View</span>
            <span>&rarr;</span>
          </button>
        </div>
        <Dashboard />
      </AppShell>
    </RequireAuth>
  );
}

function Dashboard() {
  const { user, can } = useAuth();

  // Only fetch what the caller is allowed to read. Without these gates an
  // intake officer, who has no case access, would see permission errors on a
  // screen that is supposed to be their starting point.
  const canReadCases = can('investigation:read');
  const canReadReports = can('report:read');
  const canReadAnalytics = can('analytics:read');

  const workload = useWorkload(canReadCases);
  const overdue = useOverdueCases(canReadAnalytics);
  const myCases = useInvestigations({ assignedToMe: true, pageSize: 5 }, canReadCases);
  const supervising = useInvestigations({ pageSize: 5 }, canReadCases);
  const queue = useReports({ status: 'SUBMITTED', pageSize: 5 }, canReadReports);

  const cases = myCases.data?.total ? myCases : supervising;

  if (canReadCases && workload.isLoading) {
    return <LoadingState message="Loading your workload" />;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 truncate">
            {greeting()}, {user?.fullName.split(' ')[0] ?? 'there'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {user?.roleCodes.map(humanise).join(', ') || 'No role assigned'}
            {user && user.agencyIds.length > 0
              ? ` · ${user.agencyIds.length} agency membership${user.agencyIds.length === 1 ? '' : 's'}`
              : ''}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {canReadReports && (
            <Link href="/reports">
              <Button variant="outline" size="sm">
                Report queue
              </Button>
            </Link>
          )}
          {canReadCases && (
            <Link href="/investigations">
              <Button variant="primary" size="sm">
                All cases
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Workload counts are all case-derived, so they are meaningless without
          case access and the tiles are omitted rather than shown as zeroes. */}
      {canReadCases && (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
        <StatTile
          label="Assigned to me"
          value={workload.data?.assigned ?? 0}
          hint="Open cases"
          icon={<Briefcase className="w-5 h-5" />}
          tone="brand"
        />
        <StatTile
          label="Supervising"
          value={workload.data?.supervising ?? 0}
          hint="Cases you own"
          icon={<ShieldCheck className="w-5 h-5" />}
          tone="brand"
        />
        <StatTile
          label="Due within 24h"
          value={workload.data?.dueWithin24h ?? 0}
          hint="On your cases"
          icon={<Clock className="w-5 h-5" />}
          tone={workload.data?.dueWithin24h ? 'amber' : 'neutral'}
        />
        <StatTile
          label="Open tasks"
          value={workload.data?.openTasks ?? 0}
          hint="Assigned to you"
          icon={<CheckSquare className="w-5 h-5" />}
          tone={workload.data?.openTasks ? 'amber' : 'neutral'}
        />
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-2 space-y-5">
          {canReadCases && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">
                {myCases.data?.total ? 'Your cases' : 'Cases in your agencies'}
              </CardTitle>
              <Link
                href="/investigations"
                className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1 shrink-0"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {cases.isLoading ? (
                <LoadingState message="Loading cases" />
              ) : cases.error ? (
                <ErrorState error={cases.error} onRetry={() => void cases.refetch()} className="m-4" />
              ) : cases.data?.items.length === 0 ? (
                <EmptyState
                  className="border-0 bg-transparent"
                  icon={<Briefcase className="w-7 h-7 text-neutral-400" />}
                  title="No open cases"
                  description="Cases appear here once a supervisor opens one from a report in your agency."
                />
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {cases.data?.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/investigations/${item.id}`}
                        className="flex items-center justify-between gap-4 p-4 hover:bg-neutral-50/80 transition-colors"
                      >
                        <div className="min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-neutral-900">
                              {item.caseNumber}
                            </span>
                            <Badge status={priorityBadge(item.priority)}>{item.priority}</Badge>
                            <Badge status={statusBadge(item.status)} showIcon={false}>
                              {humanise(item.status)}
                            </Badge>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {item.agencyName}
                            {item.openTasks > 0 && ` · ${item.openTasks} open task${item.openTasks === 1 ? '' : 's'}`}
                            {item.dueAt && (
                              <span className={isOverdue(item.dueAt) ? 'text-red-600 font-medium' : ''}>
                                {' '}· due {formatRelative(item.dueAt)}
                              </span>
                            )}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          )}

          {canReadReports && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold">Awaiting triage</CardTitle>
                <Link
                  href="/reports?status=SUBMITTED"
                  className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1 shrink-0"
                >
                  Open queue
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {queue.isLoading ? (
                  <LoadingState message="Loading the queue" />
                ) : queue.data?.items.length === 0 ? (
                  <EmptyState
                    className="border-0 bg-transparent"
                    icon={<Inbox className="w-7 h-7 text-neutral-400" />}
                    title="The queue is clear"
                    description="Every submitted report has been triaged."
                  />
                ) : (
                  <ul className="divide-y divide-neutral-100">
                    {queue.data?.items.map((report) => (
                      <li key={report.id}>
                        <Link
                          href={`/reports/${report.id}`}
                          className="flex items-center justify-between gap-4 p-4 hover:bg-neutral-50/80 transition-colors"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-neutral-500">
                                {report.referenceNumber}
                              </span>
                              <Badge status={priorityBadge(report.priority)}>
                                {report.priority}
                              </Badge>
                              {report.isAnonymous && (
                                <Badge status="confidential" showIcon={false}>
                                  Anonymous
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {report.title}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {report.categoryName} · {formatRelative(report.createdAt)}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-300 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {canReadAnalytics && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Past due</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {overdue.isLoading ? (
                <LoadingState message="Checking due dates" />
              ) : overdue.data?.length === 0 ? (
                <div className="flex flex-col items-center text-center py-7">
                  <ShieldCheck className="w-7 h-7 text-brand-500 mb-3" />
                  <p className="text-sm font-medium text-neutral-900">Nothing overdue</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Every open case in your agencies is within its due date.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {overdue.data?.slice(0, 6).map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/investigations/${item.id}`}
                        className="block p-3 rounded-lg border border-red-200 bg-red-50/60 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-bold text-neutral-600 truncate">
                            {item.caseNumber}
                          </span>
                          <span className="text-[10px] font-semibold text-red-700 shrink-0">
                            {item.daysOverdue}d late
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-neutral-900 line-clamp-2">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-500">
                          {item.agency} · {humanise(item.status)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </>
  );
}

function StatTile({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  tone: 'brand' | 'amber' | 'neutral';
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    amber: 'bg-amber-50 text-amber-600',
    neutral: 'bg-neutral-100 text-neutral-400',
  } as const;

  return (
    <Card>
      <CardContent className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">{value}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{hint}</p>
        </div>
        <div className={`p-2.5 rounded-lg shrink-0 ${tones[tone]}`}>{icon}</div>
      </CardContent>
    </Card>
  );
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  return hour < 17 ? 'Good afternoon' : 'Good evening';
}

