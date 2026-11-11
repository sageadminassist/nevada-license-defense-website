import { Link, createFileRoute } from "@tanstack/react-router";
import { Bone, Brain, Dumbbell, FlaskConical, Hand, HeartHandshake, PawPrint, Scan, SmilePlus, Stethoscope, Users } from "lucide-react";

import {
  Section,
  SectionTitle,
  ServiceCard,
  ServiceGrid,
} from "@/components/marketing/sections";
import { IMAGES } from "@/lib/images";
import { MORE_BOARDS, SITE } from "@/lib/site";

const MORE_BOARDS_ICONS = [
  { ...MORE_BOARDS[0], icon: Bone,          anim: "anim-wobble"  },  // osteopathic
  { ...MORE_BOARDS[1], icon: PawPrint,      anim: "anim-bounce"  },  // veterinary
  { ...MORE_BOARDS[2], icon: Users,         anim: "anim-rise"    },  // social-work
  { ...MORE_BOARDS[3], icon: Scan,          anim: "anim-scan"    },  // radiology
  { ...MORE_BOARDS[4], icon: Dumbbell,      anim: "anim-lift"    },  // physical-therapy
  { ...MORE_BOARDS[5], icon: SmilePlus,     anim: "anim-shimmy"  },  // dental
  { ...MORE_BOARDS[6], icon: Brain,         anim: "anim-pulse"   },  // psychology
  { ...MORE_BOARDS[7], icon: Stethoscope,   anim: "anim-swing"   },  // chiropractic
  { ...MORE_BOARDS[8], icon: FlaskConical,  anim: "anim-swirl"   },  // respiratory
  { ...MORE_BOARDS[9], icon: HeartHandshake,anim: "anim-beat"    },  // MFT
  { ...MORE_BOARDS[10], icon: Hand,         anim: "anim-wobble"  },  // occupational therapy
];

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

// SVG icons from original site
const NursingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50,30 C 50,30 35,20 25,25 C 15,30 15,45 25,55 C 35,65 50,80 50,80 C 50,80 65,65 75,55 C 85,45 85,30 75,25 C 65,20 50,30 50,30 Z" />
    <path d="M 25,50 L 30,50 L 35,35 L 40,60 L 45,40 L 50,50 L 55,50 L 60,45 L 65,50 L 70,50 L 75,50" className="heartbeat-line" />
  </svg>
);

const PharmacyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <g className="bottle-group">
      <rect x="30" y="30" width="40" height="50" rx="2" fill="none" />
      <rect x="30" y="20" width="40" height="12" rx="2" fill="none" />
      <line x1="40" y1="22" x2="40" y2="30" strokeWidth="4" />
      <line x1="50" y1="22" x2="50" y2="30" strokeWidth="4" />
      <line x1="60" y1="22" x2="60" y2="30" strokeWidth="4" />
    </g>
    <circle cx="42" cy="64" r="3.5" fill="currentColor" className="pill pill-1" />
    <circle cx="50" cy="52" r="3.5" fill="currentColor" className="pill pill-2" />
    <circle cx="58" cy="63" r="3.5" fill="currentColor" className="pill pill-3" />
  </svg>
);

const MedicalIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 125" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1.0119695,0,0,1.0116948,-141.74874,2.7681437)">
      <g className="stethoscope-bottom-group">
        <path d="m 184.18091,68.479665 v 33.849705 c 0,13.50915 16.5632,12.97487 16.5632,12.97487 0,0 16.5632,0.53428 16.5632,-12.97487 v -9.815949" fill="none" />
        <circle cx="217.28558" cy="84.042969" r="8.4355831" fill="none" />
      </g>
      <g className="earpiece-left-group">
        <path d="m 173.61963,6.1349693 c 0,0 -22.39264,-1.8404908 -20.2454,21.4723927 2.14724,23.312883 15.59797,36.144211 30.80426,40.184051" fill="none" />
        <path d="M 174.026,2.7742804 V 9.5364527" fill="none" />
      </g>
      <g className="earpiece-right-group">
        <path d="M 194.35256,2.7742804 V 9.5364527" fill="none" />
        <path d="M 184.17849,67.791413 C 199.38478,63.751574 212.83551,50.920243 214.98275,27.60736 217.12999,4.2944767 194.73735,6.1349666 194.73735,6.1349666" fill="none" />
      </g>
    </g>
  </svg>
);

const BOARDS = [
  {
    title: "Nevada State Board of Nursing (NSBN)",
    body: "We provide legal representation and guidance for nurses facing license issues.",
    href: "/nursing",
    icon: <NursingIcon className="w-16 h-16 text-dark-blue" />,
    image: IMAGES.nurseCloseup,
    imageAlt: "Professional nurse in blue scrubs",
  },
  {
    title: "Nevada Board of Pharmacy (NSBP)",
    body: "Our experienced attorneys will fight for your pharmacy license.",
    href: "/pharmacy",
    icon: <PharmacyIcon className="w-16 h-16 text-dark-blue" />,
    image: IMAGES.medications,
    imageAlt: "Pharmacy medications and pill pouches",
  },
  {
    title: "Medical Nevada State Board of Medical Examiners (NSBME)",
    body: "We specialize in protecting the licenses of medical professionals in Nevada.",
    href: "/medical",
    icon: <MedicalIcon className="w-14 h-14 text-dark-blue" />,
    image: IMAGES.doctorStethoscope,
    imageAlt: "Doctor with stethoscope",
  },
] as const;

function HomePage() {
  return (
    <>
      {/* Full-screen hero with layered mountains */}
      <section className="relative h-screen overflow-hidden">
        {/* Cloud background */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.heroBackground}
            alt="Nevada mountain landscape"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Mountain midground */}
        <div className="absolute inset-0 z-10 animate-mountain-rise-mid" style={{ transform: "translateY(100%)" }}>
          <img src={IMAGES.heroMidground} alt="" className="w-full h-full object-cover object-bottom" />
        </div>
        {/* Mountain foreground */}
        <div className="absolute inset-0 z-20 animate-mountain-rise-fore" style={{ transform: "translateY(100%)" }}>
          <img src={IMAGES.heroForeground} alt="" className="w-full h-full object-cover object-bottom" />
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-[25]"
          style={{ background: "linear-gradient(to bottom, rgba(18,32,59,0.5) 0%, rgba(18,32,59,0.3) 40%, transparent 70%)" }}
        />
        {/* Content */}
        <div className="relative z-30 h-full flex items-center">
          <div className="section-container w-full">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up drop-shadow-lg">
                Nevada License Defense
                <span className="block text-2xl md:text-3xl lg:text-4xl font-bold mt-2 drop-shadow-lg">
                  of Medical Professionals
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 animate-slide-up drop-shadow-lg" style={{ animationDelay: "100ms" }}>
                Licensed Nevada Attorney Craig K. Perry will defend your professional license
                with expertise and dedication before various Nevada State Boards.
              </p>
              <p className="text-lg mb-12 text-white/90 animate-slide-up drop-shadow-lg" style={{ animationDelay: "200ms" }}>
                To date, he has handled cases before the State Board of Nursing, the State Board
                of Pharmacy, the Board of Medical Examiners, the Board of Veterinary Examiners,
                and the American Registry of Radiologic Technologists (ARRT).
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: "300ms" }}>
                <a
                  href={SITE.phoneHref}
                  className="btn-gold text-lg px-8 py-4 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {SITE.phoneDisplay}
                </a>
                <a
                  href="/contact"
                  className="bg-white text-dark-blue px-8 py-4 rounded-lg font-bold border-2 border-white hover:bg-gold hover:border-gold transition-all duration-300 shadow-md hover:shadow-lg text-lg"
                >
                  Free Consultation
                </a>
              </div>
              <p className="mt-8 text-white italic font-semibold animate-fade-in drop-shadow-lg" style={{ animationDelay: "400ms" }}>
                Defending the Licenses of Nurses, Doctors, Therapists, Technologists, and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <Section variant="muted">
        <SectionTitle>Nevada License Defense for Medical Professionals</SectionTitle>
        <ServiceGrid>
          {BOARDS.map((b, i) => (
            <ServiceCard
              key={b.title}
              title={b.title}
              href={b.href}
              icon={b.icon}
              image={b.image}
              imageAlt={b.imageAlt}
            >
              {b.body}
            </ServiceCard>
          ))}
        </ServiceGrid>
      </Section>

      {/* More Boards section */}
      <Section variant="muted">
        <SectionTitle>We Also Defend Before These Boards</SectionTitle>
        <div className="flex flex-wrap justify-center gap-4">
          {MORE_BOARDS_ICONS.map((board) => {
            const Icon = board.icon;
            return (
              <Link
                key={board.to}
                to={board.to}
                className="group w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.666%-0.834rem)] flex flex-col items-center text-center rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:-translate-y-1 hover:border-gold/40 transition-all duration-300"
              >
                <div className="mb-3 flex items-center justify-center w-16 h-16 rounded-full bg-dark-blue/5 group-hover:bg-gold/10 transition-colors duration-300">
                  <Icon className="w-9 h-9 text-dark-blue" />
                </div>
                <span className="text-xs font-bold text-gold uppercase tracking-wide mb-1">{board.nrs}</span>
                <span className="text-sm font-bold text-dark-blue leading-snug flex-1">{board.label}</span>
                <span className="mt-3 text-xs font-semibold text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200">Learn More →</span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* About section */}
      <Section>
        <SectionTitle>
          For Over 14 Years, We Have Defended Medical Professionals in the State of Nevada
        </SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
              Are you a physician, pharmacist, or other licensed medical professional facing
              an investigation or complaint before a Nevada state licensing board?
            </p>
            <p className="text-xl font-bold mb-6 animate-slide-up" style={{ color: "#b27e4f", animationDelay: "200ms" }}>
              Don't face it alone — we can help.
            </p>
            <p className="text-lg text-gray-700 animate-slide-up" style={{ animationDelay: "300ms" }}>
              Our law firm specializes in defending the professional licenses of physicians,
              pharmacists, nurses, and allied health professionals before Nevada state licensing
              boards. We understand the stress and uncertainty these proceedings bring, and
              we're here to protect your livelihood.
            </p>
            <p className="text-lg text-gray-700 mt-4">
              Craig K. Perry has defended professionals before the Board of Medical Examiners,
              Board of Pharmacy, Board of Nursing, Board of Veterinary Medical Examiners,
              and the American Registry of Radiologic Technologists (ARRT).
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href={SITE.phoneHref} className="btn-primary text-center">
                Call {SITE.phoneDisplay}
              </a>
              <a href="/contact" className="btn-secondary text-center">
                Free Consultation
              </a>
            </div>
          </div>
          <div className="animate-slide-in-right overflow-hidden rounded-lg shadow-lg">
            <img
              src={IMAGES.craigOffice}
              alt="Craig K. Perry, Nevada professional license defense attorney"
              className="w-full h-[520px] object-cover object-[50%_20%] transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </Section>

      {/* CTA section */}
      <section className="bg-dark-blue text-white relative overflow-hidden">
        <div className="section-container section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
              Don't Delay. Give Us a Call!
            </h2>
            <p className="text-xl mb-8 text-white/90 animate-slide-up" style={{ animationDelay: "100ms" }}>
              Our law office staff is standing by, ready to assist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={SITE.phoneHref}
                className="text-3xl font-bold text-gold hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                {SITE.phoneDisplay}
              </a>
            </div>
            <p className="mt-8 text-gold font-semibold animate-fade-in" style={{ animationDelay: "300ms" }}>
              Free Consultations Via Zoom
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
