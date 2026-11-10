import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "muted";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "px-8 py-16",
        variant === "muted" ? "bg-muted" : "bg-background",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionTitle({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: "h1" | "h2";
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "mb-8 font-heading font-bold text-navy",
        Tag === "h1" ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function ServiceCard({
  title,
  children,
  href,
}: {
  title: ReactNode;
  children: ReactNode;
  href?: string;
}) {
  return (
    <div className="rounded-lg bg-card p-8 shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      <h3 className="mb-4 font-heading text-2xl text-navy">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
      {href ? (
        <div className="mt-4">
          <a
            href={href}
            className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-[0.1em] text-gold hover:text-gold-dark"
          >
            Learn More
          </a>
        </div>
      ) : null}
    </div>
  );
}

export function ServiceGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

export function FaqList({
  items,
}: {
  items: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-lg bg-card shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      {items.map(([q, a]) => (
        <details key={q} className="group p-6">
          <summary className="flex cursor-pointer items-center justify-between gap-4 font-heading text-lg text-navy marker:content-none">
            {q}
            <span className="text-gold transition-transform duration-200 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-4 text-muted-foreground">{a}</p>
        </details>
      ))}
    </div>
  );
}
