import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/marketing/sections";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/respiratory")({
  head: () => ({
    meta: [
      { title: "Nevada Respiratory Care Board Defense | 702.893.4777" },
      { name: "description", content: "Craig K. Perry defends respiratory therapists before the Nevada Respiratory Care Board. Free consultation — 702.893.4777." },
      { property: "og:title", content: "Nevada Respiratory Care License Defense | Craig K. Perry & Associates" },
      { property: "og:url", content: "https://nevadalicensedefense.com/respiratory" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/respiratory" }],
  }),
  component: BoardPage,
});

function BoardPage() {
  return (
    <>
      <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "340px" }}>
        <img src={IMAGES.mountainRedRockCanyon} alt="Nevada mountains" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-dark-blue/50" />
        <div className="relative z-10 max-w-3xl px-6 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Respiratory Care Board Defense</h1>
          <p className="text-lg text-white/80">Defending respiratory therapists and respiratory care practitioners before the Nevada Respiratory Care Board.</p>
          <div className="flex justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </section>
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <img src={IMAGES.respiratoryStethoscope} alt="Doctor examining patient with stethoscope" className="w-full rounded-lg object-cover shadow-md max-h-96" />
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-dark-blue">About This Practice Area</h2>
            <p className="text-lg">Respiratory therapists and respiratory care practitioners facing licensing board complaints or disciplinary action before the Nevada Respiratory Care Board.</p>
            <p className="text-gray-700">Respiratory therapist licenses in Nevada are governed by <strong>NRS Chapter 630A</strong> (Nevada State Board of Medical Examiners — Respiratory Care). All disciplinary proceedings are conducted under <strong>NRS 233B</strong>, the Nevada Administrative Procedure Act. RTs facing complaints, credentialing issues, or investigations before the Board should consult an experienced license defense attorney before responding to any Board inquiry.</p>
            <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
          </div>
        </div>
      </Section>
      <Section variant="muted">
        <SectionTitle>How We Help</SectionTitle>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
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
