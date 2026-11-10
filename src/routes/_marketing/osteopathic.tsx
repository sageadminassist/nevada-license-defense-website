import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/marketing/sections";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/osteopathic")({
  head: () => ({
    meta: [
      { title: "Nevada Board of Osteopathic Medicine Defense | 702.893.4777" },
      { name: "description", content: "Craig K. Perry defends Board of Osteopathic Medicine professionals before Nevada licensing boards. 31+ years experience. Free consultation — 702.893.4777." },
      { property: "og:title", content: "Nevada Board of Osteopathic Medicine Defense | Craig K. Perry & Associates" },
      { property: "og:url", content: "https://nevadalicensedefense.com/osteopathic" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/osteopathic" }],
  }),
  component: BoardPage,
});

function BoardPage() {
  return (
    <>
      <Section>
        <SectionTitle as="h1">Board of Osteopathic Medicine Defense</SectionTitle>
        <div className="max-w-3xl space-y-4 text-gray-700">
          <p className="text-2xl font-bold text-dark-blue">{SITE.phoneDisplay}</p>
          <p className="text-lg">{SITE.serviceArea}</p>
          <p className="text-lg">Osteopathic physicians (DOs) facing disciplinary actions, investigations, or license revocation before the Nevada State Board of Osteopathic Medicine.</p>
          <p className="text-sm text-gray-500">
            Governed by <strong>NRS Chapter 633</strong>. All disciplinary proceedings conducted under <strong>NRS 233B</strong> (Nevada Administrative Procedure Act).
          </p>
          <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
          <div className="pt-4 flex flex-wrap gap-4">
            <a href={SITE.phoneHref} className="btn-primary">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </Section>
      <Section variant="muted">
        <SectionTitle>How We Help</SectionTitle>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
          {[
            ["Board Investigations", "Representation from the moment you receive a notice — before you respond to the board."],
            ["Disciplinary Hearings", "Defense at formal and informal hearings before your licensing board."],
            ["License Reinstatement", "Guidance reinstating a suspended or revoked license."],
            ["Probation & Monitoring", "Negotiating monitoring agreements and defending probation violations."],
            ["Criminal Matters", "Defense when criminal charges impact your professional license."],
            ["License Renewal Issues", "Resolving continuing-education, disclosure, or renewal problems."],
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
          <p className="text-white/80 max-w-xl mx-auto">Don't face your licensing board alone. Craig K. Perry has defended Nevada licensed professionals for over 31 years — call today for a free consultation.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Schedule a Consultation</a>
          </div>
        </div>
      </Section>
    </>
  );
}
