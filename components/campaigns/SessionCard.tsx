'use client';

import Link from 'next/link';
import { Session } from '@/lib/types';
import { formatDate, formatDuration } from '@/lib/utils';

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const isActive = session.endedAt === null;

  return (
    <Link
      href={`/campaigns/${session.campaignId}/sessions/${session.id}`}
      className={`block rounded-xl border px-4 py-3.5 transition-colors ${
        isActive
          ? 'border-green-700 bg-green-950/30 hover:bg-green-950/50'
          : 'border-gray-800 bg-gray-900/50 hover:bg-gray-800/50'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {isActive && (
            <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
          <span className="font-medium text-white text-sm truncate">{session.name}</span>
        </div>
        {isActive ? (
          <span className="flex-shrink-0 text-xs font-semibold text-green-400 bg-green-900/50 px-2 py-0.5 rounded-full">
            Live
          </span>
        ) : (
          <span className="flex-shrink-0 text-xs text-gray-500">
            {formatDuration(session.startedAt, session.endedAt)}
          </span>
        )}
      </div>
      <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
        <span>{formatDate(session.startedAt)}</span>
        <span>{session.entryCount} entries</span>
      </div>
    </Link>
  );
}
