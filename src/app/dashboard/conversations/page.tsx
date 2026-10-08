'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  User,
  Clock,
  ArrowRight,
  Loader2,
  Inbox,
  UserCheck,
  Bot,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  dealer_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  status: 'active' | 'closed' | 'converted';
  message_count: number;
  user_message_count: number;
  last_message: string | null;
  last_message_at: string;
  created_at: string;
  lead: { id: string; status: string; buyer_name: string } | null;
}

export default function ConversationsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [totalConversations, setTotalConversations] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'converted' | 'closed'>('all');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const checkDealerAndFetch = async () => {
      setIsLoading(true);

      // Check if user is a dealer
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/dashboard/conversations');
        return;
      }

      // Fetch conversations
      try {
        const response = await fetch(`/api/dashboard/conversations?status=${filter}`);
        setLoadError(!response.ok);
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
          setTotalConversations(data.total ?? 0);
        }
      } catch {
        setLoadError(true);
      }

      setIsLoading(false);
    };

    checkDealerAndFetch();
  }, [filter, router, supabase]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations',
        },
        () => {
          // Refresh conversations on any change
          fetch(`/api/dashboard/conversations?status=${filter}`)
            .then((res) => res.json())
            .then((data) => {
              setConversations(data.conversations || []);
              setTotalConversations(data.total ?? 0);
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, filter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'converted':
        return <Badge className="bg-blue-500">Lead Captured</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // The API's `total` counts every conversation matching the current filter, so
  // it is exact for that status only; the other two can only be derived from the
  // rows on this page — label them that way instead of implying a full count.
  const stats = {
    total: totalConversations,
    active: filter === 'active'
      ? totalConversations
      : conversations.filter((c) => c.status === 'active').length,
    converted: filter === 'converted'
      ? totalConversations
      : conversations.filter((c) => c.status === 'converted').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Chats"
        description="Conversations buyers had with the AI assistant on your storefront"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {filter === 'all' ? 'Total Chats' : 'Matching Chats'}
                </p>
                <p className="text-xl md:text-3xl font-bold">{stats.total}</p>
              </div>
              <MessageCircle className="hidden md:block w-10 h-10 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {filter === 'active' ? 'Active Now' : 'Active Now (this page)'}
                </p>
                <p className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
              </div>
              <Bot className="hidden md:block w-10 h-10 text-green-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {filter === 'converted' ? 'Leads Captured' : 'Leads Captured (this page)'}
                </p>
                <p className="text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.converted}</p>
              </div>
              <UserCheck className="hidden md:block w-10 h-10 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="converted">Leads</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Conversations List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : loadError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="w-12 h-12 text-destructive/60 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">Couldn&apos;t load conversations</h3>
            <p className="text-muted-foreground mb-4">Something went wrong. Please try again.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      ) : conversations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            {filter === 'all' ? (
              <>
                <h3 className="text-lg font-medium mb-1">No conversations yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Conversations appear here when visitors chat with the AI assistant on your storefront. Make sure AI chat is turned on.
                </p>
                <Button asChild>
                  <Link href="/dashboard/storefront">Configure Chat Settings</Link>
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-1">
                  No {filter === 'converted' ? 'lead-captured' : filter} conversations
                </h3>
                <p className="text-muted-foreground mb-4">Try another filter.</p>
                <Button variant="outline" onClick={() => setFilter('all')}>Show all chats</Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/dashboard/conversations/${conversation.id}`}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        {conversation.visitor_name ? (
                          <User className="w-6 h-6 text-primary" />
                        ) : (
                          <Bot className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="font-medium">
                            {conversation.visitor_name || 'Anonymous Visitor'}
                          </p>
                          {getStatusBadge(conversation.status)}
                        </div>
                        {conversation.last_message && (
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                            {conversation.last_message}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {conversation.message_count} messages
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {conversation.visitor_email && (
                        <Badge variant="outline" className="text-xs hidden lg:inline-flex">
                          {conversation.visitor_email}
                        </Badge>
                      )}
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
