export const SITE = {
  name: "Nevada License Defense",
  firmName: "Craig K. Perry & Associates",
  firmUrl: "https://craigperry.com",
  phoneDisplay: "702.893.4777",
  phoneHref: "tel:7028934777",
  email: "info@craigperry.com",
  emailHref: "mailto:info@craigperry.com",
  location: "Las Vegas, Nevada",
  serviceArea: "Serving Las Vegas, Reno, Carson City, and all of Nevada",
  consultation:
    "Your first consultation is always free — a 30–45 minute call to review your situation. In-person and secure Zoom meetings available.",
  mycaseUrl: "https://ckpa.mycase.com",
} as const;

export const NLD_LD = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Nevada License Defense",
  url: "https://nevadalicensedefense.com",
  telephone: "+1-702-893-4777",
  email: SITE.email,
  areaServed: { "@type": "State", name: "Nevada" },
  parentOrganization: {
    "@type": "LegalService",
    name: "Craig K. Perry & Associates",
    url: "https://craigperry.com",
  },
  "@id": "https://nevadalicensedefense.com/#organization",
  founder: {
    "@type": ["Person", "Attorney"],
    "@id": "https://nevadalicensedefense.com/#craig-perry",
    name: "Craig K. Perry",
    jobTitle: "Attorney at Law",
    description:
      "Las Vegas trial attorney who has practiced law in Nevada for more than 31 years and has defended nurses and medical professionals before Nevada licensing boards for over 14 years, handling hundreds of board cases.",
    worksFor: { "@type": "LegalService", name: "Craig K. Perry & Associates", url: "https://craigperry.com" },
    url: "https://craigperry.com",
    telephone: "+1-702-893-4777",
    areaServed: { "@type": "State", name: "Nevada" },
    knowsAbout: [
      "Nevada professional license defense",
      "NRS Chapter 233B (Nevada Administrative Procedure Act)",
      "Nevada State Board of Nursing",
      "Nevada State Board of Pharmacy",
      "Nevada State Board of Medical Examiners",
      "Nevada licensing board disciplinary hearings",
    ],
    sameAs: ["https://craigperry.com", "https://lvnurseattorney.com", "https://www.youtube.com/@lvnurseattorney"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "2300 W Sahara Ave #800",
    addressLocality: "Las Vegas",
    addressRegion: "NV",
    postalCode: "89102",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.1499,
    longitude: -115.1728,
  },
  description:
    "Nevada medical professional license defense — Craig K. Perry & Associates defends physicians, pharmacists, nurses, and allied health professionals before Nevada state licensing boards.",
  knowsAbout: [
    "Medical license defense",
    "Pharmacy license defense",
    "Nurse license defense",
    "Nevada Board of Medical Examiners",
    "Nevada State Board of Pharmacy",
    "Nevada State Board of Nursing",
    "Administrative Law",
    "Professional License Defense",
  ],
  sameAs: [
    "https://craigperry.com",
    "https://lvnurseattorney.com",
    "https://maps.google.com/?cid=235096524719636307",
  ],
} as const;

export const NAV_ITEMS = [
  { to: "/nursing", label: "Board of Nursing" },
  { to: "/pharmacy", label: "Board of Pharmacy" },
  { to: "/medical", label: "Board of Medical Examiners" },
  { to: "/contact", label: "Contact" },
] as const;

export const MORE_BOARDS = [
  { to: "/osteopathic", label: "Board of Osteopathic Medicine", nrs: "NRS 633" },
  { to: "/veterinary", label: "Board of Veterinary Medical Examiners", nrs: "NRS 638" },
  { to: "/social-work", label: "Board of Social Workers", nrs: "NRS 641B" },
  { to: "/radiology", label: "Radiologic Technologists (ARRT)", nrs: "ARRT" },
  { to: "/physical-therapy", label: "Physical Therapy Board", nrs: "NRS 640" },
  { to: "/dental", label: "Board of Dental Examiners", nrs: "NRS 631" },
  { to: "/psychology", label: "Board of Psychological Examiners", nrs: "NRS 641" },
  { to: "/chiropractic", label: "Chiropractic Physicians Board", nrs: "NRS 634" },
  { to: "/respiratory", label: "Respiratory Care Board", nrs: "NRS 630" },
  { to: "/marriage-family-therapy", label: "Marriage & Family Therapy Board", nrs: "NRS 641A" },
  { to: "/occupational-therapy", label: "Board of Occupational Therapy", nrs: "NRS 640A" },
] as const;

export const ALL_BOARDS = [
  { to: "/nursing", label: "Board of Nursing", nrs: "NRS 632" },
  { to: "/pharmacy", label: "Board of Pharmacy", nrs: "NRS 639" },
  { to: "/medical", label: "Board of Medical Examiners", nrs: "NRS 630" },
  ...MORE_BOARDS,
] as const;

export const RESOURCES = [
  { to: "/discipline-process", label: "Board Discipline Process", nrs: "Step by step" },
  { to: "/accusations", label: "All Accusations", nrs: "Guides" },
  { to: "/videos", label: "Video Library", nrs: "26 videos" },
  { to: "/faq", label: "FAQ", nrs: "" },
  { to: "/contact", label: "Free Consultation", nrs: "" },
] as const;
