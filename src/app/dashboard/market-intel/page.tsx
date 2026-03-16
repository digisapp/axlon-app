import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, TrendingDown, BarChart3, Package,
  AlertTriangle, DollarSign, Clock, ArrowUpRight,
} from 'lucide-react';

export default async function MarketIntelPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?redirect=/dashboard/market-intel');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name')
    .eq('id', user.id)
    .single();

  // Get latest market reports
  const { data: reports } = await supabase
    .from('dealer_market_reports')
    .select('id, report_data, created_at')
    .eq('dealer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(4);

  const latestReport = reports?.[0]?.report_data as {
    inventory_stats: {
      totalListings: number;
      avgPrice: number;
      medianPrice: number;
      avgDaysOnMarket: number;
      overpriced: Array<{ id: string; title: string; price: number; marketAvg: number; percentAbove: number }>;
      underpriced: Array<{ id: string; title: string; price: number; marketAvg: number; percentBelow: number }>;
      categoryBreakdown: Array<{ category: string; count: number; avgPrice: number }>;
    };
    market_trends: {
      totalActiveListings: number;
      newListingsThisWeek: number;
      avgMarketPrice: number;
      priceChangePercent: number;
    };
    ai_insights: string;
    recommendations: string[];
  } | null;

  // Get dealer's active listing count for current state
  const { count: activeListings } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'active');

  // Get follow-up agent stats
  const { count: totalFollowups } = await supabase
    .from('lead_followup_queue')
    .select('*', { count: 'exact', head: true })
    .eq('dealer_id', user.id)
    .eq('status', 'sent');

  const { count: activeLeads } = await supabase
    .from('dealer_ai_leads')
    .select('*', { count: 'exact', head: true })
    .eq('dealer_id', user.id)
    .in('status', ['new', 'contacted']);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Market Intelligence</h1>
        <p className="text-muted-foreground">AI-powered market analysis for {profile?.company_name || 'your dealership'}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="w-4 h-4" />
              <span className="text-xs font-medium">Your Listings</span>
            </div>
            <p className="text-2xl font-bold">{activeListings || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Avg Price</span>
            </div>
            <p className="text-2xl font-bold">
              {latestReport ? `$${latestReport.inventory_stats.avgPrice.toLocaleString()}` : '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Avg Days Listed</span>
            </div>
            <p className="text-2xl font-bold">
              {latestReport ? latestReport.inventory_stats.avgDaysOnMarket : '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              {latestReport && latestReport.market_trends.priceChangePercent >= 0
                ? <TrendingUp className="w-4 h-4 text-green-600" />
                : <TrendingDown className="w-4 h-4 text-red-600" />
              }
              <span className="text-xs font-medium">Market Trend</span>
            </div>
            <p className={`text-2xl font-bold ${latestReport && latestReport.market_trends.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {latestReport ? `${latestReport.market_trends.priceChangePercent >= 0 ? '+' : ''}${latestReport.market_trends.priceChangePercent}%` : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-primary" />
              Lead Follow-Up Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{totalFollowups || 0}</p>
                <p className="text-xs text-muted-foreground">Follow-ups sent</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{activeLeads || 0}</p>
                <p className="text-xs text-muted-foreground">Active leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Market Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{latestReport?.market_trends.totalActiveListings.toLocaleString() || '—'}</p>
                <p className="text-xs text-muted-foreground">Total marketplace listings</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{latestReport?.market_trends.newListingsThisWeek || '—'}</p>
                <p className="text-xs text-muted-foreground">New this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {latestReport && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Market Analysis</CardTitle>
            <p className="text-xs text-muted-foreground">
              Generated {reports?.[0]?.created_at ? new Date(reports[0].created_at).toLocaleDateString() : 'recently'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {latestReport.ai_insights.split('\n').filter(Boolean).map((p: string, i: number) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3">{p}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Alerts */}
      {latestReport && latestReport.inventory_stats.overpriced.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Pricing Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestReport.inventory_stats.overpriced.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Market avg: ${item.marketAvg.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${item.price.toLocaleString()}</p>
                    <Badge variant="destructive" className="text-[10px]">+{item.percentAbove}% above market</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {latestReport && latestReport.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {latestReport.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* No reports yet */}
      {(!reports || reports.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Market Reports Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Market intelligence reports are generated weekly. Make sure your AI assistant is enabled
              in your dashboard settings to receive reports.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Report History */}
      {reports && reports.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Report History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">
                    Week of {new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {(report.report_data as { inventory_stats: { totalListings: number } }).inventory_stats.totalListings} listings analyzed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
