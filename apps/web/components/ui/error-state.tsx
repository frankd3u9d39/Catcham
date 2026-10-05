'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { ApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

/**
 * Renders the server's message when it is an ApiError, since the API returns
 * actionable text (which permission is missing, which field failed). Anything
 * else is shown as a generic failure rather than leaking an internal message.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, className }) => {
  const { title, message } = describe(error);

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-10 text-center rounded-xl border border-red-200 bg-red-50/60',
        className,
      )}
    >
      <div className="p-3 bg-neutral-white rounded-full border border-red-200 text-red-600 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
};

function describe(error: unknown): { title: string; message: string } {
  if (error instanceof ApiError) {
    if (error.isForbidden) {
      return { title: 'Not permitted', message: error.message };
    }
    if (error.status === 404) {
      return { title: 'Not found', message: error.message };
    }
    if (error.status >= 500) {
      return {
        title: 'The server could not complete the request',
        message: 'Try again in a moment. If it persists, contact your administrator.',
      };
    }
    return { title: 'Request failed', message: error.message };
  }

  return {
    title: 'Could not load this view',
    message: 'Check that the API is running and reachable, then try again.',
  };
}

/** Inline variant for form submission failures. */
export const InlineError: React.FC<{ error: unknown }> = ({ error }) => {
  if (!error) {
    return null;
  }

  const { message } = describe(error);
  const details = error instanceof ApiError && Array.isArray(error.details) ? error.details : null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-800"
    >
      <p className="font-medium">{message}</p>
      {details && (
        <ul className="mt-1.5 list-disc pl-4 space-y-0.5">
          {details.map((detail) => (
            <li key={String(detail)}>{String(detail)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
