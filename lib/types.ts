export type EntryType =
  | 'note'
  | 'npc'
  | 'location'
  | 'decision'
  | 'consequence'
  | 'next';

export interface Entry {
  id: string;
  sessionId: string;
  campaignId: string;
  tags: EntryType[];
  content: string;
  createdAt: string;
  starred: boolean;
}

export interface Session {
  id: string;
  campaignId: string;
  name: string;
  sessionNumber: number;
  startedAt: string;
  endedAt: string | null;
  entryCount: number;
}

export interface Campaign {
  id: string;
  name: string;
  system: string;
  createdAt: string;
  lastSessionAt: string | null;
  sessionCount: number;
  color: string;
}

export interface AppSettings {
  activeCampaignId: string | null;
  activeSessionId: string | null;
  theme: 'dark' | 'light' | 'system';
  hapticFeedback: boolean;
}

export interface StorageSchema {
  version: number;
  settings: AppSettings;
  campaigns: Record<string, Campaign>;
  sessions: Record<string, Session>;
  entries: Record<string, Entry[]>;
}
