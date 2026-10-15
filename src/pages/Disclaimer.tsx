import { LegalPage, Paragraphs } from "@/components/legal/LegalPage";

const Disclaimer = () => <LegalPage title="Website Disclaimer" path="/disclaimer" description="Important information about Ipnia travel search results, prices, availability, and bookings." sections={[
  { title: "Travel information and search results", content: <Paragraphs children={["Ipnia provides travel information, search results, comparisons, and booking functionality where available. Flight offers and other information may be supplied by third parties and can change. Hotel search results are sourced from Google Places; search listings do not confirm availability or a reservation.","A displayed option does not guarantee availability or a confirmed booking. Review the final price, itinerary, supplier conditions, payment status, and booking confirmation before relying on a reservation. In the current hotel-only flow, a deposit is collected for confirmation and Ipnia confirms the final stay amount and availability after payment. A hotel selected with a flight is arranged after flight payment confirmation.","General travel information is provided for convenience and should not replace confirmation from airlines, hotels, official authorities, or other providers. Nothing in this disclaimer removes any rights or responsibilities that cannot lawfully be excluded."]} /> },
]} />;

export default Disclaimer;
