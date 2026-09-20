/**
 * Which catalog products belong to a microsite.
 *
 * Kept out of resolve.ts (which is `server-only`) so it can be unit-tested
 * directly — the branching here decides whether a domain shows one maker's
 * range or a whole category across the industry, and getting it wrong empties
 * a page silently.
 */
export interface CatalogScopeInput {
  manufacturer_id: string | null;
  product_type: string | null;
  catalog_product_types: string[] | null;
}

export interface CatalogScope {
  manufacturerId: string | null;
  productTypes: string[];
  /** True when the grid can contain more than one manufacturer's products. */
  spansManufacturers: boolean;
}

/**
 * `catalog_product_types` wins when set: a category domain
 * (haletrailers.com, tagtrailers.com) draws on every manufacturer. Otherwise
 * the site is pinned to one maker, optionally narrowed by its single legacy
 * `product_type`.
 *
 * Types are sorted so two orderings of the same filter produce one cache key.
 */
export function catalogScope(site: CatalogScopeInput): CatalogScope {
  const types = site.catalog_product_types ?? [];
  if (types.length) {
    return {
      manufacturerId: null,
      productTypes: [...types].sort(),
      spansManufacturers: true,
    };
  }
  return {
    manufacturerId: site.manufacturer_id,
    productTypes: site.product_type ? [site.product_type] : [],
    spansManufacturers: false,
  };
}
