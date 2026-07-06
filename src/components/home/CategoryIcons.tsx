import type { SVGProps } from 'react';

/**
 * Custom side-profile equipment silhouettes for the homepage category tiles.
 * Lucide has no lowboy/semi-tractor shapes, so these are drawn in-house on a
 * shared 64x40 viewBox (wide aspect suits trucks/trailers) and inherit color
 * via currentColor.
 */

export function LowboyTrailerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M1 12 H13 L17 23 H39 L43 16 H63 V21 H45 L41 28 H15 L11 18 H1 Z" />
      <circle cx="47.5" cy="27" r="5.5" />
      <circle cx="58" cy="27" r="5.5" />
    </svg>
  );
}

export function FlatbedTrailerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="1" y="17" width="62" height="5" rx="1" />
      <rect x="14" y="22" width="3" height="8" />
      <circle cx="42" cy="28" r="6" />
      <circle cx="56" cy="28" r="6" />
    </svg>
  );
}

export function SleeperTruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M3 30 V19 L6 13 H18 L21.5 6 H41 V30 Z M20 12.5 L23 7.5 H28 V12.5 Z"
      />
      <rect x="41.5" y="9" width="2.5" height="17" />
      <rect x="41.5" y="26" width="19.5" height="4" />
      <circle cx="11.5" cy="30.5" r="5.5" />
      <circle cx="46.5" cy="30.5" r="5.5" />
      <circle cx="57.5" cy="30.5" r="5.5" />
    </svg>
  );
}

export function DayCabTruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M3 30 V19 L6 13 H18 L21.5 6 H33 V30 Z M20 12.5 L23 7.5 H30.5 V12.5 Z"
      />
      <rect x="33.5" y="9" width="2.5" height="17" />
      <rect x="33.5" y="26" width="27.5" height="4" />
      <circle cx="11.5" cy="30.5" r="5.5" />
      <circle cx="45.5" cy="30.5" r="5.5" />
      <circle cx="57" cy="30.5" r="5.5" />
    </svg>
  );
}

export function HeavyEquipmentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="12" y="29" width="34" height="8" rx="4" />
      <rect x="14" y="17" width="22" height="10" rx="1" />
      <rect x="15" y="9" width="9" height="8" rx="1" />
      <path d="M34 19 L48 7 L51 9 L39 21 Z" />
      <path d="M48 7 L51 8 L60 21 L57 22 Z" />
      <path d="M57 22 L61 21 C62 26 58 29 54 27 Z" />
    </svg>
  );
}

export function AllCategoriesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="4" y="4" width="16" height="14" rx="3" />
      <rect x="24" y="4" width="16" height="14" rx="3" />
      <rect x="44" y="4" width="16" height="14" rx="3" />
      <rect x="4" y="22" width="16" height="14" rx="3" />
      <rect x="24" y="22" width="16" height="14" rx="3" />
      <rect x="44" y="22" width="16" height="14" rx="3" />
    </svg>
  );
}
