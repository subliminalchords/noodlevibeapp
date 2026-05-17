'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { StorageSchema, EntryType, Entry } from '../types';
import { readStorage, writeStorage, clearStorage, importStorage } from '../storage';
import * as M from '../mutations';

interface UIState {
  selectedType: EntryType | 'all';
  pendingUndo: { sessionId: string; entry: Entry; index: number } | null;
}

type State = StorageSchema & UIState;

interface Actions {
  // Campaigns
  createCampaign: (args: { name: string; system: string; color: string }) => void;
  updateCampaign: (args: { id: string; name?: string; system?: string; color?: string }) => void;
  deleteCampaign: (campaignId: string) => void;
  setActiveCampaign: (campaignId: string) => void;
  // Sessions
  createSession: (campaignId: string) => string;
  endSession: (sessionId: string) => void;
  // Entries
  addEntry: (args: { sessionId: string; campaignId: string; type: EntryType; content: string; starred?: boolean }) => void;
  toggleStarEntry: (args: { sessionId: string; entryId: string }) => void;
  deleteEntry: (args: { sessionId: string; entryId: string }) => void;
  undoDelete: () => void;
  clearPendingUndo: () => void;
  // UI
  setSelectedType: (type: EntryType | 'all') => void;
  // Settings
  updateSettings: (patch: Partial<StorageSchema['settings']>) => void;
  // Storage ops
  clearAllData: () => void;
  importData: (json: string) => void;
}

function mutate(set: (fn: (s: State) => State) => void, fn: (schema: StorageSchema) => StorageSchema) {
  set((state) => {
    const next = fn(state);
    writeStorage(next);
    return { ...state, ...next };
  });
}

export const useStore = create<State & Actions>()(
  subscribeWithSelector((set, get) => {
    const initial = readStorage();
    return {
      ...initial,
      selectedType: 'all',
      pendingUndo: null,

      createCampaign(args) {
        mutate(set, (s) => M.createCampaign(s, args));
      },
      updateCampaign(args) {
        mutate(set, (s) => M.updateCampaign(s, args));
      },
      deleteCampaign(campaignId) {
        mutate(set, (s) => M.deleteCampaign(s, campaignId));
      },
      setActiveCampaign(campaignId) {
        mutate(set, (s) => M.updateSettings(s, { activeCampaignId: campaignId }));
      },
      createSession(campaignId) {
        let newSessionId = '';
        mutate(set, (s) => {
          const next = M.createSession(s, { campaignId });
          newSessionId = next.settings.activeSessionId ?? '';
          return next;
        });
        return newSessionId;
      },
      endSession(sessionId) {
        mutate(set, (s) => M.endSession(s, sessionId));
      },
      addEntry(args) {
        mutate(set, (s) => M.addEntry(s, args));
        if (get().settings.hapticFeedback && navigator.vibrate) navigator.vibrate(20);
      },
      toggleStarEntry(args) {
        mutate(set, (s) => M.toggleStarEntry(s, args));
      },
      deleteEntry(args) {
        const state = get();
        const sessionEntries = state.entries[args.sessionId] ?? [];
        const index = sessionEntries.findIndex((e) => e.id === args.entryId);
        const entry = sessionEntries[index];
        if (!entry) return;
        set((s) => ({ ...s, pendingUndo: { sessionId: args.sessionId, entry, index } }));
        mutate(set, (s) => M.deleteEntry(s, args));
      },
      undoDelete() {
        const { pendingUndo } = get();
        if (!pendingUndo) return;
        mutate(set, (s) => M.restoreEntry(s, pendingUndo));
        set((s) => ({ ...s, pendingUndo: null }));
      },
      clearPendingUndo() {
        set((s) => ({ ...s, pendingUndo: null }));
      },
      setSelectedType(type) {
        set((s) => ({ ...s, selectedType: type }));
      },
      updateSettings(patch) {
        mutate(set, (s) => M.updateSettings(s, patch));
      },
      clearAllData() {
        clearStorage();
        const fresh = readStorage();
        set((s) => ({ ...s, ...fresh, selectedType: 'all', pendingUndo: null }));
      },
      importData(json) {
        const schema = importStorage(json);
        set((s) => ({ ...s, ...schema, selectedType: 'all', pendingUndo: null }));
      },
    };
  })
);
