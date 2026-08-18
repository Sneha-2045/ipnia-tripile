import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FlightBookingProvider } from "@/contexts/FlightBookingContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatWidget from "@/components/ChatWidget";
import Index from "./pages/Index";
import TravelEcosystem from "./pages/TravelEcosystem";
import FlightSearch from "./pages/FlightSearch";
import HotelSearch from "./pages/HotelSearch";
import TravellerDetailsPage from "./pages/booking/TravellerDetailsPage";
import TravelDocumentsPage from "./pages/booking/TravelDocumentsPage";
import BookingHotelPage from "./pages/booking/BookingHotelPage";
import BookingReviewPage from "./pages/booking/BookingReviewPage";
import BookingPaymentPage from "./pages/booking/BookingPaymentPage";
import BookingPaymentStatusPage from "./pages/booking/BookingPaymentStatusPage";
import BookingConfirmationPage from "./pages/booking/BookingConfirmationPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PaymentPage from "./pages/PaymentPage";
import ThankYou from "./pages/ThankYou";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import BusinessTravel from "./pages/BusinessTravel";
import EducationTravel from "./pages/EducationTravel";
import ExperienceTravel from "./pages/ExperienceTravel";
import PilgrimTravel from "./pages/PilgrimTravel";
import ForexTravel from "./pages/ForexTravel";
import HtmlSitemapPage from "./pages/seo/HtmlSitemapPage";
import { DestinationDetailPage, DestinationsIndexPage } from "./pages/seo/DestinationPages";
import {
  AirlineDetailPage,
  AirlinesIndexPage,
  FlightDestinationsIndexPage,
  FlightRoutePage,
  FlightToDestinationPage,
} from "./pages/seo/FlightSeoPages";
import {
  FlightCountriesIndexPage,
  FlightCountryPage,
  HotelCountriesIndexPage,
  HotelCountryPage,
  HotelDestinationPage,
  HotelDestinationsIndexPage,
} from "./pages/seo/HotelCountryPages";
import { DealDetailPage, DealsIndexPage } from "./pages/seo/DealPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <FlightBookingProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/travel-ecosystem" element={<TravelEcosystem />} />
              <Route path="/sitemap" element={<HtmlSitemapPage />} />

              {/* Flights SEO */}
              <Route path="/flights" element={<Index />} />
              <Route path="/flights/search" element={<FlightSearch />} />
              <Route path="/flights/destinations" element={<FlightDestinationsIndexPage />} />
              <Route path="/flights/to/:slug" element={<FlightToDestinationPage />} />
              <Route path="/flights/from/:fromSlug/to/:toSlug" element={<FlightRoutePage />} />
              <Route path="/flights/airlines" element={<AirlinesIndexPage />} />
              <Route path="/flights/airlines/:slug" element={<AirlineDetailPage />} />
              <Route path="/flights/countries" element={<FlightCountriesIndexPage />} />
              <Route path="/flights/countries/:slug" element={<FlightCountryPage />} />

              {/* Hotels SEO — static segments before :slug */}
              <Route path="/hotels" element={<HotelSearch />} />
              <Route path="/hotels/search" element={<HotelSearch />} />
              <Route path="/hotels/destinations" element={<HotelDestinationsIndexPage />} />
              <Route path="/hotels/countries" element={<HotelCountriesIndexPage />} />
              <Route path="/hotels/countries/:slug" element={<HotelCountryPage />} />
              <Route path="/hotels/:slug" element={<HotelDestinationPage />} />

              {/* Destinations + deals */}
              <Route path="/destinations" element={<DestinationsIndexPage />} />
              <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
              <Route path="/deals" element={<DealsIndexPage />} />
              <Route path="/deals/:slug" element={<DealDetailPage />} />

              {/* Booking (noindex via exclusion from sitemap) */}
              <Route path="/booking/traveller-details" element={<TravellerDetailsPage />} />
              <Route path="/booking/travel-documents" element={<TravelDocumentsPage />} />
              <Route path="/booking/hotel" element={<BookingHotelPage />} />
              <Route path="/booking/review" element={<BookingReviewPage />} />
              <Route path="/booking/payment" element={<BookingPaymentPage />} />
              <Route path="/booking/payment-status" element={<BookingPaymentStatusPage />} />
              <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />

              <Route path="/business-travel" element={<BusinessTravel />} />
              <Route path="/education-travel" element={<EducationTravel />} />
              <Route path="/experience-travel" element={<ExperienceTravel />} />
              <Route path="/pilgrim-travel" element={<PilgrimTravel />} />
              <Route path="/forex" element={<ForexTravel />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/payment/:course" element={<PaymentPage />} />
              <Route path="/thankyou/:course" element={<ThankYou />} />
              <Route path="/thankyou" element={<ThankYou />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatWidget />
          </FlightBookingProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
