import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BOOKING_STORAGE_KEY,
  computePriceBreakdown,
  emptyTraveller,
  type FlightBookingState,
  type SelectedFlight,
  type SelectedHotelBooking,
  type Traveller,
} from "@/types/booking";
import { isInternationalIndiaRoute } from "@/lib/mapOfferToBooking";

type FlightBookingContextValue = {
  state: FlightBookingState;
  setSelectedFlight: (flight: SelectedFlight) => void;
  setTravellers: (travellers: Traveller[]) => void;
  updateTraveller: (index: number, patch: Partial<Traveller>) => void;
  setHotel: (hotel: SelectedHotelBooking) => void;
  skipHotel: () => void;
  setReviewConsent: (value: boolean) => void;
  setPaymentInfo: (info: {
    cashfreeOrderId: string;
    paymentSessionId: string;
    paymentStatus?: FlightBookingState["paymentStatus"];
  }) => void;
  setPaymentStatus: (status: FlightBookingState["paymentStatus"]) => void;
  setBookingReference: (ref: string) => void;
  resetBooking: () => void;
  isInternational: boolean;
  grandTotal: number;
};

const initialState: FlightBookingState = {
  selectedFlight: null,
  travellers: [],
  hotelSkipped: false,
  hotel: null,
  reviewConsent: false,
  priceBreakdown: computePriceBreakdown(null, null),
  cashfreeOrderId: null,
  paymentSessionId: null,
  paymentStatus: "IDLE",
  bookingReference: null,
};

const FlightBookingContext = createContext<FlightBookingContextValue | null>(null);

function loadState(): FlightBookingState {
  try {
    const raw = sessionStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as FlightBookingState;
    return {
      ...initialState,
      ...parsed,
      priceBreakdown: computePriceBreakdown(parsed.selectedFlight, parsed.hotel),
    };
  } catch {
    return initialState;
  }
}

export function FlightBookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlightBookingState>(() =>
    typeof window === "undefined" ? initialState : loadState()
  );

  useEffect(() => {
    sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setSelectedFlight = useCallback((flight: SelectedFlight) => {
    const travellers = Array.from({ length: flight.travellerCount }, (_, i) => emptyTraveller(i));
    setState({
      ...initialState,
      selectedFlight: flight,
      travellers,
      priceBreakdown: computePriceBreakdown(flight, null),
    });
  }, []);

  const setTravellers = useCallback((travellers: Traveller[]) => {
    setState((prev) => ({ ...prev, travellers }));
  }, []);

  const updateTraveller = useCallback((index: number, patch: Partial<Traveller>) => {
    setState((prev) => {
      const travellers = prev.travellers.map((t, i) => {
        if (i !== index) return t;
        return {
          ...t,
          ...patch,
          document: {
            ...t.document,
            ...(patch.document || {}),
          },
        };
      });
      return { ...prev, travellers };
    });
  }, []);

  const setHotel = useCallback((hotel: SelectedHotelBooking) => {
    setState((prev) => ({
      ...prev,
      hotel,
      hotelSkipped: hotel === null ? prev.hotelSkipped : false,
      priceBreakdown: computePriceBreakdown(prev.selectedFlight, hotel),
    }));
  }, []);

  const skipHotel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hotel: null,
      hotelSkipped: true,
      priceBreakdown: computePriceBreakdown(prev.selectedFlight, null),
    }));
  }, []);

  const setReviewConsent = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, reviewConsent: value }));
  }, []);

  const setPaymentInfo = useCallback(
    (info: {
      cashfreeOrderId: string;
      paymentSessionId: string;
      paymentStatus?: FlightBookingState["paymentStatus"];
    }) => {
      setState((prev) => ({
        ...prev,
        cashfreeOrderId: info.cashfreeOrderId,
        paymentSessionId: info.paymentSessionId,
        paymentStatus: info.paymentStatus || "PENDING",
      }));
    },
    []
  );

  const setPaymentStatus = useCallback((status: FlightBookingState["paymentStatus"]) => {
    setState((prev) => ({ ...prev, paymentStatus: status }));
  }, []);

  const setBookingReference = useCallback((ref: string) => {
    setState((prev) => ({ ...prev, bookingReference: ref }));
  }, []);

  const resetBooking = useCallback(() => {
    setState(initialState);
    sessionStorage.removeItem(BOOKING_STORAGE_KEY);
  }, []);

  const value = useMemo<FlightBookingContextValue>(
    () => ({
      state,
      setSelectedFlight,
      setTravellers,
      updateTraveller,
      setHotel,
      skipHotel,
      setReviewConsent,
      setPaymentInfo,
      setPaymentStatus,
      setBookingReference,
      resetBooking,
      isInternational: state.selectedFlight
        ? isInternationalIndiaRoute(
            state.selectedFlight.originCountry,
            state.selectedFlight.destinationCountry
          )
        : false,
      grandTotal: state.priceBreakdown.grandTotal,
    }),
    [
      state,
      setSelectedFlight,
      setTravellers,
      updateTraveller,
      setHotel,
      skipHotel,
      setReviewConsent,
      setPaymentInfo,
      setPaymentStatus,
      setBookingReference,
      resetBooking,
    ]
  );

  return (
    <FlightBookingContext.Provider value={value}>{children}</FlightBookingContext.Provider>
  );
}

export function useFlightBooking() {
  const ctx = useContext(FlightBookingContext);
  if (!ctx) {
    throw new Error("useFlightBooking must be used within FlightBookingProvider");
  }
  return ctx;
}
