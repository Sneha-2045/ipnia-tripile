import type { NormalizedFlightOffer } from "@/types/duffelFlight";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FlightSort =
  | "cheapest"
  | "fastest"
  | "earliest_departure"
  | "latest_departure";

export type StopsFilter = "any" | "nonstop" | "1" | "2plus";

export type FlightFiltersState = {
  sort: FlightSort;
  stops: StopsFilter;
  airline: string;
  cabin: string;
  maxPrice: string;
  maxDurationHours: string;
  departFrom: string;
  departTo: string;
  arriveFrom: string;
  arriveTo: string;
};

export const defaultFlightFilters: FlightFiltersState = {
  sort: "cheapest",
  stops: "any",
  airline: "any",
  cabin: "any",
  maxPrice: "",
  maxDurationHours: "",
  departFrom: "",
  departTo: "",
  arriveFrom: "",
  arriveTo: "",
};

function timeToMinutes(hhmm: string | null) {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function applyFlightFilters(
  offers: NormalizedFlightOffer[],
  filters: FlightFiltersState
): NormalizedFlightOffer[] {
  let list = [...offers];

  if (filters.stops === "nonstop") list = list.filter((o) => o.stops === 0);
  if (filters.stops === "1") list = list.filter((o) => o.stops === 1);
  if (filters.stops === "2plus") list = list.filter((o) => o.stops >= 2);

  if (filters.airline !== "any") {
    list = list.filter((o) =>
      o.airlines.some((a) => (a.iataCode || a.name) === filters.airline)
    );
  }

  if (filters.cabin !== "any") {
    list = list.filter((o) => o.cabinClass === filters.cabin);
  }

  if (filters.maxPrice) {
    const max = Number(filters.maxPrice);
    if (Number.isFinite(max)) {
      list = list.filter((o) => Number(o.totalAmount) <= max);
    }
  }

  if (filters.maxDurationHours) {
    const maxMins = Number(filters.maxDurationHours) * 60;
    if (Number.isFinite(maxMins)) {
      list = list.filter(
        (o) => o.durationMinutes == null || o.durationMinutes <= maxMins
      );
    }
  }

  const depFrom = timeToMinutes(filters.departFrom || null);
  const depTo = timeToMinutes(filters.departTo || null);
  if (depFrom != null || depTo != null) {
    list = list.filter((o) => {
      const t = timeToMinutes(o.departureTime);
      if (t == null) return true;
      if (depFrom != null && t < depFrom) return false;
      if (depTo != null && t > depTo) return false;
      return true;
    });
  }

  const arrFrom = timeToMinutes(filters.arriveFrom || null);
  const arrTo = timeToMinutes(filters.arriveTo || null);
  if (arrFrom != null || arrTo != null) {
    list = list.filter((o) => {
      const t = timeToMinutes(o.arrivalTime);
      if (t == null) return true;
      if (arrFrom != null && t < arrFrom) return false;
      if (arrTo != null && t > arrTo) return false;
      return true;
    });
  }

  list.sort((a, b) => {
    if (filters.sort === "cheapest") {
      return Number(a.totalAmount || Infinity) - Number(b.totalAmount || Infinity);
    }
    if (filters.sort === "fastest") {
      return (a.durationMinutes || Infinity) - (b.durationMinutes || Infinity);
    }
    if (filters.sort === "earliest_departure") {
      return (timeToMinutes(a.departureTime) ?? 9999) - (timeToMinutes(b.departureTime) ?? 9999);
    }
    return (timeToMinutes(b.departureTime) ?? -1) - (timeToMinutes(a.departureTime) ?? -1);
  });

  return list;
}

export function FlightSearchFilters({
  filters,
  onChange,
  airlineOptions,
  cabinOptions,
}: {
  filters: FlightFiltersState;
  onChange: (next: FlightFiltersState) => void;
  airlineOptions: Array<{ value: string; label: string }>;
  cabinOptions: Array<{ value: string; label: string }>;
}) {
  const set = <K extends keyof FlightFiltersState>(key: K, value: FlightFiltersState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
        Filter & sort
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label className="text-white/60">Sort by</Label>
          <Select value={filters.sort} onValueChange={(v) => set("sort", v as FlightSort)}>
            <SelectTrigger className="mt-1 border-white/15 bg-[#07111f] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cheapest">Cheapest</SelectItem>
              <SelectItem value="fastest">Fastest</SelectItem>
              <SelectItem value="earliest_departure">Earliest departure</SelectItem>
              <SelectItem value="latest_departure">Latest departure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white/60">Stops</Label>
          <Select value={filters.stops} onValueChange={(v) => set("stops", v as StopsFilter)}>
            <SelectTrigger className="mt-1 border-white/15 bg-[#07111f] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="nonstop">Non-stop</SelectItem>
              <SelectItem value="1">1 stop</SelectItem>
              <SelectItem value="2plus">2+ stops</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white/60">Airline</Label>
          <Select value={filters.airline} onValueChange={(v) => set("airline", v)}>
            <SelectTrigger className="mt-1 border-white/15 bg-[#07111f] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any airline</SelectItem>
              {airlineOptions.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white/60">Cabin</Label>
          <Select value={filters.cabin} onValueChange={(v) => set("cabin", v)}>
            <SelectTrigger className="mt-1 border-white/15 bg-[#07111f] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any cabin</SelectItem>
              {cabinOptions.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white/60">Max price</Label>
          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => set("maxPrice", e.target.value)}
            placeholder="Any"
            className="mt-1 h-10 w-full rounded-md border border-white/15 bg-[#07111f] px-3 text-white"
          />
        </div>
        <div>
          <Label className="text-white/60">Max duration (hours)</Label>
          <input
            type="number"
            min={1}
            value={filters.maxDurationHours}
            onChange={(e) => set("maxDurationHours", e.target.value)}
            placeholder="Any"
            className="mt-1 h-10 w-full rounded-md border border-white/15 bg-[#07111f] px-3 text-white"
          />
        </div>
        <div>
          <Label className="text-white/60">Depart after</Label>
          <input
            type="time"
            value={filters.departFrom}
            onChange={(e) => set("departFrom", e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-white/15 bg-[#07111f] px-3 text-white"
          />
        </div>
        <div>
          <Label className="text-white/60">Depart before</Label>
          <input
            type="time"
            value={filters.departTo}
            onChange={(e) => set("departTo", e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-white/15 bg-[#07111f] px-3 text-white"
          />
        </div>
        <div>
          <Label className="text-white/60">Arrive after</Label>
          <input
            type="time"
            value={filters.arriveFrom}
            onChange={(e) => set("arriveFrom", e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-white/15 bg-[#07111f] px-3 text-white"
          />
        </div>
        <div>
          <Label className="text-white/60">Arrive before</Label>
          <input
            type="time"
            value={filters.arriveTo}
            onChange={(e) => set("arriveTo", e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-white/15 bg-[#07111f] px-3 text-white"
          />
        </div>
      </div>
    </div>
  );
}
