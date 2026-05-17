'use client';

import { useRouter } from 'next/navigation';
import { Session } from '@/lib/types';
import { SessionTimer } from '@/components/session/SessionTimer';
import { useStore } from '@/lib/hooks/useStore';

interface TopBarProps {
  session: Session;
}

export function TopBar({ session }: TopBarProps) {
  const endSession = useStore((s) => s.endSession);
  const router = useRouter();

  function handleEnd() {
    if (!confirm('End this session?')) return;
    endSession(session.id);
    router.push(`/campaigns/detail/?id=${session.campaignId}`);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800 safe-area-top">
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-white truncate">{session.name}</h1>
        <SessionTimer startedAt={session.startedAt} />
      </div>
      <button
        onClick={handleEnd}
        className="ml-4 flex-shrink-0 text-xs font-medium text-red-400 border border-red-800 rounded-lg px-3 py-1.5 hover:bg-red-900/30 transition-colors"
      >
        End Session
      </button>
    </div>
  );
}
