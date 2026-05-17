import { EntryType } from './types';
import { ENTRY_PREFIX_MAP } from './constants';

export function newId(): string {
  return crypto.randomUUID();
}

export function parseEntryType(text: string): EntryType {
  const first = text[0];
  return ENTRY_PREFIX_MAP[first] ?? 'note';
}

// Walk every whitespace-separated word, collect unique types from prefix chars.
// Falls back to ['note'] if no prefixes found.
export function parseInlineTags(text: string): EntryType[] {
  const seen = new Set<EntryType>();
  for (const word of text.trim().split(/\s+/)) {
    const type = ENTRY_PREFIX_MAP[word[0]];
    if (type) seen.add(type);
  }
  return seen.size > 0 ? Array.from(seen) : ['note'];
}

export interface ContentToken {
  text: string;
  type: EntryType | null;
}

// Split text into tokens for rich inline rendering.
// Each word either carries a type (prefix match) or is null (plain text).
export function tokenizeContent(text: string): ContentToken[] {
  return text.trim().split(/\s+/).map((word) => ({
    text: word,
    type: ENTRY_PREFIX_MAP[word[0]] ?? null,
  }));
}

export function formatDuration(startedAt: string, endedAt?: string | null): string {
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const secs = Math.floor((end - start) / 1000);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatRelativeTime(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function stripPrefix(content: string): string {
  return ENTRY_PREFIX_MAP[content[0]] ? content.slice(1).trim() : content.trim();
}
