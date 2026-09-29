'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, LinkIcon } from 'lucide-react';
import { PasswordInput } from '../_components/PasswordInput';

type LinkStatus = 'checking' | 'ready' | 'invalid';

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  // Visiting this page without a recovery session (no/used/expired link) used
  // to show the form anyway, and submitting it failed with Supabase's raw
  // "Auth session missing!". Resolve the link first and route dead links to
  // /forgot-password instead.
  const [linkStatus, setLinkStatus] = useState<LinkStatus>('checking');
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && !cancelled) setLinkStatus('ready');
    });

    const resolveLink = async () => {
      // Supabase sends expired/used links back with ?error=…&error_code=otp_expired
      // (or the same in the hash for the implicit flow).
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (searchParams.get('error') || searchParams.get('error_code') || /error(_code)?=/.test(hash)) {
        if (!cancelled) setLinkStatus('invalid');
        return;
      }

      // The browser client (detectSessionInUrl + PKCE) already exchanges
      // ?code= during its own initialization and then deletes the code
      // verifier, so a second manual exchange always failed and showed
      // "expired link" to users whose reset session was actually valid.
      // getSession() waits for that initialization; only fall back to a
      // manual exchange when it produced no session.
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (!cancelled) setLinkStatus('ready');
        return;
      }

      const code = searchParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!cancelled) setLinkStatus(error ? 'invalid' : 'ready');
        return;
      }

      if (!cancelled) setLinkStatus('invalid');
    };

    resolveLink();
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [searchParams, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      if (/session/i.test(error.message)) {
        setLinkStatus('invalid');
      } else if (/different from the old/i.test(error.message)) {
        setError('Your new password must be different from your current one.');
      } else {
        setError(error.message);
      }
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center" role="status">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-xl font-bold mb-2">Password Updated!</h1>
          <p className="text-muted-foreground mb-6">
            Your password has been successfully reset. Redirecting you to the dashboard...
          </p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
          <Link href="/dashboard" className="mt-4 inline-block py-2 text-sm text-primary hover:underline">
            Go to dashboard now
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (linkStatus === 'checking') {
    return (
      <div role="status" className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm">Checking your reset link…</span>
      </div>
    );
  }

  if (linkStatus === 'invalid') {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-7 h-7 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">
            <h1>This reset link isn&apos;t valid</h1>
          </CardTitle>
          <CardDescription>
            Password reset links expire after a short time, can only be used once, and
            must be opened in the same browser you requested them from. Request a new
            one and we&apos;ll email it to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full h-12 md:h-12 text-base">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12 md:h-12 text-base">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
          <h1>Set New Password</h1>
        </CardTitle>
        <CardDescription>
          Enter your new password below
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">New Password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              aria-describedby="password-hint"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <p id="password-hint" className="text-xs text-muted-foreground">
            Password must be at least 8 characters long
          </p>

          <Button type="submit" className="w-full h-12 md:h-12 text-base" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? 'Saving…' : 'Reset Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ResetPasswordForm() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" aria-label="Loading" />}>
        <ResetPasswordInner />
      </Suspense>
    </div>
  );
}
