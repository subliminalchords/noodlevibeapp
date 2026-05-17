import { StorageSchema, AppSettings } from './types';
import { STORAGE_KEY, STORAGE_VERSION } from './constants';

const DEFAULT_SETTINGS: AppSettings = {
  activeCampaignId: null,
  activeSessionId: null,
  theme: 'dark',
  hapticFeedback: true,
};

export function getDefaultStorage(): StorageSchema {
  return {
    version: STORAGE_VERSION,
    settings: { ...DEFAULT_SETTINGS },
    campaigns: {},
    sessions: {},
    entries: {},
  };
}

export function readStorage(): StorageSchema {
  if (typeof window === 'undefined') return getDefaultStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStorage();
    const parsed = JSON.parse(raw) as StorageSchema;
    // Ensure all top-level keys exist (handles schema additions)
    return {
      ...getDefaultStorage(),
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    };
  } catch {
    return getDefaultStorage();
  }
}

export function writeStorage(schema: StorageSchema): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
  } catch {
    // storage quota exceeded — silently fail, data is in memory
  }
}

export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportStorage(): string {
  return JSON.stringify(readStorage(), null, 2);
}

export function importStorage(json: string): StorageSchema {
  const parsed = JSON.parse(json) as StorageSchema;
  writeStorage(parsed);
  return parsed;
}
