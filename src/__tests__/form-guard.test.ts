import { describe, expect, it } from 'vitest';
import { autoMailBlockedReason, botSignals, isDottedGmail, looksLikeRandomCompany, MIN_FILL_MS } from '@/lib/leads/form-guard';

describe('botSignals', () => {
  const now = 1_700_000_000_000;

  it('lets a person through', () => {
    expect(botSignals({ name: 'Jim Walker', message: 'Is the 55-ton lowboy still available?', honeypot: '', startedAt: now - 45_000, now })).toEqual([]);
    // No timing info at all (an old client) is not held against them.
    expect(botSignals({ name: 'Dana Reyes', message: 'Call me about the step deck.' })).toEqual([]);
  });

  it('catches the bot signature seen on the contact form', () => {
    const reasons = botSignals({ name: 'gdlOIndfiDUtAdyoidSyq', message: '4830192837', honeypot: '', startedAt: now - 900, now });
    expect(reasons).toContain('random-looking name');
    expect(reasons).toContain('message is only a number');
    expect(reasons.some((r) => r.startsWith('filled in'))).toBe(true);
  });

  it('treats a filled honeypot or an instant submit as a bot on its own', () => {
    expect(botSignals({ name: 'Jim Walker', message: 'Hello', honeypot: 'http://x', startedAt: now - 60_000, now })).toEqual(['honeypot filled']);
    expect(botSignals({ name: 'Jim Walker', message: 'Hello', startedAt: now - (MIN_FILL_MS - 1), now })).toHaveLength(1);
    expect(botSignals({ name: 'Jim Walker', message: 'Hello', startedAt: now + 5_000, now })).toEqual(['filled in 0 ms']);
  });

  it('does not flag ordinary names or messages', () => {
    for (const name of ['DeShawn McAllister', 'TJ', "O'Brien-Smith", 'José María López', 'JimWalker']) {
      expect(botSignals({ name, message: 'Hi there' })).toEqual([]);
    }
    expect(botSignals({ name: 'Jim', message: 'Call me at 469-555-0142 about unit 12' })).toEqual([]);
  });
});

describe('looksLikeRandomCompany', () => {
  // The company names bots gave the signup form between 2026-09-22 and 10-05.
  const BOT_NAMES = [
    'Qgnbxxwroa LLC', 'Ydvzupkfb LLC', 'Qsrkfxkfkv LLC', 'Cxfcvvny LLC', 'Cjryopx LLC',
    'Cpaofx LLC', 'Ilcoacpv LLC', 'Hscrglmxqj LLC', 'Oqxebrqz LLC', 'Vfhqrrto LLC',
    'Qvqcyoz LLC', 'Gjtod LLC', 'Dlcxk LLC', 'Zuhlopvsck LLC', 'Kunqzdm LLC',
    'Qniuzftmox LLC', 'Uztsrbqo LLC', 'Hmwvzolpdx LLC', 'Glybanhtxj LLC', 'Yvcdjcbrr LLC',
  ];
  // Names it is allowed to miss (short, or vowel-rich enough to pass as a word).
  const BOT_NAMES_MISSED = ['Innlsd LLC', 'Olmvu LLC', 'Hetibrwc LLC', 'Arszf LLC', 'Abtdrruoaz LLC', 'Uglkutdgwr LLC'];

  it('catches the random company names the signup bots use', () => {
    for (const name of BOT_NAMES) expect(looksLikeRandomCompany(name), name).toBe(true);
    // Documented misses: the honeypot and fill time are expected to catch these.
    expect(BOT_NAMES_MISSED.filter(looksLikeRandomCompany)).toEqual([]);
  });

  it('passes real dealers, brands, hard surnames and ordinary words', () => {
    const real = [
      'Blyth Trailer Sales', 'Pinnacle Truck & Trailer', 'J & B Pavelka, Inc.', 'AXE Trailers',
      'Trail King', 'Fontaine', 'Talbert', 'XL Specialized', 'Pitts', 'Eager Beaver', 'Kaufman',
      'Witzco', 'Globe', 'Etnyre', 'Landoll', 'Faymonville', 'Loadstar', 'Goldhofer', 'Kalyn Siebert',
      'Brandt', 'Doolittle', 'Felling', 'Nooteboom', 'Broshuis', 'Scheuerle', 'Kassbohrer',
      'Schmidt Trailers', 'Schwartz Equipment', 'Krzyzewski Hauling', 'Przybylski Transport',
      'Nguyen Trucking', 'Dvorak & Sons', 'Stoltzfus Trailer Sales', 'Szczepanski Logistics',
      'Pszczola LLC', 'Mkrtchyan Freight', 'Zhvania Group', 'Lightfoot Lowboys', 'Knight Transport',
      'Lynch Trailers', 'Church Equipment', 'Pfeiffer GmbH', 'Strzelecki Inc', 'Hochstetler Trailers',
      'Fitzgerald Heavy Haul', 'Wyckoff Trailer', 'Zwick Industries', 'Fjord Transport', 'Kjell Hauling',
      'McGriff Insurance', 'VoltSwitchGPS', 'WestCoastGPS', 'Matchstick Trailers', 'Witchcraft Welding',
      'Spendthrift Haulers', 'Nightdress Co', 'Strengths LLC', 'H.Newman Capital', 'Innlsd LLC',
      'IPS Contractor', 'Hale Trailer Brake & Wheel', 'Interstate Trailers', 'Load King', 'Big Tex Trailers',
      'B&W Trailer Hitches', 'ATC', 'XL', '4 Rivers Equipment', '',
    ];
    expect(real.filter(looksLikeRandomCompany)).toEqual([]);
  });
});

describe('isDottedGmail', () => {
  it('flags only gmail addresses written with three or more dots', () => {
    expect(isDottedGmail('og.o.p.o.c.osa78@gmail.com')).toBe(true);
    expect(isDottedGmail('F.U.DD4.1.3.3.9@GMAIL.COM')).toBe(true);
    expect(isDottedGmail('a.h.k.nu.d.s.o.n@googlemail.com')).toBe(true);
    expect(isDottedGmail('john.smith@gmail.com')).toBe(false);
    expect(isDottedGmail('j.r.ewing@gmail.com')).toBe(false);
    expect(isDottedGmail('a.b.c.d@example.com')).toBe(false);
    expect(isDottedGmail('')).toBe(false);
    expect(isDottedGmail('not-an-address')).toBe(false);
  });
});

describe('botSignals on the signup form', () => {
  it('reports a random company or a dotted gmail address, and nothing for a dealer', () => {
    expect(botSignals({ name: '', message: '', company: 'Qgnbxxwroa LLC', email: 'eriks@example.com' })).toEqual(['random-looking company']);
    expect(botSignals({ name: '', message: '', company: 'Olmvu LLC', email: 'x.imuf.i.ha.b.u9.0@gmail.com' })).toEqual(['dotted gmail address']);
    expect(botSignals({ name: '', message: '', company: 'Blyth Trailer Sales', email: 'charlie@blythtrailer.com' })).toEqual([]);
  });
});

describe('autoMailBlockedReason', () => {
  it('never mails machines, SMS gateways, or back a link', () => {
    expect(autoMailBlockedReason('jim@example.com', 'Is it available?')).toBeNull();
    expect(autoMailBlockedReason('no-reply@bank.example')).toBe('automated address');
    expect(autoMailBlockedReason('subpoenainquiries@valvesoftware.com')).toBe('automated address');
    expect(autoMailBlockedReason('5551234567@vtext.com')).toBe('SMS gateway address');
    expect(autoMailBlockedReason('jim@example.com', 'see https://evil.test/claim')).toBe('message contains a link');
    expect(autoMailBlockedReason('not-an-address')).toBe('no address');
  });
});
