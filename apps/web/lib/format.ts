import type { BadgeStatus } from '@/components/ui/badge';

/**
 * Formatting helpers shared by every screen, so a status or date never renders
 * two different ways in two places.
 */

const DATE_TIME = new Intl.DateTimeFormat('en-NG', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const DATE_ONLY = new Intl.DateTimeFormat('en-NG', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatDateTime(value: string | Date | null | undefined): string {
  const date = toDate(value);
  return date ? DATE_TIME.format(date) : '—';
}

export function formatDate(value: string | Date | null | undefined): string {
  const date = toDate(value);
  return date ? DATE_ONLY.format(date) : '—';
}

/** Coarse relative time; precise enough for a queue, and avoids a dependency. */
export function formatRelative(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) {
    return '—';
  }

  const deltaMs = Date.now() - date.getTime();
  const future = deltaMs < 0;
  const minutes = Math.round(Math.abs(deltaMs) / 60_000);

  if (minutes < 1) {
    return 'just now';
  }

  const [amount, unit] =
    minutes < 60
      ? [minutes, 'minute']
      : minutes < 1440
        ? [Math.round(minutes / 60), 'hour']
        : minutes < 43_200
          ? [Math.round(minutes / 1440), 'day']
          : [Math.round(minutes / 43_200), 'month'];

  const label = `${amount} ${unit}${amount === 1 ? '' : 's'}`;
  return future ? `in ${label}` : `${label} ago`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/** Turns an enum-style constant into sentence case: EVIDENCE_REVIEW -> Evidence review. */
export function humanise(value: string): string {
  const words = value.replace(/_/g, ' ').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function shortHash(hash: string): string {
  return `${hash.slice(0, 8)}…${hash.slice(-8)}`;
}

export function priorityBadge(priority: string): BadgeStatus {
  switch (priority) {
    case 'CRITICAL':
      return 'error';
    case 'HIGH':
      return 'warning';
    case 'MEDIUM':
      return 'info';
    default:
      return 'neutral';
  }
}

export function statusBadge(status: string): BadgeStatus {
  switch (status) {
    case 'SUBMITTED':
    case 'INITIATED':
      return 'info';
    case 'TRIAGED':
    case 'ROUTED':
    case 'EVIDENCE_COLLECTION':
      return 'neutral';
    case 'UNDER_INVESTIGATION':
    case 'EVIDENCE_REVIEW':
    case 'SUPERVISOR_REVIEW':
      return 'warning';
    case 'RESOLVED':
    case 'CLOSED':
    case 'REFERRED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'neutral';
  }
}

export function classificationBadge(classification: string): BadgeStatus {
  return classification === 'RESTRICTED' || classification === 'CONFIDENTIAL'
    ? 'confidential'
    : 'neutral';
}

/** True when a due date has passed, for highlighting SLA breaches. */
export function isOverdue(dueAt: string | Date | null | undefined): boolean {
  const date = toDate(dueAt);
  return date !== null && date.getTime() < Date.now();
}

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
