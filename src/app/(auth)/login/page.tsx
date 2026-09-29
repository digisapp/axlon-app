'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { PasswordInput } from '../_components/PasswordInput';

const PROBE_ORIGIN = 'https://redirect-check.invalid';
function isSameOriginPath(path: string): boolean {
  try {
    return new URL(path, PROBE_ORIGIN).origin === PROBE_ORIGIN;
  } catch {
    return false;
  }
}

// Supabase's raw messages ("Invalid login credentials") read like a stack
// trace to a dealer on a phone; translate the common ones.
function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Incorrect email or password.';
  if (m.includes('email not confirmed'))
    return 'Please confirm your email first — check your inbox for the confirmation link.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please wait a minute and try again.';
  return message;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/dashboard';
  // Prevent open redirect: only allow same-site relative paths. Reject both //
  // (protocol-relative) and /\ (browsers normalize the backslash to /, so /\evil.com
  // becomes //evil.com and navigates off-site).
  // The URL parser also strips tab/CR/LF, so "/\t/evil.com" becomes
  // "//evil.com" once router.push resolves it — check the resolved origin too.
  const redirect =
    rawRedirect.startsWith('/') &&
    !rawRedirect.startsWith('//') &&
    !rawRedirect.startsWith('/\\') &&
    isSameOriginPath(rawRedirect)
      ? rawRedirect
      : '/dashboard';
  const authError = searchParams.get('error');
  // Carry a non-default destination over to /signup so someone who arrives
  // from a gated page (e.g. /claim) and needs an account still lands back there.
  const signupHref =
    redirect !== '/dashboard' ? `/signup?redirect=${encodeURIComponent(redirect)}` : '/signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(friendlyAuthError(error.message));
      setIsLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    // On success the browser navigates away; only a failure returns here.
    if (error) {
      setError('Could not start Google sign-in. Please try again.');
      setIsLoading(false);
    }
  };

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
          <h1>Sign In</h1>
        </CardTitle>
        <CardDescription>
          Sign in to manage your listings
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div role="alert" className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}

          {!error && authError === 'auth_failed' && (
            <div role="alert" className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
              {/* /auth/callback sends both Google sign-in and email-confirmation failures here. */}
              Sign-in didn&apos;t complete. If you used an email link, it may have expired. Please try again.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                enterKeyHint="next"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 md:h-12 text-base md:text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-base">Password</Label>
              <Link
                href="/forgot-password"
                className="-my-2.5 py-2.5 text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              enterKeyHint="go"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 md:h-12 text-base" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? 'Signing in…' : 'Sign In'}
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
          onClick={handleGoogleLogin}
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
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href={signupHref} className="text-primary hover:underline">
            Create account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      {/* In flow above the card on phones (absolute overlapped the card's top
          edge once the card filled the viewport); pinned top-left from sm up. */}
      <Link
        href="/"
        className="self-start -ml-2.5 mb-2 p-2.5 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors sm:absolute sm:top-1.5 sm:left-1.5 sm:m-0"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <Suspense
        fallback={<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" aria-label="Loading" />}
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
