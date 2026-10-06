import { escapeHtml, sanitizeUrl } from '@/lib/utils/html-escape';

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
`;

const buttonStyles = `
  display: inline-block;
  background-color: #0066cc;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
`;

const containerStyles = `
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const headerStyles = `
  text-align: center;
  margin-bottom: 32px;
`;

const footerStyles = `
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

export function newMessageEmail({
  recipientName,
  senderName,
  listingTitle,
  messagePreview,
  conversationUrl,
}: {
  recipientName: string;
  senderName: string;
  listingTitle: string;
  messagePreview: string;
  conversationUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="${containerStyles} background-color: white; border-radius: 12px;">
          <div style="${headerStyles}">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email/axlon-mark.png" alt="AXLON AI" width="34" height="40" style="width: 34px; height: 40px;">
          </div>

          <h1 style="font-size: 24px; margin-bottom: 16px;">New Message</h1>

          <p>Hi ${escapeHtml(recipientName)},</p>

          <p><strong>${escapeHtml(senderName)}</strong> sent you a message about:</p>

          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="font-weight: 600; margin: 0 0 8px 0;">${escapeHtml(listingTitle)}</p>
            <p style="margin: 0; color: #666;">"${escapeHtml(messagePreview)}"</p>
          </div>

          <p style="text-align: center;">
            <a href="${sanitizeUrl(conversationUrl)}" style="${buttonStyles}">
              View Message
            </a>
          </p>

          <div style="${footerStyles}">
            <p>You received this email because you have an account on AXLON AI.</p>
            <p>&copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function listingPublishedEmail({
  sellerName,
  listingTitle,
  listingUrl,
}: {
  sellerName: string;
  listingTitle: string;
  listingUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="${containerStyles} background-color: white; border-radius: 12px;">
          <div style="${headerStyles}">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email/axlon-mark.png" alt="AXLON AI" width="34" height="40" style="width: 34px; height: 40px;">
          </div>

          <h1 style="font-size: 24px; margin-bottom: 16px;">Your Listing is Live!</h1>

          <p>Hi ${escapeHtml(sellerName)},</p>

          <p>Great news! Your listing is now live and visible to buyers:</p>

          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="font-weight: 600; margin: 0;">${escapeHtml(listingTitle)}</p>
          </div>

          <p style="text-align: center;">
            <a href="${sanitizeUrl(listingUrl)}" style="${buttonStyles}">
              View Listing
            </a>
          </p>

          <h3 style="margin-top: 32px;">Tips to get more views:</h3>
          <ul style="color: #666;">
            <li>Add more photos</li>
            <li>Write a detailed description</li>
            <li>Set a competitive price</li>
            <li>Share on social media</li>
          </ul>

          <div style="${footerStyles}">
            <p>&copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function welcomeEmail({
  userName,
  dashboardUrl,
}: {
  userName: string;
  dashboardUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="${containerStyles} background-color: white; border-radius: 12px;">
          <div style="${headerStyles}">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email/axlon-mark.png" alt="AXLON AI" width="34" height="40" style="width: 34px; height: 40px;">
          </div>

          <h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to AXLON AI!</h1>

          <p>Hi ${escapeHtml(userName)},</p>

          <p>Thank you for joining AXLON AI, the AI-powered marketplace for trucks, trailers, and equipment.</p>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${sanitizeUrl(dashboardUrl)}" style="${buttonStyles}">
              Get Started
            </a>
          </p>

          <h3>What you can do:</h3>
          <ul style="color: #666;">
            <li>Search with AI - Find equipment using natural language</li>
            <li>List your equipment - Sell trucks, trailers, and more</li>
            <li>Get price estimates - AI-powered market valuations</li>
            <li>Connect with buyers - Message sellers directly</li>
          </ul>

          <div style="${footerStyles}">
            <p>&copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function inquiryReceivedEmail({
  sellerName,
  buyerName,
  listingTitle,
  messagePreview,
  replyUrl,
}: {
  sellerName: string;
  buyerName: string;
  listingTitle: string;
  messagePreview: string;
  replyUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="${containerStyles} background-color: white; border-radius: 12px;">
          <div style="${headerStyles}">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email/axlon-mark.png" alt="AXLON AI" width="34" height="40" style="width: 34px; height: 40px;">
          </div>

          <h1 style="font-size: 24px; margin-bottom: 16px;">New Inquiry Received!</h1>

          <p>Hi ${escapeHtml(sellerName)},</p>

          <p>Good news! <strong>${escapeHtml(buyerName)}</strong> is interested in your listing:</p>

          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="font-weight: 600; margin: 0 0 8px 0;">${escapeHtml(listingTitle)}</p>
            <p style="margin: 0; color: #666;">Message: "${escapeHtml(messagePreview)}"</p>
          </div>

          <p style="text-align: center;">
            <a href="${sanitizeUrl(replyUrl)}" style="${buttonStyles}">
              Reply Now
            </a>
          </p>

          <p style="color: #666; font-size: 14px;">
            Pro tip: Responding quickly can increase your chances of making a sale!
          </p>

          <div style="${footerStyles}">
            <p>&copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Chat notification emails

export function newChatConversationEmail({
  dealerName,
  visitorMessage,
  conversationUrl,
}: {
  dealerName: string;
  visitorMessage: string;
  conversationUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="${containerStyles} background-color: white; border-radius: 12px;">
          <div style="${headerStyles}">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email/axlon-mark.png" alt="AXLON AI" width="34" height="40" style="width: 34px; height: 40px;">
          </div>

          <h1 style="font-size: 24px; margin-bottom: 16px;">New Chat on Your Storefront</h1>

          <p>Hi ${escapeHtml(dealerName)},</p>

          <p>A visitor just started a conversation with your AI assistant on your storefront:</p>

          <div style="background-color: #f0f9ff; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc;">
            <p style="margin: 0; color: #333;">"${escapeHtml(visitorMessage)}"</p>
          </div>

          <p>Your AI assistant is handling the conversation, but you can take over anytime.</p>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${sanitizeUrl(conversationUrl)}" style="${buttonStyles}">
              View Conversation
            </a>
          </p>

          <div style="${footerStyles}">
            <p style="font-size: 12px; color: #999;">You can manage notification preferences in your dashboard settings.</p>
            <p>&copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function chatLeadCapturedEmail({
  dealerName,
  visitorName,
  visitorEmail,
  visitorPhone,
  conversationUrl,
  leadsUrl,
}: {
  dealerName: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  conversationUrl: string;
  leadsUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="${containerStyles} background-color: white; border-radius: 12px;">
          <div style="${headerStyles}">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email/axlon-mark.png" alt="AXLON AI" width="34" height="40" style="width: 34px; height: 40px;">
          </div>

          <div style="background-color: #10b981; color: white; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <strong>New Lead Captured!</strong>
          </div>

          <p>Hi ${escapeHtml(dealerName)},</p>

          <p>Great news! A visitor shared their contact information during a chat on your storefront:</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 100px;">Name:</td>
                <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(visitorName)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${escapeHtml(visitorEmail)}" style="color: #0066cc;">${escapeHtml(visitorEmail)}</a>
                </td>
              </tr>
              ${visitorPhone ? `
              <tr>
                <td style="padding: 8px 0; color: #666;">Phone:</td>
                <td style="padding: 8px 0;">
                  <a href="tel:${escapeHtml(visitorPhone)}" style="color: #0066cc;">${escapeHtml(visitorPhone)}</a>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${sanitizeUrl(conversationUrl)}" style="${buttonStyles}">
              View Chat History
            </a>
            <a href="${sanitizeUrl(leadsUrl)}" style="${buttonStyles} background-color: #10b981; margin-left: 12px;">
              Go to Leads
            </a>
          </p>

          <p style="color: #666; font-size: 14px; text-align: center;">
            This lead came from your AI-powered chat assistant. Follow up quickly for best results!
          </p>

          <div style="${footerStyles}">
            <p style="font-size: 12px; color: #999;">You can manage notification preferences in your dashboard settings.</p>
            <p>&copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function savedSearchAlertEmail({
  userName,
  searchName,
  newListingsCount,
  listings,
  searchUrl,
}: {
  userName: string;
  searchName: string;
  newListingsCount: number;
  listings: Array<{ title: string; price: string; url: string }>;
  searchUrl: string;
}) {
  const listingRows = listings.slice(0, 5).map(l => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <a href="${sanitizeUrl(l.url)}" style="color: #0066cc; text-decoration: none; font-weight: 500;">${escapeHtml(l.title)}</a>
        <br>
        <span style="color: #666; font-size: 14px;">${escapeHtml(l.price)}</span>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="${containerStyles} background-color: white; border-radius: 12px;">
          <div style="${headerStyles}">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email/axlon-mark.png" alt="AXLON AI" width="34" height="40" style="width: 34px; height: 40px;">
          </div>

          <h1 style="font-size: 24px; margin-bottom: 16px;">${newListingsCount} New Matches!</h1>

          <p>Hi ${escapeHtml(userName)},</p>

          <p>We found <strong>${newListingsCount} new listing${newListingsCount > 1 ? 's' : ''}</strong> matching your saved search:</p>

          <div style="background-color: #f0f9ff; padding: 12px 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #0066cc;">
            <strong>${escapeHtml(searchName)}</strong>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${listingRows}
          </table>

          ${newListingsCount > 5 ? `<p style="color: #666; font-size: 14px;">... and ${newListingsCount - 5} more</p>` : ''}

          <p style="text-align: center; margin: 32px 0;">
            <a href="${sanitizeUrl(searchUrl)}" style="${buttonStyles}">
              View All Matches
            </a>
          </p>

          <div style="${footerStyles}">
            <p style="font-size: 12px; color: #999;">You're receiving this because you saved this search on AXLON AI. Manage your alerts in your dashboard.</p>
            <p>&copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * The signup confirmation. Returns subject, HTML and a plain-text alternative;
 * the caller passes all three to sendEmail.
 *
 * Built as nested tables with inline styles so it renders the same in
 * Outlook, Gmail and Apple Mail; dark header band so the chrome emblem reads;
 * the small email copy of the mark (80 KB) rather than the 2.8 MB site logo.
 */
export function confirmEmailTemplate({
  companyName,
  confirmationUrl,
}: {
  companyName: string;
  confirmationUrl: string;
}): { subject: string; html: string; text: string } {
  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://axleyard.com').replace(/\/$/, '');
  // sanitizeUrl() returns '' for javascript:/data: links and otherwise an
  // attribute-escaped string (slashes become &#x2F;), which is right for an
  // href and wrong everywhere a person reads the URL. Keep the raw link for
  // the visible fallback and the plain-text version, only if it passed.
  const href = sanitizeUrl(confirmationUrl);
  const link = href ? confirmationUrl.trim() : '';
  const company = escapeHtml(companyName.trim());
  const year = new Date().getFullYear();
  const font = "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";

  const subject = 'Confirm your AXLON AI account';

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformat">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #eef1f5; ${font}">
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #eef1f5;">
    One click finishes setting up your AXLON AI account.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eef1f5;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; margin: 0 auto;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #0b1220; border-radius: 14px 14px 0 0; padding: 32px 24px 28px;">
              <img src="${base}/images/email/axlon-mark.png" width="62" height="72" alt="" style="display: block; width: 62px; height: 72px; border: 0; margin: 0 auto 14px;">
              <div style="${font} font-size: 22px; font-weight: 800; letter-spacing: 0.22em; color: #ffffff; line-height: 1;">AXLON</div>
              <div style="${font} font-size: 11px; font-weight: 600; letter-spacing: 0.18em; color: #7dd3fc; line-height: 1; margin-top: 8px;">AI FOR HEAVY EQUIPMENT DEALERS</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px 40px 8px;">
              <h1 style="${font} margin: 0 0 14px; font-size: 26px; line-height: 1.25; font-weight: 700; color: #0b1220;">Confirm your email</h1>
              <p style="${font} margin: 0 0 28px; font-size: 16px; line-height: 1.6; color: #334155;">
                You're almost in. Confirm this address to finish creating the AXLON AI account for <strong style="color: #0b1220;">${company}</strong>.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px;">
                <tr>
                  <td align="center" style="background-color: #009fe6; border-radius: 10px; mso-padding-alt: 16px 36px;">
                    <a href="${href}" target="_blank" style="${font} display: inline-block; padding: 16px 36px; font-size: 16px; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none; border-radius: 10px;">
                      Confirm email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="${font} margin: 0 0 32px; font-size: 13px; line-height: 1.6; color: #64748b;">
                This link works once. If it has expired, sign up again and we'll send a fresh one.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #e2e8f0; font-size: 0; line-height: 0;">&nbsp;</td></tr>
              </table>

              <p style="${font} margin: 28px 0 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #64748b;">Once you're in</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="top" width="28" style="${font} padding: 0 0 14px; font-size: 15px; line-height: 1.6; color: #009fe6; font-weight: 700;">1.</td>
                  <td valign="top" style="${font} padding: 0 0 14px; font-size: 15px; line-height: 1.6; color: #334155;"><strong style="color: #0b1220;">List your inventory.</strong> Trucks, trailers and equipment, with photos and specs, live in minutes.</td>
                </tr>
                <tr>
                  <td valign="top" width="28" style="${font} padding: 0 0 14px; font-size: 15px; line-height: 1.6; color: #009fe6; font-weight: 700;">2.</td>
                  <td valign="top" style="${font} padding: 0 0 14px; font-size: 15px; line-height: 1.6; color: #334155;"><strong style="color: #0b1220;">Capture leads around the clock.</strong> AXLON answers buyers' questions day and night and hands you the lead.</td>
                </tr>
                <tr>
                  <td valign="top" width="28" style="${font} padding: 0 0 8px; font-size: 15px; line-height: 1.6; color: #009fe6; font-weight: 700;">3.</td>
                  <td valign="top" style="${font} padding: 0 0 8px; font-size: 15px; line-height: 1.6; color: #334155;"><strong style="color: #0b1220;">See what's working.</strong> Views, inquiries and sales in one dashboard.</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback link + safety note -->
          <tr>
            <td style="background-color: #ffffff; border-radius: 0 0 14px 14px; padding: 20px 40px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #e2e8f0; font-size: 0; line-height: 0;">&nbsp;</td></tr>
              </table>
              <p style="${font} margin: 24px 0 6px; font-size: 13px; line-height: 1.6; color: #64748b;">Button not working? Paste this link into your browser:</p>
              <p style="margin: 0 0 24px; font-family: Menlo, Consolas, 'Courier New', monospace; font-size: 12px; line-height: 1.6; color: #475569; word-break: break-all;">
                <a href="${href}" target="_blank" style="color: #009fe6; text-decoration: underline;">${escapeHtml(link)}</a>
              </p>
              <p style="${font} margin: 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                Didn't create an account? Someone may have typed your address by mistake. Ignore this email and nothing will happen.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="${font} padding: 24px 16px 0; font-size: 12px; line-height: 1.6; color: #94a3b8;">
              &copy; ${year} AXLON AI<br>
              You received this because this address was used to create an AXLON AI account.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    'Confirm your email',
    '',
    `You're almost in. Confirm this address to finish creating the AXLON AI account for ${companyName.trim()}.`,
    '',
    `Confirm: ${link}`,
    '',
    "This link works once. If it has expired, sign up again and we'll send a fresh one.",
    '',
    "Once you're in:",
    '1. List your inventory. Trucks, trailers and equipment, with photos and specs, live in minutes.',
    "2. Capture leads around the clock. AXLON answers buyers' questions day and night and hands you the lead.",
    "3. See what's working. Views, inquiries and sales in one dashboard.",
    '',
    "Didn't create an account? Someone may have typed your address by mistake. Ignore this email and nothing will happen.",
    '',
    `(c) ${year} AXLON AI`,
  ].join('\n');

  return { subject, html, text };
}

export function scraOutreachEmail({
  companyName,
  contactName,
  serviceCodes,
}: {
  companyName: string;
  contactName?: string;
  serviceCodes?: string[];
}) {
  const greeting = contactName && contactName !== 'Member Get'
    ? `Hi ${escapeHtml(contactName)},`
    : `Hi ${escapeHtml(companyName)} Team,`;

  // Personalize value props based on service codes
  const isTransport = serviceCodes?.some(c => /transport|trucking/i.test(c));
  const isCrane = serviceCodes?.some(c => /crane|rigging|lift/i.test(c));
  const isAllied = serviceCodes?.some(c => /allied|insurance|consult/i.test(c));

  let industryLine = 'the heavy equipment industry';
  if (isCrane) industryLine = 'crane, rigging, and heavy lift companies';
  else if (isTransport) industryLine = 'specialized transportation companies';
  else if (isAllied) industryLine = 'allied service providers in heavy haul and crane';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="${containerStyles} background-color: white; border-radius: 12px;">
          <div style="${headerStyles}">
            <img src="https://axleyard.com/images/email/axlon-mark.png" alt="AXLON AI" width="34" height="40" style="width: 34px; height: 40px;">
          </div>

          <h1 style="font-size: 22px; margin-bottom: 16px; color: #1a1a1a;">
            AI-Powered Tools Built for ${escapeHtml(industryLine)}
          </h1>

          <p>${greeting}</p>

          <p>As a fellow member of the SC&RA community, we wanted to introduce <strong>AXLON AI</strong> — an AI platform purpose-built for ${escapeHtml(industryLine)}.</p>

          <p>We're helping companies like yours save time, capture more leads, and streamline operations with AI:</p>

          <div style="margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 16px; background-color: #f0f9ff; border-radius: 8px; margin-bottom: 8px;">
                  <strong style="color: #0066cc;">AI Equipment Marketplace</strong>
                  <br><span style="color: #666; font-size: 14px;">List & sell trucks, trailers, and heavy equipment with AI-optimized listings</span>
                </td>
              </tr>
              <tr><td style="height: 8px;"></td></tr>
              <tr>
                <td style="padding: 12px 16px; background-color: #f0fdf4; border-radius: 8px;">
                  <strong style="color: #16a34a;">AI-Powered Storefront & Chat</strong>
                  <br><span style="color: #666; font-size: 14px;">Your branded page with an AI assistant that answers customer questions 24/7</span>
                </td>
              </tr>
              <tr><td style="height: 8px;"></td></tr>
              <tr>
                <td style="padding: 12px 16px; background-color: #fef3c7; border-radius: 8px;">
                  <strong style="color: #d97706;">Smart Lead Capture & CRM</strong>
                  <br><span style="color: #666; font-size: 14px;">AI automatically qualifies leads, captures contact info, and tracks your pipeline</span>
                </td>
              </tr>
              <tr><td style="height: 8px;"></td></tr>
              <tr>
                <td style="padding: 12px 16px; background-color: #f5f3ff; border-radius: 8px;">
                  <strong style="color: #7c3aed;">Analytics & Market Intelligence</strong>
                  <br><span style="color: #666; font-size: 14px;">Real-time market data, pricing insights, and performance dashboards</span>
                </td>
              </tr>
            </table>
          </div>

          <p style="text-align: center; margin: 32px 0;">
            <a href="https://axleyard.com/get-started?ref=scra" style="${buttonStyles}">
              Get Started Free
            </a>
          </p>

          <p style="color: #666; font-size: 14px; text-align: center;">
            No credit card required. Set up your AI storefront in under 5 minutes.
          </p>

          <div style="${footerStyles}">
            <p style="margin-bottom: 8px;">
              <a href="https://axleyard.com" style="color: #0066cc; text-decoration: none;">axleyard.com</a>
            </p>
            <p style="font-size: 12px; color: #999;">
              You're receiving this because ${escapeHtml(companyName)} is listed in the SC&RA member directory.
              <br>If you'd prefer not to hear from us, simply reply with "unsubscribe."
            </p>
            <p>&copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function newLeadEmail({
  dealerName,
  buyerName,
  buyerEmail,
  buyerPhone,
  listingTitle,
  message,
  leadsUrl,
}: {
  dealerName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  listingTitle?: string;
  message?: string;
  leadsUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="${containerStyles} background-color: white; border-radius: 12px;">
          <div style="${headerStyles}">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/email/axlon-mark.png" alt="AXLON AI" width="34" height="40" style="width: 34px; height: 40px;">
          </div>

          <div style="background-color: #0066cc; color: white; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <strong>New Lead Received!</strong>
          </div>

          <p>Hi ${escapeHtml(dealerName)},</p>

          <p>You have a new lead${listingTitle ? ` interested in <strong>${escapeHtml(listingTitle)}</strong>` : ''}:</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 100px;">Name:</td>
                <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(buyerName)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${escapeHtml(buyerEmail)}" style="color: #0066cc;">${escapeHtml(buyerEmail)}</a>
                </td>
              </tr>
              ${buyerPhone ? `
              <tr>
                <td style="padding: 8px 0; color: #666;">Phone:</td>
                <td style="padding: 8px 0;">
                  <a href="tel:${escapeHtml(buyerPhone)}" style="color: #0066cc;">${escapeHtml(buyerPhone)}</a>
                </td>
              </tr>
              ` : ''}
            </table>
            ${message ? `
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #ddd;">
              <p style="margin: 0; color: #666; font-size: 14px;">Message:</p>
              <p style="margin: 8px 0 0 0;">"${escapeHtml(message)}"</p>
            </div>
            ` : ''}
          </div>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${sanitizeUrl(leadsUrl)}" style="${buttonStyles}">
              View Lead Details
            </a>
          </p>

          <p style="color: #666; font-size: 14px; text-align: center;">
            Responding within 5 minutes increases conversion by 400%!
          </p>

          <div style="${footerStyles}">
            <p style="font-size: 12px; color: #999;">You can manage notification preferences in your dashboard settings.</p>
            <p>&copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
