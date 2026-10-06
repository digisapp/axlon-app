/**
 * The shell around every email the admin inbox sends: typed replies, AI
 * drafts, auto-replies and the round-trip test.
 *
 * Deliberately plain — white, system font, paragraphs, no header, logo or
 * footer — so a reply reads like a person wrote it, which is what gets a
 * buyer to answer. The sender name carries the brand; the body doesn't need
 * to. (Same choice as the Staycio inbox.)
 *
 * Both arguments are markup the caller built from escaped text (textToHtml /
 * buildQuote in admin-inbox.ts) — never HTML from an inbound email or from
 * the model.
 */
export function buildPlainEmail(bodyHtml: string, quotedHtml?: string | null): string {
  // blockquote type="cite" is what Apple Mail, Outlook and Gmail recognise as
  // quoted history, so the recipient's client folds it like any other reply.
  const quote = quotedHtml
    ? `<blockquote type="cite" style="margin:24px 0 0 0;padding:0 0 0 12px;border-left:2px solid #d4d4d8;color:#52525b;">${quotedHtml}</blockquote>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:24px 16px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">
<div style="max-width:560px;">
${bodyHtml}${quote}
</div>
</body>
</html>`;
}
