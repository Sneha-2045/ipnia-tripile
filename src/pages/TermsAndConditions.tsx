import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";

const TermsAndConditions = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-4 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <SEO
        title="Terms and Conditions"
        description="Read IPNIA terms and conditions covering user eligibility, platform usage, payments, intellectual property, and liabilities."
        path="/terms-and-conditions"
        keywords="IPNIA terms and conditions, user agreement, service terms"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
          <h1 className="text-4xl font-bold md:text-5xl">Terms and Conditions</h1>
          <p className="mt-2 text-slate-300">Last updated: April 29, 2026</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/20">
            <img
              src="/execute_projects.svg"
              alt="Policy and compliance illustration"
              className="h-48 w-full bg-white/5 p-4 transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "By using this website and enrolling in IPNIA services, you agree to these terms. If you do not agree, please discontinue use.",
            "Users are responsible for providing accurate registration details and maintaining account security.",
            "Program content, branding, and learning material are intellectual property of IPNIA and may not be copied or redistributed without written permission.",
            "Pricing, offerings, and schedules may change based on operational or academic requirements. Updated details will be communicated on official channels.",
            "IPNIA is not liable for indirect losses arising from service interruptions, third-party integrations, or events beyond reasonable control.",
            "For legal and policy questions, contact Help@ipnia.com.",
          ].map((item, idx) => (
            <Card key={item} className="border-white/20 bg-white/10 text-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/70 hover:shadow-xl hover:shadow-violet-500/20">
              <CardContent className="p-5">
                <p className="mb-2 text-sm font-semibold text-violet-300">Clause {idx + 1}</p>
                <p className="text-slate-200/90">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
