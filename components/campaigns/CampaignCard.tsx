'use client';

import Link from 'next/link';
import { Campaign } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
}

export function CampaignCard({ campaign, onEdit, onDelete }: CampaignCardProps) {
  return (
    <div className={`relative rounded-2xl border border-gray-800 overflow-hidden`}>
      <div className={`${campaign.color} h-1.5 w-full`} />
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/campaigns/detail/?id=${campaign.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{campaign.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{campaign.system}</p>
          </Link>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-gray-300 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4L18.5 2.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <Link href={`/campaigns/detail/?id=${campaign.id}`} className="block mt-3">
          <div className="flex gap-4 text-xs text-gray-500">
            <span>{campaign.sessionCount} session{campaign.sessionCount !== 1 ? 's' : ''}</span>
            {campaign.lastSessionAt && <span>Last: {formatDate(campaign.lastSessionAt)}</span>}
          </div>
        </Link>
      </div>
    </div>
  );
}
