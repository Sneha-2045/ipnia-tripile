import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, DollarSign, Sparkles, TrendingUp } from "lucide-react";

const Pricing = () => {
  return (
    <PageShell>
      <SEO
        title="Pricing"
        description="View IPNIA pricing for education programs, including online, India immersion, and global exposure tracks with program inclusions and support."
        path="/pricing"
        keywords="IPNIA pricing, education travel fees, AI training plans India"
      />
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-3 inline-flex items-center rounded-full border border-fuchsia-300/60 bg-fuchsia-400/20 px-4 py-1 text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Transparent pricing
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">Pricing of Services Offered</h1>
          <p className="mt-3 text-slate-200/90">
            Final fee, taxes, and payment timelines are shown during checkout.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/20 bg-black/20 p-4">
              <p className="text-sm text-slate-300">Most chosen</p>
              <p className="text-2xl font-semibold text-cyan-300">Online Immersion</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-black/20 p-4">
              <p className="flex items-center text-sm text-slate-300">
                <TrendingUp className="mr-1 h-4 w-4 text-emerald-300" />
                Career acceleration track
              </p>
              <p className="text-2xl font-semibold text-emerald-300">Global Exposure</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card className="group border-cyan-300/40 bg-white/10 text-slate-100 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Online Immersion Program</span>
                <DollarSign className="h-5 w-5 text-cyan-300" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-200/90">
              <p className="text-3xl font-semibold text-white">$99</p>
              <p>Duration: 2 months</p>
              <p className="flex items-start"><CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 text-cyan-300" />Includes online internship and lifetime course access.</p>
            </CardContent>
          </Card>
          <Card className="group border-indigo-300/40 bg-white/10 text-slate-100 transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>India Immersion Program</span>
                <DollarSign className="h-5 w-5 text-indigo-300" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-200/90">
              <p className="text-3xl font-semibold text-white">$999</p>
              <p>Duration: 3 months</p>
              <p className="flex items-start"><CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 text-indigo-300" />Includes domain training, on-site internship, and mentorship.</p>
            </CardContent>
          </Card>
          <Card className="group border-emerald-300/40 bg-white/10 text-slate-100 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Global Industry Exposure</span>
                <DollarSign className="h-5 w-5 text-emerald-300" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-200/90">
              <p className="text-3xl font-semibold text-white">$9999</p>
              <p>Duration: Advanced program track</p>
              <p className="flex items-start"><CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 text-emerald-300" />Includes global exposure components and international support.</p>
            </CardContent>
          </Card>
        </div>
        <Card className="border-white/20 bg-white/10 text-slate-100">
          <CardContent className="p-6 text-slate-200/90">
            Scholarships and installment options may be available for selected programs based on eligibility.
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
};

export default Pricing;
