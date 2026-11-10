import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/marketing/site-header";
import {
  Section,
  SectionTitle,
  ServiceCard,
  ServiceGrid,
} from "@/components/marketing/sections";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/medical")({
  head: () => ({
    meta: [
      { title: "Nevada Board of Medical Examiners Defense | Craig K. Perry | 702.893.4777" },
      {
        name: "description",
        content:
          "Defense before the Nevada Board of Medical Examiners (NSBME) for physicians, PAs, and allied health professionals. Craig K. Perry defends against malpractice, prescribing, and professional conduct allegations. Free consultation.",
      },
      {
        property: "og:title",
        content: "Nevada Board of Medical Examiners Defense | Craig K. Perry",
      },
      {
        property: "og:description",
        content:
          "Facing a Nevada Board of Medical Examiners complaint? Craig K. Perry defends physicians, PAs, and allied health professionals. Free consultation — 702.893.4777.",
      },
      { property: "og:url", content: "https://nevadalicensedefense.com/medical" },
      { property: "og:image", content: "https://nevadalicensedefense.com/images/nvboardofmedicalexaminers.avif" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/medical" }],
  }),
  component: MedicalRoute,
});

const NRS_630_VIOLATIONS = [
  "Malpractice or gross malpractice",
  "Fraud in obtaining a license",
  "Improper prescribing or administering of drugs",
  "Fee-splitting arrangements",
  "Charging for services not rendered",
  "Professional conduct unbecoming a physician",
  "Inability to practice medicine with reasonable skill and safety",
  "Violation of any law relating to controlled substances",
  "Engaging in disruptive behavior",
  "Failure to maintain proper records",
] as const;

const SERVICES = [
  ["Board Investigations", "Representation during investigations by the Nevada State Board of Medical Examiners, including responding to complaints and negotiating with investigators."],
  ["Disciplinary Proceedings", "Defense in formal and informal disciplinary hearings and administrative proceedings before the NSBME."],
  ["Malpractice-Triggered Investigations", "Defense when a malpractice claim or civil lawsuit triggers a board investigation."],
  ["Prescribing & Controlled Substances", "Defense against allegations of improper prescribing, overprescribing, or controlled substance violations."],
  ["License Renewal Problems", "Assistance with continuing-education requirements and license renewal issues."],
  ["Criminal Matters", "Defense when criminal charges impact your medical license."],
  ["License Reinstatement", "Guidance through reinstating a suspended or revoked medical license."],
  ["HIPAA Compliance", "Assistance with HIPAA violations and related board actions."],
] as const;

function MedicalRoute() {
  return (
    <>
      <SiteHeader />

      <Section>
        <div className="mb-8 flex justify-center">
          <img src={IMAGES.boardMedical} alt="Nevada Board of Medical Examiners" className="w-auto h-36 md:h-44 object-contain" />
        </div>
        <SectionTitle as="h1">Nevada Board of Medical Examiners</SectionTitle>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-700">
          <p className="text-3xl font-bold text-dark-blue text-center">{SITE.phoneDisplay}</p>
          <p className="text-lg text-center">Serving Nevada Citizens &bull; {SITE.location}</p>
          <p className="text-lg">
            The Nevada State Board of Medical Examiners (NSBME) has broad authority to
            investigate, discipline, and revoke medical licenses. Even allegations that seem minor
            can result in serious consequences, including license suspension, revocation, or
            restrictions on your ability to practice.
          </p>
          <p>
            With over 31 years of legal experience, Craig K. Perry understands the Board's
            procedures, requirements, and the importance of protecting your professional
            reputation.
          </p>
          <p className="text-sm text-gray-500">
            Nevada medical licenses are governed by{" "}
            <strong>NRS Chapter 630</strong> (Board of Medical Examiners — MDs, PAs) and{" "}
            <strong>NRS Chapter 633</strong> (Osteopathic Medicine). All disciplinary proceedings
            are conducted under <strong>NRS 233B</strong> (Nevada Administrative Procedure Act).
          </p>
          <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
          <a href={SITE.phoneHref} className="btn-primary text-center">Call {SITE.phoneDisplay}</a>
          <a href="/contact" className="btn-secondary text-center">Free Consultation</a>
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>Examples of Actions Under NRS 630.301</SectionTitle>
        <p className="mb-8 max-w-3xl mx-auto text-gray-700 text-center">
          The following are examples of physician conduct that could result in disciplinary action
          by the Nevada Board of Medical Examiners:
        </p>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 max-w-3xl mx-auto">
          {NRS_630_VIOLATIONS.map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-700">
              <span className="mt-1 text-gold-dark">◆</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionTitle>Our Medical License Defense Services</SectionTitle>
        <ServiceGrid>
          {SERVICES.map(([title, body]) => (
            <ServiceCard key={title} title={title}>{body}</ServiceCard>
          ))}
        </ServiceGrid>
      </Section>

      <Section variant="muted">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={IMAGES.doctorStethoscope}
              alt="Doctor with stethoscope"
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="space-y-6 text-gray-700">
            <h2 className="text-3xl font-bold text-dark-blue">
              Protecting Your Medical Career
            </h2>
            <p>
              We work diligently to resolve matters favorably — whether through negotiation,
              settlement, or vigorous defense in formal proceedings.
            </p>
            <p>
              If you've received notice of an investigation or disciplinary action, don't wait.
              Contact us immediately to protect your license and your career.
            </p>
            <a href={SITE.phoneHref} className="btn-primary inline-block">Call {SITE.phoneDisplay}</a>
          </div>
        </div>
      </Section>
    </>
  );
}
