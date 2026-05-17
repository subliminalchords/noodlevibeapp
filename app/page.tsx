'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/hooks/useStore';

export default function Home() {
  const router = useRouter();
  const activeSessionId = useStore((s) => s.settings.activeSessionId);
  const activeCampaignId = useStore((s) => s.settings.activeCampaignId);
  const sessions = useStore((s) => s.sessions);

  useEffect(() => {
    const activeSession = activeSessionId ? sessions[activeSessionId] : null;
    if (activeSession && activeSession.endedAt === null) {
      router.replace(`/campaigns/${activeSession.campaignId}/sessions/${activeSession.id}`);
    } else {
      router.replace('/campaigns');
    }
  }, [activeSessionId, activeCampaignId, sessions, router]);

  return null;
}
