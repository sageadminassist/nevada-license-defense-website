'use client';

import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { IMAGES } from "@/lib/images";
import { MORE_BOARDS, NAV_ITEMS, SITE } from "@/lib/site";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(e.target as Node)
      );
      if (isOutside && activeSubmenu) setActiveSubmenu(null);
    };
    if (activeSubmenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeSubmenu]);

  return (
    <>
      {/* Top bar: white background, dark logo centered */}
      <header className="bg-white animate-fade-in">
        <div className="section-container">
          <div className="flex items-center justify-between py-4">
            <div className="flex-1" />
            <Link to="/" className="flex items-center justify-center flex-1">
              <img
                src={IMAGES.logoDark}
                alt="Nevada License Defense Logo"
                className="h-20 md:h-24 lg:h-28 w-auto"
              />
            </Link>
            {/* Mobile hamburger */}
            <div className="flex-1 flex justify-end">
              <button
                className="lg:hidden p-2 text-gray-700"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <a
                href={SITE.phoneHref}
                className="flex items-center justify-center gap-2 bg-dark-blue text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all duration-300 shadow-md mb-4 mx-4"
              >
                <Phone className="w-5 h-5" />
                <span>{SITE.phoneDisplay}</span>
              </a>
              {NAV_ITEMS.map((item) => (
                <div key={item.to}>
                  <Link
                    to={item.to}
                    className="block py-3 text-gray-700 hover:text-dark-blue font-bold transition-colors duration-300 text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
              {/* More Boards mobile accordion */}
              <div>
                <button
                  onClick={() => setActiveSubmenu(activeSubmenu === "more-boards" ? null : "more-boards")}
                  className="w-full py-3 text-gray-700 hover:text-dark-blue font-bold transition-colors duration-300 text-center uppercase text-sm flex items-center justify-center gap-1"
                >
                  More Boards
                  <svg className={`w-3 h-3 transition-transform duration-200 ${activeSubmenu === "more-boards" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeSubmenu === "more-boards" && (
                  <div className="pb-2">
                    {MORE_BOARDS.map((board) => (
                      <Link
                        key={board.to}
                        to={board.to}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-gray-600 hover:text-dark-blue font-semibold text-sm text-center transition-colors duration-200"
                      >
                        {board.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-center">
                <a
                  href={SITE.mycaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="inline-block bg-gold text-dark-blue px-6 py-2 rounded-lg font-bold text-sm hover:bg-gold-dark transition-colors duration-300"
                >
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
          <div className="flex items-center justify-center flex-nowrap gap-x-4 xl:gap-x-6 py-4">
            {NAV_ITEMS.filter(i => i.to !== "/contact").map((item) => (
              <div
                key={item.to}
                className="relative flex-shrink-0"
                ref={(el) => { dropdownRefs.current[item.to] = el; }}
              >
                <Link
                  to={item.to}
                  className="text-gray-700 hover:text-dark-blue font-bold transition-colors duration-300 relative group uppercase text-sm whitespace-nowrap"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
                </Link>
              </div>
            ))}

            {/* More Boards dropdown */}
            <div
              className="relative flex-shrink-0"
              ref={(el) => { dropdownRefs.current["more-boards"] = el; }}
            >
              <button
                onClick={() => setActiveSubmenu(activeSubmenu === "more-boards" ? null : "more-boards")}
                className="flex items-center gap-1 text-gray-700 hover:text-dark-blue font-bold transition-colors duration-300 uppercase text-sm whitespace-nowrap"
              >
                More Boards
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${activeSubmenu === "more-boards" ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeSubmenu === "more-boards" && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-scale-in">
                  {MORE_BOARDS.map((board) => (
                    <Link
                      key={board.to}
                      to={board.to}
                      onClick={() => setActiveSubmenu(null)}
                      className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gold/10 hover:text-dark-blue transition-colors duration-200 font-semibold text-sm"
                    >
                      <span>{board.label}</span>
                      <span className="text-xs text-gray-400 ml-2 shrink-0">{board.nrs}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="relative flex-shrink-0">
              <Link
                to="/contact"
                className="text-gray-700 hover:text-dark-blue font-bold transition-colors duration-300 relative group uppercase text-sm whitespace-nowrap"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
              </Link>
            </div>

            {/* Phone CTA */}
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-2 bg-dark-blue text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all duration-300 ml-4 flex-shrink-0 whitespace-nowrap text-sm"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{SITE.phoneDisplay}</span>
            </a>

            {/* Client login */}
            <a
              href={SITE.mycaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-gold text-dark-blue px-4 py-2 rounded-lg font-bold text-sm hover:bg-gold-dark transition-colors duration-300 whitespace-nowrap"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
