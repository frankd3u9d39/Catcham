'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  FilePlus,
  KeyRound,
  Lock,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WhistleblowerVaultPage() {
  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Citizen Portal', href: '/dashboard' }, { label: 'Whistleblower Vault' }]}>
        <div className="space-y-6 max-w-5xl pb-12">
          {/* Main Card */}
          <Card className="border-neutral-200 shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-neutral-950 via-[#071912] to-neutral-900 text-white p-6 sm:p-8 border-b border-emerald-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>SOVEREIGN CRYPTOGRAPHIC VAULT & ANONYMITY STANDARD</span>
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
                    <Shield className="w-7 h-7 text-emerald-400" />
                    <span>Whistleblower Vault & Legal Protection Guarantee</span>
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-3xl leading-relaxed">
                    Submissions committed to the CATCH-AM platform benefit from sovereign protection under the Defence Industries Corporation of Nigeria (DICON/CATCH-AM) statutory framework.
                  </p>
                </div>

                <Link href="/report">
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-2 bg-[#006B3C] hover:bg-[#005731] cursor-pointer shadow-md shrink-0"
                  >
                    <FilePlus className="w-4 h-4" />
                    <span>Open Secure Intake Form</span>
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h5 className="font-bold text-neutral-950 text-sm">Cryptographic Data Stripping</h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    All IP addresses, browser fingerprints, and hardware identifiers are cryptographically stripped before incident ingestion. Only raw hashed payloads reach intake triage desks.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h5 className="font-bold text-neutral-950 text-sm">Private Tracking Tokens</h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Complainants can monitor investigation milestones anonymously using their unique private tracking tokens without disclosing personal identification to field investigators.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h5 className="font-bold text-neutral-950 text-sm">Statutory Immunity</h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Good-faith civic reporting is shielded under Federal whistleblower protection provisions. Inter-agency investigators are bound by severe legal penalties against unauthorized disclosure.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Ready to submit an encrypted report?</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  You can choose to link disclosures to your complainant account for direct push notifications, or select complete anonymity with one click.
                </p>
                <Link href="/report">
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-2 bg-[#006B3C] hover:bg-[#005731] cursor-pointer"
                  >
                    <FilePlus className="w-4 h-4" />
                    <span>Lodge Anonymous or Verified Report</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
