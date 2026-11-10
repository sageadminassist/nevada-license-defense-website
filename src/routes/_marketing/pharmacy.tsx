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

function PharmacyRoute() {
  return (
    <>
      <SiteHeader />

      <Section>
        <SectionTitle as="h1">Nevada State Board of Pharmacy</SectionTitle>
        <div className="max-w-3xl space-y-4 text-navy">
          <p className="text-3xl font-bold">{SITE.phoneDisplay}</p>
          <p className="text-lg">Serving Nevada Citizens &bull; {SITE.location}</p>
          <p className="text-lg font-semibold">
            Defending pharmacists, physicians, PAs, and APRNs before the NSBP.
          </p>
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
          <p className="text-sm text-navy/70">
            Nevada pharmacy licenses are governed by{" "}
            <strong>NRS Chapter 639</strong> (Board of Pharmacy). All disciplinary proceedings are
            conducted under <strong>NRS 233B</strong> (Nevada Administrative Procedure Act).
          </p>
          <p className="font-semibold">{SITE.consultation}</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button render={<a href={SITE.phoneHref} />}>Call {SITE.phoneDisplay}</Button>
          <Button variant="outline" render={<a href="/contact" />}>Free Consultation</Button>
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
          <img
            src={IMAGES.boardPharmacy}
            alt="Nevada State Board of Pharmacy seal"
            width={400}
            height={400}
            loading="lazy"
            className="mx-auto w-full max-w-sm rounded-lg object-contain"
          />
          <div className="space-y-6 text-navy">
            <h2 className="font-heading text-3xl font-bold">
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
            <Button render={<a href={SITE.phoneHref} />}>Call {SITE.phoneDisplay}</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
