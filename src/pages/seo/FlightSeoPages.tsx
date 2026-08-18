import { Link, Navigate, useParams } from "react-router-dom";
import { SeoLinkGrid, SeoPageLayout } from "@/components/seo/SeoPageLayout";
import { airlinesForDestination, getAirlineBySlug, seoAirlines, validHubSlugs } from "@/data/seo/airlines";
import { getDestinationBySlug, seoDestinations } from "@/data/seo/destinations";
import { getRoute, routesFrom, routesTo, seoRoutes } from "@/data/seo/routes";
import { flightSearchPath, primaryAirport } from "@/lib/seo/searchLinks";

export function FlightDestinationsIndexPage() {
  return (
    <SeoPageLayout
      title="Flight Destinations — Cheap Flights Worldwide"
      description="Browse IPNIA flight destination pages. Search live flights to major cities worldwide."
      path="/flights/destinations"
      keywords="cheap flights, flight destinations, IPNIA flights"
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Flights", to: "/flights" },
        { label: "Destinations" },
      ]}
      headline="Flight destinations"
      subhead={`Cheap flights to ${seoDestinations.length} cities — each page links into live IPNIA flight search.`}
      primaryCta={{ label: "Search flights", to: "/flights/search" }}
    >
      <SeoLinkGrid
        title="Cheap flights to…"
        initial={36}
        links={seoDestinations.map((d) => ({
          label: `Cheap flights to ${d.name}`,
          to: `/flights/to/${d.slug}`,
          note: d.countryName,
        }))}
      />
      <div className="mt-6">
        <SeoLinkGrid
          title="Popular flight routes"
          links={seoRoutes.map((r) => ({
            label: `${getDestinationBySlug(r.fromSlug)?.name} → ${getDestinationBySlug(r.toSlug)?.name}`,
            to: `/flights/from/${r.fromSlug}/to/${r.toSlug}`,
          }))}
        />
      </div>
    </SeoPageLayout>
  );
}

export function FlightToDestinationPage() {
  const { slug = "" } = useParams();
  const dest = getDestinationBySlug(slug);
  if (!dest) return <Navigate to="/flights/destinations" replace />;

  const airport = primaryAirport(dest);
  const inbound = routesTo(dest.slug);
  const airlines = airlinesForDestination(dest.slug);

  return (
    <SeoPageLayout
      title={`Cheap Flights to ${dest.name}`}
      description={`Search cheap flights to ${dest.name}, ${dest.countryName}. ${dest.blurb}`}
      path={`/flights/to/${dest.slug}`}
      keywords={`cheap flights to ${dest.name}, flights to ${dest.name}, ${dest.name} airfare`}
      image={dest.image}
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Flights", to: "/flights" },
        { label: "Destinations", to: "/flights/destinations" },
        { label: dest.name },
      ]}
      headline={`Cheap flights to ${dest.name}`}
      subhead={dest.blurb}
      primaryCta={{ label: `Search flights to ${dest.name}`, to: flightSearchPath(undefined, airport) }}
      secondaryCta={{ label: `Hotels in ${dest.name}`, to: `/hotels/${dest.slug}` }}
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
          <h2 className="text-xl font-semibold text-[#d4a853]">Flying to {dest.name}</h2>
          <p className="mt-3 text-white/75">
            Use IPNIA flight search to compare live offers into {dest.name}
            {airport ? ` (${airport})` : ""}. International journeys require passport details; India
            domestic trips do not.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/70">
            <li>
              Destination guide:{" "}
              <Link className="text-[#d4a853]" to={`/destinations/${dest.slug}`}>
                {dest.name} travel guide
              </Link>
            </li>
            <li>
              Country hub:{" "}
              <Link className="text-[#d4a853]" to={`/flights/countries/${dest.countrySlug}`}>
                Flights to {dest.countryName}
              </Link>
            </li>
            <li>Popular areas: {dest.popularAreas.join(", ")}</li>
          </ul>
        </section>
        {inbound.length > 0 && (
          <SeoLinkGrid
            title={`Flights to ${dest.name} from popular cities`}
            links={inbound.map((r) => ({
              label: `${getDestinationBySlug(r.fromSlug)?.name} → ${dest.name}`,
              to: `/flights/from/${r.fromSlug}/to/${r.toSlug}`,
              note: r.blurb,
            }))}
          />
        )}
        {airlines.length > 0 && (
          <SeoLinkGrid
            title="Airlines"
            links={airlines.map((a) => ({
              label: a.name,
              to: `/flights/airlines/${a.slug}`,
              note: a.iata,
            }))}
          />
        )}
      </div>
    </SeoPageLayout>
  );
}

export function FlightRoutePage() {
  const { fromSlug = "", toSlug = "" } = useParams();
  const route = getRoute(fromSlug, toSlug);
  const from = getDestinationBySlug(fromSlug);
  const to = getDestinationBySlug(toSlug);
  if (!route || !from || !to) return <Navigate to="/flights/destinations" replace />;

  return (
    <SeoPageLayout
      title={`Flights from ${from.name} to ${to.name}`}
      description={`${route.blurb} Search live ${from.name}–${to.name} flight offers with IPNIA.`}
      path={`/flights/from/${from.slug}/to/${to.slug}`}
      keywords={`flights from ${from.name} to ${to.name}, ${from.name} to ${to.name} flights`}
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Flights", to: "/flights" },
        { label: "Destinations", to: "/flights/destinations" },
        { label: `${from.name} → ${to.name}` },
      ]}
      headline={`Flights from ${from.name} to ${to.name}`}
      subhead={route.blurb}
      primaryCta={{
        label: "Search this route",
        to: flightSearchPath(primaryAirport(from), primaryAirport(to)),
      }}
      secondaryCta={{ label: `Hotels in ${to.name}`, to: `/hotels/${to.slug}` }}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
          <h2 className="text-lg font-semibold text-[#d4a853]">Origin — {from.name}</h2>
          <p className="mt-2 text-sm text-white/70">{from.blurb}</p>
          <Link className="mt-3 inline-block text-sm text-[#d4a853]" to={`/flights/to/${from.slug}`}>
            More flights involving {from.name}
          </Link>
        </section>
        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
          <h2 className="text-lg font-semibold text-[#d4a853]">Destination — {to.name}</h2>
          <p className="mt-2 text-sm text-white/70">{to.blurb}</p>
          <Link className="mt-3 inline-block text-sm text-[#d4a853]" to={`/destinations/${to.slug}`}>
            {to.name} destination guide
          </Link>
        </section>
      </div>
      <div className="mt-6">
        <SeoLinkGrid
          title="Related routes"
          links={[
            ...routesFrom(from.slug),
            ...routesTo(to.slug),
          ]
            .filter((r) => !(r.fromSlug === from.slug && r.toSlug === to.slug))
            .slice(0, 12)
            .map((r) => ({
              label: `${getDestinationBySlug(r.fromSlug)?.name} → ${getDestinationBySlug(r.toSlug)?.name}`,
              to: `/flights/from/${r.fromSlug}/to/${r.toSlug}`,
            }))}
        />
      </div>
    </SeoPageLayout>
  );
}

export function AirlinesIndexPage() {
  return (
    <SeoPageLayout
      title="Airlines — Book with IPNIA"
      description={`Browse ${seoAirlines.length} airlines available in IPNIA’s flight ecosystem and search live offers.`}
      path="/flights/airlines"
      keywords="airlines, airline tickets, IPNIA airlines"
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Flights", to: "/flights" },
        { label: "Airlines" },
      ]}
      headline={`${seoAirlines.length} Airlines`}
      subhead="Airline directory powered by IPNIA’s catalog — expands automatically as coverage grows."
      primaryCta={{ label: "Search flights", to: "/flights/search" }}
    >
      <SeoLinkGrid
        title="All airlines"
        initial={33}
        links={seoAirlines.map((a) => ({
          label: a.name,
          to: `/flights/airlines/${a.slug}`,
          note: `${a.iata} · ${a.countryName}`,
        }))}
      />
    </SeoPageLayout>
  );
}

export function AirlineDetailPage() {
  const { slug = "" } = useParams();
  const airline = getAirlineBySlug(slug);
  if (!airline) return <Navigate to="/flights/airlines" replace />;
  const hubs = validHubSlugs(airline);

  return (
    <SeoPageLayout
      title={`${airline.name} (${airline.iata}) Flights`}
      description={`${airline.blurb} Search ${airline.name} and partner flights with IPNIA.`}
      path={`/flights/airlines/${airline.slug}`}
      keywords={`${airline.name}, ${airline.iata}, ${airline.name} flights`}
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Flights", to: "/flights" },
        { label: "Airlines", to: "/flights/airlines" },
        { label: airline.name },
      ]}
      headline={airline.name}
      subhead={`${airline.iata}${airline.alliance ? ` · ${airline.alliance}` : ""} · ${airline.countryName}`}
      primaryCta={{ label: `Search flights`, to: "/flights/search" }}
      secondaryCta={{
        label: airline.countryName,
        to: `/flights/countries/${airline.countrySlug}`,
      }}
    >
      <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
        <h2 className="text-xl font-semibold text-[#d4a853]">About {airline.name}</h2>
        <p className="mt-3 text-white/75">{airline.blurb}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-white/45">IATA</dt>
            <dd className="font-semibold">{airline.iata}</dd>
          </div>
          <div>
            <dt className="text-white/45">Country</dt>
            <dd className="font-semibold">{airline.countryName}</dd>
          </div>
          <div>
            <dt className="text-white/45">Alliance</dt>
            <dd className="font-semibold">{airline.alliance || "Independent"}</dd>
          </div>
        </dl>
      </section>
      {hubs.length > 0 && (
        <div className="mt-6">
          <SeoLinkGrid
            title="Key destinations"
            links={hubs.map((s) => {
              const d = getDestinationBySlug(s)!;
              return {
                label: d.name,
                to: `/flights/to/${d.slug}`,
                note: d.countryName,
              };
            })}
          />
        </div>
      )}
      <section className="mt-6 rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
        <h2 className="text-lg font-semibold text-[#d4a853]">FAQ</h2>
        <div className="mt-3 space-y-3 text-sm text-white/70">
          <p>
            <strong className="text-white">Can I book {airline.name} on IPNIA?</strong>
            <br />
            Search live offers on the flight search page. Available inventory depends on the route and
            date.
          </p>
          <p>
            <strong className="text-white">Do I need a passport?</strong>
            <br />
            Passport details are required when origin or destination is outside India.
          </p>
        </div>
      </section>
    </SeoPageLayout>
  );
}
