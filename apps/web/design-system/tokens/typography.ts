/**
 * CATCHAM Inter Typographic Scale
 */

export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
  },
  fontSize: {
    display: ['2.5rem', { lineHeight: '3.0rem', letterSpacing: '-0.02em', fontWeight: '700' }],
    h1: ['2.0rem', { lineHeight: '2.5rem', letterSpacing: '-0.015em', fontWeight: '700' }],
    h2: ['1.5rem', { lineHeight: '2.0rem', letterSpacing: '-0.01em', fontWeight: '600' }],
    h3: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em', fontWeight: '600' }],
    h4: ['1.0rem', { lineHeight: '1.5rem', letterSpacing: '0', fontWeight: '600' }],
    body: ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '0', fontWeight: '400' }],
    bodyStrong: ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '0', fontWeight: '500' }],
    small: ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.005em', fontWeight: '400' }],
    caption: ['0.75rem', { lineHeight: '1.0rem', letterSpacing: '0.02em', fontWeight: '500' }],
  },
} as const;
