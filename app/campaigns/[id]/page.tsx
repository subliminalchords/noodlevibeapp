'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/hooks/useStore';
import { SessionCard } from '@/components/campaigns/SessionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { BottomNav } from '@/components/layout/BottomNav';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const campaign = useStore((s) => s.campaigns[id]);
  const sessions = useStore((s) => s.sessions);
  const createSession = useStore((s) => s.createSession);
  const activeSessionId = useStore((s) => s.settings.activeSessionId);

  if (!campaign) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center text-gray-500">Campaign not found.</div>
        <BottomNav />
      </div>
    );
  }

  const campaignSessions = Object.values(sessions)
    .filter((s) => s.campaignId === id)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));

  const activeSession = activeSessionId ? sessions[activeSessionId] : null;
  const hasActiveLiveSession = activeSession && activeSession.endedAt === null && activeSession.campaignId === id;

  function handleStartSession() {
    const newSessionId = createSession(id);
    if (newSessionId) router.push(`/campaigns/${id}/sessions/${newSessionId}`);
  }

  function handleResumeSession() {
    if (activeSession) router.push(`/campaigns/${id}/sessions/${activeSession.id}`);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-area-top">
        <button
          onClick={() => router.push('/campaigns')}
          className="text-xs text-gray-500 hover:text-gray-300 mb-3 flex items-center gap-1 transition-colors"
        >
          ← Campaigns
        </button>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={`w-3 h-3 rounded-full ${campaign.color} mb-2`} />
            <h1 className="text-xl font-bold text-white">{campaign.name}</h1>
            <p className="text-sm text-gray-400">{campaign.system}</p>
          </div>
          {hasActiveLiveSession ? (
            <button
              onClick={handleResumeSession}
              className="flex-shrink-0 bg-green-700 hover:bg-green-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            >
              Resume Live
            </button>
          ) : (
            <button
              onClick={handleStartSession}
              className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            >
              Start Session
            </button>
          )}
        </div>
      </header>

      {/* Session list */}
      <main className="flex-1 overflow-y-auto px-4 space-y-2 pb-4">
        <p className="text-xs text-gray-500 mb-3">{campaignSessions.length} session{campaignSessions.length !== 1 ? 's' : ''}</p>
        {campaignSessions.length === 0 ? (
          <EmptyState
            icon="📖"
            title="No sessions yet"
            description="Start your first session to begin logging."
            action={{ label: 'Start Session', onClick: handleStartSession }}
          />
        ) : (
          campaignSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}
