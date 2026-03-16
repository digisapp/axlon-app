import { createClient } from '@supabase/supabase-js';
import { createXai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import { logger } from '@/lib/logger';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getXai() {
  if (!process.env.XAI_API_KEY) throw new Error('XAI_API_KEY is not configured');
  return createXai({ apiKey: process.env.XAI_API_KEY });
}

interface DealerInventoryStats {
  totalListings: number;
  avgPrice: number;
  medianPrice: number;
  avgDaysOnMarket: number;
  priceDistribution: Array<{ range: string; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number; avgPrice: number }>;
  overpriced: Array<{ id: string; title: string; price: number; marketAvg: number; percentAbove: number }>;
  underpriced: Array<{ id: string; title: string; price: number; marketAvg: number; percentBelow: number }>;
}

interface MarketTrends {
  totalActiveListings: number;
  newListingsThisWeek: number;
  avgMarketPrice: number;
  priceChangePercent: number; // vs last month
  topSearchTerms: Array<{ term: string; count: number }>;
  hotCategories: Array<{ category: string; searchVolume: number; listingCount: number; supplyDemandRatio: number }>;
  recentSales: Array<{ category: string; avgPrice: number; count: number }>;
}

interface MarketReport {
  dealer_id: string;
  dealer_name: string;
  generated_at: string;
  inventory_stats: DealerInventoryStats;
  market_trends: MarketTrends;
  ai_insights: string;
  recommendations: string[];
}

/**
 * Analyze a dealer's inventory vs market conditions
 */
export async function analyzeDealerInventory(dealerId: string): Promise<DealerInventoryStats> {
  const supabase = getSupabase();

  // Get dealer's active listings
  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, price, year, make, model, condition, category_id, created_at, status')
    .eq('user_id', dealerId)
    .eq('status', 'active')
    .not('price', 'is', null);

  if (!listings || listings.length === 0) {
    return {
      totalListings: 0,
      avgPrice: 0,
      medianPrice: 0,
      avgDaysOnMarket: 0,
      priceDistribution: [],
      categoryBreakdown: [],
      overpriced: [],
      underpriced: [],
    };
  }

  const prices = listings.map(l => l.price as number).sort((a, b) => a - b);
  const now = new Date();

  // Calculate days on market
  const daysOnMarket = listings.map(l => {
    const created = new Date(l.created_at);
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  });

  // Price distribution buckets
  const buckets = [
    { range: 'Under $25k', min: 0, max: 25000 },
    { range: '$25k-$50k', min: 25000, max: 50000 },
    { range: '$50k-$100k', min: 50000, max: 100000 },
    { range: '$100k-$150k', min: 100000, max: 150000 },
    { range: '$150k-$250k', min: 150000, max: 250000 },
    { range: '$250k+', min: 250000, max: Infinity },
  ];

  const priceDistribution = buckets.map(b => ({
    range: b.range,
    count: prices.filter(p => p >= b.min && p < b.max).length,
  })).filter(b => b.count > 0);

  // Category breakdown
  const categoryMap = new Map<string, { count: number; totalPrice: number }>();
  for (const l of listings) {
    const cat = l.category_id || 'uncategorized';
    const existing = categoryMap.get(cat) || { count: 0, totalPrice: 0 };
    existing.count++;
    existing.totalPrice += l.price as number;
    categoryMap.set(cat, existing);
  }

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    avgPrice: Math.round(data.totalPrice / data.count),
  }));

  // Find overpriced and underpriced listings by comparing to market averages
  const marketAvgs = await getMarketAverages(listings);
  const overpriced: DealerInventoryStats['overpriced'] = [];
  const underpriced: DealerInventoryStats['underpriced'] = [];

  for (const listing of listings) {
    const key = `${listing.make || ''}|${listing.model || ''}`.toLowerCase();
    const marketAvg = marketAvgs.get(key);
    if (!marketAvg || !listing.price) continue;

    const priceDiff = ((listing.price - marketAvg) / marketAvg) * 100;

    if (priceDiff > 15) {
      overpriced.push({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        marketAvg,
        percentAbove: Math.round(priceDiff),
      });
    } else if (priceDiff < -15) {
      underpriced.push({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        marketAvg,
        percentBelow: Math.round(Math.abs(priceDiff)),
      });
    }
  }

  return {
    totalListings: listings.length,
    avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    medianPrice: prices[Math.floor(prices.length / 2)],
    avgDaysOnMarket: Math.round(daysOnMarket.reduce((a, b) => a + b, 0) / daysOnMarket.length),
    priceDistribution,
    categoryBreakdown,
    overpriced: overpriced.sort((a, b) => b.percentAbove - a.percentAbove).slice(0, 5),
    underpriced: underpriced.sort((a, b) => b.percentBelow - a.percentBelow).slice(0, 5),
  };
}

async function getMarketAverages(
  dealerListings: Array<{ make: string | null; model: string | null }>
): Promise<Map<string, number>> {
  const supabase = getSupabase();
  const result = new Map<string, number>();

  // Get unique make/model combinations
  const makeModels = new Set<string>();
  for (const l of dealerListings) {
    if (l.make) makeModels.add(l.make);
  }

  if (makeModels.size === 0) return result;

  // Query market prices for these makes
  for (const make of makeModels) {
    const { data } = await supabase
      .from('listings')
      .select('make, model, price')
      .eq('status', 'active')
      .ilike('make', `%${make}%`)
      .not('price', 'is', null)
      .limit(100);

    if (data) {
      const modelGroups = new Map<string, number[]>();
      for (const item of data) {
        const key = `${item.make || ''}|${item.model || ''}`.toLowerCase();
        const existing = modelGroups.get(key) || [];
        existing.push(item.price as number);
        modelGroups.set(key, existing);
      }

      for (const [key, prices] of modelGroups.entries()) {
        if (prices.length >= 2) {
          result.set(key, Math.round(prices.reduce((a, b) => a + b, 0) / prices.length));
        }
      }
    }
  }

  return result;
}

/**
 * Get overall market trends
 */
export async function getMarketTrends(): Promise<MarketTrends> {
  const supabase = getSupabase();
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Total active listings
  const { count: totalActive } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // New this week
  const { count: newThisWeek } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .gte('created_at', oneWeekAgo.toISOString());

  // Average price now
  const { data: currentPrices } = await supabase
    .from('listings')
    .select('price')
    .eq('status', 'active')
    .not('price', 'is', null)
    .limit(1000);

  const avgNow = currentPrices && currentPrices.length > 0
    ? Math.round(currentPrices.reduce((s, l) => s + (l.price as number), 0) / currentPrices.length)
    : 0;

  // Average price last month (listings that existed a month ago)
  const { data: oldPrices } = await supabase
    .from('listings')
    .select('price')
    .eq('status', 'active')
    .lte('created_at', oneMonthAgo.toISOString())
    .not('price', 'is', null)
    .limit(1000);

  const avgLastMonth = oldPrices && oldPrices.length > 0
    ? Math.round(oldPrices.reduce((s, l) => s + (l.price as number), 0) / oldPrices.length)
    : avgNow;

  const priceChange = avgLastMonth > 0
    ? Math.round(((avgNow - avgLastMonth) / avgLastMonth) * 100)
    : 0;

  // Category stats
  const { data: categoryData } = await supabase
    .from('listings')
    .select('category_id, price')
    .eq('status', 'active')
    .not('price', 'is', null)
    .limit(2000);

  const catMap = new Map<string, { count: number; total: number }>();
  for (const l of categoryData || []) {
    const cat = l.category_id || 'other';
    const existing = catMap.get(cat) || { count: 0, total: 0 };
    existing.count++;
    existing.total += l.price as number;
    catMap.set(cat, existing);
  }

  return {
    totalActiveListings: totalActive || 0,
    newListingsThisWeek: newThisWeek || 0,
    avgMarketPrice: avgNow,
    priceChangePercent: priceChange,
    topSearchTerms: [], // Would need search logs table
    hotCategories: Array.from(catMap.entries())
      .map(([category, data]) => ({
        category,
        searchVolume: 0, // Would need search logs
        listingCount: data.count,
        supplyDemandRatio: 1, // Placeholder
      }))
      .sort((a, b) => b.listingCount - a.listingCount)
      .slice(0, 5),
    recentSales: [],
  };
}

/**
 * Generate a complete market intelligence report for a dealer
 */
export async function generateMarketReport(dealerId: string): Promise<MarketReport | null> {
  const supabase = getSupabase();

  // Get dealer info
  const { data: dealer } = await supabase
    .from('profiles')
    .select('company_name, city, state')
    .eq('id', dealerId)
    .single();

  if (!dealer) return null;

  // Gather data in parallel
  const [inventoryStats, marketTrends] = await Promise.all([
    analyzeDealerInventory(dealerId),
    getMarketTrends(),
  ]);

  // Generate AI insights
  const xai = getXai();

  const { text: aiInsights } = await generateText({
    model: xai('grok-4-1-fast-non-reasoning'),
    system: 'You are a market analyst for the heavy equipment and trailer industry. Write concise, actionable market insights for dealers. Use specific numbers. No fluff.',
    messages: [{
      role: 'user',
      content: `Generate a weekly market intelligence briefing for ${dealer.company_name || 'this dealer'} in ${[dealer.city, dealer.state].filter(Boolean).join(', ')}.

DEALER INVENTORY:
- ${inventoryStats.totalListings} active listings
- Average price: $${inventoryStats.avgPrice.toLocaleString()}
- Average days on market: ${inventoryStats.avgDaysOnMarket}
- Overpriced listings (>15% above market): ${inventoryStats.overpriced.length}
  ${inventoryStats.overpriced.map(l => `  ${l.title}: $${l.price.toLocaleString()} (${l.percentAbove}% above $${l.marketAvg.toLocaleString()} avg)`).join('\n')}
- Underpriced listings (>15% below market): ${inventoryStats.underpriced.length}

MARKET OVERVIEW:
- ${marketTrends.totalActiveListings} total active listings on AXLON
- ${marketTrends.newListingsThisWeek} new listings this week
- Average market price: $${marketTrends.avgMarketPrice.toLocaleString()}
- Price trend: ${marketTrends.priceChangePercent > 0 ? '+' : ''}${marketTrends.priceChangePercent}% vs last month

Write 3-4 paragraphs covering:
1. Their inventory health (pricing, aging, gaps)
2. Market conditions and trends
3. Specific, actionable recommendations

Keep it under 300 words. Be direct — these are dealers, not consumers.`,
    }],
  });

  // Extract recommendations
  const recommendations: string[] = [];
  if (inventoryStats.overpriced.length > 0) {
    recommendations.push(`Consider adjusting prices on ${inventoryStats.overpriced.length} overpriced listing(s) to align with market`);
  }
  if (inventoryStats.avgDaysOnMarket > 45) {
    recommendations.push(`Average days on market (${inventoryStats.avgDaysOnMarket}) is high — consider price reductions on older inventory`);
  }
  if (marketTrends.priceChangePercent > 5) {
    recommendations.push(`Market prices are trending up (${marketTrends.priceChangePercent}%) — good time to list new inventory`);
  }
  if (marketTrends.priceChangePercent < -5) {
    recommendations.push(`Market prices are declining (${marketTrends.priceChangePercent}%) — consider competitive pricing`);
  }
  if (inventoryStats.totalListings < 5) {
    recommendations.push('Low inventory count — adding more listings increases visibility and buyer engagement');
  }

  const report: MarketReport = {
    dealer_id: dealerId,
    dealer_name: dealer.company_name || 'Dealer',
    generated_at: new Date().toISOString(),
    inventory_stats: inventoryStats,
    market_trends: marketTrends,
    ai_insights: aiInsights,
    recommendations,
  };

  return report;
}

/**
 * Build HTML email for the weekly market report
 */
export function buildMarketReportEmail(report: MarketReport): { subject: string; html: string } {
  const stats = report.inventory_stats;
  const trends = report.market_trends;

  const subject = `AXLON Market Report — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} | ${report.dealer_name}`;

  const overpricedRows = stats.overpriced.map(l =>
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${l.title}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">$${l.price.toLocaleString()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">$${l.marketAvg.toLocaleString()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #dc2626;">+${l.percentAbove}%</td>
    </tr>`
  ).join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; color: #1f2937; background: #f9fafb;">

  <div style="background: #111; color: #fff; padding: 20px; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; font-size: 20px;">AXLON Market Report</h1>
    <p style="margin: 4px 0 0; opacity: 0.7; font-size: 14px;">${report.dealer_name} · Week of ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
  </div>

  <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">

    <!-- Quick Stats -->
    <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 120px; background: #f3f4f6; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: 700;">${stats.totalListings}</div>
        <div style="font-size: 12px; color: #6b7280;">Your Listings</div>
      </div>
      <div style="flex: 1; min-width: 120px; background: #f3f4f6; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: 700;">${stats.avgDaysOnMarket}d</div>
        <div style="font-size: 12px; color: #6b7280;">Avg Days Listed</div>
      </div>
      <div style="flex: 1; min-width: 120px; background: #f3f4f6; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: ${trends.priceChangePercent >= 0 ? '#059669' : '#dc2626'};">${trends.priceChangePercent >= 0 ? '+' : ''}${trends.priceChangePercent}%</div>
        <div style="font-size: 12px; color: #6b7280;">Market Price Trend</div>
      </div>
    </div>

    <!-- AI Insights -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 16px; margin: 0 0 12px;">Market Analysis</h2>
      <div style="font-size: 14px; line-height: 1.6; color: #374151;">
        ${report.ai_insights.split('\n').map(p => `<p style="margin: 0 0 12px;">${p}</p>`).join('')}
      </div>
    </div>

    <!-- Pricing Alerts -->
    ${stats.overpriced.length > 0 ? `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 16px; margin: 0 0 12px;">Pricing Alerts</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="background: #f9fafb;">
          <th style="padding: 8px; text-align: left;">Listing</th>
          <th style="padding: 8px; text-align: left;">Your Price</th>
          <th style="padding: 8px; text-align: left;">Market Avg</th>
          <th style="padding: 8px; text-align: left;">Diff</th>
        </tr>
        ${overpricedRows}
      </table>
    </div>
    ` : ''}

    <!-- Recommendations -->
    ${report.recommendations.length > 0 ? `
    <div style="background: #ecfdf5; border: 1px solid #059669; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <h3 style="font-size: 14px; margin: 0 0 8px; color: #059669;">Recommended Actions</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
        ${report.recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Market Stats -->
    <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #6b7280;">
      <p>Market: ${trends.totalActiveListings.toLocaleString()} active listings · ${trends.newListingsThisWeek} new this week · Avg price $${trends.avgMarketPrice.toLocaleString()}</p>
    </div>
  </div>

  <div style="text-align: center; padding: 16px; font-size: 12px; color: #9ca3af;">
    <p>AXLON Market Intelligence · <a href="https://axlon.ai" style="color: #6b7280;">axlon.ai</a></p>
    <p>Reply STOP to unsubscribe from weekly reports.</p>
  </div>

</body>
</html>`;

  return { subject, html };
}
