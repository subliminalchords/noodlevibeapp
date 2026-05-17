'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/hooks/useStore';

export function BottomNav() {
  const pathname = usePathname();
  const activeSessionId = useStore((s) => s.settings.activeSessionId);
  const sessions = useStore((s) => s.sessions);

  const activeSession = activeSessionId ? sessions[activeSessionId] : null;
  const isOnSession = pathname.startsWith('/session');

  const tabs = [
    {
      href: '/campaigns',
      label: 'Campaigns',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
        </svg>
      ),
      active: pathname.startsWith('/campaigns') && !isOnSession,
    },
    ...(activeSession
      ? [{
          href: `/session/?campaignId=${activeSession.campaignId}&sessionId=${activeSession.id}`,
          label: 'Live',
          icon: (
            <div className="relative">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          ),
          active: isOnSession,
        }]
      : []),
    {
      href: '/settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" />
        </svg>
      ),
      active: pathname === '/settings',
    },
  ];

  return (
    <nav className="flex items-center justify-around bg-gray-950 border-t border-gray-800 safe-area-bottom">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`flex flex-col items-center gap-1 py-3 px-5 transition-colors ${
            tab.active ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {tab.icon}
          <span className="text-xs font-medium">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
