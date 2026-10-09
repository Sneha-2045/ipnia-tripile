import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { label: "Flights", href: "/flights/destinations" },
  { label: "Hotels", href: "/hotels/destinations" },
  { label: "Deals", href: "/deals" },
  { label: "Travel Ecosystem", href: "/travel-ecosystem" },
  { label: "Business Travel", href: "/business-travel" },
  { label: "Education Travel", href: "/education-travel" },
  { label: "Experience Travel", href: "/experience-travel" },
  { label: "Pilgrim Travel", href: "/pilgrim-travel" },
  { label: "Forex", href: "/forex" },
  { label: "About IPNIA", href: "/about" },
];

export function BookingNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return location.pathname === "/";
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <nav className="ipnia-nav">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center" onClick={() => setOpen(false)} aria-label="IPNIA.com home">
          <BrandLogo size={34} className="h-[34px] w-[133px] object-contain object-left" />
        </Link>

        <div className="hidden items-center gap-0.5 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`ipnia-nav-link ${isActive(link.href) ? "ipnia-nav-link-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 xl:flex">
          {!loading && !user && (
            <Link
              to="/login"
              className="text-sm font-medium text-white/65 transition-colors hover:text-white"
            >
              Sign In
            </Link>
          )}
          {!loading && user && (
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-white/65 transition-colors hover:text-white"
            >
              Sign Out
            </button>
          )}
          <Button asChild className="ipnia-btn-gold rounded-full px-5">
            <Link to="/contact">Plan Your Journey</Link>
          </Button>
        </div>

        <button
          className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:border-[#d4a853]/40 hover:text-[#d4a853] xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-white/10 bg-[#07111f]/98 px-4 py-4 backdrop-blur-xl xl:hidden">
          <div className="mx-auto max-w-7xl space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-[#d4a853]/12 text-[#d4a853]"
                    : "text-white/85 hover:bg-white/5"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!loading && !user && (
              <Link
                to="/login"
                className="block rounded-xl px-3 py-3 text-sm text-white/70"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Button asChild className="ipnia-btn-gold mt-3 w-full rounded-full">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Plan Your Journey
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
