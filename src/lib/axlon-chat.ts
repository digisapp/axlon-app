import { useEffect, useSyncExternalStore } from 'react';

/**
 * The one AXLON chat on the marketplace.
 *
 * There is a single floating AXLON (AxlonLauncher, mounted in the root
 * layout). Anything on a page that wants to "talk to AXLON" — the Meet AXLON
 * band, the listing sidebar, a no-results screen — opens that same panel
 * through this store instead of mounting a chat of its own, so a visitor
 * never sees two AXLONs at once and the conversation survives page sections
 * coming and going.
 *
 * Pages can also tell AXLON what the visitor is looking at (a listing), so
 * the chat answers "is this price fair?" about the trailer on screen and can
 * pass the visitor's details to that seller.
 */

export interface AxlonListingContext {
  listingId: string;
  title: string;
  /** profiles.id of the seller; null for scraped inventory nobody has claimed. */
  sellerId: string | null;
  /** The seller's company name, when they have one. */
  sellerName: string | null;
  price: number | null;
}

export interface AxlonChatState {
  open: boolean;
  context: AxlonListingContext | null;
  /** A message to send as soon as the panel is open (e.g. a failed search). */
  pendingMessage: string | null;
}

const SERVER_STATE: AxlonChatState = { open: false, context: null, pendingMessage: null };

let state: AxlonChatState = SERVER_STATE;
const listeners = new Set<() => void>();

function set(next: Partial<AxlonChatState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAxlonChatState(): AxlonChatState {
  return state;
}

/** Open the floating AXLON panel, optionally sending `message` right away. */
export function openAxlonChat(opts?: { message?: string }) {
  const message = opts?.message?.trim();
  set({ open: true, pendingMessage: message || state.pendingMessage });
}

export function closeAxlonChat() {
  set({ open: false });
}

export function setAxlonContext(context: AxlonListingContext | null) {
  if (context === state.context) return;
  set({ context });
}

/** Returns the queued message once, clearing it. */
export function consumePendingMessage(): string | null {
  const message = state.pendingMessage;
  if (message) set({ pendingMessage: null });
  return message;
}

export function useAxlonChat(): AxlonChatState {
  return useSyncExternalStore(subscribe, getAxlonChatState, () => SERVER_STATE);
}

/**
 * Tell AXLON which listing this page is about for as long as it is mounted.
 * The context clears when the visitor navigates away, unless another page
 * has already replaced it.
 */
export function useAxlonListingContext(context: AxlonListingContext) {
  const { listingId, title, sellerId, sellerName, price } = context;
  useEffect(() => {
    const ctx: AxlonListingContext = { listingId, title, sellerId, sellerName, price };
    setAxlonContext(ctx);
    return () => {
      if (getAxlonChatState().context === ctx) setAxlonContext(null);
    };
  }, [listingId, title, sellerId, sellerName, price]);
}

/** Reset — tests only. */
export function _resetAxlonChat() {
  state = SERVER_STATE;
  listeners.forEach((l) => l());
}

/** /api/leads caps the message at this many characters. */
export const LEAD_MESSAGE_MAX = 2000;

/**
 * The lead message the seller reads when a buyer asks AXLON to put them in
 * touch: where it came from, then the conversation so the seller can pick up
 * where AXLON left off. Oldest turns are dropped first to fit the cap.
 */
export function buildChatLeadMessage(
  listingTitle: string,
  turns: Array<{ role: 'user' | 'assistant'; content: string }>
): string {
  const header = `Sent from AXLON chat while viewing "${listingTitle}".`;
  const lines = turns
    .filter((t) => t.content.trim())
    .map((t) => `${t.role === 'user' ? 'Buyer' : 'AXLON'}: ${t.content.trim().replace(/\s+/g, ' ')}`);
  if (lines.length === 0) return header;

  const budget = LEAD_MESSAGE_MAX - header.length - '\n\nConversation:\n'.length;
  const kept: string[] = [];
  let used = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].length > 600 ? `${lines[i].slice(0, 597)}...` : lines[i];
    if (used + line.length + 1 > budget) break;
    kept.unshift(line);
    used += line.length + 1;
  }
  if (kept.length === 0) return header;
  return `${header}\n\nConversation:\n${kept.join('\n')}`;
}
