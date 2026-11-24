import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/marketing/sections";
import { VideoEmbed } from "@/components/marketing/video-embed";
import { IMAGES } from "@/lib/images";
import { ALL_BOARDS, NLD_LD, SITE } from "@/lib/site";

const BASE = "https://nevadalicensedefense.com";
const URL = `${BASE}/about`;
const DESC =
  "About Nevada License Defense and attorney Craig K. Perry: 37 years of trial practice, 31+ in Nevada, and 14+ years defending nurses and medical professionals before Nevada licensing boards.";

export const Route = createFileRoute("/_marketing/about")({
  head: () => ({
    meta: [
      { title: "About Craig K. Perry | Nevada License Defense | 702.893.4777" },
      { name: "description", content: DESC },
      { property: "og:title", content: "About Craig K. Perry & Nevada License Defense" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: URL },
      { property: "og:image", content: `${BASE}${IMAGES.craig}` },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: AboutPage,
});

const lds = [
  { "@context": "https://schema.org", "@type": "AboutPage", url: URL, name: "About Nevada License Defense", mainEntity: { "@id": `${BASE}/#craig-perry` } },
  { "@context": "https://schema.org", ...NLD_LD.founder },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "About", item: URL },
    ],
  },
];

const STATS = [
  ["37", "years of trial practice"],
  ["31+", "years practicing in Nevada"],
  ["14+", "years of licensing board defense"],
  ["100s", "of board cases handled"],
] as const;

const VALUES = [
  ["Early, careful responses", "The first written response to a board often decides the case. We get involved before anything is sent, so your side is told accurately and completely."],
  ["A trial lawyer in your corner", "Board cases are won with preparation: records, witnesses, expert input, and the willingness to go to a formal hearing when settlement isn't fair."],
  ["Protecting your career, not just the case", "We look at what any outcome means for your employment, other states' licenses, insurance, and education, and negotiate with that in mind."],
  ["Plain answers and a real person", "You'll talk with Craig and with Office Manager Tyrin Kanemeier, who has been with the firm for nearly 20 years, not a call center."],
] as const;

function AboutPage() {
  return (
    <>
      {lds.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "340px" }}>
        <img src={IMAGES.courthouseGrandStaircase} alt="Grand marble staircase and columns inside a historic courthouse" className="absolute inset-0 w-full h-full object-cover object-[50%_82%]" />
        <div className="absolute inset-0 bg-dark-blue/60" />
        <div className="relative z-10 max-w-3xl px-6 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">About Nevada License Defense</h1>
          <p className="text-lg text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">The professional license defense practice of Craig K. Perry &amp; Associates, Las Vegas.</p>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 items-center max-w-5xl mx-auto">
          <img src={IMAGES.craig} alt="Attorney Craig K. Perry" className="w-full h-[480px] rounded-lg object-cover object-[50%_20%] shadow-md" />
          <div className="space-y-4 text-gray-700">
            <h2 className="text-3xl font-bold text-dark-blue">Craig K. Perry, Attorney at Law</h2>
            <p className="text-lg">Craig is a career trial attorney with 37 years of trial practice, more than 31 of them in Nevada, and the founder of Craig K. Perry &amp; Associates in Las Vegas.</p>
            <p>For over 14 years he has defended nurses, physicians, pharmacists and other health professionals before Nevada's licensing boards, handling hundreds of board cases, many resolved by dismissal of the complaint. He represents clients from the first Notice of Investigation through settlement, formal hearing under NRS Chapter 233B, and judicial review.</p>
            <p>Craig also teaches nurses and health professionals how to protect their licenses through continuing-education sessions and keynotes as Craig Perry Speaks, and explains common board issues on his <a href="/videos" className="font-semibold text-dark-blue underline">video library</a>.</p>
          </div>
        </div>
      </Section>

      <section className="bg-dark-blue">
        <div className="section-container py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(([n, l]) => (
            <div key={l}>
              <p className="text-4xl md:text-5xl font-bold text-gold">{n}</p>
              <p className="mt-1 text-sm uppercase tracking-wider text-white/80">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <Section variant="muted">
        <SectionTitle>How We Work</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {VALUES.map(([t, b]) => (
            <div key={t} className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-dark-blue mb-2">{t}</h3>
              <p className="text-gray-700">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle>Meet Craig</SectionTitle>
        <VideoEmbed video={{ id: "RQ63vrM3YYI", title: "Introduction to Craig Perry - Your Legal Ally at LV Nurse Attorney", uploadDate: "2023-09-30T17:33:03-07:00", seconds: 29 }} description="A 30-second introduction to Nevada license defense attorney Craig K. Perry." />
      </Section>

      <Section variant="muted">
        <SectionTitle>Where We Practice</SectionTitle>
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-8">
          Our office is at {NLD_LD.address.streetAddress}, Las Vegas, NV {NLD_LD.address.postalCode}. We represent licensees across Nevada, from Las Vegas, Henderson and North Las Vegas to Reno and Carson City, in person or by secure Zoom, before these boards:
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {ALL_BOARDS.map((b) => (
            <a key={b.to} href={b.to} className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-dark-blue hover:border-gold hover:text-gold transition-colors">
              {b.label} <span className="text-gray-500 font-normal">· {b.nrs}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section className="bg-dark-blue">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Talk With Craig About Your Case</h2>
          <p className="text-white/80 max-w-xl mx-auto">{SITE.consultation}</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </Section>
    </>
  );
}
