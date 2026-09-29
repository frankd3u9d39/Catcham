'use client';
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { CaseWorkspaceHeader } from '@/components/business/case-header';
import { WorkflowStepper } from '@/components/business/workflow-stepper';
import { EvidenceCard } from '@/components/business/evidence-card';
import { DigitalChainOfCustodyTimeline } from '@/components/business/custody-timeline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, FileText, CheckCircle2 } from 'lucide-react';

export default function InvestigationWorkspaceDetail({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'tasks' | 'notes' | 'custody'>('overview');
  const [noteContent, setNoteContent] = useState('');

  const caseId = params.id || 'CAS-2026-0042';

  const workflowSteps = [
    { id: '1', label: 'Report Triaged', timestamp: '28 Sep 2026' },
    { id: '2', label: 'Case Initiated', timestamp: '29 Sep 2026' },
    { id: '3', label: 'Under Investigation', timestamp: 'Current State' },
    { id: '4', label: 'Supervisor Review' },
    { id: '5', label: 'Case Closed' },
  ];

  const custodyRecords = [
    {
      id: 'c-1',
      action: 'INTAKE' as const,
      performedBy: 'Triage Officer Ibrahim',
      reason: 'Citizen upload via mobile app intake',
      timestamp: '28 Sep 2026, 14:35',
      ipAddress: '105.112.45.12',
    },
    {
      id: 'c-2',
      action: 'TRANSFERRED' as const,
      performedBy: 'Triage Officer Ibrahim',
      transferredTo: 'Lead Investigator Adeleke',
      reason: 'Assigned to South-South zonal command',
      timestamp: '29 Sep 2026, 09:30',
    },
    {
      id: 'c-3',
      action: 'VIEWED' as const,
      performedBy: 'Lead Investigator Adeleke',
      reason: 'Forensic inspection of photo metadata',
      timestamp: '29 Sep 2026, 11:15',
    },
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Investigations', href: '/investigations' },
        { label: caseId },
      ]}
    >
      {/* Pinned Case Banner Header */}
      <CaseWorkspaceHeader
        caseNumber={caseId}
        title="Crude Oil Pipeline Diversion & Bunkering Investigation"
        priority="CRITICAL"
        status="UNDER_INVESTIGATION"
        leadAgency="EFCC / NPF Joint Taskforce"
        leadInvestigator="Oladipo Adeleke"
        incidentDate="28 Sep 2026"
        onAssign={() => alert('Open team assignment modal')}
        onEscalate={() => alert('Open case escalation dialog')}
        onAdvanceWorkflow={() => alert('Advance state machine to Supervisor Review')}
      />

      {/* Workspace Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-200 mb-6 overflow-x-auto">
        {[
          { key: 'overview', label: 'Case Overview' },
          { key: 'evidence', label: 'Evidence Vault (3)' },
          { key: 'tasks', label: 'Action Checklist (5)' },
          { key: 'notes', label: 'Confidential Notes (4)' },
          { key: 'custody', label: 'Chain of Custody' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stepper Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Investigation Workflow Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowStepper steps={workflowSteps} currentStepIndex={2} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Incident Narrative Dossier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-neutral-700 leading-relaxed">
                  <p>
                    On 28 September 2026, an anonymous whistleblower submitted an alert regarding high-pressure pipeline tapping equipment installed along the riverine corridor near Port Harcourt. Multiple transport barges were observed loading unmetered crude late in the night.
                  </p>
                  <p>
                    PostGIS coordinate analysis confirmed the location falls inside the critical Niger Delta Energy Corridor jurisdiction under joint surveillance mandate.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Participating Agencies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="p-2.5 bg-neutral-50 rounded-lg flex items-center justify-between">
                    <span>EFCC Financial Unit</span>
                    <Badge status="success">Lead</Badge>
                  </div>
                  <div className="p-2.5 bg-neutral-50 rounded-lg flex items-center justify-between">
                    <span>Nigeria Police Force (Marine)</span>
                    <Badge status="info">Collaborating</Badge>
                  </div>
                  <div className="p-2.5 bg-neutral-50 rounded-lg flex items-center justify-between">
                    <span>NERC Energy Inspection</span>
                    <Badge status="neutral">Observer</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-900">Cryptographically Registered Assets</h3>
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Intake New Evidence
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EvidenceCard
              id="evi-1"
              originalFileName="pipeline_valve_tampering_photo.jpg"
              fileSizeBytes={3492810}
              mimeType="image/jpeg"
              sha256Hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
              classification="RESTRICTED"
              uploadedAt="28 Sep 2026, 14:35"
              uploadedBy="Citizen Whistleblower"
              hasAiAnalysis={true}
              onViewCustodyTrail={() => setActiveTab('custody')}
            />

            <EvidenceCard
              id="evi-2"
              originalFileName="surveillance_drone_feed_segment.mp4"
              fileSizeBytes={42949672}
              mimeType="video/mp4"
              sha256Hash="a8f5c1e345b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b"
              classification="TOP_SECRET"
              uploadedAt="29 Sep 2026, 10:12"
              uploadedBy="Investigator Adeleke"
              hasAiAnalysis={false}
              onViewCustodyTrail={() => setActiveTab('custody')}
            />
          </div>
        </div>
      )}

      {/* TAB 3: TASKS */}
      {activeTab === 'tasks' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Action Checklist</CardTitle>
            <Button variant="outline" size="sm">Add Task</Button>
          </CardHeader>
          <CardContent className="divide-y divide-neutral-100 p-0 text-xs">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                <span className="line-through text-neutral-400">Perform GPS point-in-polygon verification in PostGIS</span>
              </div>
              <Badge status="success">Completed</Badge>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded text-brand-600" />
                <span className="font-semibold text-neutral-900">Subpoena port clearance records for barge C-784</span>
              </div>
              <Badge status="warning">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Add Confidential Case Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Log interviews, findings, tactical observations..."
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <Button variant="primary" size="sm">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Record Note in Case Dossier
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 5: CHAIN OF CUSTODY */}
      {activeTab === 'custody' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Immutable Digital Chain of Custody Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <DigitalChainOfCustodyTimeline records={custodyRecords} />
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
