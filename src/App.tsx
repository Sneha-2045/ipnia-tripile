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
              <Route path="/flights" element={<Index />} />
              <Route path="/flights/search" element={<FlightSearch />} />
              <Route path="/booking/traveller-details" element={<TravellerDetailsPage />} />
              <Route path="/booking/travel-documents" element={<TravelDocumentsPage />} />
              <Route path="/booking/hotel" element={<BookingHotelPage />} />
              <Route path="/booking/review" element={<BookingReviewPage />} />
              <Route path="/booking/payment" element={<BookingPaymentPage />} />
              <Route path="/booking/payment-status" element={<BookingPaymentStatusPage />} />
              <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
              <Route path="/hotels" element={<HotelSearch />} />
              <Route path="/hotels/search" element={<HotelSearch />} />
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
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
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
