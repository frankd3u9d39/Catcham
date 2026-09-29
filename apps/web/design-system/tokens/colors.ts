/**
 * CATCHAM Sovereign Color Tokens
 * Single source of truth for all frontend surfaces and interactive states.
 */

export const colors = {
  // Sovereign Nigerian Green
  brand: {
    50: '#F3FAF6',
    100: '#E8F5EE',
    200: '#C5E6D4',
    300: '#8DC8A9',
    400: '#4DA778',
    500: '#008A4B',
    600: '#006B3C', // Primary Brand Color
    700: '#005731',
    800: '#004527',
    900: '#003820',
    950: '#001E11',
  },

  // Monochromatic Greys, Whites, and Obsidian Blacks
  neutral: {
    white: '#FFFFFF',
    50: '#F8FAFC',  // Page canvas background
    100: '#F1F5F9', // Table header, inactive button background
    200: '#E2E8F0', // Standard borders & divider strokes
    300: '#CBD5E1', // Inactive borders, disabled inputs
    400: '#94A3B8', // Placeholder text, subtle icons
    500: '#64748B', // Secondary text, metadata
    600: '#475569', // Strong secondary text
    700: '#334155', // Input labels, prominent text
    800: '#1E293B', // High-contrast surfaces
    900: '#181818', // Section headers, primary values
    950: '#111111', // Primary body text, deep black
  },

  // Operational & Legal Status Colors
  status: {
    success: {
      default: '#008A4B',
      surface: '#F3FAF6',
      border: '#C5E6D4',
      text: '#004D2A',
    },
    warning: {
      default: '#D97706',
      surface: '#FFFBEB',
      border: '#FDE68A',
      text: '#92400E',
    },
    error: {
      default: '#DC2626',
      surface: '#FEF2F2',
      border: '#FECACA',
      text: '#991B1B',
    },
    info: {
      default: '#475569',
      surface: '#F8FAFC',
      border: '#E2E8F0',
      text: '#1E293B',
    },
    confidential: {
      default: '#4F46E5',
      surface: '#EEF2FF',
      border: '#C7D2FE',
      text: '#3730A3',
    },
  },
} as const;

export type ColorTokens = typeof colors;
