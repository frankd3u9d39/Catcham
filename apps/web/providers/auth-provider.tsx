'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError, tokenStore } from '@/lib/api-client';
import type { AuthenticatedUser, LoginResponse } from '@/lib/types';

interface AuthState {
  user: AuthenticatedUser | null;
  /** True until the stored token has been checked against the API. */
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Whether the caller holds every listed permission. */
  can: (...permissions: string[]) => boolean;
  hasRole: (...roleCodes: string[]) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // A stored access token may be expired or revoked, so the session is
  // confirmed against /auth/me rather than assumed from the token's presence.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      if (!tokenStore.accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.get<AuthenticatedUser>('/auth/me');
        if (!cancelled) {
          setUser(profile);
        }
      } catch (error) {
        if (error instanceof ApiError && error.isUnauthorized) {
          tokenStore.clear();
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await api.public<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      tokenStore.save(result.tokens);
      setUser(result.profile);
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenStore.refreshToken;

    if (refreshToken) {
      // A failed revocation must not trap the user in a signed-in state.
      await api
        .public<void>('/auth/logout', { method: 'POST', body: { refreshToken } })
        .catch(() => undefined);
    }

    tokenStore.clear();
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = useMemo<AuthState>(() => {
    const held = new Set(user?.permissions ?? []);
    const roles = new Set(user?.roleCodes ?? []);

    return {
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      logout,
      can: (...permissions) => permissions.every((permission) => held.has(permission)),
      hasRole: (...roleCodes) => roleCodes.some((roleCode) => roles.has(roleCode)),
    };
  }, [user, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
