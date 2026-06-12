'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

interface CompareListing {
  id: string;
  title: string;
  price: number | null;
  year: number | null;
  make: string | null;
  model: string | null;
  mileage: number | null;
  hours: number | null;
  condition: string | null;
  image_url: string | null;
}

interface CompareContextType {
  listings: CompareListing[];
  addListing: (listing: CompareListing) => void;
  removeListing: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 4;

// Helper to safely load from localStorage (runs only on client)
function loadFromStorage(): CompareListing[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('compare-listings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      localStorage.removeItem('compare-listings');
    }
  } catch {
    localStorage.removeItem('compare-listings');
  }
  return [];
}

export function CompareProvider({ children }: { children: ReactNode }) {
  // Start empty and load from localStorage after mount — reading storage
  // during the hydration render makes the client's first render differ from
  // the server HTML and triggers a hydration error on every page
  const [listings, setListings] = useState<CompareListing[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage can only be read after mount; reading it during render causes a hydration mismatch
    setListings(loadFromStorage());
    setHydrated(true);
  }, []);

  // Save to localStorage on change (skip until the stored value is loaded,
  // otherwise the initial empty state would wipe it)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('compare-listings', JSON.stringify(listings));
  }, [listings, hydrated]);

  const addListing = useCallback((listing: CompareListing) => {
    setListings((prev) => {
      if (prev.length >= MAX_COMPARE) return prev;
      if (prev.some((l) => l.id === listing.id)) return prev;
      return [...prev, listing];
    });
  }, []);

  const removeListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setListings([]);
  }, []);

  const isInCompare = useCallback((id: string) => {
    return listings.some((l) => l.id === id);
  }, [listings]);

  const value = useMemo(() => ({
    listings,
    addListing,
    removeListing,
    clearAll,
    isInCompare,
    canAddMore: listings.length < MAX_COMPARE,
  }), [listings, addListing, removeListing, clearAll, isInCompare]);

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
