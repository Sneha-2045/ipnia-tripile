import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SeoPageLayout } from "@/components/seo/SeoPageLayout";
import { seoAirlines } from "@/data/seo/airlines";
import { getSeoCountries } from "@/data/seo/countries";
import { seoDeals } from "@/data/seo/deals";
import { seoDestinations } from "@/data/seo/destinations";
import { seoRoutes } from "@/data/seo/routes";
import { buildSitemapUrls } from "@/lib/seo/sitemapRegistry";
import { Input } from "@/components/ui/input";

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5 open:pb-5"
    >
      <summary className="cursor-pointer list-none text-lg font-semibold text-[#d4a853]">
        {title}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function LinkList({ items }: { items: { label: string; to: string }[] }) {
  return (
    <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <li key={i.to}>
          <Link to={i.to} className="text-sm text-white/80 hover:text-[#d4a853]">
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function HtmlSitemapPage() {
  const [q, setQ] = useState("");
  const all = useMemo(() => buildSitemapUrls(), []);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return null;
    return all.filter(
      (u) => u.path.toLowerCase().includes(needle) || u.loc.toLowerCase().includes(needle)
    );
  }, [all, q]);

  return (
    <SeoPageLayout
      title="Sitemap"
      description="Human-readable IPNIA sitemap covering flights, hotels, destinations, airlines, countries and deals."
      path="/sitemap"
      keywords="IPNIA sitemap, site directory"
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Sitemap" }]}
      headline="IPNIA sitemap"
      subhead={`${all.length} indexable pages across flights, hotels, destinations, airlines, countries and deals.`}
    >
      <div className="mb-6">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search sitemap URLs…"
          className="h-12 border-white/15 bg-[#07111f] text-white placeholder:text-white/40"
        />
      </div>

      {filtered ? (
        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5">
          <p className="mb-3 text-sm text-white/50">{filtered.length} matches</p>
          <LinkList items={filtered.slice(0, 200).map((u) => ({ label: u.path, to: u.path }))} />
        </section>
      ) : (
        <div className="space-y-4">
          <Section title="Flights" defaultOpen>
            <LinkList
              items={[
                { label: "Flight search", to: "/flights/search" },
                { label: "Flight destinations", to: "/flights/destinations" },
                { label: "Flight countries", to: "/flights/countries" },
                { label: "Airlines", to: "/flights/airlines" },
                ...seoDestinations.slice(0, 40).map((d) => ({
                  label: `Flights to ${d.name}`,
                  to: `/flights/to/${d.slug}`,
                })),
              ]}
            />
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-[#d4a853]">
                All flight destinations ({seoDestinations.length})
              </summary>
              <div className="mt-3">
                <LinkList
                  items={seoDestinations.map((d) => ({
                    label: `Flights to ${d.name}`,
                    to: `/flights/to/${d.slug}`,
                  }))}
                />
              </div>
            </details>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-[#d4a853]">
                Flight routes ({seoRoutes.length})
              </summary>
              <div className="mt-3">
                <LinkList
                  items={seoRoutes.map((r) => ({
                    label: `/flights/from/${r.fromSlug}/to/${r.toSlug}`,
                    to: `/flights/from/${r.fromSlug}/to/${r.toSlug}`,
                  }))}
                />
              </div>
            </details>
          </Section>

          <Section title="Hotels">
            <LinkList
              items={[
                { label: "Hotel search", to: "/hotels/search" },
                { label: "Hotel destinations", to: "/hotels/destinations" },
                { label: "Hotel countries", to: "/hotels/countries" },
                ...seoDestinations.slice(0, 40).map((d) => ({
                  label: `Hotels in ${d.name}`,
                  to: `/hotels/${d.slug}`,
                })),
              ]}
            />
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-[#d4a853]">
                All hotel destinations ({seoDestinations.length})
              </summary>
              <div className="mt-3">
                <LinkList
                  items={seoDestinations.map((d) => ({
                    label: `Hotels in ${d.name}`,
                    to: `/hotels/${d.slug}`,
                  }))}
                />
              </div>
            </details>
          </Section>

          <Section title="Airlines">
            <LinkList
              items={[
                { label: `All airlines (${seoAirlines.length})`, to: "/flights/airlines" },
                ...seoAirlines.map((a) => ({
                  label: `${a.name} (${a.iata})`,
                  to: `/flights/airlines/${a.slug}`,
                })),
              ]}
            />
          </Section>

          <Section title="Countries">
            <LinkList
              items={getSeoCountries().map((c) => ({
                label: c.name,
                to: `/flights/countries/${c.slug}`,
              }))}
            />
          </Section>

          <Section title="Destinations">
            <LinkList
              items={[
                { label: "All destinations", to: "/destinations" },
                ...seoDestinations.map((d) => ({
                  label: d.name,
                  to: `/destinations/${d.slug}`,
                })),
              ]}
            />
          </Section>

          <Section title="Deals">
            <LinkList
              items={[
                { label: "All deals", to: "/deals" },
                ...seoDeals.map((d) => ({ label: d.title, to: `/deals/${d.slug}` })),
              ]}
            />
          </Section>

          <Section title="Travel & company">
            <LinkList
              items={[
                { label: "Travel ecosystem", to: "/travel-ecosystem" },
                { label: "Business travel", to: "/business-travel" },
                { label: "Education travel", to: "/education-travel" },
                { label: "Experience travel", to: "/experience-travel" },
                { label: "Pilgrim travel", to: "/pilgrim-travel" },
                { label: "Forex", to: "/forex" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Pricing", to: "/pricing" },
                { label: "Privacy policy", to: "/privacy-policy" },
                { label: "Refund policy", to: "/refund-policy" },
                { label: "Terms", to: "/terms-and-conditions" },
              ]}
            />
          </Section>
        </div>
      )}
    </SeoPageLayout>
  );
}
