import { useEffect, useRef, useState } from "react";
import { Plane } from "lucide-react";
import { Airport } from "@/data/airports";
import { bookingApi } from "@/services/bookingApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  label: string;
  placeholder?: string;
  value?: Airport | null;
  onChange: (airport: Airport | null) => void;
};

export function AirportAutocomplete({
  label,
  placeholder = "City or airport",
  value,
  onChange,
}: Props) {
  const [query, setQuery] = useState(value ? `${value.city} (${value.code})` : "");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Airport[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) setQuery(`${value.city} (${value.code})`);
  }, [value]);

  useEffect(() => {
    let active = true;
    bookingApi.searchAirports(open ? query.replace(/\([^)]*\)/g, "").trim() : "").then((list) => {
      if (active) setResults(list);
    });
    return () => {
      active = false;
    };
  }, [query, open]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <Label className="ipnia-label">{label}</Label>
      <div className="relative">
        <Plane className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/65" />
        <Input
          value={query}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) onChange(null);
          }}
          className="ipnia-input pl-10 placeholder:text-white/65"
        />
      </div>
      {open && (
        <div className="absolute z-40 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[#e2b552]/35 bg-[#142a44]/98 shadow-travel backdrop-blur-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-white/75">No airports found</p>
          ) : (
            results.map((airport) => (
              <button
                key={airport.code}
                type="button"
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#e2b552]/10"
                onClick={() => {
                  onChange(airport);
                  setQuery(`${airport.city} (${airport.code})`);
                  setOpen(false);
                }}
              >
                <span className="mt-0.5 rounded-md bg-[#e2b552]/15 px-2 py-0.5 text-xs font-bold text-[#e2b552]">
                  {airport.code}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{airport.city}</span>
                  <span className="block text-xs text-white/75">{airport.name}</span>
                  <span className="block text-xs text-white/65">
                    {airport.code}
                    {airport.country ? ` · ${airport.country}` : ""}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
