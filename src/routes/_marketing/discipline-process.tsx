import { createFileRoute } from "@tanstack/react-router";
import { FaqList, Section, SectionTitle } from "@/components/marketing/sections";
import { LAST_UPDATED } from "@/lib/boards";
import { PROCESS_FAQS, PROCESS_STEPS } from "@/lib/faqs";
import { IMAGES } from "@/lib/images";
import { MORE_BOARDS, SITE } from "@/lib/site";
import { VideoEmbed } from "@/components/marketing/video-embed";

const URL = "https://nevadalicensedefense.com/discipline-process";
const TITLE = "How Nevada Licensing Board Discipline Works: Step by Step";

export const Route = createFileRoute("/_marketing/discipline-process")({
  head: () => ({
    meta: [
      { title: "Nevada Licensing Board Discipline Process, Step by Step | 702.893.4777" },
      { name: "description", content: "How a Nevada professional licensing board complaint works — from Notice of Investigation to hearing under NRS 233B, possible sanctions, and judicial review. By attorney Craig K. Perry." },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: "Complaint, investigation, settlement, formal hearing under NRS Chapter 233B, sanctions, and appeal — what Nevada licensed professionals should expect." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: GuidePage,
});



const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  url: URL,
  mainEntityOfPage: URL,
  datePublished: LAST_UPDATED,
  dateModified: LAST_UPDATED,
  image: `https://nevadalicensedefense.com${IMAGES.marbleColumnsFromBelow}`,
  author: { "@id": "https://nevadalicensedefense.com/#craig-perry", "@type": "Person", name: "Craig K. Perry", url: "https://craigperry.com" },
  publisher: { "@id": "https://nevadalicensedefense.com/#organization", "@type": "LegalService", name: "Nevada License Defense" },
  about: ["Nevada professional licensing board discipline", "NRS Chapter 233B", "Nevada Administrative Procedure Act"],
};
const stepsLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The Nevada professional licensing board discipline process",
  step: PROCESS_STEPS.map(([name, text], i) => ({ "@type": "HowToStep", position: i + 1, name, text })),
};
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PROCESS_FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};
const crumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nevadalicensedefense.com" },
    { "@type": "ListItem", position: 2, name: "Board Discipline Process", item: URL },
  ],
};

function GuidePage() {
  return (
    <>
      {[articleLd, stepsLd, faqLd, crumbLd].map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "340px" }}>
        <img src={IMAGES.marbleColumnsFromBelow} alt="Marble courthouse columns and carved ceiling seen from below" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-dark-blue/60" />
        <div className="relative z-10 max-w-3xl px-6 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">The Nevada Board Discipline Process</h1>
          <p className="text-lg text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">What happens after a licensing board complaint — step by step, from Notice of Investigation to appeal.</p>
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
            <p className="text-gray-800 leading-relaxed">
              Nevada licensing boards handle discipline in roughly eight stages: complaint, Notice of
              Investigation, investigation, committee review, settlement negotiations, a formal hearing
              under the Nevada Administrative Procedure Act (<strong>NRS Chapter 233B</strong>), a
              decision with any sanctions, and judicial review in district court under{" "}
              <strong>NRS 233B.130</strong>. Most cases resolve before a hearing. The licensee's first
              written response matters most — get a lawyer before sending it.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              By Craig K. Perry, Attorney at Law · Last updated <time dateTime={LAST_UPDATED}>November 12, 2026</time> · General information, not legal advice for your specific case.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <SectionTitle>Step by Step</SectionTitle>
        <ol className="max-w-3xl mx-auto space-y-8">
          {PROCESS_STEPS.map(([title, body], i) => (
            <li key={title} className="flex gap-5">
              <span className="flex-none flex h-10 w-10 items-center justify-center rounded-full bg-dark-blue text-gold font-bold">{i + 1}</span>
              <div>
                <h3 className="text-xl font-bold text-dark-blue mb-1">{title}</h3>
                <p className="text-gray-700 leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section variant="muted">
        <SectionTitle>Craig Explains the Complaint Process</SectionTitle>
        <VideoEmbed video={{ id: "wL8Z3KfIc1A", title: "The Complaint Process - Navigating Nursing Challenges with LV Nurse Attorney", uploadDate: "2023-09-30T17:33:33-07:00", seconds: 330 }} description="Attorney Craig K. Perry explains how a Nevada State Board of Nursing complaint moves from investigation to resolution." />
      </Section>

      <Section >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <img src={IMAGES.nurseKitchenTableLaptop} alt="Worried nurse in scrubs at her kitchen table with a laptop, notes and a mug" loading="lazy" className="w-full rounded-lg object-cover object-[58%_50%] shadow-md max-h-96" />
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-dark-blue">What to Do If You Just Got a Board Letter</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Don't call the investigator or the person who complained.</li>
              <li>Don't send a written response yet — note the deadline.</li>
              <li>Don't change, add to, or destroy any records.</li>
              <li>Write down your timeline while it's fresh, for your attorney only.</li>
              <li>Check your malpractice or license-defense insurance — many policies cover board matters.</li>
              <li>Call a Nevada license defense attorney before the deadline.</li>
            </ul>
            <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
          </div>
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>Board-Specific Guides</SectionTitle>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">The process above applies across Nevada's licensing boards. Each board has its own statute, regulations, and common complaints:</p>
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {[
            { to: "/nursing", label: "Board of Nursing", nrs: "NRS 632" },
            { to: "/pharmacy", label: "Board of Pharmacy", nrs: "NRS 639" },
            { to: "/medical", label: "Board of Medical Examiners", nrs: "NRS 630" },
            ...MORE_BOARDS,
          ].map((b) => (
            <a key={b.to} href={b.to} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-dark-blue hover:border-gold hover:text-gold transition-colors">
              {b.label} <span className="text-gray-500 font-normal">· {b.nrs}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle>Process FAQ</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <FaqList items={PROCESS_FAQS} />
        </div>
      </Section>

      <Section className="bg-dark-blue">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Get Help Before You Respond</h2>
          <p className="text-white/80 max-w-xl mx-auto">Craig K. Perry has practiced law in Nevada for over 31 years and handled hundreds of licensing board cases.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </Section>
    </>
  );
}
