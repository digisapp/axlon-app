import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { adminNavSections, getAdminNavWithBadges } from '@/lib/admin-nav';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/dashboard');
  }

  // Fetch badge counts in parallel
  const [
    { count: pendingDealers },
    { count: newLeads },
    { count: pendingTradeIns },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_status', 'pending'),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('trade_in_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ]);

  const badges: Record<string, number> = {};
  if (pendingDealers) badges['/admin/dealers'] = pendingDealers;
  if (newLeads) badges['/admin/leads'] = newLeads;
  if (pendingTradeIns) badges['/admin/trade-ins'] = pendingTradeIns;

  const sections = getAdminNavWithBadges(adminNavSections, badges);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar sections={sections} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen flex flex-col transition-all duration-300">
        <AdminHeader
          user={{ email: user.email || '', id: user.id }}
          sections={sections}
          badges={{
            pendingDealers: pendingDealers || 0,
            newLeads: newLeads || 0,
            pendingTradeIns: pendingTradeIns || 0,
          }}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
