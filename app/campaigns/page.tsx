'use client';

import { useState } from 'react';
import { useStore } from '@/lib/hooks/useStore';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { BottomNav } from '@/components/layout/BottomNav';
import { Campaign } from '@/lib/types';

export default function CampaignsPage() {
  const campaigns = useStore((s) => s.campaigns);
  const createCampaign = useStore((s) => s.createCampaign);
  const updateCampaign = useStore((s) => s.updateCampaign);
  const deleteCampaign = useStore((s) => s.deleteCampaign);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);

  const campaignList = Object.values(campaigns).sort(
    (a, b) => (b.lastSessionAt ?? b.createdAt).localeCompare(a.lastSessionAt ?? a.createdAt)
  );

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}" and all its sessions? This cannot be undone.`)) return;
    deleteCampaign(id);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-6 pb-4 safe-area-top">
        <div>
          <h1 className="text-xl font-bold text-white">Campaigns</h1>
          <p className="text-xs text-gray-500 mt-0.5">{campaignList.length} campaign{campaignList.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
        >
          + New
        </button>
      </header>

      {/* Campaign list */}
      <main className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {campaignList.length === 0 ? (
          <EmptyState
            icon="🎲"
            title="No campaigns yet"
            description="Create your first campaign to start tracking sessions."
            action={{ label: 'Create Campaign', onClick: () => setShowCreate(true) }}
          />
        ) : (
          campaignList.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={() => setEditing(campaign)}
              onDelete={() => handleDelete(campaign.id, campaign.name)}
            />
          ))
        )}
      </main>

      <BottomNav />

      {showCreate && (
        <CampaignForm
          onSubmit={createCampaign}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editing && (
        <CampaignForm
          initial={editing}
          onSubmit={(data) => updateCampaign({ id: editing.id, ...data })}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
