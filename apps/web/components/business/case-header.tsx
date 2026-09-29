'use client';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ShieldAlert, ArrowUpRight, UserPlus, Clock } from 'lucide-react';

interface CaseWorkspaceHeaderProps {
  caseNumber: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
  leadAgency: string;
  leadInvestigator?: string;
  incidentDate: string;
  onAssign?: () => void;
  onEscalate?: () => void;
  onAdvanceWorkflow?: () => void;
}

export const CaseWorkspaceHeader: React.FC<CaseWorkspaceHeaderProps> = ({
  caseNumber,
  title,
  priority,
  status,
  leadAgency,
  leadInvestigator = 'Unassigned',
  incidentDate,
  onAssign,
  onEscalate,
  onAdvanceWorkflow,
}) => {
  const [copied, setCopied] = useState(false);

  const copyCaseNumber = () => {
    navigator.clipboard.writeText(caseNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const priorityStyles: Record<string, { status: 'success' | 'warning' | 'error' | 'info'; label: string }> = {
    LOW: { status: 'info', label: 'Low Priority' },
    MEDIUM: { status: 'warning', label: 'Medium Priority' },
    HIGH: { status: 'warning', label: 'High Priority' },
    CRITICAL: { status: 'error', label: 'Critical Priority' },
  };

  return (
    <div className="bg-neutral-white border border-neutral-200 rounded-xl p-6 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Case Identifiers */}
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md">
              {caseNumber}
            </span>
            <button
              onClick={copyCaseNumber}
              className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 rounded"
              title="Copy Case Reference"
            >
              {copied ? <Check className="w-4 h-4 text-brand-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <Badge status={priorityStyles[priority]?.status || 'info'}>
              {priorityStyles[priority]?.label || priority}
            </Badge>
            <Badge status="success">{status}</Badge>
          </div>

          <h1 className="text-2xl font-bold text-neutral-950 mt-2 tracking-tight">{title}</h1>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-neutral-500">
            <div>
              <span className="text-neutral-400">Lead Agency:</span>{' '}
              <strong className="text-neutral-800">{leadAgency}</strong>
            </div>
            <span>•</span>
            <div>
              <span className="text-neutral-400">Lead Investigator:</span>{' '}
              <strong className="text-neutral-800">{leadInvestigator}</strong>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Incident: {incidentDate}</span>
            </div>
          </div>
        </div>

        {/* Right: Operational Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
          <Button variant="outline" size="sm" onClick={onAssign}>
            <UserPlus className="w-4 h-4 mr-1 text-neutral-600" />
            Assign Team
          </Button>
          <Button variant="outline" size="sm" onClick={onEscalate} className="text-amber-800 hover:bg-amber-50 border-amber-200">
            <ShieldAlert className="w-4 h-4 mr-1 text-amber-600" />
            Escalate
          </Button>
          <Button variant="primary" size="sm" onClick={onAdvanceWorkflow}>
            Advance Workflow
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
