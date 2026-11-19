import { createFileRoute } from "@tanstack/react-router";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { Section, SectionTitle } from "@/components/marketing/sections";
import { CraigBlock } from "@/components/marketing/board-ai";
import { IMAGES } from "@/lib/images";
import { FAQ_COUNT, FAQ_GROUPS } from "@/lib/faqs";
import { slugify } from "@/lib/search-index";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Nevada License Defense | Craig K. Perry" },
      {
        name: "description",
        content:
          "Over 100 answers about Nevada professional license defense — board investigations, drug diversion, DUI, probation, reinstatement, and every Nevada health licensing board. Searchable FAQ by Craig K. Perry & Associates.",
      },
      { property: "og:title", content: "FAQ | Nevada License Defense | Craig K. Perry" },
      {
        property: "og:description",
        content:
          "Questions about a Nevada licensing board complaint? Find answers here — or call Craig K. Perry at 702.893.4777 for a free consultation.",
      },
      { property: "og:url", content: "https://nevadalicensedefense.com/faq" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/faq" }],
  }),
  component: FaqRoute,
});

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? <mark key={i} className="bg-gold/30 text-inherit rounded px-0.5">{part}</mark> : part,
      )}
    </>
  );
}

function FaqRoute() {
  const [query, setQuery] = useState("");
  const terms = useMemo(() => query.toLowerCase().split(/\s+/).filter((t) => t.length > 1), [query]);
  const groups = useMemo(() => {
    if (!terms.length) return FAQ_GROUPS;
    return FAQ_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => {
        const hay = `${i.q} ${i.a}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      }),
    })).filter((g) => g.items.length);
  }, [terms]);
  const shown = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Section>
        <SectionTitle as="h1">Frequently Asked Questions</SectionTitle>
        <p className="mb-8 max-w-3xl mx-auto text-lg text-gray-600 text-center">
          {FAQ_COUNT} answers about Nevada professional license defense — from your first board letter to hearings,
          probation, and reinstatement.
        </p>

        <div className="max-w-3xl mx-auto sticky top-[72px] z-20 bg-white/95 backdrop-blur py-3">
          <label className="relative block">
            <span className="sr-only">Search the FAQ</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions — e.g. DUI, drug test, probation, self-report"
              className="w-full rounded-full border border-gray-300 bg-white py-3.5 pl-12 pr-12 text-base shadow-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark-blue" aria-label="Clear search">
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </label>
          <p className="mt-2 text-center text-sm text-gray-500">
            {terms.length ? `${shown} of ${FAQ_COUNT} questions match` : (
              <span className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                {FAQ_GROUPS.map((g) => (
                  <a key={g.id} href={`#${g.id}`} className="font-semibold text-dark-blue hover:text-gold">{g.title}</a>
                ))}
              </span>
            )}
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-8 space-y-12">
          {groups.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-40">
              <h2 className="text-2xl font-bold text-dark-blue mb-4 border-b-2 border-gold pb-2">{g.title}</h2>
              <div className="divide-y divide-gray-200">
                {g.items.map((i) => (
                  <details key={i.q} id={slugify(i.q)} open={terms.length > 0} className="group scroll-mt-40 py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-bold text-dark-blue hover:text-gold">
                      <span><Highlight text={i.q} terms={terms} /></span>
                      <span className="mt-1 flex-none text-gold transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                    </summary>
                    <p className="mt-3 text-gray-700 leading-relaxed"><Highlight text={i.a} terms={terms} /></p>
                    {i.source ? (
                      <a href={i.source.to} className="mt-2 inline-block text-sm font-semibold text-gold-dark hover:text-dark-blue">
                        More on {i.source.label} →
                      </a>
                    ) : null}
                  </details>
                ))}
              </div>
            </div>
          ))}
          {!shown ? (
            <div className="text-center text-gray-600 py-10">
              <p className="text-lg">No questions match “{query}”.</p>
              <p className="mt-2">Try another word — or call <a href={SITE.phoneHref} className="font-semibold text-dark-blue">{SITE.phoneDisplay}</a> and ask Craig directly.</p>
            </div>
          ) : null}
        </div>
      </Section>

      <CraigBlock src={IMAGES.craigMeetingClient4} alt="Craig K. Perry greeting a client in his Las Vegas office" />

      <Section variant="dark">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Still have questions?</h2>
          <p className="max-w-xl text-lg text-white/80">
            Every situation is different. Call Craig K. Perry for a free 30–45 minute
            consultation.
          </p>
          <a
            href={SITE.phoneHref}
            className="text-3xl font-bold text-gold hover:text-white transition-colors duration-300 transform hover:scale-110"
          >
            {SITE.phoneDisplay}
          </a>
          <a href={SITE.phoneHref} className="btn-gold mt-2">Call Now — Free Consultation</a>
        </div>
      </Section>
    </>
  );
}
