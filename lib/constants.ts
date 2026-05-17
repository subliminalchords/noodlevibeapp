import { EntryType } from './types';

export const ENTRY_PREFIX_MAP: Record<string, EntryType> = {
  '@': 'npc',
  '#': 'location',
  '>': 'decision',
  '!': 'consequence',
  '*': 'next',
};

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  note: 'Note',
  npc: 'NPC',
  location: 'Location',
  decision: 'Decision',
  consequence: 'Consequence',
  next: 'Next Session',
};

// Tailwind bg + text color classes per entry type
export const ENTRY_TYPE_COLORS: Record<EntryType, { bg: string; text: string; border: string }> = {
  note:        { bg: 'bg-slate-700',   text: 'text-slate-200',  border: 'border-slate-600' },
  npc:         { bg: 'bg-purple-900',  text: 'text-purple-200', border: 'border-purple-700' },
  location:    { bg: 'bg-blue-900',    text: 'text-blue-200',   border: 'border-blue-700' },
  decision:    { bg: 'bg-green-900',   text: 'text-green-200',  border: 'border-green-700' },
  consequence: { bg: 'bg-orange-900',  text: 'text-orange-200', border: 'border-orange-700' },
  next:        { bg: 'bg-yellow-900',  text: 'text-yellow-200', border: 'border-yellow-700' },
};

export const ENTRY_TYPE_PILL_COLORS: Record<EntryType, string> = {
  note:        'bg-slate-600 text-slate-200',
  npc:         'bg-purple-700 text-purple-100',
  location:    'bg-blue-700 text-blue-100',
  decision:    'bg-green-700 text-green-100',
  consequence: 'bg-orange-700 text-orange-100',
  next:        'bg-yellow-700 text-yellow-100',
};

export const CAMPAIGN_COLORS = [
  { label: 'Red',    value: 'bg-red-800',    badge: 'bg-red-700' },
  { label: 'Purple', value: 'bg-purple-800', badge: 'bg-purple-700' },
  { label: 'Blue',   value: 'bg-blue-800',   badge: 'bg-blue-700' },
  { label: 'Green',  value: 'bg-green-800',  badge: 'bg-green-700' },
  { label: 'Amber',  value: 'bg-amber-800',  badge: 'bg-amber-700' },
  { label: 'Teal',   value: 'bg-teal-800',   badge: 'bg-teal-700' },
];

export const STORAGE_KEY = 'noodlevibe_v1';
export const STORAGE_VERSION = 1;
