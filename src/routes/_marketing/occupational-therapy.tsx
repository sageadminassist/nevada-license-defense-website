import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/marketing/sections";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/occupational-therapy")({
  head: () => ({
    meta: [
      { title: "Nevada Occupational Therapy Board Defense | 702.893.4777" },
      { name: "description", content: "Craig K. Perry defends occupational therapists (OTs) and OTAs before the Nevada Board of Occupational Therapy. Free consultation — 702.893.4777." },
      { property: "og:title", content: "Nevada Occupational Therapy License Defense | Craig K. Perry & Associates" },
      { property: "og:description", content: "Facing a complaint before the Nevada Board of Occupational Therapy? Craig K. Perry defends OTs and OTAs. Free consultation — 702.893.4777." },
      { property: "og:url", content: "https://nevadalicensedefense.com/occupational-therapy" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/occupational-therapy" }],
  }),
  component: BoardPage,
});

const otLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Nevada Occupational Therapy License Defense | Craig K. Perry & Associates",
  url: "https://nevadalicensedefense.com/occupational-therapy",
  telephone: "+1-702-893-4777",
  areaServed: { "@type": "State", name: "Nevada" },
  serviceType: "Occupational Therapy License Defense",
  provider: {
    "@type": "Attorney",
    name: "Craig K. Perry",
    jobTitle: "Attorney",
    worksFor: { "@type": "LegalService", name: "Craig K. Perry & Associates", url: "https://craigperry.com" },
    knowsAbout: ["NRS Chapter 640A", "Nevada Board of Occupational Therapy", "Occupational Therapy License Defense", "Administrative Law"],
  },
};

function BoardPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(otLd) }} />
      <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "340px" }}>
        <img src={IMAGES.mountainJasmeet} alt="Nevada mountains" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-dark-blue/50" />
        <div className="relative z-10 max-w-3xl px-6 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Occupational Therapy Board Defense</h1>
          <p className="text-lg text-white/80">Defending OTs and OTAs before the Nevada Board of Occupational Therapy.</p>
          <div className="flex justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <img src={IMAGES.ptHandFlex} alt="Occupational therapist working with a patient on hand mobility" className="w-full rounded-lg object-cover shadow-md max-h-96" />
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-dark-blue">Nevada Board of Occupational Therapy</h2>
            <p className="text-lg">Occupational therapists (OTs) and occupational therapy assistants (OTAs) facing complaints, investigations, or disciplinary proceedings before the Nevada Board of Occupational Therapy.</p>
            <p>Occupational therapy licenses in Nevada are governed by <strong>NRS Chapter 640A</strong> (Nevada Board of Occupational Therapy). All disciplinary proceedings are conducted under <strong>NRS 233B</strong>, the Nevada Administrative Procedure Act. OTs and OTAs facing complaints regarding scope of practice, supervision violations, or unprofessional conduct should retain experienced legal counsel before responding to any Board inquiry.</p>
            <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href={SITE.phoneHref} className="btn-primary text-center">Call {SITE.phoneDisplay}</a>
              <a href="/contact" className="btn-secondary text-center">Free Consultation</a>
            </div>
          </div>
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>How We Help</SectionTitle>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {[
            ["Board Investigations", "Representation from the moment you receive a notice — before you respond to the board."],
            ["Disciplinary Hearings", "Defense at formal and informal hearings before the Nevada Board of Occupational Therapy."],
            ["License Reinstatement", "Guidance reinstating a suspended or revoked OT or OTA license."],
            ["Probation & Monitoring", "Negotiating monitoring agreements and defending probation violations."],
            ["Supervision Violations", "Defense against allegations of improper supervision of occupational therapy assistants."],
            ["Criminal Matters", "Defense when criminal charges impact your occupational therapy license."],
          ].map(([title, blurb]) => (
            <div key={title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-bold text-dark-blue">{title}</h3>
              <p className="text-sm text-gray-600">{blurb}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-dark-blue">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Your License Is Worth Defending</h2>
          <p className="text-white/80 max-w-xl mx-auto">Don't face your licensing board alone. Craig K. Perry has defended Nevada licensed professionals for over 31 years.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </Section>
    </>
  );
}
