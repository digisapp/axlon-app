import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_name, avatar_url, is_business, is_admin, created_at, subscription_tier')
    .eq('id', user.id)
    .single();

  // If profile query fails or no profile, create a basic one instead of redirecting
  if (!profile) {
    console.error('Dashboard: profile not found or query failed', profileError?.message);
    // Auto-create profile for authenticated users who don't have one
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      is_business: false,
      is_admin: false,
    }, { onConflict: 'id' });
  }

  // Get unread messages count
  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', user.id)
    .eq('is_read', false);

  // Get new leads count (leads created in last 7 days with status 'new')
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'new');

  // Trial countdown
  const trialStart = profile?.created_at ? new Date(profile.created_at) : new Date();
  const trialEnd = new Date(trialStart.getTime() + 30 * 24 * 60 * 60 * 1000);
  const trialDaysRemaining = !profile?.subscription_tier || profile.subscription_tier === 'free'
    ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          unreadMessages={unreadMessages || 0}
          newLeads={newLeads || 0}
          subscriptionTier={profile?.subscription_tier || 'free'}
        />
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64 min-h-screen flex flex-col transition-all duration-300">
        {/* Header */}
        <DashboardHeader
          user={{ email: user.email || '', id: user.id }}
          profile={profile}
          unreadMessages={unreadMessages || 0}
          newLeads={newLeads || 0}
          trialDaysRemaining={trialDaysRemaining}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
