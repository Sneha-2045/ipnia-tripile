import type { DuffelSegment, DuffelSlice, NormalizedFlightOffer } from "@/types/duffelFlight";
import { formatCabinLabel, formatMoney } from "@/services/flightSearchApi";
import { Button } from "@/components/ui/button";
import { memo } from "react";

function CarrierBlock({ segment }: { segment: DuffelSegment }) {
  const carrier = segment.displayCarrier || segment.operatingCarrier || segment.marketingCarrier;
  const logo = segment.logoUrl || carrier?.logoSymbolUrl || carrier?.logoLockupUrl;
  return (
    <div className="flex items-start gap-3">
      {logo ? (
        <img
          src={logo}
          alt={carrier?.name || "Airline"}
          className="h-10 w-10 rounded-md bg-white object-contain p-1"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e2b552]/15 text-xs font-bold text-[#e2b552]">
          {carrier?.iataCode || "—"}
        </div>
      )}
      <div>
        <p className="text-base font-semibold text-white">{carrier?.name || "Airline"}</p>
        <p className="text-sm text-white/55">
          {[carrier?.iataCode, segment.flightNumber].filter(Boolean).join(" · ")}
        </p>
        {segment.operatingCarrier?.name &&
          segment.marketingCarrier?.name &&
          segment.operatingCarrier.name !== segment.marketingCarrier.name && (
            <p className="mt-0.5 text-xs text-white/40">
              Marketed by {segment.marketingCarrier.name}
              {segment.marketingCarrier.iataCode ? ` (${segment.marketingCarrier.iataCode})` : ""}
            </p>
          )}
      </div>
    </div>
  );
}

function PlaceCol({
  time,
  place,
  align = "left",
}: {
  time: string | null;
  place: DuffelSegment["origin"];
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="text-2xl font-bold text-white">{time || "—"}</p>
      <p className="text-sm font-semibold text-[#e2b552]">{place?.iataCode || "—"}</p>
      <p className="text-sm text-white/70">{place?.cityName || "—"}</p>
      {place?.name && <p className="text-xs text-white/40">{place.name}</p>}
    </div>
  );
}

function SliceSummary({ slice, label }: { slice: DuffelSlice; label?: string }) {
  const first = slice.segments[0];
  const last = slice.segments[slice.segments.length - 1];
  if (!first || !last) return null;

  return (
    <div className="space-y-4">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e2b552]">{label}</p>
      )}
      <CarrierBlock segment={first} />
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <PlaceCol time={first.departureTime} place={first.origin} />
        <div className="px-2 pt-2 text-center text-xs text-white/45">
          <div className="mb-1 h-px w-16 bg-[#e2b552]/50 sm:w-24" />
          <p>{slice.duration?.label || "—"}</p>
          <p>
            {slice.stopsLabel}
            {slice.connectionAirports[0]?.iataCode
              ? ` · ${slice.connectionAirports[0].cityName || ""} (${slice.connectionAirports[0].iataCode})`
              : ""}
          </p>
        </div>
        <PlaceCol time={last.arrivalTime} place={last.destination} align="right" />
      </div>

      {slice.segments.length > 1 && (
        <div className="space-y-3 rounded-xl border border-white/10 bg-[#07111f]/60 p-3">
          {slice.segments.map((seg, idx) => (
            <div key={seg.id || `${seg.flightNumber}-${idx}`}>
              {idx > 0 && slice.layovers[idx - 1] && (
                <p className="mb-2 text-center text-xs text-[#e2b552]/90">
                  ↓ {slice.layovers[idx - 1].label}
                  {slice.layovers[idx - 1].airport?.iataCode
                    ? ` · ${slice.layovers[idx - 1].airport?.cityName || ""} (${slice.layovers[idx - 1].airport?.iataCode})`
                    : ""}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium text-white">
                  {(seg.displayCarrier?.name || "Airline") +
                    (seg.flightNumber ? ` · ${seg.flightNumber}` : "")}
                </span>
                <span className="text-white/55">
                  {seg.origin?.iataCode} {seg.departureTime} → {seg.destination?.iataCode}{" "}
                  {seg.arrivalTime}
                  {seg.duration?.label ? ` · ${seg.duration.label}` : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const FlightOfferCard = memo(function FlightOfferCard({
  offer,
  onViewDetails,
  onBookNow,
}: {
  offer: NormalizedFlightOffer;
  onViewDetails: (offer: NormalizedFlightOffer) => void;
  onBookNow: (offer: NormalizedFlightOffer) => void;
}) {
  const outbound = offer.slices[0];
  const inbound = offer.slices[1];
  const cabin = formatCabinLabel(offer.cabinClass);
  const change = offer.conditions.changeBeforeDeparture;
  const refund = offer.conditions.refundBeforeDeparture;

  return (
    <article className="travel-hover rounded-2xl border border-white/10 bg-[#0c1a2e]/90 p-5 shadow-travel md:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="min-w-0 flex-1 space-y-6">
          {outbound && <SliceSummary slice={outbound} label={inbound ? "Outbound" : undefined} />}
          {inbound && <SliceSummary slice={inbound} label="Return" />}

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/60">
            {cabin && <span>{cabin}</span>}
            {offer.fareBrandName && <span>Fare: {offer.fareBrandName}</span>}
            {offer.baggage.available && offer.baggage.summary && (
              <span>{offer.baggage.summary}</span>
            )}
            {!offer.baggage.available && <span>Baggage information unavailable</span>}
            {outbound?.segments[0]?.aircraft?.name && (
              <span>
                {outbound.segments[0].aircraft.name}
                {outbound.segments[0].aircraft.iataCode
                  ? ` (${outbound.segments[0].aircraft.iataCode})`
                  : ""}
              </span>
            )}
          </div>

          {(change || refund) && (
            <div className="flex flex-wrap gap-3 text-xs text-white/55">
              {change && (
                <span>
                  Changes: {change.allowed ? "✓ " : ""}
                  {change.label}
                </span>
              )}
              {refund && (
                <span>
                  Refund: {refund.allowed ? "✓ " : ""}
                  {refund.label}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col justify-between border-t border-white/10 pt-4 lg:w-52 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="lg:text-right">
            <p className="text-sm text-white/50">Total</p>
            <p className="font-heading text-3xl font-bold text-[#e2b552]">
              {formatMoney(offer.totalAmount, "INR")}
            </p>
            <p className="text-xs text-white/40">INR</p>
            {offer.baseAmount != null && offer.taxAmount != null && (
              <p className="mt-1 text-xs text-white/40">
                Base {formatMoney(offer.baseAmount, "INR")} · Tax{" "}
                {formatMoney(offer.taxAmount, "INR")}
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button type="button" onClick={() => onBookNow(offer)} className="ipnia-btn-gold rounded-xl">
              Book Now
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onViewDetails(offer)}
              className="rounded-xl border-white/15 bg-transparent text-white hover:bg-white/5"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});
