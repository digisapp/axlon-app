'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useMemo } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Heart, Bell, DollarSign } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Notification {
  id: string;
  type: 'message' | 'favorite' | 'listing_view' | 'inquiry' | 'system';
  title: string;
  body: string;
  link?: string;
  read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<ReturnType<typeof import('@/lib/supabase/client').createClient> | null>(null);

  // Dynamically import Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const client = createClient();
        setSupabase(client);
      } catch (error) {
        logger.error('Failed to initialize Supabase client', { error });
      }
    };

    initSupabase();
  }, []);

  // Fetch current user
  useEffect(() => {
    if (!supabase) return;

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!userId || !supabase) return;

    // Subscribe to new messages
    const messageChannel = supabase
      .channel('messages-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const newMessage = payload.new as { id: string; content: string; sender_id: string; listing_id: string };

          // Create notification
          const notification: Notification = {
            id: `msg-${newMessage.id}`,
            type: 'message',
            title: 'New Message',
            body: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : ''),
            // Canonical conversation ID format is `{listingId}-{otherUserId}`
            // (see parseConversationId in src/lib/validations/api.ts)
            link: `/dashboard/messages/${newMessage.listing_id}-${newMessage.sender_id}`,
            read: false,
            created_at: new Date().toISOString(),
          };

          setNotifications((prev) => [notification, ...prev]);

          // Show toast notification
          toast.info('New Message', {
            description: notification.body,
            icon: <MessageSquare className="w-4 h-4" />,
            action: {
              label: 'View',
              onClick: () => window.location.href = notification.link!,
            },
          });
        }
      )
      .subscribe();

    // Subscribe to new favorites on user's listings.
    //
    // NOTE: Supabase realtime filters only support column comparisons on the
    // subscribed table, and "the favorited listing belongs to me" requires a
    // join to `listings`, so this INSERT stream cannot be filtered
    // server-side — every client receives every favorite event. To keep
    // non-relevant events cheap, we prefetch the current user's listings
    // once (id -> title) and do a synchronous in-memory ownership check
    // before doing anything else; irrelevant events exit with zero queries.
    // Tradeoff: listings created after this subscription starts won't
    // trigger favorite notifications until the page reloads.
    const ownListings = new Map<string, string>();
    let ownListingsLoaded = false;

    const loadOwnListings = supabase
      .from('listings')
      .select('id, title')
      .eq('user_id', userId)
      .then(({ data }) => {
        for (const l of data ?? []) {
          ownListings.set(l.id, l.title);
        }
        ownListingsLoaded = true;
      });

    const favoritesChannel = supabase
      .channel('favorites-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'favorites',
        },
        async (payload) => {
          const newFavorite = payload.new as { user_id: string; listing_id: string };

          // Cheap early exits, no queries: ignore our own favorites, and
          // ignore favorites on listings we don't own.
          if (newFavorite.user_id === userId) return;
          if (!ownListingsLoaded) await loadOwnListings;
          const title = ownListings.get(newFavorite.listing_id);
          if (title === undefined) return;

          const notification: Notification = {
            // Composite favorite PK + timestamp keeps ids unique even when
            // multiple events land in the same millisecond or a user
            // re-favorites the same listing.
            id: `fav-${newFavorite.listing_id}-${newFavorite.user_id}-${Date.now()}`,
            type: 'favorite',
            title: 'Listing Saved',
            body: `Someone saved "${title}"`,
            link: `/listing/${newFavorite.listing_id}`,
            read: false,
            created_at: new Date().toISOString(),
          };

          setNotifications((prev) => [notification, ...prev]);

          toast.success('Listing Saved', {
            description: notification.body,
            icon: <Heart className="w-4 h-4" />,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(favoritesChannel);
    };
  }, [userId, supabase]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
