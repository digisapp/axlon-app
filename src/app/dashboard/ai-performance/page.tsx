'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Bot,
  Clock,
  Mail,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  BarChart3,
  Package,
  Eye,
  CheckCircle,
  Star,
  ArrowUpRight,
  Loader2,
  Calendar,
} from 'lucide-react';
import { logger } from '@/lib/logger';

type Period = 7 | 30 | 90;

interface PerformanceData {
  period: { days: number; since: string };
  summary: {
    totalLeadsAllTime: number;
    leadsThisPeriod: number;
    leadTrend: number;
    highPriorityLeads: number;
    avgLeadScore: number;
    autoRepliesSent: number;
    followUpEmailsSent: number;
    chatConversations: number;
    chatLeadsCaptured: number;
    totalAIActions: number;
    hoursSaved: number;
    conversionRate: number;
    activeListings: number;
    totalMarketplaceViews: number;
  };
  pipeline: {
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
  };
  followUpsByStep: Array<{ step: number; sent: number }>;
  topListings: Array<{ id: string; title: string; views_count: number; status: string }>;
}

const STEP_LABELS: Record<number, string> = {
  1: 'Immediate (< 1 hour)',
  2: 'Day 1 follow-up',
  3: 'Day 3 follow-up',
  4: 'Day 7 follow-up',
};

export default function AIPerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>(30);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/ai-performance?days=${period}`);
      if (res.ok) setData(await res.json());
    } catch (err) {
      logger.error('Failed to load AI performance', { err });
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const s = data?.summary;

  // Estimated monthly value — $22/hr average admin wage
  const dollarsSaved = s ? s.hoursSaved * 22 : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                AI Performance Report
              </h1>
              <p className="text-xs text-muted-foreground">
                What your AI systems delivered
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {([7, 30, 90] as Period[]).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={period === d ? 'default' : 'outline'}
                className="rounded-full text-xs"
                onClick={() => setPeriod(d)}
              >
                {d}d
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !data ? (
          <div className="text-center py-24 text-muted-foreground">
            Failed to load performance data.
          </div>
        ) : (
          <>
            {/* Period label */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Last {period} days —{' '}
              {new Date(data.period.since).toLocaleDateString([], {
                month: 'short', day: 'numeric',
              })}{' '}
              to today
            </div>

            {/* Hero stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HeroStat
                icon={Clock}
                iconColor="text-primary"
                iconBg="bg-primary/10"
                label="Hours Saved by AI"
                value={`${s!.hoursSaved}h`}
                subValue={`≈ $${dollarsSaved.toLocaleString()} in admin time`}
              />
              <HeroStat
                icon={Zap}
                iconColor="text-amber-500"
                iconBg="bg-amber-500/10"
                label="Total AI Actions"
                value={s!.totalAIActions.toLocaleString()}
                subValue="Replies, emails & chats"
              />
              <HeroStat
                icon={Users}
                iconColor="text-emerald-500"
                iconBg="bg-emerald-500/10"
                label="Leads Received"
                value={s!.leadsThisPeriod.toString()}
                subValue={
                  s!.leadTrend !== 0
                    ? `${s!.leadTrend > 0 ? '+' : ''}${s!.leadTrend}% vs prior period`
                    : 'vs prior period'
                }
                trend={s!.leadTrend}
              />
              <HeroStat
                icon={TrendingUp}
                iconColor="text-cyan-500"
                iconBg="bg-cyan-500/10"
                label="Conversion Rate"
                value={`${s!.conversionRate}%`}
                subValue={`${data.pipeline.converted} deals closed`}
              />
            </div>

            {/* AI Actions breakdown */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Auto-Replies Sent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{s!.autoRepliesSent}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Every inbound inquiry got an instant, personalized reply
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Avg response time: &lt; 30 seconds
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-500" />
                    Follow-Up Sequence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{s!.followUpEmailsSent}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Emails sent across 4-step nurture sequence
                  </p>
                  <div className="mt-3 space-y-1">
                    {data.followUpsByStep.map(({ step, sent }) => (
                      <div key={step} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{STEP_LABELS[step]}</span>
                        <span className="font-semibold">{sent}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-500" />
                    AI Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{s!.chatConversations}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Buyer conversations handled 24/7
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    {s!.chatLeadsCaptured} leads captured from chat
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lead pipeline + quality */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Lead Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'New', count: data.pipeline.new, color: 'bg-blue-500' },
                    { label: 'Contacted', count: data.pipeline.contacted, color: 'bg-yellow-500' },
                    { label: 'Qualified', count: data.pipeline.qualified, color: 'bg-purple-500' },
                    { label: 'Converted', count: data.pipeline.converted, color: 'bg-emerald-500' },
                    { label: 'Lost', count: data.pipeline.lost, color: 'bg-slate-400' },
                  ].map(({ label, count, color }) => {
                    const total = s!.totalLeadsAllTime || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color} rounded-full transition-all`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-xs text-muted-foreground pt-1">
                    All-time total: {s!.totalLeadsAllTime} leads
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    Lead Quality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg AI lead score</span>
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                        s!.avgLeadScore >= 70
                          ? 'bg-emerald-100 text-emerald-700'
                          : s!.avgLeadScore >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s!.avgLeadScore}/100
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">High-priority leads</span>
                    <span className="font-semibold text-sm">{s!.highPriorityLeads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conversion rate</span>
                    <span className="font-semibold text-sm">{s!.conversionRate}%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      AI scores every lead 0–100 based on email domain, phone, message intent,
                      and sentiment analysis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Marketplace */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Marketplace Presence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <div>
                    <p className="text-2xl font-bold">{s!.activeListings}</p>
                    <p className="text-xs text-muted-foreground">Active listings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s!.totalMarketplaceViews.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total listing views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {s!.activeListings > 0
                        ? Math.round(s!.totalMarketplaceViews / s!.activeListings)
                        : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Avg views per listing</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {s!.totalMarketplaceViews > 0 && s!.leadsThisPeriod > 0
                        ? Math.round(s!.totalMarketplaceViews / s!.leadsThisPeriod)
                        : '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">Views per lead</p>
                  </div>
                </div>

                {data.topListings.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Top Performing Listings
                    </p>
                    <div className="space-y-2">
                      {data.topListings.map((listing) => (
                        <div key={listing.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <Link
                            href={`/listing/${listing.id}`}
                            className="text-sm hover:text-primary flex items-center gap-1.5 group"
                            target="_blank"
                          >
                            {listing.title}
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <div className="flex items-center gap-2 shrink-0">
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm font-semibold">{(listing.views_count || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time saved summary */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-slate-700 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-primary/10 rounded-full blur-[100px]" />
              <div className="relative grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-white">AI ROI Summary</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    In the last {period} days, your AI systems handled{' '}
                    <strong className="text-white">{s!.totalAIActions.toLocaleString()} actions</strong>,
                    saving an estimated{' '}
                    <strong className="text-white">{s!.hoursSaved} hours</strong> of manual work —
                    equivalent to{' '}
                    <strong className="text-white">${dollarsSaved.toLocaleString()}</strong> in admin time at $22/hr.
                    Your team focused on closing deals, not responding to emails.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-slate-400 mb-0.5">Hours saved</p>
                    <p className="text-2xl font-bold text-white">{s!.hoursSaved}h</p>
                  </div>
                  <div className="bg-primary/20 rounded-xl p-4 border border-primary/30">
                    <p className="text-xs text-slate-300 mb-0.5">Value delivered</p>
                    <p className="text-2xl font-bold text-primary">${dollarsSaved.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full gap-2" asChild>
                <Link href="/dashboard/leads">
                  <Users className="w-4 h-4" />
                  View All Leads
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full gap-2" asChild>
                <Link href="/dashboard/analytics">
                  <BarChart3 className="w-4 h-4" />
                  Marketplace Analytics
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full gap-2" asChild>
                <Link href="/dashboard/listings">
                  <Package className="w-4 h-4" />
                  Manage Listings
                </Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function HeroStat({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  subValue,
  trend,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  subValue: string;
  trend?: number;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <p className="text-2xl md:text-3xl font-bold mb-0.5">{value}</p>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <div className="flex items-center gap-1 text-xs">
          {trend !== undefined && trend !== 0 && (
            trend > 0
              ? <TrendingUp className="w-3 h-3 text-emerald-500" />
              : <TrendingDown className="w-3 h-3 text-red-500" />
          )}
          <span className={
            trend !== undefined && trend > 0
              ? 'text-emerald-600'
              : trend !== undefined && trend < 0
              ? 'text-red-500'
              : 'text-muted-foreground'
          }>
            {subValue}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
