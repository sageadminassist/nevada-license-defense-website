'use client';

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { trackSearch } from "@/lib/analytics";
import { searchSite } from "@/lib/search-index";

const SUGGESTIONS = ["Notice of Investigation", "drug diversion", "DUI", "probation", "reinstatement", "self-report", "pharmacy", "marijuana"];

/** Header search button + full-site search dialog (Cmd/Ctrl+K). */
export function SiteSearch({ variant = "icon" }: { variant?: "icon" | "bar" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const results = useMemo(() => searchSite(q, 10), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 30);
    } else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => trackSearch(q, results.length), [q, results.length]);

  const go = (url: string) => { window.location.href = url; };

  return (
    <>
      {variant === "icon" ? (
        <button type="button" onClick={() => setOpen(true)} aria-label="Search the site" title="Search (Ctrl+K)" className="flex-shrink-0 rounded-lg p-2 text-gray-700 hover:bg-gray-100 hover:text-dark-blue transition-colors">
          <Search className="h-5 w-5" />
        </button>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="mx-4 mb-4 flex w-[calc(100%-2rem)] items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-gray-500">
          <Search className="h-5 w-5" /> Search the site…
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-dark-blue/60 backdrop-blur-sm px-4 pt-[10vh]" onMouseDown={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Search the site">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl animate-scale-in" onMouseDown={(e) => e.stopPropagation()}>
            <form
              className="flex items-center gap-3 border-b border-gray-200 px-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (results[active]) go(results[active].url);
                else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
              }}
            >
              <Search className="h-5 w-5 flex-none text-gray-400" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                }}
                placeholder="Search boards, accusations, FAQs…"
                className="flex-1 py-4 text-lg outline-none"
                aria-label="Search query"
              />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close search" className="text-gray-400 hover:text-dark-blue"><X className="h-5 w-5" /></button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto">
              {!q.trim() ? (
                <div className="p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-dark-blue hover:bg-gold/20">{s}</button>
                    ))}
                  </div>
                </div>
              ) : results.length ? (
                <ul className="py-2">
                  {results.map((r, i) => (
                    <li key={r.url + r.title}>
                      <a
                        href={r.url}
                        onMouseEnter={() => setActive(i)}
                        className={`block px-5 py-3 ${i === active ? "bg-gold/10" : ""}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="rounded bg-dark-blue/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dark-blue">{r.type}</span>
                          <span className="font-bold text-dark-blue line-clamp-1">{r.title}</span>
                        </span>
                        <span className="mt-1 block text-sm text-gray-600 line-clamp-2">{r.snippet}</span>
                      </a>
                    </li>
                  ))}
                  <li className="border-t border-gray-100 px-5 py-3 text-sm">
                    <a href={`/search?q=${encodeURIComponent(q.trim())}`} className="font-semibold text-gold-dark hover:text-dark-blue">See all results for “{q.trim()}” →</a>
                  </li>
                </ul>
              ) : (
                <p className="p-6 text-gray-600">No results for “{q}”. Try another word, or call <a href="tel:7028934777" className="font-semibold text-dark-blue">702.893.4777</a>.</p>
              )}
            </div>
            <div className="hidden sm:flex justify-between border-t border-gray-100 bg-gray-50 px-5 py-2 text-xs text-gray-500">
              <span>↑ ↓ to navigate · Enter to open</span><span>Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
