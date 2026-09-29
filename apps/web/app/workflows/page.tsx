'use client';
import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus, ArrowRight } from 'lucide-react';

export default function WorkflowsBuilderPage() {
  const workflows = [
    {
      id: 'WF-STANDARD-01',
      name: 'STANDARD_INCIDENT_WORKFLOW',
      version: 1,
      initialState: 'SUBMITTED',
      states: ['SUBMITTED', 'TRIAGED', 'UNDER_INVESTIGATION', 'PENDING_SUPERVISOR_REVIEW', 'RESOLVED', 'ARCHIVED'],
      isActive: true,
      lastModified: '15 Sep 2026',
    },
    {
      id: 'WF-ESCALATION-02',
      name: 'CRITICAL_INFRASTRUCTURE_FAST_TRACK',
      version: 2,
      initialState: 'ALERT_RECEIVED',
      states: ['ALERT_RECEIVED', 'IMMEDIATE_DISPATCH', 'JOINT_TASKFORCE', 'EXECUTIVE_BRIEFING', 'CLOSED'],
      isActive: true,
      lastModified: '22 Sep 2026',
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Workflow State Machines' }]}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Workflow State Machine Definitions</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Decoupled lifecycle state machine engine governing report intake and case transitions.
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Create Workflow Model
        </Button>
      </div>

      <div className="space-y-4">
        {workflows.map((wf) => (
          <Card key={wf.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-900">{wf.id}</span>
                  <Badge status="success">Active v{wf.version}</Badge>
                </div>
                <CardTitle className="text-base mt-1">{wf.name}</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                Edit States
              </Button>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 overflow-x-auto">
                <div className="flex items-center gap-2 text-xs">
                  {wf.states.map((st, idx) => (
                    <React.Fragment key={st}>
                      <span className="px-2.5 py-1 rounded bg-neutral-white border border-neutral-300 font-mono font-medium text-neutral-800 shadow-2xs whitespace-nowrap">
                        {st}
                      </span>
                      {idx < wf.states.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
