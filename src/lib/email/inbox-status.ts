/**
 * Is the admin inbox actually able to receive mail?
 *
 * Receiving has never been enabled on axleyard.com or axlon.ai in Resend, so
 * the inbox page said "No inbound emails yet" while nothing could arrive.
 * This asks Resend (read-only) and the environment, and spells out exactly
 * which DNS records / settings are missing, so the admin page can show it.
 */
import { promises as dns } from 'dns';
import { getResendOrNull } from './resend';
import { getAdminFrom, getInboundAddress, getInboundDomain } from './inbound-address';

/** Where Resend must POST. The www host 308s to the bare domain, which Svix counts as failure. */
export function canonicalWebhookUrl(): string {
  // Trimmed: the production value has carried a trailing newline before.
  const base = (process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://axleyard.com').replace(/\/+$/, '');
  return `${base}/api/webhooks/resend`;
}

export interface DnsRecord {
  record: 'DKIM' | 'SPF' | 'Receiving' | string;
  type: 'TXT' | 'MX' | 'CNAME' | string;
  /** Host as you type it at the registrar (relative to the registered zone). */
  host: string;
  value: string;
  priority?: number;
  status: 'verified' | 'pending' | 'failed' | 'not_started' | 'missing' | string;
}

export interface InboxStatus {
  checkedAt: string;
  inboundAddress: string;
  inboundDomain: string;
  /** Registered zone the records go under (axleyard.com for inbound.axleyard.com). */
  zone: string;
  from: string;
  webhookUrl: string;
  env: { resendApiKey: boolean; webhookSecret: boolean; xaiApiKey: boolean };
  domain: {
    found: boolean;
    status: string | null;
    sending: string | null;
    receiving: string | null;
    region: string | null;
    records: DnsRecord[];
  };
  /** What public DNS says right now for the receiving domain's MX. */
  mx: {
    hosts: string[];
    /** An MX on the domain points at Resend's inbound servers. */
    pointsToResend: boolean;
  };
  /** MX is in place and receiving is still off: one click finishes the setup. */
  canEnableReceiving: boolean;
  webhook: {
    found: boolean;
    endpoint: string | null;
    status: string | null;
    events: string[];
    /** Endpoint is exactly the canonical URL. */
    canonical: boolean;
    hasReceivedEvent: boolean;
  };
  /** Everything needed for mail to arrive in /admin/email is in place. */
  ready: boolean;
  /** Human-readable blockers, in the order to fix them. */
  problems: string[];
  error?: string;
}

/** `inbound.axleyard.com` → `axleyard.com`; `axleyard.com` → `axleyard.com`. */
export function registeredZone(domain: string): string {
  const parts = domain.toLowerCase().split('.').filter(Boolean);
  return parts.length <= 2 ? parts.join('.') : parts.slice(-2).join('.');
}

/** Registrar host field for a record under the zone. */
export function zoneHost(name: string, zone: string): string {
  const n = name.trim().toLowerCase().replace(/\.$/, '');
  // Resend names the apex record with an empty string once receiving is on.
  if (!n || n === '@' || n === zone) return '@';
  if (n.endsWith(`.${zone}`)) return n.slice(0, -(zone.length + 1));
  // Resend already returns most names relative to the zone (`resend._domainkey`, `send`).
  return n;
}

/** Resend's inbound MX targets look like `inbound-smtp.<region>.amazonaws.com`. */
export function isResendInboundMx(host: string): boolean {
  return /^inbound-smtp\.[a-z0-9-]+\.amazonaws\.com\.?$/i.test(host.trim());
}

async function lookupMx(domain: string): Promise<string[]> {
  try {
    const records = await dns.resolveMx(domain);
    return records.sort((a, b) => a.priority - b.priority).map((r) => r.exchange.toLowerCase().replace(/\.$/, ''));
  } catch {
    return []; // NXDOMAIN / no MX / resolver hiccup all read as "not there yet"
  }
}

let cache: { at: number; value: InboxStatus } | null = null;
const CACHE_MS = 30_000;

export async function getInboxStatus(opts: { fresh?: boolean } = {}): Promise<InboxStatus> {
  if (!opts.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;

  const inboundAddress = getInboundAddress();
  const inboundDomain = getInboundDomain(inboundAddress);
  const zone = registeredZone(inboundDomain);
  const webhookUrl = canonicalWebhookUrl();
  const status: InboxStatus = {
    checkedAt: new Date().toISOString(),
    inboundAddress,
    inboundDomain,
    zone,
    from: getAdminFrom(),
    webhookUrl,
    env: {
      resendApiKey: !!process.env.RESEND_API_KEY,
      webhookSecret: !!process.env.RESEND_WEBHOOK_SECRET,
      xaiApiKey: !!process.env.XAI_API_KEY,
    },
    domain: { found: false, status: null, sending: null, receiving: null, region: null, records: [] },
    mx: { hosts: [], pointsToResend: false },
    canEnableReceiving: false,
    webhook: { found: false, endpoint: null, status: null, events: [], canonical: false, hasReceivedEvent: false },
    ready: false,
    problems: [],
  };

  const resend = getResendOrNull();
  if (!resend) {
    status.problems.push('RESEND_API_KEY is not set, so nothing can be sent or received.');
    return status;
  }

  try {
    const [domainsRes, webhooksRes, mxHosts] = await Promise.all([
      resend.domains.list(),
      resend.webhooks.list(),
      lookupMx(inboundDomain),
    ]);
    status.mx = { hosts: mxHosts, pointsToResend: mxHosts.some(isResendInboundMx) };
    if (domainsRes.error) throw new Error(`Resend domains: ${domainsRes.error.message}`);
    if (webhooksRes.error) throw new Error(`Resend webhooks: ${webhooksRes.error.message}`);

    // ── Domain ──
    const summary = domainsRes.data?.data.find((d) => d.name.toLowerCase() === inboundDomain);
    if (summary) {
      const detail = await resend.domains.get(summary.id);
      const d = detail.data;
      const region = d?.region ?? summary.region ?? 'us-east-1';
      status.domain.found = true;
      status.domain.status = d?.status ?? summary.status;
      status.domain.sending = d?.capabilities?.sending ?? summary.capabilities?.sending ?? null;
      status.domain.receiving = d?.capabilities?.receiving ?? summary.capabilities?.receiving ?? null;
      status.domain.region = region;

      const records: DnsRecord[] = (d?.records ?? []).map((r) => ({
        record: r.record,
        type: r.type,
        host: zoneHost(r.name, zone),
        value: r.value,
        priority: 'priority' in r && typeof r.priority === 'number' ? r.priority : undefined,
        status: r.status,
      }));
      // Resend only lists the receiving MX once receiving is switched on;
      // show it regardless so the admin can add all records in one go.
      if (!records.some((r) => r.record === 'Receiving')) {
        records.push({
          record: 'Receiving',
          type: 'MX',
          host: zoneHost(inboundDomain, zone),
          value: `inbound-smtp.${region}.amazonaws.com`,
          priority: 10,
          status: status.domain.receiving === 'enabled' ? 'verified' : 'missing',
        });
      }
      status.domain.records = records;
    }

    // ── Webhook ──
    const hooks = webhooksRes.data?.data ?? [];
    const hostRe = new RegExp(`${zone.replace(/\./g, '\\.')}/api/webhooks/resend$`, 'i');
    const ours = hooks.find((w) => w.endpoint === webhookUrl)
      ?? hooks.find((w) => hostRe.test(w.endpoint))
      ?? hooks.find((w) => w.endpoint.includes(zone));
    if (ours) {
      status.webhook.found = true;
      status.webhook.endpoint = ours.endpoint;
      status.webhook.status = ours.status;
      const events = (ours.events ?? []).map((e) => String(e));
      status.webhook.events = events;
      status.webhook.canonical = ours.endpoint === webhookUrl;
      status.webhook.hasReceivedEvent = events.includes('email.received');
    }
  } catch (err) {
    status.error = err instanceof Error ? err.message : 'Resend check failed';
    status.problems.push(`Could not read Resend configuration: ${status.error}`);
    return status;
  }

  // ── Problems, in fix order ──
  const p = status.problems;
  if (!status.domain.found) {
    p.push(`Add ${inboundDomain} as a domain in Resend (with receiving enabled) and add its DNS records.`);
  } else {
    if (status.domain.status !== 'verified') {
      const failing = status.domain.records.filter((r) => r.record !== 'Receiving' && r.status !== 'verified');
      p.push(`${inboundDomain} is "${status.domain.status}" in Resend — ${failing.length || 'its'} DNS record(s) are missing or unverified.`);
    }
    if (status.domain.receiving !== 'enabled') {
      if (status.mx.pointsToResend) {
        status.canEnableReceiving = true;
        p.push(`The MX record for ${inboundDomain} is in place. Press "Turn on receiving" to finish.`);
      } else if (status.mx.hosts.length > 0) {
        p.push(`${inboundDomain} already has mail going to ${status.mx.hosts.join(', ')}. To receive here, replace that MX with the record below (this stops that mailbox receiving), or use a subdomain such as inbound.${zone} via ADMIN_EMAIL_ADDRESS.`);
      } else {
        p.push(`Add the MX record below for ${inboundDomain} at the registrar. Once it is there, a "Turn on receiving" button appears here.`);
      }
    } else if (!status.mx.pointsToResend) {
      p.push(`Receiving is on in Resend, but the MX record for ${inboundDomain} does not point at Resend yet (DNS can take a few minutes after it is added).`);
    }
  }
  if (!status.webhook.found) {
    p.push(`No Resend webhook points at ${webhookUrl}. Create one for email.received, email.delivered, email.bounced, email.complained, email.failed.`);
  } else {
    if (!status.webhook.canonical) {
      p.push(`Resend webhook endpoint is ${status.webhook.endpoint}; it must be exactly ${webhookUrl} (edit it — don't recreate — so the signing secret stays the same).`);
    }
    if (status.webhook.status !== 'enabled') p.push('The Resend webhook is disabled.');
    if (!status.webhook.hasReceivedEvent) p.push('The Resend webhook does not subscribe to email.received.');
  }
  if (!status.env.webhookSecret) p.push('RESEND_WEBHOOK_SECRET is not set — every webhook call is rejected.');
  if (!status.env.xaiApiKey) p.push('XAI_API_KEY is not set — mail still arrives, but without AI summaries or drafts.');

  status.ready =
    status.domain.found && status.domain.status === 'verified' && status.domain.receiving === 'enabled' && status.mx.pointsToResend &&
    status.webhook.found && status.webhook.canonical && status.webhook.status === 'enabled' && status.webhook.hasReceivedEvent &&
    status.env.webhookSecret;

  cache = { at: Date.now(), value: status };
  return status;
}

/**
 * Switch receiving on for the inbound domain in Resend. Refused until public
 * DNS shows the MX pointing at Resend: enabling it first leaves the domain
 * waiting on a record that is not there, and the same domain sends all of our
 * transactional mail.
 */
export async function enableReceiving(): Promise<{ ok: true; status: InboxStatus } | { ok: false; error: string }> {
  const resend = getResendOrNull();
  if (!resend) return { ok: false, error: 'RESEND_API_KEY is not set' };

  const current = await getInboxStatus({ fresh: true });
  if (!current.domain.found) return { ok: false, error: `${current.inboundDomain} is not a domain in Resend yet` };
  if (current.domain.receiving === 'enabled') return { ok: true, status: current };
  if (!current.mx.pointsToResend) {
    return { ok: false, error: `The MX record for ${current.inboundDomain} does not point at Resend yet. Add it at the registrar first (DNS can take a few minutes).` };
  }

  const list = await resend.domains.list();
  const domain = list.data?.data.find((d) => d.name.toLowerCase() === current.inboundDomain);
  if (!domain) return { ok: false, error: `${current.inboundDomain} is not a domain in Resend yet` };

  const updated = await resend.domains.update({ id: domain.id, capabilities: { receiving: 'enabled' } });
  if (updated.error) return { ok: false, error: updated.error.message };
  // Ask Resend to check the new record now instead of on its own schedule.
  await resend.domains.verify(domain.id).catch(() => null);

  return { ok: true, status: await getInboxStatus({ fresh: true }) };
}
