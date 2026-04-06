import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ClipboardList,
  Mail,
  Phone,
  Building2,
  ArrowRight,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const metadata = { title: 'Applications | Admin' };

export default async function ApplicationsPage() {
  const supabase = await createClient();

  // Applications come in as contact_submissions with plan='transformation'
  const { data: applications } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('plan', 'transformation')
    .order('created_at', { ascending: false });

  const total = applications?.length || 0;
  const thisWeek = applications?.filter(a => {
    const d = new Date(a.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length || 0;

  const newApps = applications?.filter(a => a.status === 'new').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            AI Transformation Applications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Businesses that applied for a free AI Opportunity Assessment
          </p>
        </div>
        <Button asChild>
          <Link href="/transform" target="_blank">
            View Apply Page <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Applications', value: total },
          { label: 'This Week', value: thisWeek },
          { label: 'Awaiting Review', value: newApps },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {!applications || applications.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No applications yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Applications submitted at <Link href="/apply" className="text-primary hover:underline">/apply</Link> will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {applications.map((app) => {
                // Parse the structured message field
                const lines = (app.message || '').split('\n').filter(Boolean);
                const parseField = (label: string) => {
                  const line = lines.find(l => l.startsWith(label));
                  return line ? line.replace(label, '').trim() : null;
                };

                const businessType = parseField('Business Type:');
                const revenue = parseField('Annual Revenue:');
                const employees = parseField('Employees:');
                const pain = parseField('Biggest Pain:');
                const decisionMaker = parseField('Decision Maker:');
                const commitment = parseField('Open to 12-Month Commitment:');

                return (
                  <div key={app.id} className="py-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{app.name}</p>
                          {app.company && (
                            <span className="text-sm text-muted-foreground">— {app.company}</span>
                          )}
                          <Badge variant={app.status === 'new' ? 'default' : 'secondary'} className="text-xs">
                            {app.status || 'new'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 flex-wrap">
                          <a href={`mailto:${app.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {app.email}
                          </a>
                          {app.phone && (
                            <a href={`tel:${app.phone}`} className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
                              <Phone className="w-3 h-3" />
                              {app.phone}
                            </a>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(app.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${app.email}?subject=Your AI Opportunity Assessment — ${app.company || app.name}&body=Hi ${app.name.split(' ')[0]},%0A%0AThanks for applying for an AI Opportunity Assessment. I'd love to find a time to connect.%0A%0ABest,%0ANathan`}>
                          Reply <ArrowRight className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>

                    {/* Qualification details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { label: 'Business Type', value: businessType },
                        { label: 'Revenue', value: revenue },
                        { label: 'Employees', value: employees },
                        { label: 'Biggest Pain', value: pain },
                      ].map(({ label, value }) => value ? (
                        <div key={label} className="bg-muted/50 rounded-lg p-2.5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                          <p className="text-xs font-medium leading-snug">{value}</p>
                        </div>
                      ) : null)}
                    </div>

                    {/* Qualification flags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {decisionMaker?.toLowerCase().startsWith('yes') && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Decision maker</span>
                      )}
                      {commitment?.toLowerCase().startsWith('yes') && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Open to 12-month</span>
                      )}
                      {commitment?.toLowerCase().includes('need') && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">~ Needs more info</span>
                      )}
                      {decisionMaker?.toLowerCase().startsWith('no') && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">⚠ Not sole decision maker</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
