'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { HONEYPOT_FIELD } from '@/lib/leads/form-guard';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Building2, ArrowLeft, Check, Package, BarChart3, Users } from 'lucide-react';
import { PasswordInput } from '../_components/PasswordInput';
import { csrfFetch } from '@/lib/csrf-fetch';

export default function SignupPage() {
  const searchParams = useSearchParams();
  // Where to land after the confirmation email / OAuth round-trip. Same-site
  // relative paths only (reject // and /\ like the login page does) so a
  // crafted link can't bounce a new account off-site. Used by /claim so a
  // dealer returns to finish claiming their inventory.
  const rawRedirect = searchParams.get('redirect') || '';
  const redirect =
    rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') && !rawRedirect.startsWith('/\\')
      ? rawRedirect
      : '';
  const loginHref = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // When the form was first shown: a submission seconds later is a bot.
  const startedAt = useRef<number>(Date.now());

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const honeypot = (new FormData(e.currentTarget as HTMLFormElement).get(HONEYPOT_FIELD) as string) || '';
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const res = await csrfFetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          website: honeypot,
          startedAt: startedAt.current,
          ...(redirect && { redirect }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`,
      },
    });
    // On success the browser navigates away; only a failure returns here.
    if (error) {
      setError('Could not start Google sign-up. Please try again.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">
              <h1>Check Your Email</h1>
            </CardTitle>
            <CardDescription>
              We&apos;ve sent a confirmation link to <strong>{formData.email}</strong>.
              Click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full h-12 md:h-12 text-base">
              <Link href={loginHref}>Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Link
        href="/"
        className="self-start -ml-2.5 mb-2 p-2.5 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors sm:absolute sm:top-1.5 sm:left-1.5 sm:m-0"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex justify-center mb-4">
            <Image
              src="/images/axlonai-logo.png"
              alt="Axleyard home"
              width={120}
              height={80}
              className="dark:brightness-110"
            />
          </Link>
          <CardTitle className="text-xl">
            <h1>Create Your Account</h1>
          </CardTitle>
          <CardDescription>
            AI-powered tools for the heavy equipment industry
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Benefits */}
          <div className="grid grid-cols-3 gap-2 mb-6 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <Package className="w-4 h-4 mx-auto mb-1 text-primary" />
              <span className="block text-xs leading-tight text-muted-foreground">List Equipment</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <Users className="w-4 h-4 mx-auto mb-1 text-green-500" />
              <span className="block text-xs leading-tight text-muted-foreground">Get Leads</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <BarChart3 className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <span className="block text-xs leading-tight text-muted-foreground">Track Sales</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Honeypot: hidden from people, filled in by bots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor="signup-website">Website</label>
              <input id="signup-website" name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>
            {error && (
              <div role="alert" className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-base">Company Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="companyName"
                  type="text"
                  autoComplete="organization"
                  placeholder="Your company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="pl-11 h-12 md:h-12 text-base md:text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11 h-12 md:h-12 text-base md:text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Password</Label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 md:h-12 text-base" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 md:h-12 text-base"
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href={loginHref} className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
