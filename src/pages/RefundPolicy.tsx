import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";

const RefundPolicy = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-rose-950 to-slate-900 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-4 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      <SEO
        title="Refund Policy"
        description="Review IPNIA's refund policy, including eligibility windows, non-refundable scenarios, processing timelines, and support channels."
        path="/refund-policy"
        keywords="refund policy IPNIA, course cancellation, payment refund"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
          <h1 className="text-4xl font-bold md:text-5xl">Refund Policy</h1>
          <p className="mt-2 text-slate-300">Last updated: April 29, 2026</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/20">
            <img
              src="/learn_by_doing.svg"
              alt="Customer-friendly process illustration"
              className="h-48 w-full bg-white/5 p-4 transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Refund requests must be raised within 7 days of payment, provided course access has not been substantially consumed.",
            "No refund is applicable once core learning material has been completed or after internship or mentorship execution has started.",
            "Approved refunds are processed to the original payment method within 7-10 business days, subject to banking timelines.",
            "Special program costs such as travel, visa, accommodation, or third-party bookings may be non-refundable after confirmation.",
          ].map((item, idx) => (
            <Card key={item} className="border-white/20 bg-white/10 text-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-rose-300/70 hover:shadow-xl hover:shadow-rose-500/20">
              <CardContent className="p-5">
                <p className="mb-2 text-sm font-semibold text-rose-300">Policy {idx + 1}</p>
                <p className="text-slate-200/90">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-white/20 bg-white/10 text-slate-100">
          <CardContent className="p-5 text-slate-200/90">
            To request a refund, email Help@ipnia.com with payment reference and registered contact details.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefundPolicy;
