/**
 * Copy and structured data for microsite pages.
 *
 * Pure functions only — no database, no `server-only` — so every piece of
 * copy that search engines will index can be unit-tested and reviewed as text.
 *
 * Two problems this module exists to solve:
 *
 * 1. 54% of catalog products have zero spec rows and 31% have no description.
 *    Their detail pages were title + photos + a form: too thin to rank and
 *    thin enough to read as doorway pages. `productTypeExplainer` gives every
 *    detail page a substantive, accurate section about what the trailer type
 *    is for, regardless of how much the scraper recovered.
 *
 * 2. The pages carried no structured data at all. Product, BreadcrumbList,
 *    FAQPage and ItemList schema are what earn rich results for exactly the
 *    queries these domains exist to capture.
 */

import type { Microsite, MicrositeProduct } from './resolve';

// ---------------------------------------------------------------------------
// Product-type explainers
// ---------------------------------------------------------------------------

export interface TypeExplainer {
  /** Display name, e.g. "Lowboy". */
  label: string;
  /** Plural noun used in headings: "About lowboy trailers". */
  plural: string;
  /** Two or three sentences a buyer would find genuinely useful. */
  body: string;
  /** What this type typically hauls — feeds copy and schema `category`. */
  hauls: string;
}

const EXPLAINERS: Record<string, TypeExplainer> = {
  lowboy: {
    label: 'Lowboy',
    plural: 'lowboy trailers',
    hauls: 'excavators, dozers, cranes and drill rigs',
    body:
      'A lowboy drops the deck between the gooseneck and the rear axles, putting the load 18 to 24 inches off the ground. That low center of gravity is what lets tall equipment — excavators, dozers, cranes, drill rigs — travel under bridges without an over-height permit. Fixed-neck lowboys load from the rear or side; detachable-neck models let the machine drive straight on from the front. Typical capacities run 35 to 60 tons, with multi-axle configurations reaching well beyond that.',
  },
  rgn: {
    label: 'RGN',
    plural: 'removable gooseneck trailers',
    hauls: 'tracked excavators, dozers and low-clearance machines over 30 tons',
    body:
      'A removable gooseneck trailer is a lowboy whose front neck detaches — hydraulically or mechanically — so the deck rests on the ground and becomes its own ramp. Tracked and low-clearance machines drive on from the front without separate ramps or a dock. RGNs are the default choice for excavators over 30 tons, and the format scales with added axles, jeeps and boosters into the 100-ton-plus range for permitted loads.',
  },
  'step-deck': {
    label: 'Step deck',
    plural: 'step deck trailers',
    hauls: 'freight up to about 10 feet tall, wheeled equipment and machinery',
    body:
      'A step deck (or drop deck) has a short upper deck over the fifth wheel and a longer lower deck stepped down behind it. The lower deck sits around 36 to 40 inches high — roughly two feet lower than a flatbed — so it carries freight up to about 10 feet tall without an over-height permit. Common lengths are 48 and 53 feet, with ramps optional for wheeled equipment.',
  },
  'double-drop': {
    label: 'Double drop',
    plural: 'double drop trailers',
    hauls: 'tall, heavy items such as presses, transformers and compact cranes',
    body:
      'A double drop has two steps: one behind the neck and one ahead of the rear axles, forming a low well in the middle. The well sits close to the ground and typically runs 25 to 29 feet, which is where tall, heavy items ride — presses, transformers, compact cranes. Detachable and fixed-neck versions exist, and extendable wells handle over-length pieces.',
  },
  extendable: {
    label: 'Extendable',
    plural: 'extendable trailers',
    hauls: 'over-length loads such as wind blades, bridge beams, steel and pipe',
    body:
      'An extendable trailer telescopes its frame to carry loads longer than a standard deck — wind blades, bridge beams, steel, pipe. Step decks, flat decks and double drops all come in extendable forms, stretching from a standard 48 or 53 feet to 80 feet or more. The trade-off is added weight and lower capacity at full extension, so the right model depends on both the load’s length and its weight.',
  },
  'traveling-axle': {
    label: 'Traveling axle',
    plural: 'traveling axle trailers',
    hauls: 'mid-size machines and containers loaded from the rear',
    body:
      'On a traveling axle trailer the axle assembly slides forward hydraulically until the rear of the deck touches the ground, turning the whole deck into a ramp. Equipment loads from the rear without a detachable neck or separate ramps, which makes it fast for one operator. Popular with rental yards and contractors moving mid-size machines and containers, with capacities typically from 25 to 55 tons.',
  },
  'tag-along': {
    label: 'Tag-along',
    plural: 'tag-along trailers',
    hauls: 'skid steers, mini excavators, compactors and paving equipment',
    body:
      'A tag-along (tag) trailer couples to a truck with a pintle hitch rather than a fifth wheel, so it can be pulled by a dump truck, service truck or heavy pickup. Capacities range from about 10 to 25 tons — sized for skid steers, mini excavators, compactors and paving equipment. Tilt-deck, beavertail and ramp variants change how machines load. It is the workhorse for contractors who do not run a dedicated tractor.',
  },
  modular: {
    label: 'Modular',
    plural: 'modular platform trailers',
    hauls: 'transformers, generators, vessels and other oversize industrial pieces',
    body:
      'Modular platform trailers are assembled from interchangeable deck sections and axle lines, so the same equipment can be configured for a 60-ton load one week and a 200-ton load the next. They are the tool for transformers, generators, vessels and other oversize industrial pieces moving under permit, and are usually paired with a heavy-haul tractor and steerable dollies.',
  },
  flatbed: {
    label: 'Flatbed',
    plural: 'flatbed trailers',
    hauls: 'building materials, steel, and machinery on skids',
    body:
      'A flatbed is a single flat platform about 60 inches off the ground, open on all sides for loading by crane or forklift. Standard lengths are 48 and 53 feet with legal capacities in the 45,000 to 48,000 pound range. It carries building materials, steel, machinery on skids and anything else that fits within legal height once loaded.',
  },
  other: {
    label: 'Specialized',
    plural: 'specialized heavy-haul trailers',
    hauls: 'loads that need a purpose-built configuration',
    body:
      'Jeeps, boosters, dollies, blade trailers and custom builds extend a lowboy or RGN for a specific load — spreading weight across more axles, or carrying something no stock deck fits. Tell us what you are moving and we will match the configuration.',
  },
};

export function productTypeExplainer(productType: string | null | undefined): TypeExplainer {
  return EXPLAINERS[productType ?? ''] ?? EXPLAINERS.other;
}

// ---------------------------------------------------------------------------
// Detail-page meta description
// ---------------------------------------------------------------------------

/**
 * A search-result description that is never two words long.
 *
 * `short_description` and `tagline` were the previous fallbacks; for 31% of
 * products both are empty or, worse, a scraped tagline like "Detachable
 * Gooseneck" — two words shown under the result. Build from what we actually
 * know, in order of usefulness, and pad with the type explainer.
 */
export function productMetaDescription(
  product: Pick<
    MicrositeProduct,
    'name' | 'short_description' | 'tagline' | 'product_type' | 'tonnage_max' | 'axle_count' | 'deck_length_feet'
  >,
  makerName: string | null | undefined,
  siteName: string
): string {
  const parts: string[] = [];
  const type = productTypeExplainer(product.product_type);

  // "XL Specialized Trailers Custom Trailers lowboy trailer" — maker names
  // and product names both tend to end in "Trailers", and the type noun adds
  // a third. Drop the maker's trailing noun and the type noun when the
  // product name already carries one; keep the product name verbatim.
  const maker = (makerName ?? '').replace(/\s+trailers?$/i, '').trim();
  const nameHasNoun = /\btrailers?$/i.test(product.name.trim());
  const lead = [maker || null, product.name].filter(Boolean).join(' ');
  const typeNoun = nameHasNoun ? type.label.toLowerCase() : `${type.label.toLowerCase()} trailer`;
  const specs = [
    product.tonnage_max ? `${product.tonnage_max}-ton` : null,
    product.axle_count ? `${product.axle_count}-axle` : null,
    product.deck_length_feet ? `${product.deck_length_feet}′ deck` : null,
  ].filter(Boolean);

  parts.push(
    specs.length
      ? `${lead}: ${specs.join(', ')} ${typeNoun}.`
      : nameHasNoun
        ? `${lead} — a ${typeNoun}.`
        : `${lead} ${typeNoun}.`
  );

  const own = (product.short_description || '').trim();
  if (own.length >= 40) {
    parts.push(own.endsWith('.') ? own : `${own}.`);
  } else {
    parts.push(`Built for ${type.hauls}.`);
  }

  parts.push(`Specs, photos and dealer pricing on ${siteName}.`);

  // Google truncates around 155-160 characters; trim on a word boundary.
  const text = parts.join(' ').replace(/\s+/g, ' ');
  if (text.length <= 158) return text;
  const cut = text.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface Faq {
  q: string;
  a: string;
}

/**
 * Answers the objections a buyer actually has before filling in a form, and
 * doubles as FAQPage schema. Every answer here must be true of how the site
 * operates — this is indexed, and it is also the disclosure that keeps a
 * brand-named domain on the right side of descriptive use.
 */
export function landingFaqs(site: Microsite): Faq[] {
  const maker = site.manufacturer?.name ?? null;
  const faqs: Faq[] = [];

  if (maker) {
    faqs.push({
      q: `Is ${site.name} part of ${maker}?`,
      a: `No. ${site.name} is an independent marketplace operated by Axleyard. We are not affiliated with, endorsed by, or an authorized dealer for ${maker}. We list ${maker} models so you can compare them and connect you with dealers who sell them.`,
    });
  }

  faqs.push(
    {
      q: 'Why do most listings say "Call for price"?',
      a: 'Heavy-haul trailers are configured to order — axle count, deck length, neck type and options change the number — and dealers price them per deal. Tell us what you need and we come back with a real quote from a dealer, not a list price.',
    },
    {
      q: 'Are these new or used trailers?',
      a: `Both. The model catalog shows current new models${maker ? ` from ${maker}` : ''}. "Available now" is live dealer inventory, which includes new stock units and used trailers. Say which you want in the form.`,
    },
    {
      q: 'How quickly will I hear back?',
      a: 'Within one business day. A specialist reviews what you are hauling, matches it to the right capacity and deck, and returns pricing and availability.',
    },
    {
      q: 'Do you sell the trailers yourselves?',
      a: 'No — we are a marketplace. Your request goes to a dealer who stocks the trailer, and they handle the sale, delivery and financing. We stay involved to make sure you get an answer.',
    },
    {
      q: 'Which trailer do I need?',
      a: 'It comes down to three things: the weight of the load, its height and length, and how it loads (drive-on, crane, or forklift). Put those in the form and we will recommend a type and capacity rather than leaving you to guess.',
    }
  );

  return faqs;
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD)
// ---------------------------------------------------------------------------

export interface MarketplaceStats {
  listings: number;
  manufacturers: number;
  states: number;
}

function primaryImage(product: Pick<MicrositeProduct, 'images'>): string | null {
  const img = product.images?.find((i) => i.is_primary) || product.images?.[0];
  return img?.url ?? null;
}

/**
 * Landing page: WebSite (with Axleyard as publisher, so the schema never
 * claims the site *is* the manufacturer), the catalog as an ItemList, and
 * the FAQ.
 */
export function landingJsonLd(
  site: Microsite,
  products: MicrositeProduct[],
  faqs: Faq[]
): object[] {
  const base = `https://${site.domain}`;

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: `${base}/`,
    description: site.meta_description || site.subheadline || undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Axleyard',
      url: 'https://axleyard.com',
    },
  };

  const itemList = products.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${site.manufacturer?.name ?? site.name} models`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${base}/trailers/${p.slug}`,
          name: p.name,
          ...(primaryImage(p) ? { image: primaryImage(p) } : {}),
        })),
      }
    : null;

  const faqPage = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  // Built imperatively: a `filter((x): x is object => …)` over the union
  // can't narrow `null` away, so TypeScript rejects the predicate.
  const out: object[] = [website];
  if (itemList) out.push(itemList);
  if (faqPage) out.push(faqPage);
  return out;
}

/** Detail page: the Product itself plus a BreadcrumbList back to the grid. */
export function productJsonLd(
  site: Microsite,
  product: MicrositeProduct,
  makerName: string | null | undefined
): object[] {
  const base = `https://${site.domain}`;
  const url = `${base}/trailers/${product.slug}`;
  const type = productTypeExplainer(product.product_type);
  const images = (product.images ?? []).map((i) => i.url).filter(Boolean);

  const additionalProperty = [
    product.tonnage_max ? { name: 'Capacity', value: product.tonnage_max, unitText: 'ton' } : null,
    product.axle_count ? { name: 'Axles', value: product.axle_count } : null,
    product.deck_length_feet ? { name: 'Deck length', value: product.deck_length_feet, unitText: 'ft' } : null,
    product.deck_height_inches ? { name: 'Deck height', value: product.deck_height_inches, unitText: 'in' } : null,
    product.gvwr_lbs ? { name: 'GVWR', value: product.gvwr_lbs, unitText: 'lb' } : null,
  ]
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((p) => ({ '@type': 'PropertyValue', ...p }));

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url,
    ...(images.length ? { image: images } : {}),
    description: productMetaDescription(product, makerName, site.name),
    category: `${type.label} trailer`,
    ...(makerName ? { brand: { '@type': 'Brand', name: makerName } } : {}),
    ...(product.model_number ? { model: product.model_number } : {}),
    ...(additionalProperty.length ? { additionalProperty } : {}),
    // No offers: prices are quoted per deal, and a fabricated price would be
    // both wrong and a rich-result policy violation.
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: site.name, item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Models', item: `${base}/#models` },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ],
  };

  return [productSchema, breadcrumbs];
}
