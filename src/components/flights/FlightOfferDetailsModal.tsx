import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { NormalizedFlightOffer } from "@/types/duffelFlight";
import { formatCabinLabel, formatDateTimeLocal, formatMoney } from "@/services/flightSearchApi";

export function FlightOfferDetailsModal({
  offer,
  open,
  onOpenChange,
}: {
  offer: NormalizedFlightOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!offer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-[#d4a853]/30 bg-[#0c1a2e] text-white">
        <DialogHeader>
          <DialogTitle className="text-[#d4a853]">Offer details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
              Flight
            </h3>
            <p className="text-white/50">Offer ID: {offer.id}</p>
            {offer.primaryCarrier && (
              <p className="mt-1 font-medium">
                {offer.primaryCarrier.name}
                {offer.primaryCarrier.iataCode ? ` (${offer.primaryCarrier.iataCode})` : ""}
                {offer.primaryFlightNumber ? ` · ${offer.primaryFlightNumber}` : ""}
              </p>
            )}
          </section>

          {offer.slices.map((slice, sliceIdx) => (
            <section key={slice.id || sliceIdx}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
                {offer.slices.length > 1
                  ? sliceIdx === 0
                    ? "Outbound"
                    : "Return"
                  : "Itinerary"}{" "}
                {slice.origin?.iataCode} → {slice.destination?.iataCode}
              </h3>
              <p className="mb-3 text-white/55">
                Total {slice.duration?.label || "—"} · {slice.stopsLabel}
                {slice.fareBrandName ? ` · ${slice.fareBrandName}` : ""}
              </p>
              <div className="space-y-4">
                {slice.segments.map((seg, idx) => (
                  <div
                    key={seg.id || idx}
                    className="rounded-xl border border-white/10 bg-[#07111f] p-4"
                  >
                    {idx > 0 && slice.layovers[idx - 1] && (
                      <p className="mb-3 text-center text-xs text-[#d4a853]">
                        {slice.layovers[idx - 1].label}
                      </p>
                    )}
                    <p className="font-semibold">
                      {seg.displayCarrier?.name || "Airline"}
                      {seg.displayCarrier?.iataCode ? ` (${seg.displayCarrier.iataCode})` : ""}
                    </p>
                    {seg.operatingCarrier?.name && (
                      <p className="text-white/55">
                        Operating: {seg.operatingCarrier.name}
                        {seg.operatingCarrier.iataCode
                          ? ` (${seg.operatingCarrier.iataCode})`
                          : ""}
                      </p>
                    )}
                    {seg.marketingCarrier?.name && (
                      <p className="text-white/55">
                        Marketing: {seg.marketingCarrier.name}
                        {seg.marketingCarrier.iataCode
                          ? ` (${seg.marketingCarrier.iataCode})`
                          : ""}
                      </p>
                    )}
                    {seg.flightNumber && (
                      <p className="mt-1 text-[#d4a853]">{seg.flightNumber}</p>
                    )}
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-white/40">Departure</p>
                        <p className="text-lg font-bold">{seg.departureTime}</p>
                        <p>
                          {seg.origin?.iataCode} · {seg.origin?.cityName}
                        </p>
                        <p className="text-white/45">{seg.origin?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Arrival</p>
                        <p className="text-lg font-bold">{seg.arrivalTime}</p>
                        <p>
                          {seg.destination?.iataCode} · {seg.destination?.cityName}
                        </p>
                        <p className="text-white/45">{seg.destination?.name}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-white/60">
                      {seg.duration?.label && <p>Duration: {seg.duration.label}</p>}
                      {seg.aircraft?.name && (
                        <p>
                          Aircraft: {seg.aircraft.name}
                          {seg.aircraft.iataCode ? ` (${seg.aircraft.iataCode})` : ""}
                        </p>
                      )}
                      {seg.cabinClass && (
                        <p>Cabin: {formatCabinLabel(seg.cabinClass)}</p>
                      )}
                      {seg.cabinMarketingName && <p>Cabin name: {seg.cabinMarketingName}</p>}
                      {seg.baggage.available && seg.baggage.summary && (
                        <p>Baggage: {seg.baggage.summary}</p>
                      )}
                      {seg.amenities.length > 0 && (
                        <p>Amenities: {seg.amenities.map((a) => a.label).join(", ")}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
              Fare
            </h3>
            {offer.cabinClass && <p>Cabin: {formatCabinLabel(offer.cabinClass)}</p>}
            {offer.fareBrandName && <p>Fare brand: {offer.fareBrandName}</p>}
            {offer.baggage.available && offer.baggage.summary ? (
              <p>Baggage: {offer.baggage.summary}</p>
            ) : (
              <p>Baggage information unavailable</p>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
              Price
            </h3>
            {offer.baseAmount != null && (
              <p>Base: {formatMoney(offer.baseAmount, offer.totalCurrency)}</p>
            )}
            {offer.taxAmount != null && (
              <p>Taxes: {formatMoney(offer.taxAmount, offer.totalCurrency)}</p>
            )}
            <p className="text-lg font-bold text-[#d4a853]">
              Total: {formatMoney(offer.totalAmount, offer.totalCurrency)}
            </p>
            {offer.totalCurrency && <p>Currency: {offer.totalCurrency}</p>}
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
              Conditions
            </h3>
            {offer.conditions.changeBeforeDeparture ? (
              <p>Changes: {offer.conditions.changeBeforeDeparture.label}</p>
            ) : (
              <p className="text-white/45">Change information unavailable</p>
            )}
            {offer.conditions.refundBeforeDeparture ? (
              <p>Refunds: {offer.conditions.refundBeforeDeparture.label}</p>
            ) : (
              <p className="text-white/45">Refund information unavailable</p>
            )}
          </section>

          {(offer.paymentRequirements?.priceGuaranteeExpiresAt ||
            offer.paymentRequirements?.paymentRequiredBy ||
            offer.expiresAt) && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
                Timing
              </h3>
              <p className="text-white/50">Informational only — IPNIA search does not process payment.</p>
              {offer.paymentRequirements?.priceGuaranteeExpiresAt && (
                <p>
                  Price guarantee expires:{" "}
                  {formatDateTimeLocal(offer.paymentRequirements.priceGuaranteeExpiresAt)}
                </p>
              )}
              {offer.paymentRequirements?.paymentRequiredBy && (
                <p>
                  Payment required by:{" "}
                  {formatDateTimeLocal(offer.paymentRequirements.paymentRequiredBy)}
                </p>
              )}
              {offer.expiresAt && <p>Offer expires: {formatDateTimeLocal(offer.expiresAt)}</p>}
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
