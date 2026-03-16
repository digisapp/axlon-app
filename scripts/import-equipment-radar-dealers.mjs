#!/usr/bin/env node

/**
 * Import trailer dealers scraped from Equipment Radar manufacturer directories.
 * Deduplicates by company name + city + state across manufacturers.
 * Each dealer gets tagged with the brands they carry.
 *
 * Usage: node scripts/import-equipment-radar-dealers.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Raw dealer data by manufacturer ───

const FELLING_DEALERS = [
  { company_name: 'Bobcat of Gwinnett', city: 'Buford', state: 'GA', phone: '(770) 614-6120' },
  { company_name: 'Bobcat of Atlanta', city: 'Atlanta', state: 'GA', phone: '(770) 458-1777' },
  { company_name: 'Ditch Witch Mid-States - Bridgeton', city: 'Bridgeton', state: 'MO', phone: '(314) 739-8700' },
  { company_name: 'Ditch Witch Mid-States - Kansas City', city: 'Kansas City', state: 'MO', phone: '(816) 483-1400' },
  { company_name: 'Ditch Witch Mid-States - Wichita', city: 'Wichita', state: 'KS', phone: '(316) 943-8643' },
  { company_name: 'Ditch Witch Mid-States - Springfield', city: 'Springfield', state: 'MO', phone: '(417) 831-0004' },
  { company_name: 'Ditch Witch Mid-States - Fenton', city: 'Fenton', state: 'MO', phone: '(636) 343-2288' },
  { company_name: 'Ditch Witch of Minnesota & Iowa - Savage', city: 'Savage', state: 'MN', phone: '(952) 890-3072' },
  { company_name: 'Ditch Witch of Minnesota & Iowa - Ham Lake', city: 'Ham Lake', state: 'MN', phone: '(763) 434-6444' },
  { company_name: 'Ditch Witch of Minnesota & Iowa - Bondurant', city: 'Bondurant', state: 'IA', phone: '(515) 957-1516' },
  { company_name: 'Ditch Witch of Minnesota & Iowa - Rochester', city: 'Rochester', state: 'MN', phone: '(507) 285-0501' },
  { company_name: 'National Equipment Dealers - Philadelphia', city: 'Philadelphia', state: 'PA', phone: '(215) 744-0300' },
  { company_name: 'National Equipment Dealers - Baltimore', city: 'Baltimore', state: 'MD', phone: '(410) 247-2345' },
  { company_name: 'National Equipment Dealers - Carlisle', city: 'Carlisle', state: 'PA', phone: '(717) 240-0116' },
  { company_name: 'National Equipment Dealers - Laurel', city: 'Laurel', state: 'MD', phone: '(301) 953-1060' },
  { company_name: 'National Equipment Dealers - Waldorf', city: 'Waldorf', state: 'MD', phone: '(301) 638-5565' },
  { company_name: 'National Equipment Dealers - Sterling', city: 'Sterling', state: 'VA', phone: '(703) 430-8990' },
  { company_name: 'Closner Equipment - Edinburg', city: 'Edinburg', state: 'TX', phone: '(956) 316-6001' },
  { company_name: 'Closner Equipment - San Antonio', city: 'San Antonio', state: 'TX', phone: '(210) 648-9393' },
  { company_name: 'Closner Equipment - Laredo', city: 'Laredo', state: 'TX', phone: '(956) 753-9800' },
  { company_name: 'Closner Equipment - Houston', city: 'Houston', state: 'TX', phone: '(281) 442-4200' },
  { company_name: 'Closner Equipment - Corpus Christi', city: 'Corpus Christi', state: 'TX', phone: '(361) 289-3800' },
  { company_name: 'RDO Equipment - Moorhead', city: 'Moorhead', state: 'MN', phone: '(218) 233-6615' },
  { company_name: 'RDO Equipment - Burnsville', city: 'Burnsville', state: 'MN', phone: '(952) 808-9300' },
  { company_name: 'Alta Equipment - Byron Center', city: 'Byron Center', state: 'MI', phone: '(616) 878-3008' },
  { company_name: 'Alta Equipment - Wixom', city: 'Wixom', state: 'MI', phone: '(248) 684-0808' },
  { company_name: 'Alta Equipment - Traverse City', city: 'Traverse City', state: 'MI', phone: '(231) 946-4036' },
  { company_name: 'Runnion Equipment - Hodgkins', city: 'Hodgkins', state: 'IL', phone: '(708) 579-1055' },
  { company_name: 'Houston Freightliner - Houston', city: 'Houston', state: 'TX', phone: '(713) 672-5161' },
  { company_name: 'Berry Tractor - Topeka', city: 'Topeka', state: 'KS', phone: '(785) 232-4225' },
  { company_name: 'Berry Tractor - Oklahoma City', city: 'Oklahoma City', state: 'OK', phone: '(405) 235-5333' },
  { company_name: 'Hills Machinery - Casar', city: 'Casar', state: 'NC', phone: '(704) 538-9704' },
  { company_name: 'Hills Machinery - Charlotte', city: 'Charlotte', state: 'NC', phone: '(704) 588-2150' },
  { company_name: 'Hills Machinery - Columbia', city: 'Columbia', state: 'SC', phone: '(803) 509-0050' },
  { company_name: 'Herc-U-Lift - Peoria', city: 'Peoria', state: 'IL', phone: '(309) 697-5011' },
  { company_name: 'Herc-U-Lift - Rockford', city: 'Rockford', state: 'IL', phone: '(815) 398-4200' },
  { company_name: 'Bobcat of Chattanooga', city: 'Chattanooga', state: 'TN', phone: '(423) 894-1870' },
  { company_name: 'Calder Brothers - Taylors', city: 'Taylors', state: 'SC', phone: '(864) 268-3230' },
  { company_name: 'Paladin Attachments - Grand Rapids', city: 'Grand Rapids', state: 'MI', phone: '(616) 459-0381' },
  { company_name: 'Ohio CAT - Broadview Heights', city: 'Broadview Heights', state: 'OH', phone: '(440) 546-0055' },
  { company_name: 'Ohio CAT - Massillon', city: 'Massillon', state: 'OH', phone: '(330) 833-7600' },
  { company_name: 'Ohio CAT - Toledo', city: 'Toledo', state: 'OH', phone: '(419) 865-4351' },
  { company_name: 'Ohio CAT - Lima', city: 'Lima', state: 'OH', phone: '(419) 331-9177' },
  { company_name: 'Ohio CAT - Dayton', city: 'Dayton', state: 'OH', phone: '(937) 252-6621' },
  { company_name: 'Ohio CAT - Cincinnati', city: 'Cincinnati', state: 'OH', phone: '(513) 771-3823' },
  { company_name: 'Ohio CAT - Columbus', city: 'Columbus', state: 'OH', phone: '(614) 252-4186' },
  { company_name: 'Ohio CAT - Zanesville', city: 'Zanesville', state: 'OH', phone: '(740) 455-4036' },
  { company_name: 'Anderson Equipment - Bridgeville', city: 'Bridgeville', state: 'PA', phone: '(412) 343-5600' },
  { company_name: 'Anderson Equipment - Clearfield', city: 'Clearfield', state: 'PA', phone: '(814) 765-5311' },
  { company_name: 'Anderson Equipment - Youngstown', city: 'Youngstown', state: 'OH', phone: '(330) 758-8317' },
];

const TRAIL_KING_DEALERS = [
  { company_name: 'Flint Equipment', city: 'Simpsonville', state: 'SC', phone: '(864) 963-5835' },
  { company_name: 'Flint Equipment', city: 'Troy', state: 'AL', phone: '(334) 566-4181' },
  { company_name: 'H & E Equipment Services', city: 'Pompano Beach', state: 'FL', phone: '(954) 781-3099' },
  { company_name: 'H & E Equipment Services', city: 'Winter Garden', state: 'FL', phone: '(407) 905-5344' },
  { company_name: 'H & E Equipment Services', city: 'Charlotte', state: 'NC', phone: '(704) 504-2870' },
  { company_name: 'H & E Equipment Services', city: 'Summerville', state: 'SC', phone: '(843) 879-7010' },
  { company_name: 'H & E Equipment Services', city: 'Arden', state: 'NC', phone: '(828) 684-1692' },
  { company_name: 'Flint Equipment', city: 'Brunswick', state: 'GA', phone: '(912) 264-6161' },
  { company_name: 'H & E Equipment Services', city: 'Midway', state: 'FL', phone: '(850) 222-7444' },
  { company_name: 'Flint Equipment', city: 'Macon', state: 'GA', phone: '(478) 788-1586' },
  { company_name: 'Flint Equipment', city: 'Columbus', state: 'GA', phone: '(706) 687-3344' },
  { company_name: 'Flint Equipment', city: 'West Columbia', state: 'SC', phone: '(803) 794-9340' },
  { company_name: 'H & E Equipment Services', city: 'Fort Walton Beach', state: 'FL', phone: '(850) 244-2444' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Jacksonville', state: 'FL', phone: '(904) 378-1900' },
  { company_name: 'Flint Equipment', city: 'Grovetown', state: 'GA', phone: '(706) 855-5440' },
  { company_name: 'Flint Equipment', city: 'Ladson', state: 'SC', phone: '(843) 572-0400' },
  { company_name: 'Flint Equipment', city: 'Andrews', state: 'SC', phone: '(843) 221-4940' },
  { company_name: 'H & E Equipment Services', city: 'Panama City Beach', state: 'FL', phone: '(850) 236-2444' },
  { company_name: 'H & E Equipment Services', city: 'Opelika', state: 'AL', phone: '(334) 705-8998' },
  { company_name: 'H & E Equipment Services', city: 'Belle Chasse', state: 'LA', phone: '(504) 394-7400' },
  { company_name: 'H & E Equipment Services', city: 'Chattanooga', state: 'TN', phone: '(423) 499-7700' },
  { company_name: 'H & E Equipment Services', city: 'Greer', state: 'SC', phone: '(864) 272-2600' },
  { company_name: 'H & E Equipment Services', city: 'Tampa', state: 'FL', phone: '(813) 635-9688' },
  { company_name: 'H & E Equipment Services', city: 'Garner', state: 'NC', phone: '(919) 781-9454' },
  { company_name: 'H & E Equipment Services', city: 'Kenner', state: 'LA', phone: '(504) 467-5906' },
  { company_name: 'H & E Equipment Services', city: 'Decatur', state: 'GA', phone: '(678) 418-0046' },
  { company_name: 'H & E Equipment Services', city: 'Trussville', state: 'AL', phone: '(205) 661-1323' },
  { company_name: 'H & E Equipment Services', city: 'Wake Forest', state: 'NC', phone: '(919) 373-7100' },
  { company_name: 'Flint Equipment', city: 'Braselton', state: 'GA', phone: '(770) 965-1889' },
  { company_name: 'Doggett', city: 'St Rose', state: 'LA', phone: '(504) 466-5577' },
  { company_name: 'Flint Equipment', city: 'Valdosta', state: 'GA', phone: '(229) 474-6680' },
  { company_name: 'Flint Equipment', city: 'Aynor', state: 'SC', phone: '(843) 358-5688' },
  { company_name: 'Flint Equipment', city: 'Dothan', state: 'AL', phone: '(334) 794-8691' },
  { company_name: 'Flint Equipment', city: 'Atlanta', state: 'GA', phone: '(404) 691-9445' },
  { company_name: 'H & E Equipment Services', city: 'Dothan', state: 'AL', phone: '(334) 984-2444' },
  { company_name: 'H & E Equipment Services', city: 'Durham', state: 'NC', phone: '(919) 973-7900' },
  { company_name: 'H & E Equipment Services', city: 'Savannah', state: 'GA', phone: '(912) 348-7000' },
  { company_name: 'H & E Equipment Services', city: 'New Orleans', state: 'LA', phone: '(504) 689-5200' },
  { company_name: 'H & E Equipment Services', city: 'Columbia', state: 'SC', phone: '(803) 776-8465' },
  { company_name: 'Flint Equipment', city: 'Walterboro', state: 'SC', phone: '(843) 539-1420' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Concord', state: 'NC', phone: '(704) 786-6363' },
  { company_name: 'H & E Equipment Services', city: 'Bessemer', state: 'AL', phone: '(205) 760-7200' },
  { company_name: 'Flint Equipment', city: 'Cuthbert', state: 'GA', phone: '(229) 732-2631' },
  { company_name: 'Flint Equipment', city: 'Garden City', state: 'GA', phone: '(912) 964-7370' },
  { company_name: 'Flint Equipment', city: 'Albany', state: 'GA', phone: '(229) 888-1212' },
  { company_name: 'H & E Equipment Services', city: 'Fort Myers', state: 'FL', phone: '(239) 693-0003' },
  { company_name: 'H & E Equipment Services', city: 'Jacksonville', state: 'FL', phone: '(904) 479-7100' },
  { company_name: 'Flint Equipment', city: 'Adairsville', state: 'GA', phone: '(770) 773-9857' },
  { company_name: 'H & E Equipment Services', city: 'Winston-Salem', state: 'NC', phone: '(336) 767-6900' },
  { company_name: 'H & E Equipment Services', city: 'Suwanee', state: 'GA', phone: '(470) 238-7800' },
];

const TALBERT_DEALERS = [
  { company_name: "Martin's Peterbilt", city: 'Lexington', state: 'KY', phone: '(859) 268-0138' },
  { company_name: "Martin's Peterbilt", city: 'Hurricane', state: 'WV', phone: '(304) 562-7999' },
  { company_name: "Martin's Peterbilt", city: 'Pikeville', state: 'KY', phone: '(606) 437-1777' },
  { company_name: "Martin's Peterbilt", city: 'London', state: 'KY', phone: '(606) 878-6410' },
  { company_name: "Martin's Peterbilt", city: 'Paintsville', state: 'KY', phone: '(606) 297-6237' },
];

const XL_SPECIALIZED_DEALERS = [
  { company_name: 'Superior Trailer Sales', city: 'Pharr', state: 'TX', phone: '(888) 786-9201' },
  { company_name: 'Superior Trailer Sales', city: 'Sunnyvale', state: 'TX', phone: '(972) 226-3893' },
  { company_name: 'Superior Trailer Sales', city: 'Houston', state: 'TX', phone: '(877) 674-2675' },
  { company_name: 'Superior Trailer Sales', city: 'Oklahoma City', state: 'OK', phone: '(405) 789-4451' },
  { company_name: 'Superior Trailer Sales', city: 'Duncanville', state: 'TX', phone: '(214) 742-2471' },
  { company_name: 'Tri-State Trailer Sales', city: 'Pittsburgh', state: 'PA', phone: '(412) 747-7777' },
  { company_name: 'Jim Hawk Truck Trailers', city: 'Sioux City', state: 'IA', phone: '(877) 994-8343' },
  { company_name: 'Jim Hawk Truck Trailers', city: 'Altoona', state: 'IA', phone: '(515) 967-3800' },
  { company_name: 'Tri-State Trailer Sales', city: 'Lancaster', state: 'PA', phone: '(717) 569-4531' },
  { company_name: 'Jim Hawk Truck Trailers', city: 'Kansas City', state: 'MO', phone: '(816) 241-9200' },
  { company_name: 'Tri-State Trailer Sales', city: 'West Chester Township', state: 'OH', phone: '(513) 874-4880' },
  { company_name: 'Jim Hawk Truck Trailers', city: 'Chicago', state: 'IL', phone: '(708) 458-8133' },
  { company_name: 'Jim Hawk Truck Trailers', city: 'Sioux Falls', state: 'SD', phone: '(605) 338-6365' },
  { company_name: 'Superior Trailer Sales', city: 'Tulsa', state: 'OK', phone: '(918) 447-9378' },
  { company_name: 'Jim Hawk Truck Trailers', city: 'Davenport', state: 'IA', phone: '(563) 386-2990' },
  { company_name: 'Tri-State Trailer Sales', city: 'Hubbard', state: 'OH', phone: '(330) 534-0082' },
  { company_name: 'Jim Hawk Truck Trailers', city: 'Council Bluffs', state: 'IA', phone: '(712) 366-2241' },
  { company_name: 'Superior Trailer Sales', city: 'New Braunfels', state: 'TX', phone: '(830) 629-2822' },
  { company_name: 'Jim Hawk Truck Trailers', city: 'Morton', state: 'IL', phone: '(309) 694-6271' },
];

const FONTAINE_DEALERS = [
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Elkton', state: 'MD', phone: '(410) 620-6118' },
  { company_name: 'Fleet Equipment', city: 'Nashville', state: 'TN', phone: '(615) 259-3301' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'North Little Rock', state: 'AR', phone: '(501) 653-7770' },
  { company_name: 'Superior Trailer Sales', city: 'Pharr', state: 'TX', phone: '(888) 786-9201' },
  { company_name: 'Superior Trailer Sales', city: 'Sunnyvale', state: 'TX', phone: '(972) 226-3893' },
  { company_name: 'Florida Utility Trailers', city: 'Hialeah', state: 'FL', phone: '(305) 888-0020' },
  { company_name: 'Great Western Leasing & Sales', city: 'Houston', state: 'TX', phone: '(888) 227-2488' },
  { company_name: 'TNT Sales', city: 'Villa Ridge', state: 'MO', phone: '(636) 451-2100' },
  { company_name: 'Superior Trailer Sales', city: 'Houston', state: 'TX', phone: '(877) 674-2675' },
  { company_name: 'Superior Trailer Sales', city: 'Oklahoma City', state: 'OK', phone: '(405) 789-4451' },
  { company_name: 'Superior Trailer Sales', city: 'Duncanville', state: 'TX', phone: '(214) 742-2471' },
  { company_name: 'Florida Utility Trailers', city: 'Apopka', state: 'FL', phone: '(407) 880-2211' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Jacksonville', state: 'FL', phone: '(904) 378-1900' },
  { company_name: 'Tri-State Trailer Sales', city: 'Pittsburgh', state: 'PA', phone: '(412) 747-7777' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Portland', state: 'ME', phone: '(207) 772-8272' },
  { company_name: 'Florida Utility Trailers', city: 'Tampa', state: 'FL', phone: '(813) 985-8546' },
  { company_name: 'Tri-State Trailer Sales', city: 'Lancaster', state: 'PA', phone: '(717) 569-4531' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Delmar', state: 'DE', phone: '(302) 877-0613' },
  { company_name: 'Florida Utility Trailers', city: 'Lakeland', state: 'FL', phone: '(863) 984-5152' },
  { company_name: 'Tri-State Trailer Sales', city: 'West Chester Township', state: 'OH', phone: '(513) 874-4880' },
  { company_name: 'Fleet Equipment', city: 'Garland', state: 'TX', phone: '(214) 396-7000' },
  { company_name: 'Superior Trailer Sales', city: 'Tulsa', state: 'OK', phone: '(918) 447-9378' },
  { company_name: 'Great Western Leasing & Sales', city: 'Dallas', state: 'TX', phone: '(214) 630-7051' },
  { company_name: 'TNT Sales', city: 'Kansas City', state: 'MO', phone: '(816) 340-6760' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Concord', state: 'NC', phone: '(704) 786-6363' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Springfield', state: 'MA', phone: '(413) 731-9300' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Allentown', state: 'PA', phone: '(610) 395-0371' },
  { company_name: 'Fleet Equipment', city: 'Belden', state: 'MS', phone: '(662) 350-0708' },
  { company_name: 'Tri-State Trailer Sales', city: 'Hubbard', state: 'OH', phone: '(330) 534-0082' },
  { company_name: 'Great Western Leasing & Sales', city: 'Dearborn', state: 'MI', phone: '(313) 584-6879' },
  { company_name: 'Joseph Equipment', city: 'Manchester', state: 'NH', phone: '(603) 641-8608' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Voorhees Township', state: 'NJ', phone: '(856) 768-1330' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Jessup', state: 'PA', phone: '(570) 383-7101' },
  { company_name: 'Superior Trailer Sales', city: 'New Braunfels', state: 'TX', phone: '(830) 629-2822' },
  { company_name: 'Fleet Equipment', city: 'Memphis', state: 'TN', phone: '(901) 332-3381' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Walpole', state: 'MA', phone: '(508) 668-1582' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'Baltimore', state: 'MD', phone: '(410) 355-9410' },
  { company_name: 'TNT Sales', city: 'Belle Vernon', state: 'PA', phone: '(724) 426-2917' },
  { company_name: 'Hale Trailer, Brake & Wheel', city: 'West Berlin', state: 'NJ', phone: '(856) 768-1330' },
];

const EAGER_BEAVER_DEALERS = [
  { company_name: 'Trekker Group', city: 'Orlando', state: 'FL', phone: '(407) 888-0024' },
  { company_name: 'State Equipment', city: 'Parkersburg', state: 'WV', phone: '(304) 422-4093' },
  { company_name: 'State Equipment', city: 'Ashland', state: 'KY', phone: '(606) 928-5644' },
  { company_name: 'State Equipment', city: 'Bridgeport', state: 'WV', phone: '(877) 821-5322' },
  { company_name: 'State Equipment', city: 'Buckhannon', state: 'WV', phone: '(304) 472-5619' },
  { company_name: 'Trekker Group', city: 'Lake Worth', state: 'FL', phone: '(561) 296-9710' },
  { company_name: 'TranSource Truck & Equipment', city: 'Sioux Falls', state: 'SD', phone: '(605) 336-2000' },
  { company_name: 'H & V Equipment Services', city: 'Progreso', state: 'TX', phone: '(956) 565-3788' },
  { company_name: 'H & V Equipment Services', city: 'San Antonio', state: 'TX', phone: '(210) 648-5885' },
  { company_name: 'Beauregard Equipment', city: 'Knox', state: 'ME', phone: '(207) 568-3245' },
  { company_name: 'State Equipment', city: 'Cross Lanes', state: 'WV', phone: '(877) 821-5322' },
  { company_name: 'State Equipment', city: 'Beaver', state: 'WV', phone: '(304) 252-5300' },
  { company_name: 'Schmidt Equipment', city: 'Swansea', state: 'MA', phone: '(508) 379-9810' },
  { company_name: 'Schmidt Equipment', city: 'North Billerica', state: 'MA', phone: '(978) 667-4345' },
  { company_name: 'Beauregard Equipment', city: 'Colchester', state: 'VT', phone: '(802) 893-1555' },
  { company_name: 'Trekker Group', city: 'Tampa', state: 'FL', phone: '(813) 341-4646' },
  { company_name: 'H & V Equipment Services', city: 'Corpus Christi', state: 'TX', phone: '(361) 241-1000' },
  { company_name: 'Schmidt Equipment', city: 'Plymouth', state: 'MA', phone: '(508) 830-9997' },
  { company_name: '4 Rivers Equipment', city: 'Hobbs', state: 'NM', phone: '(575) 392-6923' },
  { company_name: 'Trekker Group', city: 'Fort Myers', state: 'FL', phone: '(239) 690-0661' },
  { company_name: 'Trekker Group', city: 'Hialeah Gardens', state: 'FL', phone: '(305) 821-2273' },
  { company_name: 'Beauregard Equipment', city: 'Concord', state: 'NH', phone: '(603) 225-6621' },
  { company_name: 'Schmidt Equipment', city: 'Springfield', state: 'MA', phone: '(413) 543-5595' },
  { company_name: 'Beauregard Equipment', city: 'Scarborough', state: 'ME', phone: '(207) 885-0600' },
  { company_name: 'Schmidt Equipment', city: 'North Oxford', state: 'MA', phone: '(508) 987-8786' },
  { company_name: 'Trekker Group', city: 'Jacksonville', state: 'FL', phone: '(904) 516-5380' },
  { company_name: 'Beauregard Equipment', city: 'Hermon', state: 'ME', phone: '(207) 848-2050' },
];

const PITTS_DEALERS = [
  { company_name: 'Jackson Truck & Trailer', city: 'Baton Rouge', state: 'LA', phone: '(225) 929-9866' },
  { company_name: 'Rechtien International Trucks', city: 'Fort Pierce', state: 'FL', phone: '(772) 466-1842' },
  { company_name: 'Jackson Truck & Trailer', city: 'Kenner', state: 'LA', phone: '(504) 733-0037' },
  { company_name: 'Rechtien International Trucks', city: 'Fort Myers', state: 'FL', phone: '(239) 334-1000' },
  { company_name: 'Jackson Truck & Trailer', city: 'Hammond', state: 'LA', phone: '(985) 345-9859' },
  { company_name: 'Rechtien International Trucks', city: 'Fort Lauderdale', state: 'FL', phone: '(954) 957-8390' },
  { company_name: 'Rechtien International Trucks', city: 'Miami', state: 'FL', phone: '(305) 888-0111' },
  { company_name: 'Rechtien International Trucks', city: 'Riviera Beach', state: 'FL', phone: '(561) 882-9050' },
];

const ETNYRE_DEALERS = [
  { company_name: 'Tractor & Equipment Co', city: 'Kennesaw', state: 'GA', phone: '(678) 354-5533' },
  { company_name: 'Linder', city: 'Fort Myers', state: 'FL', phone: '(239) 337-1313' },
  { company_name: 'Linder', city: 'Wilmington', state: 'NC', phone: '(910) 254-2031' },
  { company_name: 'Cowin Equipment', city: 'Birmingham', state: 'AL', phone: '(205) 841-6666' },
  { company_name: 'Tractor & Equipment Co', city: 'Tuscaloosa', state: 'AL', phone: '(205) 752-0621' },
  { company_name: 'Tractor & Equipment Co', city: 'Pensacola', state: 'FL', phone: '(850) 505-0550' },
  { company_name: 'Tractor & Equipment Co', city: 'Macon', state: 'GA', phone: '(478) 745-6891' },
  { company_name: 'Tractor & Equipment Co', city: 'Hoschton', state: 'GA', phone: '(706) 654-9850' },
  { company_name: 'Tractor & Equipment Co', city: 'Forest Park', state: 'GA', phone: '(404) 366-0693' },
  { company_name: 'Tractor & Equipment Co', city: 'Decatur', state: 'AL', phone: '(256) 355-0305' },
  { company_name: 'Linder', city: 'Jacksonville', state: 'FL', phone: '(904) 786-6710' },
  { company_name: 'Linder', city: 'Asheville', state: 'NC', phone: '(828) 681-5172' },
  { company_name: 'Cowin Equipment', city: 'Pensacola', state: 'FL', phone: '(850) 479-3004' },
  { company_name: 'Linder', city: 'Raleigh', state: 'NC', phone: '(919) 851-2184' },
  { company_name: 'Linder', city: 'West Columbia', state: 'SC', phone: '(803) 794-6150' },
  { company_name: 'Doggett', city: 'Covington', state: 'LA', phone: '(985) 893-3005' },
  { company_name: 'Tractor & Equipment Co', city: 'Pooler', state: 'GA', phone: '(912) 330-7500' },
  { company_name: 'Cowin Equipment', city: 'Montgomery', state: 'AL', phone: '(334) 262-6642' },
  { company_name: 'Linder', city: 'Ladson', state: 'SC', phone: '(843) 486-8080' },
  { company_name: 'Cowin Equipment', city: 'Oxford', state: 'AL', phone: '(256) 832-5053' },
  { company_name: 'Tractor & Equipment Co', city: 'Alabaster', state: 'AL', phone: '(205) 621-2489' },
  { company_name: 'Tractor & Equipment Co', city: 'Birmingham', state: 'AL', phone: '(205) 591-2131' },
  { company_name: 'Tractor & Equipment Co', city: 'Panama City', state: 'FL', phone: '(850) 763-4654' },
  { company_name: 'Tractor & Equipment Co', city: 'Montgomery', state: 'AL', phone: '(334) 288-6580' },
  { company_name: 'Doggett', city: 'St Rose', state: 'LA', phone: '(504) 466-5577' },
  { company_name: 'Doggett', city: 'Monroe', state: 'LA', phone: '(318) 343-8787' },
  { company_name: 'Linder', city: 'Plant City', state: 'FL', phone: '(813) 754-2727' },
  { company_name: 'Linder', city: 'Riviera Beach', state: 'FL', phone: '(561) 863-0570' },
  { company_name: 'Linder', city: 'Pembroke Pines', state: 'FL', phone: '(954) 433-2800' },
  { company_name: 'Tractor & Equipment Co', city: 'Columbus', state: 'GA', phone: '(706) 562-1801' },
  { company_name: 'Cowin Equipment', city: 'Tuscaloosa', state: 'AL', phone: '(205) 848-4147' },
  { company_name: 'Tractor & Equipment Co', city: 'Oxford', state: 'AL', phone: '(256) 831-2440' },
  { company_name: 'Doggett', city: 'Baton Rouge', state: 'LA', phone: '(225) 291-3750' },
  { company_name: 'Cowin Equipment', city: 'Mobile', state: 'AL', phone: '(251) 633-4020' },
  { company_name: 'Tractor & Equipment Co', city: 'Dothan', state: 'AL', phone: '(334) 678-1832' },
  { company_name: 'Tractor & Equipment Co', city: 'Huntsville', state: 'AL', phone: '(256) 837-6767' },
  { company_name: 'Linder', city: 'Greenville', state: 'NC', phone: '(252) 695-6200' },
  { company_name: 'Tractor & Equipment Co', city: 'Augusta', state: 'GA', phone: '(706) 798-7777' },
  { company_name: 'Linder', city: 'Concord', state: 'NC', phone: '(980) 777-8345' },
  { company_name: 'Cowin Equipment', city: 'Mableton', state: 'GA', phone: '(404) 696-7210' },
  { company_name: 'Doggett', city: 'Alexandria', state: 'LA', phone: '(318) 442-0455' },
  { company_name: 'Cowin Equipment', city: 'Madison', state: 'AL', phone: '(256) 536-9390' },
  { company_name: 'Doggett', city: 'Broussard', state: 'LA', phone: '(337) 837-9481' },
  { company_name: 'Linder', city: 'Greer', state: 'SC', phone: '(864) 877-8962' },
  { company_name: 'Linder', city: 'Orlando', state: 'FL', phone: '(407) 849-6560' },
  { company_name: 'Linder', city: 'Greensboro', state: 'NC', phone: '(336) 665-0110' },
  { company_name: 'Tractor & Equipment Co', city: 'Albany', state: 'GA', phone: '(229) 435-0982' },
  { company_name: 'Tractor & Equipment Co', city: 'Calhoun', state: 'GA', phone: '(706) 879-6200' },
  { company_name: 'Tractor & Equipment Co', city: 'Mobile', state: 'AL', phone: '(251) 457-8991' },
  { company_name: 'Linder', city: 'Ocala', state: 'FL', phone: '(352) 629-7585' },
];

const LOAD_KING_DEALERS = [
  { company_name: 'RDO Truck Centers', city: 'Lincoln', state: 'NE', phone: '(402) 475-8471' },
  { company_name: 'RDO Truck Centers', city: 'Fargo', state: 'ND', phone: '(701) 282-5400' },
  { company_name: 'RDO Truck Centers', city: 'Dickinson', state: 'ND', phone: '(701) 264-3580' },
  { company_name: 'Lyle Machinery', city: 'Pensacola', state: 'FL', phone: '(850) 483-5868' },
  { company_name: 'Lyle Machinery', city: 'Summit', state: 'MS', phone: '(601) 276-5866' },
  { company_name: 'RDO Truck Centers', city: 'Bismarck', state: 'ND', phone: '(701) 557-9240' },
  { company_name: 'Lyle Machinery', city: 'Hattiesburg', state: 'MS', phone: '(601) 296-7556' },
  { company_name: 'RDO Truck Centers', city: 'Omaha', state: 'NE', phone: '(402) 331-7700' },
  { company_name: 'Lyle Machinery', city: 'Beaumont', state: 'TX', phone: '(409) 835-2200' },
  { company_name: 'Lyle Machinery', city: 'Saucier', state: 'MS', phone: '(228) 832-7575' },
  { company_name: 'RDO Truck Centers', city: 'Grand Forks', state: 'ND', phone: '(701) 775-2591' },
  { company_name: 'Lyle Machinery', city: 'Lake Charles', state: 'LA', phone: '(337) 433-4500' },
  { company_name: 'RDO Truck Centers', city: 'Lexington', state: 'NE', phone: '(308) 324-7442' },
  { company_name: 'Road Machinery & Supplies', city: 'East Moline', state: 'IL', phone: '(309) 755-7203' },
  { company_name: 'Lyle Machinery', city: 'Prattville', state: 'AL', phone: '(334) 717-2175' },
  { company_name: 'Road Machinery & Supplies', city: 'Negaunee', state: 'MI', phone: '(906) 475-6488' },
  { company_name: 'Road Machinery & Supplies', city: 'Bondurant', state: 'IA', phone: '(515) 282-0404' },
  { company_name: 'RDO Truck Centers', city: 'Norfolk', state: 'NE', phone: '(402) 371-7990' },
  { company_name: 'Road Machinery & Supplies', city: 'Virginia', state: 'MN', phone: '(218) 741-9011' },
  { company_name: 'Road Machinery & Supplies', city: 'Sioux City', state: 'IA', phone: '(712) 252-0538' },
  { company_name: 'Road Machinery & Supplies', city: 'Duluth', state: 'MN', phone: '(218) 727-8611' },
  { company_name: 'Road Machinery & Supplies', city: 'Cedar Rapids', state: 'IA', phone: '(319) 363-9655' },
  { company_name: 'Road Machinery & Supplies', city: 'Savage', state: 'MN', phone: '(952) 895-9595' },
  { company_name: 'Lyle Machinery', city: 'Columbus', state: 'MS', phone: '(662) 243-2152' },
  { company_name: 'Lyle Machinery', city: 'Richland', state: 'MS', phone: '(800) 898-4000' },
];

const TRANSCRAFT_DEALERS = [
  { company_name: 'Southland Transportation Group', city: 'Montgomery', state: 'AL', phone: '(334) 832-4102' },
  { company_name: 'Quality Trailer Sales', city: 'Morton', state: 'IL', phone: '(309) 263-8858' },
  { company_name: 'Quality Trailer Sales', city: 'Milan', state: 'IL', phone: '(309) 787-2179' },
  { company_name: 'Quality Trailer Sales', city: 'Minneapolis', state: 'MN', phone: '(763) 780-8487' },
  { company_name: 'Twin State Trailers', city: 'Orlando', state: 'FL', phone: '(407) 851-4100' },
  { company_name: 'Twin State Trailers', city: 'Greensboro', state: 'NC', phone: '(336) 542-5990' },
  { company_name: 'Twin State Trailers', city: 'Conover', state: 'NC', phone: '(828) 464-5597' },
  { company_name: 'Twin State Trailers', city: 'Charlotte', state: 'NC', phone: '(704) 295-4259' },
  { company_name: 'Twin State Trailers', city: 'Auburndale', state: 'FL', phone: '(863) 968-9393' },
  { company_name: 'Twin State Trailers', city: 'Tampa', state: 'FL', phone: '(813) 621-6484' },
  { company_name: 'Apex Trailer Service & Sales', city: 'Indianapolis', state: 'IN', phone: '(317) 780-8601' },
  { company_name: 'Apex Trailer Service & Sales', city: 'Evansville', state: 'IN', phone: '(812) 867-9682' },
  { company_name: 'Apex Trailer Service & Sales', city: 'Jeffersonville', state: 'IN', phone: '(812) 282-3200' },
  { company_name: 'Apex Trailer Service & Sales', city: 'Nicholasville', state: 'KY', phone: '(888) 604-8363' },
  { company_name: 'Excel Trailer', city: 'Roanoke', state: 'VA', phone: '(540) 777-7700' },
  { company_name: 'Excel Truck Group', city: 'Weyers Cave', state: 'VA', phone: '(540) 234-0999' },
  { company_name: 'Excel Truck Group', city: 'Chester', state: 'VA', phone: '(804) 768-4600' },
  { company_name: 'Southland Transportation Group', city: 'Tuscaloosa', state: 'AL', phone: '(205) 556-4343' },
  { company_name: 'Southland Transportation Group', city: 'Birmingham', state: 'AL', phone: '(205) 254-1821' },
  { company_name: 'Southland Transportation Group', city: 'Madison', state: 'AL', phone: '(256) 859-0346' },
  { company_name: 'Southland Transportation Group', city: 'Homewood', state: 'AL', phone: '(205) 942-6226' },
  { company_name: 'Girard Equipment', city: 'Girard', state: 'OH', phone: '(330) 545-2575' },
  { company_name: 'Intermountain Trailer', city: 'Henderson', state: 'CO', phone: '(303) 329-8550' },
];

const EAST_MFG_DEALERS = [
  { company_name: 'M & K Truck Centers', city: 'Holland', state: 'MI', phone: '(616) 393-5021' },
  { company_name: 'Landmark Trucks', city: 'Knoxville', state: 'TN', phone: '(865) 637-4881' },
  { company_name: 'M & K Truck Centers', city: 'Flint', state: 'MI', phone: '(810) 239-8300' },
  { company_name: 'M & K Truck Centers', city: 'Byron Center', state: 'MI', phone: '(616) 583-2100' },
  { company_name: 'Pinnacle Trailers', city: 'Wilmington', state: 'NC', phone: '(910) 342-0445' },
  { company_name: 'M & K Truck Centers', city: 'Channahon', state: 'IL', phone: '(815) 521-1900' },
  { company_name: 'M & K Truck Centers', city: 'Gary', state: 'IN', phone: '(219) 883-8581' },
  { company_name: 'M & K Truck Centers', city: 'Kalamazoo', state: 'MI', phone: '(269) 585-8500' },
  { company_name: 'M & K Truck Centers', city: 'Romulus', state: 'MI', phone: '(734) 403-6970' },
  { company_name: 'M & K Truck Centers', city: 'South Chicago Heights', state: 'IL', phone: '(708) 755-8500' },
  { company_name: 'M & K Truck Centers', city: 'Des Plaines', state: 'IL', phone: '(708) 343-4980' },
  { company_name: 'Pinnacle Trailers', city: 'St George', state: 'SC', phone: '(843) 636-6062' },
  { company_name: 'M & K Truck Centers', city: 'Dunmore', state: 'PA', phone: '(800) 551-6976' },
  { company_name: 'Pinnacle Trailers', city: 'Spartanburg', state: 'SC', phone: '(864) 208-0670' },
  { company_name: 'M & K Truck Centers', city: 'Alsip', state: 'IL', phone: '(708) 371-7010' },
  { company_name: 'M & K Truck Centers', city: 'South Bend', state: 'IN', phone: '(574) 282-1230' },
  { company_name: 'M & K Truck Centers', city: 'Frankfort', state: 'IN', phone: '(765) 601-9300' },
  { company_name: 'M & K Truck Centers', city: 'Smithton', state: 'PA', phone: '(800) 875-5001' },
  { company_name: 'Landmark Trucks', city: 'Morristown', state: 'TN', phone: '(423) 586-8558' },
  { company_name: 'Landmark Trucks', city: 'Cookeville', state: 'TN', phone: '(931) 738-0480' },
  { company_name: 'M & K Truck Centers', city: 'Summit', state: 'IL', phone: '(708) 594-5151' },
  { company_name: 'M & K Truck Centers', city: 'Sterling Heights', state: 'MI', phone: '(586) 977-8200' },
  { company_name: 'M & K Truck Centers', city: 'Indianapolis', state: 'IN', phone: '(317) 784-3740' },
];

const TRAIL_EZE_DEALERS = [
  { company_name: 'Great Western Leasing & Sales', city: 'Fontana', state: 'CA', phone: '(800) 500-0827' },
  { company_name: 'Great Western Leasing & Sales', city: 'Phoenix', state: 'AZ', phone: '(623) 404-0771' },
  { company_name: 'Great Western Leasing & Sales', city: 'Grants Pass', state: 'OR', phone: '(541) 471-4450' },
  { company_name: 'Great Western Leasing & Sales', city: 'Albuquerque', state: 'NM', phone: '(505) 833-5000' },
  { company_name: 'Great Western Leasing & Sales', city: 'West Valley City', state: 'UT', phone: '(800) 211-2811' },
];

// ─── Dedicated heavy haul trailer dealers found from manufacturer top-dealer lists and web research ───

const CURATED_HEAVY_HAUL_DEALERS = [
  // Lucky's Trailer Sales - 9 locations across VT, NH, NY. Brands: Dorsey, Eager Beaver, Felling, Landoll, Liddell, Talbert, Trail King, Reitnouer
  { company_name: "Lucky's Trailer Sales", city: 'South Royalton', state: 'VT', phone: '(800) 639-7383' },
  { company_name: "Lucky's Trailer Sales", city: 'Colchester', state: 'VT', phone: '(800) 639-7383' },
  { company_name: "Lucky's Trailer Sales", city: 'Bow', state: 'NH', phone: '(800) 639-7383' },
  { company_name: "Lucky's Trailer Sales", city: 'Albany', state: 'NY', phone: '(800) 639-7383' },
  { company_name: "Lucky's Trailer Sales", city: 'Newburgh', state: 'NY', phone: '(800) 639-7383' },
  { company_name: "Lucky's Trailer Sales", city: 'Owego', state: 'NY', phone: '(800) 639-7383' },
  { company_name: "Lucky's Trailer Sales", city: 'Rochester', state: 'NY', phone: '(800) 639-7383' },
  { company_name: "Lucky's Trailer Sales", city: 'Syracuse', state: 'NY', phone: '(800) 639-7383' },
  { company_name: "Lucky's Trailer Sales", city: 'Utica', state: 'NY', phone: '(800) 639-7383' },
  // Reno's Trailer Sales - 5 locations. Brands: Fontaine, Transcraft, Talbert, Dorsey, Benson
  { company_name: "Reno's Trailer Sales & Rental", city: 'Belle Vernon', state: 'PA', phone: '(724) 929-7360' },
  { company_name: "Reno's Trailer Sales & Rental", city: 'Villa Ridge', state: 'MO', phone: '(636) 451-2100' },
  { company_name: "Reno's Trailer Sales & Rental", city: 'Kansas City', state: 'MO', phone: '(816) 770-7027' },
  { company_name: "Reno's Trailer Sales & Rental", city: 'Haleyville', state: 'AL', phone: '(205) 650-1634' },
  { company_name: "Reno's Trailer Sales & Rental", city: 'Cadiz', state: 'KY', phone: '(636) 451-2100' },
  // Blackburn Truck Equipment - Lilburn, GA. Brands: Landoll, Manac, Pitts, Talbert, Trail King, Trail-Eze
  { company_name: 'Blackburn Truck Equipment', city: 'Lilburn', state: 'GA', phone: '(770) 921-6070' },
  // Liddell Industries - Brownwood, TX. Manufacturer/dealer of heavy haul, lowboy, oilfield trailers
  { company_name: 'Liddell Industries', city: 'Brownwood', state: 'TX', phone: '(325) 646-7581' },
  // Utility Trailers of New England - Witzco Challenger dealer
  { company_name: 'Utility Trailers of New England', city: 'Seabrook', state: 'NH', phone: '(800) 346-8748' },
  { company_name: 'Utility Trailers of New England', city: 'North Oxford', state: 'MA', phone: '(877) 941-4040' },
  // Amston Trailer Sales - XL Specialized dealer
  { company_name: 'Amston Trailer Sales', city: 'Caledonia', state: 'WI', phone: '(262) 474-6004' },
  { company_name: 'Amston Trailer Sales', city: 'Lebanon', state: 'IN', phone: '(317) 593-7009' },
  // Wagner Equipment - XL Specialized dealer in CO, NM, TX
  { company_name: 'Wagner Equipment Co', city: 'Aurora', state: 'CO', phone: '(303) 739-3000' },
  // Freightliner Northwest - XL Specialized dealer
  { company_name: 'Freightliner Northwest', city: 'Portland', state: 'OR', phone: '(503) 283-2522' },
  // Don Baskin Truck Sales - Witzco dealer
  { company_name: 'Don Baskin Truck Sales', city: 'Covington', state: 'TN', phone: '(901) 476-2795' },
  // Wallwork Trucks - XL Specialized dealer
  { company_name: 'Wallwork Truck Center', city: 'Fargo', state: 'ND', phone: '(701) 282-8711' },
  { company_name: 'Wallwork Truck Center', city: 'Bismarck', state: 'ND', phone: '(701) 250-4700' },
];

const FELLING_PAGE2_DEALERS = [
  { company_name: 'Highway Equipment', city: 'Troutville', state: 'VA', phone: '(540) 992-4150' },
  { company_name: 'Highway Equipment', city: 'Concord', state: 'NC', phone: '(980) 781-4510' },
  { company_name: 'Leslie Equipment', city: 'Pikeville', state: 'KY', phone: '(606) 432-0321' },
  { company_name: 'Leslie Equipment', city: 'Beaver', state: 'WV', phone: '(304) 255-1525' },
  { company_name: 'H & E Equipment Services', city: 'Baton Rouge', state: 'LA', phone: '(225) 298-5200' },
  { company_name: 'H & E Equipment Services', city: 'Jackson', state: 'MS', phone: '(601) 373-0444' },
  { company_name: 'H & E Equipment Services', city: 'Broussard', state: 'LA', phone: '(337) 837-9600' },
  { company_name: 'H & E Equipment Services', city: 'Nashville', state: 'TN', phone: '(615) 248-0266' },
  { company_name: 'H & E Equipment Services', city: 'Chesapeake', state: 'VA', phone: '(757) 295-4944' },
  { company_name: 'H & E Equipment Services', city: 'Madison', state: 'AL', phone: '(256) 774-2700' },
];

// ─── Manufacturer → brand mapping ───
const MANUFACTURER_BRANDS = {
  FELLING: 'Felling',
  TRAIL_KING: 'Trail King',
  TALBERT: 'Talbert',
  XL_SPECIALIZED: 'XL Specialized',
  FONTAINE: 'Fontaine',
  EAGER_BEAVER: 'Eager Beaver',
  PITTS: 'Pitts',
  ETNYRE: 'Etnyre',
  LOAD_KING: 'Load King',
  TRANSCRAFT: 'Transcraft',
  EAST: 'East Manufacturing',
  TRAIL_EZE: 'Trail-Eze',
};

// ─── Deduplicate across manufacturers and merge brands ───
function deduplicateAndMergeBrands() {
  const allEntries = [
    ...FELLING_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.FELLING })),
    ...TRAIL_KING_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.TRAIL_KING })),
    ...TALBERT_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.TALBERT })),
    ...XL_SPECIALIZED_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.XL_SPECIALIZED })),
    ...FONTAINE_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.FONTAINE })),
    ...EAGER_BEAVER_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.EAGER_BEAVER })),
    ...PITTS_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.PITTS })),
    ...ETNYRE_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.ETNYRE })),
    ...LOAD_KING_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.LOAD_KING })),
    ...TRANSCRAFT_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.TRANSCRAFT })),
    ...EAST_MFG_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.EAST })),
    ...TRAIL_EZE_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.TRAIL_EZE })),
    ...FELLING_PAGE2_DEALERS.map(d => ({ ...d, brand: MANUFACTURER_BRANDS.FELLING })),
    ...CURATED_HEAVY_HAUL_DEALERS.map(d => ({ ...d, brand: 'Multiple' })),
  ];

  console.log(`Total raw entries: ${allEntries.length}`);

  // Key: normalized company_name + city + state
  const merged = new Map();

  for (const entry of allEntries) {
    const key = `${entry.company_name.toLowerCase().trim()}|${entry.city.toLowerCase().trim()}|${entry.state.toLowerCase().trim()}`;

    if (merged.has(key)) {
      const existing = merged.get(key);
      if (!existing.brands.includes(entry.brand)) {
        existing.brands.push(entry.brand);
      }
    } else {
      merged.set(key, {
        company_name: entry.company_name,
        city: entry.city,
        state: entry.state,
        phone: entry.phone,
        brands: [entry.brand],
      });
    }
  }

  return Array.from(merged.values());
}

// ─── Main ───
async function main() {
  const dealers = deduplicateAndMergeBrands();
  console.log(`Unique dealer locations after dedup: ${dealers.length}`);

  // Build records for business_directory
  const records = dealers.map(d => ({
    source: 'equipment_radar',
    source_id: `${d.company_name}-${d.city}-${d.state}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    company_name: d.company_name,
    category: 'trailer_dealer',
    phone: d.phone || null,
    city: d.city,
    state: d.state,
    country: 'US',
    description: `Authorized dealer for ${d.brands.join(', ')} trailers.`,
    brands: d.brands,
    equipment_types: ['Lowboy Trailers', 'Flatbed Trailers', 'Drop Deck Trailers'],
    tags: ['trailer-dealer', 'heavy-haul', 'equipment-radar'],
  }));

  // Show brand distribution
  const brandCounts = {};
  dealers.forEach(d => d.brands.forEach(b => { brandCounts[b] = (brandCounts[b] || 0) + 1; }));
  console.log('\nBrand distribution:');
  Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} locations`);
  });

  // Show multi-brand dealers
  const multiBrand = dealers.filter(d => d.brands.length > 1);
  console.log(`\nMulti-brand dealers: ${multiBrand.length}`);
  multiBrand.slice(0, 10).forEach(d => {
    console.log(`  ${d.company_name} (${d.city}, ${d.state}): ${d.brands.join(', ')}`);
  });

  // Clear existing equipment_radar records
  console.log('\nClearing existing equipment_radar records...');
  const { error: delError } = await supabase.from('business_directory').delete().eq('source', 'equipment_radar');
  if (delError) console.error('Delete error:', delError.message);

  // Insert in batches
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from('business_directory')
      .insert(batch)
      .select('id');

    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message);
    } else {
      inserted += data?.length || 0;
    }
    process.stdout.write(`\rInserted ${inserted}/${records.length}...`);
  }

  console.log(`\n\nDone! Inserted ${inserted} dealer locations from Equipment Radar.`);

  // Show overall directory stats
  const { data: stats } = await supabase.rpc('get_directory_stats');
  if (stats) {
    console.log('\nDirectory stats:');
    console.log(`  Total: ${stats.total}`);
    console.log(`  With email: ${stats.with_email}`);
    console.log(`  By source:`, JSON.stringify(stats.by_source, null, 4));
    console.log(`  By category:`, JSON.stringify(stats.by_category, null, 4));
  }
}

main().catch(console.error);
