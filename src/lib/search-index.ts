// Static site-search index built from the same data that renders the pages.
import { ACCUSATIONS } from "@/lib/accusations";
import { BOARDS } from "@/lib/boards";
import { FAQ_GROUPS, PROCESS_STEPS } from "@/lib/faqs";

export type SearchDoc = { title: string; url: string; type: "Page" | "Board" | "Accusation" | "FAQ"; text: string; snippet: string };

const BOARD_ORDER = ["nursing", "pharmacy", "medical", "osteopathic", "dental", "chiropractic", "veterinary", "physical-therapy", "occupational-therapy", "psychology", "marriage-family-therapy", "social-work", "respiratory", "radiology"];

export const SEARCH_DOCS: SearchDoc[] = [
  { title: "Home — Nevada License Defense", url: "/", type: "Page", snippet: "Nevada professional license defense for nurses, physicians, pharmacists and health professionals.", text: "home nevada license defense attorney lawyer craig perry las vegas reno professional license medical nurse physician pharmacist free consultation" },
  { title: "Contact & Free Consultation", url: "/contact", type: "Page", snippet: "Free 30–45 minute consultation, in person in Las Vegas or by secure Zoom. 702.893.4777.", text: "contact phone call email address 2300 w sahara ave suite 800 las vegas free consultation zoom appointment" },
  { title: "Frequently Asked Questions", url: "/faq", type: "Page", snippet: "Answers to common questions about Nevada licensing board complaints.", text: "faq frequently asked questions answers" },
  { title: "Nevada Board Discipline Process, Step by Step", url: "/discipline-process", type: "Page", snippet: "Complaint, Notice of Investigation, investigation, settlement, NRS 233B hearing, sanctions, and judicial review.", text: "discipline process steps notice of investigation hearing appeal judicial review NRS 233B " + PROCESS_STEPS.map(([t, b]) => `${t} ${b}`).join(" ") },
  { title: "All Accusations We Defend", url: "/accusations", type: "Page", snippet: "Guides to the 20 most common complaints against Nevada licensed professionals.", text: "accusations allegations complaints list guides" },
  ...BOARD_ORDER.map((slug) => {
    const b = BOARDS[slug];
    return {
      title: `${b.board} Defense`,
      url: `/${slug}`,
      type: "Board" as const,
      snippet: `Defense for ${b.pros} before the ${b.board}${b.nrs.startsWith("NRS") ? ` (${b.nrs})` : ""}.`,
      text: `${b.board} ${b.nrs} ${b.pros} ${b.short} license board ${b.faqs.map(([q, a]) => `${q} ${a}`).join(" ")}`,
    };
  }),
  ...ACCUSATIONS.map((a) => ({
    title: a.nav,
    url: `/accusations/${a.slug}`,
    type: "Accusation" as const,
    snippet: a.description.replace(/ ?702\.893\.4777\.?$/, ""),
    text: `${a.nav} ${a.h1} ${a.group} ${a.answer} ${a.forms.join(" ")} ${a.process} ${a.defense.join(" ")} ${a.now.join(" ")} ${a.faqs.map(([q, x]) => `${q} ${x}`).join(" ")}`,
  })),
  ...FAQ_GROUPS.flatMap((g) =>
    g.items.map((i) => ({ title: i.q, url: `/faq#${slugify(i.q)}`, type: "FAQ" as const, snippet: i.a, text: `${i.q} ${i.a}` })),
  ),
];

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

/** Simple ranked search: every term must match; title hits weigh most. */
export function searchSite(query: string, limit = 12): SearchDoc[] {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const typeBoost = { Accusation: 3, Board: 3, Page: 2, FAQ: 0 } as const;
  return SEARCH_DOCS.map((d) => {
    const title = d.title.toLowerCase();
    const body = `${d.snippet} ${d.text}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      const inTitle = title.includes(t);
      const inBody = body.includes(t);
      if (!inTitle && !inBody) return null;
      score += (inTitle ? 10 : 0) + (inBody ? 2 : 0);
    }
    return { d, score: score + typeBoost[d.type] };
  })
    .filter((x): x is { d: SearchDoc; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.d);
}
