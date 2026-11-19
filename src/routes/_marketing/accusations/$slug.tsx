import { createFileRoute, notFound } from "@tanstack/react-router";
import { FaqList, Section, SectionTitle } from "@/components/marketing/sections";
import { ACCUSATION_BY_SLUG, ACCUSATIONS } from "@/lib/accusations";
import { BOARDS, LAST_UPDATED } from "@/lib/boards";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";
import { VideoEmbed } from "@/components/marketing/video-embed";

const BASE = "https://nevadalicensedefense.com";

export const Route = createFileRoute("/_marketing/accusations/$slug")({
  loader: ({ params }) => {
    const a = ACCUSATION_BY_SLUG[params.slug];
    if (!a) throw notFound();
    return a;
  },
  head: ({ params }) => {
    const a = ACCUSATION_BY_SLUG[params.slug];
    if (!a) return {};
    const url = `${BASE}/accusations/${a.slug}`;
    return {
      meta: [
        { title: `${a.title} | 702.893.4777` },
        { name: "description", content: a.description },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: `${BASE}${IMAGES[a.image as keyof typeof IMAGES]}` },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: AccusationPage,
});

function AccusationPage() {
  const a = Route.useLoaderData();
  const url = `${BASE}/accusations/${a.slug}`;
  const img = IMAGES[a.image as keyof typeof IMAGES];

  const lds = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.h1,
      description: a.description,
      url,
      mainEntityOfPage: url,
      image: `${BASE}${img}`,
      datePublished: LAST_UPDATED,
      dateModified: LAST_UPDATED,
      author: { "@type": "Person", "@id": `${BASE}/#craig-perry`, name: "Craig K. Perry", url: "https://craigperry.com" },
      publisher: { "@type": "LegalService", "@id": `${BASE}/#organization`, name: "Nevada License Defense" },
      about: a.boards.map((s) => ({ "@type": "GovernmentOrganization", name: BOARDS[s].board })),
      spatialCoverage: { "@type": "State", name: "Nevada" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: a.faqs.map(([q, ans]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: ans } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Accusations", item: `${BASE}/accusations` },
        { "@type": "ListItem", position: 3, name: a.nav, item: url },
      ],
    },
  ];

  const others = ACCUSATIONS.filter((x) => x.slug !== a.slug);

  return (
    <>
      {lds.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "340px" }}>
        <img src={img} alt={a.imageAlt} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: a.imagePos ?? "50% 30%" }} />
        <div className="absolute inset-0 bg-dark-blue/60" />
        <div className="relative z-10 max-w-3xl px-6 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">Nevada License Defense · {a.nav}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">{a.h1}</h1>
          <div className="flex justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="section-container py-8">
          <div className="max-w-4xl mx-auto border-l-4 border-gold pl-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-1">Quick answer</p>
            <p className="text-gray-800 leading-relaxed">{a.answer}</p>
            <p className="mt-2 text-xs text-gray-500">
              By Craig K. Perry, Attorney at Law · Last updated <time dateTime={LAST_UPDATED}>November 2026</time> · General information, not legal advice for your specific case.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-dark-blue mb-4">How This Allegation Shows Up</h2>
            <ul className="space-y-2 text-gray-700 list-disc pl-5">
              {a.forms.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-dark-blue mb-4">How Nevada Boards Handle It</h2>
            <p className="text-gray-700 leading-relaxed">{a.process}</p>
            <p className="mt-4 text-sm text-gray-500">
              See the full <a href="/discipline-process" className="font-semibold text-dark-blue underline">Nevada board discipline process, step by step</a>.
            </p>
          </div>
        </div>
      </Section>

      <Section variant="muted">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-dark-blue mb-4">How We Defend These Cases</h2>
            <ul className="space-y-3">
              {a.defense.map((d) => (
                <li key={d} className="flex gap-3 text-gray-700"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-gold" />{d}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-dark-blue mb-4">What to Do Right Now</h2>
            <ol className="space-y-3 list-decimal pl-5 text-gray-700">
              {a.now.map((n) => <li key={n}>{n}</li>)}
            </ol>
            <a href={SITE.phoneHref} className="btn-primary inline-block mt-6">Call {SITE.phoneDisplay}</a>
          </div>
        </div>
      </Section>

      {a.video ? (
        <Section>
          <SectionTitle>Craig Explains</SectionTitle>
          <VideoEmbed video={a.video} description={a.description} />
        </Section>
      ) : null}

      <Section>
        <SectionTitle>Licensing Boards That Handle This</SectionTitle>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {a.boards.map((s) => (
            <a key={s} href={`/${s}`} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-dark-blue hover:border-gold hover:text-gold transition-colors">
              {BOARDS[s].board} <span className="text-gray-500 font-normal">· {BOARDS[s].nrs.replace("Chapter ", "")}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>{a.nav} FAQ</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <FaqList items={a.faqs} />
        </div>
      </Section>

      <Section>
        <SectionTitle>Other Accusations We Defend</SectionTitle>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {others.map((o) => (
            <a key={o.slug} href={`/accusations/${o.slug}`} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-dark-blue hover:bg-gold/20 transition-colors">{o.nav}</a>
          ))}
        </div>
      </Section>

      <Section className="bg-dark-blue">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Facing This Accusation? Call Before You Respond.</h2>
          <p className="text-white/80 max-w-xl mx-auto">Craig K. Perry has practiced law in Nevada for over 31 years and handled hundreds of licensing board cases. {SITE.consultation}</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </Section>
    </>
  );
}
