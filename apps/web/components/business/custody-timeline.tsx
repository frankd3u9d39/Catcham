import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowRightLeft, Eye, Download, Cpu, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CustodyRecordItem {
  id: string;
  action: 'INTAKE' | 'TRANSFERRED' | 'VIEWED' | 'EXPORTED' | 'AI_PROCESSED' | 'SEALED';
  performedBy: string;
  transferredTo?: string;
  reason: string;
  timestamp: string;
  ipAddress?: string;
}

interface DigitalChainOfCustodyTimelineProps {
  records: CustodyRecordItem[];
  className?: string;
}

export const DigitalChainOfCustodyTimeline: React.FC<DigitalChainOfCustodyTimelineProps> = ({
  records,
  className,
}) => {
  const actionConfig: Record<string, { label: string; icon: React.ReactNode; badge: 'success' | 'warning' | 'info' | 'confidential' }> = {
    INTAKE: { label: 'Evidence Intake & Hashing', icon: <Shield className="w-4 h-4 text-brand-600" />, badge: 'success' },
    TRANSFERRED: { label: 'Custody Transferred', icon: <ArrowRightLeft className="w-4 h-4 text-amber-600" />, badge: 'warning' },
    VIEWED: { label: 'Evidence Inspected', icon: <Eye className="w-4 h-4 text-slate-600" />, badge: 'info' },
    EXPORTED: { label: 'Court Export Created', icon: <Download className="w-4 h-4 text-slate-700" />, badge: 'info' },
    AI_PROCESSED: { label: 'AI OCR & Analysis Queued', icon: <Cpu className="w-4 h-4 text-indigo-600" />, badge: 'confidential' },
    SEALED: { label: 'Evidence Sealed / Locked', icon: <Lock className="w-4 h-4 text-red-600" />, badge: 'warning' },
  };

  return (
    <div className={cn('relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200', className)}>
      {records.map((record) => {
        const config = actionConfig[record.action] || {
          label: record.action,
          icon: <Shield className="w-4 h-4" />,
          badge: 'info' as const,
        };

        return (
          <div key={record.id} className="relative group">
            {/* Dot / Icon */}
            <div className="absolute -left-6 top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-neutral-white border-2 border-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            </div>

            {/* Entry Box */}
            <div className="bg-neutral-white border border-neutral-200 rounded-lg p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {config.icon}
                  <h4 className="text-sm font-semibold text-neutral-900">{config.label}</h4>
                </div>
                <Badge status={config.badge}>{record.action}</Badge>
              </div>

              <p className="mt-2 text-xs text-neutral-700">
                <strong>Reason:</strong> {record.reason}
              </p>

              <div className="mt-3 pt-2.5 border-t border-neutral-100 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 font-mono">
                <div>
                  Actor: <span className="text-neutral-800 font-semibold">{record.performedBy}</span>
                  {record.transferredTo && <span> → {record.transferredTo}</span>}
                </div>
                <div>
                  <span>{record.timestamp}</span>
                  {record.ipAddress && <span className="ml-2 text-neutral-400">({record.ipAddress})</span>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
