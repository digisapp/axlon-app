import { describe, it, expect } from 'vitest';
import {
  cleanCopy,
  cleanProductName,
  correctedTonnage,
  isBrandBoilerplate,
  isFirstPerson,
  isHiddenProduct,
  isOffNicheForHeavyHaul,
  HIDDEN_PRODUCT_FILTER,
} from '@/lib/catalog/quality';
import { isJunkCatalogImage, withBrandBannersLast, withoutJunkImages } from '@/lib/images/catalog-junk-images';

const BASE =
  'https://mpchkzqkvkizxeokjhnp.supabase.co/storage/v1/object/public/listing-images/manufacturer-products/x';

describe('isJunkCatalogImage', () => {
  it('matches a denylisted file by the hash in its re-hosted name', () => {
    expect(isJunkCatalogImage(`${BASE}/9-cca580db.webp`)).toBe(true); // factory icon
    expect(isJunkCatalogImage(`${BASE}/0-CCA580DB.webp`)).toBe(true);
    expect(isJunkCatalogImage(`${BASE}/9-cca580db.webp?width=640`)).toBe(true);
  });

  it('leaves real photos and un-hashed URLs alone', () => {
    expect(isJunkCatalogImage(`${BASE}/1-5bc74c9a.avif`)).toBe(false);
    expect(isJunkCatalogImage('https://www.eagerbeavertrailers.com/wp-content/uploads/50-GSL.jpg')).toBe(false);
    expect(isJunkCatalogImage(null)).toBe(false);
  });

  it('filters a list, keeping order', () => {
    const imgs = [{ url: `${BASE}/0-cca580db.webp` }, { url: `${BASE}/1-aaaaaaaa.jpg` }, { url: `${BASE}/2-34243fa2.png` }];
    expect(withoutJunkImages(imgs)).toEqual([{ url: `${BASE}/1-aaaaaaaa.jpg` }]);
    expect(withoutJunkImages(undefined)).toEqual([]);
  });

  it('drops brand banners on microsites, keeps them last on the marketplace', () => {
    const banner = { url: `${BASE}/1-96244619.jpg` };
    const photo = { url: `${BASE}/5-bbbbbbbb.jpg` };
    const logo = { url: `${BASE}/3-26cb2b44.png` };
    expect(withoutJunkImages([banner, logo, photo])).toEqual([photo]);
    expect(withBrandBannersLast([banner, logo, photo])).toEqual([photo, banner]);
    expect(withBrandBannersLast([banner, logo])).toEqual([banner]);
  });
});

describe('hidden products', () => {
  it('hides the rows lifted from Hale Trailer', () => {
    expect(isHiddenProduct('b2abbf97-5048-43e2-ab98-1ff021bbb4ae')).toBe(true);
    expect(isHiddenProduct('00000000-0000-0000-0000-000000000000')).toBe(false);
  });

  it('builds a PostgREST in-list', () => {
    expect(HIDDEN_PRODUCT_FILTER).toMatch(/^\([0-9a-f-]+(,[0-9a-f-]+)*\)$/);
  });
});

describe('isOffNicheForHeavyHaul', () => {
  it('catches dump, live-bottom, chip-van and rollback bodies', () => {
    expect(isOffNicheForHeavyHaul('TKBD Bottom Dump')).toBe(true);
    expect(isOffNicheForHeavyHaul('TKLB Live Bottom')).toBe(true);
    expect(isOffNicheForHeavyHaul('CHIP VAN CLOSED TOP')).toBe(true);
    expect(isOffNicheForHeavyHaul('Loadoll II Rollback Carrier')).toBe(true);
  });

  it('keeps real heavy-haul models', () => {
    expect(isOffNicheForHeavyHaul('Hydraulic Detachable Gooseneck')).toBe(false);
    expect(isOffNicheForHeavyHaul('55 GSL-3')).toBe(false);
    expect(isOffNicheForHeavyHaul('440B Traveling Axle Trailer')).toBe(false);
  });
});

describe('cleanProductName', () => {
  it('strips SEO padding from page titles', () => {
    expect(cleanProductName('Premium Quality Engineered Lowboy Trailer Manufacturer 4-Axle')).toBe('Lowboy Trailer 4-Axle');
    expect(cleanProductName('Faymonville MultiMax Trailers for Sale')).toBe('Faymonville MultiMax Trailers');
    expect(cleanProductName('Custom Designed Heavy Duty Tag Trailers for Sale')).toBe('Heavy Duty Tag Trailers');
  });

  it('title-cases shouting but keeps codes', () => {
    expect(cleanProductName('REMOVABLE GOOSENECK TRAILERS')).toBe('Removable Gooseneck Trailers');
    expect(cleanProductName('FIXED NECK LOW BOY OILFIELD (LBO)')).toBe('Fixed Neck Low Boy Oilfield (LBO)');
    expect(cleanProductName('LB35-38CS FIXED NECK')).toBe('LB35-38CS Fixed Neck');
  });

  it('leaves real model names alone', () => {
    expect(cleanProductName('Magnitude 55H MDSR')).toBe('Magnitude 55H MDSR');
    expect(cleanProductName('65FG')).toBe('65FG');
    expect(cleanProductName('XL Tag')).toBe('XL Tag');
  });
});

describe('cleanCopy', () => {
  it('drops page furniture and another business’s copy', () => {
    expect(cleanCopy('Privacy Policy | Cookie Policy')).toBeNull();
    expect(cleanCopy('Find dealers closest to your location.')).toBeNull();
    expect(cleanCopy('Service Hours Monday-Thursday 8am-4pm')).toBeNull();
    expect(cleanCopy('Meet the 9-axle HighwayMAX … now available at Hale Trailer.')).toBeNull();
    expect(cleanCopy(null)).toBeNull();
  });

  it('strips a breadcrumb line', () => {
    expect(cleanCopy('Home » Detachable Gooseneck Trailers » Paver Special')).toBeNull();
    expect(cleanCopy('Home » Lowboys\nA 35-ton spring-ride lowboy for construction.')).toBe(
      'A 35-ton spring-ride lowboy for construction.'
    );
  });

  it('turns dash and bullet runs into a readable list', () => {
    expect(cleanCopy('- 3+2 Axles - 22" Deck Height')).toBe('3+2 Axles · 22" Deck Height');
    expect(cleanCopy('• 5 D-rings per side • 33” loaded deck height')).toBe('5 D-rings per side · 33” loaded deck height');
  });

  it('keeps ordinary prose unchanged', () => {
    const t = 'The 440B Traveling Axle Trailer, with a 40-ton capacity, is available in lengths of 41′.';
    expect(cleanCopy(t)).toBe(t);
  });
});

describe('card copy guards', () => {
  it('flags first-person maker copy but not "the US"', () => {
    expect(isFirstPerson('We know that you work hard and expect your equipment to do the same.')).toBe(true);
    expect(isFirstPerson('Since our early years of manufacturing, light tag trailers…')).toBe(true);
    expect(isFirstPerson('Built for the US heavy haul industry.')).toBe(false);
    expect(isFirstPerson('A 33″ loaded deck height for easy loading.')).toBe(false);
  });

  it('flags a maker’s stock opening paragraph', () => {
    expect(
      isBrandBoilerplate('Pitts Trailers is the world’s largest and only complete line forestry manufacturer', 'Pitts Trailers')
    ).toBe(true);
    expect(isBrandBoilerplate('Pitts LB55 carries 55 tons on a 22" deck.', 'Pitts Trailers')).toBe(false);
    expect(isBrandBoilerplate('Anything', null)).toBe(false);
  });
});

describe('correctedTonnage', () => {
  it('takes Fontaine’s rated capacity from its URL', () => {
    expect(
      correctedTonnage({
        name: 'Magnitude 80 MDSR',
        source_url: 'https://www.fontainespecialized.com/compare-trailers/magnitude-80-80-ton-capacity-modular-drop-side-rail-mdsr-3-3-tridem',
        tonnage_min: 15,
        tonnage_max: 15,
      })
    ).toEqual({ tonnage_min: 80, tonnage_max: 80 });
  });

  it('drops a Fontaine axle rating stored as capacity', () => {
    expect(
      correctedTonnage({
        name: 'RENEGADE 20',
        source_url: 'https://www.fontainespecialized.com/compare-trailers/renegade-20-mechanical-flat-double-drop',
        tonnage_min: 13,
        tonnage_max: 13,
      })
    ).toEqual({ tonnage_min: undefined, tonnage_max: undefined });
    expect(
      correctedTonnage({
        name: 'RENEGADE 20',
        source_url: 'https://www.fontainespecialized.com/compare-trailers/renegade-20-mechanical-flat-double-drop',
        tonnage_max: 40,
      })
    ).toEqual({ tonnage_min: undefined, tonnage_max: 40 });
  });

  it('reads a leading range from the name', () => {
    expect(correctedTonnage({ name: '30-55 SRG', tonnage_min: 30, tonnage_max: 30 })).toEqual({
      tonnage_min: 30,
      tonnage_max: 55,
    });
  });

  it('leaves everything else as stored', () => {
    expect(correctedTonnage({ name: 'LB51-26', tonnage_min: 51, tonnage_max: 51 })).toEqual({ tonnage_min: 51, tonnage_max: 51 });
    expect(correctedTonnage({ name: '65FG', tonnage_max: 65 })).toEqual({ tonnage_min: undefined, tonnage_max: 65 });
    expect(
      correctedTonnage({ name: 'RENEGADE 20', source_url: 'https://x.com/renegade-20-mechanical-flat-double-drop', tonnage_max: 40 })
    ).toEqual({ tonnage_min: undefined, tonnage_max: 40 });
  });
});
