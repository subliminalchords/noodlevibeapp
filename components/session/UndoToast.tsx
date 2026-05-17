'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/hooks/useStore';

export function UndoToast() {
  const pendingUndo = useStore((s) => s.pendingUndo);
  const undoDelete = useStore((s) => s.undoDelete);
  const clearPendingUndo = useStore((s) => s.clearPendingUndo);

  useEffect(() => {
    if (!pendingUndo) return;
    const timer = setTimeout(clearPendingUndo, 3000);
    return () => clearTimeout(timer);
  }, [pendingUndo, clearPendingUndo]);

  if (!pendingUndo) return null;

  return (
    <div className="sticky top-2 z-10 mx-4 flex items-center justify-between bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 shadow-lg">
      <span className="text-sm text-gray-200">Entry deleted</span>
      <button
        onClick={undoDelete}
        className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 ml-4"
      >
        Undo
      </button>
    </div>
  );
}
