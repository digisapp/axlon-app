import { describe, it, expect } from 'vitest';
import {
  landingFaqs,
  landingJsonLd,
  productJsonLd,
  productMetaDescription,
  productTypeExplainer,
} from '@/lib/microsites/content';
import type { Microsite, MicrositeProduct } from '@/lib/microsites/resolve';

const site = {
  id: 's1',
  domain: 'xltrailers.com',
  name: 'XL Trailers',
  status: 'live',
  manufacturer_id: 'm1',
  product_type: null,
  listing_make: null,
  listing_category_slugs: null,
  catalog_product_types: null,
  show_listings: true,
  headline: null,
  subheadline: 'Compare models',
  hero_image_url: null,
  accent_color: '#1d4ed8',
  cta_label: 'Get Pricing',
  phone: null,
  disclaimer: null,
  lead_recipient_email: null,
  assigned_user_id: null,
  meta_title: null,
  meta_description: null,
  manufacturer: { id: 'm1', name: 'XL Specialized', slug: 'xl-specialized', website: null, short_description: null },
} as unknown as Microsite;

const categorySite = { ...site, manufacturer_id: null, manufacturer: null, name: 'Tag Trailers', domain: 'tagtrailers.com' } as unknown as Microsite;

const thinProduct = {
  id: 'p1',
  name: 'XL Power Tail',
  slug: 'xl-power-tail',
  product_type: 'lowboy',
  short_description: null,
  tagline: 'Detachable Gooseneck',
  images: [{ url: 'https://x.supabase.co/a.webp', alt_text: null, is_primary: true }],
} as unknown as MicrositeProduct;

describe('productMetaDescription', () => {
  it('never degrades to the two-word tagline', () => {
    const d = productMetaDescription(thinProduct, 'XL Specialized', 'XL Trailers');
    expect(d).not.toBe('Detachable Gooseneck');
    expect(d.split(' ').length).toBeGreaterThan(12);
    expect(d).toContain('XL Specialized XL Power Tail');
    expect(d).toContain('XL Trailers');
  });

  it('leads with the specs when it has them', () => {
    const d = productMetaDescription(
      { ...thinProduct, tonnage_max: 55, axle_count: 3, deck_length_feet: 26 } as MicrositeProduct,
      'XL Specialized',
      'XL Trailers'
    );
    expect(d).toMatch(/55-ton, 3-axle, 26′ deck lowboy trailer/);
  });

  it('stays inside a search snippet and cuts on a word boundary', () => {
    const long = {
      ...thinProduct,
      short_description: 'A '.repeat(200) + 'very long description that would overflow any snippet by a wide margin.',
    } as MicrositeProduct;
    const d = productMetaDescription(long, 'XL Specialized', 'XL Trailers');
    expect(d.length).toBeLessThanOrEqual(158);
    expect(d.endsWith('…')).toBe(true);
    expect(d).not.toMatch(/\s…$/);
  });

  it('does not stutter when maker and product both end in "Trailers"', () => {
    const d = productMetaDescription(
      { ...thinProduct, name: 'Custom Trailers' } as MicrositeProduct,
      'XL Specialized Trailers',
      'XL Trailers'
    );
    // Was: "XL Specialized Trailers Custom Trailers lowboy trailer."
    expect(d).toMatch(/^XL Specialized Custom Trailers — a lowboy\./);
    expect((d.match(/trailers?/gi) ?? []).length).toBeLessThanOrEqual(3);
  });

  it('works with no manufacturer name', () => {
    expect(productMetaDescription(thinProduct, null, 'Hale Trailers')).toContain('XL Power Tail');
  });
});

describe('productTypeExplainer', () => {
  it('has real copy for every catalog type', () => {
    for (const t of ['lowboy', 'rgn', 'step-deck', 'double-drop', 'extendable', 'traveling-axle', 'tag-along', 'modular', 'flatbed', 'other']) {
      const e = productTypeExplainer(t);
      expect(e.body.split(' ').length, t).toBeGreaterThan(40);
      expect(e.plural, t).toMatch(/trailers$/);
    }
  });

  it('falls back to the generic explainer for unknown or missing types', () => {
    expect(productTypeExplainer('hovercraft').label).toBe('Specialized');
    expect(productTypeExplainer(null).label).toBe('Specialized');
  });
});

describe('landingFaqs', () => {
  it('leads with the affiliation disclosure on a brand-named site', () => {
    const faqs = landingFaqs(site);
    expect(faqs[0].q).toContain('XL Specialized');
    expect(faqs[0].a).toMatch(/not affiliated/i);
    expect(faqs[0].a).toContain('Axleyard');
  });

  it('omits the affiliation question on a category site', () => {
    const faqs = landingFaqs(categorySite);
    expect(faqs.some((f) => /affiliated|part of/i.test(f.q))).toBe(false);
    expect(faqs.length).toBeGreaterThanOrEqual(5);
  });

  it('every answer is a full sentence, not a fragment', () => {
    for (const f of landingFaqs(site)) {
      expect(f.a.length).toBeGreaterThan(60);
      expect(f.a.trim()).toMatch(/[.!]$/);
    }
  });
});

describe('landingJsonLd', () => {
  it('emits WebSite, ItemList and FAQPage with Axleyard as publisher', () => {
    const out = landingJsonLd(site, [thinProduct], landingFaqs(site)) as Array<Record<string, unknown>>;
    const types = out.map((o) => o['@type']);
    expect(types).toEqual(['WebSite', 'ItemList', 'FAQPage']);
    const ws = out[0] as { publisher: { name: string }; url: string };
    expect(ws.publisher.name).toBe('Axleyard');
    expect(ws.url).toBe('https://xltrailers.com/');
    const list = out[1] as { itemListElement: Array<{ url: string; position: number }> };
    expect(list.itemListElement[0].url).toBe('https://xltrailers.com/trailers/xl-power-tail');
    expect(list.itemListElement[0].position).toBe(1);
  });

  it('drops ItemList when there are no products rather than emitting an empty list', () => {
    const types = (landingJsonLd(categorySite, [], []) as Array<Record<string, unknown>>).map((o) => o['@type']);
    expect(types).toEqual(['WebSite']);
  });
});

describe('productJsonLd', () => {
  it('emits Product with brand and BreadcrumbList, and never an offer', () => {
    const [product, crumbs] = productJsonLd(site, thinProduct, 'XL Specialized') as [
      Record<string, unknown>,
      { itemListElement: Array<{ name: string }> },
    ];
    expect(product['@type']).toBe('Product');
    expect((product.brand as { name: string }).name).toBe('XL Specialized');
    expect(product.category).toBe('Lowboy trailer');
    // Prices are quoted per deal; a fabricated offer is a rich-result policy violation.
    expect(product).not.toHaveProperty('offers');
    expect(crumbs.itemListElement.map((c) => c.name)).toEqual(['XL Trailers', 'Models', 'XL Power Tail']);
  });

  it('carries the headline specs as PropertyValue when present', () => {
    const [product] = productJsonLd(
      site,
      { ...thinProduct, tonnage_max: 55, gvwr_lbs: 120000 } as MicrositeProduct,
      'XL Specialized'
    ) as [{ additionalProperty: Array<{ name: string; value: number }> }];
    const names = product.additionalProperty.map((p) => p.name);
    expect(names).toEqual(['Capacity', 'GVWR']);
  });
});
