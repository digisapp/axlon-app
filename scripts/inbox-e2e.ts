// End-to-end check of the admin inbox service against the real database and
// Resend, without needing inbound DNS. Run with:
//   npx tsx scripts/inbox-e2e.ts
//
// Sends two real emails to Resend's sink address (delivered@resend.dev),
// simulates the inbound side by calling the same service function the webhook
// calls, exercises every folder / bulk action, and deletes everything it
// created. Safe to re-run.
import { readFileSync } from 'fs';
import { resolve } from 'path';

for (const line of readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8').split('\n')) {
  const m = line.match(/^([^=#]+)=(.*)$/);
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
}

const SINK = 'delivered@resend.dev';
let failures = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}${ok || detail === undefined ? '' : `  → ${JSON.stringify(detail)}`}`);
  if (!ok) failures++;
}

async function main() {
  const { AdminInboxService } = await import('../src/lib/email/admin-inbox');
  const { parseThreadIdFromAddresses, threadReplyAddress } = await import('../src/lib/email/inbound-address');
  const { createAdminClient } = await import('../src/lib/supabase/admin');
  const supabase = createAdminClient();
  const created: string[] = [];
  const tag = `inbox-e2e-${Date.now().toString(36)}`;
  const subject = `[${tag}] 50% off_road (test)`;

  try {
    const { data: admin } = await supabase.from('profiles').select('id').eq('is_admin', true).order('created_at').limit(1).single();
    check('an admin profile exists', !!admin?.id);
    const userId = admin!.id as string;
    const before = await AdminInboxService.getFolderCounts();

    // 1. Compose
    const sent = await AdminInboxService.sendNewEmail({ to: SINK, toName: 'Resend Sink', subject, bodyText: 'First line\n\nSecond <b>paragraph</b> & more', userId, test: true });
    check('compose sends through Resend as the admin From', sent.success, sent);
    if (!sent.success) return;
    created.push(sent.threadId);
    let t = await AdminInboxService.getThread(sent.threadId);
    check('thread starts open, read, with one outbound', t?.thread.status === 'open' && !t.thread.is_unread && t.thread.outbound_count === 1 && t.thread.message_count === 1, t?.thread);
    check('preview comes from the typed text', t?.thread.last_preview === 'First line Second <b>paragraph</b> & more' && t.thread.last_direction === 'outbound', t?.thread.last_preview);
    const out1 = t!.emails[0];
    check('outbound row keeps only what was typed, escaped', out1.html_body?.includes('Second &lt;b&gt;paragraph&lt;/b&gt; &amp; more') === true && !out1.html_body?.includes('<html'), out1.html_body);
    check('outbound Reply-To is the per-thread plus address', out1.reply_to === threadReplyAddress(sent.threadId) && parseThreadIdFromAddresses([out1.reply_to]) === sent.threadId, out1.reply_to);
    check('outbound is flagged as a test', out1.metadata?.test === true);

    // 2. Sent folder + search with LIKE metacharacters
    let list = await AdminInboxService.listThreads({ folder: 'sent', search: tag });
    check('Sent folder lists it; search by subject works', list.threads.some((x) => x.id === sent.threadId) && list.threads.find((x) => x.id === sent.threadId)?.is_test === true);
    list = await AdminInboxService.listThreads({ folder: 'sent', search: '50% off_road (test), or(x' });
    check('search with %, _, parentheses and commas does not throw', Array.isArray(list.threads));
    list = await AdminInboxService.listThreads({ folder: 'inbox', search: tag });
    check('not in Inbox before any reply', !list.threads.some((x) => x.id === sent.threadId));

    // 3. Inbound reply via the plus address (what the webhook does)
    const hint = parseThreadIdFromAddresses([`Axleyard Support <${out1.reply_to}>`]);
    const mid1 = `${tag}-1@mail.example`;
    const in1 = await AdminInboxService.storeInboundEmail({
      from: SINK, fromName: 'Resend Sink', to: out1.reply_to!, subject: `Re: ${subject}`,
      text: null, html: '<style>p{color:red}</style><p>Reply   body &amp; <a href="https://evil.test">link</a></p><script>alert(1)</script>',
      messageId: mid1, threadIdHint: hint, resendEmailId: `${tag}-rx-1`,
      attachments: [{ id: 'att-1', filename: 'spec.pdf', contentType: 'application/pdf', size: 2048 }],
      auth: { spf: 'pass', dkim: 'pass', dmarc: 'pass' },
    });
    check('reply to the plus address lands in the same thread', in1?.thread.id === sent.threadId && in1.isNewThread === false);
    t = await AdminInboxService.getThread(sent.threadId);
    check('thread is now received + unread, preview stripped of CSS/script markup', t?.thread.status === 'received' && t.thread.is_unread && t.thread.last_preview === 'Reply body & link alert(1)', t?.thread);
    const dup = await AdminInboxService.storeInboundEmail({ from: SINK, to: out1.reply_to!, subject: `Re: ${subject}`, text: 'again', messageId: mid1, resendEmailId: `${tag}-rx-1` });
    check('webhook retry of the same message is not stored twice', dup === null);

    list = await AdminInboxService.listThreads({ folder: 'unread', search: tag });
    const row = list.threads.find((x) => x.id === sent.threadId);
    check('Unread folder lists it with the attachment flag', !!row && row.has_attachments === true);
    const counts1 = await AdminInboxService.getFolderCounts();
    check('unread count went up by one', counts1.unread === before.unread + 1, { before, counts1 });
    check('unread badge query agrees', (await AdminInboxService.getUnreadCount()) === counts1.unread);

    // 4. Flags
    await AdminInboxService.markRead(sent.threadId, true);
    t = await AdminInboxService.getThread(sent.threadId);
    check('mark read → read, not unread, emails read', t?.thread.status === 'read' && !t.thread.is_unread && t.emails.every((e) => e.is_read));
    await AdminInboxService.markRead(sent.threadId, false);
    t = await AdminInboxService.getThread(sent.threadId);
    check('mark unread → received + unread', t?.thread.status === 'received' && t.thread.is_unread === true);
    await AdminInboxService.setStar(sent.threadId, true);
    list = await AdminInboxService.listThreads({ folder: 'starred', search: tag });
    check('Starred folder lists it', list.threads.some((x) => x.id === sent.threadId));
    await AdminInboxService.setSpam(sent.threadId, true);
    const [inboxL, spamL, starL, sentL] = await Promise.all([
      AdminInboxService.listThreads({ folder: 'inbox', search: tag }), AdminInboxService.listThreads({ folder: 'spam', search: tag }),
      AdminInboxService.listThreads({ folder: 'starred', search: tag }), AdminInboxService.listThreads({ folder: 'sent', search: tag }),
    ]);
    check('spam moves it out of Inbox, Starred and Sent into Spam', !inboxL.threads.length && spamL.threads.length === 1 && !starL.threads.length && !sentL.threads.length);
    await AdminInboxService.bulk('notSpam', [sent.threadId]);
    await AdminInboxService.bulk('unstar', [sent.threadId]);
    await AdminInboxService.bulk('markUnread', [sent.threadId]);
    list = await AdminInboxService.listThreads({ folder: 'inbox', search: tag });
    check('not spam brings it back to Inbox', list.threads.some((x) => x.id === sent.threadId));

    // 5. Reply from the inbox
    const reply = await AdminInboxService.sendNewEmail({ bodyText: 'Thanks, here is the answer.', replyToThreadId: sent.threadId, userId });
    check('reply sends', reply.success, reply);
    t = await AdminInboxService.getThread(sent.threadId);
    const out2 = t!.emails[t!.emails.length - 1];
    const h = (out2.headers || {}) as Record<string, string>;
    check('reply threads on the inbound Message-ID', h['In-Reply-To'] === `<${mid1}>` && h['References'] === `<${mid1}>`, h);
    check('reply without an explicit subject gets Re: + the thread subject', out2.subject === `Re: ${subject}`, out2.subject);
    check('thread is replied + read; inbound marked replied', t?.thread.status === 'replied' && !t.thread.is_unread && t.emails.filter((e) => e.direction === 'inbound').every((e) => e.status === 'replied' && !!e.replied_at), t?.thread);
    check('thread counts: 3 messages, 2 outbound', t?.thread.message_count === 3 && t.thread.outbound_count === 2);

    // 6. Fallback threading: References, then sender + subject
    const in2 = await AdminInboxService.storeInboundEmail({ from: SINK, to: 'support@axleyard.com', subject: 'Totally different subject', text: 'via references', messageId: `${tag}-2@mail.example`, references: `<unknown@x> <${mid1}>`, resendEmailId: `${tag}-rx-2` });
    check('References header finds the thread without the plus address', in2?.thread.id === sent.threadId);
    const in3 = await AdminInboxService.storeInboundEmail({ from: SINK, to: 'support@axleyard.com', subject: `RE: Re: ${subject}`, text: 'via subject', messageId: `${tag}-3@mail.example`, resendEmailId: `${tag}-rx-3` });
    check('same sender + normalized subject finds the thread', in3?.thread.id === sent.threadId);
    const in4 = await AdminInboxService.storeInboundEmail({ from: `stranger-${tag}@example.net`, fromName: 'Stranger', to: 'sales@axleyard.com', subject: `Re: ${subject}`, text: 'someone else, same subject', messageId: `${tag}-4@mail.example`, resendEmailId: `${tag}-rx-4`, spam: true, threadIdHint: '00000000-0000-4000-8000-000000000000' });
    if (in4) created.push(in4.thread.id);
    check('a different sender never joins the thread, a bogus plus tag is ignored, spam is filed', !!in4 && in4.isNewThread && in4.thread.id !== sent.threadId && in4.thread.is_spam === true);
    const countsSpam = await AdminInboxService.getFolderCounts();
    check('spam count went up by one; spam is not counted unread', countsSpam.spam === before.spam + 1 && countsSpam.unread === before.unread + 1, { before, countsSpam });

    // 7. Delivery statuses only move forward
    if (reply.success && reply.resendId) {
      await AdminInboxService.updateDeliveryStatus(reply.resendId, 'opened');
      const rcpt = await AdminInboxService.updateDeliveryStatus(reply.resendId, 'delivered');
      const e = await AdminInboxService.getEmail(reply.emailId!);
      check('a late "delivered" does not overwrite "opened"; recipients still reported', e?.status === 'opened' && rcpt[0] === SINK, { status: e?.status, rcpt });
      await AdminInboxService.updateDeliveryStatus(reply.resendId, 'bounced');
      check('a bounce always wins', (await AdminInboxService.getEmail(reply.emailId!))?.status === 'bounced');
      check('delivery events never touch inbound rows', (await AdminInboxService.updateDeliveryStatus(`${tag}-rx-1`, 'delivered')).length === 0 && (await AdminInboxService.getEmail(in1!.email.id))?.status === 'replied');
    }

    // 8. Settings
    const setting = await AdminInboxService.getSetting('ai_auto_reply_enabled');
    check('auto-reply setting reads as a boolean', typeof setting === 'boolean', setting);
    console.log(`       (ai_auto_reply_enabled is currently ${setting})`);
  } finally {
    // 9. Clean up everything this run created
    if (created.length) {
      await AdminInboxService.bulk('delete', created);
      const { count } = await supabase.from('emails').select('id', { count: 'exact', head: true }).in('thread_id', created);
      const { count: tc } = await supabase.from('email_threads').select('id', { count: 'exact', head: true }).in('id', created);
      check('cleanup removed the test threads and their emails', (count ?? 0) === 0 && (tc ?? 0) === 0, { count, tc });
    }
  }
  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => { console.error(err); process.exit(1); });
