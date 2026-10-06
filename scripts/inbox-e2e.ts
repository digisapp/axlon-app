// End-to-end check of the admin inbox service against the real database and
// Resend, including leads (written into the inbox, linked, contacted on
// reply), without needing inbound DNS. Run with:
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
  const createdLeads: string[] = [];
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
    check('thread is now received + unread, preview stripped of CSS/script markup', t?.thread.status === 'received' && t.thread.is_unread && t.thread.last_preview === 'Reply body & link', t?.thread);
    const dup = await AdminInboxService.storeInboundEmail({ from: SINK, to: out1.reply_to!, subject: `Re: ${subject}`, text: 'again', messageId: mid1, resendEmailId: `${tag}-rx-1` });
    check('webhook retry of the same message is not stored twice', dup === null);
    const { error: uniqueError } = await supabase.from('emails').insert({ thread_id: sent.threadId, resend_id: `${tag}-rx-1`, direction: 'inbound', from_email: SINK, to_email: 'support@axleyard.com', subject: 'dup', status: 'received' });
    check('the database itself refuses a second inbound row for one Resend id', uniqueError?.code === '23505', uniqueError);

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
    list = await AdminInboxService.listThreads({ folder: 'inbox', search: SINK });
    check('not spam brings it back to Inbox; search by full address works', list.threads.some((x) => x.id === sent.threadId));
    // Leave it opened-and-read, the state a thread is in when an admin answers it.
    await AdminInboxService.markRead(sent.threadId, true);

    // 5. Reply from the inbox
    const reply = await AdminInboxService.sendNewEmail({ bodyText: 'Thanks, here is the answer.', replyToThreadId: sent.threadId, userId });
    check('reply sends', reply.success, reply);
    t = await AdminInboxService.getThread(sent.threadId);
    const out2 = t!.emails[t!.emails.length - 1];
    const h = (out2.headers || {}) as Record<string, string>;
    check('reply threads on the inbound Message-ID', h['In-Reply-To'] === `<${mid1}>` && h['References'] === `<${mid1}>`, h);
    check('reply without an explicit subject gets Re: + the thread subject', out2.subject === `Re: ${subject}`, out2.subject);
    check('answering an opened (read) thread marks it replied; inbound marked replied', t?.thread.status === 'replied' && !t.thread.is_unread && t.emails.filter((e) => e.direction === 'inbound').every((e) => e.status === 'replied' && !!e.replied_at), t?.thread);
    check('thread counts: 3 messages, 2 outbound', t?.thread.message_count === 3 && t.thread.outbound_count === 2);

    // 6. Fallback threading: References, then sender + subject
    const in2 = await AdminInboxService.storeInboundEmail({ from: SINK, to: 'support@axleyard.com', subject: 'Totally different subject', text: 'via references', messageId: `${tag}-2@mail.example`, references: `<unknown@x> <${mid1}>`, resendEmailId: `${tag}-rx-2` });
    check('References header finds the thread without the plus address', in2?.thread.id === sent.threadId);
    const in3 = await AdminInboxService.storeInboundEmail({ from: SINK, to: 'support@axleyard.com', subject: `RE: Re: ${subject}`, text: 'via subject', messageId: `${tag}-3@mail.example`, resendEmailId: `${tag}-rx-3` });
    check('same sender + normalized subject finds the thread', in3?.thread.id === sent.threadId);
    // The stranger uses the thread's REAL plus tag and quotes its Message-ID: still must not join.
    const in4 = await AdminInboxService.storeInboundEmail({ from: `stranger-${tag}@example.net`, fromName: 'Stranger', to: out1.reply_to!, subject: `Re: ${subject}`, text: 'someone else, same subject', messageId: `${tag}-4@mail.example`, inReplyTo: mid1, references: `<${mid1}>`, resendEmailId: `${tag}-rx-4`, spam: true, threadIdHint: sent.threadId });
    if (in4) created.push(in4.thread.id);
    check('a different sender never joins the thread, even with its real plus tag and Message-ID; spam is filed', !!in4 && in4.isNewThread && in4.thread.id !== sent.threadId && in4.thread.is_spam === true);
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

    // 9. Leads: a platform lead becomes a conversation; replying contacts it
    const { recordLeadInInbox, loadLeadContext } = await import('../src/lib/email/lead-inbox');
    const { setLeadStatus } = await import('../src/lib/email/lead-link');
    const buyer = `delivered+${tag}@resend.dev`;
    const { data: platformLead, error: leadErr } = await supabase
      .from('leads')
      .insert({ buyer_name: 'jim walker', buyer_email: buyer, buyer_phone: '469-555-0142', message: `Is the lowboy still available? (${tag})`, source: 'website', status: 'new', priority: 'medium' })
      .select('id')
      .single();
    check('test lead created', !leadErr && !!platformLead, leadErr);
    if (platformLead) createdLeads.push(platformLead.id);
    const leadThreadId = platformLead ? await recordLeadInInbox(platformLead.id, { draft: false }) : null;
    if (leadThreadId) created.push(leadThreadId);
    check('a platform lead becomes a conversation', !!leadThreadId);
    check('recording it again is a no-op (same conversation)', !!leadThreadId && (await recordLeadInInbox(platformLead!.id, { draft: false })) === leadThreadId);
    let lt = leadThreadId ? await AdminInboxService.getThread(leadThreadId) : null;
    const alert = lt?.emails[0];
    check('it is unread, linked to the lead, from the buyer, flagged as a lead alert', !!lt && lt.thread.is_unread && lt.thread.lead_id === platformLead?.id && lt.thread.participant_email === buyer && alert?.metadata?.kind === 'lead_alert', lt?.thread);
    check('the preview leads with their own words', lt?.thread.last_preview?.startsWith('Is the lowboy still available?') === true, lt?.thread.last_preview);
    list = await AdminInboxService.listThreads({ folder: 'unread', search: tag });
    const leadRow = list.threads.find((x) => x.id === leadThreadId);
    check('Unread lists it as a new lead', !!leadRow && leadRow.is_lead_alert && leadRow.lead_status === 'new', leadRow);
    const ctx = platformLead ? await loadLeadContext(platformLead.id) : null;
    check('the lead card has their name, phone, status and source', ctx?.name === 'jim walker' && ctx.phone === '469-555-0142' && ctx.status === 'new' && ctx.sourceLabel === 'Website', ctx);

    const pdf = { filename: 'spec-sheet.txt', contentType: 'text/plain', content: Buffer.from(`Spec sheet ${tag}`).toString('base64') };
    const leadReply = leadThreadId
      ? await AdminInboxService.sendNewEmail({ bodyText: 'Hi Jim,\n\nYes, it is. When can you come and see it?\n\nBest,\nThe Axleyard Team', replyToThreadId: leadThreadId, userId, attachments: [pdf] })
      : null;
    check('replying to the lead sends, with an attachment', !!leadReply?.success, leadReply);
    lt = leadThreadId ? await AdminInboxService.getThread(leadThreadId) : null;
    const sentRow = lt?.emails[lt.emails.length - 1];
    check('the sent row records the attachment as sent, and the reply subject reads "Re: <their inquiry>"', sentRow?.attachments?.[0]?.filename === 'spec-sheet.txt' && sentRow.attachments[0].sent === true && /^Re: /.test(sentRow.subject), { attachments: sentRow?.attachments, subject: sentRow?.subject });
    const afterReply = platformLead ? await loadLeadContext(platformLead.id) : null;
    check('replying moved the lead from new to contacted', afterReply?.status === 'contacted', afterReply?.status);
    check('and the conversation is read', lt?.thread.is_unread === false);
    if (leadReply?.success && leadReply.resendId) {
      const { Resend } = await import('resend');
      const resendClient = new Resend(process.env.RESEND_API_KEY);
      let sentHtml = '';
      for (let i = 0; i < 6 && !sentHtml; i++) {
        const got = await resendClient.emails.get(leadReply.resendId);
        sentHtml = (got.data as { html?: string } | null)?.html || '';
        if (!sentHtml) await new Promise((r) => setTimeout(r, 1500));
      }
      check('the mail quotes what they wrote, not our details block, as plain cite text', sentHtml.includes('blockquote type="cite"') && sentHtml.includes('Is the lowboy still available?') && !sentHtml.includes('Phone: 469') && !/<h1|unsubscribe/i.test(sentHtml), sentHtml.slice(0, 300));
    }

    // Their answer to the plus address joins the same conversation, still linked.
    const leadIn = leadThreadId
      ? await AdminInboxService.storeInboundEmail({ from: buyer, fromName: 'Jim Walker', to: threadReplyAddress(leadThreadId), subject: `Re: ${lt!.thread.subject}`, text: 'Thursday at 2?', messageId: `${tag}-lead@mail.example`, threadIdHint: leadThreadId, resendEmailId: `${tag}-rx-lead` })
      : null;
    check('their reply lands in the same conversation, still linked to the lead', leadIn?.thread.id === leadThreadId && leadIn.thread.lead_id === platformLead?.id);
    const moved = platformLead ? await setLeadStatus(platformLead.id, 'qualified') : false;
    list = await AdminInboxService.listThreads({ folder: 'inbox', search: tag });
    check('the lead card can move the status; the list shows it', moved && list.threads.find((x) => x.id === leadThreadId)?.lead_status === 'qualified');
    lt = leadThreadId ? await AdminInboxService.getThread(leadThreadId) : null;
    check('a real reply stays unread even after the lead moves past new', lt?.thread.is_unread === true);

    // A brand-new address that already filled in a form is linked on first email.
    const { data: lead2 } = await supabase.from('leads').insert({ buyer_name: 'Ann', buyer_email: `delivered+${tag}-ann@resend.dev`, source: 'microsite', status: 'new' }).select('id').single();
    if (lead2) createdLeads.push(lead2.id);
    const annMail = await AdminInboxService.storeInboundEmail({ from: `DELIVERED+${tag}-ANN@resend.dev`, to: 'support@axleyard.com', subject: 'Question', text: 'Hi', messageId: `${tag}-ann@mail.example`, resendEmailId: `${tag}-rx-ann` });
    if (annMail) created.push(annMail.thread.id);
    check('an email from someone who filled in a form is linked to their lead (case-insensitive)', annMail?.thread.lead_id === lead2?.id, annMail?.thread.lead_id);

    // A dealer's lead never comes into the admin inbox.
    const { data: dealer } = await supabase.from('profiles').select('id').eq('is_admin', false).not('id', 'is', null).limit(1).single();
    const { data: dealerLead } = dealer
      ? await supabase.from('leads').insert({ user_id: dealer.id, buyer_name: 'Dealer Buyer', buyer_email: `delivered+${tag}-dealer@resend.dev`, source: 'contact_form', status: 'new' }).select('id').single()
      : { data: null };
    if (dealerLead) createdLeads.push(dealerLead.id);
    check("a dealer's lead is not written into the admin inbox", !!dealerLead && (await recordLeadInInbox(dealerLead.id, { draft: false })) === null);
    check("and its details are not shown on a lead card", !!dealerLead && (await loadLeadContext(dealerLead.id)) === null);
  } finally {
    // 10. Clean up everything this run created
    if (createdLeads.length) {
      await supabase.from('leads').delete().in('id', createdLeads);
      const { count: lc } = await supabase.from('leads').select('id', { count: 'exact', head: true }).in('id', createdLeads);
      check('cleanup removed the test leads', (lc ?? 0) === 0, { lc });
    }
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
