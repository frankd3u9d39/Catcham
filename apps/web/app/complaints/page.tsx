'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Copy,
  Eye,
  FilePlus,
  FileSearch,
  FileText,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { firestoreService } from '@/lib/firebase';
import { formatDateTime, humanise, statusBadge } from '@/lib/format';
import type { CitizenComplaint } from '@/components/portal/citizen-dashboard-view';

const LIFECYCLE_STAGES = [
  { step: 1, name: 'Reported', desc: 'Securely received' },
  { step: 2, name: 'Documented', desc: 'Metadata & Hash' },
  { step: 3, name: 'Triaged', desc: 'Threat Prioritized' },
  { step: 4, name: 'Routed', desc: 'Agency Assigned' },
  { step: 5, name: 'Investigating', desc: 'Active Fieldwork' },
  { step: 6, name: 'Evidence Vault', desc: 'Custody Chain' },
  { step: 7, name: 'Action Taken', desc: 'Enforcement' },
  { step: 8, name: 'Resolved', desc: 'Audit Closed' },
];

export default function MyComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<CitizenComplaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadComplaints() {
      try {
        const remoteReports = await firestoreService.getReports();

        const localRefs = new Set<string>();
        try {
          if (typeof window !== 'undefined') {
            const raw = window.localStorage.getItem('catcham.myReports');
            if (raw) {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                list.forEach((item: any) => {
                  if (typeof item === 'string') localRefs.add(item.toUpperCase());
                  else if (item?.referenceNumber) localRefs.add(String(item.referenceNumber).toUpperCase());
                });
              }
            }
          }
        } catch {}

        const userEmail = user?.email?.toLowerCase().trim();

        const userReports = remoteReports.filter((r) => {
          if (!r.referenceNumber) return false;
          if (localRefs.has(r.referenceNumber.toUpperCase())) return true;
          if (userEmail && r.contactEmail && r.contactEmail.toLowerCase().trim() === userEmail) {
            return true;
          }
          return false;
        });

        const formatted: CitizenComplaint[] = userReports.map((r) => ({
          id: r.id || `fs-${r.referenceNumber}`,
          referenceNumber: r.referenceNumber,
          trackingCode: r.trackingCode || 'STORED',
          title: r.title,
          category: r.category,
          assignedAgency: r.assignedAgency || 'Central Intake Desk (DICON/CATCH-AM)',
          state: r.state || 'National Domain',
          status: r.status,
          priority: r.priority || 'MEDIUM',
          submittedAt: r.submittedAt,
          updatedAt: r.updatedAt,
          currentStage: 1,
          timeline: r.timeline && r.timeline.length > 0 ? r.timeline : [
            {
              action: r.status,
              description: 'Record synced from Cloud Firestore.',
              at: r.submittedAt,
            },
          ],
        }));

        if (!cancelled) {
          setComplaints(formatted);
          if (formatted.length > 0) {
            setSelectedComplaint(formatted[0]);
          }
        }
      } catch (err) {
        console.error('Failed to sync complaints:', err);
      }
    }

    void loadComplaints();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const copyToClipboard = (text: string, id: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus === 'RESOLVED') return c.status === 'RESOLVED' || c.status === 'CLOSED';
    if (filterStatus === 'ACTIVE') return c.status !== 'RESOLVED' && c.status !== 'CLOSED';
    return true;
  });

  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Citizen Portal', href: '/dashboard' }, { label: 'My Complaints' }]}>
        <div className="space-y-6 pb-12">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>OFFICIAL COMPLAINANT DOSSIER</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-neutral-950">
                My Submitted Complaints
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                Review all incident disclosures committed under your citizen session with live inter-agency milestone updates.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/report">
                <Button variant="primary" className="gap-2 bg-[#006B3C] hover:bg-[#005731] shadow-sm cursor-pointer">
                  <FilePlus className="w-4 h-4" />
                  <span>Submit New Report</span>
                </Button>
              </Link>
              <Link href="/track">
                <Button variant="outline" className="gap-2 border-neutral-300 text-neutral-700 cursor-pointer">
                  <FileSearch className="w-4 h-4" />
                  <span>Track by Reference</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Active Milestone Inspector Modal/Card if a complaint is selected */}
          {selectedComplaint && (
            <Card className="border-emerald-500/30 shadow-md bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-neutral-950 via-[#071912] to-neutral-900 text-white p-5 sm:p-6 border-b border-emerald-900/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/40">
                        {selectedComplaint.referenceNumber}
                      </span>
                      <span className="text-xs text-neutral-300">· {selectedComplaint.category}</span>
                    </div>
                    <CardTitle className="text-lg font-bold font-serif text-white mt-1">
                      {selectedComplaint.title}
                    </CardTitle>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Assigned: <strong className="text-white">{selectedComplaint.assignedAgency}</strong> · Location: {selectedComplaint.state}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge status={statusBadge(selectedComplaint.status)}>
                      {humanise(selectedComplaint.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 font-mono">
                    8-Stage Sovereign Intelligence Lifecycle
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                    {LIFECYCLE_STAGES.map((s) => {
                      const isPassed = s.step <= selectedComplaint.currentStage;
                      const isCurrent = s.step === selectedComplaint.currentStage;

                      return (
                        <div
                          key={s.step}
                          className={`rounded-lg p-2 border text-center transition-all ${
                            isCurrent
                              ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                              : isPassed
                              ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                              : 'bg-white text-neutral-400 border-neutral-200'
                          }`}
                        >
                          <span className="block text-[11px] font-bold truncate">
                            {s.step}. {s.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 font-mono">
                    Verifiable Case Timeline & Activity Log
                  </h4>
                  <div className="space-y-2">
                    {selectedComplaint.timeline.map((event, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <strong className="text-neutral-900 font-semibold">{humanise(event.action)}</strong>
                          <p className="text-neutral-600 mt-0.5">{event.description}</p>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                          {formatDateTime(event.at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Complaints Table / List Card */}
          <Card className="border-neutral-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-neutral-950 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>Complaints Ledger ({complaints.length})</span>
                </CardTitle>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Direct tracking tokens and official custody chain for each submitted incident.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterStatus === 'ALL'
                      ? 'bg-white text-neutral-900 shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All ({complaints.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('ACTIVE')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterStatus === 'ACTIVE'
                      ? 'bg-white text-neutral-900 shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Active ({complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('RESOLVED')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterStatus === 'RESOLVED'
                      ? 'bg-white text-neutral-900 shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Resolved ({complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length})
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-neutral-200">
                {filteredComplaints.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto border border-neutral-200">
                      <Inbox className="w-7 h-7" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h4 className="text-base font-bold text-neutral-950">
                        No Complaints Lodged Yet
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        You have not submitted any incident reports. Once you file an encrypted report, its reference number, tracking token, and investigation milestones will appear here.
                      </p>
                    </div>
                    <Link href="/report">
                      <Button variant="primary" size="sm" className="gap-2 bg-[#006B3C] hover:bg-[#005731] cursor-pointer">
                        <FilePlus className="w-4 h-4" />
                        <span>Submit Your First Report</span>
                      </Button>
                    </Link>
                  </div>
                ) : (
                  filteredComplaints.map((c) => {
                    const isSelected = selectedComplaint?.id === c.id;

                    return (
                      <div
                        key={c.id}
                        className={`p-5 sm:p-6 transition-colors flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${
                          isSelected ? 'bg-emerald-50/50' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="space-y-1.5 min-w-0 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
                              {c.referenceNumber}
                            </span>
                            <span className="text-xs text-neutral-500 font-medium">{c.category}</span>
                            <span className="text-xs text-neutral-400">· {c.state}</span>
                          </div>

                          <h4 className="text-base font-bold text-neutral-950 leading-snug">
                            {c.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                            <span>
                              <strong className="text-neutral-800">Agency:</strong> {c.assignedAgency}
                            </span>
                            <span>
                              <strong className="text-neutral-800">Submitted:</strong> {formatDateTime(c.submittedAt)}
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-neutral-500">
                              <span>Token:</span>
                              <code>{c.trackingCode}</code>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(c.trackingCode, c.id)}
                                className="hover:text-emerald-700 ml-0.5 cursor-pointer"
                                title="Copy tracking token"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              {copiedCode === c.id && (
                                <span className="text-[10px] text-emerald-600 font-sans">Copied!</span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          <Badge status={statusBadge(c.status)}>{humanise(c.status)}</Badge>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono">
                            {c.priority}
                          </span>

                          <Button
                            size="sm"
                            variant={isSelected ? 'primary' : 'outline'}
                            onClick={() => setSelectedComplaint(c)}
                            className="gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isSelected ? 'Viewing Milestones' : 'Inspect Milestones'}</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
