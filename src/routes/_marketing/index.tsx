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

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    meta: [
      { title: "Nevada License Defense | Medical Professional License Attorney | 702.893.4777" },
      {
        name: "description",
        content:
          "Nevada License Defense — Craig K. Perry & Associates defends physicians, pharmacists, nurses, and allied health professionals before Nevada state licensing boards. 31+ years' experience. Free consultation.",
      },
      {
        property: "og:title",
        content: "Nevada License Defense | Medical Professional License Attorney",
      },
      {
        property: "og:description",
        content:
          "Facing a Nevada licensing board complaint? Craig K. Perry has 31+ years defending medical professionals. Free consultation — 702.893.4777.",
      },
      { property: "og:url", content: "https://nevadalicensedefense.com" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com" }],
  }),
  component: HomePage,
});

const BOARDS = [
  {
    title: "Board of Nursing (NSBN)",
    body: "Defense for RNs, LPNs, NPs, and APRNs facing complaints, investigations, and disciplinary hearings before the Nevada State Board of Nursing.",
    href: "/nursing",
  },
  {
    title: "Board of Pharmacy (NSBP)",
    body: "Representation for pharmacists, physicians, PAs, and APRNs facing allegations before the Nevada State Board of Pharmacy — including PMP violations and prescribing issues.",
    href: "/pharmacy",
  },
  {
    title: "Board of Medical Examiners",
    body: "Defense for physicians and allied health professionals facing investigations and disciplinary proceedings before the Nevada Board of Medical Examiners.",
    href: "/medical",
  },
] as const;

function HomePage() {
  return (
    <>
      <SiteHeader full>
        <h1
          className="max-w-3xl text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          style={{ fontFamily: "Playfair Display,Georgia,serif" }}
        >
          Nevada License Defense
          <span className="mt-2 block text-gold">for Medical Professionals</span>
        </h1>
        <p className="max-w-2xl text-lg text-white/85">
          Licensed Nevada Attorney Craig K. Perry will defend your professional license with
          expertise and dedication before various Nevada State Boards.
        </p>
        <p className="text-white/70">
          To date, he has handled cases before the State Board of Nursing, the State Board of
          Pharmacy, the Board of Medical Examiners, the Board of Veterinary Medical Examiners, and
          the American Registry of Radiologic Technologists (ARRT).
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button render={<a href={SITE.phoneHref} />}>
            {SITE.phoneDisplay}
          </Button>
          <Button variant="outline" render={<a href="/contact" />}>
            Free Consultation
          </Button>
        </div>
        <p className="text-sm italic text-white/60">
          Defending the Licenses of Nurses, Doctors, Therapists, Technologists, and more
        </p>
      </SiteHeader>

      <Section variant="muted">
        <SectionTitle>Nevada License Defense for Medical Professionals</SectionTitle>
        <ServiceGrid>
          {BOARDS.map((b) => (
            <ServiceCard key={b.title} title={b.title} href={b.href}>
              {b.body}
            </ServiceCard>
          ))}
        </ServiceGrid>
      </Section>

      <Section>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6 text-navy">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              For Over 14 Years, We Have Defended Medical Professionals in the State of Nevada
            </h2>
            <p className="text-lg">
              Your professional license is the foundation of your career. When it's threatened by
              a complaint, investigation, or disciplinary action, you need experienced counsel who
              understands both the legal process and your profession.
            </p>
            <p>
              Craig K. Perry and his team have defended nurses, physicians, pharmacists,
              radiologic technologists, therapists, and other licensed professionals before Nevada
              state boards. Every case is different — our approach is tailored to the specific
              allegations, the specific board, and the specific outcome you need.
            </p>
            <p className="font-semibold">{SITE.consultation}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button render={<a href={SITE.phoneHref} />}>
                Call {SITE.phoneDisplay}
              </Button>
              <Button variant="outline" render={<a href="/contact" />}>
                Contact Us
              </Button>
            </div>
          </div>
          <img
            src={IMAGES.craig}
            alt="Attorney Craig K. Perry"
            width={600}
            height={700}
            loading="lazy"
            className="w-full rounded-lg object-cover shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
          />
        </div>
      </Section>

      <Section variant="muted">
        <div className="rounded-lg border-l-4 border-gold bg-card p-8 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
          <p className="font-heading text-2xl text-navy">
            Part of{" "}
            <a
              href={SITE.firmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-dark"
            >
              Craig K. Perry &amp; Associates
            </a>
          </p>
          <p className="mt-3 text-muted-foreground">
            Nevada License Defense is the medical and professional license defense division of
            Craig K. Perry &amp; Associates — a Las Vegas law firm with over 31 years of experience
            defending licensed professionals before Nevada state boards.
          </p>
          <div className="mt-6">
            <Button
              size="sm"
              render={
                <a href={SITE.firmUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              Visit CraigPerry.com →
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
