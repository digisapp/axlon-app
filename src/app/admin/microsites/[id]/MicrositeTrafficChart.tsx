'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DailyRow {
  day: string;
  visits: number;
  visitors: number;
  leads: number;
}

/**
 * Two synced panels rather than one chart with two y-axes.
 *
 * Visits run in the hundreds or thousands while leads run in single digits, so
 * plotting them on a shared scale flattens the leads line onto the baseline and
 * a second y-axis would let the two be visually compared when they can't be.
 * Stacked panels share the x domain (recharts `syncId` ties the crosshair
 * together) and each keeps an honest axis.
 */
export function MicrositeTrafficChart({ data }: { data: DailyRow[] }) {
  const rows = data.map((d) => ({
    day: d.day,
    visits: Number(d.visits || 0),
    visitors: Number(d.visitors || 0),
    leads: Number(d.leads || 0),
  }));

  const totalLeads = rows.reduce((sum, r) => sum + r.leads, 0);

  if (!rows.length) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No traffic recorded yet.
      </p>
    );
  }

  const formatDay = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  const axis = {
    tick: { fontSize: 12, fill: 'var(--ms-text-secondary)' },
    tickLine: false,
    axisLine: false,
  } as const;

  const tooltipStyle = {
    contentStyle: {
      borderRadius: 8,
      border: '1px solid var(--ms-border)',
      background: 'var(--ms-surface)',
      color: 'var(--ms-text-primary)',
      fontSize: 12,
    },
    labelFormatter: formatDay,
  };

  return (
    <div className="ms-viz space-y-2">
      <style>{`
        .ms-viz {
          --ms-surface: #fcfcfb;
          --ms-border: #e5e7eb;
          --ms-grid: #e5e7eb;
          --ms-text-primary: #0b0b0b;
          --ms-text-secondary: #52514e;
          --ms-series-visits: #2a78d6;
          --ms-series-visitors: #eb6834;
          --ms-series-leads: #1baf7a;
        }
        .dark .ms-viz {
          --ms-surface: #1a1a19;
          --ms-border: #3f3f46;
          --ms-grid: #3f3f46;
          --ms-text-primary: #ffffff;
          --ms-text-secondary: #c3c2b7;
          --ms-series-visits: #3987e5;
          --ms-series-visitors: #d95926;
          --ms-series-leads: #199e70;
        }
      `}</style>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} syncId="microsite" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="msVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ms-series-visits)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--ms-series-visits)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="msVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ms-series-visitors)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--ms-series-visitors)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ms-grid)" />
            <XAxis dataKey="day" tickFormatter={formatDay} minTickGap={24} {...axis} />
            <YAxis allowDecimals={false} width={44} {...axis} />
            <Tooltip {...tooltipStyle} />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 12, color: 'var(--ms-text-secondary)' }}
            />
            <Area
              type="monotone"
              dataKey="visits"
              name="Visits"
              stroke="var(--ms-series-visits)"
              strokeWidth={2}
              fill="url(#msVisits)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--ms-surface)' }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              name="Unique visitors"
              stroke="var(--ms-series-visitors)"
              strokeWidth={2}
              fill="url(#msVisitors)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--ms-surface)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Leads keep their own panel and their own scale. The count is labelled
          in text because the aqua mark sits under 3:1 against a light surface. */}
      <div>
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Leads · {totalLeads.toLocaleString()} total
        </p>
        <div className="h-[110px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} syncId="microsite" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ms-grid)" />
              <XAxis dataKey="day" tickFormatter={formatDay} minTickGap={24} {...axis} />
              <YAxis allowDecimals={false} width={44} {...axis} />
              <Tooltip {...tooltipStyle} cursor={{ fill: 'var(--ms-grid)', fillOpacity: 0.3 }} />
              <Bar
                dataKey="leads"
                name="Leads"
                fill="var(--ms-series-leads)"
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
