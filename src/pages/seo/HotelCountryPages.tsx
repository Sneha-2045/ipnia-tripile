import { Link, Navigate, useParams } from "react-router-dom";
import { SeoLinkGrid, SeoPageLayout } from "@/components/seo/SeoPageLayout";
import { citiesInCountry, getCountryBySlug, getSeoCountries } from "@/data/seo/countries";
import { getDestinationBySlug, seoDestinations } from "@/data/seo/destinations";
import { hotelSearchPath } from "@/lib/seo/searchLinks";
import { stayCategories } from "@/data/hotels";

export function HotelDestinationsIndexPage() {
  return (
    <SeoPageLayout
      title="Hotel Destinations — Stay Worldwide"
      description="Browse IPNIA hotel destination pages and search live lodging worldwide."
      path="/hotels/destinations"
      keywords="hotels, hotel destinations, cheap hotels, IPNIA hotels"
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Hotels", to: "/hotels" },
        { label: "Destinations" },
      ]}
      headline="Hotel destinations"
      subhead={`Cheap hotels in ${seoDestinations.length} cities — each page links to live Google Places hotel search.`}
      primaryCta={{ label: "Search hotels", to: "/hotels/search" }}
    >
      <SeoLinkGrid
        title="Cheap hotels in…"
        initial={36}
        links={seoDestinations.map((d) => ({
          label: `Cheap hotels in ${d.name}`,
          to: `/hotels/${d.slug}`,
          note: d.countryName,
        }))}
      />
    </SeoPageLayout>
  );
}

export function HotelDestinationPage() {
  const { slug = "" } = useParams();
  const dest = getDestinationBySlug(slug);
  if (!dest) return <Navigate to="/hotels/destinations" replace />;

  return (
    <SeoPageLayout
      title={`Hotels in ${dest.name}`}
      description={`Find hotels in ${dest.name}, ${dest.countryName}. ${dest.blurb}`}
      path={`/hotels/${dest.slug}`}
      keywords={`hotels in ${dest.name}, cheap hotels ${dest.name}, ${dest.name} lodging`}
      image={dest.image}
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Hotels", to: "/hotels" },
        { label: "Destinations", to: "/hotels/destinations" },
        { label: dest.name },
      ]}
      headline={`Hotels in ${dest.name}`}
      subhead={dest.blurb}
      primaryCta={{ label: `Search hotels in ${dest.name}`, to: hotelSearchPath(dest.name) }}
      secondaryCta={{ label: `Flights to ${dest.name}`, to: `/flights/to/${dest.slug}` }}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
            <h2 className="text-xl font-semibold text-[#d4a853]">Staying in {dest.name}</h2>
            <p className="mt-3 text-white/75">
              Search live lodging for {dest.name} with IPNIA’s Google Places–powered hotel search.
              Results include photos, guest ratings, maps and property details when available.
            </p>
            <h3 className="mt-6 font-semibold">Popular areas</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {dest.popularAreas.map((a) => (
                <li key={a} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">
                  {a}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-semibold">Nearby attractions</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
              {dest.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
            <h2 className="text-xl font-semibold text-[#d4a853]">Stay styles</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {stayCategories.map((c) => (
                <div key={c.id} className="rounded-xl border border-white/10 p-4">
                  <p className="font-semibold">{c.title}</p>
                  <p className="mt-1 text-sm text-white/60">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
          <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-6">
            <h2 className="text-lg font-semibold text-[#d4a853]">FAQ — Hotels in {dest.name}</h2>
            <div className="mt-3 space-y-3 text-sm text-white/70">
              <p>
                <strong className="text-white">Are these live hotel rates?</strong>
                <br />
                Hotel cards come from live Places lodging results for your search. Bookable room rates
                may require an enquiry with IPNIA.
              </p>
              <p>
                <strong className="text-white">How do I change dates?</strong>
                <br />
                Use the hotel search form — destination pages themselves are indexable guides without
                temporary date query parameters.
              </p>
            </div>
          </section>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#d4a853]/30 bg-[#0c1a2e] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#d4a853]">Also explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="hover:text-[#d4a853]" to={`/destinations/${dest.slug}`}>
                  {dest.name} destination guide
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#d4a853]" to={`/flights/to/${dest.slug}`}>
                  Cheap flights to {dest.name}
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#d4a853]" to={`/hotels/countries/${dest.countrySlug}`}>
                  Hotels in {dest.countryName}
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#d4a853]" to="/deals/hotel-deals">
                  Hotel deals
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </SeoPageLayout>
  );
}

export function HotelCountriesIndexPage() {
  const countries = getSeoCountries().filter((c) => citiesInCountry(c.slug).length > 0);
  return (
    <SeoPageLayout
      title="Hotel Countries"
      description="Browse hotel country guides on IPNIA and jump into city hotel pages."
      path="/hotels/countries"
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Hotels", to: "/hotels" },
        { label: "Countries" },
      ]}
      headline="Hotels by country"
      subhead="Country pages list supported hotel cities with live search CTAs."
      primaryCta={{ label: "Hotel destinations", to: "/hotels/destinations" }}
    >
      <SeoLinkGrid
        title="Countries"
        links={countries.map((c) => ({
          label: c.name,
          to: `/hotels/countries/${c.slug}`,
          note: `${citiesInCountry(c.slug).length} cities`,
        }))}
      />
    </SeoPageLayout>
  );
}

export function HotelCountryPage() {
  const { slug = "" } = useParams();
  const country = getCountryBySlug(slug);
  const cities = citiesInCountry(slug);
  if (!country || cities.length === 0) return <Navigate to="/hotels/countries" replace />;

  return (
    <SeoPageLayout
      title={`Hotels in ${country.name}`}
      description={`Explore hotel cities in ${country.name} and search live lodging with IPNIA.`}
      path={`/hotels/countries/${country.slug}`}
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Hotels", to: "/hotels" },
        { label: "Countries", to: "/hotels/countries" },
        { label: country.name },
      ]}
      headline={`Hotels in ${country.name}`}
      subhead={country.blurb}
      primaryCta={{ label: "Search hotels", to: "/hotels/search" }}
    >
      <SeoLinkGrid
        title={`Cities in ${country.name}`}
        links={cities.map((d) => ({
          label: `Hotels in ${d.name}`,
          to: `/hotels/${d.slug}`,
        }))}
      />
    </SeoPageLayout>
  );
}

export function FlightCountriesIndexPage() {
  const countries = getSeoCountries();
  return (
    <SeoPageLayout
      title="Flight Countries"
      description="Browse country flight guides and city destinations on IPNIA."
      path="/flights/countries"
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Flights", to: "/flights" },
        { label: "Countries" },
      ]}
      headline="Flights by country"
      subhead={`${countries.length} countries with destination coverage.`}
      primaryCta={{ label: "Search flights", to: "/flights/search" }}
    >
      <SeoLinkGrid
        title="Countries"
        links={countries.map((c) => ({
          label: c.name,
          to: `/flights/countries/${c.slug}`,
          note: c.region,
        }))}
      />
    </SeoPageLayout>
  );
}

export function FlightCountryPage() {
  const { slug = "" } = useParams();
  const country = getCountryBySlug(slug);
  const cities = citiesInCountry(slug);
  if (!country) return <Navigate to="/flights/countries" replace />;

  return (
    <SeoPageLayout
      title={`Flights to ${country.name}`}
      description={`Plan flights to ${country.name}. Explore cities, airlines and hotel links with IPNIA.`}
      path={`/flights/countries/${country.slug}`}
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Flights", to: "/flights" },
        { label: "Countries", to: "/flights/countries" },
        { label: country.name },
      ]}
      headline={`Flights to ${country.name}`}
      subhead={country.blurb}
      primaryCta={{ label: "Search flights", to: "/flights/search" }}
      secondaryCta={
        cities.length
          ? { label: `Hotels in ${country.name}`, to: `/hotels/countries/${country.slug}` }
          : undefined
      }
    >
      {cities.length > 0 ? (
        <SeoLinkGrid
          title={`Cities in ${country.name}`}
          links={cities.map((d) => ({
            label: `Flights to ${d.name}`,
            to: `/flights/to/${d.slug}`,
          }))}
        />
      ) : (
        <p className="text-white/60">
          City pages for this country will appear as destination coverage expands.
        </p>
      )}
      <div className="mt-6">
        <SeoLinkGrid
          title="Related destinations"
          links={seoDestinations
            .filter((d) => d.region === country.region)
            .slice(0, 12)
            .map((d) => ({
              label: d.name,
              to: `/destinations/${d.slug}`,
              note: d.countryName,
            }))}
        />
      </div>
    </SeoPageLayout>
  );
}
