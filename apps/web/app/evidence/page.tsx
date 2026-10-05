'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EvidenceList } from '@/components/evidence/evidence-list';
import { useInvestigations } from '@/hooks/use-investigations';
import { formatDate, humanise, priorityBadge, statusBadge } from '@/lib/format';

/**
 * The evidence vault is organised by case rather than as one flat list: an
 * evidence file only means anything in the context of the case it belongs to,
 * and the API scopes evidence queries by report or investigation.
 */
export default function EvidenceVaultPage() {
  return (
    <RequireAuth permissions={['evidence:read']}>
      <AppShell breadcrumbs={[{ label: 'Evidence vault' }]}>
        <EvidenceVault />
      </AppShell>
    </RequireAuth>
  );
}

function EvidenceVault() {
  const [selectedId, setSelectedId] = useState('');
  const query = useInvestigations({ pageSize: 100 });

  const cases = query.data?.items ?? [];
  const withEvidence = cases.filter((item) => item.evidenceCount > 0);
  const selected = cases.find((item) => item.id === selectedId) ?? withEvidence[0] ?? cases[0];

  if (query.isLoading) {
    return <LoadingState message="Loading cases" />;
  }

  if (query.error) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (cases.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="w-8 h-8 text-neutral-400" />}
        title="No cases in your agencies"
        description="Evidence is held against a case. Once one is opened, its files appear here."
      />
    );
  }

  const totalFiles = cases.reduce((sum, item) => sum + item.evidenceCount, 0);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Evidence vault</h1>
        <p className="text-xs text-neutral-500 mt-1">
          {totalFiles} file{totalFiles === 1 ? '' : 's'} across {cases.length} case
          {cases.length === 1 ? '' : 's'} in your agencies. Every file was hashed at intake
          and carries its own chain of custody.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {/* Case picker: a list on wide screens, a select on narrow ones. */}
        <div className="lg:col-span-1">
          <div className="lg:hidden mb-4">
            <Select
              label="Case"
              value={selected?.id ?? ''}
              onChange={(event) => setSelectedId(event.target.value)}
              options={cases.map((item) => ({
                value: item.id,
                label: `${item.caseNumber} — ${item.evidenceCount} file${item.evidenceCount === 1 ? '' : 's'}`,
              }))}
            />
          </div>

          <Card className="hidden lg:block overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Cases</CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[70vh] overflow-y-auto">
              <ul className="divide-y divide-neutral-100">
                {cases.map((item) => {
                  const isSelected = item.id === selected?.id;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={`w-full text-left p-3.5 transition-colors ${
                          isSelected
                            ? 'bg-brand-50/70 border-l-2 border-brand-600'
                            : 'hover:bg-neutral-50 border-l-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-bold text-neutral-600">
                            {item.caseNumber}
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-500 shrink-0">
                            {item.evidenceCount} file{item.evidenceCount === 1 ? '' : 's'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-neutral-900 line-clamp-2">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">{item.agencyName}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/investigations/${selected.id}`}
                      className="font-mono text-xs font-bold text-brand-700 hover:underline"
                    >
                      {selected.caseNumber}
                    </Link>
                    <CardTitle className="mt-1 text-base font-semibold">
                      {selected.title}
                    </CardTitle>
                    <p className="mt-1 text-xs text-neutral-500">
                      {selected.agencyName} · opened {formatDate(selected.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge status={priorityBadge(selected.priority)}>{selected.priority}</Badge>
                    <Badge status={statusBadge(selected.status)} showIcon={false}>
                      {humanise(selected.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <EvidenceList
                  investigationId={selected.id}
                  allowUpload={selected.status !== 'CLOSED'}
                />
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={<ShieldCheck className="w-8 h-8 text-neutral-400" />}
              title="Select a case"
              description="Pick a case to see the evidence held against it."
            />
          )}
        </div>
      </div>
    </>
  );
}
