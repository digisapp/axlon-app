import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { MicrositeProduct } from '@/lib/microsites/resolve';
import { isOptimizerBlockedImage } from '@/lib/images/optimizer-blocked-hosts';
import { TrailerArt } from './TrailerArt';

export function tonnageLabel(min?: number | null, max?: number | null): string | null {
  if (min && max && min !== max) return `${min}–${max} Ton`;
  if (max) return `${max} Ton`;
  if (min) return `${min} Ton`;
  return null;
}

export function primaryImage(product: Pick<MicrositeProduct, 'images'>) {
  return product.images?.find((i) => i.is_primary) || product.images?.[0];
}

export function MicrositeProductCard({
  product,
  showMaker,
  compact = false,
}: {
  product: MicrositeProduct;
  showMaker: boolean;
  compact?: boolean;
}) {
  const image = primaryImage(product);
  const ton = tonnageLabel(product.tonnage_min, product.tonnage_max);
  const maker = Array.isArray(product.manufacturer) ? product.manufacturer[0] : product.manufacturer;
  const chips = [
    product.axle_count ? `${product.axle_count} axle` : null,
    product.deck_length_feet ? `${product.deck_length_feet}′ deck` : null,
    product.deck_height_inches ? `${product.deck_height_inches}″ deck height` : null,
  ].filter(Boolean) as string[];

  return (
    <Link
      href={`/trailers/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-accent)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        {image ? (
          <>
            {/* Catalog shots are mostly cut-outs on white. Cropping them to
                fill (object-cover) sliced the gooseneck or the axles off;
                contain on a soft ground shows the whole trailer. */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100" />
            <Image
              src={image.url}
              alt={image.alt_text || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
              unoptimized={isOptimizerBlockedImage(image.url)}
            />
          </>
        ) : (
          <TrailerArt label={ton} />
        )}
        {ton && image && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow"
            style={{ backgroundColor: 'var(--ms-accent)' }}
          >
            {ton}
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-4' : 'p-5'}`}>
        {showMaker && maker?.name && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {maker.name}
          </p>
        )}
        <h3 className={`font-semibold leading-snug text-slate-900 ${compact ? 'text-sm' : 'text-base'}`}>
          {product.name}
        </h3>
        {!compact && product.short_description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {product.short_description}
          </p>
        )}
        {!compact && chips.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
            {chips.map((c) => (
              <li key={c} className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">
                {c}
              </li>
            ))}
          </ul>
        )}
        <span
          className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold"
          style={{ color: 'var(--ms-accent)' }}
        >
          Specs &amp; pricing
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
