'use client';

// A client component on purpose: rendered from the server page, each card's
// full element tree (classNames, inline lucide SVG paths) was serialized into
// the RSC payload a second time (~5 KB per card, ~200 KB for the directory).
// As a client component only these few props cross the wire; the HTML is
// still server-rendered.

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Globe, MapPin, Star, Truck } from 'lucide-react';

export interface ManufacturerCardData {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  short_description: string | null;
  equipment_types: string[] | null;
  headquarters: string | null;
  founded_year: number | null;
  has_website: boolean;
  listing_count: number;
}

export function ManufacturerCard({
  manufacturer,
  featured = false,
}: {
  manufacturer: ManufacturerCardData;
  featured?: boolean;
}) {
  return (
    <Link href={`/manufacturers/${manufacturer.slug}`} className="group">
      <div className={`h-full bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 ${
        featured
          ? 'border-amber-300 dark:border-amber-700 hover:border-amber-400'
          : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-500'
      }`}>
        {/* Manufacturer Header */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md ${
              featured ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-slate-700 to-slate-900'
            }`}>
              {manufacturer.logo_url ? (
                <Image
                  src={manufacturer.logo_url}
                  alt={manufacturer.name}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {manufacturer.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold truncate transition-colors ${
                  featured
                    ? 'text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400'
                    : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                }`}>
                  {manufacturer.name}
                </h3>
                {featured && (
                  <Star className="w-4 h-4 text-amber-500 flex-shrink-0 fill-amber-500" />
                )}
              </div>
              {manufacturer.short_description && (
                <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2">
                  {manufacturer.short_description}
                </p>
              )}
            </div>
          </div>

          {/* Equipment Types & Info */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(manufacturer.equipment_types ?? []).map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type === 'heavy-equipment' ? 'Heavy Equipment' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-600 dark:text-zinc-400">
            {manufacturer.headquarters && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {manufacturer.headquarters}
              </span>
            )}
            {manufacturer.founded_year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Est. {manufacturer.founded_year}
              </span>
            )}
            {manufacturer.has_website && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Website
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t flex items-center justify-between ${
          featured
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50'
            : 'bg-slate-50 dark:bg-zinc-800/50 border-slate-100 dark:border-zinc-800'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              featured ? 'bg-amber-500' : 'bg-slate-900 dark:bg-zinc-600'
            }`}>
              <Truck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
              {manufacturer.listing_count} listings
            </span>
          </div>
          <span className={`text-sm font-medium flex items-center gap-1 transition-colors ${
            featured
              ? 'text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300'
              : 'text-slate-500 dark:text-zinc-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
          }`}>
            View Brand
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
