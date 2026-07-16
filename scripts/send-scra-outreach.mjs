#!/usr/bin/env node

/**
 * SC&RA Outreach Email Campaign
 *
 * Sends personalized outreach emails to scraped SC&RA directory contacts.
 * Uses Resend API with rate limiting to stay within sending limits.
 *
 * Usage:
 *   node scripts/send-scra-outreach.mjs                    # Dry run (default)
 *   node scripts/send-scra-outreach.mjs --send              # Actually send emails
 *   node scripts/send-scra-outreach.mjs --send --limit 50   # Send to first 50
 *   node scripts/send-scra-outreach.mjs --send --resume     # Resume from last progress
 *   node scripts/send-scra-outreach.mjs --preview           # Preview first 5 emails
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load env
dotenv.config({ path: path.join(ROOT, '.env.local') });
dotenv.config({ path: path.join(ROOT, '.env') });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AxlonAI <noreply@axlon.ai>';
const DATA_FILE = path.join(ROOT, 'data', 'scra-directory.json');
const PROGRESS_FILE_SCRAPER = path.join(ROOT, 'data', 'scra-progress.json');
const SEND_PROGRESS_FILE = path.join(ROOT, 'data', 'scra-send-progress.json');

// Rate limiting: Resend free tier = 100/day, 1/sec
const DELAY_BETWEEN_EMAILS_MS = 1500; // 1.5s between emails
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 5000; // 5s pause every 10 emails

// Parse CLI args
const args = process.argv.slice(2);
const SEND_MODE = args.includes('--send');
const PREVIEW_MODE = args.includes('--preview');
const RESUME_MODE = args.includes('--resume');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildEmailHtml({ companyName, contactName, serviceCodes }) {
  const greeting = contactName && contactName !== 'Member Get'
    ? `Hi ${escapeHtml(contactName)},`
    : `Hi ${escapeHtml(companyName)} Team,`;

  const isTransport = serviceCodes?.some(c => /transport|trucking/i.test(c));
  const isCrane = serviceCodes?.some(c => /crane|rigging|lift/i.test(c));
  const isAllied = serviceCodes?.some(c => /allied|insurance|consult/i.test(c));

  let industryLine = 'the heavy equipment industry';
  if (isCrane) industryLine = 'crane, rigging, and heavy lift companies';
  else if (isTransport) industryLine = 'specialized transportation companies';
  else if (isAllied) industryLine = 'allied service providers in heavy haul and crane';

  const buttonStyles = `display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;`;
  const baseStyles = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.6;`;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="${baseStyles} background-color: #f5f5f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: white; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="https://axleyard.com/images/axlonai-logo.png" alt="AxlonAI" height="40" style="height: 40px;">
      </div>

      <h1 style="font-size: 22px; margin-bottom: 16px; color: #1a1a1a;">
        AI-Powered Tools Built for ${escapeHtml(industryLine)}
      </h1>

      <p>${greeting}</p>

      <p>As a fellow member of the SC&RA community, we wanted to introduce <strong>AxlonAI</strong> — an AI platform purpose-built for ${escapeHtml(industryLine)}.</p>

      <p>We're helping companies like yours save time, capture more leads, and streamline operations with AI:</p>

      <div style="margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 16px; background-color: #f0f9ff; border-radius: 8px;">
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

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #666; font-size: 14px;">
        <p style="margin-bottom: 8px;">
          <a href="https://axleyard.com" style="color: #0066cc; text-decoration: none;">axleyard.com</a>
        </p>
        <p style="font-size: 12px; color: #999;">
          You're receiving this because ${escapeHtml(companyName)} is listed in the SC&RA member directory.
          <br>If you'd prefer not to hear from us, simply reply with "unsubscribe."
        </p>
        <p>&copy; ${new Date().getFullYear()} AxlonAI. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
}

async function sendViaResend(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Resend error: ${JSON.stringify(data)}`);
  }
  return data;
}

function loadCompanies() {
  // Try final output first, then progress file
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return Array.isArray(data) ? data : data.companies || [];
  }
  if (fs.existsSync(PROGRESS_FILE_SCRAPER)) {
    const data = JSON.parse(fs.readFileSync(PROGRESS_FILE_SCRAPER, 'utf8'));
    return data.companies || [];
  }
  console.error('No SC&RA data file found. Run the scraper first.');
  process.exit(1);
}

function loadSendProgress() {
  if (fs.existsSync(SEND_PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(SEND_PROGRESS_FILE, 'utf8'));
  }
  return { sent: [], failed: [], skipped: [], lastIndex: 0 };
}

function saveSendProgress(progress) {
  fs.writeFileSync(SEND_PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function getContactEmail(company) {
  // Priority: company email > first personnel with email > skip
  if (company.email && company.email.includes('@') && !company.email.includes('scranet.org')) {
    return company.email;
  }

  const personnel = company.personnel || [];
  for (const p of personnel) {
    if (p.email && p.email.includes('@') && !p.email.includes('scranet.org')) {
      return p.email;
    }
  }

  return null;
}

function getContactName(company) {
  const personnel = company.personnel || [];
  for (const p of personnel) {
    if (p.name && p.name !== 'Member Get' && p.name.trim()) {
      return p.name;
    }
  }
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== SC&RA Outreach Email Campaign ===\n');

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not found in environment');
    process.exit(1);
  }

  const companies = loadCompanies();
  console.log(`Loaded ${companies.length} companies from SC&RA directory\n`);

  // Filter to companies with valid emails
  const targets = companies
    .map(c => ({
      ...c,
      targetEmail: getContactEmail(c),
      targetName: getContactName(c),
    }))
    .filter(c => c.targetEmail);

  console.log(`${targets.length} companies have valid email addresses`);
  console.log(`${companies.length - targets.length} companies skipped (no email)\n`);

  // Preview mode
  if (PREVIEW_MODE) {
    console.log('=== PREVIEW MODE (first 5 emails) ===\n');
    for (const t of targets.slice(0, 5)) {
      console.log(`To: ${t.targetEmail}`);
      console.log(`Name: ${t.targetName || '(company team)'}`);
      console.log(`Company: ${t.name}`);
      console.log(`Services: ${(t.service_codes || []).join(', ')}`);
      console.log(`Subject: ${t.name} — AI tools for your team`);
      console.log('---');
    }

    // Write a preview HTML
    const previewTarget = targets[0];
    const previewHtml = buildEmailHtml({
      companyName: previewTarget.name,
      contactName: previewTarget.targetName,
      serviceCodes: previewTarget.service_codes,
    });
    const previewPath = path.join(ROOT, 'data', 'scra-email-preview.html');
    fs.writeFileSync(previewPath, previewHtml);
    console.log(`\nPreview HTML saved to: ${previewPath}`);
    console.log('Open in browser to see the email design.');
    return;
  }

  // Dry run or send
  const progress = RESUME_MODE ? loadSendProgress() : { sent: [], failed: [], skipped: [], lastIndex: 0 };
  const startIdx = RESUME_MODE ? progress.lastIndex : 0;
  const endIdx = Math.min(targets.length, startIdx + LIMIT);

  console.log(`Mode: ${SEND_MODE ? 'SENDING' : 'DRY RUN'}`);
  console.log(`Range: ${startIdx} to ${endIdx - 1} (${endIdx - startIdx} emails)`);
  if (!SEND_MODE) {
    console.log('\nAdd --send flag to actually send emails.\n');
  }
  console.log('');

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = startIdx; i < endIdx; i++) {
    const target = targets[i];
    const subject = `${target.name} — AI tools for your team`;

    // Skip already sent
    if (progress.sent.includes(target.targetEmail)) {
      console.log(`[SKIP] ${target.targetEmail} (already sent)`);
      skipped++;
      continue;
    }

    const html = buildEmailHtml({
      companyName: target.name,
      contactName: target.targetName,
      serviceCodes: target.service_codes,
    });

    if (SEND_MODE) {
      try {
        const result = await sendViaResend(target.targetEmail, subject, html);
        console.log(`[${i + 1}/${endIdx}] SENT to ${target.targetEmail} (${target.name}) — ID: ${result.id}`);
        progress.sent.push(target.targetEmail);
        sent++;
      } catch (err) {
        console.error(`[${i + 1}/${endIdx}] FAILED ${target.targetEmail}: ${err.message}`);
        progress.failed.push({ email: target.targetEmail, error: err.message });
        failed++;
      }

      progress.lastIndex = i + 1;
      saveSendProgress(progress);

      // Rate limiting
      if ((sent + failed) % BATCH_SIZE === 0) {
        console.log(`\n--- Batch pause (${BATCH_DELAY_MS / 1000}s) ---\n`);
        await sleep(BATCH_DELAY_MS);
      } else {
        await sleep(DELAY_BETWEEN_EMAILS_MS);
      }
    } else {
      console.log(`[DRY RUN ${i + 1}/${endIdx}] Would send to: ${target.targetEmail} (${target.name})`);
      sent++;
    }
  }

  console.log('\n=== Campaign Summary ===');
  console.log(`Sent: ${sent}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);

  if (SEND_MODE) {
    console.log(`\nProgress saved to: ${SEND_PROGRESS_FILE}`);
    console.log('Use --send --resume to continue from where you left off.');
  }
}

main().catch(console.error);
