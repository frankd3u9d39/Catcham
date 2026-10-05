import React from 'react';
import { formatDateTime } from '@/lib/format';

export interface TimelineEntryView {
  id: string;
  title: string;
  description?: string;
  at: string;
  actor?: string;
}

/**
 * Chronological entry list, used for report timelines, workflow history and
 * custody trails. Ordered oldest first, matching how the API returns them.
 */
export const Timeline: React.FC<{ entries: TimelineEntryView[]; emptyMessage?: string }> = ({
  entries,
  emptyMessage = 'Nothing recorded yet.',
}) => {
  if (entries.length === 0) {
    return <p className="text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <ol className="space-y-4">
      {entries.map((entry, index) => (
        <li key={entry.id} className="flex gap-3.5">
          <div className="flex flex-col items-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 mt-1.5 ring-4 ring-brand-50" />
            {index < entries.length - 1 && (
              <span className="w-px flex-1 bg-neutral-200 mt-1.5" />
            )}
          </div>
          <div className="min-w-0 pb-1">
            <p className="text-sm font-medium text-neutral-900">{entry.title}</p>
            {entry.description && (
              <p className="mt-0.5 text-xs text-neutral-600 leading-relaxed break-words">
                {entry.description}
              </p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">
              {formatDateTime(entry.at)}
              {entry.actor && ` · ${entry.actor}`}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
};
