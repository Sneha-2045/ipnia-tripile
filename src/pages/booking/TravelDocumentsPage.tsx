import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { BookingPageShell } from "@/components/booking/BookingPageShell";
import { FlightSummaryCard } from "@/components/booking/FlightSummaryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import { validateTravelDocuments } from "@/lib/bookingValidation";

const TravelDocumentsPage = () => {
  const navigate = useNavigate();
  const { state, updateTraveller, isInternational } = useFlightBooking();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onContinue = () => {
    if (isInternational) {
      const next = validateTravelDocuments(
        state.travellers,
        state.selectedFlight?.departureDate || "",
        true
      );
      setErrors(next);
      if (Object.keys(next).length) return;
    }
    navigate("/booking/hotel");
  };

  return (
    <BookingPageShell
      step={2}
      require="travellers"
      title="Travel Documents"
      subtitle={
        isInternational
          ? "Passport details must match the document you will travel with."
          : "Passport details are not required for this domestic journey."
      }
    >
      <SEO
        title="Travel Documents | IPNIA"
        description="Enter travel document details for your IPNIA booking."
        path="/booking/travel-documents"
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {!isInternational ? (
            <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
              <p className="text-white/75">
                This is a domestic flight within India. You can continue without passport details.
                Carry a valid government ID as required by the airline.
              </p>
            </section>
          ) : (
            state.travellers.map((t, index) => {
              const p = `t${index}`;
              const doc = t.document;
              return (
                <section key={t.id} className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5 md:p-6">
                  <h2 className="text-lg font-semibold text-[#d4a853]">
                    Passport — Traveller {index + 1} ({t.firstName || "Passenger"})
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <DocField
                      label="Passport Number *"
                      value={doc.passportNumber}
                      error={errors[`${p}.passportNumber`]}
                      onChange={(v) =>
                        updateTraveller(index, { document: { ...doc, passportNumber: v.toUpperCase() } })
                      }
                    />
                    <DocField
                      label="Issuing Country *"
                      value={doc.issuingCountry}
                      error={errors[`${p}.issuingCountry`]}
                      onChange={(v) => updateTraveller(index, { document: { ...doc, issuingCountry: v } })}
                    />
                    <DocField
                      label="Date of Issue"
                      type="date"
                      value={doc.issueDate}
                      onChange={(v) => updateTraveller(index, { document: { ...doc, issueDate: v } })}
                    />
                    <DocField
                      label="Passport Expiry *"
                      type="date"
                      value={doc.expiryDate}
                      error={errors[`${p}.expiryDate`]}
                      onChange={(v) => updateTraveller(index, { document: { ...doc, expiryDate: v } })}
                    />
                    <DocField
                      label="Nationality *"
                      value={doc.nationality}
                      error={errors[`${p}.docNationality`]}
                      onChange={(v) => updateTraveller(index, { document: { ...doc, nationality: v } })}
                    />
                  </div>
                </section>
              );
            })
          )}

          <Button
            onClick={onContinue}
            className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
          >
            Continue to Hotel
          </Button>
        </div>
        {state.selectedFlight && <FlightSummaryCard flight={state.selectedFlight} />}
      </div>
    </BookingPageShell>
  );
};

function DocField({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <Label className="text-white/70">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 border-white/15 bg-[#0a1628] text-white"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default TravelDocumentsPage;
