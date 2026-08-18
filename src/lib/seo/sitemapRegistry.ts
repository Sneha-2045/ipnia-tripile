import { seoAirlines } from "@/data/seo/airlines";
import { getSeoCountries } from "@/data/seo/countries";
import { seoDeals } from "@/data/seo/deals";
import { seoDestinations } from "@/data/seo/destinations";
import { seoRoutes } from "@/data/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";

export type SitemapUrl = {
  loc: string;
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  group:
    | "flights"
    | "hotels"
    | "destinations"
    | "airlines"
    | "countries"
    | "deals"
    | "pages";
};

const STATIC_INDEXABLE: { path: string; group: SitemapUrl["group"]; priority: number }[] = [
  { path: "/", group: "pages", priority: 1.0 },
  { path: "/flights", group: "flights", priority: 0.9 },
  { path: "/flights/search", group: "flights", priority: 0.8 },
  { path: "/flights/destinations", group: "flights", priority: 0.8 },
  { path: "/flights/countries", group: "countries", priority: 0.7 },
  { path: "/flights/airlines", group: "airlines", priority: 0.8 },
  { path: "/hotels", group: "hotels", priority: 0.9 },
  { path: "/hotels/destinations", group: "hotels", priority: 0.8 },
  { path: "/hotels/countries", group: "countries", priority: 0.7 },
  { path: "/destinations", group: "destinations", priority: 0.85 },
  { path: "/deals", group: "deals", priority: 0.75 },
  { path: "/sitemap", group: "pages", priority: 0.5 },
  { path: "/travel-ecosystem", group: "pages", priority: 0.7 },
  { path: "/business-travel", group: "pages", priority: 0.7 },
  { path: "/education-travel", group: "pages", priority: 0.7 },
  { path: "/experience-travel", group: "pages", priority: 0.7 },
  { path: "/pilgrim-travel", group: "pages", priority: 0.7 },
  { path: "/forex", group: "pages", priority: 0.65 },
  { path: "/about", group: "pages", priority: 0.5 },
  { path: "/contact", group: "pages", priority: 0.5 },
  { path: "/pricing", group: "pages", priority: 0.4 },
  { path: "/privacy-policy", group: "pages", priority: 0.2 },
  { path: "/refund-policy", group: "pages", priority: 0.2 },
  { path: "/terms-and-conditions", group: "pages", priority: 0.2 },
];

function entry(
  path: string,
  group: SitemapUrl["group"],
  priority = 0.6,
  changefreq: SitemapUrl["changefreq"] = "weekly"
): SitemapUrl {
  return {
    path,
    loc: absoluteUrl(path),
    group,
    priority,
    changefreq,
    lastmod: new Date().toISOString().slice(0, 10),
  };
}

/** All indexable SEO URLs derived from catalogs + static pages. */
export function buildSitemapUrls(): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  const seen = new Set<string>();

  const add = (item: SitemapUrl) => {
    if (!item.path.startsWith("/")) return;
    if (item.path.includes("?")) return;
    if (seen.has(item.path)) return;
    // Block private / non-indexable areas
    if (
      item.path.startsWith("/booking") ||
      item.path.startsWith("/login") ||
      item.path.startsWith("/signup") ||
      item.path.startsWith("/dashboard") ||
      item.path.startsWith("/payment") ||
      item.path.startsWith("/thankyou")
    ) {
      return;
    }
    seen.add(item.path);
    urls.push(item);
  };

  for (const s of STATIC_INDEXABLE) {
    add(entry(s.path, s.group, s.priority, s.group === "pages" ? "monthly" : "weekly"));
  }

  for (const dest of seoDestinations) {
    add(entry(`/flights/to/${dest.slug}`, "flights", 0.7));
    add(entry(`/hotels/${dest.slug}`, "hotels", 0.7));
    add(entry(`/destinations/${dest.slug}`, "destinations", 0.75));
  }

  for (const route of seoRoutes) {
    add(entry(`/flights/from/${route.fromSlug}/to/${route.toSlug}`, "flights", 0.65));
  }

  for (const airline of seoAirlines) {
    add(entry(`/flights/airlines/${airline.slug}`, "airlines", 0.65));
  }

  for (const country of getSeoCountries()) {
    add(entry(`/flights/countries/${country.slug}`, "countries", 0.6));
    // Hotel country pages only when we have hotel destinations in that country
    if (seoDestinations.some((d) => d.countrySlug === country.slug)) {
      add(entry(`/hotels/countries/${country.slug}`, "countries", 0.6));
    }
  }

  for (const deal of seoDeals) {
    add(entry(`/deals/${deal.slug}`, "deals", 0.55));
  }

  return urls;
}

export function urlsByGroup(group: SitemapUrl["group"]) {
  return buildSitemapUrls().filter((u) => u.group === group);
}

export const SITEMAP_GROUPS: SitemapUrl["group"][] = [
  "flights",
  "hotels",
  "destinations",
  "airlines",
  "countries",
  "deals",
  "pages",
];
