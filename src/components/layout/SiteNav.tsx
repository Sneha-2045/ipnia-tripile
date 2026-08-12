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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a1628]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <BrandLogo size={34} className="shrink-0" />
          <span className="text-xl font-bold tracking-tight text-white">IPNIA</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/business-travel")
                    ? "text-[#d4a853]"
                    : "text-white/80 hover:text-[#d4a853]"
                }`}
              >
                Business Travel
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 border-[#d4a853]/30 bg-[#0c1a2e] text-white"
            >
              <DropdownMenuItem asChild className="focus:bg-[#d4a853]/15 focus:text-[#d4a853]">
                <Link to="/business-travel">Overview</Link>
              </DropdownMenuItem>
              {businessLinks.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  asChild
                  className="focus:bg-[#d4a853]/15 focus:text-[#d4a853]"
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
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href) ? "text-[#d4a853]" : "text-white/80 hover:text-[#d4a853]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {!loading && !user && (
            <Link
              to="/login"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Sign In
            </Link>
          )}
          {!loading && user && (
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Sign Out
            </button>
          )}
          <Button
            asChild
            className="bg-[#d4a853] text-[#0a1628] hover:bg-[#e0b96a] font-semibold"
          >
            <Link to="/contact">Plan Your Journey</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0a1628] px-4 py-4 lg:hidden">
          <button
            className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-[#d4a853]"
            onClick={() => setBizOpen((v) => !v)}
          >
            Business Travel
            <ChevronDown className={`h-4 w-4 transition-transform ${bizOpen ? "rotate-180" : ""}`} />
          </button>
          {bizOpen && (
            <div className="mb-2 ml-3 space-y-1 border-l border-[#d4a853]/30 pl-3">
              <Link
                to="/business-travel"
                className="block py-2 text-sm text-white/80"
                onClick={() => setOpen(false)}
              >
                Overview
              </Link>
              {businessLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block py-2 text-sm text-white/80"
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
              className="block py-3 text-sm font-medium text-white/85"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            {!loading && !user && (
              <Link
                to="/login"
                className="py-2 text-sm text-white/70"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Button
              asChild
              className="w-full bg-[#d4a853] text-[#0a1628] hover:bg-[#e0b96a] font-semibold"
            >
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
