import { describe, it, expect } from 'vitest';
import { catalogScope } from '@/lib/microsites/catalog-scope';

const base = { manufacturer_id: null, product_type: null, catalog_product_types: null };

describe('catalogScope', () => {
  it('pins a brand site to its manufacturer', () => {
    expect(catalogScope({ ...base, manufacturer_id: 'xl' })).toEqual({
      manufacturerId: 'xl',
      productTypes: [],
      primaryType: null,
      spansManufacturers: false,
    });
  });

  it('narrows a brand site by its legacy single product_type', () => {
    expect(catalogScope({ ...base, manufacturer_id: 'xl', product_type: 'lowboy' })).toEqual({
      manufacturerId: 'xl',
      productTypes: ['lowboy'],
      primaryType: 'lowboy',
      spansManufacturers: false,
    });
  });

  it('lets a category site span every manufacturer', () => {
    expect(catalogScope({ ...base, catalog_product_types: ['lowboy', 'rgn'] })).toEqual({
      manufacturerId: null,
      productTypes: ['lowboy', 'rgn'],
      primaryType: 'lowboy',
      spansManufacturers: true,
    });
  });

  it('drops the manufacturer pin when catalog types are set', () => {
    // Otherwise the two AND together and a category site built on a maker it
    // also happens to reference would show only that maker's products.
    const scope = catalogScope({
      manufacturer_id: 'felling',
      product_type: 'step-deck',
      catalog_product_types: ['tag-along', 'traveling-axle'],
    });
    expect(scope.manufacturerId).toBeNull();
    expect(scope.productTypes).toEqual(['tag-along', 'traveling-axle']);
  });

  it('sorts types so one filter yields one cache key', () => {
    const a = catalogScope({ ...base, catalog_product_types: ['rgn', 'lowboy', 'step-deck'] });
    const b = catalogScope({ ...base, catalog_product_types: ['step-deck', 'lowboy', 'rgn'] });
    expect(a.productTypes).toEqual(b.productTypes);
    expect(a.productTypes.join(',')).toBe('lowboy,rgn,step-deck');
  });

  it('yields an empty scope for a site with neither, so callers can bail', () => {
    const scope = catalogScope(base);
    expect(scope.manufacturerId).toBeNull();
    expect(scope.productTypes).toEqual([]);
  });

  it('treats an empty types array as unset rather than as "match nothing"', () => {
    expect(catalogScope({ ...base, manufacturer_id: 'xl', catalog_product_types: [] })).toEqual({
      manufacturerId: 'xl',
      productTypes: [],
      primaryType: null,
      spansManufacturers: false,
    });
  });
});

describe('catalogScope primaryType', () => {
  it('keeps the admin\'s first-listed type as primary while sorting the key', () => {
    // tagtrailers.com lists tag-along first on purpose: it is the site's namesake.
    const scope = catalogScope({ ...base, catalog_product_types: ['traveling-axle', 'tag-along'] });
    expect(scope.productTypes).toEqual(['tag-along', 'traveling-axle']); // sorted → stable cache key
    expect(scope.primaryType).toBe('traveling-axle'); // but the lead is what was listed first
  });
});
