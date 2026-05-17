'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/hooks/useStore';
import { useSessionEntries } from '@/lib/hooks/useSession';
import { EntryCard } from './EntryCard';
import { UndoToast } from './UndoToast';

interface EntryFeedProps {
  sessionId: string;
}

export function EntryFeed({ sessionId }: EntryFeedProps) {
  const selectedType = useStore((s) => s.selectedType);
  const entries = useSessionEntries(sessionId, selectedType);
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries appear
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [entries.length]);

  return (
    <div ref={feedRef} className="flex-1 overflow-y-auto relative">
      <UndoToast />
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6 py-20">
          <p className="text-4xl mb-3">🎲</p>
          <p className="text-gray-400 text-sm">
            {selectedType === 'all'
              ? 'Session log is empty. Start typing below.'
              : `No ${selectedType} entries yet.`}
          </p>
        </div>
      ) : (
        <div className="pb-2">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} sessionId={sessionId} />
          ))}
        </div>
      )}
    </div>
  );
}
