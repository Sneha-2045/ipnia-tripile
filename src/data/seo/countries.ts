import { seoDestinations, type SeoDestination } from "./destinations";
import { seoAirlines } from "./airlines";
import { slugify } from "@/lib/seo/site";

export type SeoCountry = {
  slug: string;
  name: string;
  code: string;
  region: string;
  blurb: string;
};

/** Derive countries from destination + airline catalogs (no empty shells). */
export function getSeoCountries(): SeoCountry[] {
  const map = new Map<string, SeoCountry>();

  for (const dest of seoDestinations) {
    if (!map.has(dest.countrySlug)) {
      map.set(dest.countrySlug, {
        slug: dest.countrySlug,
        name: dest.countryName,
        code: dest.countryCode,
        region: dest.region,
        blurb: `Explore flights, hotels and travel planning for ${dest.countryName} with IPNIA — covering major cities and travel corridors.`,
      });
    }
  }

  for (const airline of seoAirlines) {
    if (!map.has(airline.countrySlug)) {
      map.set(airline.countrySlug, {
        slug: airline.countrySlug,
        name: airline.countryName,
        code: "",
        region: "Worldwide",
        blurb: `Airlines and travel options connected to ${airline.countryName} via IPNIA flight search.`,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getCountryBySlug(slug: string): SeoCountry | undefined {
  return getSeoCountries().find((c) => c.slug === slug);
}

export function citiesInCountry(slug: string): SeoDestination[] {
  return seoDestinations.filter((d) => d.countrySlug === slug);
}

export function ensureCountrySlug(name: string) {
  return slugify(name);
}
