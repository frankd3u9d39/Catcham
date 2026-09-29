'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Sliders } from 'lucide-react';

export default function NewRuleBuilderPage() {
  const [ruleName, setRuleName] = useState('');
  const [category, setCategory] = useState('INFRASTRUCTURE_VANDALISM');
  const [priority, setPriority] = useState('HIGH');
  const [targetAgency, setTargetAgency] = useState('EFCC');

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Business Rules Engine', href: '/rules' },
        { label: 'New Rule Studio' },
      ]}
    >
      <div className="max-w-2xl mx-auto">
        <Link href="/rules" className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rules Ledger</span>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-brand-600 text-xs font-semibold uppercase">
              <Sliders className="w-4 h-4" />
              <span>Declarative Policy Builder</span>
            </div>
            <CardTitle className="text-xl mt-1">Configure Routing & Escalation Rule</CardTitle>
            <CardDescription>
              Build institutional logic without modifying codebase or redeploying backend services.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Input
              label="Policy Rule Name"
              placeholder="e.g. Critical Vandalism Multi-Agency Escalation"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              required
            />

            {/* WHEN Condition Block */}
            <div className="p-4 bg-brand-50/50 border border-brand-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-800">WHEN Conditions</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Category Matches"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={[
                    { value: 'INFRASTRUCTURE_VANDALISM', label: 'Infrastructure Vandalism' },
                    { value: 'FINANCIAL_FRAUD', label: 'Financial Fraud' },
                    { value: 'DRUG_TRAFFICKING', label: 'Drug Trafficking' },
                    { value: 'ENVIRONMENTAL_HAZARD', label: 'Environmental Hazard' },
                  ]}
                />
                <Select
                  label="Incident Priority Level"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={[
                    { value: 'LOW', label: 'Low Priority' },
                    { value: 'MEDIUM', label: 'Medium Priority' },
                    { value: 'HIGH', label: 'High Priority' },
                    { value: 'CRITICAL', label: 'Critical Priority' },
                  ]}
                />
              </div>
            </div>

            {/* THEN Action Block */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">THEN Actions</span>
              <Select
                label="Assign Primary Lead Agency"
                value={targetAgency}
                onChange={(e) => setTargetAgency(e.target.value)}
                options={[
                  { value: 'EFCC', label: 'Economic and Financial Crimes Commission (EFCC)' },
                  { value: 'NPF', label: 'Nigeria Police Force (NPF)' },
                  { value: 'NDLEA', label: 'National Drug Law Enforcement Agency (NDLEA)' },
                  { value: 'NERC', label: 'Nigerian Electricity Regulatory Commission (NERC)' },
                ]}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-neutral-100 pt-4">
            <Link href="/rules">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button variant="primary">
              <Save className="w-4 h-4 mr-1.5" />
              Activate Rule in Production
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
