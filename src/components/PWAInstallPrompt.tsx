'use client';

import { useEffect } from 'react';

/**
 * Cleanup component — unregisters any previously installed service worker
 * and clears PWA caches. Safe to remove once all users have been cleaned up.
 */
export function PWACleanup() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });

    // Clear old caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
  }, []);

  return null;
}
