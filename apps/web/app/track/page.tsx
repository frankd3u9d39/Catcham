'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InlineError } from '@/components/ui/error-state';
import { api } from '@/lib/api-client';
import { formatDateTime, humanise, statusBadge } from '@/lib/format';
import type { PublicReportStatus } from '@/lib/types';

export default function TrackReportPage() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [status, setStatus] = useState<PublicReportStatus | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setIsSubmitting(true);

    try {
      const result = await api.public<PublicReportStatus>('/public/reports/track', {
        method: 'POST',
        body: {
          referenceNumber: referenceNumber.trim().toUpperCase(),
          trackingCode: trackingCode.trim().toUpperCase(),
        },
      });
      setStatus(result);
    } catch (caught) {
      setError(caught);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-neutral-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 h-16 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Track a report</h1>
        <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
          Both the reference number and the tracking code are required. A reference
          number alone will not return anything, which is what stops a guessed reference
          from disclosing a report.
        </p>

        <Card className="mt-7">
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <Input
                label="Reference number"
                required
                value={referenceNumber}
                onChange={(event) => setReferenceNumber(event.target.value)}
                placeholder="CTM-2026-7F3A91"
                className="font-mono"
                autoCapitalize="characters"
                spellCheck={false}
              />
              <Input
                label="Tracking code"
                required
                value={trackingCode}
                onChange={(event) => setTrackingCode(event.target.value)}
                placeholder="The code shown once at submission"
                className="font-mono"
                autoCapitalize="characters"
                spellCheck={false}
              />

              <InlineError error={error} />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
                disabled={referenceNumber.trim().length === 0 || trackingCode.trim().length === 0}
              >
                Check status
              </Button>
            </form>
          </CardContent>
        </Card>

        {status && (
          <Card className="mt-6">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-bold text-neutral-500">
                    {status.referenceNumber}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-neutral-950">
                    {status.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-neutral-500">{status.categoryName}</p>
                </div>
                <Badge status={statusBadge(status.status)}>{humanise(status.status)}</Badge>
              </div>

              <div className="mt-6 pt-5 border-t border-neutral-100">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Progress
                </h3>
                <ol className="mt-4 space-y-4">
                  {status.timeline.map((entry, index) => (
                    <li key={`${entry.action}-${entry.at}`} className="flex gap-3.5">
                      <div className="flex flex-col items-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-600 mt-1.5" />
                        {index < status.timeline.length - 1 && (
                          <span className="w-px flex-1 bg-neutral-200 mt-1" />
                        )}
                      </div>
                      <div className="pb-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          {humanise(entry.action)}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-600 leading-relaxed">
                          {entry.description}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">
                          {formatDateTime(entry.at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-xs text-neutral-500 leading-relaxed">
                  Investigation detail is not shown here. Only lifecycle milestones are
                  visible on the public tracking view.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
