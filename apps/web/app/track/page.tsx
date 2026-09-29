'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WorkflowStepper } from '@/components/business/workflow-stepper';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, ArrowLeft, Clock } from 'lucide-react';

export default function ReportTrackingPortal() {
  const [refInput, setRefInput] = useState('CAT-2026-00000001');
  const [hasSearched, setHasSearched] = useState(false);

  const trackingSteps = [
    { id: '1', label: 'Report Received', timestamp: '28 Sep 2026, 14:35' },
    { id: '2', label: 'Under Review', timestamp: '28 Sep 2026, 16:10' },
    { id: '3', label: 'Assigned to Lead Agency', timestamp: '29 Sep 2026, 09:15' },
    { id: '4', label: 'Active Investigation', timestamp: 'In Progress' },
    { id: '5', label: 'Case Disposition', timestamp: 'Pending' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (refInput.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to CATCHAM Public Home</span>
        </Link>

        {/* Search Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 text-brand-600 text-xs font-semibold uppercase">
              <Shield className="w-4 h-4" />
              <span>Public Inquiry Service</span>
            </div>
            <CardTitle className="text-2xl mt-1">Track Your Whistleblower Report</CardTitle>
            <CardDescription>
              Enter the unique reference code issued to you upon report submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="e.g. CAT-2026-00000001"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  className="font-mono text-base"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="shrink-0">
                <Search className="w-4 h-4 mr-1.5" />
                Track Report
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tracking Result View */}
        {hasSearched && (
          <Card className="animate-in fade-in duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-neutral-500 uppercase">Status Dossier</span>
                <CardTitle className="text-xl font-mono text-brand-700 mt-0.5">{refInput}</CardTitle>
              </div>
              <Badge status="warning">Active Investigation</Badge>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Stepper */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <WorkflowStepper steps={trackingSteps} currentStepIndex={3} />
              </div>

              {/* Status details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-neutral-100 rounded-lg">
                  <span className="text-neutral-400 block mb-1">Assigned Lead Agency</span>
                  <strong className="text-neutral-900 text-sm">Economic & Financial Crimes Commission (EFCC)</strong>
                </div>
                <div className="p-3.5 bg-neutral-100 rounded-lg">
                  <span className="text-neutral-400 block mb-1">Jurisdiction Resolved</span>
                  <strong className="text-neutral-900 text-sm">Rivers State Zonal Command</strong>
                </div>
              </div>

              {/* Confidentiality safe note */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-500 flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>To protect investigative integrity, tactical evidence details are confidential to authorized officers.</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
