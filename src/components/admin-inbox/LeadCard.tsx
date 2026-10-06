'use client';

import { ExternalLink, Globe, MessageSquare, Phone, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LeadContext, LeadStatus } from './types';
import { LEAD_STATUSES, LEAD_STATUS_TONES, formatListDate } from './types';

/** "+14695550142" → "(469) 555-0142"; anything else as stored. */
export function displayPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const us = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits.length === 10 ? digits : null;
  return us ? `(${us.slice(0, 3)}) ${us.slice(3, 6)}-${us.slice(6)}` : phone;
}

/** tel:/sms: want E.164; a bare US number gets +1. */
export function dialable(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (phone.trim().startsWith('+')) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return digits;
}

function money(n: number | null): string | null {
  return typeof n === 'number' && n > 0 ? `$${Math.round(n).toLocaleString('en-US')}` : null;
}

interface LeadCardProps {
  lead: LeadContext;
  saving: boolean;
  onSetStatus: (_status: LeadStatus) => void;
}

/**
 * Who this conversation is with, at a glance: what they asked about, one tap
 * to call or text them, and the lead's status. Replying moves a "new" lead to
 * "contacted" by itself.
 */
export function LeadCard({ lead, saving, onSetStatus }: LeadCardProps) {
  const price = money(lead.listing?.price ?? null);
  const action = 'inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted';

  return (
    <section aria-label="Lead" className="border-b bg-muted/30 px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="truncate font-semibold">{lead.name || lead.email || 'Lead'}</span>
            <span className="text-xs text-muted-foreground">
              {lead.sourceLabel} · {formatListDate(lead.createdAt)}
            </span>
          </p>
          {lead.listing && (
            <a
              href={lead.listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex max-w-full items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Truck className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {[lead.listing.title, price, lead.listing.location].filter(Boolean).join(' · ')}
                {lead.listing.status && lead.listing.status !== 'active' && ` · ${lead.listing.status}`}
              </span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          )}
          {lead.site && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{lead.site.name} · {lead.site.domain}</span>
            </p>
          )}
          {lead.productInterest && !lead.listing && (
            <p className="mt-1 truncate text-xs text-muted-foreground">Interested in: {lead.productInterest}</p>
          )}
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
          Status
          <select
            value={lead.status}
            disabled={saving}
            onChange={(e) => onSetStatus(e.target.value as LeadStatus)}
            className={cn(
              // 16px and 40px tall on phones: iOS zooms into smaller fields.
              'h-10 rounded-md border-0 px-2 text-base font-medium capitalize focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 sm:h-8 sm:text-xs',
              LEAD_STATUS_TONES[lead.status] ?? LEAD_STATUS_TONES.new,
            )}
            aria-label="Lead status"
          >
            {LEAD_STATUSES.map((st) => (
              <option key={st} value={st} className="bg-background text-foreground">
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {lead.phone ? (
        <div className="mt-2.5 flex flex-wrap gap-2">
          <a href={`tel:${dialable(lead.phone)}`} className={action}>
            <Phone className="h-4 w-4" /> Call {displayPhone(lead.phone)}
          </a>
          <a href={`sms:${dialable(lead.phone)}`} className={action}>
            <MessageSquare className="h-4 w-4" /> Text
          </a>
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">No phone number on file. Ask for one when you reply.</p>
      )}
    </section>
  );
}
