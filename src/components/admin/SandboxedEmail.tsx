'use client';

import { useRef, useEffect, useState } from 'react';

/**
 * Renders HTML email content inside a sandboxed iframe.
 * Prevents XSS, script execution, and style leakage from untrusted email HTML.
 *
 * The iframe uses:
 * - sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
 *   (no scripts, no forms — but allows link clicks and parent DOM access for height measurement)
 * - srcdoc for inline content, with a CSP that allows only images, inline
 *   styles and fonts: no scripts, forms, frames, objects or outbound requests
 *   other than image/font loads, and no Referer on those
 * - Auto-resizes to fit content height
 */
export function SandboxedEmail({ html, text }: { html?: string | null; text?: string | null }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(100);

  const content = html || (text ? `<pre style="white-space:pre-wrap;font-family:inherit;margin:0">${escapeHtml(text)}</pre>` : null);

  useEffect(() => {
    if (!iframeRef.current || !content) return;

    // Resize iframe to fit content
    const handleLoad = () => {
      const iframe = iframeRef.current;
      if (!iframe?.contentDocument?.body) return;

      // Measure content height
      const body = iframe.contentDocument.body;
      const newHeight = Math.max(body.scrollHeight, body.offsetHeight, 60);
      setHeight(Math.min(newHeight + 20, 2400)); // long mail scrolls inside the frame past this
    };

    const iframe = iframeRef.current;
    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [content]);

  if (!content) {
    return <p className="text-sm text-muted-foreground italic">No content</p>;
  }

  // Wrap content with base styles and target="_blank" for links
  const wrappedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' https: data:; style-src 'unsafe-inline'; font-src https: data:;">
      <meta name="referrer" content="no-referrer">
      <base target="_blank">
      <style>
        * { box-sizing: border-box; }
        /* Email HTML is authored for a white page; the iframe is transparent by
           default, which left dark text on the admin's dark-mode card. */
        html { background: #ffffff; }
        body {
          margin: 0;
          padding: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #1a1a1a;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        img { max-width: 100%; height: auto; }
        a { color: #2563eb; }
        pre { white-space: pre-wrap; }
        blockquote {
          border-left: 2px solid #ccc;
          margin: 8px 0;
          padding-left: 12px;
          color: #555;
        }
      </style>
    </head>
    <body>${content}</body>
    </html>
  `;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={wrappedHtml}
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="no-referrer"
      style={{
        width: '100%',
        height: `${height}px`,
        border: 'none',
        borderRadius: '6px',
        overflow: 'hidden',
      }}
      title="Email content"
    />
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
