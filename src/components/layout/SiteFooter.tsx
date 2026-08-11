import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Separator } from "@/components/ui/separator";

const segments = [
  { label: "Business Travel", href: "/business-travel" },
  { label: "Education Travel", href: "/education-travel" },
  { label: "Experience Travel", href: "/experience-travel" },
  { label: "Pilgrim Travel", href: "/pilgrim-travel" },
  { label: "Forex", href: "/forex" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07111f]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <BrandLogo size={32} />
              <div>
                <p className="text-lg font-bold text-white">IPNIA</p>
                <p className="text-xs uppercase tracking-widest text-[#d4a853]/80">
                  Every Journey
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              A complete travel ecosystem for business, education, experiences, pilgrimage and
              forex — built for Indian travelers and enterprises.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#d4a853]">
              Travel Verticals
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {segments.map((s) => (
                <li key={s.href}>
                  <Link to={s.href} className="transition-colors hover:text-[#d4a853]">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#d4a853]">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/about" className="hover:text-[#d4a853]">
                  About IPNIA
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d4a853]">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#d4a853]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#d4a853]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-[#d4a853]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#d4a853]">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#d4a853]">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Email: Help@ipnia.com</li>
              <li>Phone: 01145534440</li>
              <li>A199 Gujranwala Town Part 01, Delhi 110009</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} IPNIA. All rights reserved.</p>
          <p className="mt-1">Ipnia Services Pvt Ltd</p>
        </div>
      </div>
    </footer>
  );
}
