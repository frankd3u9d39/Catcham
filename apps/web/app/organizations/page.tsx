'use client';
import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Plus, MapPin, Users } from 'lucide-react';

export default function OrganizationsDirectoryPage() {
  const agencies = [
    {
      code: 'EFCC',
      name: 'Economic and Financial Crimes Commission',
      category: 'LAW_ENFORCEMENT',
      headquarters: 'Abuja (FCT)',
      activeOfficers: 1420,
      departments: ['Financial Crimes', 'Operations', 'Forensics', 'Legal Directorate'],
      status: 'Active',
    },
    {
      code: 'NPF',
      name: 'Nigeria Police Force',
      category: 'LAW_ENFORCEMENT',
      headquarters: 'Louis Edet House, Abuja',
      activeOfficers: 38400,
      departments: ['Criminal Investigation (FCID)', 'Marine Police', 'Anti-Bomb (EOD)'],
      status: 'Active',
    },
    {
      code: 'NDLEA',
      name: 'National Drug Law Enforcement Agency',
      category: 'LAW_ENFORCEMENT',
      headquarters: 'Abuja (FCT)',
      activeOfficers: 2150,
      departments: ['General Investigation', 'Seaport Command', 'Airport Interdiction'],
      status: 'Active',
    },
    {
      code: 'NERC',
      name: 'Nigerian Electricity Regulatory Commission',
      category: 'ENERGY',
      headquarters: 'Abuja (FCT)',
      activeOfficers: 380,
      departments: ['Compliance & Inspectorate', 'Consumer Protection', 'Grid Security'],
      status: 'Active',
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Organizations Directory' }]}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Participating Agencies & Organizations</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Hierarchy: Agency → Department → Zonal/Field Office → Officers. Dynamic, non-hardcoded configuration.
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Onboard Agency
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agencies.map((agency) => (
          <Card key={agency.code} className="hover:border-neutral-300 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 border border-brand-200 rounded-lg flex items-center justify-center font-bold text-brand-700 text-sm">
                  {agency.code}
                </div>
                <div>
                  <CardTitle className="text-base">{agency.name}</CardTitle>
                  <p className="text-xs text-neutral-400 mt-0.5">{agency.headquarters}</p>
                </div>
              </div>
              <Badge status="success">{agency.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Category Mandate:</span>
                <strong className="text-neutral-800">{agency.category}</strong>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Active Personnel:</span>
                <strong className="text-neutral-800">{agency.activeOfficers.toLocaleString()} Registered</strong>
              </div>
              <div>
                <span className="text-neutral-500 block mb-1.5">Registered Departments:</span>
                <div className="flex flex-wrap gap-1.5">
                  {agency.departments.map((dept, idx) => (
                    <span key={idx} className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px]">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
