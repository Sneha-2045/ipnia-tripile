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
    <section className="border-y border-[#d4a853]/20 bg-[#07111f] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Why Book with Us?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {benefits.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col items-center px-5 text-center sm:px-6 ${
                index < benefits.length - 1 ? "lg:border-r lg:border-[#d4a853]/25" : ""
              }`}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d4a853]/35 bg-[#0c1a2e]">
                <item.icon className="h-8 w-8 text-[#d4a853]" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
