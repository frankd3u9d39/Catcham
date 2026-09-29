'use client';
import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield } from 'lucide-react';

export default function UsersDirectoryPage() {
  const users = [
    {
      name: 'Oladipo Adeleke',
      email: 'oladipo.adeleke@efcc.gov.ng',
      agency: 'EFCC',
      role: 'Lead Investigator',
      status: 'Active',
      mfa: 'Enabled',
    },
    {
      name: 'Fatima Sanusi',
      email: 'fatima.sanusi@efcc.gov.ng',
      agency: 'EFCC',
      role: 'Investigation Supervisor',
      status: 'Active',
      mfa: 'Enabled',
    },
    {
      name: 'Ibrahim Danladi',
      email: 'ibrahim.danladi@npf.gov.ng',
      agency: 'NPF',
      role: 'Triage Officer',
      status: 'Active',
      mfa: 'Enabled',
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Personnel & Users' }]}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Agency Personnel & Access Control</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Official badge holders, role assignments, and multi-factor authentication status.
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Enroll Personnel
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-100 text-neutral-900 uppercase font-semibold text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Officer Name</th>
                <th className="py-3 px-4">Agency</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">MFA Status</th>
                <th className="py-3 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((u, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <strong className="text-neutral-900 block">{u.name}</strong>
                    <span className="text-[11px] text-neutral-400">{u.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-800">{u.agency}</td>
                  <td className="py-3.5 px-4 text-neutral-700">{u.role}</td>
                  <td className="py-3.5 px-4">
                    <Badge status="success">{u.mfa}</Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge status="success">{u.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
