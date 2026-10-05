'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Briefcase, Clock, EyeOff, Mail, MapPin, Paperclip, Phone } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState, InlineError } from '@/components/ui/error-state';
import { Timeline } from '@/components/business/timeline';
import { EvidenceList } from '@/components/evidence/evidence-list';
import { useRejectReport, useReport, useTriageReport } from '@/hooks/use-reports';
import { useOpenInvestigation } from '@/hooks/use-investigations';
import { useAgencies, useUsers } from '@/hooks/use-platform';
import { useAuth } from '@/providers/auth-provider';
import { formatDateTime, humanise, priorityBadge, statusBadge } from '@/lib/format';
import { PRIORITY_CHOICES } from '@/lib/options';
import type { Priority } from '@/lib/types';

export default function ReportDetailPage() {
  return (
    <RequireAuth permissions={['report:read']}>
      <ReportDetail />
    </RequireAuth>
  );
}

function ReportDetail() {
  const params = useParams<{ id: string }>();
  const query = useReport(params.id);
  const { can } = useAuth();

  if (query.isLoading) {
    return (
      <AppShell breadcrumbs={[{ label: 'Reports', href: '/reports' }, { label: 'Loading' }]}>
        <LoadingState message="Loading the report" />
      </AppShell>
    );
  }

  if (query.error || !query.data) {
    return (
      <AppShell breadcrumbs={[{ label: 'Reports', href: '/reports' }, { label: 'Error' }]}>
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      </AppShell>
    );
  }

  const report = query.data;
  const isActionable = !['REJECTED', 'CLOSED'].includes(report.status);

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Reports', href: '/reports' },
        { label: report.referenceNumber },
      ]}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-neutral-500">
              {report.referenceNumber}
            </span>
            <Badge status={priorityBadge(report.priority)}>{report.priority}</Badge>
            <Badge status={statusBadge(report.status)} showIcon={false}>
              {humanise(report.status)}
            </Badge>
            {report.isAnonymous && (
              <Badge status="confidential">
                <EyeOff className="w-3 h-3" />
                Anonymous
              </Badge>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-950">{report.title}</h1>
          <p className="mt-1 text-xs text-neutral-500">
            {report.category.name} · received {formatDateTime(report.createdAt)}
          </p>
        </div>

        {isActionable && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {can('report:triage') && <TriageAction report={report} />}
            {can('investigation:create') && report.investigations.length === 0 && (
              <OpenCaseAction reportId={report.id} defaultPriority={report.priority} />
            )}
            {can('report:reject') && report.investigations.length === 0 && (
              <RejectAction reportId={report.id} />
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">What was reported</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {report.description}
              </p>
            </CardContent>
          </Card>

          {report.investigations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Cases opened</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-neutral-100">
                  {report.investigations.map((investigation) => (
                    <li key={investigation.id}>
                      <Link
                        href={`/investigations/${investigation.id}`}
                        className="flex items-center justify-between gap-3 p-4 hover:bg-neutral-50/80 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-bold text-brand-700">
                            {investigation.caseNumber}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {investigation.agency.name}
                          </p>
                        </div>
                        <Badge status={statusBadge(investigation.status)} showIcon={false}>
                          {humanise(investigation.status)}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {can('evidence:read') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-neutral-400" />
                  Attached evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EvidenceList reportId={report.id} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-sm">
              <Detail
                icon={<MapPin className="w-3.5 h-3.5" />}
                label="Location"
                value={
                  [report.stateCode, report.lgaCode].filter(Boolean).join(' · ') || 'Not given'
                }
                sub={report.addressText ?? undefined}
              />
              {report.latitude !== null && report.longitude !== null && (
                <Detail
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Coordinates"
                  value={`${report.latitude}, ${report.longitude}`}
                  sub="Submitted from a device location"
                />
              )}
              <Detail
                icon={<Clock className="w-3.5 h-3.5" />}
                label="Incident occurred"
                value={report.occurredAt ? formatDateTime(report.occurredAt) : 'Not stated'}
              />
              {report.isAnonymous ? (
                <Detail
                  icon={<EyeOff className="w-3.5 h-3.5" />}
                  label="Submitter"
                  value="Anonymous"
                  sub="No contact details were stored for this report."
                />
              ) : (
                <>
                  {report.contactEmail && (
                    <Detail
                      icon={<Mail className="w-3.5 h-3.5" />}
                      label="Email"
                      value={report.contactEmail}
                    />
                  )}
                  {report.contactPhone && (
                    <Detail
                      icon={<Phone className="w-3.5 h-3.5" />}
                      label="Phone"
                      value={report.contactPhone}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                entries={report.timeline.map((entry) => ({
                  id: entry.id,
                  title: humanise(entry.action),
                  description: entry.description,
                  at: entry.createdAt,
                  actor: humanise(entry.actorType),
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Detail({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex gap-2.5">
      <span className="text-neutral-400 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          {label}
        </p>
        <p className="text-sm text-neutral-800 break-words">{value}</p>
        {sub && <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function TriageAction({
  report,
}: {
  report: { id: string; priority: Priority };
}) {
  const [open, setOpen] = useState(false);
  const [priority, setPriority] = useState<Priority>(report.priority);
  const [note, setNote] = useState('');
  const triage = useTriageReport();

  async function submit() {
    await triage.mutateAsync({ id: report.id, priority, note: note.trim() || undefined });
    setOpen(false);
    setNote('');
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Triage
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Triage this report"
        description="Set the priority an agency should work it at. The decision is recorded on the report timeline and in the activity log."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" isLoading={triage.isPending} onClick={() => void submit()}>
              Save triage
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
            options={PRIORITY_CHOICES}
          />
          <Textarea
            label="Note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Why this priority, and anything the assigned agency should know."
          />
          <InlineError error={triage.error} />
        </div>
      </Dialog>
    </>
  );
}

function OpenCaseAction({
  reportId,
  defaultPriority,
}: {
  reportId: string;
  defaultPriority: Priority;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [agencyId, setAgencyId] = useState('');
  const [supervisorId, setSupervisorId] = useState(user?.id ?? '');
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [dueAt, setDueAt] = useState('');

  const { data: agencies = [] } = useAgencies();
  const { data: users } = useUsers({ pageSize: 100 });
  const openCase = useOpenInvestigation();

  // A case can only be opened in an agency the caller belongs to, and the
  // supervisor must be a member of it, so both lists are scoped accordingly.
  const myAgencies = agencies.filter((agency) => user?.agencyIds.includes(agency.id));
  const candidates = (users?.items ?? []).filter((candidate) =>
    candidate.memberships.some((membership) => membership.agencyId === agencyId),
  );

  async function submit() {
    const created = await openCase.mutateAsync({
      reportId,
      agencyId,
      supervisorId,
      priority,
      dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
    });
    setOpen(false);
    router.push(`/investigations/${created.id}`);
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <Briefcase className="w-3.5 h-3.5" />
        Open a case
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Open an investigation"
        description="This creates a case from the report and moves the report to under investigation."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={openCase.isPending}
              disabled={agencyId.length === 0 || supervisorId.length === 0}
              onClick={() => void submit()}
            >
              Open case
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Owning agency"
            required
            value={agencyId}
            onChange={(event) => {
              setAgencyId(event.target.value);
              setSupervisorId('');
            }}
            options={[
              { value: '', label: 'Select an agency' },
              ...myAgencies.map((agency) => ({
                value: agency.id,
                label: `${agency.acronym} — ${agency.name}`,
              })),
            ]}
          />
          <Select
            label="Supervisor"
            required
            disabled={agencyId.length === 0}
            value={supervisorId}
            onChange={(event) => setSupervisorId(event.target.value)}
            options={[
              {
                value: '',
                label:
                  agencyId.length === 0
                    ? 'Select an agency first'
                    : candidates.length === 0
                      ? 'No members found in this agency'
                      : 'Select a supervisor',
              },
              ...candidates.map((candidate) => ({
                value: candidate.id,
                label: `${candidate.fullName} (${candidate.memberships.find((m) => m.agencyId === agencyId)?.roleName ?? 'member'})`,
              })),
            ]}
          />
          <Select
            label="Priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
            options={PRIORITY_CHOICES}
          />
          <div>
            <label
              htmlFor="case-due"
              className="block text-sm font-medium text-neutral-700 mb-1.5"
            >
              Target completion date
            </label>
            <input
              id="case-due"
              type="date"
              value={dueAt}
              onChange={(event) => setDueAt(event.target.value)}
              className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Optional. Cases past this date appear on the overdue list.
            </p>
          </div>
          <InlineError error={openCase.error} />
        </div>
      </Dialog>
    </>
  );
}

function RejectAction({ reportId }: { reportId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const reject = useRejectReport();

  async function submit() {
    await reject.mutateAsync({ id: reportId, reason: reason.trim() });
    setOpen(false);
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Reject
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Reject this report"
        description="Rejection is recorded permanently on the report timeline and in the activity log. A report with an open case cannot be rejected."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={reject.isPending}
              disabled={reason.trim().length < 10}
              onClick={() => void submit()}
            >
              Reject report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Textarea
            label="Reason"
            required
            rows={4}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain why this report cannot be acted on."
            helperText={`At least 10 characters. ${reason.trim().length} so far.`}
          />
          <InlineError error={reject.error} />
        </div>
      </Dialog>
    </>
  );
}
