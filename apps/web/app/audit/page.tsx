'use client';
import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, FileStack, Lock } from 'lucide-react';

export default function AuditLedgerPage() {
  const auditLogs = [
    {
      id: 'aud-98214',
      action: 'EVIDENCE_INSPECTED',
      resource: 'Evidence/evi-101',
      actor: 'oladipo.adeleke@efcc.gov.ng',
      ip: '105.112.45.12',
      timestamp: '29 Sep 2026, 11:15:20',
      reason: 'Forensic inspection of photo metadata for CAS-2026-0042',
    },
    {
      id: 'aud-98213',
      action: 'CASE_ASSIGNED',
      resource: 'Investigation/CAS-2026-0042',
      actor: 'supervisor.sanusi@efcc.gov.ng',
      ip: '105.112.12.80',
      timestamp: '29 Sep 2026, 09:30:05',
      reason: 'Assigned Lead Investigator Oladipo Adeleke',
    },
    {
      id: 'aud-98212',
      action: 'EVIDENCE_HASH_VERIFIED',
      resource: 'Evidence/evi-101',
      actor: 'SYSTEM_DAEMON',
      ip: '127.0.0.1',
      timestamp: '28 Sep 2026, 14:35:48',
      reason: 'Intake SHA-256 match confirmation',
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Audit Trail' }]}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Append-Only Judicial Compliance Audit Trail</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Guaranteed tamper-evident write-only security log for court review and oversight.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status="success">Cryptographic Lock Active</Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-neutral-100 text-neutral-900 uppercase font-semibold text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Reason / Context</th>
                  <th className="py-3 px-4 font-mono">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">{log.id}</td>
                    <td className="py-3.5 px-4">
                      <Badge status="info">{log.action}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">{log.resource}</td>
                    <td className="py-3.5 px-4 font-medium text-neutral-900">{log.actor}</td>
                    <td className="py-3.5 px-4 text-neutral-600 max-w-sm truncate">{log.reason}</td>
                    <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">{log.timestamp}</td>
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
