import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ApiError, request } from '../api/client';
import { tokenStorage } from '../utils/storage';
import type { AuthenticatedUser, LoginResponse, TokenPair } from '../types';

interface AuthState {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Returns a usable access token, refreshing it once if the stored one expired. */
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * Optional sign-in for officers who want to check their caseload from a phone.
 * The citizen flows never touch this: reporting and tracking are unauthenticated
 * by design, and requiring an account would defeat anonymous reporting.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const { accessToken } = await tokenStorage.read();

      if (!accessToken) {
        if (!cancelled) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const profile = await request<AuthenticatedUser>('/auth/me', { token: accessToken });
        if (!cancelled) {
          setUser(profile);
        }
      } catch (error) {
        if (error instanceof ApiError && error.isUnauthorized) {
          await tokenStorage.clear();
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

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email: email.trim(), password },
    });

    await tokenStorage.save(result.tokens.accessToken, result.tokens.refreshToken);
    setUser(result.profile);
  }, []);

  const signOut = useCallback(async () => {
    const { refreshToken } = await tokenStorage.read();

    if (refreshToken) {
      // A failed revocation must not trap the user signed in on the device.
      await request('/auth/logout', { method: 'POST', body: { refreshToken } }).catch(
        () => undefined,
      );
    }

    await tokenStorage.clear();
    setUser(null);
  }, []);

  const getToken = useCallback(async () => {
    const { accessToken, refreshToken } = await tokenStorage.read();

    if (!accessToken) {
      return null;
    }

    try {
      await request('/auth/me', { token: accessToken });
      return accessToken;
    } catch (error) {
      if (!(error instanceof ApiError) || !error.isUnauthorized || !refreshToken) {
        throw error;
      }
    }

    try {
      const tokens = await request<TokenPair>('/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
      });
      await tokenStorage.save(tokens.accessToken, tokens.refreshToken);
      return tokens.accessToken;
    } catch {
      await tokenStorage.clear();
      setUser(null);
      return null;
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      signIn,
      signOut,
      getToken,
    }),
    [user, isLoading, signIn, signOut, getToken],
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
