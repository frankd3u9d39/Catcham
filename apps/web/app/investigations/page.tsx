'use client';
import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Search, Filter } from 'lucide-react';

export default function InvestigationsLedgerPage() {
  const cases = [
    {
      id: 'CAS-2026-0042',
      title: 'Crude Oil Bunkering & Pipeline Diversion Investigation',
      leadAgency: 'EFCC / NPF Joint Taskforce',
      leadInvestigator: 'Oladipo Adeleke',
      priority: 'CRITICAL',
      status: 'UNDER_INVESTIGATION',
      tasksCompleted: 4,
      tasksTotal: 6,
      created: '29 Sep 2026',
    },
    {
      id: 'CAS-2026-0038',
      title: 'Procurement Fraud at Regional River Basin Authority',
      leadAgency: 'EFCC Financial Crimes Directorate',
      leadInvestigator: 'Fatima Sanusi',
      priority: 'HIGH',
      status: 'EVIDENCE_REVIEW',
      tasksCompleted: 8,
      tasksTotal: 10,
      created: '24 Sep 2026',
    },
    {
      id: 'CAS-2026-0031',
      title: 'Distribution of Substandard Electrical Transformers in Kaduna Zonal Grid',
      leadAgency: 'NERC Regulatory Compliance Inspectorate',
      leadInvestigator: 'Chukwuma Eze',
      priority: 'MEDIUM',
      status: 'SUPERVISOR_REVIEW',
      tasksCompleted: 5,
      tasksTotal: 5,
      created: '18 Sep 2026',
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Investigations' }]}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Active Investigations & Cases</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Multi-agency case management, team assignments, and collaborative taskforces.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-neutral-100 text-neutral-900 uppercase font-semibold text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Case Number</th>
                  <th className="py-3 px-4">Case Title</th>
                  <th className="py-3 px-4">Lead Agency & Officer</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Milestones</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">{c.id}</td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-semibold text-neutral-900">{c.title}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-neutral-900 block">{c.leadAgency}</strong>
                      <span className="text-[11px] text-neutral-400">Lead: {c.leadInvestigator}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={c.priority === 'CRITICAL' ? 'error' : c.priority === 'HIGH' ? 'warning' : 'info'}>
                        {c.priority}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status="success">{c.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 font-mono">
                      {c.tasksCompleted}/{c.tasksTotal} tasks
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/investigations/${c.id}`}>
                        <Button variant="outline" size="sm">
                          Open Workspace
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
