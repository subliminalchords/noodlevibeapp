'use client';

import { useRef } from 'react';
import { useStore } from '@/lib/hooks/useStore';
import { exportStorage } from '@/lib/storage';
import { BottomNav } from '@/components/layout/BottomNav';

export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const clearAllData = useStore((s) => s.clearAllData);
  const importData = useStore((s) => s.importData);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = exportStorage();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noodlevibe-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        importData(ev.target?.result as string);
        alert('Data imported successfully.');
      } catch {
        alert('Failed to import — invalid file.');
      }
    };
    reader.readAsText(file);
  }

  function handleClear() {
    if (!confirm('Delete ALL campaigns, sessions, and entries? This cannot be undone.')) return;
    if (!confirm('Are you absolutely sure? All data will be lost.')) return;
    clearAllData();
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 pt-6 pb-4 safe-area-top">
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {/* Haptic feedback */}
        <div className="flex items-center justify-between py-4 border-b border-gray-800">
          <div>
            <p className="text-sm font-medium text-white">Haptic Feedback</p>
            <p className="text-xs text-gray-500 mt-0.5">Vibrate on entry submit</p>
          </div>
          <button
            onClick={() => updateSettings({ hapticFeedback: !settings.hapticFeedback })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.hapticFeedback ? 'bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.hapticFeedback ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Export */}
        <div className="py-4 border-b border-gray-800">
          <p className="text-sm font-medium text-white mb-1">Export Data</p>
          <p className="text-xs text-gray-500 mb-3">Download all your campaigns, sessions, and entries as JSON.</p>
          <button
            onClick={handleExport}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          >
            Export JSON
          </button>
        </div>

        {/* Import */}
        <div className="py-4 border-b border-gray-800">
          <p className="text-sm font-medium text-white mb-1">Import Data</p>
          <p className="text-xs text-gray-500 mb-3">Restore from a previously exported JSON file. This replaces all current data.</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          >
            Import JSON
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>

        {/* Clear */}
        <div className="py-4">
          <p className="text-sm font-medium text-red-400 mb-1">Danger Zone</p>
          <p className="text-xs text-gray-500 mb-3">Permanently delete all data from this device.</p>
          <button
            onClick={handleClear}
            className="bg-red-900/40 hover:bg-red-900/70 text-red-400 border border-red-800 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          >
            Clear All Data
          </button>
        </div>

        <p className="text-xs text-gray-600 text-center pt-4">NoodleVibe · Local-first D&D session tracker</p>
      </main>

      <BottomNav />
    </div>
  );
}
