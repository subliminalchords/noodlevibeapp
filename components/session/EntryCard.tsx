'use client';

import { useRef, useState } from 'react';
import { Entry } from '@/lib/types';
import { tokenizeContent } from '@/lib/utils';
import { ENTRY_TYPE_COLORS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import { EntryTypePill } from './EntryTypePill';
import { useStore } from '@/lib/hooks/useStore';

interface EntryCardProps {
  entry: Entry;
  sessionId: string;
}

function RichEntryText({ content }: { content: string }) {
  const tokens = tokenizeContent(content);
  return (
    <p className="text-sm text-gray-100 leading-relaxed break-words">
      {tokens.map((token, i) => {
        if (token.type) {
          const color = ENTRY_TYPE_COLORS[token.type].text;
          return (
            <span key={i} className={`${color} font-medium`}>
              {token.text}{' '}
            </span>
          );
        }
        return <span key={i}>{token.text}{' '}</span>;
      })}
    </p>
  );
}

export function EntryCard({ entry, sessionId }: EntryCardProps) {
  const toggleStar = useStore((s) => s.toggleStarEntry);
  const deleteEntry = useStore((s) => s.deleteEntry);

  const startX = useRef(0);
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
    setSwiping(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!swiping) return;
    setSwipeX(e.clientX - startX.current);
  }

  function onPointerUp() {
    if (!swiping) return;
    setSwiping(false);
    if (swipeX > 60) {
      toggleStar({ sessionId, entryId: entry.id });
    } else if (swipeX < -60) {
      deleteEntry({ sessionId, entryId: entry.id });
    }
    setSwipeX(0);
  }

  const clampedX = Math.max(-80, Math.min(80, swipeX));

  return (
    <div className="relative overflow-hidden">
      {/* Swipe hint backgrounds */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-yellow-700/40 flex items-center pl-4">
          <span className="text-yellow-300 text-lg">★</span>
        </div>
        <div className="flex-1 bg-red-800/40 flex items-center justify-end pr-4">
          <span className="text-red-300 text-lg">✕</span>
        </div>
      </div>

      <div
        className="relative flex gap-3 px-4 py-3 border-b border-gray-800 touch-pan-y select-none"
        style={{
          transform: `translateX(${clampedX}px)`,
          transition: swiping ? 'none' : 'transform 80ms ease-out',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {entry.tags.map((tag) => (
              <EntryTypePill key={tag} type={tag} />
            ))}
            <span className="text-xs text-gray-500 ml-auto">{formatRelativeTime(entry.createdAt)}</span>
          </div>
          <RichEntryText content={entry.content} />
        </div>
        <button
          className={`flex-shrink-0 text-lg mt-0.5 transition-colors ${
            entry.starred ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'
          }`}
          onClick={() => toggleStar({ sessionId, entryId: entry.id })}
          onPointerDown={(e) => e.stopPropagation()}
        >
          ★
        </button>
      </div>
    </div>
  );
}
