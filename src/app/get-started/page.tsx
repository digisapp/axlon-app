'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2,
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  Check,
  Package,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Store,
  Sparkles,
  Construction,
  Truck,
  Wrench,
} from 'lucide-react';

const benefits = [
  {
    icon: Package,
    title: 'List Your Inventory',
    description: 'Add unlimited listings with photos, specs, and pricing',
  },
  {
    icon: TrendingUp,
    title: 'AI Price Estimates',
    description: 'Get market-based pricing suggestions powered by AI',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    description: 'Chat directly with interested buyers in real-time',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track views, leads, and listing performance',
  },
  {
    icon: Store,
    title: 'Branded Storefront',
    description: 'Your own branded page showcasing all your inventory',
  },
  {
    icon: Sparkles,
    title: 'AI Sales Assistant',
    description: 'AI-powered chatbot to handle buyer inquiries 24/7',
  },
];

const industries = [
  {
    icon: Truck,
    label: 'Heavy Haul & Transport',
    href: '/industries/transport',
  },
  {
    icon: Construction,
    label: 'Crane & Rigging',
    href: '/industries/crane',
  },
  {
    icon: Wrench,
    label: 'Equipment Services',
    href: '/industries/rigging',
  },
];

export default function GetStartedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAlreadyDealer, setIsAlreadyDealer] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_dealer, is_admin, company_name, phone, location')
          .eq('id', user.id)
          .single();

        if (profile?.is_dealer || profile?.is_admin) {
          router.push('/dashboard');
          return;
        } else if (profile) {
          setFormData({
            company_name: profile.company_name || '',
            phone: profile.phone || '',
            location: profile.location || '',
          });
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.company_name.trim()) {
      setError('Company name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Please sign in to continue');
        setIsSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          company_name: formData.company_name.trim(),
          phone: formData.phone.trim() || null,
          location: formData.location.trim() || null,
          is_dealer: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        setError(updateError.message);
        setIsSubmitting(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Error setting up account:', err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAlreadyDealer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>You&apos;re Already Verified!</CardTitle>
            <CardDescription>
              Your business account is set up. You can start listing equipment right away.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/listings/new">Create a Listing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            {!isLoggedIn && (
              <Link href="/login?redirect=/get-started">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Benefits */}
          <div>
            <div className="mb-8">
              <Image
                src="/images/axlonai-logo.png"
                alt="AXLON AI"
                width={120}
                height={40}
                className="mb-6"
              />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Grow Your Business with AI
              </h1>
              <p className="text-lg text-muted-foreground">
                The AI-powered platform for heavy equipment, crane, rigging, and transport companies.
                Reach thousands of buyers and streamline your operations.
              </p>
            </div>

            {/* Industry badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {industries.map((ind) => (
                <Link
                  key={ind.label}
                  href={ind.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  <ind.icon className="w-4 h-4" />
                  {ind.label}
                </Link>
              ))}
            </div>

            <div className="grid gap-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">30-day free trial.</strong> No credit card required.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>
                  {isLoggedIn ? 'Complete Your Business Profile' : 'Create Your Account'}
                </CardTitle>
                <CardDescription>
                  {isLoggedIn
                    ? 'Fill in your business details to start listing equipment'
                    : 'Create a free account to get started'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Create an account to access AI-powered tools for your business.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/signup">Create Account</Link>
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Already have an account?
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login?redirect=/get-started">Sign In</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Company Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="company_name"
                        placeholder="Your Company Name"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Displayed on your listings for buyer inquiries
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Helps buyers find equipment near them
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Get Started
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By continuing, you agree to our{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
