import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

type Guide = {
  path: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string;
  image: string;
  imageAlt: string;
  intro: string;
  lede: string;
  sections: { title: string; paragraphs: string[] }[];
  conclusion: string;
  closing: string;
};

function GuidePage({ guide }: { guide: Guide }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: guide.title,
    description: guide.description,
    image: `${SITE_ORIGIN}${guide.image}`,
    mainEntityOfPage: `${SITE_ORIGIN}${guide.path}`,
    author: { "@type": "Organization", name: "IPNIA" },
    publisher: {
      "@type": "Organization",
      name: "Ipnia Services Pvt Ltd",
      logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/ipnia-logo.png` },
    },
  };

  return (
    <PageShell>
      <SEO title={guide.metaTitle} description={guide.description} path={guide.path}
        keywords={guide.keywords} image={guide.image} jsonLd={jsonLd} />
      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img src={guide.image} alt={guide.imageAlt} className="h-64 w-full object-cover sm:h-80 lg:h-[26rem]" fetchPriority="high" />
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link to="/" className="hover:text-[#805d12]">Home</Link></li><li aria-hidden="true">/</li>
                <li><Link to="/blog" className="hover:text-[#805d12]">Blogs</Link></li><li aria-hidden="true">/</li>
                <li className="text-slate-700">{guide.title}</li>
              </ol>
            </nav>
            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">{guide.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">{guide.intro}</p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{guide.lede}</p>
            </header>
            <div className="divide-y divide-slate-100">
              {guide.sections.map((section, index) => (
                <section key={section.title} id={`section-${index + 1}`} className="py-7 first:pt-8">
                  <h2 className="text-2xl font-bold text-[#17324d]">{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 text-base leading-7 text-slate-700">{paragraph}</p>)}
                </section>
              ))}
            </div>
            <section className="mt-3 rounded-2xl bg-[#f4f7fa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#17324d]">Final Thoughts</h2>
              <p className="mt-3 leading-7 text-slate-700">{guide.conclusion}</p>
              <p className="mt-3 leading-7 text-slate-700">{guide.closing}</p>
              <Link to="/flights/search" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e4b64f] px-5 py-2.5 font-semibold text-[#10243c] transition-colors hover:bg-[#f0c96b]">Explore flights <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            </section>
          </div>
        </article>
      </section>
    </PageShell>
  );
}

const guides = {
  family: {
    path: "/blog/family-vacation-planning",
    title: "How to Plan a Family Vacation: Flights, Hotels, and Activities",
    metaTitle: "How to Plan a Family Vacation | IPNIA Travel Guide",
    description: "Plan a family vacation with practical advice on choosing a destination, comparing flights and hotels, building an itinerary, and keeping travel days manageable.",
    keywords: "family vacation planning, family travel tips, family flights and hotels, plan a family trip",
    image: "/assets/blog/family-vacation-hero.png",
    imageAlt: "A family enjoying a seaside holiday together",
    intro: "A family vacation can be rewarding when the trip fits everyone's needs, energy, and budget. Thoughtful planning helps you spend more time enjoying the destination and less time working through avoidable travel-day surprises.",
    lede: "Use these practical steps to plan flights, accommodation, activities, and a comfortable pace for your family trip.",
    sections: [
      { title: "1. Agree on the Kind of Trip", paragraphs: ["Start by talking about what each person hopes to do. A beach break, city visit, theme park holiday, and nature trip all call for different schedules and budgets.", "Choose a few shared priorities instead of trying to include every possible attraction. This gives the trip a clear focus and leaves room for breaks."] },
      { title: "2. Set a Realistic Family Budget", paragraphs: ["Estimate the full trip cost, including transport, accommodation, meals, tickets, local travel, baggage, and a reserve for unexpected expenses. Remember that children may have different ticket or meal costs depending on the provider.", "Decide which experiences matter most and where a simpler option is acceptable. A clear budget makes comparisons easier as plans take shape."] },
      { title: "3. Compare Flights for the Whole Family", paragraphs: ["Review departure times, total journey duration, layovers, baggage allowance, and seat policies alongside the fare. A convenient schedule can be especially valuable when traveling with young children or older relatives.", "Check that names and passenger details match travel documents before booking. Keep confirmations and essential information accessible to the adults traveling."] },
      { title: "4. Choose Convenient Accommodation", paragraphs: ["Look at location, room configuration, transport links, meal options, and cancellation terms. A property near the activities you plan to visit may save time and local transport costs.", "Read recent guest feedback and check which amenities are included. Confirm sleeping arrangements and any age-related policies directly in the booking details."] },
      { title: "5. Build a Flexible Itinerary", paragraphs: ["Plan one or two main activities for each day and group nearby attractions together. Include downtime for meals, naps, weather changes, and simply enjoying the destination.", "Reserve popular activities when required, but avoid filling every hour. A flexible plan helps the family adjust when energy levels or conditions change."] },
      { title: "6. Prepare for Travel Days", paragraphs: ["Pack snacks, refillable water bottles where permitted, essential medication, a change of clothes, and activities for the journey. Check airline baggage and security rules before leaving home.", "Confirm airport transport, check-in times, terminals, and connection details. Agree on a meeting point in busy public areas and keep important contact information available."] },
      { title: "7. Keep Everyone Involved", paragraphs: ["Give children age-appropriate choices, such as selecting a museum or choosing between two activities. Involving them can build excitement and make the itinerary feel shared.", "Use simple expectations for group meetups, spending, and screen time. Leave room for individual needs while keeping the main plan easy to follow."] },
    ],
    conclusion: "A successful family holiday balances the things you want to see with time to rest and enjoy one another's company. Choose a trip that suits your family's pace, compare the total costs, and prepare for the practical details in advance.",
    closing: "Compare flight and hotel options on IPNIA as you organize the dates and destination for your next family getaway.",
  },
  solo: {
    path: "/blog/solo-travel-tips",
    title: "Solo Travel Tips: How to Plan a Memorable Trip on Your Own",
    metaTitle: "Solo Travel Tips: Plan a Trip on Your Own | IPNIA",
    description: "Plan a solo trip with practical tips for choosing a destination, booking flights and accommodation, organizing your itinerary, and staying prepared while traveling alone.",
    keywords: "solo travel tips, traveling alone, solo trip planning, solo travel itinerary",
    image: "/assets/blog/solo-travel-hero.png",
    imageAlt: "A solo traveler taking in the view over a historic European city",
    intro: "Traveling on your own gives you the freedom to shape each day around your interests. A little preparation can make it easier to navigate unfamiliar places, manage logistics, and feel confident as you explore.",
    lede: "These solo travel tips cover the decisions to make before departure and the habits that can help keep a trip organized.",
    sections: [
      { title: "1. Pick a Destination That Fits Your Experience", paragraphs: ["Think about language, transport, travel time, climate, and the kinds of activities you enjoy. For a first solo trip, a destination with clear transport options and accommodation choices that suit your budget may feel easier to navigate.", "Research neighborhoods and local customs using current, reliable sources. Consider starting with a shorter trip if you want to learn what travel style works best for you."] },
      { title: "2. Share a Budget and Trip Outline", paragraphs: ["Estimate transportation, lodging, meals, activities, local transit, and a buffer for changes. Keep backup funds and payment methods separate from your everyday wallet where practical.", "Share your broad itinerary and accommodation details with someone you trust. Let them know how you plan to check in and when they should expect to hear from you."] },
      { title: "3. Book Flights with the Full Journey in Mind", paragraphs: ["Compare total travel time, connection length, arrival hour, baggage, and change terms as well as the ticket price. Arriving during daytime may make it simpler to reach your accommodation in a new place.", "Allow enough time for connections and account for immigration or terminal changes where relevant. Save confirmation details offline in case mobile access is limited."] },
      { title: "4. Select Accommodation Carefully", paragraphs: ["Compare location, recent reviews, check-in hours, transit access, and cancellation conditions. Read the property's arrival instructions and contact details before you travel.", "Consider what level of social interaction and privacy you want. Hotels, hostels, and guesthouses offer different settings, so choose based on your comfort and plans."] },
      { title: "5. Plan, Then Leave Room to Explore", paragraphs: ["Make a short list of must-see places and note how to reach them. Download maps and save important addresses, opening hours, and local emergency contact information.", "Avoid overbooking each day. Flexible time lets you follow a local recommendation, rest, or change plans if weather or transport affects your schedule."] },
      { title: "6. Stay Connected and Aware", paragraphs: ["Research mobile connectivity and keep your phone charged. Share your route when taking longer excursions and let someone know if your plans change significantly.", "Pay attention to your surroundings and follow local guidance. If a situation or transport option feels unclear, pause and consult official information or staff at a reputable service point."] },
      { title: "7. Make Space for the Experience", paragraphs: ["Solo travel does not mean every moment needs to be planned. A café visit, a museum afternoon, or a guided group activity can provide a comfortable rhythm for your days.", "Keep notes or photos of favorite moments and review your spending occasionally. Small check-ins help you adjust the trip while it is still underway."] },
    ],
    conclusion: "A rewarding solo trip starts with choices that match your comfort, interests, and budget. Prepare the essentials, share your plans with someone you trust, and give yourself the flexibility to enjoy the journey at your own pace.",
    closing: "Use IPNIA to compare flight options as you plan your next independent adventure.",
  },
  weekend: {
    path: "/blog/weekend-getaways-usa",
    title: "Weekend Getaways in the USA: 10 Trip Ideas and Planning Tips",
    metaTitle: "10 Weekend Getaways in the USA | IPNIA Travel Guide",
    description: "Find inspiration for a US weekend getaway, from coastal escapes and mountain towns to city breaks, plus practical tips for making a short trip count.",
    keywords: "weekend getaways USA, US weekend trips, short vacation ideas, weekend city breaks",
    image: "/assets/blog/weekend-getaways-hero.png",
    imageAlt: "A scenic American road trip at a mountain overlook",
    intro: "A short getaway can offer a welcome change of scenery without requiring a long vacation. The best weekend trips keep travel time manageable and focus on a few experiences rather than a packed itinerary.",
    lede: "These destination ideas span different travel styles. Check seasonal conditions and local availability before choosing dates.",
    sections: [
      { title: "1. New York City, New York", paragraphs: ["Choose a neighborhood base and spend the weekend exploring museums, parks, restaurants, and theater. Group nearby plans together to reduce time crossing the city.", "Reserve timed attractions when needed and leave space for spontaneous discoveries between them."] },
      { title: "2. Washington, D.C.", paragraphs: ["A weekend can combine monuments, museums, and historic neighborhoods. Many major sights are close to public transport, though distances between attractions can still add up.", "Check museum hours and reservation requirements before you travel, especially on busy weekends."] },
      { title: "3. San Diego, California", paragraphs: ["Enjoy the waterfront, coastal neighborhoods, parks, and local food. Choose activities around the area where you stay to make a short visit feel less rushed.", "Check local conditions and event calendars when selecting your dates."] },
      { title: "4. New Orleans, Louisiana", paragraphs: ["Explore distinctive architecture, music, food, and cultural attractions. A guided walk or neighborhood-focused itinerary can help you get oriented.", "Local festivals and major events can affect lodging availability, so compare dates before booking."] },
      { title: "5. Asheville, North Carolina", paragraphs: ["Use Asheville as a base for restaurants, arts, and nearby mountain scenery. A car can add flexibility for regional stops, while a city-focused weekend may need less driving.", "Check weather and access conditions before planning outdoor activities."] },
      { title: "6. Seattle, Washington", paragraphs: ["Spend time at markets, waterfront areas, museums, and neighborhood cafés. If you want to explore beyond the city, plan transport and driving time in advance.", "Rain and seasonal daylight can shape outdoor plans, so keep an indoor alternative in mind."] },
      { title: "7. Charleston, South Carolina", paragraphs: ["Historic streets, gardens, and coastal excursions make Charleston a relaxed option for a short break. Build in time to explore on foot and enjoy local dining.", "Compare accommodation locations and parking arrangements before choosing a property."] },
      { title: "8. Las Vegas, Nevada", paragraphs: ["Las Vegas offers entertainment, dining, and resort stays, with desert scenery within reach for a longer weekend. Decide whether your plans are city-centered or include a day trip.", "Factor in transportation between attractions and check the full cost of shows or activities before confirming plans."] },
      { title: "9. Boston, Massachusetts", paragraphs: ["Walkable historic districts, museums, parks, and food destinations make Boston well suited to a focused city weekend. Public transport can connect many visitor areas.", "Check opening times and seasonal events, and allow extra time for airport transfers."] },
      { title: "10. A Nearby National Park or Lake Town", paragraphs: ["A nature-focused escape can be memorable without crossing the country. Look for parks, lakes, or small towns within reasonable driving or rail distance from home.", "Review current access notices, weather, trail conditions, and accommodation availability through official local sources."] },
      { title: "Make a Short Trip Feel Relaxed", paragraphs: ["Choose no more than a few headline activities each day and consider the door-to-door travel time. An early flight or late return may reduce lodging needs but can also make the weekend tiring.", "Compare the full trip cost, including baggage, transfers, parking, meals, and tickets. A nearby destination can offer more time to enjoy the break."] },
    ],
    conclusion: "The right weekend escape depends on your starting point, travel style, and available time. Pick a destination that leaves enough hours for the experience itself, then make reservations around your priorities.",
    closing: "Compare flights and accommodation on IPNIA to start planning a short break that fits your schedule.",
  },
  packing: {
    path: "/blog/travel-packing-checklist",
    title: "Travel Packing Checklist: What to Pack for Your Next Trip",
    metaTitle: "Travel Packing Checklist: What to Pack | IPNIA",
    description: "Use this practical travel packing checklist to organize documents, clothing, toiletries, medication, electronics, and carry-on essentials for your next trip.",
    keywords: "travel packing checklist, what to pack for a trip, vacation packing list, carry-on essentials",
    image: "/assets/blog/packing-checklist-hero.png",
    imageAlt: "A suitcase organized with folded clothes and travel essentials",
    intro: "Packing for a trip is easier when you start with the itinerary, destination weather, and baggage rules. A focused checklist helps you bring what you need without filling every available pocket.",
    lede: "Use this guide as a starting point, then adjust it for your activities, trip length, and airline requirements.",
    sections: [
      { title: "1. Gather Travel Documents", paragraphs: ["Check that your identification, passport, visas or travel authorizations where applicable, tickets, and accommodation details are in order. Requirements depend on your route and personal circumstances, so verify them through official sources.", "Keep digital copies securely accessible and store essential contact details offline. Carry original documents according to the requirements for your journey."] },
      { title: "2. Plan Clothing Around the Itinerary", paragraphs: ["Check the forecast close to departure and pack versatile layers suited to the expected conditions. Consider the activities on your schedule, dress requirements, and whether you will have access to laundry.", "Choose comfortable footwear that is already broken in. Packing a small number of coordinating items can make outfits easier to combine."] },
      { title: "3. Pack Toiletries and Personal Care", paragraphs: ["Bring the personal-care items you rely on, using travel-size containers where appropriate. Review current airline rules for liquids and prohibited items before placing products in your carry-on.", "Pack toiletries in a leak-resistant pouch and keep any must-have items easy to reach during the journey."] },
      { title: "4. Bring Medication and Health Essentials", paragraphs: ["Pack medication you normally use in its original packaging when possible, along with prescriptions or supporting documents you may need. Check destination rules for restricted medicines before travel.", "Consider basic personal health items relevant to your destination and activities. Consult a qualified healthcare professional for individual travel-health advice."] },
      { title: "5. Organize Electronics and Chargers", paragraphs: ["Make a short list of devices, chargers, headphones, and adapters you will use. Confirm that your electronics are compatible with destination outlets and that power banks meet airline rules.", "Keep frequently used devices accessible and protect them from spills or impact. Download maps, tickets, and entertainment in advance if connectivity may be limited."] },
      { title: "6. Prepare Your Carry-On", paragraphs: ["Keep documents, valuables, essential medication, a charger, and a change of clothes in your personal item or carry-on as appropriate. Pack anything you may need during a delay where it is easy to reach.", "Baggage allowances and size limits vary by airline and fare. Check your booking details rather than assuming the same rules apply to every flight."] },
      { title: "7. Leave Room for the Return", paragraphs: ["Avoid packing to the absolute limit if you expect to bring items home. Check baggage weight limits and fees before departure, and use a small laundry bag to separate worn clothes.", "Before leaving, do a final check of documents, medication, chargers, and any items specific to the trip. A concise list can help avoid last-minute repacking."] },
    ],
    conclusion: "A useful packing list is personal and practical. Start with the essentials, check current airline and destination requirements, and pack for the actual activities you have planned.",
    closing: "Once your checklist is ready, compare available flights and hotels on IPNIA and keep your confirmations together with your travel documents.",
  },
  airport: {
    path: "/blog/airport-travel-tips",
    title: "Airport Tips for a Smoother Trip: Check-In, Security, and Connections",
    metaTitle: "Airport Travel Tips for a Smoother Trip | IPNIA",
    description: "Prepare for airport travel with practical tips for check-in, baggage, security screening, connections, delays, and finding your way through the terminal.",
    keywords: "airport travel tips, airport check-in guide, flight connection tips, prepare for airport security",
    image: "/assets/blog/airport-tips-hero.png",
    imageAlt: "A traveler checking flight information in a bright airport terminal",
    intro: "Airports can feel busy, particularly when you are unfamiliar with the terminal or managing a connection. Checking the details ahead of time and keeping essentials accessible can make the journey easier to navigate.",
    lede: "Airline and airport procedures vary, so use your booking information and official airport guidance as the source for current requirements.",
    sections: [
      { title: "1. Review Your Flight Details Before Departure", paragraphs: ["Confirm the date, departure airport, terminal if listed, check-in deadline, and baggage allowance. Recheck your airline's flight status before leaving, since schedules and gates can change.", "Save your booking reference and airline contact details. Make sure the passenger name and travel documents align with the reservation requirements."] },
      { title: "2. Plan How You Will Reach the Airport", paragraphs: ["Compare available transport options, journey time, cost, and likely traffic. If someone is dropping you off, agree on the terminal and a practical meeting point.", "Allow a buffer for delays on the way to the airport. The airline's check-in and boarding deadlines are the key times to follow for your specific flight."] },
      { title: "3. Check In and Prepare Your Bags", paragraphs: ["Use online check-in when available and follow the airline's instructions for boarding passes and document checks. Some routes or travelers may still need to visit the counter.", "Weigh and measure baggage according to your fare's rules. Keep items you need during the flight accessible, and follow the airline's guidance for restricted or special baggage."] },
      { title: "4. Make Security Screening Easier", paragraphs: ["Review the airport's current screening guidance before packing. Keep documents handy and arrange carry-on items so you can follow staff instructions without searching through your bag.", "Rules for liquids, electronics, and permitted items can vary by location and route. Check official airport or government guidance for the airports you will use."] },
      { title: "5. Find Your Gate and Monitor Updates", paragraphs: ["After security, check airport displays and airline notifications for your gate and boarding time. Gates can change, so look again while waiting.", "Use the airport map to estimate walking time, especially in large terminals. Be near the gate by the airline's stated boarding time rather than relying on the departure time alone."] },
      { title: "6. Allow Practical Time for Connections", paragraphs: ["Check whether your itinerary uses one ticket, whether baggage is checked through, and whether you must change terminals or complete immigration and security. Connection requirements differ by airport and itinerary.", "For separate tickets, missed connections may be handled differently. Understand the ticket conditions and leave enough time for the steps required at each airport."] },
      { title: "7. Handle Delays with a Plan", paragraphs: ["Keep your phone charged and save airline support channels and booking details. If a disruption occurs, check official airline updates and ask staff about the available options for your reservation.", "Keep essential medication and basic necessities in your carry-on where permitted. If your plans change, update anyone meeting you at the destination."] },
      { title: "8. Make Arrival Simpler", paragraphs: ["Before landing, confirm how you will get from the airport to your accommodation and where the pickup point is located. Save the address and directions offline.", "For international journeys, review current entry and transit requirements through official sources before travel. Keep required documents available for inspection."] },
    ],
    conclusion: "A smoother airport experience comes from knowing the current requirements for your itinerary, preparing documents and bags, and leaving time for each step. Keep monitoring official updates throughout the journey.",
    closing: "Plan your next itinerary with IPNIA and review the airline and airport instructions for each part of your trip before departure.",
  },
} satisfies Record<string, Guide>;

export function FamilyVacationPlanning() { return <GuidePage guide={guides.family} />; }
export function SoloTravelTips() { return <GuidePage guide={guides.solo} />; }
export function WeekendGetawaysUSA() { return <GuidePage guide={guides.weekend} />; }
export function TravelPackingChecklist() { return <GuidePage guide={guides.packing} />; }
export function AirportTravelTips() { return <GuidePage guide={guides.airport} />; }
