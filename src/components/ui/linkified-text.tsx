'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { linkify } from '@/lib/linkify';

interface LinkifiedTextProps {
  text: string;
  className?: string;
  /** Called after an internal (marketplace) link is tapped — e.g. to close a chat panel. */
  onInternalNavigate?: () => void;
}

/**
 * Renders AI chat text with marketplace URLs as short tappable links
 * ("View listing →") and other URLs as external links. Keep the parent's
 * whitespace handling (e.g. whitespace-pre-wrap) — this only swaps links in.
 */
export function LinkifiedText({ text, className, onInternalNavigate }: LinkifiedTextProps) {
  const tokens = linkify(text);
  const linkClass =
    'inline-flex items-center gap-1 py-1 font-medium text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary break-all';

  return (
    <span className={className}>
      {tokens.map((token, i) => {
        if (token.type === 'text') return <span key={i}>{token.value}</span>;
        if (token.internal) {
          return (
            <Link key={i} href={token.href} className={linkClass} onClick={onInternalNavigate}>
              {token.label}
              <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </Link>
          );
        }
        return (
          <a key={i} href={token.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {token.label}
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        );
      })}
    </span>
  );
}
