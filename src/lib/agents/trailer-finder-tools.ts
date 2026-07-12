import { logger } from '@/lib/logger';
import { createAdminClient } from '@/lib/supabase/admin';
import { sanitizeSearchFilter } from '@/lib/security/sanitize';

function getSupabase() {
  return createAdminClient();
}

// ── Tool: Search Marketplace Listings ────────────────────────────
export async function searchListings(params: {
  query?: string;
  category?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  condition?: string;
  state?: string;
  minCapacity?: number;
  limit?: number;
}): Promise<{
  listings: Array<{
    id: string;
    title: string;
    price: number | null;
    year: number | null;
    make: string | null;
    model: string | null;
    condition: string | null;
    city: string | null;
    state: string | null;
    mileage: number | null;
    hours: number | null;
    description: string | null;
    ai_price_estimate: number | null;
  }>;
  total: number;
}> {
  const supabase = getSupabase();
  const limit = params.limit || 5;

  let query = supabase
    .from('listings')
    .select('id, title, price, year, make, model, condition, city, state, mileage, hours, description, ai_price_estimate', { count: 'exact' })
    .eq('status', 'active');

  if (params.make) query = query.ilike('make', `%${sanitizeSearchFilter(params.make)}%`);
  if (params.model) query = query.ilike('model', `%${sanitizeSearchFilter(params.model)}%`);
  if (params.minPrice) query = query.gte('price', params.minPrice);
  if (params.maxPrice) query = query.lte('price', params.maxPrice);
  if (params.minYear) query = query.gte('year', params.minYear);
  if (params.maxYear) query = query.lte('year', params.maxYear);
  if (params.condition) query = query.eq('condition', sanitizeSearchFilter(params.condition));
  if (params.state) query = query.ilike('state', `%${sanitizeSearchFilter(params.state)}%`);
  if (params.query) {
    const q = sanitizeSearchFilter(params.query);
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }
  }

  const { data, error, count } = await query.order('created_at', { ascending: false }).limit(limit);

  if (error) {
    logger.error('searchListings error', { error });
    return { listings: [], total: 0 };
  }

  return { listings: data || [], total: count || 0 };
}

// ── Tool: Search New Trailers (Manufacturer Catalog) ─────────────
export async function searchNewTrailers(params: {
  query?: string;
  manufacturer?: string;
  category?: string;
  minTonnage?: number;
  maxTonnage?: number;
  gooseneckType?: string;
  limit?: number;
}): Promise<Array<{
  id: string;
  name: string;
  manufacturer_name: string;
  manufacturer_slug: string;
  product_slug: string;
  category: string;
  subcategory: string | null;
  tonnage_min: number | null;
  tonnage_max: number | null;
  gooseneck_type: string | null;
  description: string | null;
  specs: Array<{ spec_key: string; spec_value: string }>;
}>> {
  const supabase = getSupabase();
  const limit = params.limit || 5;

  // manufacturer_products stores slug + product_type; the manufacturer's name
  // and slug live on the joined manufacturers table (there is no denormalized
  // manufacturer_name/product_slug/category/subcategory column).
  let query = supabase
    .from('manufacturer_products')
    .select(`
      id, name, slug, product_type, tonnage_min, tonnage_max, gooseneck_type, description,
      manufacturer:manufacturers!inner(name, slug),
      specs:manufacturer_product_specs(spec_key, spec_value)
    `)
    .eq('is_active', true);

  if (params.manufacturer) query = query.ilike('manufacturers.name', `%${sanitizeSearchFilter(params.manufacturer)}%`);
  if (params.category) query = query.ilike('product_type', `%${sanitizeSearchFilter(params.category)}%`);
  if (params.minTonnage) query = query.gte('tonnage_max', params.minTonnage);
  if (params.maxTonnage) query = query.lte('tonnage_min', params.maxTonnage);
  if (params.gooseneckType) query = query.eq('gooseneck_type', sanitizeSearchFilter(params.gooseneckType));
  if (params.query) {
    const q = sanitizeSearchFilter(params.query);
    if (q) {
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,product_type.ilike.%${q}%`);
    }
  }

  const { data, error } = await query.limit(limit);

  if (error) {
    logger.error('searchNewTrailers error', { error });
    return [];
  }

  type Row = {
    id: string;
    name: string;
    slug: string;
    product_type: string | null;
    tonnage_min: number | null;
    tonnage_max: number | null;
    gooseneck_type: string | null;
    description: string | null;
    manufacturer: { name: string; slug: string } | { name: string; slug: string }[] | null;
    specs: Array<{ spec_key: string; spec_value: string }>;
  };

  return ((data || []) as Row[]).map((row) => {
    const mfr = Array.isArray(row.manufacturer) ? row.manufacturer[0] : row.manufacturer;
    return {
      id: row.id,
      name: row.name,
      manufacturer_name: mfr?.name || '',
      manufacturer_slug: mfr?.slug || '',
      product_slug: row.slug,
      category: row.product_type || '',
      subcategory: null,
      tonnage_min: row.tonnage_min,
      tonnage_max: row.tonnage_max,
      gooseneck_type: row.gooseneck_type,
      description: row.description,
      specs: row.specs,
    };
  });
}

// ── Tool: Get Product Specs ──────────────────────────────────────
export async function getProductSpecs(params: {
  manufacturer: string;
  product: string;
}): Promise<{
  product: {
    name: string;
    manufacturer: string;
    category: string;
    description: string | null;
  } | null;
  specs: Record<string, string>;
}> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('manufacturer_products')
    .select(`
      name, product_type, description,
      manufacturer:manufacturers!inner(name, slug),
      specs:manufacturer_product_specs(spec_key, spec_value)
    `)
    .ilike('manufacturers.slug', `%${sanitizeSearchFilter(params.manufacturer)}%`)
    .ilike('slug', `%${sanitizeSearchFilter(params.product)}%`)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { product: null, specs: {} };
  }

  const specs: Record<string, string> = {};
  for (const s of (data.specs as Array<{ spec_key: string; spec_value: string }>)) {
    specs[s.spec_key] = s.spec_value;
  }

  const mfr = Array.isArray(data.manufacturer) ? data.manufacturer[0] : data.manufacturer;
  return {
    product: {
      name: data.name,
      manufacturer: (mfr as { name: string } | null)?.name || '',
      category: data.product_type || '',
      description: data.description,
    },
    specs,
  };
}

// ── Tool: Compare Products ───────────────────────────────────────
export async function compareProducts(params: {
  productIds: string[];
}): Promise<Array<{
  name: string;
  manufacturer: string;
  specs: Record<string, string>;
}>> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('manufacturer_products')
    .select(`
      id, name,
      manufacturer:manufacturers(name),
      specs:manufacturer_product_specs(spec_key, spec_value)
    `)
    .in('id', params.productIds);

  if (error || !data) return [];

  return data.map(product => {
    const specs: Record<string, string> = {};
    for (const s of (product.specs as Array<{ spec_key: string; spec_value: string }>)) {
      specs[s.spec_key] = s.spec_value;
    }
    const mfr = Array.isArray(product.manufacturer) ? product.manufacturer[0] : product.manufacturer;
    return {
      name: product.name,
      manufacturer: (mfr as { name: string } | null)?.name || '',
      specs,
    };
  });
}

// ── Tool: Calculate Financing ────────────────────────────────────
export function calculateFinancing(params: {
  price: number;
  downPaymentPercent?: number;
  termMonths?: number;
  annualRate?: number;
}): {
  monthly_payment: number;
  total_cost: number;
  total_interest: number;
  down_payment: number;
  financed_amount: number;
  scenarios: Array<{ term: number; monthly: number; total: number }>;
} {
  const price = params.price;
  const downPercent = params.downPaymentPercent || 10;
  const downPayment = price * (downPercent / 100);
  const financed = price - downPayment;
  const rate = params.annualRate || 7.5;
  const monthlyRate = rate / 100 / 12;
  const term = params.termMonths || 72;

  const calcPayment = (principal: number, months: number, mr: number) => {
    if (mr === 0) return principal / months;
    return principal * (mr * Math.pow(1 + mr, months)) / (Math.pow(1 + mr, months) - 1);
  };

  const monthly = calcPayment(financed, term, monthlyRate);
  const totalCost = monthly * term + downPayment;

  const scenarios = [48, 60, 72, 84].map(t => {
    const m = calcPayment(financed, t, monthlyRate);
    return { term: t, monthly: Math.round(m), total: Math.round(m * t + downPayment) };
  });

  return {
    monthly_payment: Math.round(monthly),
    total_cost: Math.round(totalCost),
    total_interest: Math.round(totalCost - price),
    down_payment: Math.round(downPayment),
    financed_amount: Math.round(financed),
    scenarios,
  };
}

// ── Common Equipment Weights (for "will this haul X?" questions) ─
const EQUIPMENT_WEIGHTS: Record<string, { weight_lbs: number; name: string }> = {
  'cat 349': { weight_lbs: 113000, name: 'Caterpillar 349 Excavator' },
  'cat 336': { weight_lbs: 84000, name: 'Caterpillar 336 Excavator' },
  'cat 330': { weight_lbs: 73000, name: 'Caterpillar 330 Excavator' },
  'cat 320': { weight_lbs: 50700, name: 'Caterpillar 320 Excavator' },
  'cat d6': { weight_lbs: 44000, name: 'Caterpillar D6 Dozer' },
  'cat d8': { weight_lbs: 83000, name: 'Caterpillar D8 Dozer' },
  'cat d10': { weight_lbs: 145000, name: 'Caterpillar D10 Dozer' },
  'cat 950': { weight_lbs: 40000, name: 'Caterpillar 950 Wheel Loader' },
  'cat 966': { weight_lbs: 52000, name: 'Caterpillar 966 Wheel Loader' },
  'cat 980': { weight_lbs: 64000, name: 'Caterpillar 980 Wheel Loader' },
  'komatsu pc490': { weight_lbs: 108000, name: 'Komatsu PC490 Excavator' },
  'komatsu pc360': { weight_lbs: 80000, name: 'Komatsu PC360 Excavator' },
  'komatsu pc210': { weight_lbs: 52000, name: 'Komatsu PC210 Excavator' },
  'komatsu d65': { weight_lbs: 45000, name: 'Komatsu D65 Dozer' },
  'komatsu d155': { weight_lbs: 88000, name: 'Komatsu D155 Dozer' },
  'john deere 470g': { weight_lbs: 105000, name: 'John Deere 470G Excavator' },
  'john deere 350g': { weight_lbs: 80000, name: 'John Deere 350G Excavator' },
  'john deere 210g': { weight_lbs: 48000, name: 'John Deere 210G Excavator' },
  'volvo ec480': { weight_lbs: 108000, name: 'Volvo EC480 Excavator' },
  'volvo ec380': { weight_lbs: 83000, name: 'Volvo EC380 Excavator' },
  'liebherr ltm 1100': { weight_lbs: 132000, name: 'Liebherr LTM 1100 Crane' },
  'liebherr ltm 1300': { weight_lbs: 176000, name: 'Liebherr LTM 1300 Crane' },
  'grove gmk5250l': { weight_lbs: 154000, name: 'Grove GMK5250L Crane' },
  'link-belt 250': { weight_lbs: 110000, name: 'Link-Belt 250 X4 Excavator' },
};

export function lookupEquipmentWeight(query: string): {
  found: boolean;
  equipment?: string;
  weight_lbs?: number;
  weight_tons?: number;
  recommended_trailer_capacity_tons?: number;
} {
  const q = query.toLowerCase().trim();

  for (const [key, data] of Object.entries(EQUIPMENT_WEIGHTS)) {
    if (q.includes(key)) {
      const tons = Math.round(data.weight_lbs / 2000);
      return {
        found: true,
        equipment: data.name,
        weight_lbs: data.weight_lbs,
        weight_tons: tons,
        recommended_trailer_capacity_tons: Math.ceil(tons / 5) * 5 + 5, // Round up + 5 ton buffer
      };
    }
  }

  return { found: false };
}

// ── Tool definitions for the agent ───────────────────────────────
export const TRAILER_FINDER_TOOLS = {
  search_listings: {
    description: 'Search the AXLON marketplace for used trailers, trucks, and equipment. Use this when the buyer wants to find specific used equipment for sale.',
    parameters: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Free text search query' },
        category: { type: 'string', description: 'Category like lowboy, flatbed, reefer, dump, etc.' },
        make: { type: 'string', description: 'Manufacturer/make name' },
        model: { type: 'string', description: 'Model name or number' },
        minPrice: { type: 'number', description: 'Minimum price in USD' },
        maxPrice: { type: 'number', description: 'Maximum price in USD' },
        minYear: { type: 'number', description: 'Minimum year' },
        maxYear: { type: 'number', description: 'Maximum year' },
        condition: { type: 'string', enum: ['new', 'used', 'certified', 'salvage'] },
        state: { type: 'string', description: 'US state to filter by' },
      },
    },
    execute: searchListings,
  },
  search_new_trailers: {
    description: 'Search the manufacturer product catalog for new trailer models with specs. Use this when the buyer wants to know about new trailer options from manufacturers like Trail King, Fontaine, Talbert, etc.',
    parameters: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query' },
        manufacturer: { type: 'string', description: 'Manufacturer name' },
        category: { type: 'string', description: 'Category like lowboy, rgn, fixed-gooseneck, etc.' },
        minTonnage: { type: 'number', description: 'Minimum capacity in tons' },
        maxTonnage: { type: 'number', description: 'Maximum capacity in tons' },
      },
    },
    execute: searchNewTrailers,
  },
  get_product_specs: {
    description: 'Get detailed specifications for a specific manufacturer product. Use this when the buyer asks about specs for a specific model.',
    parameters: {
      type: 'object' as const,
      properties: {
        manufacturer: { type: 'string', description: 'Manufacturer slug (e.g., trail-king)' },
        product: { type: 'string', description: 'Product slug (e.g., tk110hdg)' },
      },
      required: ['manufacturer', 'product'],
    },
    execute: getProductSpecs,
  },
  compare_products: {
    description: 'Compare specs between multiple manufacturer products side by side.',
    parameters: {
      type: 'object' as const,
      properties: {
        productIds: { type: 'array', items: { type: 'string' }, description: 'Array of product IDs to compare' },
      },
      required: ['productIds'],
    },
    execute: compareProducts,
  },
  calculate_financing: {
    description: 'Calculate monthly payments and financing scenarios for a given price.',
    parameters: {
      type: 'object' as const,
      properties: {
        price: { type: 'number', description: 'Equipment price in USD' },
        downPaymentPercent: { type: 'number', description: 'Down payment percentage (default 10)' },
        termMonths: { type: 'number', description: 'Loan term in months (default 72)' },
        annualRate: { type: 'number', description: 'Annual interest rate percentage (default 7.5)' },
      },
      required: ['price'],
    },
    execute: calculateFinancing,
  },
  lookup_equipment_weight: {
    description: 'Look up the weight of common heavy equipment (excavators, dozers, loaders, cranes) to determine what trailer capacity is needed. Use this when a buyer says they need to haul a specific piece of equipment.',
    parameters: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Equipment name or model (e.g., "Cat 349", "Komatsu PC490")' },
      },
      required: ['query'],
    },
    execute: lookupEquipmentWeight,
  },
};
