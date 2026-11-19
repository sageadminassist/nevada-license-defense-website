import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/marketing/sections";
import { ACCUSATIONS, GROUPS } from "@/lib/accusations";
import { SITE } from "@/lib/site";

const URL = "https://nevadalicensedefense.com/accusations";

export const Route = createFileRoute("/_marketing/accusations/")({
  head: () => ({
    meta: [
      { title: "Common Accusations Against Nevada Licensed Professionals | 702.893.4777" },
      { name: "description", content: "Drug diversion, DUI, overprescribing, charting errors, patient harm, boundary violations, impairment, CE audits, license denials and reinstatement — how Nevada boards handle each and how Craig K. Perry defends them." },
      { property: "og:title", content: "Common Accusations Against Nevada Licensed Professionals" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: AccusationsIndex,
});

const listLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Common accusations against Nevada licensed professionals",
  itemListElement: ACCUSATIONS.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.nav, url: `${URL}/${a.slug}` })),
};

function AccusationsIndex() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <Section>
        <SectionTitle as="h1">Common Accusations We Defend</SectionTitle>
        <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          Nevada licensing boards investigate the same kinds of complaints again and again. Find yours below — each guide explains how the
          allegation arises, how Nevada boards handle it, and what to do right now.
        </p>
        <div className="max-w-6xl mx-auto space-y-12">
          {GROUPS.map((g) => (
            <div key={g}>
              <h2 className="text-2xl font-bold text-dark-blue mb-5 border-b border-gray-200 pb-2">{g}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ACCUSATIONS.filter((a) => a.group === g).map((a) => (
                  <a key={a.slug} href={`/accusations/${a.slug}`} className="group rounded-lg border border-gray-200 border-t-4 border-t-gold bg-white shadow-sm hover:shadow-lg transition-shadow">
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-dark-blue group-hover:text-gold transition-colors">{a.nav}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-3">{a.description.replace(/ ?(Free consultation — |Confidential consultation — |Craig K\. Perry — free consultation, )?702\.893\.4777\.?$/, "")}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href={SITE.phoneHref} className="btn-primary">Call {SITE.phoneDisplay}</a>
        </div>
      </Section>
    </>
  );
}
