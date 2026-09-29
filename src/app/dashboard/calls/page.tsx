'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  Loader2,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  Search,
  Play,
  Download,
  UserPlus,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Headphones,
} from 'lucide-react';
import { MiniAudioPlayer } from '@/components/dashboard/AudioPlayer';
import { logger } from '@/lib/logger';

interface CallLog {
  id: string;
  caller_phone: string;
  caller_name: string | null;
  duration_seconds: number | null;
  status: string;
  recording_url: string | null;
  interest: string | null;
  equipment_type: string | null;
  intent: string | null;
  lead_id: string | null;
  started_at: string;
  ended_at: string | null;
  transcript: string | null;
  transcript_status: string | null;
  summary: string | null;
}

interface CallStats {
  totalCalls: number;
  totalMinutes: number;
  leadsCapture: number;
  avgDuration: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CallsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [stats, setStats] = useState<CallStats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [playingRecording, setPlayingRecording] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login?redirect=/dashboard/calls');
      return;
    }
  };

  const fetchCalls = async (pageOverride?: number) => {
    setIsLoading(true);
    try {
      const page = pageOverride ?? pagination.page;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      if (search) {
        params.set('search', search);
      }

      const response = await fetch(`/api/dealer/call-logs?${params}`);
      setLoadError(!response.ok);
      if (response.ok) {
        const data = await response.json();
        setCalls(data.data || []);
        setStats(data.stats || null);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      logger.error('Error fetching calls', { error });
      setLoadError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, statusFilter]);

  const handleSearch = () => {
    // Reset to page 1 on a new search. If already on page 1 the [pagination.page]
    // effect won't re-fire, so fetch directly; otherwise let the effect fetch the
    // new page (passing an explicit page avoids reading a stale closure value).
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    } else {
      fetchCalls(1);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'Unknown';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <PhoneIncoming className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'missed':
        return <PhoneMissed className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <Phone className="w-4 h-4 text-blue-500 animate-pulse" />;
      default:
        return <PhoneOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      case 'missed':
        return <Badge variant="destructive">Missed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status.replace(/_/g, ' ')}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Call Log"
        description="Every call your AI voice agent answered, with summaries and transcripts"
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/voice-agent">
              <Phone className="w-4 h-4 mr-2" />
              Voice Agent Settings
            </Link>
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <PhoneIncoming className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalCalls}</p>
                    <p className="text-xs text-muted-foreground">Total Calls</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalMinutes}</p>
                    <p className="text-xs text-muted-foreground">Total Minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.leadsCapture}</p>
                    <p className="text-xs text-muted-foreground">Leads Captured</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</p>
                    <p className="text-xs text-muted-foreground">Avg Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search by phone or name..."
                  aria-label="Search calls"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="max-w-sm"
                />
                <Button variant="outline" onClick={handleSearch} aria-label="Search">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <Select value={statusFilter} onValueChange={(v) => {
                setStatusFilter(v);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}>
                <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Calls</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Calls Table */}
        <Card>
          <CardHeader>
            <CardTitle>Calls</CardTitle>
            <CardDescription>
              {pagination.total} total calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : loadError ? (
              <div className="text-center py-12">
                <PhoneOff className="w-12 h-12 mx-auto mb-4 text-destructive/60" />
                <p className="text-lg font-medium">Couldn&apos;t load your calls</p>
                <p className="text-sm text-muted-foreground mb-4">Something went wrong. Please try again.</p>
                <Button variant="outline" onClick={() => fetchCalls()}>Retry</Button>
              </div>
            ) : calls.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Phone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No calls found</p>
                <p className="text-sm">
                  {search || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Calls will appear here once your AI agent starts receiving them'}
                </p>
              </div>
            ) : (
              <>
                {/* Phones: stacked cards — an 8-column table is unusable at 393px */}
                <ul className="md:hidden divide-y -mx-2">
                  {calls.map((call) => {
                    const expandable = !!(call.transcript || call.summary);
                    const isOpen = expandedCall === call.id;
                    return (
                      <li key={call.id} className="px-2 py-3 space-y-2">
                        <button
                          type="button"
                          className="w-full text-left flex items-start gap-3 disabled:cursor-default"
                          onClick={() => setExpandedCall(isOpen ? null : call.id)}
                          disabled={!expandable}
                          aria-expanded={expandable ? isOpen : undefined}
                        >
                          <span className="mt-0.5 shrink-0">{getStatusIcon(call.status)}</span>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center justify-between gap-2">
                              <span className="font-medium truncate">
                                {call.caller_name || formatPhoneNumber(call.caller_phone)}
                              </span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {new Date(call.started_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                {' · '}
                                {new Date(call.started_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                              </span>
                            </span>
                            {call.caller_name && (
                              <span className="block text-xs text-muted-foreground">
                                {formatPhoneNumber(call.caller_phone)}
                              </span>
                            )}
                            {(call.summary || call.interest) ? (
                              <span className={`block text-sm mt-1 text-muted-foreground ${isOpen ? '' : 'line-clamp-2'}`}>
                                {call.summary || call.interest}
                              </span>
                            ) : call.transcript_status === 'processing' && (
                              <span className="flex items-center gap-1 text-sm mt-1 text-muted-foreground">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Processing...
                              </span>
                            )}
                            <span className="flex flex-wrap items-center gap-2 mt-2">
                              {getStatusBadge(call.status)}
                              {call.intent && (
                                <Badge variant="outline" className="text-xs capitalize">
                                  {call.intent}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground font-mono">
                                {formatDuration(call.duration_seconds)}
                              </span>
                              {call.lead_id && (
                                <Badge variant="secondary">
                                  <UserPlus className="w-3 h-3 mr-1" />
                                  Lead captured
                                </Badge>
                              )}
                              {expandable && (
                                <span className="ml-auto text-xs text-primary flex items-center gap-0.5">
                                  {isOpen ? 'Hide' : 'Transcript'}
                                  {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </span>
                              )}
                            </span>
                          </span>
                        </button>
                        {call.recording_url && (
                          playingRecording === call.id ? (
                            <MiniAudioPlayer src={call.recording_url} onClose={() => setPlayingRecording(null)} />
                          ) : (
                            <Button variant="outline" size="sm" className="ml-7 gap-1.5" onClick={() => setPlayingRecording(call.id)}>
                              <Headphones className="w-3.5 h-3.5" />
                              Listen
                            </Button>
                          )
                        )}
                        {isOpen && call.transcript && (
                          <div className="ml-7 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md max-h-64 overflow-y-auto whitespace-pre-wrap">
                            {call.transcript}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Caller</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Lead</TableHead>
                      <TableHead className="text-right">Recording</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calls.map((call) => (
                      <Fragment key={call.id}>
                        <TableRow
                          className={`cursor-pointer hover:bg-muted/50 ${expandedCall === call.id ? 'bg-muted/50' : ''}`}
                          onClick={() => setExpandedCall(expandedCall === call.id ? null : call.id)}
                        >
                          <TableCell>
                            {(call.transcript || call.summary) && (
                              expandedCall === call.id
                                ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(call.status)}
                              {getStatusBadge(call.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {call.caller_name || formatPhoneNumber(call.caller_phone)}
                              </p>
                              {call.caller_name && (
                                <p className="text-xs text-muted-foreground">
                                  {formatPhoneNumber(call.caller_phone)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm">
                                  {new Date(call.started_at).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(call.started_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono">
                              {formatDuration(call.duration_seconds)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[250px]">
                              {call.summary ? (
                                <p className="text-sm truncate" title={call.summary}>
                                  {call.summary}
                                </p>
                              ) : call.interest ? (
                                <p className="text-sm truncate text-muted-foreground" title={call.interest}>
                                  {call.interest}
                                </p>
                              ) : call.transcript_status === 'processing' ? (
                                <span className="text-muted-foreground text-sm flex items-center gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Processing...
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                              {call.intent && (
                                <Badge variant="outline" className="mt-1 text-xs capitalize">
                                  {call.intent}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {call.lead_id ? (
                              <Badge variant="secondary">
                                <UserPlus className="w-3 h-3 mr-1" />
                                Captured
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            {call.recording_url ? (
                              playingRecording === call.id ? (
                                <MiniAudioPlayer
                                  src={call.recording_url}
                                  onClose={() => setPlayingRecording(null)}
                                />
                              ) : (
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPlayingRecording(call.id)}
                                    className="gap-1.5"
                                  >
                                    <Headphones className="w-3.5 h-3.5" />
                                    Listen
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const a = document.createElement('a');
                                      a.href = call.recording_url!;
                                      a.download = `call-${call.id}.mp3`;
                                      a.click();
                                    }}
                                    title="Download recording"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              )
                            ) : (
                              <span className="text-muted-foreground text-sm">No recording</span>
                            )}
                          </TableCell>
                        </TableRow>
                        {/* Expanded row for transcript */}
                        {expandedCall === call.id && (call.transcript || call.summary) && (
                          <TableRow key={`${call.id}-expanded`}>
                            <TableCell colSpan={8} className="bg-muted/30 p-4">
                              <div className="space-y-4">
                                {call.summary && (
                                  <div>
                                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                      <Sparkles className="w-4 h-4 text-purple-500" />
                                      AI Summary
                                    </div>
                                    <p className="text-sm text-muted-foreground bg-background p-3 rounded-md">
                                      {call.summary}
                                    </p>
                                  </div>
                                )}
                                {call.transcript && (
                                  <div>
                                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                      <FileText className="w-4 h-4 text-blue-500" />
                                      Full Transcript
                                    </div>
                                    <div className="text-sm text-muted-foreground bg-background p-3 rounded-md max-h-64 overflow-y-auto whitespace-pre-wrap">
                                      {call.transcript}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page <= 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
