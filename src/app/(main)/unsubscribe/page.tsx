'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, MailX } from 'lucide-react';

type Status = 'ready' | 'loading' | 'success' | 'invalid' | 'error';

function UnsubscribeContent() {
  // Unsubscribe links carry email + HMAC token in the query string
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<Status>(() =>
    email && token ? 'ready' : 'invalid'
  );

  const handleUnsubscribe = async () => {
    if (!email || !token) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });
      if (res.ok) {
        setStatus('success');
      } else if (res.status === 403) {
        setStatus('invalid');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        {status === 'success' ? (
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        ) : status === 'invalid' ? (
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        ) : (
          <MailX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        )}
        <CardTitle>
          {status === 'success'
            ? 'Unsubscribed'
            : status === 'invalid'
              ? 'Invalid unsubscribe link'
              : 'Unsubscribe from emails'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'success' ? (
          <p className="text-center text-muted-foreground">
            You have been unsubscribed. You will no longer receive market reports
            or follow-up emails from AXLON.
          </p>
        ) : status === 'invalid' ? (
          <p className="text-center text-sm text-muted-foreground">
            This unsubscribe link is missing or has an invalid token. Please use
            the unsubscribe link from a recent AXLON email, or contact{' '}
            <a href="mailto:sales@axlon.ai" className="underline">
              sales@axlon.ai
            </a>{' '}
            and we&apos;ll remove you manually.
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Unsubscribe <span className="font-medium text-foreground">{email}</span>{' '}
              from all AXLON automated emails?
            </p>
            <Button
              className="w-full"
              onClick={handleUnsubscribe}
              disabled={status === 'loading'}
            >
              {status === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Unsubscribe
            </Button>
            {status === 'error' && (
              <p className="text-sm text-red-500 text-center">
                Something went wrong. Please try again or contact support.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardContent className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        }
      >
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
