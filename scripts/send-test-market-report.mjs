/**
 * Send a test market report email to preview the template
 * Usage: node scripts/send-test-market-report.mjs nathanmayell@gmail.com
 */

import 'dotenv/config';

const TO_EMAIL = process.argv[2] || 'nathanmayell@gmail.com';

// Sample report data for preview
const sampleReport = {
  dealer_id: 'test',
  dealer_name: 'AXLON Demo Dealer',
  generated_at: new Date().toISOString(),
  inventory_stats: {
    totalListings: 24,
    avgPrice: 87500,
    medianPrice: 75000,
    avgDaysOnMarket: 32,
    priceDistribution: [
      { range: 'Under $25k', count: 3 },
      { range: '$25k-$50k', count: 5 },
      { range: '$50k-$100k', count: 9 },
      { range: '$100k-$150k', count: 5 },
      { range: '$150k-$250k', count: 2 },
    ],
    categoryBreakdown: [
      { category: 'lowboy', count: 10, avgPrice: 95000 },
      { category: 'flatbed', count: 8, avgPrice: 65000 },
      { category: 'step-deck', count: 6, avgPrice: 72000 },
    ],
    overpriced: [
      { id: '1', title: '2021 Trail King TK110HDG Lowboy', price: 145000, marketAvg: 118000, percentAbove: 23 },
      { id: '2', title: '2019 Fontaine Magnitude 55H', price: 98000, marketAvg: 82000, percentAbove: 20 },
    ],
    underpriced: [
      { id: '3', title: '2020 XL Specialized 110HDG', price: 72000, marketAvg: 89000, percentBelow: 19 },
    ],
  },
  market_trends: {
    totalActiveListings: 1247,
    newListingsThisWeek: 89,
    avgMarketPrice: 92400,
    priceChangePercent: 3,
    topSearchTerms: [],
    hotCategories: [
      { category: 'lowboy', searchVolume: 0, listingCount: 312, supplyDemandRatio: 1 },
      { category: 'flatbed', searchVolume: 0, listingCount: 287, supplyDemandRatio: 1 },
    ],
    recentSales: [],
  },
  ai_insights: `Your inventory is performing well with 24 active listings averaging 32 days on market — below the platform median of 41 days. However, two listings are priced 20%+ above market averages and may be stalling.

Market prices have ticked up 3% month-over-month, driven by tightening supply in the lowboy segment. New listings this week (89) are down from the 4-week average of 112, suggesting seasonal slowdown heading into Q2.

Your lowboy inventory ($95k avg) is positioned above the market average ($88k). Consider adjusting the Trail King TK110HDG and Fontaine Magnitude 55H — both are sitting 20%+ above comparable units. The XL Specialized 110HDG at $72k is priced to move fast and may be leaving money on the table.`,
  recommendations: [
    'Consider adjusting prices on 2 overpriced listing(s) to align with market',
    'Market prices are trending up (3%) — good time to list new inventory',
    'Your lowboy segment is strong — consider sourcing more units in this category',
  ],
};

function buildMarketReportEmail(report) {
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
        ${report.ai_insights.split('\n').filter(p => p.trim()).map(p => `<p style="margin: 0 0 12px;">${p}</p>`).join('')}
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

async function main() {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not found in environment');
    process.exit(1);
  }

  const { subject, html } = buildMarketReportEmail(sampleReport);

  console.log(`Sending test market report to ${TO_EMAIL}...`);
  console.log(`Subject: ${subject}`);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'AXLON AI <noreply@axlon.ai>',
      to: TO_EMAIL,
      subject,
      html,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    console.log('Email sent successfully!', data);
  } else {
    console.error('Failed to send email:', data);
  }
}

main().catch(console.error);
