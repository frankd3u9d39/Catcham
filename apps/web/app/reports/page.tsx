'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowRight, ShieldCheck, MapPin, Calendar } from 'lucide-react';

export default function ReportsLedgerPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const reports = [
    {
      id: 'CTM-2026-9021',
      title: 'Illegal valve installation and pipeline tapping on Bonny River branch',
      category: 'INFRASTRUCTURE_VANDALISM',
      state: 'Rivers',
      lga: 'Port Harcourt',
      status: 'UNDER_REVIEW',
      isAnonymous: true,
      submittedAt: '28 Sep 2026, 14:35',
      evidenceCount: 2,
    },
    {
      id: 'CTM-2026-8814',
      title: 'Diversion of public health medical supplies destined for Primary Health Center',
      category: 'CORRUPTION',
      state: 'Kano',
      lga: 'Nasarawa',
      status: 'TRIAGED',
      isAnonymous: false,
      submittedAt: '27 Sep 2026, 11:20',
      evidenceCount: 4,
    },
    {
      id: 'CTM-2026-8742',
      title: 'Counterfeit electrical circuit breakers imported through regional dry port',
      category: 'ENERGY',
      state: 'Kaduna',
      lga: 'Kaduna South',
      status: 'ASSIGNED',
      isAnonymous: true,
      submittedAt: '26 Sep 2026, 09:45',
      evidenceCount: 1,
    },
    {
      id: 'CTM-2026-8690',
      title: 'Toxic chemical discharge into municipal water tributary by manufacturing unit',
      category: 'ENVIRONMENTAL_HAZARD',
      state: 'Lagos',
      lga: 'Ikeja',
      status: 'UNDER_REVIEW',
      isAnonymous: true,
      submittedAt: '25 Sep 2026, 16:15',
      evidenceCount: 3,
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Reports Ledger' }]}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Incident Reports Ledger</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Incoming whistleblower and citizen incident reports across all 36 States and FCT.
          </p>
        </div>
        <Link href="/report">
          <Button variant="primary" size="sm">
            Manual Incident Intake
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Search reference numbers, incident keywords, states, or LGAs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-white border border-neutral-200 rounded-lg text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1.5" />
              Filter Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-neutral-100 text-neutral-900 uppercase font-semibold text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Incident Summary</th>
                  <th className="py-3 px-4">Jurisdiction</th>
                  <th className="py-3 px-4">Channel Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">{r.id}</td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-semibold text-neutral-900 truncate">{r.title}</p>
                      <span className="text-[11px] text-neutral-400">{r.category}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-neutral-800">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{r.state}, {r.lga}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={r.isAnonymous ? 'info' : 'success'}>
                        {r.isAnonymous ? 'Anonymous' : 'Identified'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={r.status === 'UNDER_REVIEW' ? 'warning' : 'success'}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px]">{r.submittedAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/investigations/CAS-2026-0042`}>
                        <Button variant="outline" size="sm">
                          Triage & Route
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
