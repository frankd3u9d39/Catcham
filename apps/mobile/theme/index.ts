/**
 * Design tokens, kept in step with the web app's Tailwind configuration so the
 * two clients look like one product.
 */

export const colors = {
  brand: {
    50: '#F3FAF6',
    100: '#E8F5EE',
    200: '#C5E6D4',
    500: '#008A4B',
    600: '#006B3C',
    700: '#005731',
    900: '#003820',
  },
  neutral: {
    white: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    700: '#334155',
    900: '#181818',
    950: '#111111',
  },
  status: {
    success: '#008A4B',
    successSurface: '#F3FAF6',
    warning: '#D97706',
    warningSurface: '#FFFBEB',
    error: '#DC2626',
    errorSurface: '#FEF2F2',
    info: '#475569',
    infoSurface: '#F8FAFC',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const, color: colors.neutral[950] },
  heading: { fontSize: 18, fontWeight: '700' as const, color: colors.neutral[950] },
  subheading: { fontSize: 15, fontWeight: '600' as const, color: colors.neutral[900] },
  body: { fontSize: 15, color: colors.neutral[700], lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '600' as const, color: colors.neutral[700] },
  caption: { fontSize: 12, color: colors.neutral[500] },
  mono: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 1 },
} as const;

/** Maps a report status to a colour pair for the status pill. */
export function statusColors(status: string): { background: string; text: string } {
  switch (status) {
    case 'RESOLVED':
    case 'CLOSED':
      return { background: colors.status.successSurface, text: colors.status.success };
    case 'REJECTED':
      return { background: colors.status.errorSurface, text: colors.status.error };
    case 'UNDER_INVESTIGATION':
    case 'TRIAGED':
      return { background: colors.status.warningSurface, text: colors.status.warning };
    default:
      return { background: colors.neutral[100], text: colors.neutral[700] };
  }
}

/** Turns SUBMITTED into Submitted, UNDER_INVESTIGATION into Under investigation. */
export function humanise(value: string): string {
  const words = value.replace(/_/g, ' ').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return `${formatDate(value)}, ${date.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;
}
