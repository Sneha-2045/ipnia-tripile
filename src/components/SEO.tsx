import { useEffect } from "react";
import { SITE_ORIGIN } from "@/lib/seo/site";

type SEOProps = {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const setMetaTag = (name: string, content: string, isProperty = false) => {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    if (isProperty) {
      element.setAttribute("property", name);
    } else {
      element.setAttribute("name", name);
    }
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setCanonical = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);
};

const SEO = ({ title, description, path, keywords, image, jsonLd }: SEOProps) => {
  useEffect(() => {
    const fullTitle = title.includes("IPNIA") ? title : `${title} | IPNIA`;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    // Always canonicalize to production HTTPS host (no www / query duplicates)
    const canonicalUrl = `${SITE_ORIGIN}${normalizedPath.split("?")[0]}`;
    const ogImage = image
      ? image.startsWith("http")
        ? image
        : `${SITE_ORIGIN}${image}`
      : `${SITE_ORIGIN}/assets/ipnia/china-business-tour.jpg`;

    document.title = fullTitle;
    setMetaTag("description", description);
    setMetaTag("robots", "index, follow");
    setMetaTag("author", "Ipnia Services Pvt Ltd");
    if (keywords) {
      setMetaTag("keywords", keywords);
    }

    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:type", "website", true);
    setMetaTag("og:url", canonicalUrl, true);
    setMetaTag("og:image", ogImage, true);

    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", ogImage);

    setCanonical(canonicalUrl);

    const scriptId = "ipnia-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [title, description, path, keywords, image, jsonLd]);

  return null;
};

export default SEO;
