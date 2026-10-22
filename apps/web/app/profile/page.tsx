'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  FileSearch,
  FileText,
  KeyRound,
  Laptop,
  Lock,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';

export default function ProfilePage() {
  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Citizen Portal', href: '/dashboard' }, { label: 'Complainant Profile' }]}>
        <ProfileContent />
      </AppShell>
    </RequireAuth>
  );
}

function ProfileContent() {
  const { user } = useAuth();

  const sovereignId = user?.id ? `CTM-SEC-${user.id.substring(0, 8).toUpperCase()}` : 'CTM-SEC-882194';
  const roleName = user?.roleCodes && user.roleCodes.length > 0
    ? user.roleCodes.join(', ')
    : 'Verified Complainant / Citizen Subscriber';

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header Banner */}
      <Card className="border-neutral-200 shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-neutral-950 via-[#071912] to-neutral-900 text-white p-6 sm:p-8 border-b border-emerald-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600/30 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 text-2xl font-bold shrink-0">
                {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Citizen Complainant</span>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                  {user?.fullName || 'Anonymous Citizen'}
                </CardTitle>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 font-mono">
                  Sovereign Token ID: <span className="text-emerald-400 font-bold">{sovereignId}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/settings">
                <Button variant="outline" size="sm" className="gap-2 border-neutral-700 text-neutral-200 hover:bg-neutral-800 cursor-pointer">
                  <KeyRound className="w-4 h-4" />
                  <span>Security & Password</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Identity & Legal Security Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-neutral-500">Legal Protection</div>
                <div className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mt-0.5">
                  <span>DICON Statutory Safe</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-neutral-500">Encryption Standard</div>
                <div className="text-sm font-bold text-neutral-900 mt-0.5">
                  AES-256 GCM Cloud Vault
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-neutral-500">NIN Verification</div>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">
                  Integrated & Sovereign
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details List */}
          <div className="rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-200">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-neutral-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono uppercase text-neutral-500">Full Legal Name</div>
                  <div className="text-sm font-semibold text-neutral-900 mt-0.5">
                    {user?.fullName || 'Not specified'}
                  </div>
                </div>
              </div>
              <Badge status="success" className="text-xs self-start sm:self-auto">
                Verified Citizen
              </Badge>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono uppercase text-neutral-500">Registered Email</div>
                  <div className="text-sm font-semibold text-neutral-900 mt-0.5">
                    {user?.email || 'N/A'}
                  </div>
                </div>
              </div>
              <Badge status="neutral" className="text-xs self-start sm:self-auto">
                Primary Contact
              </Badge>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neutral-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono uppercase text-neutral-500">Assigned Platform Role</div>
                  <div className="text-sm font-semibold text-neutral-900 mt-0.5">
                    {roleName}
                  </div>
                </div>
              </div>
              <Badge status="info" className="text-xs self-start sm:self-auto">
                Active Tier
              </Badge>
            </div>
          </div>

          {/* Quick Hub Portals */}
          <div className="pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3 font-semibold">
              Quick Portals & Account Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/complaints" className="group">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-2.5 text-neutral-900 font-bold text-sm group-hover:text-emerald-700">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>My Complaints</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Manage and review milestones for all submitted incidents.
                  </p>
                </div>
              </Link>

              <Link href="/track" className="group">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-2.5 text-neutral-900 font-bold text-sm group-hover:text-emerald-700">
                    <FileSearch className="w-4 h-4 text-emerald-600" />
                    <span>Track Complaint</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Lookup 8-stage intelligence lifecycle tracking in real-time.
                  </p>
                </div>
              </Link>

              <Link href="/credicorp" className="group">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-2.5 text-neutral-900 font-bold text-sm group-hover:text-emerald-700">
                    <Laptop className="w-4 h-4 text-emerald-600" />
                    <span>CREDICORP C.L.I.C.K.D</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Federal consumer credit device financing applications.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
