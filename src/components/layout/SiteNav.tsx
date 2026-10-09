import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const businessLinks = [
  { label: "China Business Tours", href: "/business-travel#china-business-tours" },
  { label: "Canton Fair", href: "/business-travel#canton-fair" },
  { label: "Factory Visits", href: "/business-travel#factory-visits" },
  { label: "Supplier Verification", href: "/business-travel#supplier-verification" },
  { label: "Product Sourcing", href: "/business-travel#product-sourcing" },
  { label: "Business Delegations", href: "/business-travel#business-delegations" },
  { label: "USA Dropshipping", href: "/business-travel#usa-dropshipping" },
];

const navLinks = [
  { label: "Flights", href: "/" },
  { label: "Hotels", href: "/hotels/search" },
  { label: "Travel Ecosystem", href: "/travel-ecosystem" },
  { label: "Education Travel", href: "/education-travel" },
  { label: "Experience Travel", href: "/experience-travel" },
  { label: "Pilgrim Travel", href: "/pilgrim-travel" },
  { label: "Forex", href: "/forex" },
  { label: "About IPNIA", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [bizOpen, setBizOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <nav className="ipnia-nav">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center" onClick={() => setOpen(false)} aria-label="IPNIA.com home">
          <BrandLogo size={34} className="h-[34px] w-[133px] object-contain object-left" />
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`ipnia-nav-link inline-flex items-center gap-1 ${
                  isActive("/business-travel") ? "ipnia-nav-link-active" : ""
                }`}
              >
                Business Travel
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-60 rounded-xl border-slate-200 bg-white p-1.5 text-[#18324b] shadow-travel backdrop-blur-xl"
            >
              <DropdownMenuItem asChild className="rounded-lg focus:bg-amber-50 focus:text-[#805d12]">
                <Link to="/business-travel">Overview</Link>
              </DropdownMenuItem>
              {businessLinks.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  asChild
                  className="rounded-lg focus:bg-amber-50 focus:text-[#805d12]"
                >
                  <Link to={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`ipnia-nav-link ${isActive(link.href) ? "ipnia-nav-link-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
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
          className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:border-[#e2b552]/40 hover:text-[#e2b552] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-slate-200 bg-white px-4 py-4 backdrop-blur-xl lg:hidden">
          <button
            className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#e2b552]"
            onClick={() => setBizOpen((v) => !v)}
          >
            Business Travel
            <ChevronDown className={`h-4 w-4 transition-transform ${bizOpen ? "rotate-180" : ""}`} />
          </button>
          {bizOpen && (
            <div className="mb-2 ml-3 space-y-1 border-l border-[#e2b552]/30 pl-3">
              <Link
                to="/business-travel"
                className="block rounded-lg py-2.5 text-sm text-white/80"
                onClick={() => setOpen(false)}
              >
                Overview
              </Link>
              {businessLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block rounded-lg py-2.5 text-sm text-white/80"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block rounded-xl px-3 py-3 text-sm font-medium text-[#30465d] hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            {!loading && !user && (
              <Link
                to="/login"
                className="px-3 py-2 text-sm text-slate-600"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Button asChild className="ipnia-btn-gold w-full rounded-full">
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
