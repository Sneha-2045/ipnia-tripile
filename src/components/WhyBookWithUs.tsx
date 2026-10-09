import { CreditCard, Headphones, Handshake, MonitorSmartphone } from "lucide-react";

const benefits = [
  {
    icon: CreditCard,
    title: "Secured Payment",
    text: "Book your air tickets with secure payment gateways, ensuring data safety.",
  },
  {
    icon: MonitorSmartphone,
    title: "Easy Booking",
    text: "We offer easy and convenient flight bookings with attractive offers.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "Get assistance 24/7 on any kind of travel related query. We are happy to assist you.",
  },
  {
    icon: Handshake,
    title: "Exciting Deals",
    text: "Enjoy exciting deals on flights, hotels, buses and tour packages.",
  },
];

export function WhyBookWithUs() {
  return (
    <section className="travel-bg-section reveal-on-scroll relative border-y border-[#e2b552]/15 py-20">
      <div className="travel-bg-media">
        <img
          src="/assets/destinations/hotel-luxury-1.jpg"
          alt=""
          aria-hidden
          className="ken-burns"
        />
      </div>
      <div className="travel-bg-overlay" />
      <div className="ipnia-section relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="ipnia-eyebrow">Why IPNIA</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-white md:text-5xl">
            Why Book with Us?
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="travel-hover group flex flex-col items-center rounded-2xl border border-white/15 bg-[#152b46]/85 px-5 py-8 text-center backdrop-blur-md"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e2b552]/30 bg-gradient-to-br from-[#e2b552]/20 to-transparent transition duration-300 group-hover:scale-105">
                <item.icon className="h-7 w-7 text-[#e2b552]" strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
