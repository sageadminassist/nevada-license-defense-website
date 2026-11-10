import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/marketing/sections";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/radiology")({
  head: () => ({
    meta: [
      { title: "Nevada Radiologic Technologist (ARRT) Defense | 702.893.4777" },
      { name: "description", content: "Craig K. Perry defends radiologic technologists and imaging professionals before the ARRT and Nevada licensing authorities. Free consultation — 702.893.4777." },
      { property: "og:title", content: "Nevada Radiologic Technologist License Defense | Craig K. Perry & Associates" },
      { property: "og:url", content: "https://nevadalicensedefense.com/radiology" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/radiology" }],
  }),
  component: BoardPage,
});

function BoardPage() {
  return (
    <>
      <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "340px" }}>
        <img src={IMAGES.mountainRedRock} alt="Nevada red rock landscape" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-dark-blue/70" />
        <div className="relative z-10 max-w-3xl px-6 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Radiologic Technologist (ARRT) Defense</h1>
          <p className="text-lg text-white/80">Defending radiologic technologists, MRI techs, and imaging professionals before the ARRT and Nevada licensing authorities.</p>
          <div className="flex justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </section>
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <img src={IMAGES.labTechLandscape} alt="Lab technician at microscope" className="w-full rounded-lg object-cover shadow-md max-h-96" />
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-dark-blue">About This Practice Area</h2>
            <p className="text-lg">Radiologic technologists, MRI technologists, radiation therapists, and other imaging professionals facing certification or disciplinary matters before the ARRT or Nevada licensing authorities.</p>
            <p className="text-sm text-gray-500">Governed by <strong>ARRT / State Registry</strong>. All disciplinary proceedings conducted under <strong>NRS 233B</strong> (Nevada Administrative Procedure Act).</p>
            <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
          </div>
        </div>
      </Section>
      <Section variant="muted">
        <SectionTitle>How We Help</SectionTitle>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
          {[["Board Investigations","Representation from the moment you receive a notice — before you respond to the board."],["Disciplinary Hearings","Defense at formal and informal hearings before your licensing board."],["License Reinstatement","Guidance reinstating a suspended or revoked license."],["Probation & Monitoring","Negotiating monitoring agreements and defending probation violations."],["Criminal Matters","Defense when criminal charges impact your professional license."],["License Renewal Issues","Resolving continuing-education, disclosure, or renewal problems."]].map(([title, blurb]) => (
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
            <a href="/contact" className="btn-secondary">Schedule a Consultation</a>
          </div>
        </div>
      </Section>
    </>
  );
}
