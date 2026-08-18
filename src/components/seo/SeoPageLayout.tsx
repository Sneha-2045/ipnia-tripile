import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { SITE_ORIGIN } from "@/lib/seo/site";

type Crumb = { label: string; to?: string };

type Props = {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  image?: string;
  breadcrumbs: Crumb[];
  headline: string;
  subhead?: string;
  children: ReactNode;
  primaryCta?: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export function SeoPageLayout({
  title,
  description,
  path,
  keywords,
  image,
  breadcrumbs,
  headline,
  subhead,
  children,
  primaryCta,
  secondaryCta,
  jsonLd,
}: Props) {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: b.to ? `${SITE_ORIGIN}${b.to}` : `${SITE_ORIGIN}${path}`,
    })),
  };

  const mergedLd = jsonLd
    ? Array.isArray(jsonLd)
      ? [breadcrumbLd, ...jsonLd]
      : [breadcrumbLd, jsonLd]
    : breadcrumbLd;

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <SEO
        title={title}
        description={description}
        path={path}
        keywords={keywords}
        image={image}
        jsonLd={mergedLd}
      />
      <BookingNav />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/50">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((b, i) => (
              <li key={`${b.label}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/25">/</span>}
                {b.to ? (
                  <Link to={b.to} className="hover:text-[#d4a853]">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-white/80">{b.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold md:text-5xl">{headline}</h1>
          {subhead && <p className="mt-4 text-lg text-white/70">{subhead}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {primaryCta && (
                <Button asChild className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
                  <Link to={primaryCta.to}>{primaryCta.label}</Link>
                </Button>
              )}
              {secondaryCta && (
                <Button
                  asChild
                  variant="outline"
                  className="border-[#d4a853]/40 bg-transparent text-white hover:bg-[#d4a853]/10 hover:text-white"
                >
                  <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          )}
        </header>

        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function SeoLinkGrid({
  title,
  links,
  initial = 24,
}: {
  title: string;
  links: { label: string; to: string; note?: string }[];
  initial?: number;
}) {
  const showAll = links.length <= initial;
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold text-[#d4a853]">{title}</h2>
        <p className="text-sm text-white/45">{links.length} links</p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {(showAll ? links : links.slice(0, initial)).map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="block rounded-lg px-2 py-2 text-sm text-white/85 hover:bg-[#d4a853]/10 hover:text-[#d4a853]">
              {l.label}
              {l.note && <span className="mt-0.5 block text-xs text-white/45">{l.note}</span>}
            </Link>
          </li>
        ))}
      </ul>
      {!showAll && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-[#d4a853]">
            View all {links.length}
          </summary>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {links.slice(initial).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="block rounded-lg px-2 py-2 text-sm text-white/85 hover:bg-[#d4a853]/10 hover:text-[#d4a853]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
