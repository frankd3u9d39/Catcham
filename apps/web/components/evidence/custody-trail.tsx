'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Badge } from '@/components/ui/badge';
import { useCustodyTrail, useIntegrityCheck } from '@/hooks/use-evidence';
import { formatDateTime, humanise, shortHash } from '@/lib/format';
import type { EvidenceSummary } from '@/lib/types';

/**
 * The custody ledger alongside its verification verdict. Two independent checks
 * are shown: whether the stored file still hashes to its intake value, and
 * whether the custody entries still form an unbroken hash chain.
 */
export const CustodyTrailView: React.FC<{ evidence: EvidenceSummary }> = ({ evidence }) => {
  const trail = useCustodyTrail(evidence.id);
  const integrity = useIntegrityCheck(evidence.id);

  if (trail.isLoading) {
    return <LoadingState message="Loading the custody trail" />;
  }

  if (trail.error || !trail.data) {
    return <ErrorState error={trail.error} onRetry={() => void trail.refetch()} />;
  }

  const chain = trail.data.integrity;
  const fileIntact = integrity.data?.fileIntact;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <VerdictTile
          ok={chain.valid}
          title={chain.valid ? 'Custody chain intact' : 'Custody chain broken'}
          detail={
            chain.valid
              ? `${chain.length} ${chain.length === 1 ? 'entry' : 'entries'}, each hash matching its predecessor.`
              : `Verification failed at entry ${chain.brokenAtSequence}. ${chain.detail}`
          }
        />
        <VerdictTile
          ok={fileIntact !== false}
          loading={integrity.isLoading}
          title={
            integrity.isLoading
              ? 'Re-hashing the stored file'
              : fileIntact
                ? 'File matches intake hash'
                : integrity.data?.currentHash === null
                  ? 'Stored file is missing'
                  : 'File no longer matches'
          }
          detail={
            integrity.isLoading
              ? 'Reading the blob from storage.'
              : fileIntact
                ? `SHA-256 ${shortHash(evidence.sha256Hash)} reproduced from the stored bytes.`
                : 'The stored bytes do not reproduce the hash recorded at intake. Treat this evidence as compromised and report it.'
          }
        />
      </div>

      <ol className="space-y-3">
        {trail.data.entries.map((entry) => (
          <li
            key={entry.sequence}
            className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-3.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[10px] font-bold text-neutral-400 shrink-0">
                  #{String(entry.sequence).padStart(2, '0')}
                </span>
                <Badge status="info" showIcon={false}>
                  {humanise(entry.action)}
                </Badge>
              </div>
              <span className="text-[11px] text-neutral-500 shrink-0">
                {formatDateTime(entry.createdAt)}
              </span>
            </div>

            <p className="mt-2 text-xs text-neutral-700 leading-relaxed break-words">
              {entry.reason}
            </p>

            <dl className="mt-2.5 grid gap-1 text-[11px] text-neutral-500">
              {entry.performedBy && (
                <div className="flex gap-1.5">
                  <dt className="font-medium shrink-0">By</dt>
                  <dd className="truncate">
                    {entry.performedBy.fullName} ({entry.performedBy.email})
                  </dd>
                </div>
              )}
              {entry.transferredTo && (
                <div className="flex gap-1.5">
                  <dt className="font-medium shrink-0">To</dt>
                  <dd className="truncate">
                    {entry.transferredTo.fullName} ({entry.transferredTo.email})
                  </dd>
                </div>
              )}
              {entry.ipAddress && (
                <div className="flex gap-1.5">
                  <dt className="font-medium shrink-0">From</dt>
                  <dd className="font-mono">{entry.ipAddress}</dd>
                </div>
              )}
              <div className="flex gap-1.5">
                <dt className="font-medium shrink-0">Hash</dt>
                <dd className="font-mono" title={entry.entryHash}>
                  {shortHash(entry.entryHash)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <p className="text-[11px] text-neutral-500 leading-relaxed">
        Each entry&rsquo;s hash covers its own fields plus the previous entry&rsquo;s hash, so
        editing or removing a row invalidates every row after it. This gives tamper
        evidence rather than tamper prevention: it is read alongside the activity log, not
        instead of it.
      </p>
    </div>
  );
};

function VerdictTile({
  ok,
  title,
  detail,
  loading = false,
}: {
  ok: boolean;
  title: string;
  detail: string;
  loading?: boolean;
}) {
  const tone = loading
    ? 'border-neutral-200 bg-neutral-50 text-neutral-500'
    : ok
      ? 'border-brand-200 bg-brand-50/70 text-brand-700'
      : 'border-red-200 bg-red-50 text-red-700';

  return (
    <div className={`rounded-lg border p-3.5 ${tone}`}>
      <div className="flex items-center gap-2">
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-neutral-300 border-t-neutral-500 animate-spin shrink-0" />
        ) : ok ? (
          <ShieldCheck className="w-4 h-4 shrink-0" />
        ) : (
          <ShieldAlert className="w-4 h-4 shrink-0" />
        )}
        <p className="text-xs font-semibold">{title}</p>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">{detail}</p>
    </div>
  );
}
