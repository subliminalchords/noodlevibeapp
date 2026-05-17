'use client';

import { useStore } from './useStore';
import { EntryType } from '../types';

export function useActiveSession() {
  const sessions = useStore((s) => s.sessions);
  const activeSessionId = useStore((s) => s.settings.activeSessionId);
  if (!activeSessionId) return null;
  return sessions[activeSessionId] ?? null;
}

export function useSessionEntries(sessionId: string, filter: EntryType | 'all' = 'all') {
  const entries = useStore((s) => s.entries[sessionId] ?? []);
  if (filter === 'all') return entries;
  return entries.filter((e) => e.tags.includes(filter));
}

export function useActiveCampaign() {
  const campaigns = useStore((s) => s.campaigns);
  const activeCampaignId = useStore((s) => s.settings.activeCampaignId);
  if (!activeCampaignId) return null;
  return campaigns[activeCampaignId] ?? null;
}
