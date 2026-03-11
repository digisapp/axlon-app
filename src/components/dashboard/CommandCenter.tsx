'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Brain,
  ArrowRight,
  TrendingDown,
  Users,
  BarChart3,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';

interface InsightCard {
  type: 'inventory' | 'lead' | 'market';
  title: string;
  description: string;
  action: string;
  href: string;
}

interface CommandCenterProps {
  insights: InsightCard[];
  companyName?: string;
}

const suggestedPrompts = [
  'Which listings are getting the most views?',
  'Which leads should I follow up with today?',
  'What should I price my trailer at?',
];

export function CommandCenter({ insights, companyName }: CommandCenterProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (prompt: string) => {
    const q = prompt || query;
    if (!q.trim()) return;
    router.push(`/dashboard/ai-assistant?q=${encodeURIComponent(q)}`);
  };

  const insightIcons = {
    inventory: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    lead: <Users className="w-4 h-4 text-primary" />,
    market: <BarChart3 className="w-4 h-4 text-emerald-500" />,
  };

  const insightColors = {
    inventory: 'border-amber-500/20 bg-amber-500/5',
    lead: 'border-primary/20 bg-primary/5',
    market: 'border-emerald-500/20 bg-emerald-500/5',
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Left: Ask Axlon AI */}
          <div className="md:col-span-2 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Ask Axlon AI</h3>
                <p className="text-[11px] text-muted-foreground">Your business assistant</p>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="relative mb-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(query)}
                placeholder="Ask anything about your business..."
                className="w-full pl-3 pr-10 py-2.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              />
              <button
                onClick={() => handleSubmit(query)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested Prompts */}
            <div className="space-y-1.5">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSubmit(prompt)}
                  className="w-full text-left text-xs text-muted-foreground hover:text-foreground py-1.5 px-2 rounded-md hover:bg-muted transition-colors flex items-start gap-2"
                >
                  <Sparkles className="w-3 h-3 mt-0.5 shrink-0 text-primary/50" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Right: AI Insights */}
          <div className="md:col-span-3 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">AI Insights</h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Auto-generated</span>
            </div>

            {insights.length > 0 ? (
              <div className="space-y-2.5">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${insightColors[insight.type]}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {insightIcons[insight.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 h-7 text-xs" asChild>
                      <a href={insight.href}>
                        {insight.action}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  AI insights will appear here as your listings get activity.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
