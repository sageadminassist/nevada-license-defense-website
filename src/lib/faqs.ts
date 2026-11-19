// Shared FAQ / guide content used by pages, the FAQ hub, and site search.
import { ACCUSATIONS, GROUPS } from "@/lib/accusations";
import { BOARDS } from "@/lib/boards";

export const GENERAL_FAQS = [
  ["When should I contact an attorney about a board complaint?", "As soon as possible — ideally before you respond to the board at all. You always have more options the earlier you start, and the initial consultation with Craig K. Perry is free. If you've received a Notice of Investigation, the board typically expects a response within 14 days."],
  ["Do I have to self-report to my licensing board?", "It depends on your license type, the nature of the issue, and the specific circumstances. Self-reporting can carry real consequences and should not be done without first consulting an attorney. We can help you determine your obligations and how to respond strategically."],
  ["What happens at a disciplinary hearing?", "A disciplinary hearing is an administrative proceeding before your licensing board. You have the right to be represented by an attorney, to present evidence, and to cross-examine witnesses. The outcome can range from a reprimand or fine to license suspension or revocation. Having experienced legal representation significantly improves your odds."],
  ["Can I keep practicing while under investigation?", "Usually yes — a license investigation does not automatically suspend your license. However, the board can seek an emergency suspension in serious cases. Contact us immediately if you receive any communication from your licensing board."],
  ["How long does a board investigation take?", "It varies widely — from a few months to over a year, depending on the complexity of the case and the board involved. Some matters can be resolved quickly through informal conferences; others proceed to formal hearings. We'll give you a realistic picture of your timeline at the outset."],
  ["What does it cost to hire Craig K. Perry?", "Fees vary by case complexity. The initial consultation is always free. We'll discuss fee structures at that consultation — including whether a flat fee, retainer, or other arrangement makes sense for your situation."],
  ["My malpractice insurer assigned me an attorney — do I still need my own?", "It depends. Malpractice defense attorneys represent your insurer's interests, which may not align perfectly with yours — particularly when it comes to your license. A separate attorney focused on your license defense can be critical, especially if the board investigation parallels a civil case."],
  ["Can a revoked or surrendered license be reinstated?", "Often yes. After a specified period (which varies by board and by the nature of the original action), you may petition for reinstatement. We can help you build the strongest possible case for returning to practice."],
] as const;

export const PROCESS_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["A complaint is filed", "Most cases start with a complaint from a patient, client, employer, coworker, insurer, or another agency. Boards also open cases on their own after malpractice reports, criminal arrests, failed drug screens, prescription monitoring (PMP) data, or a licensee's own disclosure on a renewal application."],
  ["You receive a Notice of Investigation", "The board notifies you in writing and usually asks for a written response, records, or an interview. Response deadlines are short — often around 14 days. This is the most important moment in the case: what you submit becomes evidence. Do not call the investigator or send a response before speaking with a license defense attorney."],
  ["The board investigates", "An investigator gathers records, interviews witnesses, and may request a mental, physical, or substance-use evaluation. Many boards also use outside expert reviewers to judge whether the standard of care was met."],
  ["A board committee reviews the file", "An investigative or screening committee decides what happens next. Typical options are dismissal, a non-disciplinary letter of warning or concern, or authorizing a formal complaint (also called an accusation or notice of charges)."],
  ["Settlement is negotiated — or not", "Most Nevada board cases resolve by agreement before a hearing, through a stipulation or consent agreement. Terms can include education, fines, monitoring, practice restrictions, or probation. A well-prepared defense often means lighter terms or a non-disciplinary outcome."],
  ["Formal hearing under NRS Chapter 233B", "If the case does not settle, it goes to a contested hearing governed by the Nevada Administrative Procedure Act (NRS Chapter 233B). You have the right to an attorney, to present evidence and witnesses, and to cross-examine the board's witnesses. The board, or a hearing officer, then issues written findings and a decision."],
  ["Decision and sanctions", "Possible outcomes range from dismissal to public reprimand, fines and costs, continuing education, probation with monitoring, practice limits, suspension, or revocation. Public discipline is generally posted on the board's website and, for health professionals, reported to the National Practitioner Data Bank (NPDB)."],
  ["Judicial review (appeal)", "A licensee who disagrees with a final decision can petition the Nevada district court for judicial review under NRS 233B.130. The petition generally must be filed within 30 days after the final decision is served, so the deadline is easy to miss."],
];

export const PROCESS_FAQS: ReadonlyArray<readonly [string, string]> = [
  ["Can a Nevada licensing board suspend my license before a hearing?", "Yes, in limited cases. Under NRS 233B.127, a board can order an emergency (summary) suspension when it finds that public health, safety, or welfare requires immediate action. A prompt hearing must follow. Most investigations do not involve a summary suspension."],
  ["Is a Notice of Investigation the same as discipline?", "No. An investigation is not discipline, and many investigations end in dismissal or a non-disciplinary letter. How you respond at this stage strongly affects whether the case goes further."],
  ["Do I have to tell my employer about a board investigation?", "It depends on your license, your employment contract, and facility policies. Some obligations are mandatory; others are not. Ask your attorney before disclosing."],
  ["Will board discipline show up publicly?", "Formal discipline is generally public and appears on the board's license lookup. Dismissals and many non-disciplinary outcomes are not. Health-care discipline is also typically reported to the National Practitioner Data Bank."],
  ["How long does the Nevada board discipline process take?", "Anywhere from a few months to more than a year, depending on the board, the complexity of the allegations, expert review, and whether the case settles or goes to hearing."],
];

export const NURSING_FAQS = [
  ["When should I contact an attorney?", "As soon as possible. You always have more options the earlier you start — and the initial consultation is free. If you've received a Notice of Investigation, the NSBN typically expects a response within 14 days."],
  ["Do I have to report an arrest to the Board?", "Not always — arrests don't automatically need to be reported, but convictions must be handled carefully. Talk with an attorney before disclosing anything."],
  ["My employer told me to self-report. Should I?", "Self-reporting deserves careful thought — it can carry real consequences. Discuss your situation with experienced counsel before you act."],
  ["Someone from the Board called me — should I talk to them?", "Be careful. Anything you say can be used against you. Consult an attorney before responding or calling back."],
  ["Can I get a revoked license back?", "Often yes. After a period of time, nurses whose licenses were revoked or surrendered may pursue reinstatement. We can help you build a plan to return to practice."],
] as const;

// ---------- FAQ hub (all questions, grouped) ----------

export type FaqItem = { q: string; a: string; source?: { label: string; to: string } };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

const BOARD_ORDER = ["nursing", "pharmacy", "medical", "osteopathic", "dental", "chiropractic", "veterinary", "physical-therapy", "occupational-therapy", "psychology", "marriage-family-therapy", "social-work", "respiratory", "radiology"];

function dedupe(items: FaqItem[]): FaqItem[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.q) ? false : (seen.add(i.q), true)));
}

const RAW_GROUPS: FaqGroup[] = [
  {
    id: "general",
    title: "Getting Help & Working With Craig",
    items: GENERAL_FAQS.map(([q, a]) => ({ q, a })),
  },
  {
    id: "process",
    title: "The Nevada Board Discipline Process",
    items: PROCESS_FAQS.map(([q, a]) => ({ q, a, source: { label: "Board Discipline Process", to: "/discipline-process" } })),
  },
  ...GROUPS.map((g) => ({
    id: g.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, ""),
    title: g,
    items: dedupe(
      ACCUSATIONS.filter((x) => x.group === g).flatMap((x) =>
        x.faqs.map(([q, a]) => ({ q, a, source: { label: x.nav, to: `/accusations/${x.slug}` } })),
      ),
    ),
  })),
  {
    id: "boards",
    title: "Specific Nevada Licensing Boards",
    items: dedupe([
      ...NURSING_FAQS.map(([q, a]) => ({ q, a, source: { label: "Board of Nursing", to: "/nursing" } })),
      // board-specific questions only (skip the two generic ones repeated on every board page)
      ...BOARD_ORDER.flatMap((slug) =>
        BOARDS[slug].faqs.slice(0, -2).map(([q, a]) => ({ q, a, source: { label: BOARDS[slug].board, to: `/${slug}` } })),
      ),
    ]),
  },
];

// Remove questions repeated across groups (first occurrence wins).
const SEEN = new Set<string>();
export const FAQ_GROUPS: FaqGroup[] = RAW_GROUPS.map((g) => ({
  ...g,
  items: g.items.filter((i) => {
    const k = i.q.toLowerCase().replace(/[^a-z]/g, "");
    return SEEN.has(k) ? false : (SEEN.add(k), true);
  }),
}));

export const FAQ_COUNT = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0);
