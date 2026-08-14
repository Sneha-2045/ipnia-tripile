import type { SelectedFlight } from "@/types/booking";
import { formatInr } from "@/lib/bookingValidation";

export function FlightSummaryCard({
  flight,
  compact = false,
}: {
  flight: SelectedFlight;
  compact?: boolean;
}) {
  return (
    <aside className="rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">Selected flight</p>
      <p className="mt-2 text-lg font-semibold text-white">
        {flight.airline} · {flight.flightNumber}
      </p>
      <p className="mt-1 text-white/70">
        {flight.origin} → {flight.destination}
      </p>
      <p className="mt-3 text-xl font-bold">
        {flight.departureTime} → {flight.arrivalTime}
      </p>
      <p className="mt-1 text-sm text-white/50">
        {flight.duration} · {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
      </p>
      {!compact && (
        <>
          <p className="mt-3 text-sm text-white/55">
            {flight.departureDate || "Date TBC"} · {flight.cabin} · {flight.travellerCount} traveller
            {flight.travellerCount > 1 ? "s" : ""}
          </p>
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-sm text-white/50">Total</p>
            <p className="text-2xl font-bold text-[#d4a853]">{formatInr(flight.totalAmount)}</p>
          </div>
        </>
      )}
      {compact && (
        <p className="mt-3 text-lg font-bold text-[#d4a853]">{formatInr(flight.totalAmount)}</p>
      )}
    </aside>
  );
}
