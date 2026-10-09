import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, ArrowRight, Hotel, Plane } from "lucide-react";
import { Airport } from "@/data/airports";
import { CabinClass, TripType } from "@/services/bookingApi";
import { AirportAutocomplete } from "./AirportAutocomplete";
import { HotelDestinationAutocomplete } from "./HotelDestinationAutocomplete";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { saveRecentHotelDestination } from "@/lib/recentHotelDestinations";
import {
  airportsFromLastSearch,
  loadLastFlightSearch,
  plusDaysISO,
  saveLastFlightSearch,
  todayISO,
} from "@/lib/lastFlightSearch";
import type { SelectedHotelDestination } from "@/services/hotelSearchApi";

type Mode = "flights" | "hotels";

type Props = {
  defaultMode?: Mode;
  flightOnly?: boolean;
};

export function BookingSearchCard({ defaultMode = "flights", flightOnly = false }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>(defaultMode);

  const last = useMemo(() => loadLastFlightSearch(), []);
  const lastAirports = useMemo(() => airportsFromLastSearch(), []);

  const [tripType, setTripType] = useState<TripType>((last?.tripType as TripType) || "oneway");
  const [from, setFrom] = useState<Airport | null>(() => lastAirports.from);
  const [to, setTo] = useState<Airport | null>(() => lastAirports.to);
  const [departure, setDeparture] = useState(last?.departure || plusDaysISO(1));
  const [returnDate, setReturnDate] = useState(last?.returnDate || plusDaysISO(4));
  const [adults, setAdults] = useState(last?.adults || "1");
  const [children, setChildren] = useState(last?.children || "0");
  const [infants, setInfants] = useState(last?.infants || "0");
  const [cabin, setCabin] = useState<CabinClass>((last?.cabin as CabinClass) || "economy");
  const [maxConnections, setMaxConnections] = useState(last?.maxConnections || "any");

  const [selectedDestination, setSelectedDestination] = useState<SelectedHotelDestination | null>(null);
  const [checkIn, setCheckIn] = useState(plusDaysISO(1));
  const [checkOut, setCheckOut] = useState(plusDaysISO(3));
  const [guests, setGuests] = useState("2");
  const [rooms, setRooms] = useState("1");

  const minDeparture = todayISO();
  const minCheckIn = todayISO();

  const guestLabel = useMemo(
    () => `${guests} Guest${guests === "1" ? "" : "s"} · ${rooms} Room${rooms === "1" ? "" : "s"}`,
    [guests, rooms]
  );
  const travellerCount = Number(adults) + Number(children) + Number(infants);
  const travellerLabel = `${travellerCount} Traveller${travellerCount === 1 ? "" : "s"}`;

  const swapAirports = () => {
    setFrom(to);
    setTo(from);
  };

  const searchFlights = () => {
    if (!from || !to) {
      toast({ title: "Select airports", description: "Please choose both From and To.", variant: "destructive" });
      return;
    }
    if (from.code === to.code) {
      toast({ title: "Invalid route", description: "From and To cannot be the same.", variant: "destructive" });
      return;
    }
    if (!departure) {
      toast({ title: "Select departure", description: "Please choose a departure date.", variant: "destructive" });
      return;
    }
    if (departure < minDeparture) {
      toast({ title: "Invalid date", description: "Departure cannot be in the past.", variant: "destructive" });
      return;
    }
    if (tripType === "roundtrip") {
      if (!returnDate) {
        toast({ title: "Select return", description: "Return date is required for round trip.", variant: "destructive" });
        return;
      }
      if (returnDate < departure) {
        toast({
          title: "Invalid return date",
          description: "Return date must not be before departure.",
          variant: "destructive",
        });
        return;
      }
    }

    const adultsN = Number(adults);
    const childrenN = Number(children);
    const infantsN = Number(infants);
    if (!Number.isInteger(adultsN) || adultsN < 1) {
      toast({ title: "Passengers", description: "At least one adult is required.", variant: "destructive" });
      return;
    }
    if (infantsN > adultsN) {
      toast({
        title: "Passengers",
        description: "Infants cannot exceed the number of adults.",
        variant: "destructive",
      });
      return;
    }
    if (adultsN + childrenN + infantsN > 9) {
      toast({ title: "Passengers", description: "Maximum 9 passengers per search.", variant: "destructive" });
      return;
    }

    const params = new URLSearchParams({
      from: from.code,
      to: to.code,
      departure,
      adults: String(adultsN),
      children: String(childrenN),
      infants: String(infantsN),
      travellers: String(adultsN + childrenN + infantsN),
      cabin,
      tripType,
    });
    if (tripType === "roundtrip" && returnDate) params.set("return", returnDate);
    if (maxConnections !== "any") params.set("maxConnections", maxConnections);

    saveLastFlightSearch({
      from: from.code,
      to: to.code,
      departure,
      returnDate: tripType === "roundtrip" ? returnDate : undefined,
      adults: String(adultsN),
      children: String(childrenN),
      infants: String(infantsN),
      cabin,
      tripType,
      maxConnections: maxConnections !== "any" ? maxConnections : undefined,
    });

    navigate(`/flights/search?${params.toString()}`);
  };

  const searchHotels = () => {
    if (!selectedDestination?.placeId) {
      toast({
        title: "Select destination",
        description: "Please choose a destination from the Google Places suggestions.",
        variant: "destructive",
      });
      return;
    }
    if (!checkIn || !checkOut) {
      toast({ title: "Select dates", description: "Please choose check-in and check-out.", variant: "destructive" });
      return;
    }
    if (checkIn < minCheckIn) {
      toast({ title: "Invalid check-in", description: "Check-in cannot be in the past.", variant: "destructive" });
      return;
    }
    if (checkOut <= checkIn) {
      toast({
        title: "Invalid check-out",
        description: "Check-out must be after check-in.",
        variant: "destructive",
      });
      return;
    }
    const params = new URLSearchParams({
      destination: selectedDestination.description || selectedDestination.mainText,
      placeId: selectedDestination.placeId,
      checkIn,
      checkOut,
      guests,
      rooms,
    });
    if (selectedDestination.latitude != null) {
      params.set("lat", String(selectedDestination.latitude));
    }
    if (selectedDestination.longitude != null) {
      params.set("lng", String(selectedDestination.longitude));
    }
    if (selectedDestination.city) params.set("city", selectedDestination.city);
    if (selectedDestination.country) params.set("country", selectedDestination.country);
    saveRecentHotelDestination(selectedDestination);
    navigate(`/hotels/search?${params.toString()}`);
  };

  return (
    <div className="ipnia-search-panel">
      {!flightOnly && <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("flights")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            mode === "flights"
              ? "bg-[#e2b552] text-[#0a1628] shadow-gold"
              : "border border-slate-300 bg-slate-100 text-slate-700 hover:border-amber-500/50 hover:bg-amber-50"
          }`}
        >
          <Plane className="h-4 w-4" /> Flights
        </button>
        <button
          type="button"
          onClick={() => setMode("hotels")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            mode === "hotels"
              ? "bg-[#e2b552] text-[#0a1628] shadow-gold"
              : "border border-slate-300 bg-slate-100 text-slate-700 hover:border-amber-500/50 hover:bg-amber-50"
          }`}
        >
          <Hotel className="h-4 w-4" /> Hotels
        </button>
      </div>}

      {mode === "flights" ? (
        <div className="space-y-4 search-mode-enter">
          <div className="flex w-fit rounded-full border border-sky-500 p-1">
            {(["oneway", "roundtrip"] as TripType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTripType(t)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  tripType === t
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-800 hover:bg-sky-50"
                }`}
              >
                {t === "oneway" ? "One way" : "Round trip"}
              </button>
            ))}
          </div>

          <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <AirportAutocomplete label="Depart From" value={from} onChange={setFrom} />
            <div className="flex justify-center pb-1 sm:pb-0.5">
              <button
                type="button"
                onClick={swapAirports}
                className="rounded-full border border-sky-500 bg-white p-2.5 text-sky-700 transition hover:bg-sky-50 hover:shadow-sm"
                aria-label="Swap airports"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>
            <AirportAutocomplete label="Going To" value={to} onChange={setTo} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="ipnia-label">Departure</Label>
              <Input
                type="date"
                min={minDeparture}
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="ipnia-input"
              />
            </div>
            <div className="search-mode-enter">
              <Label className="ipnia-label">Return Date</Label>
              {tripType === "roundtrip" ? (
                <Input
                  type="date"
                  min={departure || minDeparture}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="ipnia-input"
                />
              ) : (
                <button type="button" onClick={() => setTripType("roundtrip")} className="flex h-12 w-full items-center rounded-xl border border-slate-200 bg-white px-3 text-left text-sm font-medium text-sky-700 transition hover:border-sky-400 hover:bg-sky-50">
                  Book a round trip to save more
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="ipnia-label">Travellers</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="ipnia-input flex w-full items-center justify-between px-3 text-left text-base font-medium">
                    {travellerLabel}<span aria-hidden="true" className="text-slate-500">⌄</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-80 border-slate-200 bg-white text-[#18324b] shadow-xl">
                  {(["Adults", "Children", "Infants"] as const).map((label) => {
                    const value = label === "Adults" ? adults : label === "Children" ? children : infants;
                    const setter = label === "Adults" ? setAdults : label === "Children" ? setChildren : setInfants;
                    const count = Number(value);
                    const min = label === "Adults" ? 1 : 0;
                    const max = label === "Infants" ? Math.min(5, Number(adults)) : 9;
                    return <div key={label} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
                      <div><p className="font-semibold">{label}</p><p className="text-xs text-slate-500">{label === "Adults" ? "Age 12+" : label === "Children" ? "Age 2–11" : "Under 2"}</p></div>
                      <div className="flex items-center gap-3"><button type="button" aria-label={`Remove ${label.toLowerCase()}`} disabled={count <= min} onClick={() => setter(String(count - 1))} className="h-8 w-8 rounded-full border border-slate-300 disabled:opacity-40">−</button><span className="w-4 text-center">{count}</span><button type="button" aria-label={`Add ${label.toLowerCase()}`} disabled={count >= max || travellerCount >= 9} onClick={() => setter(String(count + 1))} className="h-8 w-8 rounded-full border border-slate-300 disabled:opacity-40">+</button></div>
                    </div>;
                  })}
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="ipnia-label">Cabin</Label>
              <Select value={cabin} onValueChange={(v) => setCabin(v as CabinClass)}>
                <SelectTrigger className="ipnia-input [&>svg]:text-[#8a6412]"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="economy">Economy</SelectItem><SelectItem value="premium">Premium Economy</SelectItem><SelectItem value="business">Business</SelectItem><SelectItem value="first">First</SelectItem></SelectContent>
              </Select>
            </div>
          </div>

          <details className="group">
            <summary className="w-fit cursor-pointer text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-[#805d12]">More flight options</summary>
            <div className="mt-3 max-w-sm"><Label className="ipnia-label">Stops</Label><Select value={maxConnections} onValueChange={setMaxConnections}><SelectTrigger className="ipnia-input [&>svg]:text-[#8a6412]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem><SelectItem value="0">Non-stop</SelectItem><SelectItem value="1">Max 1 stop</SelectItem><SelectItem value="2">Max 2 stops</SelectItem></SelectContent></Select></div>
          </details>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="ipnia-label">Cabin</Label>
              <Select value={cabin} onValueChange={(v) => setCabin(v as CabinClass)}>
                <SelectTrigger className="ipnia-input [&>svg]:text-[#f0ca72] [&>svg]:opacity-90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="ipnia-label">Stops</Label>
              <Select value={maxConnections} onValueChange={setMaxConnections}>
                <SelectTrigger className="ipnia-input [&>svg]:text-[#f0ca72] [&>svg]:opacity-90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="0">Non-stop</SelectItem>
                  <SelectItem value="1">Max 1 stop</SelectItem>
                  <SelectItem value="2">Max 2 stops</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            onClick={searchFlights}
            className="ipnia-btn-gold ipnia-search-submit h-14 w-full rounded-full text-lg"
          >
            Search Flights <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4 search-mode-enter">
          <HotelDestinationAutocomplete
            selected={selectedDestination}
            value={selectedDestination?.description || ""}
            onChange={setSelectedDestination}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="ipnia-label">Check-in</Label>
              <Input
                type="date"
                min={minCheckIn}
                value={checkIn}
                onChange={(e) => {
                  const next = e.target.value;
                  setCheckIn(next);
                  if (checkOut <= next) setCheckOut(plusDaysISO(1, next));
                }}
                className="ipnia-input"
              />
            </div>
            <div>
              <Label className="ipnia-label">Check-out</Label>
              <Input
                type="date"
                min={plusDaysISO(1, checkIn || minCheckIn)}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="ipnia-input"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="ipnia-label">Guests</Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="ipnia-input [&>svg]:text-[#f0ca72] [&>svg]:opacity-90">
                  <SelectValue placeholder={guestLabel} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => String(i + 1)).map((n) => (
                    <SelectItem key={n} value={n}>
                      {n} Guest{n === "1" ? "" : "s"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="ipnia-label">Rooms</Label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger className="ipnia-input [&>svg]:text-[#f0ca72] [&>svg]:opacity-90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => String(i + 1)).map((n) => (
                    <SelectItem key={n} value={n}>
                      {n} Room{n === "1" ? "" : "s"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="button"
            onClick={searchHotels}
            className="ipnia-btn-gold h-12 w-full rounded-xl text-base"
          >
            Search Hotels <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
