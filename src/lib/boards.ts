// Board facts used for AI/answer-engine content: quick answers, FAQs, and JSON-LD.
// Statute references must stay accurate — have Craig confirm any change.

export const LAST_UPDATED = "2026-11-12";

export type BoardInfo = {
  slug: string;
  board: string;
  nrs: string; // e.g. "NRS Chapter 639"
  pros: string; // who it licenses, plural
  short: string; // short license label, e.g. "pharmacy"
  faqs: ReadonlyArray<readonly [string, string]>;
};

const generic = (b: { board: string; short: string }) =>
  [
    [
      `Should I talk to the ${b.board} before I hire a lawyer?`,
      `No. Anything you say or write to the board — including an informal phone call with an investigator — can be used in the case against you. Speak with a Nevada license defense attorney first. Craig K. Perry offers a free 30–45 minute consultation at 702.893.4777.`,
    ],
    [
      `Who defends ${b.short} licenses in Nevada?`,
      `Craig K. Perry & Associates, based at 2300 W Sahara Ave #800 in Las Vegas, defends ${b.short} licensees before the ${b.board} statewide — including Las Vegas, Henderson, Reno, and Carson City. Craig K. Perry has practiced Nevada law for more than 31 years.`,
    ],
  ] as const;

function board(
  b: Omit<BoardInfo, "faqs"> & { faqs: ReadonlyArray<readonly [string, string]> },
): BoardInfo {
  return { ...b, faqs: [...b.faqs, ...generic(b)] };
}

export const BOARDS: Record<string, BoardInfo> = {
  nursing: board({
    slug: "nursing",
    board: "Nevada State Board of Nursing",
    nrs: "NRS Chapter 632",
    pros: "registered nurses (RNs), licensed practical nurses (LPNs), APRNs, and certified nursing assistants (CNAs)",
    short: "nursing",
    faqs: [],
  }),
  pharmacy: board({
    slug: "pharmacy",
    board: "Nevada State Board of Pharmacy",
    nrs: "NRS Chapter 639",
    pros: "pharmacists, pharmaceutical technicians, pharmacies, and practitioners who dispense controlled substances",
    short: "pharmacy",
    faqs: [
      ["What law governs the Nevada State Board of Pharmacy?", "The Board of Pharmacy operates under NRS Chapter 639 and its regulations in NAC Chapter 639. Disciplinary hearings follow the Nevada Administrative Procedure Act, NRS Chapter 233B."],
      ["Does the Board of Pharmacy affect doctors and APRNs?", "Yes. Physicians, physician assistants, and APRNs who dispense medications or hold a Nevada controlled substance registration can be investigated by the Board of Pharmacy, separately from their own licensing board."],
      ["What are common Board of Pharmacy complaints?", "Dispensing errors, controlled-substance inventory discrepancies, diversion allegations, record-keeping violations, prescription monitoring program (PMP) issues, and impairment or substance use concerns."],
    ],
  }),
  medical: board({
    slug: "medical",
    board: "Nevada State Board of Medical Examiners",
    nrs: "NRS Chapter 630",
    pros: "physicians (MDs), physician assistants, respiratory care practitioners, and perfusionists",
    short: "medical",
    faqs: [
      ["What law governs the Nevada Board of Medical Examiners?", "The Board of Medical Examiners licenses and disciplines MDs, physician assistants, and respiratory care practitioners under NRS Chapter 630. Grounds for discipline are listed in NRS 630.301 through 630.3065."],
      ["What happens after a complaint is filed with the Board of Medical Examiners?", "A board investigator reviews the complaint and may request records or a written response. An investigative committee then decides whether to dismiss it, issue a letter of warning, or authorize a formal complaint that proceeds to a hearing under NRS Chapter 233B."],
      ["Can a malpractice lawsuit lead to a medical board investigation?", "Yes. Malpractice settlements and judgments can trigger board review. Your malpractice carrier's attorney represents the civil case — your license often needs separate counsel."],
    ],
  }),
  osteopathic: board({
    slug: "osteopathic",
    board: "Nevada State Board of Osteopathic Medicine",
    nrs: "NRS Chapter 633",
    pros: "osteopathic physicians (DOs) and osteopathic physician assistants",
    short: "osteopathic physician",
    faqs: [
      ["What law governs the Nevada State Board of Osteopathic Medicine?", "Osteopathic physicians (DOs) in Nevada are licensed and disciplined under NRS Chapter 633. Contested cases are heard under the Nevada Administrative Procedure Act, NRS Chapter 233B."],
      ["Is a DO disciplined by the same board as an MD in Nevada?", "No. MDs are regulated by the Board of Medical Examiners (NRS 630); DOs are regulated by the separate State Board of Osteopathic Medicine (NRS 633)."],
    ],
  }),
  veterinary: board({
    slug: "veterinary",
    board: "Nevada State Board of Veterinary Medical Examiners",
    nrs: "NRS Chapter 638",
    pros: "veterinarians and licensed veterinary technicians",
    short: "veterinary",
    faqs: [
      ["What law governs the Nevada Board of Veterinary Medical Examiners?", "Veterinarians and veterinary technicians in Nevada are licensed and disciplined under NRS Chapter 638, with hearings conducted under NRS Chapter 233B."],
      ["What complaints do Nevada veterinarians face?", "Allegations of negligence or substandard care, controlled-substance record-keeping, improper supervision of staff, and client communication or billing disputes."],
    ],
  }),
  "social-work": board({
    slug: "social-work",
    board: "Nevada Board of Examiners for Social Workers",
    nrs: "NRS Chapter 641B",
    pros: "licensed clinical social workers (LCSWs), licensed social workers (LSWs), and social work interns",
    short: "social work",
    faqs: [
      ["What law governs social workers in Nevada?", "Social workers are licensed and disciplined by the Nevada Board of Examiners for Social Workers under NRS Chapter 641B, with hearings under NRS Chapter 233B."],
      ["What complaints do Nevada social workers face?", "Boundary and dual-relationship allegations, confidentiality breaches, documentation problems, supervision issues, and practicing outside the scope of the license."],
    ],
  }),
  radiology: board({
    slug: "radiology",
    board: "American Registry of Radiologic Technologists (ARRT) and Nevada licensing authorities",
    nrs: "ARRT ethics requirements",
    pros: "radiologic technologists, MRI technologists, and radiation therapists",
    short: "radiologic technologist",
    faqs: [
      ["Can ARRT discipline affect my ability to work in Nevada?", "Yes. Many Nevada employers require active ARRT certification, so ARRT ethics sanctions can cost you your job even where a state license is not directly at issue."],
      ["What triggers an ARRT ethics review?", "Criminal charges or convictions, employer discipline, falsified records, and failure to report a matter the ARRT requires to be reported."],
    ],
  }),
  "physical-therapy": board({
    slug: "physical-therapy",
    board: "Nevada Physical Therapy Board",
    nrs: "NRS Chapter 640",
    pros: "physical therapists (PTs) and physical therapist assistants (PTAs)",
    short: "physical therapy",
    faqs: [
      ["What law governs the Nevada Physical Therapy Board?", "PTs and PTAs in Nevada are licensed and disciplined under NRS Chapter 640, with contested hearings under NRS Chapter 233B."],
      ["What complaints do Nevada physical therapists face?", "Billing and documentation issues, improper supervision of PTAs or aides, boundary violations, and patient injury allegations."],
    ],
  }),
  dental: board({
    slug: "dental",
    board: "Nevada State Board of Dental Examiners",
    nrs: "NRS Chapter 631",
    pros: "dentists, dental hygienists, and dental therapists",
    short: "dental",
    faqs: [
      ["What law governs the Nevada State Board of Dental Examiners?", "Dentists and dental hygienists in Nevada are licensed and disciplined under NRS Chapter 631, with hearings under NRS Chapter 233B."],
      ["What complaints do Nevada dentists face?", "Standard-of-care allegations, sedation and anesthesia permit issues, infection control, prescribing, advertising, and billing disputes."],
    ],
  }),
  psychology: board({
    slug: "psychology",
    board: "Nevada Board of Psychological Examiners",
    nrs: "NRS Chapter 641",
    pros: "licensed psychologists and psychological assistants",
    short: "psychology",
    faqs: [
      ["What law governs psychologists in Nevada?", "Psychologists are licensed and disciplined by the Nevada Board of Psychological Examiners under NRS Chapter 641, with hearings under NRS Chapter 233B."],
      ["What complaints do Nevada psychologists face?", "Boundary violations, confidentiality breaches, custody-evaluation and forensic-report disputes, record-keeping, and supervision problems."],
    ],
  }),
  chiropractic: board({
    slug: "chiropractic",
    board: "Chiropractic Physicians' Board of Nevada",
    nrs: "NRS Chapter 634",
    pros: "chiropractic physicians and chiropractor's assistants",
    short: "chiropractic",
    faqs: [
      ["What law governs chiropractors in Nevada?", "Chiropractic physicians are licensed and disciplined under NRS Chapter 634, with hearings under NRS Chapter 233B."],
      ["What complaints do Nevada chiropractors face?", "Billing and insurance issues, advertising violations, patient boundary allegations, and documentation problems."],
    ],
  }),
  respiratory: board({
    slug: "respiratory",
    board: "Nevada State Board of Medical Examiners",
    nrs: "NRS Chapter 630",
    pros: "respiratory therapists and respiratory care practitioners",
    short: "respiratory care",
    faqs: [
      ["Which board licenses respiratory therapists in Nevada?", "Respiratory care practitioners in Nevada are licensed and disciplined by the Nevada State Board of Medical Examiners under NRS Chapter 630."],
      ["What complaints do respiratory therapists face?", "Documentation errors, medication or ventilator incidents, impairment concerns, and criminal matters that must be reported to the board."],
    ],
  }),
  "marriage-family-therapy": board({
    slug: "marriage-family-therapy",
    board: "Nevada Board of Examiners for Marriage and Family Therapists and Clinical Professional Counselors",
    nrs: "NRS Chapter 641A",
    pros: "licensed marriage and family therapists (LMFTs) and clinical professional counselors (CPCs)",
    short: "MFT and counselor",
    faqs: [
      ["What law governs MFTs and counselors in Nevada?", "Marriage and family therapists and clinical professional counselors are licensed under NRS Chapter 641A, with hearings under NRS Chapter 233B."],
      ["What complaints do Nevada therapists face?", "Dual relationships, confidentiality breaches, custody-related complaints from former clients, supervision of interns, and documentation problems."],
    ],
  }),
  "occupational-therapy": board({
    slug: "occupational-therapy",
    board: "Nevada Board of Occupational Therapy",
    nrs: "NRS Chapter 640A",
    pros: "occupational therapists (OTs) and occupational therapy assistants (OTAs)",
    short: "occupational therapy",
    faqs: [
      ["What law governs occupational therapists in Nevada?", "OTs and OTAs are licensed and disciplined by the Nevada Board of Occupational Therapy under NRS Chapter 640A, with hearings under NRS Chapter 233B."],
      ["What complaints do Nevada occupational therapists face?", "Supervision of OTAs, billing and documentation, scope-of-practice questions, and continuing-education compliance."],
    ],
  }),
};
