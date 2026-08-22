import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { BookingPageShell } from "@/components/booking/BookingPageShell";
import { FlightSummaryCard } from "@/components/booking/FlightSummaryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import {
  normalizeIndianMobile,
  travellerTypeLabel,
  validateTravellerBasics,
} from "@/lib/bookingValidation";
import type { Gender, TravellerTitle } from "@/types/booking";

const TravellerDetailsPage = () => {
  const navigate = useNavigate();
  const { state, updateTraveller, isInternational, isHotelOnly } = useFlightBooking();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onContinue = () => {
    const next = validateTravellerBasics(
      state.travellers,
      state.selectedFlight?.departureDate || state.hotel?.checkIn || ""
    );
    setErrors(next);
    if (Object.keys(next).length) return;
    if (isHotelOnly) {
      navigate("/booking/review");
      return;
    }
    navigate(isInternational ? "/booking/travel-documents" : "/booking/hotel");
  };

  const continueLabel = isHotelOnly
    ? "Continue to Review"
    : isInternational
      ? "Continue to Travel Documents"
      : "Continue to Hotel";

  return (
    <BookingPageShell
      step={1}
      require="flight"
      title={isHotelOnly ? "Guest Details" : "Traveller Details"}
      subtitle="Enter passenger information exactly as it appears on your ID."
    >
      <SEO
        title={isHotelOnly ? "Guest Details | IPNIA" : "Traveller Details | IPNIA"}
        description="Enter traveller details for your IPNIA booking."
        path="/booking/traveller-details"
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {state.travellers.map((t, index) => {
            const p = `t${index}`;
            const typeLabel = travellerTypeLabel(t.type);
            const isPrimaryAdult =
              (t.type || "adult") === "adult" &&
              index === state.travellers.findIndex((x) => (x.type || "adult") === "adult");
            return (
              <section key={t.id} className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5 md:p-6">
                <h2 className="text-lg font-semibold text-[#d4a853]">
                  {typeLabel} {index + 1}
                  {isPrimaryAdult ? " · Primary contact" : ""}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <Label className="text-white/70">Title</Label>
                    <select
                      className="mt-1.5 w-full rounded-md border border-white/15 bg-[#0a1628] px-3 py-2 text-white"
                      value={t.title}
                      onChange={(e) => updateTraveller(index, { title: e.target.value as TravellerTitle })}
                    >
                      {(["Mr", "Mrs", "Ms", "Other"] as TravellerTitle[]).map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="First Name *"
                    error={errors[`${p}.firstName`]}
                    value={t.firstName}
                    onChange={(v) => updateTraveller(index, { firstName: v })}
                  />
                  <Field
                    label="Middle Name"
                    error={errors[`${p}.middleName`]}
                    value={t.middleName}
                    onChange={(v) => updateTraveller(index, { middleName: v })}
                  />
                  <Field
                    label="Last Name *"
                    error={errors[`${p}.lastName`]}
                    value={t.lastName}
                    onChange={(v) => updateTraveller(index, { lastName: v })}
                  />
                  <Field
                    label="Date of Birth *"
                    type="date"
                    error={errors[`${p}.dateOfBirth`]}
                    value={t.dateOfBirth}
                    onChange={(v) => updateTraveller(index, { dateOfBirth: v })}
                  />
                  <div>
                    <Label className="text-white/70">Gender *</Label>
                    <select
                      className="mt-1.5 w-full rounded-md border border-white/15 bg-[#0a1628] px-3 py-2 text-white"
                      value={t.gender}
                      onChange={(e) => updateTraveller(index, { gender: e.target.value as Gender })}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors[`${p}.gender`] && <p className="mt-1 text-xs text-red-400">{errors[`${p}.gender`]}</p>}
                  </div>
                  <Field
                    label="Nationality *"
                    error={errors[`${p}.nationality`]}
                    value={t.nationality}
                    onChange={(v) => updateTraveller(index, { nationality: v })}
                  />
                  {isPrimaryAdult && (
                    <>
                      <Field
                        label="Email *"
                        type="email"
                        error={errors[`${p}.email`]}
                        value={t.email}
                        onChange={(v) => updateTraveller(index, { email: v })}
                      />
                      <div>
                        <Label className="text-white/70">Mobile Number *</Label>
                        <Input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={t.phone}
                          placeholder="10-digit Indian mobile"
                          onChange={(e) =>
                            updateTraveller(index, {
                              phone: normalizeIndianMobile(e.target.value).slice(0, 10),
                            })
                          }
                          className="mt-1.5 border-white/15 bg-[#0a1628] text-white placeholder:text-white/30"
                        />
                        {errors[`${p}.phone`] && (
                          <p className="mt-1 text-xs text-red-400">{errors[`${p}.phone`]}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>
            );
          })}

          <Button
            onClick={onContinue}
            className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
          >
            {continueLabel}
          </Button>
        </div>

        {state.selectedFlight && <FlightSummaryCard flight={state.selectedFlight} />}
        {isHotelOnly && state.hotel && (
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#0c1a2e] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#d4a853]">Hotel</p>
            <p className="mt-2 text-lg font-semibold">{state.hotel.name}</p>
            <p className="mt-1 text-sm text-white/60">{state.hotel.location}</p>
            <p className="mt-3 text-sm text-white/70">
              {state.hotel.checkIn} → {state.hotel.checkOut} · {state.hotel.nights} night
              {state.hotel.nights > 1 ? "s" : ""}
            </p>
          </aside>
        )}
      </div>
    </BookingPageShell>
  );
};

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-white/70">{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 border-white/15 bg-[#0a1628] text-white placeholder:text-white/30"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default TravellerDetailsPage;
