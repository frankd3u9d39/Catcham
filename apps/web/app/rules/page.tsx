'use client';
import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sliders, Plus, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RulesEngineLedger() {
  const activeRules = [
    {
      id: 'RUL-001',
      name: 'High-Priority Oil Infrastructure Triage',
      category: 'INFRASTRUCTURE_VANDALISM',
      priority: 100,
      condition: 'Category is INFRASTRUCTURE_VANDALISM AND State in (Rivers, Bayelsa, Delta)',
      action: 'Assign to EFCC/Police Joint Taskforce + Alert Zonal Supervisor',
      isActive: true,
    },
    {
      id: 'RUL-002',
      name: 'Public Sector Financial Fraud Auto-Escalation',
      category: 'FINANCIAL_FRAUD',
      priority: 90,
      condition: 'Category is FINANCIAL_FRAUD AND Amount >= ₦50,000,000.00',
      action: 'Set Priority to CRITICAL + Notify Special Investigation Unit',
      isActive: true,
    },
    {
      id: 'RUL-003',
      name: 'Substandard Electrical Asset Regulatory Routing',
      category: 'ENERGY',
      priority: 80,
      condition: 'Category is ENERGY_EQUIPMENT',
      action: 'Route to NERC Regulatory Compliance Inspectorate',
      isActive: true,
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Business Rules Engine' }]}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Decoupled Business Rules & Routing Policies</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configure declarative WHEN/THEN rules for automatic agency routing, prioritization, and escalations.
          </p>
        </div>
        <Link href="/rules/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Business Rule
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Active Declarative Policy Rules</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-neutral-100 p-0 text-xs">
          {activeRules.map((rule) => (
            <div key={rule.id} className="p-4 hover:bg-neutral-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-900">{rule.id}</span>
                  <Badge status="success">Active</Badge>
                  <span className="text-[11px] text-neutral-400">Priority: {rule.priority}</span>
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">{rule.name}</h4>
                <div className="p-2 bg-neutral-50 rounded border border-neutral-200 font-mono text-[11px] text-neutral-700">
                  <span className="text-brand-700 font-bold">WHEN:</span> {rule.condition}
                  <br />
                  <span className="text-indigo-700 font-bold">THEN:</span> {rule.action}
                </div>
              </div>

              <Button variant="outline" size="sm">
                Edit Conditions
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
