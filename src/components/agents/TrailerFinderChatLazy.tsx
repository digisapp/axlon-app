'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { optionalImport, Nothing } from '@/lib/lazy';

// Optional widget: if its chunk can't load, show nothing — don't take the
// page down with it (see lib/lazy.ts).
const TrailerFinderChat = dynamic(
  optionalImport(
    () => import('@/components/agents/TrailerFinderChat').then((mod) => mod.TrailerFinderChat),
    Nothing
  ),
  { ssr: false, loading: () => null }
);

interface TrailerFinderChatLazyProps {
  variant?: 'inline' | 'floating';
  className?: string;
}

export function TrailerFinderChatLazy(props: TrailerFinderChatLazyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer mounting until the browser is idle so the chat widget doesn't
    // compete with first paint. Safari lacks requestIdleCallback.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setMounted(true));
      return () => window.cancelIdleCallback(id);
    }
    const timeout = window.setTimeout(() => setMounted(true), 2000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!mounted) return null;

  return <TrailerFinderChat {...props} />;
}
