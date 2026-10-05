'use client';

import React, { useState } from 'react';
import { FileStack } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Pagination } from '@/components/ui/pagination';
import { useAuditLog } from '@/hooks/use-platform';
import { formatDateTime, humanise } from '@/lib/format';

const RESOURCES = [
  { value: '', label: 'All resources' },
  { value: 'report', label: 'Reports' },
  { value: 'investigation', label: 'Investigations' },
  { value: 'evidence', label: 'Evidence' },
  { value: 'user', label: 'Users' },
  { value: 'agency', label: 'Agencies' },
  { value: 'business_rule', label: 'Business rules' },
];

/** Actions that change who can see or hold something, highlighted in the list. */
const SENSITIVE_ACTIONS = new Set([
  'EVIDENCE_DOWNLOADED',
  'EVIDENCE_CUSTODY_TRANSFERRED',
  'EVIDENCE_ARCHIVED',
  'MEMBERSHIP_GRANTED',
  'MEMBERSHIP_REVOKED',
  'PASSWORD_CHANGED',
  'REPORT_REJECTED',
]);

export default function AuditPage() {
  return (
    <RequireAuth permissions={['audit:read']}>
      <AppShell breadcrumbs={[{ label: 'Activity log' }]}>
        <AuditLog />
      </AppShell>
    </RequireAuth>
  );
}

function AuditLog() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 25,
    resource: '',
    action: '',
    from: '',
    to: '',
  });

  const query = useAuditLog({
    page: filters.page,
    pageSize: filters.pageSize,
    resource: filters.resource || undefined,
    action: filters.action || undefined,
  });

  function update(patch: Partial<typeof filters>) {
    setFilters((current) => ({ ...current, ...patch, page: patch.page ?? 1 }));
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Activity log</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Append-only record of who did what. Entries are written alongside the action they
          describe and are never edited or removed.
        </p>
      </div>

      <Card className="mb-5">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Resource"
            value={filters.resource}
            onChange={(event) => update({ resource: event.target.value })}
            options={RESOURCES}
          />
          <Input
            label="Action"
            value={filters.action}
            onChange={(event) => update({ action: event.target.value })}
            placeholder="EVIDENCE_DOWNLOADED"
            helperText="Exact match on the action name."
          />
        </CardContent>
      </Card>

      {query.isLoading ? (
        <LoadingState message="Loading the activity log" />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.data?.items.length === 0 ? (
        <EmptyState
          icon={<FileStack className="w-8 h-8 text-neutral-400" />}
          title="No entries match these filters"
          description="Clear the action filter, or pick a different resource, to see more."
        />
      ) : (
        <>
          <ul className="space-y-2.5">
            {query.data?.items.map((entry) => {
              const sensitive = SENSITIVE_ACTIONS.has(entry.action);

              return (
                <li key={entry.id}>
                  <Card className={sensitive ? 'border-amber-200' : undefined}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <Badge status={sensitive ? 'warning' : 'info'} showIcon={false}>
                            {humanise(entry.action)}
                          </Badge>
                          <span className="text-xs text-neutral-500">
                            {entry.resource}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500 shrink-0">
                          {formatDateTime(entry.createdAt)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-neutral-800">
                        <span className="font-medium">{entry.actorLabel}</span>
                        {entry.ipAddress && (
                          <span className="text-xs text-neutral-500 font-mono">
                            {' '}
                            from {entry.ipAddress}
                          </span>
                        )}
                      </p>

                      <p className="mt-1 font-mono text-[10px] text-neutral-400 break-all">
                        {entry.resource}/{entry.resourceId}
                      </p>

                      {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                        <dl className="mt-2.5 pt-2.5 border-t border-neutral-100 grid gap-1 text-[11px]">
                          {Object.entries(entry.metadata).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                              <dt className="text-neutral-400 shrink-0">{key}</dt>
                              <dd className="text-neutral-700 break-all">
                                {typeof value === 'object'
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
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
