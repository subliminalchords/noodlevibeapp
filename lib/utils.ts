import { EntryType } from './types';
import { ENTRY_PREFIX_MAP } from './constants';

export function newId(): string {
  return crypto.randomUUID();
}

export function parseEntryType(text: string): EntryType {
  const first = text[0];
  return ENTRY_PREFIX_MAP[first] ?? 'note';
}

export interface ContentToken {
  text: string;
  type: EntryType | null;
}

// Coordinating conjunctions stripped from the tail of a segment when followed by another
const TRAILING_CONNECTORS = new Set(['for', 'and', 'nor', 'but', 'or', 'yet', 'so', 'then']);

// A prefix captures all text from that prefix until the next prefix-at-word-boundary
// or end of string. Trailing connector words (and, but, or…) before the next prefix
// are split off as plain tokens so they don't pollute the entity text.
export function tokenizeContent(text: string): ContentToken[] {
  const trimmed = text.trim();

  // Find all segment-start positions: prefix chars at pos 0 or immediately after a space
  const starts: Array<{ pos: number; type: EntryType }> = [];
  for (let i = 0; i < trimmed.length; i++) {
    const type = ENTRY_PREFIX_MAP[trimmed[i]];
    if (type && (i === 0 || trimmed[i - 1] === ' ')) starts.push({ pos: i, type });
  }

  if (starts.length === 0) return [{ text: trimmed, type: null }];

  const tokens: ContentToken[] = [];

  // Untagged text before the first prefix (if any)
  if (starts[0].pos > 0) {
    const pre = trimmed.slice(0, starts[0].pos).trim();
    if (pre) tokens.push({ text: pre, type: null });
  }

  for (let i = 0; i < starts.length; i++) {
    const { pos, type } = starts[i];
    const nextPos = i + 1 < starts.length ? starts[i + 1].pos - 1 : trimmed.length;
    const rawText = trimmed.slice(pos + 1, nextPos).trim();
    const isLast = i + 1 >= starts.length;

    // Strip trailing connector from non-final segments so it doesn't pollute entity text
    const words = rawText.split(' ');
    const lastWord = words[words.length - 1]?.toLowerCase();
    const hasConnector = !isLast && words.length > 1 && TRAILING_CONNECTORS.has(lastWord);

    const segText = hasConnector ? words.slice(0, -1).join(' ') : rawText;
    if (segText) tokens.push({ text: segText, type });
    if (hasConnector) tokens.push({ text: words[words.length - 1], type: null });
  }

  return tokens;
}

// Collect unique types from all segments. Falls back to ['note'] if none found.
export function parseInlineTags(text: string): EntryType[] {
  const types = tokenizeContent(text)
    .filter((t) => t.type !== null)
    .map((t) => t.type as EntryType);
  const unique = Array.from(new Set(types));
  return unique.length > 0 ? unique : ['note'];
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
