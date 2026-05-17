'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CAMPAIGN_COLORS } from '@/lib/constants';

interface CampaignFormProps {
  onSubmit: (data: { name: string; system: string; color: string }) => void;
  onClose: () => void;
  initial?: { name: string; system: string; color: string };
}

export function CampaignForm({ onSubmit, onClose, initial }: CampaignFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [system, setSystem] = useState(initial?.system ?? 'D&D 5e');
  const [color, setColor] = useState(initial?.color ?? CAMPAIGN_COLORS[0].value);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), system: system.trim() || 'D&D 5e', color });
    onClose();
  }

  return (
    <Modal title={initial ? 'Edit Campaign' : 'New Campaign'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Campaign Name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Curse of Strahd"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">System</label>
          <input
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            placeholder="D&D 5e"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-2">Color</label>
          <div className="flex gap-2">
            {CAMPAIGN_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full ${c.badge} transition-transform ${
                  color === c.value ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" className="flex-1" disabled={!name.trim()}>
            {initial ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
