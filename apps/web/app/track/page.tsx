'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Eye,
  FilePlus,
  FileSearch,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api-client';
import { firestoreService } from '@/lib/firebase';
import { formatDateTime, humanise, statusBadge } from '@/lib/format';
import type { PublicReportStatus } from '@/lib/types';
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

export default function TrackReportPage() {
  const { user } = useAuth();
  const [searchRef, setSearchRef] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<PublicReportStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userComplaints, setUserComplaints] = useState<CitizenComplaint[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync user's stored complaints for quick-track buttons
  useEffect(() => {
    async function loadUserComplaints() {
      try {
        const remoteReports = await firestoreService.getReports();
        const userEmail = user?.email?.toLowerCase().trim();
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

        const matched = remoteReports.filter((r) => {
          if (!r.referenceNumber) return false;
          if (localRefs.has(r.referenceNumber.toUpperCase())) return true;
          if (userEmail && r.contactEmail && r.contactEmail.toLowerCase().trim() === userEmail) {
            return true;
          }
          return false;
        });

        setUserComplaints(
          matched.map((r) => ({
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
                description: 'Record retrieved live from Cloud Firestore database.',
                at: r.submittedAt,
              },
            ],
          }))
        );
      } catch (err) {
        console.error('Error fetching complaints for tracking:', err);
      }
    }

    void loadUserComplaints();
  }, [user?.email]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    setErrorMsg(null);
    setIsLoading(true);

    // 1. Check local list
    const found = userComplaints.find(
      (c) => c.referenceNumber.toUpperCase() === searchRef.trim().toUpperCase()
    );
    if (found) {
      setTrackingResult({
        referenceNumber: found.referenceNumber,
        title: found.title,
        categoryName: found.category,
        status: found.status,
        submittedAt: found.submittedAt,
        updatedAt: found.updatedAt,
        timeline: found.timeline,
      });
      setIsLoading(false);
      return;
    }

    // 2. Check API
    try {
      const result = await api.public<PublicReportStatus>('/public/reports/track', {
        method: 'POST',
        body: {
          referenceNumber: searchRef.trim().toUpperCase(),
          trackingCode: searchCode.trim().toUpperCase(),
        },
      });
      setTrackingResult(result);
    } catch {
      // 3. Fallback to Cloud Firestore
      try {
        const firestoreDoc = await firestoreService.getReportByReference(searchRef.trim());
        if (firestoreDoc) {
          setTrackingResult({
            referenceNumber: firestoreDoc.referenceNumber,
            title: firestoreDoc.title,
            categoryName: firestoreDoc.category,
            status: firestoreDoc.status,
            submittedAt: firestoreDoc.submittedAt,
            updatedAt: firestoreDoc.updatedAt,
            timeline: firestoreDoc.timeline || [
              {
                action: firestoreDoc.status,
                description: 'Record retrieved live from Cloud Firestore database.',
                at: firestoreDoc.submittedAt,
              },
            ],
          });
          setIsLoading(false);
          return;
        }
      } catch (fErr) {
        console.error('Firestore tracking lookup failed:', fErr);
      }
      setErrorMsg(`No record found for reference number "${searchRef.trim().toUpperCase()}". Verify the reference number and try again.`);
      setTrackingResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreload = (c: CitizenComplaint) => {
    setSearchRef(c.referenceNumber);
    setSearchCode(c.trackingCode);
    setTrackingResult({
      referenceNumber: c.referenceNumber,
      title: c.title,
      categoryName: c.category,
      status: c.status,
      submittedAt: c.submittedAt,
      updatedAt: c.updatedAt,
      timeline: c.timeline,
    });
  };

  return (
    <AppShell breadcrumbs={[{ label: 'Citizen Portal', href: '/dashboard' }, { label: 'Track Complaint' }]}>
      <div className="space-y-6 max-w-5xl pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <FileSearch className="w-4 h-4 text-emerald-600" />
              <span>IMMUTABLE CASEWORK VERIFICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-neutral-950">
              Track Incident Report
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              Query the sovereign intelligence ledger in real-time. Follow inter-agency casework milestones from initial triage to tactical resolution.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/report">
              <Button variant="primary" className="gap-2 bg-[#006B3C] hover:bg-[#005731] shadow-sm cursor-pointer">
                <FilePlus className="w-4 h-4" />
                <span>Submit New Report</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Tracking Search Engine Card */}
        <Card className="border-neutral-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-neutral-900 text-white p-5 sm:p-6 border-b border-neutral-800">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Search & Query Engine</span>
            </CardTitle>
            <p className="text-xs text-neutral-300 mt-0.5">
              Enter the official report reference issued at submission.
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase font-mono">
                  Report Reference Number <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. CTM-2026-B7ABA1"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  className="font-mono text-sm uppercase"
                  required
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase font-mono">
                  Tracking Token (Optional)
                </label>
                <Input
                  placeholder="e.g. TK-9921-X4"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full gap-2 cursor-pointer bg-[#006B3C] hover:bg-[#005731]"
                  isLoading={isLoading}
                >
                  <Search className="w-4 h-4" />
                  <span>Verify Status</span>
                </Button>
              </div>
            </form>

            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
                {errorMsg}
              </div>
            )}

            {/* Quick-track buttons from user's account */}
            {userComplaints.length > 0 && (
              <div className="pt-2 border-t border-neutral-100">
                <p className="text-[11px] font-mono font-bold uppercase text-neutral-500 mb-2">
                  Quick Select From Your Recent Submissions ({userComplaints.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {userComplaints.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectPreload(c)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-emerald-50 hover:border-emerald-300 text-xs text-neutral-700 font-mono transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span className="font-bold text-emerald-800">{c.referenceNumber}</span>
                      <span className="text-neutral-400 font-sans truncate max-w-[150px]">
                        {c.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Milestone Results */}
        {trackingResult ? (
          <Card className="border-emerald-500/30 shadow-md bg-white overflow-hidden animate-in fade-in duration-200">
            <CardHeader className="bg-gradient-to-r from-neutral-950 via-[#071912] to-neutral-900 text-white p-5 sm:p-6 border-b border-emerald-900/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/40">
                      {trackingResult.referenceNumber}
                    </span>
                    <span className="text-xs text-neutral-300">· {trackingResult.categoryName}</span>
                  </div>
                  <CardTitle className="text-xl font-bold font-serif text-white mt-1.5">
                    {trackingResult.title}
                  </CardTitle>
                  <p className="text-xs text-neutral-400 mt-1">
                    Submitted: {formatDateTime(trackingResult.submittedAt)}
                  </p>
                </div>

                <Badge status={statusBadge(trackingResult.status)}>
                  {humanise(trackingResult.status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* 8-Stage Lifecycle Visualization */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 font-mono">
                  8-Stage Sovereign Intelligence Lifecycle
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {LIFECYCLE_STAGES.map((s) => {
                    return (
                      <div
                        key={s.step}
                        className={`rounded-lg p-2.5 border text-center transition-all ${
                          s.step === 1
                            ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-neutral-400 border-neutral-200'
                        }`}
                      >
                        <p className={`text-[11px] font-bold truncate ${s.step === 1 ? 'text-white' : ''}`}>
                          {s.step}. {s.name}
                        </p>
                        <p className={`text-[9px] mt-0.5 truncate ${s.step === 1 ? 'text-emerald-100' : 'text-neutral-500'}`}>
                          {s.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline Milestones */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 font-mono">
                  Verifiable Timeline Milestones & Audit Log
                </h4>
                <div className="space-y-3">
                  {trackingResult.timeline.map((entry, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <strong className="text-neutral-900 font-bold text-sm block">
                          {humanise(entry.action)}
                        </strong>
                        <p className="text-neutral-600 leading-relaxed">{entry.description}</p>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400 shrink-0 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{formatDateTime(entry.at)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
              <FileSearch className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="text-sm font-bold text-neutral-900">No Report Currently Queried</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Enter your reference number in the box above or pick one from your submissions to view its custody chain and live field progress.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
