import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { IMAGES } from "@/lib/images";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  full?: boolean;
  children?: ReactNode;
}

export function SiteHeader({ full = false, children }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "relative flex items-start justify-center pt-12",
        full ? "min-h-screen" : "min-h-[60vh]",
      )}
    >
      {/* Mountain backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={IMAGES.heroBackground}
          alt="Nevada mountain landscape"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-deep/70" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-6 pb-8 text-center">
        {/* Logo */}
        <Link to="/" className="inline-block">
          <img
            src={IMAGES.logoWhite}
            alt="Nevada License Defense Logo"
            className="mb-1 w-full max-w-[280px] transition-transform duration-300 hover:scale-[1.02]"
          />
        </Link>

        {/* Attribution */}
        <p className="text-xs text-white/60 tracking-wide">
          Part of{" "}
          <a
            href={SITE.firmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/80 hover:text-gold underline-offset-2 hover:underline"
          >
            Craig K. Perry &amp; Associates
          </a>{" "}
          &middot; {SITE.firmUrl.replace("https://", "")}
        </p>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="mt-2 hidden lg:block">
          <ul className="flex flex-nowrap items-center justify-center gap-x-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.1em] text-gold drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-white [&.active]:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={SITE.mycaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "5px 14px",
                  background: "#d69b4c",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: "6px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#b8803a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#d69b4c")}
              >
                Login
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="mt-2 flex items-center gap-2 lg:hidden"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#d69b4c" }}
        >
          <Menu size={24} />
          <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Menu
          </span>
        </button>

        {/* Mobile drawer */}
        <nav
          aria-label="Mobile navigation"
          aria-hidden={!mobileOpen}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "#1a2332f5",
            backdropFilter: "blur(10px)",
            zIndex: 200,
            padding: "48px 0 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? "translateY(0)" : "translateY(-12px)",
            pointerEvents: mobileOpen ? "auto" : "none",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute", top: "20px", right: "24px",
              background: "none", border: "none", cursor: "pointer",
              color: "#d69b4c", display: "flex", alignItems: "center",
              gap: "6px", fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}
          >
            <X size={20} /> Close
          </button>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
            {NAV_ITEMS.map((item) => (
              <li key={item.to} style={{ width: "100%" }}>
                <Link
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block", padding: "14px 32px",
                    color: "#d69b4c", fontSize: "13px", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    textDecoration: "none", textAlign: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    transition: "color 0.2s, background 0.2s",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li style={{ padding: "16px 32px", width: "100%", display: "flex", justifyContent: "center" }}>
              <a
                href={SITE.mycaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "inline-block", padding: "10px 28px",
                  background: "#d69b4c", color: "#fff",
                  fontSize: "13px", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  borderRadius: "6px", textDecoration: "none",
                }}
              >
                Login
              </a>
            </li>
          </ul>
        </nav>

        {children ? <div className="mt-8 flex flex-col items-center gap-4">{children}</div> : null}
      </div>
    </header>
  );
}
