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

// A prefix char at word-start opens a tag. Single-word by default: @eduardo
// Wrap with the same char as a closing delimiter for multi-word: @Eduardo, the Indefensible@
// Closing delimiter: same char, not preceded by space, followed by space or end of string.
export function tokenizeContent(text: string): ContentToken[] {
  const tokens: ContentToken[] = [];
  let i = 0;
  let plainStart = 0;

  while (i < text.length) {
    const char = text[i];
    const prefixType = ENTRY_PREFIX_MAP[char];
    const isOpening = prefixType !== undefined && (i === 0 || text[i - 1] === ' ');

    if (isOpening) {
      const plain = text.slice(plainStart, i).trim();
      if (plain) tokens.push({ text: plain, type: null });

      let closeIdx = -1;
      for (let j = i + 1; j < text.length; j++) {
        if (
          text[j] === char &&
          text[j - 1] !== ' ' &&
          (j + 1 >= text.length || text[j + 1] === ' ')
        ) {
          closeIdx = j;
          break;
        }
      }

      if (closeIdx !== -1) {
        const entityText = text.slice(i + 1, closeIdx).trim();
        if (entityText) tokens.push({ text: entityText, type: prefixType });
        i = closeIdx + 1;
      } else {
        const spaceIdx = text.indexOf(' ', i + 1);
        const wordEnd = spaceIdx !== -1 ? spaceIdx : text.length;
        const word = text.slice(i + 1, wordEnd).trim();
        if (word) tokens.push({ text: word, type: prefixType });
        i = wordEnd;
      }
      plainStart = i;
    } else {
      i++;
    }
  }

  const plain = text.slice(plainStart).trim();
  if (plain) tokens.push({ text: plain, type: null });

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
