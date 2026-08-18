import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Separator } from "@/components/ui/separator";

const segments = [
  { label: "Book Flights", href: "/flights/search" },
  { label: "Flight Destinations", href: "/flights/destinations" },
  { label: "Airlines", href: "/flights/airlines" },
  { label: "Book Hotels", href: "/hotels/search" },
  { label: "Hotel Destinations", href: "/hotels/destinations" },
  { label: "Destinations", href: "/destinations" },
  { label: "Travel Deals", href: "/deals" },
  { label: "Travel Ecosystem", href: "/travel-ecosystem" },
  { label: "Business Travel", href: "/business-travel" },
  { label: "Education Travel", href: "/education-travel" },
  { label: "Experience Travel", href: "/experience-travel" },
  { label: "Pilgrim Travel", href: "/pilgrim-travel" },
  { label: "Forex", href: "/forex" },
];

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    className: "bg-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
        <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.334 3.678 1.315c-.98.98-1.187 2.092-1.245 3.373C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.612.058 1.281.265 2.393 1.245 3.373.98.98 2.092 1.187 3.373 1.245C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.058 2.393-.265 3.373-1.245.98-.98 1.187-2.092 1.245-3.373.058-1.28.07-1.689.07-7.612 0-5.923-.012-6.332-.07-7.612-.058-1.281-.265-2.393-1.245-3.373C19.341.334 18.229.128 16.948.07 15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/",
    className: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-black" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.725-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    className: "bg-[#0A66C2]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.845-1.563 3.043 0 3.604 2.004 3.604 4.609v5.587z" />
      </svg>
    ),
  },
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
                <Link to="/sitemap" className="hover:text-[#d4a853]">
                  Sitemap
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

        {/* Follow us + Payment & Security */}
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Follow us on:</h4>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110 ${social.className}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Payment & Security</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-11 items-center rounded-md bg-white px-3 py-1.5">
                <img src="/visa.svg" alt="Visa" className="h-6 w-auto" />
              </div>
              <div className="flex h-11 items-center rounded-md bg-white px-3 py-1.5">
                <img src="/mastercard.svg" alt="Mastercard" className="h-7 w-auto" />
              </div>
              <div className="flex h-11 items-center rounded-md bg-white px-3 py-1.5">
                <img src="/rupay.svg" alt="RuPay" className="h-6 w-auto" />
              </div>
            </div>
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
