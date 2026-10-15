import type { ReactNode } from "react";
import SEO from "@/components/SEO";

export type LegalSection = { title: string; content: ReactNode };

export function LegalPage({ title, description, path, updated = "October 15, 2026", sections }: {
  title: string; description: string; path: string; updated?: string; sections: LegalSection[];
}) {
  return (
    <main className="ipnia-page min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12 text-[#18324b] sm:px-6 lg:px-8">
      <SEO title={title} description={description} path={path} />
      <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
        <header className="mb-9 border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">Ipnia legal</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: {updated}</p>
        </header>
        <div className="space-y-8 text-[15px] leading-7 text-slate-700">
          {sections.map((section, index) => (
            <section key={section.title} aria-labelledby={`legal-section-${index}`}>
              <h2 id={`legal-section-${index}`} className="mb-2 text-xl font-bold text-amber-800">{section.title}</h2>
              <div className="space-y-3">{section.content}</div>
            </section>
          ))}
          <p className="border-t border-slate-200 pt-5 text-sm text-slate-600">
            Ipnia Services Pvt Ltd · <a className="underline hover:text-amber-800" href="mailto:Help@ipnia.com">Help@ipnia.com</a> · +91 11 4553 4440 · A199 Gujranwala Town Part 01, Delhi 110009, India
          </p>
        </div>
      </article>
    </main>
  );
}

export function Paragraphs({ children }: { children: ReactNode[] }) {
  return <>{children.map((text, index) => <p key={index}>{text}</p>)}</>;
}

export function Bullets({ items }: { items: string[] }) {
  return <ul className="list-disc space-y-1 pl-6">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
