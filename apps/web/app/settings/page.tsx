'use client';
import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Server, Database, Shield, Cpu } from 'lucide-react';

export default function SystemSettingsPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'System Settings' }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-950">System Configuration & Infrastructure Health</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Sovereign deployment telemetry, database connections, and storage capacity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-600" />
              <span>PostgreSQL & PostGIS Database</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Connection Status:</span>
              <Badge status="success">Connected (Primary)</Badge>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">PostGIS Extension:</span>
              <span className="font-mono text-neutral-800">Version 3.4 Active</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500">Latency:</span>
              <span className="font-mono text-neutral-800">2.4 ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>Python AI Inference Microservice</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Service Status:</span>
              <Badge status="success">Operational (Port 8000)</Badge>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">OCR & Speech-to-Text Pipeline:</span>
              <span className="text-neutral-800">Ready</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500">Direct DB Writes:</span>
              <Badge status="info">Disabled by Architecture</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
