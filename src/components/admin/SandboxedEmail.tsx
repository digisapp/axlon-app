'use client';

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { buildEmailSrcdoc, emailFrameContent } from '@/components/admin-inbox/email-srcdoc';

/** Taller than this and the message scrolls inside its own frame. */
const MAX_HEIGHT = 1600;
const MIN_HEIGHT = 48;

/**
 * Renders email content inside a sandboxed iframe.
 *
 * - sandbox without allow-scripts, plus a CSP in the document that allows
 *   only images, inline styles and fonts: nothing in an email can run, submit
 *   a form or navigate the page. allow-same-origin is there only so this
 *   component can read the content's height.
 * - The look follows the message (designed mail on white, typed replies in
 *   the admin's own light or dark colours) and quoted history is folded
 *   behind a "•••" toggle; see email-srcdoc.ts.
 */
export function SandboxedEmail({ html, text }: { html?: string | null; text?: string | null }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(72);
  // Messages only render after the inbox has fetched them on the client, so
  // next-themes already knows the resolved theme here (no SSR mismatch).
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';

  const content = useMemo(() => emailFrameContent(html, text), [html, text]);
  const srcdoc = useMemo(
    () => (content ? buildEmailSrcdoc(content.inner, { theme: content.theme, dark }) : null),
    [content, dark],
  );

  const measure = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    const root = doc?.getElementById('email-root');
    if (!doc || !root) return;
    // Measured on the content root, never on the document: the document is at
    // least as tall as the frame, so measuring it only ever grows the frame.
    const style = doc.defaultView?.getComputedStyle(doc.body);
    const pad = style ? parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) : 0;
    const next = Math.ceil(root.getBoundingClientRect().height + pad);
    setHeight(Math.min(Math.max(next, MIN_HEIGHT), MAX_HEIGHT));
  }, []);

  // A layout effect runs right after React sets the new srcdoc and before the
  // browser can finish loading it, so the load listener is always in place
  // and only ever sees the current document.
  useLayoutEffect(() => {
    const frame = iframeRef.current;
    if (!frame || !srcdoc) return;
    let observer: ResizeObserver | null = null;
    const cleanups: Array<() => void> = [];

    const onLoad = () => {
      observer?.disconnect();
      cleanups.splice(0).forEach((fn) => fn());
      measure();
      const doc = frame.contentDocument;
      const root = doc?.getElementById('email-root');
      if (!doc || !root) return;
      // Opening or closing the quoted history, and late-loading images,
      // change the height.
      const onToggle = () => measure();
      doc.addEventListener('toggle', onToggle, true);
      cleanups.push(() => doc.removeEventListener('toggle', onToggle, true));
      for (const img of Array.from(doc.images)) {
        img.addEventListener('load', onToggle);
        img.addEventListener('error', onToggle);
        cleanups.push(() => {
          img.removeEventListener('load', onToggle);
          img.removeEventListener('error', onToggle);
        });
      }
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => measure());
        observer.observe(root);
      }
    };

    frame.addEventListener('load', onLoad);
    window.addEventListener('resize', measure);
    return () => {
      frame.removeEventListener('load', onLoad);
      window.removeEventListener('resize', measure);
      observer?.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, [srcdoc, measure]);

  if (!content || !srcdoc) {
    return <p className="px-4 py-3 text-sm italic text-muted-foreground">No content</p>;
  }

  const paper = content.theme === 'paper';
  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcdoc}
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="no-referrer"
      title="Email content"
      className="block w-full border-0"
      // colorScheme must match the document inside: a mismatch makes the
      // browser paint an opaque canvas behind a transparent frame.
      style={{
        height: `${height}px`,
        background: paper ? '#ffffff' : 'transparent',
        colorScheme: paper || !dark ? 'light' : 'dark',
      }}
    />
  );
}
