'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ShieldCheck, Download, History, Sparkles, Copy, Check } from 'lucide-react';

export interface EvidenceCardProps {
  id: string;
  originalFileName: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256Hash: string;
  classification: 'PUBLIC' | 'CONFIDENTIAL' | 'RESTRICTED' | 'TOP_SECRET';
  uploadedAt: string;
  uploadedBy: string;
  hasAiAnalysis?: boolean;
  onViewCustodyTrail?: () => void;
  onDownload?: () => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  id,
  originalFileName,
  fileSizeBytes,
  mimeType,
  sha256Hash,
  classification,
  uploadedAt,
  uploadedBy,
  hasAiAnalysis = false,
  onViewCustodyTrail,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText(sha256Hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="hover:border-neutral-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-neutral-100 rounded-lg text-neutral-700">
              <FileText className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 break-all">{originalFileName}</h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                {formatBytes(fileSizeBytes)} • {mimeType}
              </p>
            </div>
          </div>

          <Badge status={classification === 'PUBLIC' ? 'info' : 'confidential'}>
            {classification}
          </Badge>
        </div>

        {/* SHA-256 Verification Section */}
        <div className="mt-4 p-2.5 bg-brand-50/60 rounded-md border border-brand-100 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-brand-800 truncate mr-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span className="text-[11px] truncate">SHA-256: {sha256Hash}</span>
          </div>
          <button
            onClick={copyHash}
            className="text-neutral-500 hover:text-neutral-800 transition-colors shrink-0 p-1"
            title="Copy Cryptographic Hash"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-brand-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Metadata info */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Uploaded {uploadedAt}</span>
          <span>By {uploadedBy}</span>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {hasAiAnalysis && (
              <span className="inline-flex items-center text-xs text-indigo-700 font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                OCR / STT Ready
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onViewCustodyTrail} className="text-xs">
              <History className="w-3.5 h-3.5 mr-1" />
              Custody
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload} className="text-xs">
              <Download className="w-3.5 h-3.5 mr-1" />
              Secure Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
