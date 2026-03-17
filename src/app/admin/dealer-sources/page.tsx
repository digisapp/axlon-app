'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  Globe,
  Clock,
  Package,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface DealerSource {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  inventory_url: string | null;
  scrape_method: string;
  is_active: boolean;
  last_scraped_at: string | null;
  last_scrape_count: number;
  total_listings: number;
  location_city: string | null;
  location_state: string | null;
  notes: string | null;
  active_listings: number;
}

export default function DealerSourcesPage() {
  const [dealers, setDealers] = useState<DealerSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDealers = async () => {
    try {
      const resp = await fetch('/api/admin/scrape-dealers');
      const data = await resp.json();
      setDealers(data.dealers || []);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load dealer sources' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const triggerScrape = async (dealerSlug?: string) => {
    setTriggering(dealerSlug || 'all');
    setMessage(null);

    try {
      const resp = await fetch('/api/admin/scrape-dealers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealer: dealerSlug || '' }),
      });

      const data = await resp.json();

      if (resp.ok) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to trigger scrape' });
    } finally {
      setTriggering(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  const totalListings = dealers.reduce((sum, d) => sum + d.active_listings, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dealer Sources</h1>
          <p className="text-muted-foreground text-sm">
            Manage external dealers and trigger inventory scrapes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDealers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => triggerScrape()}
            disabled={triggering !== null}
          >
            {triggering === 'all' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Scrape All Dealers
          </Button>
        </div>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Sources</p>
            <p className="text-2xl font-bold">{dealers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Sources</p>
            <p className="text-2xl font-bold">{dealers.filter(d => d.is_active).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Scraped Listings</p>
            <p className="text-2xl font-bold">{totalListings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Schedule</p>
            <p className="text-2xl font-bold">15d</p>
            <p className="text-xs text-muted-foreground">Auto every 15 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Dealer list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : dealers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No dealer sources configured yet. Run the scraper once to seed them.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {dealers.map((dealer) => (
            <Card key={dealer.id} className="hover:bg-muted/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{dealer.name}</h3>
                      <Badge
                        variant={dealer.is_active ? 'default' : 'secondary'}
                        className="text-[10px]"
                      >
                        {dealer.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {dealer.scrape_method}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {dealer.website && (
                        <a
                          href={dealer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          <Globe className="w-3 h-3" />
                          {new URL(dealer.website).hostname}
                        </a>
                      )}
                      {(dealer.location_city || dealer.location_state) && (
                        <span>
                          {[dealer.location_city, dealer.location_state].filter(Boolean).join(', ')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last scraped: {formatDate(dealer.last_scraped_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {dealer.active_listings} listings
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerScrape(dealer.slug)}
                    disabled={triggering !== null}
                    className="flex-shrink-0"
                  >
                    {triggering === dealer.slug ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-1" />
                    )}
                    Scrape
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info */}
      <Card className="border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">How it works</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>The scraper runs automatically every 15 days via GitHub Actions</li>
            <li>Click &quot;Scrape All Dealers&quot; or individual &quot;Scrape&quot; buttons to run on demand</li>
            <li>AI normalizes titles, extracts make/model/year, and categorizes each listing</li>
            <li>Images are downloaded to AXLON storage — no broken external links</li>
            <li>Duplicate listings are automatically skipped</li>
            <li>Users see listings as AXLON inventory — source dealer is only visible here</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
