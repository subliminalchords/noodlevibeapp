'use client';

import { EntryType } from '@/lib/types';
import { ENTRY_TYPE_LABELS, ENTRY_TYPE_PILL_COLORS } from '@/lib/constants';
import { useStore } from '@/lib/hooks/useStore';

const ALL_TYPES: (EntryType | 'all')[] = ['all', 'note', 'npc', 'location', 'decision', 'consequence', 'next'];

interface TypeChipBarProps {
  onSelect?: (type: EntryType | 'all') => void;
}

export function TypeChipBar({ onSelect }: TypeChipBarProps) {
  const selectedType = useStore((s) => s.selectedType);
  const setSelectedType = useStore((s) => s.setSelectedType);

  function handleSelect(type: EntryType | 'all') {
    setSelectedType(type);
    onSelect?.(type);
  }

  return (
    <div className="flex gap-2 overflow-x-auto px-3 py-2 bg-gray-950 border-t border-gray-800 no-scrollbar">
      {ALL_TYPES.map((type) => {
        const active = type === selectedType;
        const color = type === 'all' ? 'bg-gray-600 text-gray-100' : ENTRY_TYPE_PILL_COLORS[type];
        return (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              active ? `${color} ring-2 ring-white/30 scale-105` : `${color} opacity-50`
            }`}
          >
            {type === 'all' ? 'All' : ENTRY_TYPE_LABELS[type as EntryType]}
          </button>
        );
      })}
    </div>
  );
}
