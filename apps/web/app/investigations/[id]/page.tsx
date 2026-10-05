'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowUpRight,
  CheckSquare,
  Clock,
  Lock,
  Plus,
  Square,
  UserPlus,
  X,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState, InlineError } from '@/components/ui/error-state';
import { Timeline } from '@/components/business/timeline';
import { WorkflowStepper } from '@/components/business/workflow-stepper';
import { EvidenceList } from '@/components/evidence/evidence-list';
import {
  useAddNote,
  useAssignInvestigator,
  useCloseCase,
  useCreateTask,
  useEscalateCase,
  useInvestigation,
  useTransitionCase,
  useUnassignInvestigator,
  useUpdateTask,
} from '@/hooks/use-investigations';
import { useUsers } from '@/hooks/use-platform';
import { useAuth } from '@/providers/auth-provider';
import {
  formatDate,
  formatDateTime,
  formatRelative,
  humanise,
  isOverdue,
  priorityBadge,
  statusBadge,
} from '@/lib/format';
import { ASSIGNMENT_ROLE_CHOICES, ESCALATION_LEVEL_CHOICES } from '@/lib/options';
import type { CaseDetail } from '@/lib/types';

export default function CaseDetailPage() {
  return (
    <RequireAuth permissions={['investigation:read']}>
      <CaseDetailView />
    </RequireAuth>
  );
}

function CaseDetailView() {
  const params = useParams<{ id: string }>();
  const query = useInvestigation(params.id);
  const { can } = useAuth();

  if (query.isLoading) {
    return (
      <AppShell
        breadcrumbs={[{ label: 'Investigations', href: '/investigations' }, { label: 'Loading' }]}
      >
        <LoadingState message="Loading the case" />
      </AppShell>
    );
  }

  if (query.error || !query.data) {
    return (
      <AppShell
        breadcrumbs={[{ label: 'Investigations', href: '/investigations' }, { label: 'Error' }]}
      >
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      </AppShell>
    );
  }

  const caseDetail = query.data;
  const isClosed = caseDetail.status === 'CLOSED';

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Investigations', href: '/investigations' },
        { label: caseDetail.caseNumber },
      ]}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-neutral-500">
              {caseDetail.caseNumber}
            </span>
            <Badge status={priorityBadge(caseDetail.priority)}>{caseDetail.priority}</Badge>
            <Badge status={statusBadge(caseDetail.status)} showIcon={false}>
              {humanise(caseDetail.status)}
            </Badge>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-950">
            {caseDetail.report.title}
          </h1>
          <p className="mt-1 text-xs text-neutral-500">
            {caseDetail.agency.name} · opened {formatDate(caseDetail.createdAt)}
            {caseDetail.dueAt && (
              <span className={isOverdue(caseDetail.dueAt) && !isClosed ? 'text-red-600 font-medium' : ''}>
                {' '}· due {formatRelative(caseDetail.dueAt)}
              </span>
            )}
            {' · '}
            <Link
              href={`/reports/${caseDetail.report.id}`}
              className="text-brand-600 hover:underline"
            >
              {caseDetail.report.referenceNumber}
            </Link>
          </p>
        </div>

        {!isClosed && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {caseDetail.workflow.available.map((transition) => (
              <TransitionAction
                key={transition.to}
                caseId={caseDetail.id}
                to={transition.to}
                label={transition.label ?? `Move to ${humanise(transition.to)}`}
                isClose={transition.to === 'CLOSED'}
              />
            ))}
            {can('investigation:escalate') && <EscalateAction caseDetail={caseDetail} />}
          </div>
        )}
      </div>

      {isClosed && caseDetail.closedReason && (
        <Card className="mb-5 border-brand-200 bg-brand-50/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Closed {formatDateTime(caseDetail.closedAt)}
            </p>
            <p className="mt-1.5 text-sm text-neutral-700 whitespace-pre-wrap">
              {caseDetail.closedReason}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-5">
        <CardContent className="p-4 sm:p-5">
          <WorkflowStepper
            currentState={caseDetail.workflow.currentState}
            history={caseDetail.transitions.map((transition) => transition.toState)}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">The report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-neutral-500 mb-2">{caseDetail.report.category.name}</p>
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {caseDetail.report.description}
              </p>
            </CardContent>
          </Card>

          <TasksCard caseDetail={caseDetail} isClosed={isClosed} />

          {can('evidence:read') && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Evidence</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EvidenceList investigationId={caseDetail.id} allowUpload={!isClosed} />
              </CardContent>
            </Card>
          )}

          <NotesCard caseDetail={caseDetail} isClosed={isClosed} />
        </div>

        <div className="space-y-5">
          <TeamCard caseDetail={caseDetail} isClosed={isClosed} />

          {caseDetail.escalations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Escalations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {caseDetail.escalations.map((escalation) => (
                  <div
                    key={escalation.id}
                    className="rounded-lg border border-amber-200 bg-amber-50/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge status="warning" showIcon={false}>
                        {humanise(escalation.level)}
                      </Badge>
                      <span className="text-[11px] text-neutral-500">
                        {formatDate(escalation.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-neutral-700 leading-relaxed">
                      {escalation.reason}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Workflow history</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                emptyMessage="The case has not changed state yet."
                entries={caseDetail.transitions.map((transition) => ({
                  id: transition.id,
                  title: `${humanise(transition.fromState)} → ${humanise(transition.toState)}`,
                  description: transition.note ?? undefined,
                  at: transition.createdAt,
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function TasksCard({ caseDetail, isClosed }: { caseDetail: CaseDetail; isClosed: boolean }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueAt, setDueAt] = useState('');

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const openTasks = caseDetail.tasks.filter((task) =>
    ['PENDING', 'IN_PROGRESS'].includes(task.status),
  );

  async function submit() {
    await createTask.mutateAsync({
      id: caseDetail.id,
      title: title.trim(),
      assignedToId: assignedToId || undefined,
      dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
    });
    setOpen(false);
    setTitle('');
    setAssignedToId('');
    setDueAt('');
  }

  function toggle(taskId: string, status: string) {
    void updateTask.mutateAsync({
      id: caseDetail.id,
      taskId,
      status: status === 'DONE' ? 'PENDING' : 'DONE',
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          Tasks
          {openTasks.length > 0 && (
            <span className="ml-2 text-xs font-normal text-neutral-500">
              {openTasks.length} open
            </span>
          )}
        </CardTitle>
        {!isClosed && (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {caseDetail.tasks.length === 0 ? (
          <p className="px-6 pb-5 text-sm text-neutral-500">
            No tasks yet. Every task must be completed or cancelled before the case can be
            closed.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {caseDetail.tasks.map((task) => {
              const done = task.status === 'DONE';
              const cancelled = task.status === 'CANCELLED';

              return (
                <li key={task.id} className="flex items-start gap-3 p-4">
                  <button
                    type="button"
                    disabled={isClosed || cancelled}
                    onClick={() => toggle(task.id, task.status)}
                    className="mt-0.5 text-neutral-400 hover:text-brand-600 disabled:opacity-40 disabled:hover:text-neutral-400 shrink-0"
                    aria-label={done ? `Reopen ${task.title}` : `Mark ${task.title} done`}
                  >
                    {done ? (
                      <CheckSquare className="w-4 h-4 text-brand-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${
                        done || cancelled
                          ? 'text-neutral-400 line-through'
                          : 'text-neutral-900 font-medium'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="mt-0.5 text-xs text-neutral-500">{task.description}</p>
                    )}
                    <p className="mt-1 text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <Badge status={done ? 'success' : cancelled ? 'neutral' : 'info'} showIcon={false}>
                        {humanise(task.status)}
                      </Badge>
                      {task.dueAt && (
                        <span className={isOverdue(task.dueAt) && !done ? 'text-red-600' : ''}>
                          due {formatDate(task.dueAt)}
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add a task"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={createTask.isPending}
              disabled={title.trim().length < 4}
              onClick={() => void submit()}
            >
              Add task
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Task"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Obtain the tender evaluation file"
          />
          <Select
            label="Assign to"
            value={assignedToId}
            onChange={(event) => setAssignedToId(event.target.value)}
            options={[
              { value: '', label: 'Unassigned' },
              ...caseDetail.assignments.map((assignment) => ({
                value: assignment.investigator.id,
                label: `${assignment.investigator.fullName} (${humanise(assignment.role)})`,
              })),
            ]}
          />
          <div>
            <label htmlFor="task-due" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Due date
            </label>
            <input
              id="task-due"
              type="date"
              value={dueAt}
              onChange={(event) => setDueAt(event.target.value)}
              className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            />
          </div>
          <InlineError error={createTask.error} />
        </div>
      </Dialog>
    </Card>
  );
}

function NotesCard({ caseDetail, isClosed }: { caseDetail: CaseDetail; isClosed: boolean }) {
  const [content, setContent] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const addNote = useAddNote();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await addNote.mutateAsync({
      id: caseDetail.id,
      content: content.trim(),
      isConfidential,
    });
    setContent('');
    setIsConfidential(false);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Case notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isClosed && (
          <form onSubmit={(event) => void submit(event)} className="space-y-3">
            <Textarea
              label="Add a note"
              rows={3}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="What you found, what you did, and what follows."
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConfidential}
                  onChange={(event) => setIsConfidential(event.target.checked)}
                  className="accent-brand-600 w-4 h-4"
                />
                <span className="text-xs text-neutral-600">
                  Confidential — visible only to the supervisor and case lead
                </span>
              </label>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={addNote.isPending}
                disabled={content.trim().length === 0}
              >
                Save note
              </Button>
            </div>
            <InlineError error={addNote.error} />
          </form>
        )}

        {caseDetail.notes.length === 0 ? (
          <p className="text-sm text-neutral-500">No notes recorded.</p>
        ) : (
          <ul className="space-y-3">
            {caseDetail.notes.map((note) => (
              <li
                key={note.id}
                className={`rounded-lg border p-3.5 ${
                  note.isConfidential
                    ? 'border-indigo-200 bg-indigo-50/50'
                    : 'border-neutral-200 bg-neutral-50/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  {note.isConfidential ? (
                    <Badge status="confidential">
                      <Lock className="w-3 h-3" />
                      Confidential
                    </Badge>
                  ) : (
                    <span />
                  )}
                  <span className="text-[11px] text-neutral-500">
                    {formatDateTime(note.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function TeamCard({ caseDetail, isClosed }: { caseDetail: CaseDetail; isClosed: boolean }) {
  const { can } = useAuth();
  const [open, setOpen] = useState(false);
  const [investigatorId, setInvestigatorId] = useState('');
  const [role, setRole] = useState('ASSISTANT');

  const { data: users } = useUsers({ pageSize: 100 });
  const assign = useAssignInvestigator();
  const unassign = useUnassignInvestigator();

  // Only members of the owning agency can be assigned, which the API enforces too.
  const assignedIds = new Set(caseDetail.assignments.map((a) => a.investigator.id));
  const candidates = (users?.items ?? []).filter(
    (candidate) =>
      !assignedIds.has(candidate.id) &&
      candidate.memberships.some((membership) => membership.agencyId === caseDetail.agency.id),
  );

  async function submit() {
    await assign.mutateAsync({ id: caseDetail.id, investigatorId, role });
    setOpen(false);
    setInvestigatorId('');
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Case team</CardTitle>
        {!isClosed && can('investigation:assign') && (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <UserPlus className="w-3.5 h-3.5" />
            Assign
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2.5">
        {caseDetail.assignments.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Nobody is assigned yet. Assign a lead investigator to start work.
          </p>
        ) : (
          caseDetail.assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/60"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {assignment.investigator.fullName}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">
                  {humanise(assignment.role)} · assigned {formatDate(assignment.assignedAt)}
                </p>
              </div>
              {!isClosed && can('investigation:assign') && (
                <button
                  type="button"
                  onClick={() =>
                    void unassign.mutateAsync({
                      id: caseDetail.id,
                      assignmentId: assignment.id,
                    })
                  }
                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded shrink-0"
                  aria-label={`Unassign ${assignment.investigator.fullName}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </CardContent>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Assign an investigator"
        description="Only members of the owning agency can be assigned. Promoting a new lead steps the current lead down."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={assign.isPending}
              disabled={investigatorId.length === 0}
              onClick={() => void submit()}
            >
              Assign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Investigator"
            required
            value={investigatorId}
            onChange={(event) => setInvestigatorId(event.target.value)}
            options={[
              {
                value: '',
                label:
                  candidates.length === 0
                    ? 'No other members available in this agency'
                    : 'Select an investigator',
              },
              ...candidates.map((candidate) => ({
                value: candidate.id,
                label: candidate.fullName,
              })),
            ]}
          />
          <Select
            label="Role on the case"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            options={ASSIGNMENT_ROLE_CHOICES}
          />
          <InlineError error={assign.error} />
        </div>
      </Dialog>
    </Card>
  );
}

function TransitionAction({
  caseId,
  to,
  label,
  isClose,
}: {
  caseId: string;
  to: string;
  label: string;
  isClose: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const transition = useTransitionCase();
  const close = useCloseCase();

  const mutation = isClose ? close : transition;

  async function submit() {
    if (isClose) {
      await close.mutateAsync({ id: caseId, reason: note.trim() });
    } else {
      await transition.mutateAsync({ id: caseId, toState: to, note: note.trim() || undefined });
    }
    setOpen(false);
    setNote('');
  }

  return (
    <>
      <Button
        variant={isClose ? 'outline' : 'primary'}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        description={
          isClose
            ? 'Closing requires every task to be completed or cancelled. The reason is recorded permanently.'
            : 'The transition is recorded in the workflow history and everyone on the case is notified.'
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={isClose ? 'destructive' : 'primary'}
              isLoading={mutation.isPending}
              disabled={isClose && note.trim().length < 10}
              onClick={() => void submit()}
            >
              {isClose ? 'Close case' : 'Confirm'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Textarea
            label={isClose ? 'Outcome' : 'Note'}
            required={isClose}
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={
              isClose
                ? 'What was established, and what happens next.'
                : 'Optional context for the next person to pick this up.'
            }
            helperText={
              isClose ? `At least 10 characters. ${note.trim().length} so far.` : undefined
            }
          />
          <InlineError error={mutation.error} />
        </div>
      </Dialog>
    </>
  );
}

function EscalateAction({ caseDetail }: { caseDetail: CaseDetail }) {
  const [open, setOpen] = useState(false);
  const [escalatedToId, setEscalatedToId] = useState('');
  const [level, setLevel] = useState('SUPERVISOR');
  const [reason, setReason] = useState('');

  const { data: users } = useUsers({ pageSize: 100 });
  const escalate = useEscalateCase();

  async function submit() {
    await escalate.mutateAsync({
      id: caseDetail.id,
      escalatedToId,
      level,
      reason: reason.trim(),
    });
    setOpen(false);
    setReason('');
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <ArrowUpRight className="w-3.5 h-3.5" />
        Escalate
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Escalate this case"
        description="Escalating raises the case priority and emails the recipient."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={escalate.isPending}
              disabled={escalatedToId.length === 0 || reason.trim().length < 10}
              onClick={() => void submit()}
            >
              Escalate
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Escalate to"
            required
            value={escalatedToId}
            onChange={(event) => setEscalatedToId(event.target.value)}
            options={[
              { value: '', label: 'Select a recipient' },
              ...(users?.items ?? []).map((candidate) => ({
                value: candidate.id,
                label: `${candidate.fullName} (${candidate.email})`,
              })),
            ]}
          />
          <Select
            label="Level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            options={ESCALATION_LEVEL_CHOICES}
          />
          <p className="text-xs text-neutral-500 flex items-start gap-1.5">
            <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Inter-agency escalation sets the priority to Critical; the other levels set it
            to High.
          </p>
          <Textarea
            label="Reason"
            required
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            helperText={`At least 10 characters. ${reason.trim().length} so far.`}
          />
          <InlineError error={escalate.error} />
        </div>
      </Dialog>
    </>
  );
}
