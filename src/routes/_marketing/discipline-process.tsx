import { createFileRoute } from "@tanstack/react-router";
import { FaqList, Section, SectionTitle } from "@/components/marketing/sections";
import { LAST_UPDATED } from "@/lib/boards";
import { IMAGES } from "@/lib/images";
import { MORE_BOARDS, SITE } from "@/lib/site";

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

const STEPS: ReadonlyArray<readonly [string, string]> = [
  ["A complaint is filed", "Most cases start with a complaint from a patient, client, employer, coworker, insurer, or another agency. Boards also open cases on their own after malpractice reports, criminal arrests, failed drug screens, prescription monitoring (PMP) data, or a licensee's own disclosure on a renewal application."],
  ["You receive a Notice of Investigation", "The board notifies you in writing and usually asks for a written response, records, or an interview. Response deadlines are short — often around 14 days. This is the most important moment in the case: what you submit becomes evidence. Do not call the investigator or send a response before speaking with a license defense attorney."],
  ["The board investigates", "An investigator gathers records, interviews witnesses, and may request a mental, physical, or substance-use evaluation. Many boards also use outside expert reviewers to judge whether the standard of care was met."],
  ["A board committee reviews the file", "An investigative or screening committee decides what happens next. Typical options are dismissal, a non-disciplinary letter of warning or concern, or authorizing a formal complaint (also called an accusation or notice of charges)."],
  ["Settlement is negotiated — or not", "Most Nevada board cases resolve by agreement before a hearing, through a stipulation or consent agreement. Terms can include education, fines, monitoring, practice restrictions, or probation. A well-prepared defense often means lighter terms or a non-disciplinary outcome."],
  ["Formal hearing under NRS Chapter 233B", "If the case does not settle, it goes to a contested hearing governed by the Nevada Administrative Procedure Act (NRS Chapter 233B). You have the right to an attorney, to present evidence and witnesses, and to cross-examine the board's witnesses. The board, or a hearing officer, then issues written findings and a decision."],
  ["Decision and sanctions", "Possible outcomes range from dismissal to public reprimand, fines and costs, continuing education, probation with monitoring, practice limits, suspension, or revocation. Public discipline is generally posted on the board's website and, for health professionals, reported to the National Practitioner Data Bank (NPDB)."],
  ["Judicial review (appeal)", "A licensee who disagrees with a final decision can petition the Nevada district court for judicial review under NRS 233B.130. The petition generally must be filed within 30 days after the final decision is served, so the deadline is easy to miss."],
];

const FAQS: ReadonlyArray<readonly [string, string]> = [
  ["Can a Nevada licensing board suspend my license before a hearing?", "Yes, in limited cases. Under NRS 233B.127, a board can order an emergency (summary) suspension when it finds that public health, safety, or welfare requires immediate action. A prompt hearing must follow. Most investigations do not involve a summary suspension."],
  ["Is a Notice of Investigation the same as discipline?", "No. An investigation is not discipline, and many investigations end in dismissal or a non-disciplinary letter. How you respond at this stage strongly affects whether the case goes further."],
  ["Do I have to tell my employer about a board investigation?", "It depends on your license, your employment contract, and facility policies. Some obligations are mandatory; others are not. Ask your attorney before disclosing."],
  ["Will board discipline show up publicly?", "Formal discipline is generally public and appears on the board's license lookup. Dismissals and many non-disciplinary outcomes are not. Health-care discipline is also typically reported to the National Practitioner Data Bank."],
  ["How long does the Nevada board discipline process take?", "Anywhere from a few months to more than a year, depending on the board, the complexity of the allegations, expert review, and whether the case settles or goes to hearing."],
];

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  url: URL,
  mainEntityOfPage: URL,
  datePublished: LAST_UPDATED,
  dateModified: LAST_UPDATED,
  image: `https://nevadalicensedefense.com${IMAGES.signingContract}`,
  author: { "@id": "https://nevadalicensedefense.com/#craig-perry", "@type": "Person", name: "Craig K. Perry", url: "https://craigperry.com" },
  publisher: { "@id": "https://nevadalicensedefense.com/#organization", "@type": "LegalService", name: "Nevada License Defense" },
  about: ["Nevada professional licensing board discipline", "NRS Chapter 233B", "Nevada Administrative Procedure Act"],
};
const stepsLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The Nevada professional licensing board discipline process",
  step: STEPS.map(([name, text], i) => ({ "@type": "HowToStep", position: i + 1, name, text })),
};
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
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
        <img src={IMAGES.signingContract} alt="Professional reviewing and signing legal documents" className="absolute inset-0 w-full h-full object-cover object-center" />
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
          {STEPS.map(([title, body], i) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <img src={IMAGES.craigDefending} alt="Attorney Craig K. Perry defending a licensed professional at a hearing" loading="lazy" className="w-full rounded-lg object-cover shadow-md max-h-96" />
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

      <Section>
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

      <Section variant="muted">
        <SectionTitle>Process FAQ</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <FaqList items={FAQS} />
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
