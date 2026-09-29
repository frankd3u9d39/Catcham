'use client';
import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, AlertTriangle, Clock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function InvestigatorDashboard() {
  const activeCases = [
    {
      id: 'CAS-2026-0042',
      title: 'Crude Oil Bunkering & Pipeline Diversion',
      agency: 'EFCC / NPF Joint Taskforce',
      priority: 'CRITICAL',
      status: 'UNDER_INVESTIGATION',
      dueDate: 'Today, 18:00',
    },
    {
      id: 'CAS-2026-0038',
      title: 'Procurement Fraud at Regional River Basin Authority',
      agency: 'EFCC Financial Crimes',
      priority: 'HIGH',
      status: 'EVIDENCE_REVIEW',
      dueDate: 'Tomorrow',
    },
    {
      id: 'CAS-2026-0031',
      title: 'Distribution of Substandard Electrical Transformers',
      agency: 'NERC Regulatory Oversight',
      priority: 'MEDIUM',
      status: 'SUPERVISOR_REVIEW',
      dueDate: '04 Oct 2026',
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Dashboard' }]}>
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Good morning, Investigator Adeleke</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Zonal Command: South-South Operations (Rivers & Bayelsa) • 4 cases require urgent action
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/reports">
            <Button variant="outline" size="sm">Triage Ledger</Button>
          </Link>
          <Link href="/investigations">
            <Button variant="primary" size="sm">All Cases</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">Assigned Cases</p>
              <h3 className="text-2xl font-bold text-neutral-950 mt-1">14</h3>
              <span className="text-[11px] text-brand-600 font-medium">3 Lead Investigator roles</span>
            </div>
            <div className="p-3 bg-brand-50 rounded-lg text-brand-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">Due Today</p>
              <h3 className="text-2xl font-bold text-neutral-950 mt-1">2</h3>
              <span className="text-[11px] text-amber-700 font-medium">Court filings pending</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">High Priority</p>
              <h3 className="text-2xl font-bold text-neutral-950 mt-1">4</h3>
              <span className="text-[11px] text-red-700 font-medium">Critical infrastructure</span>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">Evidence Vaulted</p>
              <h3 className="text-2xl font-bold text-neutral-950 mt-1">48</h3>
              <span className="text-[11px] text-brand-600 font-medium">100% SHA-256 verified</span>
            </div>
            <div className="p-3 bg-brand-50 rounded-lg text-brand-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace Layout (2 Columns: Active Cases + Task Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Cases Ledger */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Priority Cases Assigned to You</CardTitle>
              <Link href="/investigations" className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="divide-y divide-neutral-100 p-0">
              {activeCases.map((c) => (
                <div key={c.id} className="p-4 hover:bg-neutral-50/80 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-900">{c.id}</span>
                      <Badge status={c.priority === 'CRITICAL' ? 'error' : c.priority === 'HIGH' ? 'warning' : 'info'}>
                        {c.priority}
                      </Badge>
                      <Badge status="success">{c.status}</Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-neutral-900">{c.title}</h4>
                    <p className="text-xs text-neutral-400">{c.agency} • Due: {c.dueDate}</p>
                  </div>

                  <Link href={`/investigations/${c.id}`}>
                    <Button variant="outline" size="sm">
                      Inspect
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Operational Tasks Checklist */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Immediate Tasks Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-neutral-500">CAS-2026-0042</span>
                  <span className="text-[10px] text-red-600 font-semibold">Today</span>
                </div>
                <p className="text-xs font-semibold text-neutral-900">Sign off on AI transcription transcript of witness audio.</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-neutral-500">CAS-2026-0038</span>
                  <span className="text-[10px] text-amber-600 font-semibold">Tomorrow</span>
                </div>
                <p className="text-xs font-semibold text-neutral-900">Transfer physical valve sample to Port Harcourt Forensic Lab.</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-neutral-500">CAS-2026-0031</span>
                  <span className="text-[10px] text-neutral-500">03 Oct</span>
                </div>
                <p className="text-xs font-semibold text-neutral-900">Prepare briefing notes for Supervisor review meeting.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
