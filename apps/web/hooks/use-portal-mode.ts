'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

export type PortalMode = 'citizen' | 'officer';

const OFFICER_ROUTES = [
  '/reports',
  '/investigations',
  '/evidence',
  '/organizations',
  '/jurisdictions',
  '/workflows',
  '/rules',
  '/analytics',
  '/audit',
  '/users',
];

const CITIZEN_ROUTES = [
  '/complaints',
  '/track',
  '/report',
  '/alerts',
  '/privacy',
  '/credicorp',
  '/profile',
];

export function usePortalMode() {
  const pathname = usePathname();
  const { user, can } = useAuth();

  const isOfficerByRole = Boolean(
    can('report:read') ||
    can('investigation:read') ||
    can('analytics:read') ||
    can('audit:read') ||
    can('user:read') ||
    user?.roleCodes?.some((r) =>
      ['ADMIN', 'SUPERVISOR', 'INVESTIGATOR', 'INTAKE_OFFICER', 'COMMANDER'].includes(r.toUpperCase())
    )
  );

  const [mode, setModeState] = useState<PortalMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('catcham.portalMode');
      if (saved === 'officer' || saved === 'citizen') return saved;
    }
    return isOfficerByRole ? 'officer' : 'citizen';
  });

  // Keep in sync if path is explicitly an officer or citizen route
  useEffect(() => {
    if (OFFICER_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))) {
      setModeState('officer');
      try {
        window.localStorage.setItem('catcham.portalMode', 'officer');
      } catch {}
    } else if (CITIZEN_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))) {
      setModeState('citizen');
      try {
        window.localStorage.setItem('catcham.portalMode', 'citizen');
      } catch {}
    }
  }, [pathname]);

  // Listen to cross-component mode change events
  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<PortalMode>;
      if (customEvent.detail === 'officer' || customEvent.detail === 'citizen') {
        setModeState(customEvent.detail);
      }
    };
    window.addEventListener('catcham:portal-mode-change', handleModeChange);
    return () => window.removeEventListener('catcham:portal-mode-change', handleModeChange);
  }, []);

  const setPortalMode = useCallback((newMode: PortalMode) => {
    setModeState(newMode);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('catcham.portalMode', newMode);
        window.dispatchEvent(new CustomEvent('catcham:portal-mode-change', { detail: newMode }));
      }
    } catch {}
  }, []);

  return {
    portalMode: mode,
    setPortalMode,
    isOfficerMode: mode === 'officer',
    isCitizenMode: mode === 'citizen',
    isOfficerByRole,
  };
}
