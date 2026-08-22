import { Navigate } from "react-router-dom";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import type { ReactNode } from "react";
import type { Traveller } from "@/types/booking";

type GuardLevel = "flight" | "travellers" | "documents" | "hotel" | "review" | "payment" | "paid";

type Props = {
  children: ReactNode;
  step: 1 | 2 | 3 | 4 | 5;
  require: GuardLevel;
  title: string;
  subtitle?: string;
};

function hasBasics(t: Traveller) {
  return Boolean(
    t.firstName.trim() && t.lastName.trim() && t.dateOfBirth && t.gender && t.nationality.trim()
  );
}

function travellersComplete(
  hasDocs: boolean,
  isIntl: boolean,
  travellers: Traveller[]
) {
  if (!travellers.length) return false;
  if (!travellers.every(hasBasics)) return false;

  const primaryIdx = travellers.findIndex((t) => (t.type || "adult") === "adult");
  const primary = travellers[primaryIdx >= 0 ? primaryIdx : 0];
  if (!primary?.email.trim() || !primary?.phone.trim()) return false;

  if (!hasDocs || !isIntl) return true;
  return travellers.every(
    (t) =>
      t.document.passportNumber.trim() &&
      t.document.issuingCountry.trim() &&
      t.document.expiryDate &&
      t.document.nationality.trim()
  );
}

export function BookingPageShell({ children, step, require, title, subtitle }: Props) {
  const { state, isInternational, isHotelOnly } = useFlightBooking();

  if (!state.selectedFlight && !isHotelOnly) {
    return <Navigate to="/flights/search" replace />;
  }

  if (require === "travellers" || require === "documents" || require === "hotel" || require === "review" || require === "payment" || require === "paid") {
    const basicsOk = travellersComplete(false, isInternational, state.travellers);
    if (!basicsOk && step > 1) {
      return <Navigate to="/booking/traveller-details" replace />;
    }
  }

  if (
    !isHotelOnly &&
    (require === "documents" || require === "hotel" || require === "review" || require === "payment" || require === "paid") &&
    isInternational
  ) {
    const docsOk = travellersComplete(true, true, state.travellers);
    if (!docsOk && step > 2) {
      return <Navigate to="/booking/travel-documents" replace />;
    }
  }

  // Hotel-only bookings already have a hotel selected — skip flight hotel step
  if (
    !isHotelOnly &&
    (require === "review" || require === "payment" || require === "paid") &&
    !state.hotelSkipped &&
    !state.hotel &&
    step > 3
  ) {
    return <Navigate to="/booking/hotel" replace />;
  }

  if ((require === "payment" || require === "paid") && !state.reviewConsent) {
    return <Navigate to="/booking/review" replace />;
  }

  if (require === "paid" && state.paymentStatus !== "SUCCESS") {
    return <Navigate to="/booking/payment-status" replace />;
  }

  const maxReachable = !travellersComplete(false, isInternational, state.travellers)
    ? 1
    : !isHotelOnly && isInternational && !travellersComplete(true, true, state.travellers)
      ? 2
      : !isHotelOnly && !state.hotelSkipped && !state.hotel
        ? 3
        : !state.reviewConsent
          ? 4
          : 5;

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <BookingNav />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <BookingProgress
          currentStep={step}
          maxReachableStep={Math.min(maxReachable, step)}
          isInternational={!isHotelOnly && isInternational}
          isHotelOnly={isHotelOnly}
        />
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4a853]">Booking</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-white/60">{subtitle}</p>}
        </div>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
