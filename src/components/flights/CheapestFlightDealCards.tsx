import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Plane, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAirportByCode } from "@/data/airports";
import { formatMoney } from "@/services/flightSearchApi";
import { getFeaturedFlightDealCards, type FlightDealCardsResponse } from "@/services/flightDealCards";
import type { NormalizedFlightOffer } from "@/types/duffelFlight";

type Props = { compact?: boolean };

function city(code: string) { return getAirportByCode(code)?.city || code; }
function monthLabel(value: string) { return new Date(`${value}-01T12:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" }); }
function dateLabel(value: string) { return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); }
function offerAirline(offer: NormalizedFlightOffer) {
  const segment = offer.slices[0]?.segments[0];
  return offer.primaryCarrier?.name || segment?.displayCarrier?.name || segment?.marketingCarrier?.name || "Airline";
}
function offerDetails(offer: NormalizedFlightOffer) {
  const segment = offer.slices[0]?.segments[0];
  return {
    departure: segment?.departureTime || offer.departureTime || "Time unavailable",
    duration: offer.durationLabel || "Duration unavailable",
    stops: offer.stops === 0 ? "Non-stop" : `${offer.stops} stop${offer.stops === 1 ? "" : "s"}`,
  };
}
function resultLink(origin: string, destination: string, date: string, offerId: string) {
  const query = new URLSearchParams({ from: origin, to: destination, departure: date, adults: "1", children: "0", infants: "0", cabin: "economy", tripType: "oneway", offerId });
  return `/flights/search?${query.toString()}`;
}

function AirlineMark({ offer, airline }: { offer: NormalizedFlightOffer; airline: string }) {
  return offer.primaryLogoUrl ? (
    <img src={offer.primaryLogoUrl} alt={`${airline} logo`} className="h-10 w-10 rounded-xl bg-white p-1.5 object-contain" loading="lazy" />
  ) : (
    <span aria-label={`${airline} logo unavailable`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3f9] text-[#17365a]"><Plane className="h-5 w-5" /></span>
  );
}

function DealCard({ offer, origin, destination, date, kind, month, cached }: {
  offer: NormalizedFlightOffer; origin: string; destination: string; date: string;
  kind: "monthly" | "daily"; month?: string; cached: boolean;
}) {
  const airline = offerAirline(offer);
  const details = offerDetails(offer);
  const href = resultLink(origin, destination, date, offer.id);
  return (
    <Link to={href} className="group flex h-full flex-col justify-between rounded-2xl border border-[#d9e3ef] bg-gradient-to-br from-white to-[#f5f8fc] p-4 shadow-[0_12px_32px_rgba(16,42,72,0.10)] transition hover:-translate-y-1 hover:border-[#d6ad45] hover:shadow-[0_18px_40px_rgba(16,42,72,0.16)] sm:p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <AirlineMark offer={offer} airline={airline} />
            <div className="min-w-0"><p className="truncate font-semibold text-[#17365a]">{airline}</p><p className="text-xs text-[#64758a]">{kind === "monthly" ? monthLabel(month!) : dateLabel(date)}</p></div>
          </div>
          <span className="shrink-0 rounded-full border border-[#e2b552]/60 bg-[#fff7df] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#805b0b]">Cheapest fare</span>
        </div>
        <div className="my-5 flex items-center justify-between gap-2">
          <div className="min-w-0"><p className="truncate text-lg font-bold text-[#17365a]">{city(origin)}</p><p className="text-xs text-[#64758a]">{origin}</p></div>
          <div className="flex flex-1 items-center justify-center text-[#b28619]"><span className="h-px flex-1 bg-[#cbd7e4]" /><Plane className="mx-2 h-4 w-4 shrink-0" /><span className="h-px flex-1 bg-[#cbd7e4]" /></div>
          <div className="min-w-0 text-right"><p className="truncate text-lg font-bold text-[#17365a]">{city(destination)}</p><p className="text-xs text-[#64758a]">{destination}</p></div>
        </div>
        {kind === "monthly" ? (
          <p className="rounded-xl bg-[#edf3f9] px-3 py-2 text-xs text-[#51647b]">Lowest fare found on <span className="font-semibold text-[#17365a]">{dateLabel(date)}</span> among the dates checked for {monthLabel(month!)}.</p>
        ) : (
          <p className="flex flex-wrap gap-x-3 gap-y-1 rounded-xl bg-[#edf3f9] px-3 py-2 text-xs text-[#51647b]"><span>{dateLabel(date)}</span><span>{details.departure}</span><span>{details.duration}</span><span>{details.stops}</span></p>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 border-t border-[#d9e3ef] pt-4">
        <div><p className="text-[10px] uppercase tracking-wider text-[#64758a]">{kind === "monthly" ? "Lowest checked fare" : "Available fare"}</p><p className="mt-0.5 text-2xl font-extrabold text-[#9a6d0b]">{formatMoney(offer.providerAmount, offer.providerCurrency)}</p></div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#17365a] group-hover:text-[#9a6d0b]">{kind === "monthly" ? "Explore Flights" : "View Flight"}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
      <p className="mt-3 text-[10px] text-[#64758a]">{cached ? "Cached offer" : "Price verified"} · checked {new Date(offer.priceVerifiedAt).toLocaleString()}</p>
    </Link>
  );
}

export function CheapestFlightDealCards({ compact = false }: Props) {
  const [data, setData] = useState<FlightDealCardsResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(compact ? 4 : 12);

  useEffect(() => {
    let active = true;
    getFeaturedFlightDealCards().then((result) => {
      if (!active) return;
      setData(result);
      setError("");
    }).catch((err) => {
      if (active) setError(err instanceof Error ? err.message : "Live deals are temporarily unavailable.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const monthlyDeals = (data?.monthlyDeals || []).slice(0, compact ? 3 : undefined);
  const dailyDeals = (data?.dailyDeals || []).slice(0, dailyLimit);
  const cached = Boolean(data?.cached);

  return (
    <section id="cheapest-flights" className="ipnia-section py-14 md:py-18">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a6d0b]">Verified airfare</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-[#17365a] md:text-4xl">{compact ? "Cheapest Flights & Best Airfare Deals" : "Cheapest Flight Deals – Find Your Best Fare"}</h2>
          <p className="mt-2 text-[#51647b]">{compact ? "Discover affordable flights and explore the best fares for your next journey." : "Monthly fares show the lowest offer found on a specific checked date."}</p>
        </div>
        {compact && <Button asChild variant="outline" className="border-[#c59a32] text-[#17365a] hover:bg-[#fff7df]"><Link to="/deals#cheapest-flights">View All Deals <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>}
      </div>

      {loading && <div role="status" className="flex items-center gap-3 rounded-2xl border border-[#d9e3ef] bg-white p-5 text-[#51647b]"><RefreshCw className="h-4 w-4 animate-spin text-[#9a6d0b]" />Loading verified flight deals…</div>}
      {error && !loading && <div className="rounded-2xl border border-[#d9e3ef] bg-white p-5 text-[#51647b]">{error}</div>}

      {!loading && !error && data && <>
        <section aria-labelledby="monthly-flight-deals-heading" className="mb-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#9a6d0b]">Monthly Cheapest Flights</p><h3 id="monthly-flight-deals-heading" className="mt-1 text-xl font-bold text-[#17365a]">Lowest fares found across upcoming months</h3></div></div>
          {monthlyDeals.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{monthlyDeals.map((deal) => <DealCard key={`${deal.origin}-${deal.destination}-${deal.month}-${deal.offer.providerCurrency}`} offer={deal.offer} origin={deal.origin} destination={deal.destination} date={deal.date} month={deal.month} kind="monthly" cached={cached} />)}</div> : <p className="rounded-2xl border border-[#d9e3ef] bg-white p-5 text-sm text-[#51647b]">No available monthly fares were returned for the checked dates.</p>}
        </section>

        <section aria-labelledby="daily-flight-deals-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#9a6d0b]">Daily Cheapest Flights</p><h3 id="daily-flight-deals-heading" className="mt-1 text-xl font-bold text-[#17365a]">Lowest available fares on specific travel dates</h3></div>{data.generatedAt && <p className="flex items-center gap-1 text-xs text-[#64758a]"><Clock3 className="h-3.5 w-3.5" />Prices checked {new Date(data.generatedAt).toLocaleString()}</p>}</div>
          {dailyDeals.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{dailyDeals.map((deal) => <DealCard key={`${deal.origin}-${deal.destination}-${deal.date}`} offer={deal.offers[0]} origin={deal.origin} destination={deal.destination} date={deal.date} kind="daily" cached={cached} />)}</div> : <p className="rounded-2xl border border-[#d9e3ef] bg-white p-5 text-sm text-[#51647b]">No available daily fares were returned for the checked dates.</p>}
          {!compact && dailyDeals.length > dailyLimit && <div className="mt-6 text-center"><Button variant="outline" onClick={() => setDailyLimit((limit) => limit + 8)} className="border-[#c59a32] text-[#17365a] hover:bg-[#fff7df]">Load More Deals</Button></div>}
        </section>
        {data.failedSearchCount > 0 && <p className="mt-4 rounded-xl border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-900">{data.failedSearchCount} scheduled flight search{data.failedSearchCount === 1 ? " was" : "es were"} unavailable. Only fares returned by successful live searches are shown.</p>}
        <p className="mt-6 text-xs text-[#64758a]">Prices are checked fares, cached for up to 10 minutes, and may change. Monthly deals are based only on the displayed searched date. The selected offer is revalidated at checkout.</p>
      </>}
    </section>
  );
}
