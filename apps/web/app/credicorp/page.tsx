'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CredicorpPage() {
  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Partner Portal' }]}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-neutral-950">Partner Integration</CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <p className="text-sm text-neutral-600">
              This section is reserved for official partner integrations. No active
              partnership integrations are currently configured.
            </p>
          </CardContent>
        </Card>
      </AppShell>
    </RequireAuth>
  );
}
