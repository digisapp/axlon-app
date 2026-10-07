import { describe, it, expect, beforeEach } from 'vitest';
import {
  _resetAxlonChat,
  buildChatLeadMessage,
  closeAxlonChat,
  consumePendingMessage,
  getAxlonChatState,
  LEAD_MESSAGE_MAX,
  openAxlonChat,
  setAxlonContext,
} from '@/lib/axlon-chat';

describe('axlon chat store', () => {
  beforeEach(() => _resetAxlonChat());

  it('opens and closes', () => {
    expect(getAxlonChatState().open).toBe(false);
    openAxlonChat();
    expect(getAxlonChatState().open).toBe(true);
    closeAxlonChat();
    expect(getAxlonChatState().open).toBe(false);
  });

  it('queues a message that is handed over exactly once', () => {
    openAxlonChat({ message: '  Help me find 55 ton lowboy  ' });
    expect(getAxlonChatState().pendingMessage).toBe('Help me find 55 ton lowboy');
    expect(consumePendingMessage()).toBe('Help me find 55 ton lowboy');
    expect(consumePendingMessage()).toBeNull();
  });

  it('keeps a queued message when reopened without one', () => {
    openAxlonChat({ message: 'first' });
    openAxlonChat();
    expect(getAxlonChatState().pendingMessage).toBe('first');
  });

  it('holds the listing the visitor is viewing', () => {
    const ctx = { listingId: 'a', title: 'T', sellerId: null, sellerName: null, price: 1 };
    setAxlonContext(ctx);
    expect(getAxlonChatState().context).toBe(ctx);
    setAxlonContext(null);
    expect(getAxlonChatState().context).toBeNull();
  });
});

describe('buildChatLeadMessage', () => {
  it('says where the lead came from and includes the conversation', () => {
    const msg = buildChatLeadMessage('2019 Trail King TK110', [
      { role: 'user', content: 'Is the price fair?' },
      { role: 'assistant', content: 'It sits about 8% below the market estimate.' },
    ]);
    expect(msg).toContain('AXLON chat');
    expect(msg).toContain('"2019 Trail King TK110"');
    expect(msg).toContain('Buyer: Is the price fair?');
    expect(msg).toContain('AXLON: It sits about 8% below');
  });

  it('drops the oldest turns to stay under the /api/leads cap', () => {
    const turns = Array.from({ length: 40 }, (_, i) => ({
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: `turn ${i} ${'x'.repeat(150)}`,
    }));
    const msg = buildChatLeadMessage('Listing', turns);
    expect(msg.length).toBeLessThanOrEqual(LEAD_MESSAGE_MAX);
    expect(msg).toContain('turn 39');
    expect(msg).not.toContain('turn 0 ');
  });

  it('works with no conversation yet', () => {
    expect(buildChatLeadMessage('Listing', [])).toBe('Sent from AXLON chat while viewing "Listing".');
  });
});
