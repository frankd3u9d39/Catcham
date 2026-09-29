'use client';
import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { EvidenceCard } from '@/components/business/evidence-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Plus, Filter, Search } from 'lucide-react';

export default function EvidenceVaultLedgerPage() {
  const evidenceItems = [
    {
      id: 'evi-101',
      originalFileName: 'pipeline_valve_tampering_photo.jpg',
      fileSizeBytes: 3492810,
      mimeType: 'image/jpeg',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      classification: 'RESTRICTED' as const,
      uploadedAt: '28 Sep 2026, 14:35',
      uploadedBy: 'Citizen Whistleblower',
      hasAiAnalysis: true,
    },
    {
      id: 'evi-102',
      originalFileName: 'surveillance_drone_feed_segment.mp4',
      fileSizeBytes: 42949672,
      mimeType: 'video/mp4',
      sha256Hash: 'a8f5c1e345b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b',
      classification: 'TOP_SECRET' as const,
      uploadedAt: '29 Sep 2026, 10:12',
      uploadedBy: 'Investigator Adeleke',
      hasAiAnalysis: false,
    },
    {
      id: 'evi-103',
      originalFileName: 'procurement_voucher_alteration.pdf',
      fileSizeBytes: 1248900,
      mimeType: 'application/pdf',
      sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      classification: 'CONFIDENTIAL' as const,
      uploadedAt: '24 Sep 2026, 15:40',
      uploadedBy: 'Investigator Sanusi',
      hasAiAnalysis: true,
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Evidence Vault' }]}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Digital Evidence Vault & Chain of Custody</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Immutable asset repository with SHA-256 integrity verification for Nigerian court admissibility.
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Intake Evidence Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidenceItems.map((item) => (
          <EvidenceCard
            key={item.id}
            {...item}
            onViewCustodyTrail={() => alert(`Opening chain of custody for ${item.id}`)}
            onDownload={() => alert(`Generating presigned S3 download for ${item.originalFileName}`)}
          />
        ))}
      </div>
    </AppShell>
  );
}
