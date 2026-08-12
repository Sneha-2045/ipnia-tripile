import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, ArrowRight, Hotel, Plane } from "lucide-react";
import { Airport, getAirportByCode } from "@/data/airports";
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

type Mode = "flights" | "hotels";

type Props = {
  defaultMode?: Mode;
};

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function plusDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function BookingSearchCard({ defaultMode = "flights" }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>(defaultMode);

  const [tripType, setTripType] = useState<TripType>("oneway");
  const [from, setFrom] = useState<Airport | null>(() => getAirportByCode("DEL") ?? null);
  const [to, setTo] = useState<Airport | null>(() => getAirportByCode("BOM") ?? null);
  const [departure, setDeparture] = useState(tomorrowISO());
  const [returnDate, setReturnDate] = useState(plusDaysISO(4));
  const [travellers, setTravellers] = useState("1");
  const [cabin, setCabin] = useState<CabinClass>("economy");

  const [destination, setDestination] = useState("mumbai");
  const [checkIn, setCheckIn] = useState(tomorrowISO());
  const [checkOut, setCheckOut] = useState(plusDaysISO(3));
  const [guests, setGuests] = useState("2");
  const [rooms, setRooms] = useState("1");

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

    const params = new URLSearchParams({
      from: from.code,
      to: to.code,
      departure,
      travellers,
      cabin,
      tripType,
    });
    if (tripType === "roundtrip" && returnDate) params.set("return", returnDate);
    navigate(`/flights/search?${params.toString()}`);
  };

  const searchHotels = () => {
    if (!destination) {
      toast({ title: "Select destination", description: "Please choose a city or area.", variant: "destructive" });
      return;
    }
    if (!checkIn || !checkOut) {
      toast({ title: "Select dates", description: "Please choose check-in and check-out.", variant: "destructive" });
      return;
    }
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      guests,
      rooms,
    });
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
              : "border border-white/15 bg-white/5 text-white/80 hover:border-[#d4a853]/40"
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
              : "border border-white/15 bg-white/5 text-white/80 hover:border-[#d4a853]/40"
          }`}
        >
          <Hotel className="h-4 w-4" /> Hotels
        </button>
      </div>

      {mode === "flights" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["oneway", "One Way"],
                ["roundtrip", "Round Trip"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTripType(value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  tripType === value
                    ? "bg-white text-[#0a1628]"
                    : "border border-white/15 text-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <AirportAutocomplete label="From" value={from} onChange={setFrom} />
            <button
              type="button"
              onClick={swapAirports}
              className="mx-auto mb-1 flex h-11 w-11 items-center justify-center rounded-full border border-[#d4a853]/40 text-[#d4a853] transition hover:bg-[#d4a853]/10 md:mb-0"
              aria-label="Swap airports"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <AirportAutocomplete label="To" value={to} onChange={setTo} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Departure
              </Label>
              <Input
                type="date"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="h-12 border-white/15 bg-[#07111f] text-white focus-visible:ring-[#d4a853]"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Return
              </Label>
              <Input
                type="date"
                value={returnDate}
                disabled={tripType === "oneway"}
                onChange={(e) => setReturnDate(e.target.value)}
                className="h-12 border-white/15 bg-[#07111f] text-white disabled:opacity-40 focus-visible:ring-[#d4a853]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Travellers
              </Label>
              <Select value={travellers} onValueChange={setTravellers}>
                <SelectTrigger className="h-12 border-white/15 bg-[#07111f] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} Traveller{n > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          </div>

          <Button
            type="button"
            onClick={searchFlights}
            className="h-12 w-full bg-[#d4a853] text-base font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
          >
            Search Flights <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <HotelDestinationAutocomplete value={destination} onChange={setDestination} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Check-in
              </Label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-12 border-white/15 bg-[#07111f] text-white focus-visible:ring-[#d4a853]"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Check-out
              </Label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-12 border-white/15 bg-[#07111f] text-white focus-visible:ring-[#d4a853]"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                Guests
              </Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="h-12 border-white/15 bg-[#07111f] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} Guest{n > 1 ? "s" : ""}
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
                  <SelectValue placeholder={guestLabel} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} Room{n > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-white/45">{guestLabel}</p>
          <Button
            type="button"
            onClick={searchHotels}
            className="h-12 w-full bg-[#d4a853] text-base font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
          >
            Search Hotels <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
