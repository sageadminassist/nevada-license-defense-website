import { FaqList, Section, SectionTitle } from "@/components/marketing/sections";
import { BOARDS, LAST_UPDATED } from "@/lib/boards";
import { SITE } from "@/lib/site";

const BASE = "https://nevadalicensedefense.com";
const updatedLabel = new Date(LAST_UPDATED + "T12:00:00").toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function Ld({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** Short, quotable answer block placed right under the hero. */
export function BoardAnswer({ slug }: { slug: string }) {
  const b = BOARDS[slug];
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="section-container py-8">
        <div className="max-w-4xl mx-auto border-l-4 border-gold pl-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-1">Quick answer</p>
          <p className="text-gray-800 leading-relaxed">
            The <strong>{b.board}</strong> licenses and disciplines {b.pros}
            {b.nrs.startsWith("NRS") ? <> under <strong>{b.nrs}</strong></> : null}. Contested
            disciplinary cases follow the Nevada Administrative Procedure Act (NRS Chapter 233B).
            If you receive a complaint, investigator call, or Notice of Investigation, do not respond
            until you speak with a lawyer. Craig K. Perry of Craig K. Perry &amp; Associates in Las
            Vegas has defended Nevada licensed professionals for over 31 years — free consultation
            at <a href={SITE.phoneHref} className="font-semibold text-dark-blue underline">{SITE.phoneDisplay}</a>.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            By Craig K. Perry, Attorney at Law · Last updated <time dateTime={LAST_UPDATED}>{updatedLabel}</time>
          </p>
        </div>
      </div>
    </section>
  );
}

/** FAQ section + FAQPage, BreadcrumbList, and LegalService JSON-LD. */
export function BoardFaq({
  slug,
  title,
  faqs,
  hideSection = false,
}: {
  slug: string;
  title: string;
  faqs?: ReadonlyArray<readonly [string, string]>;
  hideSection?: boolean;
}) {
  const b = BOARDS[slug];
  const items = faqs ? [...faqs, ...b.faqs] : b.faqs;
  const url = `${BASE}/${slug}`;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: title, item: url },
    ],
  };
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${url}#service`,
    name: `${title} | Nevada License Defense`,
    url,
    telephone: "+1-702-893-4777",
    serviceType: `${b.short} license defense`,
    areaServed: ["Las Vegas", "Henderson", "Reno", "Carson City", "North Las Vegas", "Nevada"].map(
      (n) => ({ "@type": n === "Nevada" ? "State" : "City", name: n }),
    ),
    address: {
      "@type": "PostalAddress",
      streetAddress: "2300 W Sahara Ave #800",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      postalCode: "89102",
      addressCountry: "US",
    },
    dateModified: LAST_UPDATED,
    provider: { "@id": `${BASE}/#craig-perry` },
    about: { "@type": "GovernmentOrganization", name: b.board },
    knowsAbout: [b.nrs, b.board, "NRS Chapter 233B", "Professional license defense"],
  };

  return (
    <>
      <Ld data={faqLd} />
      <Ld data={crumbLd} />
      <Ld data={serviceLd} />
      {hideSection ? null : (
        <Section variant="muted">
          <SectionTitle>{title} FAQ</SectionTitle>
          <div className="max-w-3xl mx-auto">
            <FaqList items={items} />
          </div>
        </Section>
      )}
    </>
  );
}

/** Portrait of Craig with a client + short trust copy. */
export function CraigBlock({ src, alt }: { src: string; alt: string }) {
  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 items-center max-w-5xl mx-auto">
        <img src={src} alt={alt} loading="lazy" className="w-full h-[460px] rounded-lg object-cover object-[50%_25%] shadow-md" />
        <div className="space-y-4 text-gray-700">
          <h2 className="text-3xl font-bold text-dark-blue">You Work Directly With Craig</h2>
          <p className="text-lg">Your case isn't handed off to a junior associate. Craig K. Perry personally reviews your situation, prepares your response, and stands beside you at every interview and hearing.</p>
          <p>Over 31 years he has defended Nevada licensed professionals before licensing boards across the state — and he knows how investigators, board staff, and hearing officers think.</p>
          <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
          <a href={SITE.phoneHref} className="btn-primary inline-block">Call {SITE.phoneDisplay}</a>
        </div>
      </div>
    </Section>
  );
}
