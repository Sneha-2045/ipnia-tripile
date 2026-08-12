import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { label: "Flights", href: "/#booking" },
  { label: "Hotels", href: "/hotels/search" },
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a1628]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <BrandLogo size={34} />
          <span className="text-xl font-bold text-white">IPNIA</span>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                isActive(link.href) ? "text-[#d4a853]" : "text-white/75 hover:text-[#d4a853]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          {!loading && !user && (
            <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white">
              Sign In
            </Link>
          )}
          {!loading && user && (
            <button onClick={() => signOut()} className="text-sm text-white/70 hover:text-white">
              Sign Out
            </button>
          )}
          <Button asChild className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
            <Link to="/contact">Plan Your Journey</Link>
          </Button>
        </div>

        <button className="p-2 text-white xl:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0a1628] px-4 py-3 xl:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block py-2.5 text-sm text-white/85"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-3 w-full bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
            <Link to="/contact" onClick={() => setOpen(false)}>
              Plan Your Journey
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
