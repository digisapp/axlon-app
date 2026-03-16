'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, Loader2, MailX } from 'lucide-react';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Pre-fill from URL param
  if (typeof window !== 'undefined' && !email) {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) setEmail(emailParam);
  }

  const handleUnsubscribe = async () => {
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          ) : (
            <MailX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          )}
          <CardTitle>
            {status === 'success' ? 'Unsubscribed' : 'Unsubscribe from emails'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <p className="text-center text-muted-foreground">
              You have been unsubscribed. You will no longer receive market reports
              or follow-up emails from AXLON.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Enter your email to unsubscribe from all AXLON automated emails.
              </p>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={handleUnsubscribe}
                disabled={!email || status === 'loading'}
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
    </div>
  );
}
