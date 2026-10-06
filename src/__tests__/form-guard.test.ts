import { describe, expect, it } from 'vitest';
import {
  autoMailBlockedReason,
  botSignals,
  canonicalEmail,
  isDottedGmail,
  looksLikeRandomCompany,
  looksLikeRandomText,
  MIN_FILL_MS,
} from '@/lib/leads/form-guard';

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

  it('catches the bot signature seen on the listing inquiry form', () => {
    const reasons = botSignals({ name: 'Vzxwnz Gsfqlp', message: 'WgBTDDJvBnXCBqeY', email: 'x.imuf.i.ha.b.u9.0@gmail.com' });
    expect(reasons).toContain('random-looking name');
    expect(reasons).toContain('random-looking message');
    expect(reasons).toContain('dotted gmail address');
  });

  it('treats a filled honeypot or an instant submit as a bot on its own', () => {
    expect(botSignals({ name: 'Jim Walker', message: 'Hello', honeypot: 'http://x', startedAt: now - 60_000, now })).toEqual(['honeypot filled']);
    expect(botSignals({ name: 'Jim Walker', message: 'Hello', startedAt: now - (MIN_FILL_MS - 1), now })).toHaveLength(1);
    expect(botSignals({ name: 'Jim Walker', message: 'Hello', startedAt: now + 5_000, now })).toEqual(['filled in 0 ms']);
  });

  it('does not flag ordinary names', () => {
    const people = [
      'DeShawn McAllister', 'TJ', "O'Brien-Smith", 'José María López', 'JimWalker', 'Wojciech Szczepanski',
      'Krzysztof Przybylski', 'Nguyen Thi Minh', 'Dmitry Zhvania', 'Hrafnkell Jónsson', 'Bartholomew Pfeiffer',
      'Mkrtchyan', 'Nkemelu Okafor', 'Thabo Mbeki', 'Ng Wai', 'Vladyslav Dvorak', 'Ptolemy Knightley',
      'Gwendolyn Llewellyn', 'Rhys Wyckoff', 'Strzelecki', 'Tchaikovsky', 'Schwartz', 'Stoltzfus',
      'Krzyzewski', 'Hochstetler', 'Fitzgerald', 'Zwick', 'Kjell Fjeldstad', 'Lightfoot', 'Matchstick',
    ];
    for (const name of people) expect(botSignals({ name, message: 'Hi there' }), name).toEqual([]);
  });

  it('does not flag ordinary messages, short or long', () => {
    const messages = [
      'Call me at 469-555-0142 about unit 12',
      'Talbert 55SA?',
      'Price?',
      'Kalyn Siebert',
      'Goldhofer THP/SL',
      'Dorsey XL70HDG lowboy',
      'Nooteboom lowboy',
      'Kässbohrer available?',
      'Krzyzewski Hauling here',
      'Still available',
      'Is it still available? We are in Szczecin and can pick up.',
    ];
    for (const message of messages) expect(botSignals({ name: 'Jim', message }), message).toEqual([]);
  });
});

/**
 * Every bot submission that reached the database between 2026-09-22 and
 * 2026-10-05: 34 contact-form rows (demo requests, "AI Transformation
 * Applications", storefront claims) and 4 listing inquiries. Each must trip
 * the guard on its content alone — no honeypot, no timing — because a bot
 * posting straight to the API sends neither.
 */
describe('botSignals against every bot row seen in production', () => {
  const APPLICATION = 'AI TRANSFORMATION APPLICATION\n\nBusiness Type: Heavy Haul / Lowboy Carrier\nCompany Size: 1–10 employees\nAnnual Revenue: Under $1M\nBiggest Pain: Dispatch & load coordination\nDecision Maker: No — I will involve my partner/investor\nOpen to 12-Month Commitment: Need to learn more first\n\nPhone: 8171842143';

  const CONTACT_ROWS: Array<[name: string, company: string, email: string, message: string]> = [
    ['gdlOIndfiDUtAdyoidSyq', 'Ummyaaf LLC', 'og.o.p.o.c.osa78@gmail.com', '3272245561'],
    ['vuJhiCIXozRFjEreqB', 'Qqodjnrfah LLC', 'sar.i.a.hmus.a.a@gmail.com', '9260716869'],
    ['IqxJmXwDOLkfrzbAOr', 'Oxidc LLC', 'swagner@wickerproperties.com', '2332272704'],
    ['rzURDrfTUFplkKpnGTiAOtuj', 'Euklunkyc LLC', 'salwiczek@web.de', '5720669947'],
    ['bRyNkLktqAodtKIEPIGvE', 'Ydmmpfly LLC', 'bwalsh-1@outlook.com', '2468421174'],
    ['HsvKGkwbZjIzPSnIruhUk', 'Hmlrqzje LLC', 'yasergrafa@icloud.com', '9935606690'],
    ['eoSETnmWCoHnWBiLjBU', 'Nxebbtndnv LLC', 'robert.caughron@comcast.net', '6007746436'],
    ['RZrcmdyozcLEhMBIibl', 'Hiugjh LLC', 'sarah.bodenburg@mecklenburgische.de', '6652798304'],
    ['XGZfRmRQozKZlHcuwHoHKJr', 'Sdgjszd LLC', 'airavani@dillon.ca', '6149235629'],
    ['ddxtIffDZgzQjZEDcdrwRD', 'Zenvwtt LLC', 'thood@killamreit.com', '8380379307'],
    ['mBSUNzHfWXARAfLxmMt', 'Icxrjev LLC', 'stiru@theshawgrp.com', '9470982477'],
    ['yNTdZFIrMzPXzRzVFjjtWqUJ', 'yXZPYllOcENFLqZyjvC', 'stiru@theshawgrp.com', APPLICATION],
    ['rgqzcncrAFtqfnMA', 'Yjlnx LLC', 'ngyam.aguch.i@gmail.com', '4592652615'],
    ['MKqJPcRjmIjTzhBp', 'Qdfgdxbnng LLC', 'chenrac@mskcc.org', '4662209379'],
    ['wqYXZiglrbPPSGjpiFmE', 'Qhexagldxj LLC', '9162080721@vtext.com', '9257986054'],
    ['KrowTIXsxpWvBqiAOxzMz', 'Wgywguwgz LLC', 'joe.mello@kore.com', '8510624931'],
    ['OfQuUdLtvKFbADeaOoVD', 'Alzkmap LLC', 'a.h.k.nu.d.s.o.n@gmail.com', '6113187667'],
    ['cYkUzLEoBayqKuktzK', 'Grtpjznn LLC', 'michelleabbasipour@outlook.com', '2857461642'],
    ['MWGOzfNSuummMKIJQOMetpqQ', 'DRjHZhVZwopQgnop', 'michelleabbasipour@outlook.com', APPLICATION],
    ['pzAvHYbWaPBbAgDynWBrjY', 'Giaxwz LLC', 'rvenegas@fcca.co.cr', '3127137129'],
    ['vUznOMHcwJDPYaNBMUzENr', 'Yjgxprehq LLC', 'asony.e.l@gmail.com', '3859447970'],
    ['YuCDFAMLLONAmmujobb', 'Tjxeefq LLC', 'subpoenainquiries@valvesoftware.com', '2962830365'],
    ['nXulQOYLitqYADjXhxCyo', 'LxnGhqJDYIhQuJiFOL', 'subpoenainquiries@valvesoftware.com', APPLICATION],
    ['yfQZbCRlIbBxSGeGeND', 'Qbpnuqii LLC', 'l.frank@house-of-communication.com', '9180283180'],
    ['DsiVdnFaPEoSjUcihLGEb', 'bagRiThRPGCsNUnyYNXMd', 'l.frank@house-of-communication.com', APPLICATION],
    ['ArJQiVngJTNuNqhrKOi', 'Zxsbkhr LLC', 'f.u.dd4.1.3.3.9@gmail.com', '5662404962'],
    ['HMVDLvehWBLoNhDHWCsRT', 'Ylpmvqm LLC', 'andrew.carras@highgate.com', '6161639824'],
    ['fxZfIwhWUOGuIvosPiOppzM', 'Xrdhhthqpp LLC', 'andrew.carras@highgate.com', APPLICATION],
    ['vhigICIiVySjmaZbiuu', 'Rmgznc LLC', 'msu_dreamer@hotmail.com', '6677466542'],
    ['qxAEByMfHAkkZkaOXFNZ', 'Fwtnsj LLC', 'x.imuf.i.ha.b.u9.0@gmail.com', '7735381639'],
    ['UUYheSiwxxFODXPJwkyXW', 'Hvrorohmcg LLC', 'f.ow.a.k.uboj6.5@gmail.com', APPLICATION],
    ['dFGuKBZzDVAEqRGppLNLDxj', 'Fhqwrgcnc LLC', 'f.ow.a.k.uboj6.5@gmail.com', '7269506671'],
    ['oMyrIbRCXSyEsVKZEkVWawkg', 'Zfyplpi LLC', 'sar.ah.yo.u.n.gyzi.wmyhzw@gmail.com', '3207620216'],
    ['HeIhNFSlrhyFKqHiOwwgPuE', 'Ufcixqbxr LLC', 'sar.ah.yo.u.n.gyzi.wmyhzw@gmail.com', APPLICATION],
  ];

  const INQUIRY_ROWS: Array<[name: string, email: string, message: string]> = [
    ['Vzxwnz Gsfqlp', 'x.imuf.i.ha.b.u9.0@gmail.com', 'WgBTDDJvBnXCBqeY'],
    ['Tcvnfjn Ofyfngd', 'f.ow.a.k.uboj6.5@gmail.com', 'FGnkNjScWTyhKbtuur'],
    ['Xdpnm Nuyvbzehy', 'sar.ah.yo.u.n.gyzi.wmyhzw@gmail.com', 'MGWMzbLDCZKTGFcvbVLFWHO'],
    ['Wifigibu Gklww', 'sar.ah.y.o.ung.yziwmyh.zw@gmail.com', 'GHqwygRDKaasQxFIN'],
  ];

  it('drops all 34 contact-form rows on content alone', () => {
    for (const [name, company, email, message] of CONTACT_ROWS) {
      expect(botSignals({ name, company, email, message }).length, `${name} / ${company}`).toBeGreaterThan(0);
    }
  });

  it('drops all 34 contact-form rows even if the name were the only tell', () => {
    // The name is the one field every form shares; it must carry the verdict alone.
    for (const [name] of CONTACT_ROWS) {
      expect(botSignals({ name, message: 'Hello' }), name).toContain('random-looking name');
    }
  });

  it('drops all 4 listing inquiries on content alone, and on name or message alone', () => {
    for (const [name, email, message] of INQUIRY_ROWS) {
      expect(botSignals({ name, email, message }).length, name).toBeGreaterThan(0);
      expect(botSignals({ name, message: 'Is it available?' }), name).toContain('random-looking name');
      expect(botSignals({ name: 'Jim Walker', message }), message).toContain('random-looking message');
    }
  });
});

describe('looksLikeRandomText', () => {
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
      // Camel-case brands: judged whole and in parts, must pass both ways.
      'QuickBooks', 'PayPal', 'FedEx Freight', 'JCPenney', 'LinkedIn', 'YouTube', 'PowerPoint', 'TruckersReport',
      'DeAndreJackson Hauling', 'JohnathanMcAllister Transport', 'VanDerBerg Trucking', 'MacPherson Equipment',
    ];
    expect(real.filter(looksLikeRandomText)).toEqual([]);
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

describe('canonicalEmail', () => {
  it('folds the spellings of one gmail inbox together', () => {
    expect(canonicalEmail('sar.ah.yo.u.n.gyzi.wmyhzw@gmail.com')).toBe('sarahyoungyziwmyhzw@gmail.com');
    expect(canonicalEmail('sar.ah.y.o.ung.yziwmyh.zw@gmail.com')).toBe('sarahyoungyziwmyhzw@gmail.com');
    expect(canonicalEmail(' Sarah.Young+trailers@GoogleMail.com ')).toBe('sarahyoung@gmail.com');
  });

  it('only lower-cases and drops a +tag elsewhere', () => {
    expect(canonicalEmail('J.R.Ewing+ads@Outlook.com')).toBe('j.r.ewing@outlook.com');
    expect(canonicalEmail('jim@example.com')).toBe('jim@example.com');
    expect(canonicalEmail('not-an-address')).toBe('not-an-address');
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
