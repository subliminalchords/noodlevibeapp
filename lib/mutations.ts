import { StorageSchema, Campaign, Session, Entry, EntryType } from './types';
import { newId } from './utils';

export function createCampaign(
  schema: StorageSchema,
  args: { name: string; system: string; color: string }
): StorageSchema {
  const id = newId();
  const campaign: Campaign = {
    id,
    name: args.name,
    system: args.system,
    color: args.color,
    createdAt: new Date().toISOString(),
    lastSessionAt: null,
    sessionCount: 0,
  };
  return {
    ...schema,
    campaigns: { ...schema.campaigns, [id]: campaign },
    settings: { ...schema.settings, activeCampaignId: id },
  };
}

export function updateCampaign(
  schema: StorageSchema,
  args: { id: string; name?: string; system?: string; color?: string }
): StorageSchema {
  const existing = schema.campaigns[args.id];
  if (!existing) return schema;
  return {
    ...schema,
    campaigns: {
      ...schema.campaigns,
      [args.id]: { ...existing, ...args },
    },
  };
}

export function deleteCampaign(schema: StorageSchema, campaignId: string): StorageSchema {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [campaignId]: _removed, ...campaigns } = schema.campaigns;
  const settings = { ...schema.settings };
  if (settings.activeCampaignId === campaignId) settings.activeCampaignId = null;

  // Remove sessions and entries for this campaign
  const sessions = Object.fromEntries(
    Object.entries(schema.sessions).filter(([, s]) => s.campaignId !== campaignId)
  );
  const survivingSessionIds = new Set(Object.keys(sessions));
  const entries = Object.fromEntries(
    Object.entries(schema.entries).filter(([sid]) => survivingSessionIds.has(sid))
  );

  return { ...schema, campaigns, sessions, entries, settings };
}

export function createSession(
  schema: StorageSchema,
  args: { campaignId: string }
): StorageSchema {
  const campaign = schema.campaigns[args.campaignId];
  if (!campaign) return schema;

  const id = newId();
  const sessionNumber = campaign.sessionCount + 1;
  const session: Session = {
    id,
    campaignId: args.campaignId,
    name: `Session ${sessionNumber}`,
    sessionNumber,
    startedAt: new Date().toISOString(),
    endedAt: null,
    entryCount: 0,
  };

  return {
    ...schema,
    sessions: { ...schema.sessions, [id]: session },
    entries: { ...schema.entries, [id]: [] },
    campaigns: {
      ...schema.campaigns,
      [args.campaignId]: {
        ...campaign,
        sessionCount: sessionNumber,
        lastSessionAt: session.startedAt,
      },
    },
    settings: {
      ...schema.settings,
      activeCampaignId: args.campaignId,
      activeSessionId: id,
    },
  };
}

export function endSession(schema: StorageSchema, sessionId: string): StorageSchema {
  const session = schema.sessions[sessionId];
  if (!session) return schema;
  const settings = { ...schema.settings };
  if (settings.activeSessionId === sessionId) settings.activeSessionId = null;
  return {
    ...schema,
    sessions: {
      ...schema.sessions,
      [sessionId]: { ...session, endedAt: new Date().toISOString() },
    },
    settings,
  };
}

export function addEntry(
  schema: StorageSchema,
  args: { sessionId: string; campaignId: string; tags: EntryType[]; content: string; starred?: boolean }
): StorageSchema {
  const entry: Entry = {
    id: newId(),
    sessionId: args.sessionId,
    campaignId: args.campaignId,
    tags: args.tags,
    content: args.content,
    createdAt: new Date().toISOString(),
    starred: args.starred ?? false,
  };

  const sessionEntries = [...(schema.entries[args.sessionId] ?? []), entry];
  const session = schema.sessions[args.sessionId];

  return {
    ...schema,
    entries: { ...schema.entries, [args.sessionId]: sessionEntries },
    sessions: session
      ? { ...schema.sessions, [args.sessionId]: { ...session, entryCount: sessionEntries.length } }
      : schema.sessions,
  };
}

export function toggleStarEntry(
  schema: StorageSchema,
  args: { sessionId: string; entryId: string }
): StorageSchema {
  const sessionEntries = schema.entries[args.sessionId];
  if (!sessionEntries) return schema;
  return {
    ...schema,
    entries: {
      ...schema.entries,
      [args.sessionId]: sessionEntries.map((e) =>
        e.id === args.entryId ? { ...e, starred: !e.starred } : e
      ),
    },
  };
}

export function deleteEntry(
  schema: StorageSchema,
  args: { sessionId: string; entryId: string }
): StorageSchema {
  const sessionEntries = schema.entries[args.sessionId];
  if (!sessionEntries) return schema;
  const updated = sessionEntries.filter((e) => e.id !== args.entryId);
  const session = schema.sessions[args.sessionId];
  return {
    ...schema,
    entries: { ...schema.entries, [args.sessionId]: updated },
    sessions: session
      ? { ...schema.sessions, [args.sessionId]: { ...session, entryCount: updated.length } }
      : schema.sessions,
  };
}

export function restoreEntry(
  schema: StorageSchema,
  args: { sessionId: string; entry: Entry; index: number }
): StorageSchema {
  const sessionEntries = [...(schema.entries[args.sessionId] ?? [])];
  sessionEntries.splice(args.index, 0, args.entry);
  const session = schema.sessions[args.sessionId];
  return {
    ...schema,
    entries: { ...schema.entries, [args.sessionId]: sessionEntries },
    sessions: session
      ? { ...schema.sessions, [args.sessionId]: { ...session, entryCount: sessionEntries.length } }
      : schema.sessions,
  };
}

export function updateSettings(
  schema: StorageSchema,
  patch: Partial<StorageSchema['settings']>
): StorageSchema {
  return { ...schema, settings: { ...schema.settings, ...patch } };
}
