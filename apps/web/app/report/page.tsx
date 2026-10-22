'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Check, Copy, Crosshair, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { InlineError } from '@/components/ui/error-state';
import { useReportCategories } from '@/hooks/use-reports';
import { useJurisdictions } from '@/hooks/use-platform';
import { api } from '@/lib/api-client';
import { firestoreService } from '@/lib/firebase';
import { AppShell } from '@/components/layout/app-shell';
import type { SubmissionReceipt } from '@/lib/types';

const DRAFT_KEY_STORAGE = 'catcham.draftKey';

export default function SubmitReportPage() {
  const { data: categories = [] } = useReportCategories();
  const { data: states = [] } = useJurisdictions('STATE');

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    stateCode: '',
    lgaCode: '',
    addressText: '',
    occurredAt: '',
    isAnonymous: true,
    contactEmail: '',
  });
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);

  // LGAs depend on the chosen state, so they are fetched only once one is picked.
  const { data: lgas = [] } = useJurisdictions('LGA', form.stateCode || undefined);

  const draftKey = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    try {
      const existing = window.localStorage.getItem(DRAFT_KEY_STORAGE);
      if (existing) {
        return existing;
      }
      const generated = crypto.randomUUID();
      window.localStorage.setItem(DRAFT_KEY_STORAGE, generated);
      return generated;
    } catch {
      return '';
    }
  }, []);

  // A long description is easy to lose to a reload, so the form is saved
  // server-side under an opaque key once there is something worth keeping.
  useEffect(() => {
    if (!draftKey || receipt || form.description.length < 40) {
      return;
    }

    const timer = setTimeout(() => {
      void api
        .public('/public/reports/drafts', {
          method: 'POST',
          body: { ownerKey: draftKey, payload: JSON.stringify(form) },
        })
        .catch(() => undefined);
    }, 2000);

    return () => clearTimeout(timer);
  }, [form, draftKey, receipt]);

  useEffect(() => {
    if (!draftKey) {
      return;
    }

    void api
      .public<{ payload: string }>(`/public/reports/drafts/${draftKey}`)
      .then((draft) => {
        const saved = JSON.parse(draft.payload) as typeof form;
        setForm((current) => (current.description.length === 0 ? saved : current));
      })
      .catch(() => undefined);
  }, [draftKey]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: Number(position.coords.latitude.toFixed(5)),
          longitude: Number(position.coords.longitude.toFixed(5)),
        });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10_000 },
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await api.public<SubmissionReceipt>('/public/reports', {
        method: 'POST',
        body: {
          title: form.title.trim(),
          description: form.description.trim(),
          categoryId: form.categoryId,
          isAnonymous: form.isAnonymous,
          contactEmail: form.isAnonymous ? undefined : form.contactEmail.trim() || undefined,
          stateCode: form.stateCode || undefined,
          lgaCode: form.lgaCode || undefined,
          addressText: form.addressText.trim() || undefined,
          occurredAt: form.occurredAt ? new Date(form.occurredAt).toISOString() : undefined,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
        },
      });

      setReceipt(result);

      // Persist to Cloud Firestore in catcham-app project
      void firestoreService.saveReport({
        referenceNumber: result.referenceNumber,
        trackingCode: result.trackingCode || '',
        title: form.title.trim(),
        category: form.categoryId,
        narrative: form.description.trim(),
        assignedAgency: result.routedTo || 'Awaiting Triage Routing',
        state: form.stateCode ? `${form.stateCode} State` : 'National Domain',
        status: result.status || 'SUBMITTED',
        priority: 'MEDIUM',
        isAnonymous: form.isAnonymous,
        contactEmail: form.isAnonymous ? undefined : form.contactEmail.trim() || undefined,
        submittedAt: result.submittedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (draftKey) {
        void api
          .public(`/public/reports/drafts/${draftKey}`, { method: 'DELETE' })
          .catch(() => undefined);
      }
    } catch (caught) {
      setError(caught);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (receipt) {
    return <Receipt receipt={receipt} />;
  }

  const descriptionShort = form.description.trim().length < 30;

  return (
    <AppShell breadcrumbs={[{ label: 'Citizen Portal', href: '/dashboard' }, { label: 'Submit New Report' }]}>
      <div className="max-w-2xl mx-auto py-2 sm:py-4 pb-12">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Submit a report</h1>
        <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
          Describe what you saw as specifically as you can: what happened, where, when,
          and who was involved. Specific reports can be acted on; vague ones usually
          cannot.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          <Select
            label="What kind of incident is this?"
            required
            value={form.categoryId}
            onChange={(event) => set('categoryId', event.target.value)}
            options={[
              { value: '', label: 'Select a category' },
              ...categories.map((category) => ({ value: category.id, label: category.name })),
            ]}
          />

          <Input
            label="Summary"
            required
            maxLength={200}
            value={form.title}
            onChange={(event) => set('title', event.target.value)}
            placeholder="Suspected diversion of petroleum products"
            helperText="One line. This is what the triage officer sees first."
          />

          <Textarea
            label="What happened?"
            required
            rows={8}
            maxLength={10_000}
            value={form.description}
            onChange={(event) => set('description', event.target.value)}
            placeholder="Include dates and times, the location, vehicles or equipment involved, and anything that could be verified."
            helperText={
              descriptionShort
                ? `At least 30 characters. ${form.description.trim().length} so far.`
                : `${form.description.trim().length} characters.`
            }
          />

          <fieldset className="rounded-xl border border-neutral-200 bg-neutral-white p-4 sm:p-5 space-y-4">
            <legend className="px-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Where did it happen?
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="State"
                value={form.stateCode}
                onChange={(event) => {
                  set('stateCode', event.target.value);
                  set('lgaCode', '');
                }}
                options={[
                  { value: '', label: 'Select a state' },
                  ...states.map((state) => ({ value: state.code, label: state.name })),
                ]}
              />
              <Select
                label="Local government area"
                disabled={form.stateCode.length === 0 || lgas.length === 0}
                value={form.lgaCode}
                onChange={(event) => set('lgaCode', event.target.value)}
                options={[
                  {
                    value: '',
                    label:
                      form.stateCode.length === 0
                        ? 'Select a state first'
                        : lgas.length === 0
                          ? 'None listed for this state'
                          : 'Select an LGA',
                  },
                  ...lgas.map((lga) => ({ value: lga.code, label: lga.name })),
                ]}
              />
            </div>

            <Input
              label="Address or landmark"
              value={form.addressText}
              onChange={(event) => set('addressText', event.target.value)}
              placeholder="Near the Eleme junction flyover"
            />

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={useMyLocation}>
                {locating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Crosshair className="w-3.5 h-3.5" />
                )}
                Use my current location
              </Button>
              {coords && (
                <span className="text-xs text-brand-700 font-medium">
                  Attached: {coords.latitude}, {coords.longitude}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">
              Coordinates are optional. When present they take precedence over the state
              and LGA you selected, because they are measured rather than chosen.
            </p>
          </fieldset>

          <Input
            label="When did it happen?"
            type="datetime-local"
            value={form.occurredAt}
            onChange={(event) => set('occurredAt', event.target.value)}
            helperText="Leave blank if you are not sure."
          />

          <fieldset className="rounded-xl border border-neutral-200 bg-neutral-white p-4 sm:p-5 space-y-3">
            <legend className="px-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Your identity
            </legend>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="identity"
                checked={form.isAnonymous}
                onChange={() => set('isAnonymous', true)}
                className="mt-1 accent-brand-600"
              />
              <span>
                <span className="block text-sm font-medium text-neutral-900">
                  Submit anonymously
                </span>
                <span className="block text-xs text-neutral-500 mt-0.5">
                  No contact details are stored. You get a tracking code shown once.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="identity"
                checked={!form.isAnonymous}
                onChange={() => set('isAnonymous', false)}
                className="mt-1 accent-brand-600"
              />
              <span>
                <span className="block text-sm font-medium text-neutral-900">
                  Leave an email address
                </span>
                <span className="block text-xs text-neutral-500 mt-0.5">
                  Investigators can contact you for clarification.
                </span>
              </span>
            </label>

            {!form.isAnonymous && (
              <Input
                label="Email address"
                type="email"
                required
                value={form.contactEmail}
                onChange={(event) => set('contactEmail', event.target.value)}
              />
            )}
          </fieldset>

          <InlineError error={error} />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
            disabled={
              form.title.trim().length < 8 || descriptionShort || form.categoryId.length === 0
            }
          >
            Submit report
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

function Receipt({ receipt }: { receipt: SubmissionReceipt }) {
  const [copied, setCopied] = useState(false);

  async function copyBoth() {
    const text = receipt.trackingCode
      ? `Reference: ${receipt.referenceNumber}\nTracking code: ${receipt.trackingCode}`
      : `Reference: ${receipt.referenceNumber}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard access can be denied; the values are on screen regardless.
    }
  }

  return (
    <AppShell breadcrumbs={[{ label: 'Citizen Portal', href: '/dashboard' }, { label: 'Report Receipt' }]}>
      <div className="w-full max-w-lg mx-auto py-8">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="w-11 h-11 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center">
              <Check className="w-5 h-5 text-brand-600" />
            </div>

            <h1 className="mt-5 text-lg font-bold text-neutral-950">Report received</h1>
            <p className="mt-1.5 text-sm text-neutral-600">
              {receipt.routedTo
                ? `It has been routed to ${receipt.routedTo}.`
                : 'It is queued for manual assignment to an agency.'}
            </p>

            <dl className="mt-6 space-y-3">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3.5">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  Reference number
                </dt>
                <dd className="mt-1 font-mono text-base font-bold text-neutral-950 break-all">
                  {receipt.referenceNumber}
                </dd>
              </div>

              {receipt.trackingCode && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3.5">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                    Tracking code
                  </dt>
                  <dd className="mt-1 font-mono text-base font-bold text-neutral-950 break-all">
                    {receipt.trackingCode}
                  </dd>
                </div>
              )}
            </dl>

            {receipt.trackingCode && (
              <div
                role="alert"
                className="mt-4 flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <p>
                  Save both values now. Only a hash of the tracking code is stored, so it
                  cannot be shown again or recovered — without it you will not be able to
                  track this report.
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" onClick={() => void copyBoth()}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy details'}
              </Button>
              <Link href="/track" className="flex-1">
                <Button variant="primary" className="w-full">
                  Track this report
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
