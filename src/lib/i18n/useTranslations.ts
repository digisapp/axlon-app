'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { detectLocale, getTranslations, type SearchTranslations, type SupportedLocale } from './translations';

// The browser locale never changes during a session, so there's nothing to
// subscribe to — a no-op subscribe is correct here.
const noopSubscribe = () => () => {};

export function useSearchTranslations() {
  // useSyncExternalStore returns the server snapshot ('en') during SSR and the
  // first hydration render, then the client snapshot (detected locale) after —
  // hydration-safe with no setState-in-effect.
  const locale = useSyncExternalStore<SupportedLocale>(
    noopSubscribe,
    () => detectLocale(),
    () => 'en'
  );

  const translations = useMemo<SearchTranslations>(() => getTranslations(locale), [locale]);

  return { translations, locale };
}
