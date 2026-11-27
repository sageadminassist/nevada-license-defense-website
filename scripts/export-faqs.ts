// Writes the site's FAQ content to public/api/inc/faqs.json so the server-side
// assistant (public/api/ask.php) answers from exactly what the site says.
import { writeFileSync } from "node:fs";
import { FAQ_GROUPS } from "../src/lib/faqs";
import { slugify } from "../src/lib/search-index";
import { SITE } from "../src/lib/site";

let n = 0;

const out = {
  phone: SITE.phoneDisplay,
  consultation: SITE.consultation,
  // `id` is what the assistant cites; `anchor` is the question's spot on the FAQ page.
  groups: FAQ_GROUPS.map((g) => ({
    topic: g.title,
    items: g.items.map((i) => ({
      id: ++n,
      q: i.q,
      a: i.a,
      page: i.source?.to ?? "/faq",
      pageLabel: i.source?.label ?? "FAQ",
      anchor: slugify(i.q),
    })),
  })),
};
const file = new URL("../public/api/inc/faqs.json", import.meta.url);
writeFileSync(file, JSON.stringify(out));
console.log(`[faqs] wrote ${out.groups.reduce((n, g) => n + g.items.length, 0)} FAQs`);
