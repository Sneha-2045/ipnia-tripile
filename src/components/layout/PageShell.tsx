import { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`ipnia-page ${className}`}>
      <SiteNav />
      <main className="pt-[4.25rem]">{children}</main>
      <SiteFooter />
    </div>
  );
}
