import { EntryType } from '@/lib/types';
import { ENTRY_TYPE_LABELS, ENTRY_TYPE_PILL_COLORS } from '@/lib/constants';

export function EntryTypePill({ type }: { type: EntryType }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${ENTRY_TYPE_PILL_COLORS[type]}`}>
      {ENTRY_TYPE_LABELS[type]}
    </span>
  );
}
