import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { HotelDestination } from "@/data/hotels";
import { bookingApi } from "@/services/bookingApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
};

export function HotelDestinationAutocomplete({
  label = "Destination",
  value = "",
  onChange,
}: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<HotelDestination[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    let active = true;
    bookingApi.searchHotelDestinations(open ? query : "").then((list) => {
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
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
        {label}
      </Label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <Input
          value={query}
          placeholder="City, hotel or area"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          className="h-12 border-white/15 bg-[#07111f] pl-10 text-white placeholder:text-white/35 focus-visible:ring-[#d4a853]"
        />
      </div>
      {open && (
        <div className="absolute z-40 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[#d4a853]/30 bg-[#0c1a2e] shadow-2xl">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#d4a853]/10"
              onClick={() => {
                setQuery(item.name);
                onChange(item.id);
                setOpen(false);
              }}
            >
              <span>
                <span className="block text-sm font-semibold text-white">{item.name}</span>
                <span className="block text-xs capitalize text-white/50">
                  {item.type} · {item.country}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
