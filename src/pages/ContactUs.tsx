import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";

const ContactUs = () => {
  return (
    <PageShell>
      <SEO
        title="Contact IPNIA"
        description="Contact IPNIA to plan business travel, education journeys, experiences, pilgrimages or forex assistance. Reach us by email, phone, or at our Delhi office."
        path="/contact"
        keywords="contact IPNIA, plan journey, China business tour inquiry, pilgrimage booking"
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#e2b552]">Contact</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">Plan your journey</h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Tell us which vertical you need — business, education, experience, pilgrimage or forex —
          and our team will guide the next step.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-[#e2b552] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
            <a href="mailto:Help@ipnia.com">Email Help@ipnia.com</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#e2b552]/50 bg-transparent text-white hover:bg-[#e2b552]/10 hover:text-white"
          >
            <a href="tel:01145534440">Call 01145534440</a>
          </Button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card className="border-[#e2b552]/25 bg-[#0c1a2e] text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-[#e2b552]" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/75">Help@ipnia.com</CardContent>
          </Card>
          <Card className="border-[#e2b552]/25 bg-[#0c1a2e] text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-[#e2b552]" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/75">01145534440</CardContent>
          </Card>
          <Card className="border-[#e2b552]/25 bg-[#0c1a2e] text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-[#e2b552]" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/75">
              A199 Gujranwala Town Part 01 Delhi 110009
            </CardContent>
          </Card>
          <Card className="border-[#e2b552]/25 bg-[#0c1a2e] text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock3 className="mr-2 h-5 w-5 text-[#e2b552]" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/75">
              Monday to Saturday, 9:00 AM to 7:00 PM IST
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  );
};

export default ContactUs;
