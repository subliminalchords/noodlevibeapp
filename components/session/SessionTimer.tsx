'use client';

import { useEffect, useState } from 'react';
import { formatDuration } from '@/lib/utils';

export function SessionTimer({ startedAt }: { startedAt: string }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-sm text-gray-400">{formatDuration(startedAt)}</span>
  );
}
