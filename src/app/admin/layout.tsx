import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { adminNavSections, getAdminNavWithBadges } from '@/lib/admin-nav';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

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
    { count: pendingBusinesses },
    { count: newLeads },
    { count: pendingTradeIns },
    { count: unreadEmails },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('business_status', 'pending'),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('trade_in_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    // Unread, non-spam conversations in /admin/email (same rule as the inbox's Unread folder).
    supabase
      .from('email_threads')
      .select('*', { count: 'exact', head: true })
      .eq('is_spam', false)
      .eq('is_unread', true)
      .in('status', ['received', 'read', 'replied']),
  ]);

  const badges: Record<string, number> = {};
  if (pendingBusinesses) badges['/admin/dealers'] = pendingBusinesses;
  if (newLeads) badges['/admin/leads'] = newLeads;
  if (pendingTradeIns) badges['/admin/trade-ins'] = pendingTradeIns;
  if (unreadEmails) badges['/admin/email'] = unreadEmails;

  const sections = getAdminNavWithBadges(adminNavSections, badges);

  return (
    <div className="group/admin min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar sections={sections} />
      </div>

      {/* Main Content */}
      {/* pl tracks the sidebar width (w-64, or w-16 when collapsed) */}
      <div className="lg:pl-64 lg:group-has-[aside[data-collapsed=true]]/admin:pl-16 min-h-screen flex flex-col transition-all duration-300">
        <AdminHeader
          user={{ email: user.email || '', id: user.id }}
          sections={sections}
          badges={{
            pendingBusinesses: pendingBusinesses || 0,
            newLeads: newLeads || 0,
            pendingTradeIns: pendingTradeIns || 0,
            unreadEmails: unreadEmails || 0,
          }}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
