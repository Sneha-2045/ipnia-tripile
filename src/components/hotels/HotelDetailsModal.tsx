import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { NormalizedHotel } from "@/types/hotel";
import { formatHotelPrice, priceLevelLabel, resolveHotelMediaUrl } from "@/services/hotelSearchApi";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin, Phone, Star } from "lucide-react";

const FALLBACK = "/assets/destinations/hotel-luxury-1.jpg";

export function HotelDetailsModal({
  hotel,
  open,
  onOpenChange,
  onSelect,
}: {
  hotel: NormalizedHotel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: () => void;
}) {
  const [idx, setIdx] = useState(0);
  if (!hotel) return null;

  const images = hotel.images?.length
    ? hotel.images
    : hotel.image
      ? [{ url: hotel.image, thumbUrl: hotel.image, reference: "", width: null, height: null, attributions: [], index: 0 }]
      : [];
  const src = resolveHotelMediaUrl(images[idx]?.url || hotel.image) || FALLBACK;
  const maps =
    hotel.googleMapsUri ||
    (hotel.latitude != null && hotel.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`
      : hotel.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`
        : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-slate-200 bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle className="text-left text-xl text-slate-900">{hotel.name}</DialogTitle>
        </DialogHeader>

        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
          <img
            src={src}
            alt={hotel.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK;
            }}
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white"
                onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white"
                onClick={() => setIdx((i) => (i + 1) % images.length)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                {idx + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        <div className="space-y-4 text-sm">
          {hotel.address && (
            <p className="flex items-start gap-2 text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 text-[#d4a853]" /> {hotel.address}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {hotel.guestRating != null && (
              <span className="inline-flex items-center gap-1 font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {hotel.guestRating.toFixed(1)}
                {hotel.ratingLabel ? ` · ${hotel.ratingLabel}` : ""}
              </span>
            )}
            {hotel.reviewCount != null && (
              <span className="text-slate-500">{hotel.reviewCount.toLocaleString("en-IN")} reviews</span>
            )}
            {hotel.businessStatus && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase text-slate-600">
                {hotel.businessStatus.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {hotel.description && <p className="leading-relaxed text-slate-700">{hotel.description}</p>}

          {hotel.propertyType && (
            <p>
              Property type: <span className="capitalize font-medium">{hotel.propertyType}</span>
            </p>
          )}

          {hotel.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {hotel.categories.map((c) => (
                <span key={c} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs capitalize text-slate-600">
                  {c}
                </span>
              ))}
            </div>
          )}

          {hotel.amenities.length > 0 && (
            <div>
              <p className="mb-2 font-semibold text-slate-800">Amenities</p>
              <ul className="grid gap-1 sm:grid-cols-2">
                {hotel.amenities.map((a) => (
                  <li key={a} className="text-slate-600">
                    · {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-1">
            {hotel.phone && (
              <a href={`tel:${hotel.phone}`} className="flex items-center gap-2 text-[#1d4ed8]">
                <Phone className="h-3.5 w-3.5" /> {hotel.phone}
              </a>
            )}
            {hotel.website && (
              <a
                href={hotel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#1d4ed8]"
              >
                Website <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {maps && (
              <a href={maps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1d4ed8]">
                View on Map <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {(hotel.checkIn || hotel.nights) && (
            <div className="rounded-lg bg-slate-50 p-3 text-slate-700">
              {hotel.checkIn && <p>Check-in: {hotel.checkIn}</p>}
              {hotel.checkOut && <p>Check-out: {hotel.checkOut}</p>}
              {hotel.nights != null && <p>Nights: {hotel.nights}</p>}
              {hotel.guests != null && <p>Guests: {hotel.guests}</p>}
              {hotel.roomsCount != null && <p>Rooms: {hotel.roomsCount}</p>}
            </div>
          )}

          <div>
            {formatHotelPrice(hotel.price, hotel.currency) ||
              (priceLevelLabel(hotel.priceLevel)
                ? `Price level: ${priceLevelLabel(hotel.priceLevel)}`
                : "Price on request")}
          </div>

          {maps && hotel.latitude != null && hotel.longitude != null && (
            <iframe
              title={`Map of ${hotel.name}`}
              className="h-48 w-full rounded-xl border border-slate-200"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
            />
          )}

          <Button
            type="button"
            onClick={onSelect}
            className="w-full bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
          >
            View Rooms / Enquire
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
