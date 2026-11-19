'use client';

import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";

import { ACCUSATIONS, GROUPS } from "@/lib/accusations";
import { IMAGES } from "@/lib/images";
import { ALL_BOARDS, RESOURCES, SITE } from "@/lib/site";
import { SiteSearch } from "@/components/marketing/site-search";

type Item = { to: string; label: string; note?: string; group?: string };

const MENUS: { id: string; label: string; items: Item[]; columns: 1 | 2 | "grouped"; footer?: Item }[] = [
  {
    id: "boards",
    label: "Licensing Boards",
    columns: 2,
    items: ALL_BOARDS.map((b) => ({ to: b.to, label: b.label, note: b.nrs })),
  },
  {
    id: "accusations",
    label: "Accusations",
    columns: "grouped",
    items: [...ACCUSATIONS].sort((x, y) => GROUPS.indexOf(x.group) - GROUPS.indexOf(y.group)).map((a) => ({ to: `/accusations/${a.slug}`, label: a.nav, group: a.group })),
    footer: { to: "/accusations", label: "View all accusations →" },
  },
  {
    id: "resources",
    label: "Resources",
    columns: 1,
    items: RESOURCES.map((r) => ({ to: r.to, label: r.label, note: r.nrs || undefined })),
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setActiveSubmenu(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveSubmenu(null); };
    if (activeSubmenu) {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [activeSubmenu]);

  const toggle = (id: string) => setActiveSubmenu(activeSubmenu === id ? null : id);

  return (
    <>
      {/* Top bar: white background, dark logo centered */}
      <header className="bg-white animate-fade-in">
        <div className="section-container">
          <div className="flex items-center justify-between py-4">
            <div className="flex-1" />
            <Link to="/" className="flex items-center justify-center flex-1">
              <img src={IMAGES.logoDark} alt="Nevada License Defense Logo" className="h-20 md:h-24 lg:h-28 w-auto" />
            </Link>
            <div className="flex-1 flex justify-end">
              <button className="lg:hidden p-2 text-gray-700" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 max-h-[75vh] overflow-y-auto">
              <SiteSearch variant="bar" />
              <a href={SITE.phoneHref} className="flex items-center justify-center gap-2 bg-dark-blue text-white px-6 py-3 rounded-lg font-bold shadow-md mb-4 mx-4">
                <Phone className="w-5 h-5" />
                <span>{SITE.phoneDisplay}</span>
              </a>
              {MENUS.map((m) => (
                <div key={m.id}>
                  <button
                    onClick={() => toggle(m.id)}
                    className="w-full py-3 text-gray-700 hover:text-dark-blue font-bold uppercase text-sm flex items-center justify-center gap-1"
                  >
                    {m.label}
                    <Chevron open={activeSubmenu === m.id} />
                  </button>
                  {activeSubmenu === m.id && (
                    <div className="pb-2">
                      {[...m.items, ...(m.footer ? [m.footer] : [])].map((it, i, arr) => (
                        <Fragment key={it.to}>
                          {it.group && it.group !== arr[i - 1]?.group ? <p className="pt-3 pb-1 text-center text-[11px] font-bold uppercase tracking-wider text-gold-dark">{it.group}</p> : null}
                          <a href={it.to} onClick={() => setMobileOpen(false)} className="block py-2 text-gray-600 hover:text-dark-blue font-semibold text-sm text-center">
                            {it.label}
                          </a>
                        </Fragment>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href="/about" onClick={() => setMobileOpen(false)} className="block py-3 text-gray-700 hover:text-dark-blue font-bold uppercase text-sm text-center">
                About
              </a>
              <a href="/contact" onClick={() => setMobileOpen(false)} className="block py-3 text-gray-700 hover:text-dark-blue font-bold uppercase text-sm text-center">
                Contact
              </a>
              <div className="mt-3 flex justify-center">
                <a href={SITE.mycaseUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-gold text-dark-blue px-6 py-2 rounded-lg font-bold text-sm hover:bg-gold-dark transition-colors duration-300">
                  Client Login
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sticky nav bar */}
      <div className="hidden lg:block bg-white border-t border-gray-200 sticky top-0 z-[99] shadow-sm">
        <div className="section-container">
          <div ref={navRef} className="flex items-center justify-center flex-nowrap gap-x-5 xl:gap-x-8 py-4">
            {MENUS.map((m) => (
              <div key={m.id} className="relative flex-shrink-0">
                <button
                  onClick={() => toggle(m.id)}
                  aria-expanded={activeSubmenu === m.id}
                  className={`flex items-center gap-1 font-bold transition-colors duration-300 uppercase text-sm whitespace-nowrap ${activeSubmenu === m.id ? "text-dark-blue" : "text-gray-700 hover:text-dark-blue"}`}
                >
                  {m.label}
                  <Chevron open={activeSubmenu === m.id} />
                </button>
                {activeSubmenu === m.id && m.columns === "grouped" && (
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-[760px] bg-white rounded-lg shadow-xl border border-gray-200 p-5 z-50 animate-scale-in">
                    <div className="columns-3 gap-6">
                      {GROUPS.map((g) => (
                        <div key={g} className="break-inside-avoid mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-gold-dark mb-1.5 px-2">{g}</p>
                          {m.items.filter((it) => it.group === g).map((it) => (
                            <a key={it.to} href={it.to} onClick={() => setActiveSubmenu(null)} className="block rounded px-2 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gold/10 hover:text-dark-blue transition-colors">
                              {it.label}
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                    {m.footer ? (
                      <a href={m.footer.to} onClick={() => setActiveSubmenu(null)} className="block border-t border-gray-100 pt-3 px-2 text-sm font-bold text-gold-dark hover:text-dark-blue">
                        {m.footer.label}
                      </a>
                    ) : null}
                  </div>
                )}
                {activeSubmenu === m.id && m.columns !== "grouped" && (
                  <div
                    className={`absolute top-full mt-3 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-scale-in ${
                      m.columns === 2 ? "left-0 w-[620px] grid grid-cols-2 grid-rows-7 grid-flow-col" : "left-0 w-80"
                    }`}
                  >
                    {m.items.map((it) => (
                      <a
                        key={it.to}
                        href={it.to}
                        onClick={() => setActiveSubmenu(null)}
                        className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gold/10 hover:text-dark-blue transition-colors duration-200 font-semibold text-sm"
                      >
                        <span>{it.label}</span>
                        {it.note ? <span className="text-xs text-gray-400 ml-2 shrink-0">{it.note}</span> : null}
                      </a>
                    ))}
                    {m.footer ? (
                      <a href={m.footer.to} onClick={() => setActiveSubmenu(null)} className="block border-t border-gray-100 mt-1 px-4 pt-3 pb-1.5 text-sm font-bold text-gold-dark hover:text-dark-blue">
                        {m.footer.label}
                      </a>
                    ) : null}
                  </div>
                )}
              </div>
            ))}

            <a href="/about" className="text-gray-700 hover:text-dark-blue font-bold transition-colors duration-300 relative group uppercase text-sm whitespace-nowrap flex-shrink-0">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
            </a>

            <a href="/contact" className="text-gray-700 hover:text-dark-blue font-bold transition-colors duration-300 relative group uppercase text-sm whitespace-nowrap flex-shrink-0">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
            </a>

            <a href={SITE.phoneHref} className="flex items-center gap-2 bg-dark-blue text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all duration-300 ml-4 flex-shrink-0 whitespace-nowrap text-sm">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{SITE.phoneDisplay}</span>
            </a>

            <a href={SITE.mycaseUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 bg-gold text-dark-blue px-4 py-2 rounded-lg font-bold text-sm hover:bg-gold-dark transition-colors duration-300 whitespace-nowrap">
              Login
            </a>

            <SiteSearch />
          </div>
        </div>
      </div>
    </>
  );
}
