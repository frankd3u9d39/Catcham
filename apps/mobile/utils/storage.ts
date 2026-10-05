import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { SavedReceipt } from '../types';

/**
 * Two stores with different guarantees.
 *
 * Tracking codes and auth tokens go to the OS keystore, because anyone holding a
 * tracking code can read the report it belongs to. Everything else — drafts,
 * preferences — goes to AsyncStorage, which is plain on-device storage.
 *
 * SecureStore has no web implementation, so on web it falls back to
 * AsyncStorage. That is weaker, and the app is built for a phone; the fallback
 * exists so `expo start --web` runs during development.
 */
const secure = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

const ACCESS_TOKEN_KEY = 'catcham.accessToken';
const REFRESH_TOKEN_KEY = 'catcham.refreshToken';
const RECEIPTS_KEY = 'catcham.receipts';
const DRAFT_KEY = 'catcham.draft';

export const tokenStorage = {
  async read(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    const [accessToken, refreshToken] = await Promise.all([
      secure.get(ACCESS_TOKEN_KEY),
      secure.get(REFRESH_TOKEN_KEY),
    ]);
    return { accessToken, refreshToken };
  },

  async save(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      secure.set(ACCESS_TOKEN_KEY, accessToken),
      secure.set(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async clear(): Promise<void> {
    await Promise.all([secure.remove(ACCESS_TOKEN_KEY), secure.remove(REFRESH_TOKEN_KEY)]);
  },
};

/**
 * Receipts for reports submitted from this device. A tracking code cannot be
 * recovered from the server, so losing this list means losing access to those
 * reports; it is kept in the keystore and never leaves the device.
 */
export const receiptStorage = {
  async list(): Promise<SavedReceipt[]> {
    const raw = await secure.get(RECEIPTS_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as SavedReceipt[]) : [];
    } catch {
      return [];
    }
  },

  async add(receipt: SavedReceipt): Promise<void> {
    const existing = await receiptStorage.list();
    const deduped = existing.filter(
      (item) => item.referenceNumber !== receipt.referenceNumber,
    );

    await secure.set(RECEIPTS_KEY, JSON.stringify([receipt, ...deduped].slice(0, 50)));
  },

  async remove(referenceNumber: string): Promise<void> {
    const existing = await receiptStorage.list();
    await secure.set(
      RECEIPTS_KEY,
      JSON.stringify(existing.filter((item) => item.referenceNumber !== referenceNumber)),
    );
  },
};

/** The in-progress report form, so a long description survives the app closing. */
export const draftStorage = {
  async read<T>(): Promise<T | null> {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async write(draft: unknown): Promise<void> {
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(DRAFT_KEY);
  },
};
