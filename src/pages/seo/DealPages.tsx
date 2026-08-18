import { Navigate, useParams } from "react-router-dom";
import { SeoLinkGrid, SeoPageLayout } from "@/components/seo/SeoPageLayout";
import { dealsByCategory, getDealBySlug, seoDeals } from "@/data/seo/deals";

export function DealsIndexPage() {
  return (
    <SeoPageLayout
      title="Travel Deals — Flights & Hotels"
      description="Explore IPNIA deal guides for cheap flights, cabins, domestic/international travel and hotel categories."
      path="/deals"
      keywords="travel deals, cheap flights, hotel deals, IPNIA"
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Deals" }]}
      headline="Travel deals"
      subhead="Useful deal categories with real search CTAs — not date spam."
      primaryCta={{ label: "Search flights", to: "/flights/search" }}
      secondaryCta={{ label: "Search hotels", to: "/hotels/search" }}
    >
      <div className="space-y-6">
        <SeoLinkGrid
          title="Flight deals"
          links={dealsByCategory("flights").map((d) => ({
            label: d.title,
            to: `/deals/${d.slug}`,
          }))}
        />
        <SeoLinkGrid
          title="Hotel deals"
          links={dealsByCategory("hotels").map((d) => ({
            label: d.title,
            to: `/deals/${d.slug}`,
          }))}
        />
        <SeoLinkGrid
          title="Travel"
          links={dealsByCategory("travel").map((d) => ({
            label: d.title,
            to: `/deals/${d.slug}`,
          }))}
        />
      </div>
    </SeoPageLayout>
  );
}

export function DealDetailPage() {
  const { slug = "" } = useParams();
  const deal = getDealBySlug(slug);
  if (!deal) return <Navigate to="/deals" replace />;

  return (
    <SeoPageLayout
      title={deal.title}
      description={deal.description}
      path={`/deals/${deal.slug}`}
      keywords={`${deal.title}, IPNIA deals`}
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Deals", to: "/deals" },
        { label: deal.title },
      ]}
      headline={deal.headline}
      subhead={deal.description}
      primaryCta={{ label: deal.ctaLabel, to: deal.ctaPath }}
    >
      <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
        <h2 className="text-xl font-semibold text-[#d4a853]">What you can do</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-white/75">
          {deal.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>
      <div className="mt-6">
        <SeoLinkGrid
          title="Related"
          links={[
            ...deal.relatedPaths.map((r) => ({ label: r.label, to: r.path })),
            ...seoDeals
              .filter((d) => d.slug !== deal.slug && d.category === deal.category)
              .slice(0, 6)
              .map((d) => ({ label: d.title, to: `/deals/${d.slug}` })),
          ]}
        />
      </div>
    </SeoPageLayout>
  );
}
