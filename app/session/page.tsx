'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/hooks/useStore';
import { TopBar } from '@/components/layout/TopBar';
import { EntryFeed } from '@/components/session/EntryFeed';
import { TypeChipBar } from '@/components/session/TypeChipBar';
import { QuickLogInput } from '@/components/session/QuickLogInput';
import { SessionSummary } from '@/components/session/SessionSummary';
import { BottomNav } from '@/components/layout/BottomNav';

function SessionPageInner() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId') ?? '';
  const sessionId = searchParams.get('sessionId') ?? '';
  const isSummary = searchParams.get('view') === 'summary';

  const session = useStore((s) => s.sessions[sessionId]);
  const isActive = session && session.endedAt === null;

  if (!session) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center text-gray-500">Session not found.</div>
        <BottomNav />
      </div>
    );
  }

  if (isSummary || !isActive) {
    return (
      <div className="flex flex-col h-full">
        <SessionSummary session={session} campaignId={campaignId} />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar session={session} />
      <EntryFeed sessionId={sessionId} />
      <TypeChipBar />
      <QuickLogInput sessionId={sessionId} campaignId={campaignId} />
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionPageInner />
    </Suspense>
  );
}
