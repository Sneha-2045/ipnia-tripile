import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, ArrowRight, Hotel, Plane } from "lucide-react";
import { Airport } from "@/data/airports";
import { CabinClass, TripType } from "@/services/bookingApi";
import { AirportAutocomplete } from "./AirportAutocomplete";
import { HotelDestinationAutocomplete } from "./HotelDestinationAutocomplete";
import { Button } from "@/components/ui/button";
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
};

export function BookingSearchCard({ defaultMode = "flights" }: Props) {
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
    <div className="w-full max-w-3xl rounded-3xl border border-[#d4a853]/35 bg-[#0c1a2e]/95 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("flights")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "flights"
              ? "bg-[#d4a853] text-[#0a1628]"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Plane className="h-4 w-4" /> Flights
        </button>
        <button
          type="button"
          onClick={() => setMode("hotels")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "hotels"
              ? "bg-[#d4a853] text-[#0a1628]"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Hotel className="h-4 w-4" /> Hotels
        </button>
      </div>

      {mode === "flights" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["oneway", "roundtrip"] as TripType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTripType(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                  tripType === t ? "bg-[#d4a853]/20 text-[#d4a853]" : "text-white/50 hover:text-white/80"
                }`}
              >
                {t === "oneway" ? "One way" : "Round trip"}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <AirportAutocomplete label="From" value={from} onChange={setFrom} />
            <div className="flex items-end justify-center pb-1">
              <button
                type="button"
                onClick={swapAirports}
                className="rounded-full border border-white/15 p-2 text-white/70 hover:border-[#d4a853]/50 hover:text-[#d4a853]"
                aria-label="Swap airports"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>
            <AirportAutocomplete label="To" value={to} onChange={setTo} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Departure
              </Label>
              <Input
                type="date"
                min={minDeparture}
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="h-12 border-white/15 bg-[#07111f] text-white focus-visible:ring-[#d4a853]"
              />
            </div>
            {tripType === "roundtrip" && (
              <div>
                <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                  Return
                </Label>
                <Input
                  type="date"
                  min={departure || minDeparture}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="h-12 border-white/15 bg-[#07111f] text-white focus-visible:ring-[#d4a853]"
                />
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Adults
              </Label>
              <Select value={adults} onValueChange={setAdults}>
                <SelectTrigger className="h-12 border-white/15 bg-[#07111f] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Children
              </Label>
              <Select value={children} onValueChange={setChildren}>
                <SelectTrigger className="h-12 border-white/15 bg-[#07111f] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => String(i)).map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Infants
              </Label>
              <Select value={infants} onValueChange={setInfants}>
                <SelectTrigger className="h-12 border-white/15 bg-[#07111f] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => String(i)).map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Cabin
              </Label>
              <Select value={cabin} onValueChange={(v) => setCabin(v as CabinClass)}>
                <SelectTrigger className="h-12 border-white/15 bg-[#07111f] text-white">
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
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Stops
              </Label>
              <Select value={maxConnections} onValueChange={setMaxConnections}>
                <SelectTrigger className="h-12 border-white/15 bg-[#07111f] text-white">
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
            className="h-12 w-full bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
          >
            Search Flights <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <HotelDestinationAutocomplete
            selected={selectedDestination}
            value={selectedDestination?.description || ""}
            onChange={setSelectedDestination}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Check-in
              </Label>
              <Input
                type="date"
                min={minCheckIn}
                value={checkIn}
                onChange={(e) => {
                  const next = e.target.value;
                  setCheckIn(next);
                  if (checkOut <= next) setCheckOut(plusDaysISO(1, next));
                }}
                className="h-12 border-white/15 bg-[#07111f] text-white focus-visible:ring-[#d4a853]"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Check-out
              </Label>
              <Input
                type="date"
                min={plusDaysISO(1, checkIn || minCheckIn)}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-12 border-white/15 bg-[#07111f] text-white focus-visible:ring-[#d4a853]"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Guests
              </Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="h-12 border-white/15 bg-[#07111f] text-white">
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
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Rooms
              </Label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger className="h-12 border-white/15 bg-[#07111f] text-white">
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
            className="h-12 w-full bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
          >
            Search Hotels <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
