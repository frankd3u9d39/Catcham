'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Play, Sliders } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState, InlineError } from '@/components/ui/error-state';
import { useBusinessRules, useRuleMetadata, useSimulateRule, useToggleRule } from '@/hooks/use-platform';
import { humanise } from '@/lib/format';

export default function RulesPage() {
  return (
    <RequireAuth permissions={['rule:manage']}>
      <AppShell breadcrumbs={[{ label: 'Business rules' }]}>
        <Rules />
      </AppShell>
    </RequireAuth>
  );
}

function Rules() {
  const [category, setCategory] = useState('');
  const query = useBusinessRules(category || undefined);
  const metadata = useRuleMetadata();
  const toggle = useToggleRule();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Business rules</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Rules adjust priority and routing without a deployment. They run highest
            priority first, and every match is applied.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SimulateAction categories={metadata.data?.categories ?? []} />
          <Link href="/rules/new">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              New rule
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-5">
        <CardContent className="p-4 max-w-xs">
          <Select
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            options={[
              { value: '', label: 'All categories' },
              ...(metadata.data?.categories ?? []).map((value) => ({
                value,
                label: humanise(value),
              })),
            ]}
          />
        </CardContent>
      </Card>

      {query.isLoading ? (
        <LoadingState message="Loading rules" />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.data?.length === 0 ? (
        <EmptyState
          icon={<Sliders className="w-8 h-8 text-neutral-400" />}
          title="No rules in this category"
          description="Without a matching rule, a report takes the priority from its category and routes by the routing table."
          action={
            <Link href="/rules/new">
              <Button variant="primary" size="sm">
                Create a rule
              </Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {query.data?.map((rule) => (
            <li key={rule.id}>
              <Card className={rule.isEnabled ? undefined : 'opacity-60'}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-neutral-900">{rule.name}</p>
                        <Badge status={rule.isEnabled ? 'success' : 'neutral'} showIcon={false}>
                          {rule.isEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {humanise(rule.category)} · priority {rule.priority} · action{' '}
                        <span className="font-mono">{rule.action}</span>
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      isLoading={toggle.isPending && toggle.variables?.id === rule.id}
                      onClick={() =>
                        void toggle.mutateAsync({ id: rule.id, isEnabled: !rule.isEnabled })
                      }
                    >
                      {rule.isEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                        Conditions
                      </p>
                      <pre className="mt-1 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 font-mono text-[10px] text-neutral-700 overflow-x-auto">
                        {prettyJson(rule.conditionsJson)}
                      </pre>
                    </div>
                    {rule.actionParams && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                          Action parameters
                        </p>
                        <pre className="mt-1 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 font-mono text-[10px] text-neutral-700 overflow-x-auto">
                          {prettyJson(rule.actionParams)}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Dry run against caller-supplied facts, so a rule can be checked before enabling it. */
function SimulateAction({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('REPORT_TRIAGE');
  const [facts, setFacts] = useState(
    '{\n  "categoryCode": "OIL_PIPELINE",\n  "stateCode": "RI",\n  "isAnonymous": true\n}',
  );
  const [parseError, setParseError] = useState<string | null>(null);

  const simulate = useSimulateRule();

  async function run() {
    setParseError(null);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(facts) as Record<string, unknown>;
    } catch {
      setParseError('The facts must be a valid JSON object.');
      return;
    }

    await simulate.mutateAsync({ category, facts: parsed });
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Play className="w-3.5 h-3.5" />
        Simulate
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Simulate rule evaluation"
        description="Runs the enabled rules in a category against the facts you supply. Nothing is written."
        className="sm:max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="primary" isLoading={simulate.isPending} onClick={() => void run()}>
              Run
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            options={categories.map((value) => ({ value, label: humanise(value) }))}
          />
          <Textarea
            label="Facts"
            rows={7}
            value={facts}
            onChange={(event) => setFacts(event.target.value)}
            className="font-mono text-xs"
            error={parseError ?? undefined}
            helperText="A flat JSON object. Conditions reference these field names."
          />
          <InlineError error={simulate.error} />

          {simulate.data && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                {simulate.data.length === 0
                  ? 'No rules matched'
                  : `${simulate.data.length} rule${simulate.data.length === 1 ? '' : 's'} matched`}
              </p>
              {simulate.data.length === 0 ? (
                <p className="mt-1.5 text-xs text-neutral-500">
                  The report would take the priority from its category and route by the
                  routing table.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {simulate.data.map((outcome) => (
                    <li
                      key={outcome.ruleId}
                      className="p-2.5 rounded-lg border border-brand-200 bg-brand-50/60"
                    >
                      <p className="text-xs font-semibold text-neutral-900">
                        {outcome.ruleName}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-brand-700">
                        {outcome.action}
                        {outcome.params && Object.keys(outcome.params).length > 0
                          ? ` ${JSON.stringify(outcome.params)}`
                          : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}

function prettyJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    // A stored rule with invalid JSON is skipped by the engine and logged; show
    // the raw value so it can be corrected.
    return raw;
  }
}
