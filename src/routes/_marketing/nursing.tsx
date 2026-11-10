import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/marketing/site-header";
import {
  FaqList,
  Section,
  SectionTitle,
  ServiceCard,
  ServiceGrid,
} from "@/components/marketing/sections";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/nursing")({
  head: () => ({
    meta: [
      { title: "Nevada State Board of Nursing Defense | Craig K. Perry | 702.893.4777" },
      {
        name: "description",
        content:
          "Defense before the Nevada State Board of Nursing (NSBN) for RNs, LPNs, NPs, and APRNs. Craig K. Perry has 31+ years defending nurses statewide. Free consultation.",
      },
      {
        property: "og:title",
        content: "Nevada State Board of Nursing Defense | Craig K. Perry",
      },
      {
        property: "og:description",
        content:
          "Facing an NSBN complaint or investigation? Craig K. Perry defends nurses before the Nevada State Board of Nursing. Free consultation — 702.893.4777.",
      },
      { property: "og:url", content: "https://nevadalicensedefense.com/nursing" },
      { property: "og:image", content: "https://nevadalicensedefense.com/images/nvboardofnursing.avif" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/nursing" }],
  }),
  component: NursingRoute,
});

const SERVICES = [
  ["Investigations & Complaints", "Representation during NSBN investigations and complaints, including responding to Letters of Inquiry and negotiating settlements."],
  ["Unprofessional Conduct", "Defense against allegations such as HIPAA violations, scope-of-practice violations, patient boundary issues, and neglect claims."],
  ["Substance & Drug Diversion", "Support for nurses facing substance-abuse accusations or medication diversion allegations, including challenging drug-test results."],
  ["Formal & Informal Hearings", "Defense at hearings before the Nevada State Board of Nursing — both formal evidentiary hearings and informal settlement hearings."],
  ["Monitoring & Probation", "Reviewing monitoring agreements, defending probation violations, and resolving continuing-education audit deficiencies."],
  ["Criminal Matters", "Defense when criminal charges, DUI, or convictions affect your nursing license — including sealing arrest or criminal records."],
  ["Licensure & Reinstatement", "Help with endorsement applications, disclosure requirements, and reinstatement after suspension or revocation."],
  ["Employment Protection", "Guidance to help prevent termination and address workplace allegations of wrongdoing."],
] as const;

const FAQS = [
  ["When should I contact an attorney?", "As soon as possible. You always have more options the earlier you start — and the initial consultation is free. If you've received a Notice of Investigation, the NSBN typically expects a response within 14 days."],
  ["Do I have to report an arrest to the Board?", "Not always — arrests don't automatically need to be reported, but convictions must be handled carefully. Talk with an attorney before disclosing anything."],
  ["My employer told me to self-report. Should I?", "Self-reporting deserves careful thought — it can carry real consequences. Discuss your situation with experienced counsel before you act."],
  ["Someone from the Board called me — should I talk to them?", "Be careful. Anything you say can be used against you. Consult an attorney before responding or calling back."],
  ["Can I get a revoked license back?", "Often yes. After a period of time, nurses whose licenses were revoked or surrendered may pursue reinstatement. We can help you build a plan to return to practice."],
] as const;

function NursingRoute() {
  return (
    <>
      <SiteHeader />

      <Section>
        <div className="mb-8 flex justify-center">
          <img src={IMAGES.boardNursing} alt="Nevada State Board of Nursing" className="w-auto h-36 md:h-44 object-contain" />
        </div>
        <SectionTitle as="h1">Nevada State Board of Nursing</SectionTitle>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-700">
          <p className="text-3xl font-bold text-dark-blue text-center">{SITE.phoneDisplay}</p>
          <p className="text-lg text-center">Serving Nevada Citizens &bull; {SITE.location}</p>
          <p className="text-lg">
            For 100 years, the Nevada State Board of Nursing (NSBN) has regulated nursing to
            ensure safe practices and public safety. The NSBN regulates more than 70,000 nurses
            statewide and has broad authority to investigate, discipline, and revoke licenses.
          </p>
          <p>
            When your nursing license is threatened, you need experienced legal representation.
            Craig K. Perry has defended nurses before the NSBN for over 16 years — from initial
            investigations through formal hearings and reinstatement proceedings.
          </p>
          <p className="text-sm text-gray-500">
            Nevada nursing licenses are governed by the{" "}
            <strong>Nevada Nurse Practice Act (NRS Chapter 632)</strong> and administrative
            regulations under <strong>NAC Chapter 632</strong>. The NSBN operates under{" "}
            <strong>NRS 233B</strong> (Nevada Administrative Procedure Act) for all disciplinary
            hearings and appeals.
          </p>
          <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
          <a href={SITE.phoneHref} className="btn-primary text-center">Call {SITE.phoneDisplay}</a>
          <a href="/contact" className="btn-secondary text-center">Free Consultation</a>
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>How We Help Nurses</SectionTitle>
        <ServiceGrid>
          {SERVICES.map(([title, body]) => (
            <ServiceCard key={title} title={title}>{body}</ServiceCard>
          ))}
        </ServiceGrid>
      </Section>

      <Section>
        <div className="rounded-lg border-l-4 border-gold bg-gray-50 p-8">
          <p className="text-2xl font-bold text-dark-blue">
            The Nevada State Board of Nursing opened{" "}
            <span className="text-gold-dark">605 investigations</span> in 2022–2023 — up 21% over the
            prior year.
          </p>
          <p className="mt-3 text-gray-600">
            That included 377 complaints against RNs and LPNs and 153 against APRNs (a 57% jump).
            If you've been contacted by the NSBN, don't face it alone.
          </p>
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>Why You Need Experienced Representation</SectionTitle>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6 text-gray-700">
            <p>
              Facing a nursing license investigation can be overwhelming. The NSBN has the
              authority to suspend, revoke, or place conditions on your license — which can end
              your career.
            </p>
            <p>
              With over 31 years of legal experience, Craig K. Perry understands the Board's
              procedures and requirements. We work to protect your rights, negotiate favorable
              outcomes, and when necessary, vigorously defend you in formal proceedings.
            </p>
            <p>
              Time is critical. Contact us immediately if you receive notice of an investigation
              or disciplinary action.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={IMAGES.nurseCloseup}
              alt="Professional nurse"
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <FaqList items={FAQS} />
        </div>
      </Section>
    </>
  );
}
