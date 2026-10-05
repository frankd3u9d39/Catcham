'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { InlineError } from '@/components/ui/error-state';
import { useCreateRule, useRuleMetadata } from '@/hooks/use-platform';
import { useAgencies } from '@/hooks/use-platform';
import { useReportCategories } from '@/hooks/use-reports';
import { humanise } from '@/lib/format';
import { PRIORITY_CHOICES } from '@/lib/options';

const OPERATORS = [
  { value: 'eq', label: 'equals' },
  { value: 'neq', label: 'does not equal' },
  { value: 'gt', label: 'is greater than' },
  { value: 'gte', label: 'is at least' },
  { value: 'lt', label: 'is less than' },
  { value: 'lte', label: 'is at most' },
  { value: 'in', label: 'is one of' },
  { value: 'nin', label: 'is not one of' },
  { value: 'contains', label: 'contains' },
];

/** Facts the engine is called with, so the builder can offer them rather than free text. */
const FACT_FIELDS: Record<string, Array<{ value: string; label: string }>> = {
  REPORT_TRIAGE: [
    { value: 'categoryCode', label: 'Report category code' },
    { value: 'categorySeverity', label: 'Category severity' },
    { value: 'stateCode', label: 'State code' },
    { value: 'lgaCode', label: 'LGA code' },
    { value: 'isAnonymous', label: 'Is anonymous' },
    { value: 'title', label: 'Report title' },
  ],
  CASE_PRIORITY: [
    { value: 'categoryCode', label: 'Report category code' },
    { value: 'reportPriority', label: 'Report priority' },
    { value: 'stateCode', label: 'State code' },
    { value: 'isAnonymous', label: 'Is anonymous' },
  ],
  ESCALATION: [
    { value: 'categoryCode', label: 'Report category code' },
    { value: 'daysOpen', label: 'Days the case has been open' },
  ],
};

interface ConditionRow {
  id: string;
  field: string;
  op: string;
  value: string;
}

export default function NewRulePage() {
  return (
    <RequireAuth permissions={['rule:manage']}>
      <AppShell
        breadcrumbs={[{ label: 'Business rules', href: '/rules' }, { label: 'New rule' }]}
      >
        <NewRuleForm />
      </AppShell>
    </RequireAuth>
  );
}

function NewRuleForm() {
  const router = useRouter();
  const metadata = useRuleMetadata();
  const { data: categories = [] } = useReportCategories();
  const { data: agencies = [] } = useAgencies();
  const create = useCreateRule();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('REPORT_TRIAGE');
  const [action, setAction] = useState('SET_PRIORITY');
  const [priority, setPriority] = useState(100);
  const [actionPriority, setActionPriority] = useState('CRITICAL');
  const [actionAgencyId, setActionAgencyId] = useState('');
  const [conditions, setConditions] = useState<ConditionRow[]>([
    { id: crypto.randomUUID(), field: 'categoryCode', op: 'eq', value: '' },
  ]);

  const fields = FACT_FIELDS[category] ?? [];

  // Built live so the operator can see exactly what will be stored.
  const conditionsJson = useMemo(() => {
    const all = conditions
      .filter((row) => row.field.length > 0 && row.value.trim().length > 0)
      .map((row) => ({
        field: row.field,
        op: row.op,
        value: coerce(row.value, row.op),
      }));

    return JSON.stringify({ all }, null, 2);
  }, [conditions]);

  const actionParams =
    action === 'SET_PRIORITY'
      ? { priority: actionPriority }
      : action === 'ROUTE_TO_AGENCY' && actionAgencyId
        ? { agencyId: actionAgencyId }
        : undefined;

  const isValid =
    name.trim().length >= 3 &&
    conditions.some((row) => row.field.length > 0 && row.value.trim().length > 0) &&
    (action !== 'ROUTE_TO_AGENCY' || actionAgencyId.length > 0);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    await create.mutateAsync({
      name: name.trim(),
      category,
      conditionsJson,
      action,
      actionParams,
      priority,
    });

    router.push('/rules');
  }

  function updateCondition(id: string, patch: Partial<ConditionRow>) {
    setConditions((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">New business rule</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Every condition must hold for the rule to fire. Conditions are validated before
          the rule is stored, so an unparseable rule never reaches the table.
        </p>
      </div>

      <div className="space-y-5">
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-4">
            <Input
              label="Rule name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Critical priority for pipeline incidents"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="When is it evaluated?"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  // Fact names differ per category, so stale fields are reset.
                  setConditions([
                    { id: crypto.randomUUID(), field: '', op: 'eq', value: '' },
                  ]);
                }}
                options={(metadata.data?.categories ?? ['REPORT_TRIAGE']).map((value) => ({
                  value,
                  label: humanise(value),
                }))}
              />
              <Input
                label="Evaluation priority"
                type="number"
                min={0}
                max={1000}
                value={priority}
                onChange={(event) => setPriority(Number(event.target.value))}
                helperText="Higher runs first. 100 is the default."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Conditions</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setConditions((current) => [
                  ...current,
                  { id: crypto.randomUUID(), field: '', op: 'eq', value: '' },
                ])
              }
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {conditions.map((row, index) => (
              <div
                key={row.id}
                className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-3"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                    {index === 0 ? 'Where' : 'And'}
                  </span>
                  {conditions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setConditions((current) => current.filter((item) => item.id !== row.id))
                      }
                      className="p-1 text-neutral-400 hover:text-red-600 rounded"
                      aria-label="Remove this condition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid gap-2.5 sm:grid-cols-3">
                  <Select
                    label="Field"
                    value={row.field}
                    onChange={(event) => updateCondition(row.id, { field: event.target.value })}
                    options={[{ value: '', label: 'Select a field' }, ...fields]}
                  />
                  <Select
                    label="Operator"
                    value={row.op}
                    onChange={(event) => updateCondition(row.id, { op: event.target.value })}
                    options={OPERATORS}
                  />
                  {row.field === 'categoryCode' && (row.op === 'eq' || row.op === 'neq') ? (
                    <Select
                      label="Value"
                      value={row.value}
                      onChange={(event) => updateCondition(row.id, { value: event.target.value })}
                      options={[
                        { value: '', label: 'Select a category' },
                        ...categories.map((item) => ({ value: item.code, label: item.name })),
                      ]}
                    />
                  ) : (
                    <Input
                      label="Value"
                      value={row.value}
                      onChange={(event) => updateCondition(row.id, { value: event.target.value })}
                      placeholder={
                        row.op === 'in' || row.op === 'nin'
                          ? 'RI, BY, DE'
                          : row.field === 'isAnonymous'
                            ? 'true'
                            : 'Value'
                      }
                      helperText={
                        row.op === 'in' || row.op === 'nin' ? 'Comma-separated' : undefined
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Then do this</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Action"
              value={action}
              onChange={(event) => setAction(event.target.value)}
              options={(metadata.data?.actions ?? ['SET_PRIORITY']).map((value) => ({
                value,
                label: humanise(value),
              }))}
            />

            {action === 'SET_PRIORITY' && (
              <Select
                label="Priority to set"
                value={actionPriority}
                onChange={(event) => setActionPriority(event.target.value)}
                options={PRIORITY_CHOICES}
              />
            )}

            {action === 'ROUTE_TO_AGENCY' && (
              <Select
                label="Agency"
                required
                value={actionAgencyId}
                onChange={(event) => setActionAgencyId(event.target.value)}
                options={[
                  { value: '', label: 'Select an agency' },
                  ...agencies.map((agency) => ({
                    value: agency.id,
                    label: `${agency.acronym} — ${agency.name}`,
                  })),
                ]}
              />
            )}

            {(action === 'REQUIRE_SUPERVISOR_REVIEW' || action === 'FLAG_FOR_ESCALATION') && (
              <p className="text-xs text-neutral-500">
                This action takes no parameters.
                {action === 'FLAG_FOR_ESCALATION' &&
                  ' It also sets the priority to Critical and requires supervisor review.'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">What will be stored</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-3 rounded-lg bg-neutral-900 text-neutral-200 font-mono text-[11px] overflow-x-auto">
              {conditionsJson}
            </pre>
            {actionParams && (
              <pre className="mt-2 p-3 rounded-lg bg-neutral-900 text-neutral-200 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(actionParams, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <InlineError error={create.error} />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={create.isPending}
            disabled={!isValid}
          >
            Create rule
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/rules')}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

/**
 * Turns the typed value into the JSON type the engine will compare against.
 * `in`/`nin` need an array; booleans and numbers must not be left as strings, or
 * a strict equality check would never match.
 */
function coerce(raw: string, op: string): unknown {
  const trimmed = raw.trim();

  if (op === 'in' || op === 'nin') {
    return trimmed
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }
  if (trimmed === 'true') {
    return true;
  }
  if (trimmed === 'false') {
    return false;
  }
  if (trimmed.length > 0 && Number.isFinite(Number(trimmed))) {
    return Number(trimmed);
  }
  return trimmed;
}
