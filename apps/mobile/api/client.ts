import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * The API base URL.
 *
 * `localhost` on a device or emulator means the device itself, not the
 * development machine, so the Android emulator alias is substituted and a real
 * device falls back to the host that served the Expo bundle.
 */
function resolveApiUrl(): string {
  // EXPO_PUBLIC_API_URL wins so a deployment can point the app at a real host
  // without editing app.json.
  const configured =
    process.env.EXPO_PUBLIC_API_URL ??
    (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
    '';

  if (!configured.includes('localhost') && !configured.includes('127.0.0.1')) {
    return configured;
  }

  if (Platform.OS === 'android') {
    return configured.replace(/localhost|127\.0\.0\.1/, '10.0.2.2');
  }

  // On a physical device, reuse the host Expo is serving from.
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri && Platform.OS !== 'web') {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return configured.replace(/localhost|127\.0\.0\.1/, host);
    }
  }

  return configured;
}

export const API_URL = resolveApiUrl();

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
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Bearer token for the authenticated endpoints. */
  token?: string | null;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${API_URL}${path}`);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {};
  const isFormData = options.body instanceof FormData;

  if (options.body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: options.method ?? 'GET',
      headers,
      signal: options.signal,
      body: isFormData
        ? (options.body as FormData)
        : options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
    });
  } catch {
    // A network failure on a phone is routine; say so plainly rather than
    // surfacing the platform's own message.
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Could not reach CATCHAM. Check your connection and try again.',
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const payload: unknown = text ? safeParse(text) : null;

  if (!response.ok) {
    const error =
      isRecord(payload) && isRecord(payload.error)
        ? payload.error
        : { code: 'UNKNOWN', message: 'The request failed.' };

    throw new ApiError(
      response.status,
      String(error.code ?? 'UNKNOWN'),
      String(error.message ?? 'The request failed.'),
      error.details,
    );
  }

  if (isRecord(payload) && payload.success === true && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
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
