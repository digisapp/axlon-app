'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TrendingUp,
  Users,
  FileText,
  Mail,
  Calendar,
  Loader2,
  Eye,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { logger } from '@/lib/logger';

interface MarketReport {
  id: string;
  dealer_id: string;
  report_data: {
    dealer_name: string;
    generated_at: string;
    inventory_stats: {
      totalListings: number;
      avgPrice: number;
      avgDaysOnMarket: number;
      overpriced: Array<{ title: string; percentAbove: number }>;
    };
    market_trends: {
      totalActiveListings: number;
      priceChangePercent: number;
    };
    recommendations: string[];
  };
  report_html: string;
  created_at: string;
}

interface Subscriber {
  dealer_id: string;
  is_enabled: boolean;
  market_reports_enabled: boolean;
  market_report_frequency: string | null;
  profile: {
    email: string;
    company_name: string | null;
    city: string | null;
    state: string | null;
  } | null;
}

export default function AdminMarketReportsPage() {
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'subscribers'>('reports');
  const [previewReport, setPreviewReport] = useState<MarketReport | null>(null);

  async function fetchData() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/market-reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
        setSubscribers(data.subscribers || []);
      }
    } catch (error) {
      logger.error('Error fetching market reports data', { error });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchData flips isLoading synchronously before awaiting; standard fetch-on-change pattern
    fetchData();
  }, []);

  const totalReports = reports.length;
  const totalSubscribers = subscribers.filter(s => s.market_reports_enabled).length;
  const uniqueDealers = new Set(reports.map(r => r.dealer_id)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Market Reports</h1>
        <p className="text-sm text-muted-foreground">
          View all generated reports and manage subscribed dealers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalReports}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalSubscribers}</p>
              <p className="text-sm text-muted-foreground">Subscribed Dealers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{uniqueDealers}</p>
              <p className="text-sm text-muted-foreground">Businesses with Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'reports' ? 'default' : 'outline'}
          onClick={() => setActiveTab('reports')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Reports ({totalReports})
        </Button>
        <Button
          variant={activeTab === 'subscribers' ? 'default' : 'outline'}
          onClick={() => setActiveTab('subscribers')}
        >
          <Users className="w-4 h-4 mr-2" />
          Subscribers ({totalSubscribers})
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : activeTab === 'reports' ? (
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reports generated yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Reports are generated weekly on Sunday at 8am UTC
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {report.report_data?.dealer_name || 'Unknown Dealer'}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(report.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span>
                            {report.report_data?.inventory_stats?.totalListings || 0} listings
                          </span>
                          {report.report_data?.inventory_stats?.overpriced?.length > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {report.report_data.inventory_stats.overpriced.length} overpriced
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewReport(report)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Subscribed Dealers</CardTitle>
          </CardHeader>
          <CardContent>
            {subscribers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No dealers have AI settings configured</p>
              </div>
            ) : (
              <div className="space-y-3">
                {subscribers.map((sub) => (
                  <div
                    key={sub.dealer_id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${sub.market_reports_enabled ? 'bg-green-50' : 'bg-gray-100'}`}>
                        {sub.market_reports_enabled ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Mail className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {sub.profile?.company_name || 'Unknown Dealer'}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{sub.profile?.email || 'No email'}</span>
                          {(sub.profile?.city || sub.profile?.state) && (
                            <span>
                              {[sub.profile?.city, sub.profile?.state].filter(Boolean).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sub.market_reports_enabled ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Subscribed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Subscribed</Badge>
                      )}
                      {sub.is_enabled && (
                        <Badge variant="outline">AI Enabled</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Report Preview Dialog */}
      <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Report Preview — {previewReport?.report_data?.dealer_name}
            </DialogTitle>
          </DialogHeader>
          {previewReport?.report_html && (
            <iframe
              className="mt-4 w-full border-0 rounded"
              style={{ height: '60vh' }}
              srcDoc={previewReport.report_html}
              sandbox="allow-same-origin"
              title="Report Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
