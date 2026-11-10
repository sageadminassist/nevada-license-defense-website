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
  founder: {
    "@type": "Person",
    name: "Craig K. Perry",
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
  { to: "/social-work", label: "Board of Social Workers", nrs: "NRS 641" },
  { to: "/radiology", label: "Radiologic Technologists (ARRT)", nrs: "ARRT" },
  { to: "/physical-therapy", label: "Physical Therapy Board", nrs: "NRS 640" },
  { to: "/dental", label: "Board of Dental Examiners", nrs: "NRS 631" },
  { to: "/psychology", label: "Board of Psychological Examiners", nrs: "NRS 641A" },
  { to: "/chiropractic", label: "Chiropractic Physicians Board", nrs: "NRS 634" },
  { to: "/respiratory", label: "Respiratory Care Board", nrs: "NRS 630A" },
  { to: "/marriage-family-therapy", label: "Marriage & Family Therapy Board", nrs: "NRS 641C" },
] as const;
