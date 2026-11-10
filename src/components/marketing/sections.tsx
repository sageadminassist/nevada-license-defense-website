import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "muted" | "dark";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "section-padding",
        variant === "muted" && "bg-gray-50",
        variant === "dark" && "bg-dark-blue text-white",
        variant === "default" && "bg-white",
        className,
      )}
    >
      <div className="section-container">{children}</div>
    </section>
  );
}

export function SectionTitle({
  as: Tag = "h2",
  children,
  className,
  light = false,
}: {
  as?: "h1" | "h2";
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "mb-8 font-bold text-center animate-slide-up",
        Tag === "h1" ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl",
        light ? "text-white" : "text-dark-blue",
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
  icon,
  image,
  imageAlt,
}: {
  title: ReactNode;
  children: ReactNode;
  href?: string;
  icon?: ReactNode;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <div className="group bg-white rounded-lg shadow-lg p-8 hover-lift flex flex-col">
      {icon && (
        <div className="mb-4 flex justify-center">{icon}</div>
      )}
      <h3 className="text-xl font-bold text-dark-blue mb-4">{title}</h3>
      <p className="text-gray-600 mb-6 flex-1">{children}</p>
      {href && (
        <a
          href={href}
          className="text-dark-blue font-bold hover:text-gold transition-colors duration-300 inline-flex items-center group mb-4"
        >
          Learn More
          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
      {image && (
        <div className="mt-auto overflow-hidden rounded-lg shadow-md">
          <img
            src={image}
            alt={imageAlt ?? String(title)}
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

export function ServiceGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", className)}>
      {children}
    </div>
  );
}

export function FaqList({
  items,
}: {
  items: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div className="space-y-0 divide-y divide-gray-200">
      {items.map(([q, a]) => (
        <div key={q} className="py-6">
          <h3 className="text-lg font-bold text-dark-blue mb-2">{q}</h3>
          <p className="text-gray-700 leading-relaxed">{a}</p>
        </div>
      ))}
    </div>
  );
}
