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
    <span aria-label={`${airline} logo unavailable`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#e2b552]"><Plane className="h-5 w-5" /></span>
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
    <Link to={href} className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-[#142b46] to-[#0b1a2d] p-4 shadow-lg transition hover:-translate-y-1 hover:border-[#e2b552]/55 hover:shadow-2xl sm:p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <AirlineMark offer={offer} airline={airline} />
            <div className="min-w-0"><p className="truncate font-semibold text-white">{airline}</p><p className="text-xs text-white/50">{kind === "monthly" ? monthLabel(month!) : dateLabel(date)}</p></div>
          </div>
          <span className="shrink-0 rounded-full border border-[#e2b552]/35 bg-[#e2b552]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#f0ca72]">Cheapest fare</span>
        </div>
        <div className="my-5 flex items-center justify-between gap-2">
          <div className="min-w-0"><p className="truncate text-lg font-bold text-white">{city(origin)}</p><p className="text-xs text-white/45">{origin}</p></div>
          <div className="flex flex-1 items-center justify-center text-[#e2b552]"><span className="h-px flex-1 bg-white/15" /><Plane className="mx-2 h-4 w-4 shrink-0" /><span className="h-px flex-1 bg-white/15" /></div>
          <div className="min-w-0 text-right"><p className="truncate text-lg font-bold text-white">{city(destination)}</p><p className="text-xs text-white/45">{destination}</p></div>
        </div>
        {kind === "monthly" ? (
          <p className="rounded-xl bg-black/15 px-3 py-2 text-xs text-white/65">Lowest fare found on <span className="font-semibold text-white">{dateLabel(date)}</span> among the dates checked for {monthLabel(month!)}.</p>
        ) : (
          <p className="flex flex-wrap gap-x-3 gap-y-1 rounded-xl bg-black/15 px-3 py-2 text-xs text-white/65"><span>{dateLabel(date)}</span><span>{details.departure}</span><span>{details.duration}</span><span>{details.stops}</span></p>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 border-t border-white/10 pt-4">
        <div><p className="text-[10px] uppercase tracking-wider text-white/45">{kind === "monthly" ? "Lowest checked fare" : "Available fare"}</p><p className="mt-0.5 text-2xl font-extrabold text-[#e2b552]">{formatMoney(offer.providerAmount, offer.providerCurrency)}</p></div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:text-[#f0ca72]">{kind === "monthly" ? "Explore Flights" : "View Flight"}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
      <p className="mt-3 text-[10px] text-white/40">{cached ? "Cached live offer" : "Duffel Live offer"} · checked {new Date(offer.priceVerifiedAt).toLocaleString()}</p>
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
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e2b552]">Real-time airfare</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">{compact ? "Cheapest Flights & Best Airfare Deals" : "Cheapest Flight Deals – Find Your Best Fare"}</h2>
          <p className="mt-2 text-white/65">{compact ? "Discover affordable flights and explore the best fares for your next journey." : "Explore genuine fares returned by Duffel Live. Monthly fares show the cheapest offer found on the specific checked date."}</p>
        </div>
        {compact && <Button asChild variant="outline" className="border-[#e2b552]/40 text-white hover:bg-[#e2b552]/10"><Link to="/deals#cheapest-flights">View All Deals <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>}
      </div>

      {loading && <div role="status" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#10243a] p-5 text-white/70"><RefreshCw className="h-4 w-4 animate-spin text-[#e2b552]" />Loading verified Duffel flight deals…</div>}
      {error && !loading && <div className="rounded-2xl border border-white/10 bg-[#10243a] p-5 text-white/65">{error}</div>}

      {!loading && !error && data && <>
        <section aria-labelledby="monthly-flight-deals-heading" className="mb-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#e2b552]">Monthly Cheapest Flights</p><h3 id="monthly-flight-deals-heading" className="mt-1 text-xl font-bold text-white">Lowest fares found across upcoming months</h3></div></div>
          {monthlyDeals.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{monthlyDeals.map((deal) => <DealCard key={`${deal.origin}-${deal.destination}-${deal.month}-${deal.offer.providerCurrency}`} offer={deal.offer} origin={deal.origin} destination={deal.destination} date={deal.date} month={deal.month} kind="monthly" cached={cached} />)}</div> : <p className="rounded-2xl border border-white/10 bg-[#10243a] p-5 text-sm text-white/60">No live monthly fares were returned for the checked dates.</p>}
        </section>

        <section aria-labelledby="daily-flight-deals-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#e2b552]">Daily Cheapest Flights</p><h3 id="daily-flight-deals-heading" className="mt-1 text-xl font-bold text-white">Lowest available fares on specific travel dates</h3></div>{data.generatedAt && <p className="flex items-center gap-1 text-xs text-white/40"><Clock3 className="h-3.5 w-3.5" />Prices checked {new Date(data.generatedAt).toLocaleString()}</p>}</div>
          {dailyDeals.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{dailyDeals.map((deal) => <DealCard key={`${deal.origin}-${deal.destination}-${deal.date}`} offer={deal.offers[0]} origin={deal.origin} destination={deal.destination} date={deal.date} kind="daily" cached={cached} />)}</div> : <p className="rounded-2xl border border-white/10 bg-[#10243a] p-5 text-sm text-white/60">No live daily fares were returned for the checked dates.</p>}
          {!compact && dailyDeals.length > dailyLimit && <div className="mt-6 text-center"><Button variant="outline" onClick={() => setDailyLimit((limit) => limit + 8)} className="border-[#e2b552]/40 text-white hover:bg-[#e2b552]/10">Load More Deals</Button></div>}
        </section>
        {data.failedSearchCount > 0 && <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-200/5 p-3 text-xs text-amber-100/75">{data.failedSearchCount} scheduled Duffel search{data.failedSearchCount === 1 ? " was" : "es were"} unavailable. Only fares returned by successful live searches are shown.</p>}
        <p className="mt-6 text-xs text-white/40">Fares are indicative Duffel Live offers, cached for up to 10 minutes, and may change. Monthly deals are based only on the displayed searched date. The selected offer is revalidated at checkout.</p>
      </>}
    </section>
  );
}
