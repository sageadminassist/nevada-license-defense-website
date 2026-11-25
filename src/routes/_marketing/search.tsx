import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Section, SectionTitle } from "@/components/marketing/sections";
import { trackSearch } from "@/lib/analytics";
import { searchSite } from "@/lib/search-index";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/search")({
  head: () => ({
    meta: [
      { title: "Search | Nevada License Defense" },
      { name: "description", content: "Search Nevada License Defense — licensing boards, accusations, and FAQs." },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  useEffect(() => {
    setQ(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);
  const results = useMemo(() => searchSite(q, 50), [q]);
  useEffect(() => trackSearch(q, results.length), [q, results.length]);

  return (
    <Section>
      <SectionTitle as="h1">Search the Site</SectionTitle>
      <form
        className="max-w-2xl mx-auto relative"
        onSubmit={(e) => { e.preventDefault(); history.replaceState(null, "", `/search?q=${encodeURIComponent(q)}`); }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search boards, accusations, FAQs…"
          className="w-full rounded-full border border-gray-300 py-3.5 pl-12 pr-4 text-base shadow-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
          aria-label="Search query"
        />
      </form>
      <div className="max-w-3xl mx-auto mt-8">
        {q.trim() ? (
          <p className="mb-4 text-sm text-gray-500">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>
        ) : null}
        <ul className="divide-y divide-gray-200">
          {results.map((r) => (
            <li key={r.url + r.title} className="py-4">
              <a href={r.url} className="group block">
                <span className="rounded bg-dark-blue/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dark-blue">{r.type}</span>
                <span className="mt-1 block text-lg font-bold text-dark-blue group-hover:text-gold">{r.title}</span>
                <span className="mt-1 block text-gray-600 line-clamp-2">{r.snippet}</span>
              </a>
            </li>
          ))}
        </ul>
        {q.trim() && !results.length ? (
          <p className="text-center text-gray-600 py-8">No results. Try another word, or call <a href={SITE.phoneHref} className="font-semibold text-dark-blue">{SITE.phoneDisplay}</a>.</p>
        ) : null}
      </div>
    </Section>
  );
}
