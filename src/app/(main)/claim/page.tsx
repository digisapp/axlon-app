import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Package, ShieldCheck, Bot, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyClaimToken } from '@/lib/claims/token';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClaimStorefrontButton } from '@/components/storefront/ClaimStorefrontButton';

export const metadata: Metadata = {
  title: 'Claim Your Storefront',
  description: 'Your inventory is already on Axleyard. Claim it to manage your listings and capture leads 24/7.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ source?: string; t?: string }>;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ClaimPage({ searchParams }: PageProps) {
  const { source, t } = await searchParams;
  const valid = !!source && UUID.test(source) && verifyClaimToken(source, t);

  if (!valid) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <ShieldCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">This claim link isn&apos;t valid</h1>
        <p className="text-muted-foreground mb-6">
          Claim links are sent to a dealership&apos;s own contact address. If you believe your
          inventory is listed on Axleyard, get in touch and we&apos;ll verify you and send a fresh link.
        </p>
        <Button asChild>
          <Link href="/contact?subject=other">Contact us</Link>
        </Button>
      </div>
    );
  }

  const admin = createAdminClient();
  const [{ data: dealerSource }, { count: listingCount }] = await Promise.all([
    admin
      .from('dealer_sources')
      .select('id, name, website, location_city, location_state, claimed_by, claimed_at')
      .eq('id', source)
      .single(),
    admin
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('source_dealer_id', source)
      .eq('status', 'active'),
  ]);

  if (!dealerSource) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Dealer not found</h1>
        <p className="text-muted-foreground">This invitation no longer matches a dealer record.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const count = listingCount ?? 0;
  const here = `/claim?source=${encodeURIComponent(source!)}&t=${encodeURIComponent(t!)}`;
  const alreadyClaimedByOther = !!dealerSource.claimed_by && dealerSource.claimed_by !== user?.id;
  const location = [dealerSource.location_city, dealerSource.location_state].filter(Boolean).join(', ');

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Building2 className="w-4 h-4" />
          {dealerSource.name}
          {location && <span className="text-primary/70">· {location}</span>}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Your inventory is already on Axleyard
        </h1>
        <p className="text-lg text-muted-foreground">
          {count > 0
            ? `${count} ${count === 1 ? 'unit' : 'units'} from ${dealerSource.name} ${count === 1 ? 'is' : 'are'} live on the marketplace right now.`
            : `Listings from ${dealerSource.name} appear on the marketplace as they are published.`}{' '}
          Claim them to manage the listings yourself and let AXLON capture buyer leads for you around the clock.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <ul className="grid gap-4 sm:grid-cols-3 text-sm">
            <li className="flex flex-col items-center text-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              <span className="font-medium">Your listings, your account</span>
              <span className="text-muted-foreground">Edit prices, photos and availability any time.</span>
            </li>
            <li className="flex flex-col items-center text-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <span className="font-medium">AI that answers buyers</span>
              <span className="text-muted-foreground">Every inquiry gets a reply and lands in your inbox.</span>
            </li>
            <li className="flex flex-col items-center text-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              <span className="font-medium">Free to claim</span>
              <span className="text-muted-foreground">No card needed. Upgrade only if you want more.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          {alreadyClaimedByOther ? (
            <div className="text-center">
              <p className="font-semibold mb-1">This inventory has already been claimed.</p>
              <p className="text-sm text-muted-foreground mb-4">
                If that wasn&apos;t you, contact us and we&apos;ll sort it out.
              </p>
              <Button asChild variant="outline">
                <Link href="/contact?subject=support">Contact support</Link>
              </Button>
            </div>
          ) : user ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Signed in as <strong>{user.email}</strong>. Claiming attaches the listings to this account.
              </p>
              <ClaimStorefrontButton sourceId={source!} token={t!} listingCount={count} />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Create a free account (or sign in) and you&apos;ll come straight back here to finish.
              </p>
              <Button asChild size="lg" className="w-full">
                <Link href={`/signup?redirect=${encodeURIComponent(here)}`}>Create my free account</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href={`/login?redirect=${encodeURIComponent(here)}`}>I already have an account</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
