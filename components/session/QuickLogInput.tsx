'use client';

import { useRef, useState } from 'react';
import { EntryType } from '@/lib/types';
import { parseEntryType } from '@/lib/utils';
import { useStore } from '@/lib/hooks/useStore';

interface QuickLogInputProps {
  sessionId: string;
  campaignId: string;
}

export function QuickLogInput({ sessionId, campaignId }: QuickLogInputProps) {
  const addEntry = useStore((s) => s.addEntry);
  const setSelectedType = useStore((s) => s.setSelectedType);
  const selectedType = useStore((s) => s.selectedType);

  const [value, setValue] = useState('');
  const [starred, setStarred] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function getEntryType(): EntryType {
    const detectedType = parseEntryType(value);
    if (detectedType !== 'note') return detectedType;
    if (selectedType !== 'all') return selectedType as EntryType;
    return 'note';
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setValue(text);
    const detected = parseEntryType(text);
    if (detected !== 'note') setSelectedType(detected);
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const type = getEntryType();
    addEntry({ sessionId, campaignId, type, content: trimmed, starred });
    setValue('');
    setStarred(false);
    // Synchronous re-focus keeps iOS keyboard open
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const activeType = getEntryType();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-950 border-t border-gray-800 safe-area-bottom">
      {/* Star toggle */}
      <button
        type="button"
        onClick={() => setStarred((s) => !s)}
        className={`flex-shrink-0 text-xl transition-colors ${starred ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`}
      >
        ★
      </button>

      {/* Text input */}
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Log a ${activeType === 'note' ? 'note' : activeType}… (@npc #place >decision !consequence *next)`}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          className="w-full bg-gray-800 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Send button */}
      <button
        type="button"
        onClick={submit}
        disabled={!value.trim()}
        className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl px-3 py-2.5 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
