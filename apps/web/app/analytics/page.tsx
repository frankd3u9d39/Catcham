'use client';
import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Operational Analytics' }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-950">Sovereign SLA & Workload Analytics</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Performance metrics across participating Nigerian law enforcement and regulatory agencies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase text-neutral-400">Average Case Resolution</p>
            <h3 className="text-2xl font-bold text-neutral-950 mt-1">14.5 Days</h3>
            <span className="text-[11px] text-brand-600 font-medium">↓ 2.1 days improvement</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase text-neutral-400">SLA Adherence Rate</p>
            <h3 className="text-2xl font-bold text-neutral-950 mt-1">92.4%</h3>
            <span className="text-[11px] text-brand-600 font-medium">Above national benchmark (85%)</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase text-neutral-400">Active Incident Reports</p>
            <h3 className="text-2xl font-bold text-neutral-950 mt-1">142</h3>
            <span className="text-[11px] text-neutral-500">Distributed across 36 states & FCT</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Agency Performance Benchmarks</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-neutral-100 p-0 text-xs">
          {[
            { agency: 'Economic and Financial Crimes Commission (EFCC)', active: 48, resolved: 112, avgDays: 12.1, status: 'Optimal' },
            { agency: 'Nigeria Police Force (NPF)', active: 62, resolved: 98, avgDays: 16.4, status: 'Meeting SLA' },
            { agency: 'National Drug Law Enforcement Agency (NDLEA)', active: 22, resolved: 74, avgDays: 11.8, status: 'Optimal' },
            { agency: 'Nigerian Electricity Regulatory Commission (NERC)', active: 10, resolved: 34, avgDays: 18.2, status: 'At Risk' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div>
                <strong className="text-neutral-900 block text-sm">{item.agency}</strong>
                <span className="text-neutral-400 text-[11px]">
                  {item.active} Active Cases • {item.resolved} Closed in 2026 • Average: {item.avgDays} Days
                </span>
              </div>
              <Badge status={item.status === 'Optimal' ? 'success' : item.status === 'Meeting SLA' ? 'info' : 'warning'}>
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
