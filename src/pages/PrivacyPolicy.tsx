import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-4 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <SEO
        title="Privacy Policy"
        description="Read IPNIA's privacy policy to understand how we collect, use, store, and protect your personal data and communication preferences."
        path="/privacy-policy"
        keywords="privacy policy IPNIA, personal data protection, user information policy"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
          <h1 className="text-4xl font-bold md:text-5xl">Privacy Policy</h1>
          <p className="mt-2 text-slate-300">Last updated: April 29, 2026</p>
          <p className="mt-3 text-slate-200/90">
            IPNIA collects only the information required to deliver services, process enrollments,
            support users, and improve platform quality. By using our website, you consent to this
            policy.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/20">
            <img
              src="/showcase_scale.svg"
              alt="Secure and scalable platform illustration"
              className="h-52 w-full bg-white/5 p-6 transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Information We Collect",
              text: "Name, email, phone, account details, payment details processed securely by payment providers, and usage data.",
            },
            {
              title: "How We Use Data",
              text: "Onboarding, course delivery, customer support, service updates, and legal compliance.",
            },
            {
              title: "Data Sharing",
              text: "We do not sell personal data. Data may be shared with trusted service providers for hosting, analytics, and payment processing.",
            },
            {
              title: "Data Security",
              text: "We use reasonable safeguards to protect your information; no online method is fully risk-free.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-white/20 bg-white/10 text-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/70 hover:shadow-xl hover:shadow-cyan-500/20">
              <CardContent className="p-5">
                <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
                <p className="text-slate-200/90">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-white/20 bg-white/10 text-slate-100">
          <CardContent className="p-5 text-slate-200/90">
            <strong className="text-white">Contact:</strong> for privacy requests, email
            Help@ipnia.com.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
