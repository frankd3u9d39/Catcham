'use client';

import React from 'react';
import Link from 'next/link';
import {
  FilePlus,
  Radio,
  ShieldAlert,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SafetyBulletinsPage() {
  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Citizen Portal', href: '/dashboard' }, { label: 'Safety Bulletins' }]}>
        <div className="space-y-6 max-w-5xl pb-12">
          {/* Main Card */}
          <Card className="border-neutral-200 shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-neutral-950 via-[#1a0f0a] to-neutral-900 text-white p-6 sm:p-8 border-b border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>NATIONAL THREAT ADVISORY & CITIZEN SAFETY BULLETINS</span>
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
                    <ShieldAlert className="w-7 h-7 text-amber-400" />
                    <span>Public Safety Bulletins & Active Advisories</span>
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-3xl leading-relaxed">
                    Real-time threat intelligence and public security advisories verified by DICON/CATCH-AM joint command desks and partner security agencies across Nigerian corridors.
                  </p>
                </div>

                <Link href="/report">
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-2 bg-[#006B3C] hover:bg-[#005731] cursor-pointer shadow-md shrink-0"
                  >
                    <FilePlus className="w-4 h-4" />
                    <span>Lodge Intel / Report Incident</span>
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-red-200 bg-red-50/70 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-200 text-red-900">
                      CRITICAL ADVISORY · ALERT LEVEL 3
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">Updated 3h ago</span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">
                    Pipeline Right-of-Way Vigilance: Bonny-Eleme Corridor
                  </h4>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Heightened interdiction activity active. Citizens residing in oil terminal buffer zones are urged to immediately report unauthorized nocturnal heavy truck movements or suspicious excavation tools via CATCH-AM secure intake.
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-red-200/80">
                    <span className="text-xs font-bold text-red-800 font-mono">Target Area: Rivers / Delta</span>
                    <Link href="/report">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-800 hover:bg-red-100 text-xs font-bold cursor-pointer"
                      >
                        Lodge Intel &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      CYBER NOTICE · FRAUD IMPERSONATION
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">Active Standing Notice</span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">
                    Fraudulent Recruitment & Clearance Agents Alert
                  </h4>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Criminal syndicates are soliciting payments for fraudulent security clearance letters claiming DICON/CATCH-AM affiliation. All official disclosures and services are 100% free through this verified portal.
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-amber-200/80">
                    <span className="text-xs font-bold text-amber-900 font-mono">Scope: Nationwide</span>
                    <Link href="/report">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold cursor-pointer"
                      >
                        Report Impersonator &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                      TRANSIT SECURITY · CHECKPOINT PROTOCOL
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">Operational Notice</span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">
                    Northern Highway Freight & Customs Interdiction
                  </h4>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Joint checkpoint verifications expanded across Kaduna-Kano expressway corridors. Drivers and logistics coordinators are reminded to ensure manifests and vehicle papers are digitalized.
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-blue-200/80">
                    <span className="text-xs font-bold text-blue-900 font-mono">Corridor: North-West Link</span>
                    <span className="text-[11px] text-neutral-500 font-mono">DICON Desk Monitored</span>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      EMERGENCY COMMUNICATIONS HOTLINE
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">24/7 Rapid Response</span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">
                    Toll-Free Dispatch Lines & Encrypted Direct Messaging
                  </h4>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    For ongoing emergencies or imminent threats to public safety, reach the inter-agency dispatch desks directly:
                  </p>
                  <div className="rounded-lg bg-white p-3 border border-emerald-200 text-xs space-y-1 font-mono">
                    <p><strong className="text-neutral-900">National Emergency:</strong> 112 / 0800-CATCHAM</p>
                    <p><strong className="text-neutral-900">Official Email:</strong> diconcatcham@gmail.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
