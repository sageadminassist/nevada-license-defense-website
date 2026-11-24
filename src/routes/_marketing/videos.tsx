import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/marketing/sections";
import { VideoEmbed } from "@/components/marketing/video-embed";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";
import { ALL_VIDEOS, VIDEO_GROUPS } from "@/lib/videos";
import { slugify } from "@/lib/search-index";

const BASE = "https://nevadalicensedefense.com";
const URL = `${BASE}/videos`;
const DESC = `${ALL_VIDEOS.length} short videos from Nevada license defense attorney Craig K. Perry on board complaints, investigations, drug diversion, DUI, CE audits, discipline and more.`;

export const Route = createFileRoute("/_marketing/videos")({
  head: () => ({
    meta: [
      { title: "Video Library: Nevada License Defense Explained | 702.893.4777" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Video Library: Craig K. Perry Explains Nevada License Defense" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:image", content: `${BASE}${IMAGES.courthouseHallSkylight}` },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: VideosPage,
});

const listLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Nevada License Defense video library",
  numberOfItems: ALL_VIDEOS.length,
  itemListElement: ALL_VIDEOS.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: `https://www.youtube.com/watch?v=${v.id}`, name: v.title })),
};
const crumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Videos", item: URL },
  ],
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const clean = (t: string) => t.replace(/\s*[-–]\s*(Your|Safeguard|Protect|Navigating|Understanding|Ensuring|Get|LV Nurse).*$/, "").replace(/,? with LV Nurse Attorney$/, "").replace(/ Explained by LV Nurse Attorney$/, "").trim();

function VideosPage() {
  return (
    <>
      {[listLd, crumbLd].map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "340px" }}>
        <img src={IMAGES.courthouseHallSkylight} alt="Stone columns and skylight inside a grand courthouse hall" className="absolute inset-0 w-full h-full object-cover object-[50%_40%]" />
        <div className="absolute inset-0 bg-dark-blue/60" />
        <div className="relative z-10 max-w-3xl px-6 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">Video Library</h1>
          <p className="text-lg text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">Craig K. Perry explains Nevada licensing board complaints in {ALL_VIDEOS.length} short videos.</p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="section-container py-5">
          <nav className="flex flex-wrap justify-center gap-2" aria-label="Video topics">
            {VIDEO_GROUPS.map((g) => (
              <a key={g.title} href={`#${slugify(g.title)}`} className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-dark-blue hover:bg-gold/20 transition-colors">
                {g.title} <span className="text-gray-500 font-normal">({g.videos.length})</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {VIDEO_GROUPS.map((g, gi) => (
        <Section key={g.title} variant={gi % 2 ? "muted" : undefined}>
          <div id={slugify(g.title)} className="scroll-mt-24" />
          <SectionTitle>{g.title}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {g.videos.map((v) => (
              <article key={v.id} className="flex flex-col">
                <VideoEmbed video={v} description={v.summary} compact />
                <h3 className="mt-3 font-bold text-dark-blue leading-snug">{clean(v.title)}</h3>
                <p className="mt-1 text-sm text-gray-600 flex-1">{v.summary}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {fmt(v.seconds)}
                  {v.link ? <> · <a href={v.link} className="font-semibold text-dark-blue hover:text-gold">Read the guide →</a></> : null}
                </p>
              </article>
            ))}
          </div>
        </Section>
      ))}

      <Section className="bg-dark-blue">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Have a Question the Videos Don't Answer?</h2>
          <p className="text-white/80 max-w-xl mx-auto">{SITE.consultation}</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
            <a href="https://www.youtube.com/@lvnurseattorney" target="_blank" rel="noopener" className="btn-secondary">YouTube Channel</a>
          </div>
        </div>
      </Section>
    </>
  );
}
