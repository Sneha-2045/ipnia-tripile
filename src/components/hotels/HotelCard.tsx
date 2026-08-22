import { useMemo, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  MapPin,
  MessageSquare,
  Phone,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NormalizedHotel } from "@/types/hotel";
import { formatHotelPrice, hotelPhotoUrl, priceLevelLabel } from "@/services/hotelSearchApi";

const FALLBACK = "/assets/destinations/hotel-luxury-1.jpg";

function DescriptionBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 180;
  return (
    <div className="mt-2">
      <p className="text-sm leading-relaxed text-slate-600">
        {open || !long ? text : `${text.slice(0, 180).trim()}…`}
      </p>
      {long && (
        <button
          type="button"
          className="mt-1 text-sm font-semibold text-[#1d4ed8] hover:underline"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export function HotelCard({
  hotel,
  onViewDetails,
  onSelect,
}: {
  hotel: NormalizedHotel;
  onViewDetails: () => void;
  onSelect: () => void;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const images = (hotel.images || [])
    .map((img, index) => {
      const url = hotelPhotoUrl(img.reference, 1200) || img.url;
      if (!url) return null;
      return { ...img, index, url };
    })
    .filter(Boolean) as typeof hotel.images;

  const current = images[imgIndex] || null;
  const src = imgFailed
    ? FALLBACK
    : current?.url || hotelPhotoUrl(hotel.images?.[0]?.reference) || hotel.image || FALLBACK;
  const amenities = hotel.amenities || [];
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 6);
  const priceText = formatHotelPrice(hotel.pricePerNight ?? hotel.price, hotel.currency);
  const level = priceLevelLabel(hotel.priceLevel);

  const mapsHref = useMemo(() => {
    if (hotel.googleMapsUri) return hotel.googleMapsUri;
    if (hotel.latitude != null && hotel.longitude != null) {
      return `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`;
    }
    if (hotel.address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`;
    }
    return null;
  }, [hotel]);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="grid md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr]">
        {/* Image — API photos only */}
        <div className="relative aspect-[16/10] bg-slate-100 md:aspect-auto md:min-h-[240px]">
          <img
            key={`${hotel.id}-${imgIndex}-${src}`}
            src={src}
            alt={hotel.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full cursor-pointer object-cover"
            onClick={onViewDetails}
            onError={() => {
              if (imgIndex < images.length - 1) {
                setImgIndex((i) => i + 1);
                return;
              }
              setImgFailed(true);
            }}
          />
          {images.length > 0 && (
            <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
              {images.length} photo{images.length === 1 ? "" : "s"}
            </span>
          )}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                onClick={() => {
                  setImgFailed(false);
                  setImgIndex((i) => (i - 1 + images.length) % images.length);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                onClick={() => {
                  setImgFailed(false);
                  setImgIndex((i) => (i + 1) % images.length);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col p-5 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1d4ed8]/10 text-[#1d4ed8]">
                  <Building2 className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold leading-snug text-slate-900 md:text-2xl">
                    {hotel.name}
                  </h3>
                  {hotel.address && (
                    <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-500">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4a853]" />
                      {mapsHref ? (
                        <a
                          href={mapsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#1d4ed8] hover:underline"
                        >
                          {hotel.address}
                        </a>
                      ) : (
                        <span>{hotel.address}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              {hotel.priceBadge && (
                <span className="mb-1 inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {hotel.priceBadge}
                </span>
              )}
              {priceText ? (
                <>
                  <p className="text-2xl font-bold text-[#1d4ed8]">{priceText}</p>
                  {hotel.currency && (
                    <p className="text-xs font-medium text-slate-400">{hotel.currency}</p>
                  )}
                </>
              ) : level ? (
                <>
                  <p className="text-lg font-bold text-[#1d4ed8]">{level}</p>
                  <p className="text-xs text-slate-400">Price level</p>
                </>
              ) : (
                <p className="text-sm font-semibold text-slate-500">Price on request</p>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            {hotel.guestRating != null && (
              <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {hotel.guestRating.toFixed(1)}
                {hotel.ratingLabel ? ` · ${hotel.ratingLabel}` : ""}
              </span>
            )}
            {hotel.reviewCount != null && (
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {hotel.reviewCount.toLocaleString("en-IN")} reviews
              </span>
            )}
            {hotel.businessStatus && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-slate-600">
                {hotel.businessStatus.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {hotel.description && <DescriptionBlock text={hotel.description} />}

          {hotel.propertyType && (
            <p className="mt-2 text-sm text-slate-600">
              Primary type:{" "}
              <span className="font-medium capitalize text-slate-800">{hotel.propertyType}</span>
            </p>
          )}

          {hotel.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hotel.categories.slice(0, 8).map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] capitalize text-slate-600"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {amenities.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1.5">
                {visibleAmenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-[#d4a853]/30 bg-[#d4a853]/10 px-2.5 py-0.5 text-[11px] text-slate-700"
                  >
                    {a}
                  </span>
                ))}
              </div>
              {amenities.length > 6 && (
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-[#1d4ed8] hover:underline"
                  onClick={() => setShowAllAmenities((v) => !v)}
                >
                  {showAllAmenities ? "Hide amenities" : "View all amenities"}
                </button>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            {hotel.phone && (
              <a
                href={`tel:${hotel.phone}`}
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#1d4ed8]"
              >
                <Phone className="h-3.5 w-3.5" /> {hotel.phone}
              </a>
            )}
            {hotel.website && (
              <a
                href={hotel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1d4ed8] hover:underline"
              >
                <Globe className="h-3.5 w-3.5" /> Website <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#1d4ed8]"
              >
                <MapPin className="h-3.5 w-3.5" /> View on Map
              </a>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
            <Button
              type="button"
              onClick={onSelect}
              className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
            >
              Book Stay
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onViewDetails}
              className="border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
            >
              View Hotel Details
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
