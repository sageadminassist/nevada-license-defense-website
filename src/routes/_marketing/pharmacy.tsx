import { createFileRoute } from "@tanstack/react-router";

import {
  Section,
  SectionTitle,
  ServiceCard,
  ServiceGrid,
} from "@/components/marketing/sections";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/pharmacy")({
  head: () => ({
    meta: [
      { title: "Nevada Board of Pharmacy Defense | Craig K. Perry | 702.893.4777" },
      {
        name: "description",
        content:
          "Defense before the Nevada State Board of Pharmacy (NSBP) for pharmacists, physicians, PAs, and APRNs. Craig K. Perry defends against PMP violations, prescribing issues, and licensing actions. Free consultation.",
      },
      {
        property: "og:title",
        content: "Nevada Board of Pharmacy Defense | Craig K. Perry",
      },
      {
        property: "og:description",
        content:
          "Facing a Nevada Board of Pharmacy complaint? Craig K. Perry defends pharmacists and prescribers. Free consultation — 702.893.4777.",
      },
      { property: "og:url", content: "https://nevadalicensedefense.com/pharmacy" },
      { property: "og:image", content: "https://nevadalicensedefense.com/images/nvboardofpharmacy.avif" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/pharmacy" }],
  }),
  component: PharmacyRoute,
});

const SERVICES = [
  ["PMP Violations", "Defense when charged with failure to pull a Prescription Monitoring Program (PMP) report before prescribing or dispensing medications."],
  ["APRN Prescribing Issues", "Representation for APRNs facing allegations related to Nevada's unique requirement for prescribing and dispensing licenses."],
  ["Pharmacist License Defense", "Comprehensive defense for licensed pharmacists facing board investigations, disciplinary proceedings, and license revocation threats."],
  ["Dispensing Violations", "Defense against allegations of improper dispensing, billing irregularities, and controlled substance violations."],
  ["License Reinstatement", "Guidance through the process of reinstating a suspended or revoked pharmacy license."],
  ["Criminal & DUI Matters", "Defense when criminal charges or DUI convictions threaten your pharmacy license."],
] as const;

function PharmacyHero() {
  return (
    <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "340px" }}>
      <img src={IMAGES.mountainSunset} alt="Nevada sunset mountains" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-dark-blue/70" />
      <div className="relative z-10 max-w-3xl px-6 space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Nevada Board of Pharmacy Defense</h1>
        <p className="text-lg text-white/80">Defending pharmacists, APRNs, and pharmacy professionals before the Nevada State Board of Pharmacy.</p>
        <div className="flex justify-center gap-4 pt-2">
          <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
          <a href="/contact" className="btn-secondary">Free Consultation</a>
        </div>
      </div>
    </section>
  );
}

function PharmacyRoute() {
  return (
    <>
      <PharmacyHero />
      <Section>
        <div className="mb-8 flex justify-center">
          <img src={IMAGES.boardPharmacy} alt="Nevada Board of Pharmacy" className="w-auto h-36 md:h-44 object-contain" />
        </div>
        <SectionTitle as="h1">Nevada State Board of Pharmacy</SectionTitle>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-700">
          <p className="text-3xl font-bold text-dark-blue text-center">{SITE.phoneDisplay}</p>
          <p className="text-lg text-center">Serving Nevada Citizens &bull; {SITE.location}</p>
          <p className="text-lg">
            The Nevada State Board of Pharmacy (BOP) has a duty to carry out and enforce the
            provisions of Nevada law to protect the health, safety and welfare of the public. The
            BOP directly affects doctors, PAs, and APRNs who administer medications in Nevada.
          </p>
          <p>
            With increasing frequency, attorney Craig Perry represents clients who are alleged to
            have violated laws enforced by the BOP. Recent examples include failure to pull a PMP
            report, failure of APRNs to obtain Nevada-specific dispensing licenses, and billing
            irregularities unique to Nevada prescribers.
          </p>
          <p className="text-sm text-gray-500">
            Nevada pharmacy licenses are governed by{" "}
            <strong>NRS Chapter 639</strong> (Board of Pharmacy). All disciplinary proceedings are
            conducted under <strong>NRS 233B</strong> (Nevada Administrative Procedure Act).
          </p>
          <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
          <a href={SITE.phoneHref} className="btn-primary text-center">Call {SITE.phoneDisplay}</a>
          <a href="/contact" className="btn-secondary text-center">Free Consultation</a>
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>How We Help Pharmacy Professionals</SectionTitle>
        <ServiceGrid>
          {SERVICES.map(([title, body]) => (
            <ServiceCard key={title} title={title}>{body}</ServiceCard>
          ))}
        </ServiceGrid>
      </Section>

      <Section>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={IMAGES.medications}
              alt="Pharmacy medications"
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="space-y-6 text-gray-700">
            <h2 className="text-3xl font-bold text-dark-blue">
              Nevada Has Unique Pharmacy Requirements
            </h2>
            <p>
              Nevada differs from many other states in its pharmacy regulations — particularly
              around APRN prescribing and dispensing licenses. These differences catch many
              out-of-state practitioners off guard.
            </p>
            <p>
              If you've received notice of an investigation or complaint from the Nevada State
              Board of Pharmacy, contact us immediately. The earlier you act, the more options
              you have.
            </p>
            <a href={SITE.phoneHref} className="btn-primary inline-block">Call {SITE.phoneDisplay}</a>
          </div>
        </div>
      </Section>
    </>
  );
}
