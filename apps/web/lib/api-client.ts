import type { TokenPair } from './types';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

const ACCESS_TOKEN_KEY = 'catcham.accessToken';
const REFRESH_TOKEN_KEY = 'catcham.refreshToken';

/**
 * Tokens live in localStorage rather than a cookie because the API is a separate
 * origin and the SPA holds no server session. That makes them readable by any
 * script on the page, so the trade is accepted deliberately: the access token is
 * short-lived and the refresh token is single-use and revoked on rotation.
 */
export const tokenStore = {
  get accessToken(): string | null {
    return read(ACCESS_TOKEN_KEY);
  },
  get refreshToken(): string | null {
    return read(REFRESH_TOKEN_KEY);
  },
  save(tokens: TokenPair): void {
    write(ACCESS_TOKEN_KEY, tokens.accessToken);
    write(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },
  clear(): void {
    write(ACCESS_TOKEN_KEY, null);
    write(REFRESH_TOKEN_KEY, null);
  },
};

function read(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Private browsing or blocked storage: the session simply will not persist.
  }
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Set for the auth endpoints, which must not trigger a refresh loop. */
  skipAuth?: boolean;
  query?: Record<string, string | number | boolean | undefined | null>;
}

/** Concurrent 401s share one refresh attempt instead of each firing their own. */
let refreshInFlight: Promise<boolean> | null = null;

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(path, options);

  if (response.status === 401 && !options.skipAuth) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return unwrap<T>(await send(path, options));
    }

    tokenStore.clear();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.assign('/login');
    }
  }

  return unwrap<T>(response);
}

async function send(path: string, options: RequestOptions): Promise<Response> {
  const url = new URL(`${API_BASE}${path}`);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (options.body !== undefined && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  if (!options.skipAuth) {
    const token = tokenStore.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // FormData is passed through so the browser sets the multipart boundary;
  // everything else is serialised and carries the JSON content type set above.
  const body: BodyInit | undefined = isFormData
    ? (options.body as FormData)
    : options.body === undefined
      ? undefined
      : JSON.stringify(options.body);

  return fetch(url, { ...options, headers, body });
}

async function unwrap<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const payload: unknown = text ? safeParse(text) : null;

  if (!response.ok) {
    const error =
      isRecord(payload) && isRecord(payload.error)
        ? payload.error
        : { code: 'UNKNOWN', message: response.statusText };

    throw new ApiError(
      response.status,
      String(error.code ?? 'UNKNOWN'),
      String(error.message ?? 'The request failed.'),
      error.details,
    );
  }

  // Successful responses are wrapped as { success: true, data } by the API.
  if (isRecord(payload) && payload.success === true && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
}

async function refreshTokens(): Promise<boolean> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  const refreshToken = tokenStore.refreshToken;
  if (!refreshToken) {
    return false;
  }

  refreshInFlight = (async () => {
    try {
      const response = await send('/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
        skipAuth: true,
      });

      if (!response.ok) {
        return false;
      }

      const tokens = await unwrap<TokenPair>(response);
      tokenStore.save(tokens);
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query']) =>
    apiRequest<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: 'DELETE' }),
  /** Unauthenticated call, for the citizen-facing endpoints. */
  public: <T>(path: string, init: RequestOptions = {}) =>
    apiRequest<T>(path, { ...init, skipAuth: true }),
};

/** Streams an evidence download with the bearer token attached. */
export async function downloadEvidence(evidenceId: string, fileName: string): Promise<void> {
  const response = await send(`/evidence/${evidenceId}/download`, { method: 'GET' });

  if (!response.ok) {
    throw new ApiError(response.status, 'DOWNLOAD_FAILED', 'Could not download the file.');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
