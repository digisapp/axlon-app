'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, Copy, Loader2, Power, RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TONE } from '@/components/admin/tones';
import { cn } from '@/lib/utils';
import type { InboxStatus } from './types';

interface Props {
  status: InboxStatus;
  loading: boolean;
  onRecheck: () => void;
  onSendTest: () => void;
  sendingTest: boolean;
  onEnableReceiving: () => void;
  enablingReceiving: boolean;
}

function Pill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium', tone)}>{children}</span>;
}

function RecordStatus({ s }: { s: string }) {
  if (s === 'verified') return <Pill tone={TONE.green}>Verified</Pill>;
  if (s === 'pending') return <Pill tone={TONE.amber}>Pending</Pill>;
  return <Pill tone={TONE.red}>{s === 'missing' ? 'Missing' : s === 'not_started' ? 'Not added' : 'Failed'}</Pill>;
}

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }).catch(() => {});
      }}
      title="Copy"
      className="group inline-flex max-w-full items-center gap-1 text-left font-mono text-xs hover:text-primary"
    >
      <span className="break-all">{value}</span>
      <Copy className={cn('h-3 w-3 shrink-0', copied ? 'text-green-600' : 'text-muted-foreground/50 group-hover:text-primary')} />
    </button>
  );
}

/**
 * Shown while mail can't reach the inbox. Lists what is missing in fix
 * order plus the exact DNS records Resend wants, so the admin can finish
 * the setup at the registrar without opening Resend.
 */
export function InboxSetupCard({ status, loading, onRecheck, onSendTest, sendingTest, onEnableReceiving, enablingReceiving }: Props) {
  const [open, setOpen] = useState(true);
  const sendingWorks = status.env.resendApiKey;

  if (status.ready) {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 dark:border-green-900 dark:bg-green-950/40">
        <p className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Receiving is on for <span className="font-mono">{status.inboundDomain}</span>. Replies go out as {status.from}.
        </p>
        <Button size="sm" variant="outline" onClick={onSendTest} disabled={sendingTest}>
          {sendingTest ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          {sendingTest ? 'Sending…' : 'Send me a test'}
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
          <span>
            <span className="block text-sm font-semibold text-amber-900 dark:text-amber-200">This inbox can&apos;t receive mail yet</span>
            <span className="block text-xs text-amber-800 dark:text-amber-300">
              Sending works; incoming mail to <span className="font-mono">{status.inboundAddress}</span> has nowhere to land until the steps below are done.
            </span>
          </span>
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-amber-700 transition-transform dark:text-amber-400', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-amber-200 px-4 py-4 dark:border-amber-900">
          <ol className="list-decimal space-y-1 pl-5 text-sm text-amber-900 dark:text-amber-200">
            {status.problems.map((p) => <li key={p}>{p}</li>)}
          </ol>

          {status.domain.found && status.domain.records.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
                DNS records for {status.zone} (at the registrar)
              </p>
              <div className="overflow-x-auto rounded-xl border border-amber-200 bg-background dark:border-amber-900">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Purpose</th>
                      <th className="px-3 py-2 font-medium">Type</th>
                      <th className="px-3 py-2 font-medium">Host</th>
                      <th className="px-3 py-2 font-medium">Value</th>
                      <th className="px-3 py-2 font-medium">Priority</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {status.domain.records.map((r) => (
                      <tr key={`${r.record}-${r.type}-${r.host}`} className="align-top">
                        <td className="px-3 py-2">{r.record}</td>
                        <td className="px-3 py-2 font-mono">{r.type}</td>
                        <td className="px-3 py-2"><CopyValue value={r.host} /></td>
                        <td className="max-w-[360px] px-3 py-2"><CopyValue value={r.value} /></td>
                        <td className="px-3 py-2 font-mono">{r.priority ?? '—'}</td>
                        <td className="px-3 py-2"><RecordStatus s={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            <div className="rounded-lg border border-amber-200 bg-background px-3 py-2 dark:border-amber-900">
              <dt className="text-muted-foreground">Resend domain</dt>
              <dd className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="font-mono">{status.inboundDomain}</span>
                {status.domain.found ? (
                  <>
                    <RecordStatus s={status.domain.status ?? 'failed'} />
                    <Pill tone={status.domain.receiving === 'enabled' ? TONE.green : TONE.red}>receiving {status.domain.receiving ?? 'off'}</Pill>
                  </>
                ) : <Pill tone={TONE.red}>Not in Resend</Pill>}
                <Pill tone={status.mx.pointsToResend ? TONE.green : TONE.red}>
                  {status.mx.pointsToResend ? 'MX live' : status.mx.hosts.length > 0 ? 'MX points elsewhere' : 'no MX in DNS'}
                </Pill>
              </dd>
            </div>
            <div className="rounded-lg border border-amber-200 bg-background px-3 py-2 dark:border-amber-900">
              <dt className="text-muted-foreground">Resend webhook</dt>
              <dd className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="break-all font-mono">{status.webhook.endpoint ?? 'none'}</span>
                {status.webhook.found
                  ? <Pill tone={status.webhook.canonical && status.webhook.status === 'enabled' ? TONE.green : TONE.red}>{status.webhook.canonical ? status.webhook.status : 'wrong URL'}</Pill>
                  : <Pill tone={TONE.red}>Missing</Pill>}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-2">
            {status.canEnableReceiving && (
              <Button size="sm" onClick={onEnableReceiving} disabled={enablingReceiving}>
                {enablingReceiving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Power className="h-3.5 w-3.5" />}
                {enablingReceiving ? 'Turning on…' : 'Turn on receiving'}
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onRecheck} disabled={loading}>
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} /> Re-check
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onSendTest}
              disabled={sendingTest || !sendingWorks}
              title={sendingWorks ? 'Sends a test email to your admin address' : 'RESEND_API_KEY is missing'}
            >
              {sendingTest ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              {sendingTest ? 'Sending…' : 'Send me a test'}
            </Button>
            <span className="text-xs text-amber-800 dark:text-amber-300">Checked {new Date(status.checkedAt).toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
