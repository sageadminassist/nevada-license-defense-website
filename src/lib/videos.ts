import type { Video } from "@/lib/accusations";

/** Every video on Craig's YouTube channel (@lvnurseattorney), grouped for the /videos library. */
export type LibraryVideo = Video & { summary: string; link?: string };

const D = (t: string) => `2023-09-30T${t}-07:00`;

export const VIDEO_GROUPS: { title: string; videos: LibraryVideo[] }[] = [
  {
    title: "Getting Started",
    videos: [
      { id: "RQ63vrM3YYI", title: "Introduction to Craig Perry - Your Legal Ally at LV Nurse Attorney", uploadDate: D("17:33:03"), seconds: 29, summary: "Meet Craig K. Perry, Esq., who defends nurse and health-professional licenses throughout Nevada.", link: "/about" },
      { id: "Wc2CaPgKULU", title: "Why You Should Hire an Attorney - Your Partner for Nursing Success with LV Nurse Attorney", uploadDate: D("17:33:29"), seconds: 298, summary: "Why to get a free consultation as soon as a board complaint or investigation letter arrives.", link: "/contact" },
      { id: "tzY1J3BNOKA", title: "Be Proactive Early - Your Key to Nursing Success with LV Nurse Attorney", uploadDate: D("17:33:22"), seconds: 146, summary: "Acting early can change the outcome of a complaint or investigation." },
      { id: "GqwLK5QHDKg", title: "Representing Other Medical Professionals - LV Nurse Attorney's Expertise", uploadDate: D("17:32:46"), seconds: 59, summary: "Craig also represents professionals regulated by boards other than the Nevada State Board of Nursing." },
    ],
  },
  {
    title: "The Board Process",
    videos: [
      { id: "wL8Z3KfIc1A", title: "The Complaint Process - Navigating Nursing Challenges with LV Nurse Attorney", uploadDate: D("17:33:33"), seconds: 330, summary: "How a board complaint moves from investigation to resolution.", link: "/discipline-process" },
      { id: "lnZQCzeGwio", title: "What the Nursing Board Can Do to You - Understanding Your Rights with LV Nurse Attorney", uploadDate: D("17:32:24"), seconds: 137, summary: "What the board can do, and your rights while under investigation.", link: "/discipline-process" },
      { id: "QaPA_Fgq8CQ", title: "Can I Work While Under Investigation? Navigating Nursing Challenges with LV Nurse Attorney", uploadDate: D("17:33:14"), seconds: 151, summary: "In almost every case you can keep working while the board investigates." },
      { id: "ixiZf7lBEa8", title: "Effect of a Discipline by the Board - Your Path to Recovery with LV Nurse Attorney", uploadDate: D("17:33:11"), seconds: 168, summary: "What board discipline means for your license and career, and how to recover.", link: "/accusations/reinstatement" },
      { id: "LORjfggVzgs", title: "How Will Discipline Affect My Educational Pursuits? Your Future with LV Nurse Attorney", uploadDate: D("17:33:07"), seconds: 114, summary: "How discipline can affect school, advanced degrees, and future plans." },
      { id: "c8xHd2jRTsA", title: "Making Mistakes, and Admitting Them - How to Regain Trust and Integrity, with LV Nurse Attorney", uploadDate: D("17:34:05"), seconds: 113, summary: "Owning a charting or judgment mistake the right way, and rebuilding trust." },
    ],
  },
  {
    title: "Drugs & Substances",
    videos: [
      { id: "xWVLP_fxJ3Y", title: "Allegations of Diversion of Drugs Explained by LV Nurse Attorney", uploadDate: D("17:34:23"), seconds: 291, summary: "How drug diversion allegations arise and how they are defended.", link: "/accusations/drug-diversion" },
      { id: "14Ah2mtH0W0", title: "Abusing Alcohol or Drugs - LV Nurse Attorney", uploadDate: "2023-09-09T07:27:29-07:00", seconds: 273, summary: "Impairment and substance-use complaints, and the path forward.", link: "/accusations/impairment" },
      { id: "9cWvY5xT5mE", title: "Marijuana Use by Nurses - Understanding the Impact with LV Nurse Attorney", uploadDate: D("17:32:59"), seconds: 118, summary: "Legal in Nevada, but still a licensing risk for nurses.", link: "/accusations/marijuana" },
    ],
  },
  {
    title: "Practice & Patient Care",
    videos: [
      { id: "50fWCTz-0Ig", title: "Failing to Perform According to Nurse Standards - Your Second Chance with LV Nurse Attorney", uploadDate: D("17:33:56"), seconds: 117, summary: "Standard-of-care complaints and how to respond.", link: "/accusations/standard-of-care" },
      { id: "4jiLGDxN8G0", title: "Practicing Outside of Scope - Safeguard Your Nursing Career with LV Nurse Attorney", uploadDate: D("17:33:38"), seconds: 107, summary: "When tasks fall outside your license's scope of practice.", link: "/accusations/scope-of-practice" },
      { id: "H29BDE8hz0M", title: "Crossing Professional Boundaries - Safeguard Your Nursing Career with LV Nurse Attorney", uploadDate: D("17:34:09"), seconds: 138, summary: "Boundary-violation complaints involving patients.", link: "/accusations/boundary-violations" },
      { id: "dSYM9Xp8CAc", title: "Failure to Collaborate - Protect Your Nursing Career with LV Nurse Attorney", uploadDate: D("17:34:00"), seconds: 233, summary: "Conduct and collaboration complaints from coworkers and employers.", link: "/accusations/unprofessional-conduct" },
      { id: "K1ZemvWLY4o", title: "Maintaining Accurate Medical Records - Your Key to Success with LV Nurse Attorney", uploadDate: D("17:33:44"), seconds: 166, summary: "Documentation errors and why accurate charting protects your license.", link: "/accusations/documentation-errors" },
    ],
  },
  {
    title: "Licensing, Renewal & Applications",
    videos: [
      { id: "o4StWufcMCA", title: "Avoiding a Failed CE Audit - LV Nurse Attorney Explains", uploadDate: D("17:34:19"), seconds: 229, summary: "How to avoid, and respond to, a failed continuing-education audit.", link: "/accusations/ce-audit-renewal" },
      { id: "nv3278wZxY0", title: "Late License Renewal - Get Back on Track", uploadDate: D("17:33:49"), seconds: 173, summary: "Missed your renewal deadline? How to fix it and protect your career.", link: "/accusations/ce-audit-renewal" },
      { id: "HWUjbVo4mkE", title: "Filing a Fraudulent Application", uploadDate: D("17:33:52"), seconds: 140, summary: "Errors or omissions on a license application, and how the board treats them.", link: "/accusations/fraudulent-application" },
      { id: "5aPjzj2fWsg", title: "Reporting Discipline from Another State - Ensuring Your Nursing Career with LV Nurse Attorney", uploadDate: D("17:32:51"), seconds: 108, summary: "Your duty to report discipline from another state.", link: "/accusations/out-of-state-discipline" },
    ],
  },
  {
    title: "Criminal & Employment",
    videos: [
      { id: "53eOznxcMac", title: "Being Convicted of a Crime - Your Path to Redemption with LV Nurse Attorney", uploadDate: D("17:34:14"), seconds: 242, summary: "How a criminal conviction affects a Nevada license.", link: "/accusations/license-denial" },
      { id: "n8OGqrbVAR8", title: "Can I Hire You for My Criminal Case?  Your Legal Support Starts with LV Nurse Attorney", uploadDate: D("17:33:18"), seconds: 128, summary: "Yes: Craig handles related criminal cases in the Clark County area.", link: "/accusations/dui-arrest" },
      { id: "LXdfAhImQNE", title: "Sealing Arrest and Criminal Records - Your Second Chance with LV Nurse Attorney", uploadDate: D("17:32:37"), seconds: 142, summary: "Sealing an arrest or criminal record in Nevada." },
      { id: "-kuzykuleCs", title: "Resign or Be Terminated - Your Options and LV Nurse Attorney's Support", uploadDate: D("17:32:41"), seconds: 210, summary: "Resigning versus being fired, and what each means for your license.", link: "/accusations/employer-termination" },
    ],
  },
];

export const ALL_VIDEOS = VIDEO_GROUPS.flatMap((g) => g.videos);
