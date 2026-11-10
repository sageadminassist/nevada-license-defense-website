import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/marketing/site-header";
import {
  Section,
  SectionTitle,
  ServiceCard,
  ServiceGrid,
} from "@/components/marketing/sections";
import { Button } from "@/components/ui/button";
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
        <SectionTitle as="h1">Nevada Board of Medical Examiners</SectionTitle>
        <div className="max-w-3xl space-y-4 text-navy">
          <p className="text-3xl font-bold">{SITE.phoneDisplay}</p>
          <p className="text-lg">Serving Nevada Citizens &bull; {SITE.location}</p>
          <p className="text-lg font-semibold">
            Defending physicians, PAs, and allied health professionals.
          </p>
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
          <p className="text-sm text-navy/70">
            Nevada medical licenses are governed by{" "}
            <strong>NRS Chapter 630</strong> (Board of Medical Examiners — MDs, PAs) and{" "}
            <strong>NRS Chapter 633</strong> (Osteopathic Medicine). All disciplinary proceedings
            are conducted under <strong>NRS 233B</strong> (Nevada Administrative Procedure Act).
          </p>
          <p className="font-semibold">{SITE.consultation}</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button render={<a href={SITE.phoneHref} />}>Call {SITE.phoneDisplay}</Button>
          <Button variant="outline" render={<a href="/contact" />}>Free Consultation</Button>
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>Examples of Actions Under NRS 630.301</SectionTitle>
        <p className="mb-8 max-w-3xl text-navy">
          The following are examples of physician conduct that could result in disciplinary action
          by the Nevada Board of Medical Examiners:
        </p>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {NRS_630_VIOLATIONS.map((item) => (
            <li key={item} className="flex items-start gap-3 text-navy">
              <span className="mt-1 text-gold">◆</span>
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
          <img
            src={IMAGES.boardMedical}
            alt="Nevada State Board of Medical Examiners seal"
            width={400}
            height={400}
            loading="lazy"
            className="mx-auto w-full max-w-sm rounded-lg object-contain"
          />
          <div className="space-y-6 text-navy">
            <h2 className="font-heading text-3xl font-bold">
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
            <Button render={<a href={SITE.phoneHref} />}>Call {SITE.phoneDisplay}</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
