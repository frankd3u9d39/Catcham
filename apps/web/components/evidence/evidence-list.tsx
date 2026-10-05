'use client';

import React, { useRef, useState } from 'react';
import {
  Download,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Link2,
  Loader2,
  Upload,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState, InlineError } from '@/components/ui/error-state';
import { CustodyTrailView } from './custody-trail';
import { useEvidenceList, useUploadEvidence } from '@/hooks/use-evidence';
import { downloadEvidence } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { classificationBadge, formatBytes, formatDateTime, shortHash } from '@/lib/format';
import type { EvidenceSummary } from '@/lib/types';

interface EvidenceListProps {
  reportId?: string;
  investigationId?: string;
  /** Hidden when the case is closed, since the API rejects the upload anyway. */
  allowUpload?: boolean;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({
  reportId,
  investigationId,
  allowUpload = false,
}) => {
  const { can } = useAuth();
  const query = useEvidenceList({ reportId, investigationId, pageSize: 50 });
  const [trailFor, setTrailFor] = useState<EvidenceSummary | null>(null);

  if (query.isLoading) {
    return <LoadingState message="Loading evidence" />;
  }

  if (query.error) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} className="m-4" />;
  }

  const items = query.data?.items ?? [];

  return (
    <>
      {allowUpload && can('evidence:upload') && (
        <div className="p-4 border-b border-neutral-100">
          <UploadControl reportId={reportId} investigationId={investigationId} />
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          className="border-0 bg-transparent"
          icon={<FileText className="w-7 h-7 text-neutral-400" />}
          title="No evidence attached"
          description={
            allowUpload && can('evidence:upload')
              ? 'Upload a file above. Its type is checked from the file contents and it is hashed at intake.'
              : 'Nothing has been attached to this record yet.'
          }
        />
      ) : (
        <ul className="divide-y divide-neutral-100">
          {items.map((item) => (
            <li key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span className="p-2 rounded-lg bg-neutral-100 text-neutral-500 shrink-0">
                  <FileIcon mimeType={item.mimeType} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 break-all">
                    {item.originalFileName}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {formatBytes(item.sizeBytes)} · {item.mimeType} ·{' '}
                    {formatDateTime(item.createdAt)}
                  </p>
                  <p
                    className="mt-1 font-mono text-[10px] text-neutral-400"
                    title={`SHA-256: ${item.sha256Hash}`}
                  >
                    sha256 {shortHash(item.sha256Hash)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge status={classificationBadge(item.classification)} showIcon={false}>
                  {item.classification}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setTrailFor(item)}>
                  <Link2 className="w-3.5 h-3.5" />
                  Custody
                </Button>
                {can('evidence:download') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void downloadEvidence(item.id, item.originalFileName)}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={trailFor !== null}
        onClose={() => setTrailFor(null)}
        title="Chain of custody"
        description={trailFor?.originalFileName}
        className="sm:max-w-2xl"
        footer={
          <Button variant="outline" onClick={() => setTrailFor(null)}>
            Close
          </Button>
        }
      >
        {trailFor && <CustodyTrailView evidence={trailFor} />}
      </Dialog>
    </>
  );
};

function UploadControl({
  reportId,
  investigationId,
}: {
  reportId?: string;
  investigationId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadEvidence();

  async function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      await upload.mutateAsync({ file, reportId, investigationId });
    } finally {
      // Reset so the same file can be re-picked after a rejection.
      event.target.value = '';
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          onChange={(event) => void onPick(event)}
          className="sr-only"
          id="evidence-file"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
        >
          {upload.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {upload.isPending ? 'Uploading' : 'Upload evidence'}
        </Button>
        <p className="text-xs text-neutral-500">
          JPEG, PNG, GIF, WebP, PDF, MP4, MP3, WAV, ZIP, DOCX or XLSX. Up to 50 MB.
        </p>
      </div>
      <InlineError error={upload.error} />
    </div>
  );
}

function FileIcon({ mimeType }: { mimeType: string }) {
  const className = 'w-4 h-4';

  if (mimeType.startsWith('image/')) {
    return <FileImage className={className} />;
  }
  if (mimeType.startsWith('video/')) {
    return <FileVideo className={className} />;
  }
  if (mimeType.startsWith('audio/')) {
    return <FileAudio className={className} />;
  }
  if (mimeType === 'application/zip') {
    return <FileArchive className={className} />;
  }
  return <FileText className={className} />;
}

