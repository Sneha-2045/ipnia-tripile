import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import { formatInr } from "@/lib/bookingValidation";
import { getPaymentStatus } from "@/lib/paymentApi";

const BookingPaymentStatusPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { state, setPaymentStatus, setBookingReference, setPaymentInfo } = useFlightBooking();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [remoteStatus, setRemoteStatus] = useState<string>("PENDING");
  const [amountPaid, setAmountPaid] = useState<number | null>(null);

  const orderId =
    params.get("order_id") ||
    params.get("orderId") ||
    state.cashfreeOrderId ||
    sessionStorage.getItem("ipnia_pending_order_id") ||
    "";

  useEffect(() => {
    if (!state.selectedFlight) {
      navigate("/flights/search", { replace: true });
      return;
    }
    if (!orderId) {
      setError("Missing order reference.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await getPaymentStatus(orderId);
        if (cancelled) return;
        const status = String(res.payment?.paymentStatus || "PENDING").toUpperCase();
        setRemoteStatus(status);
        setAmountPaid(res.payment?.amount ?? null);
        setPaymentStatus(
          status === "SUCCESS"
            ? "SUCCESS"
            : status === "FAILED" || status === "USER_DROPPED"
              ? "FAILED"
              : "PENDING"
        );

        if (status === "SUCCESS") {
          const ref = `IPNIA-${orderId.slice(-8).toUpperCase()}`;
          setBookingReference(ref);
          if (!state.cashfreeOrderId) {
            setPaymentInfo({
              cashfreeOrderId: orderId,
              paymentSessionId: state.paymentSessionId || "",
              paymentStatus: "SUCCESS",
            });
          }
          setLoading(false);
          return;
        }

        if (status === "FAILED" || status === "USER_DROPPED") {
          setLoading(false);
          return;
        }

        attempts += 1;
        if (attempts < 12) {
          setTimeout(poll, 2000);
        } else {
          setLoading(false);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Verification failed");
        setLoading(false);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [orderId, navigate, setBookingReference, setPaymentStatus, state.selectedFlight]);

  const success = remoteStatus === "SUCCESS";
  const failed = remoteStatus === "FAILED" || remoteStatus === "USER_DROPPED";

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <SEO title="Payment Status | IPNIA" description="Verifying your IPNIA payment." path="/booking/payment-status" />
      <BookingNav />
      <main className="mx-auto max-w-xl px-4 pb-20 pt-28 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-8 text-center">
          {loading && (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a853]">Please wait</p>
              <h1 className="mt-3 text-2xl font-bold">Verifying your payment...</h1>
              <p className="mt-2 text-white/55">Confirming status with our payment server.</p>
            </>
          )}

          {!loading && success && (
            <>
              <p className="text-4xl text-[#d4a853]">✓</p>
              <h1 className="mt-3 text-2xl font-bold">Payment Successful</h1>
              <p className="mt-2 text-white/60">Your payment has been received.</p>
              <div className="mt-6 space-y-2 text-left text-sm text-white/70">
                <p>
                  IPNIA Order ID: <span className="text-white">{orderId}</span>
                </p>
                <p>
                  Amount Paid:{" "}
                  <span className="text-[#d4a853]">
                    {formatInr(amountPaid ?? state.priceBreakdown.grandTotal)}
                  </span>
                </p>
                <p>
                  Payment Status: <span className="text-white">SUCCESS</span>
                </p>
              </div>
              <Button
                asChild
                className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
              >
                <Link to="/booking/confirmation">View Booking</Link>
              </Button>
            </>
          )}

          {!loading && failed && (
            <>
              <h1 className="text-2xl font-bold">Payment Failed</h1>
              <p className="mt-2 text-white/60">Your payment was not completed.</p>
              <Button
                asChild
                className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
              >
                <Link to="/booking/payment">Try Payment Again</Link>
              </Button>
            </>
          )}

          {!loading && !success && !failed && (
            <>
              <h1 className="text-2xl font-bold">Payment Verification Pending</h1>
              <p className="mt-2 text-white/60">
                Your payment is still being verified. Please wait a moment and refresh this page.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
              >
                Refresh Status
              </Button>
            </>
          )}

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default BookingPaymentStatusPage;
