'use client';

import { useRouter } from 'next/navigation';
import { Session, EntryType } from '@/lib/types';
import { ENTRY_TYPE_LABELS } from '@/lib/constants';
import { useStore } from '@/lib/hooks/useStore';
import { formatDate, formatDuration, stripPrefix } from '@/lib/utils';
import { EntryTypePill } from './EntryTypePill';

const SUMMARY_ORDER: EntryType[] = ['next', 'decision', 'consequence', 'npc', 'location', 'note'];

interface SessionSummaryProps {
  session: Session;
  campaignId: string;
}

export function SessionSummary({ session, campaignId }: SessionSummaryProps) {
  const router = useRouter();
  const allEntries = useStore((s) => s.entries[session.id] ?? []);
  const starred = allEntries.filter((e) => e.starred);
  const byType = Object.fromEntries(
    SUMMARY_ORDER.map((type) => [type, allEntries.filter((e) => e.type === type)])
  ) as Record<EntryType, typeof allEntries>;

  function copyMarkdown() {
    const lines: string[] = [`# ${session.name}`, `*${formatDate(session.startedAt)}*`, ''];

    if (starred.length > 0) {
      lines.push('## ★ Starred', ...starred.map((e) => `- ${stripPrefix(e.content)}`), '');
    }

    for (const type of SUMMARY_ORDER) {
      const entries = byType[type];
      if (entries.length === 0) continue;
      lines.push(`## ${ENTRY_TYPE_LABELS[type]}`, ...entries.map((e) => `- ${stripPrefix(e.content)}`), '');
    }

    navigator.clipboard.writeText(lines.join('\n'));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-area-top border-b border-gray-800">
        <button
          onClick={() => router.push(`/campaigns/${campaignId}`)}
          className="text-xs text-gray-500 hover:text-gray-300 mb-3 flex items-center gap-1 transition-colors"
        >
          ← Campaign
        </button>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">{session.name}</h1>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(session.startedAt)}
              {session.endedAt && ` · ${formatDuration(session.startedAt, session.endedAt)}`}
              {' · '}{allEntries.length} entries
            </p>
          </div>
          <button
            onClick={copyMarkdown}
            className="flex-shrink-0 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy MD
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {allEntries.length === 0 && (
          <p className="text-center text-gray-500 py-10">No entries logged.</p>
        )}

        {/* Starred */}
        {starred.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">★ Starred</h2>
            <ul className="space-y-1.5">
              {starred.map((e) => (
                <li key={e.id} className="flex gap-2 text-sm text-gray-200">
                  <EntryTypePill type={e.type} />
                  <span className="flex-1">{stripPrefix(e.content)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* By type */}
        {SUMMARY_ORDER.map((type) => {
          const entries = byType[type];
          if (entries.length === 0) return null;
          return (
            <section key={type}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {ENTRY_TYPE_LABELS[type]}
              </h2>
              <ul className="space-y-1.5">
                {entries.map((e) => (
                  <li key={e.id} className="text-sm text-gray-200 flex items-start gap-2">
                    {e.starred && <span className="text-yellow-400 mt-0.5 flex-shrink-0">★</span>}
                    <span>{stripPrefix(e.content)}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
  );
}
