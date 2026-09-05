'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, X } from 'lucide-react';
import { useImageFallback } from '@/hooks/useImageFallback';
import { getImageSrc } from '@/lib/utils';
import { getApproxCoordinates } from '@/lib/geo/state-centroids';
import type { Listing } from '@/types';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom marker for featured listings
const featuredIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapViewProps {
  listings: Listing[];
  isLoading?: boolean;
  onClose?: () => void;
}

interface PlacedListing {
  listing: Listing;
  position: [number, number];
  approximate: boolean;
}

// Component to fit bounds to markers
function FitBounds({ placed }: { placed: PlacedListing[] }) {
  const map = useMap();

  useEffect(() => {
    if (placed.length > 0) {
      const bounds = L.latLngBounds(placed.map((p) => p.position));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [placed, map]);

  return null;
}

function MapMarkerPopup({ listing, position, approximate }: PlacedListing) {
  const { hasError, handleError } = useImageFallback();
  const primaryImage =
    listing.images?.find((img) => img.is_primary) || listing.images?.[0];
  const primaryImageSrc = getImageSrc(primaryImage);

  return (
    <Marker
      position={position}
      icon={listing.is_featured ? featuredIcon : defaultIcon}
    >
      <Popup maxWidth={300} minWidth={200}>
        <div className="p-0">
          <Link href={`/listing/${listing.id}`} className="block">
            {primaryImageSrc && !hasError && (
              <div className="relative w-full h-24 -mt-3 -mx-3 mb-2">
                <Image
                  src={primaryImageSrc}
                  alt={listing.title}
                  fill
                  sizes="300px"
                  className="object-cover rounded-t"
                  onError={handleError}
                />
                {listing.is_featured && (
                  <Badge className="absolute top-1 left-1 text-[10px] bg-secondary text-secondary-foreground">
                    Featured
                  </Badge>
                )}
              </div>
            )}
            <div className="px-1">
              <h3 className="font-semibold text-sm line-clamp-1">
                {listing.title}
              </h3>
              <p className="text-lg font-bold text-primary">
                {listing.price
                  ? `$${listing.price.toLocaleString()}`
                  : 'Call for Price'}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                {listing.year && <span>{listing.year}</span>}
                {listing.make && <span>{listing.make}</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {[listing.city, listing.state].filter(Boolean).join(', ')}
                {approximate && <span className="opacity-70">(approx.)</span>}
              </p>
            </div>
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

export function MapView({ listings, isLoading, onClose }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration gate: Leaflet can only render client-side
    setIsMounted(true);
  }, []);

  // Place every listing we can: exact coordinates when a listing has them,
  // otherwise a state-level position (listings have no lat/lng column, so
  // without the fallback the map was empty for every search)
  const placed = useMemo<PlacedListing[]>(
    () =>
      listings.flatMap((listing) => {
        const coords = getApproxCoordinates(listing);
        return coords ? [{ listing, ...coords }] : [];
      }),
    [listings]
  );
  const approximateCount = placed.filter((p) => p.approximate).length;

  // Default center (US center)
  const defaultCenter: [number, number] = [39.8283, -98.5795];

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (placed.length === 0) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-muted rounded-lg flex flex-col items-center justify-center text-center p-4">
        <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No locations available</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          None of the current listings include a location. Try adjusting
          your search or view the listings in grid/list mode.
        </p>
        {onClose && (
          <Button variant="outline" className="mt-4" onClick={onClose}>
            Switch to Grid View
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden border">
      {onClose && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 right-3 z-[1000] shadow-lg"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={4}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds placed={placed} />

        {placed.map((p) => (
          <MapMarkerPopup key={p.listing.id} {...p} />
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-2 text-xs shadow-lg">
        <p className="font-medium mb-1">
          {placed.length} of {listings.length} listings shown
        </p>
        <p className="text-muted-foreground">
          {approximateCount > 0
            ? 'Pins are placed by state; open a listing for the exact location'
            : 'Only listings with location data appear on the map'}
        </p>
      </div>
    </div>
  );
}

// Wrapper to ensure CSS is loaded
export function MapViewWrapper(props: MapViewProps) {
  return <MapView {...props} />;
}
