'use client';
import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Layers, Search, Filter } from 'lucide-react';

export default function JurisdictionsMapPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Jurisdictions Map' }]}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Sovereign Jurisdiction & Territorial Boundaries</h1>
          <p className="text-xs text-neutral-500 mt-1">
            PostGIS spatial intelligence mapping 36 States, Federal Capital Territory, and 774 Local Government Areas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Layers className="w-4 h-4 mr-1.5" />
            Layer Controls
          </Button>
          <Button variant="primary" size="sm">
            Define New Sector
          </Button>
        </div>
      </div>

      {/* Map Explorer Canvas & Legend Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map View Canvas */}
        <div className="lg:col-span-3">
          <div className="h-[650px] bg-neutral-900 rounded-xl border border-neutral-200 relative overflow-hidden flex items-center justify-center text-center p-6 shadow-sm">
            {/* Map Canvas Background Grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#008A4B_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 max-w-md bg-neutral-950/80 backdrop-blur-md p-6 rounded-xl border border-neutral-800 text-neutral-white shadow-xl">
              <MapPin className="w-10 h-10 text-brand-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold">PostGIS Vector Tiles Ready</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Connects directly to `@catcham/gis` spatial query service to resolve point-in-polygon coordinates within Nigerian administrative boundaries.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Badge status="success">Active SRS: EPSG:4326</Badge>
                <Badge status="info">774 LGA Polygons</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Territorial Zones List */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Territorial Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <div className="flex justify-between font-semibold text-neutral-900">
                  <span>Rivers South-South</span>
                  <Badge status="success">Federal</Badge>
                </div>
                <p className="text-[11px] text-neutral-500">23 Local Government Areas • Port Harcourt HQ</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <div className="flex justify-between font-semibold text-neutral-900">
                  <span>Lagos Zonal Command</span>
                  <Badge status="success">State</Badge>
                </div>
                <p className="text-[11px] text-neutral-500">20 Local Government Areas • Ikeja HQ</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <div className="flex justify-between font-semibold text-neutral-900">
                  <span>Abuja FCT Special Command</span>
                  <Badge status="success">Federal</Badge>
                </div>
                <p className="text-[11px] text-neutral-500">6 Area Councils • Central Area HQ</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
