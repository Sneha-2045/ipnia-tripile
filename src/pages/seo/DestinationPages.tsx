import { Link, Navigate, useParams } from "react-router-dom";
import { SeoLinkGrid, SeoPageLayout } from "@/components/seo/SeoPageLayout";
import { airlinesForDestination } from "@/data/seo/airlines";
import { getDestinationBySlug, seoDestinations } from "@/data/seo/destinations";
import { routesFrom, routesTo } from "@/data/seo/routes";
import { flightSearchPath, hotelSearchPath, primaryAirport } from "@/lib/seo/searchLinks";

export function DestinationsIndexPage() {
  const byRegion = seoDestinations.reduce<Record<string, typeof seoDestinations>>((acc, d) => {
    (acc[d.region] ||= []).push(d);
    return acc;
  }, {});

  return (
    <SeoPageLayout
      title="Travel Destinations Worldwide"
      description="Explore IPNIA destination guides with flights, hotels, airlines and popular routes for cities worldwide."
      path="/destinations"
      keywords="travel destinations, flights and hotels, IPNIA destinations"
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Destinations" }]}
      headline="Destinations"
      subhead={`${seoDestinations.length} city guides with flights, hotels and travel links — built to grow as IPNIA coverage expands.`}
      primaryCta={{ label: "Search flights", to: "/flights/search" }}
      secondaryCta={{ label: "Search hotels", to: "/hotels/search" }}
    >
      <div className="space-y-6">
        {Object.entries(byRegion)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([region, list]) => (
            <SeoLinkGrid
              key={region}
              title={region}
              links={list.map((d) => ({
                label: d.name,
                to: `/destinations/${d.slug}`,
                note: d.countryName,
              }))}
            />
          ))}
      </div>
    </SeoPageLayout>
  );
}

export function DestinationDetailPage() {
  const { slug = "" } = useParams();
  const dest = getDestinationBySlug(slug);
  if (!dest) return <Navigate to="/destinations" replace />;

  const inbound = routesTo(dest.slug);
  const outbound = routesFrom(dest.slug);
  const airlines = airlinesForDestination(dest.slug);
  const airport = primaryAirport(dest);

  return (
    <SeoPageLayout
      title={`${dest.name} Travel Guide — Flights & Hotels`}
      description={`${dest.blurb} Search flights to ${dest.name} and hotels with IPNIA.`}
      path={`/destinations/${dest.slug}`}
      keywords={`${dest.name} travel, flights to ${dest.name}, hotels in ${dest.name}`}
      image={dest.image}
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Destinations", to: "/destinations" },
        { label: dest.name },
      ]}
      headline={dest.name}
      subhead={`${dest.countryName} · ${dest.region}. ${dest.blurb}`}
      primaryCta={{
        label: `Flights to ${dest.name}`,
        to: flightSearchPath(undefined, airport),
      }}
      secondaryCta={{ label: `Hotels in ${dest.name}`, to: hotelSearchPath(dest.name) }}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: dest.name,
        description: dest.blurb,
        url: `https://ipnia.com/destinations/${dest.slug}`,
      }}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-[#d4a853]">Why visit {dest.name}</h2>
          <p className="mt-3 text-white/75">{dest.blurb}</p>
          <h3 className="mt-6 font-semibold text-white">Highlights</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
            {dest.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <h3 className="mt-6 font-semibold text-white">Popular areas</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {dest.popularAreas.map((a) => (
              <li key={a} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">
                {a}
              </li>
            ))}
          </ul>
          {dest.airportCodes.length > 0 && (
            <p className="mt-6 text-sm text-white/55">
              Airports: {dest.airportCodes.join(", ")}
            </p>
          )}
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#d4a853]/30 bg-[#0c1a2e] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#d4a853]">Quick links</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-white/85 hover:text-[#d4a853]" to={`/flights/to/${dest.slug}`}>
                  Cheap flights to {dest.name}
                </Link>
              </li>
              <li>
                <Link className="text-white/85 hover:text-[#d4a853]" to={`/hotels/${dest.slug}`}>
                  Cheap hotels in {dest.name}
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/85 hover:text-[#d4a853]"
                  to={`/flights/countries/${dest.countrySlug}`}
                >
                  Flights to {dest.countryName}
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/85 hover:text-[#d4a853]"
                  to={`/hotels/countries/${dest.countrySlug}`}
                >
                  Hotels in {dest.countryName}
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-6 space-y-6">
        {airlines.length > 0 && (
          <SeoLinkGrid
            title={`Airlines serving ${dest.name}`}
            links={airlines.map((a) => ({
              label: a.name,
              to: `/flights/airlines/${a.slug}`,
              note: a.iata,
            }))}
          />
        )}
        {(inbound.length > 0 || outbound.length > 0) && (
          <SeoLinkGrid
            title={`Popular routes for ${dest.name}`}
            links={[
              ...inbound.map((r) => ({
                label: `${getDestinationBySlug(r.fromSlug)?.name || r.fromSlug} → ${dest.name}`,
                to: `/flights/from/${r.fromSlug}/to/${r.toSlug}`,
              })),
              ...outbound.map((r) => ({
                label: `${dest.name} → ${getDestinationBySlug(r.toSlug)?.name || r.toSlug}`,
                to: `/flights/from/${r.fromSlug}/to/${r.toSlug}`,
              })),
            ]}
          />
        )}
      </div>
    </SeoPageLayout>
  );
}
