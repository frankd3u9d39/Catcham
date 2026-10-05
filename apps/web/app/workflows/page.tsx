'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, GitBranch, Lock } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useWorkflows } from '@/hooks/use-platform';
import { formatDate, humanise } from '@/lib/format';

interface TransitionRule {
  to: string;
  label?: string;
  permissions?: string[];
}

interface StateDefinition {
  transitions?: TransitionRule[];
  terminal?: boolean;
}

export default function WorkflowsPage() {
  return (
    <RequireAuth permissions={['workflow:manage']}>
      <AppShell breadcrumbs={[{ label: 'Workflows' }]}>
        <Workflows />
      </AppShell>
    </RequireAuth>
  );
}

function Workflows() {
  const query = useWorkflows();

  if (query.isLoading) {
    return <LoadingState message="Loading workflow definitions" />;
  }

  if (query.error) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />;
  }

  const definitions = query.data ?? [];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Workflows</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Case progression is a state machine held in the database, so it can change
          without a deployment. Publishing a new version deactivates the previous one;
          existing cases keep their state and are re-evaluated on their next move.
        </p>
      </div>

      {definitions.length === 0 ? (
        <EmptyState
          icon={<GitBranch className="w-8 h-8 text-neutral-400" />}
          title="No workflow definitions"
          description="Run the database seed to publish the default case workflow."
        />
      ) : (
        <ul className="space-y-4">
          {definitions.map((definition) => (
            <li key={definition.id}>
              <Card className={definition.isActive ? undefined : 'opacity-70'}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base font-semibold">
                          {definition.name}
                        </CardTitle>
                        <Badge status="neutral" showIcon={false}>
                          v{definition.version}
                        </Badge>
                        <Badge
                          status={definition.isActive ? 'success' : 'neutral'}
                          showIcon={false}
                        >
                          {definition.isActive ? 'Active' : 'Superseded'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Starts at {humanise(definition.initialState)} ·{' '}
                        {definition.states.length} states · published{' '}
                        {formatDate(definition.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <StateMachineView definitionId={definition.id} name={definition.name} />
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * Renders the parsed state machine for the active definition. The list endpoint
 * returns state names only, so the full transition map is fetched per workflow.
 */
function StateMachineView({ definitionId, name }: { definitionId: string; name: string }) {
  const query = useActiveDefinition(name);

  if (query.isLoading) {
    return <LoadingState message="Loading the state machine" />;
  }

  if (query.error || !query.data) {
    return (
      <p className="text-sm text-neutral-500">
        Could not load the transition map for this version. Only the active version exposes
        its parsed machine.
      </p>
    );
  }

  // The endpoint returns the active version, which may not be this row.
  if (query.data.id !== definitionId) {
    return (
      <p className="text-sm text-neutral-500">
        This version has been superseded. Its stored definition is retained for the
        transitions recorded against it.
      </p>
    );
  }

  const machine = query.data.machine;

  return (
    <ul className="space-y-2.5">
      {Object.entries(machine).map(([state, definition]) => {
        const transitions = definition.transitions ?? [];

        return (
          <li
            key={state}
            className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-3.5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900">{humanise(state)}</span>
              {definition.terminal && (
                <Badge status="neutral" showIcon={false}>
                  Terminal
                </Badge>
              )}
            </div>

            {transitions.length === 0 ? (
              <p className="mt-1.5 text-xs text-neutral-500">
                No outgoing transitions. A case here cannot move.
              </p>
            ) : (
              <ul className="mt-2.5 space-y-1.5">
                {transitions.map((transition) => (
                  <li
                    key={transition.to}
                    className="flex flex-wrap items-center gap-2 text-xs text-neutral-700"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="font-medium">{humanise(transition.to)}</span>
                    {transition.label && (
                      <span className="text-neutral-500">&ldquo;{transition.label}&rdquo;</span>
                    )}
                    {(transition.permissions ?? []).map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-white border border-neutral-200 font-mono text-[10px] text-neutral-600"
                      >
                        <Lock className="w-2.5 h-2.5" />
                        {permission}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function useActiveDefinition(name: string) {
  return useQuery({
    queryKey: ['workflow-active', name],
    queryFn: () =>
      api.get<{ id: string; machine: Record<string, StateDefinition> }>(
        `/workflows/${encodeURIComponent(name)}/active`,
      ),
    staleTime: 5 * 60_000,
  });
}
