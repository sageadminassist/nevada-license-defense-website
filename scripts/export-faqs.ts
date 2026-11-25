// Writes the site's FAQ content to public/api/inc/faqs.json so the server-side
// assistant (public/api/ask.php) answers from exactly what the site says.
import { writeFileSync } from "node:fs";
import { FAQ_GROUPS } from "../src/lib/faqs";
import { SITE } from "../src/lib/site";

const out = {
  phone: SITE.phoneDisplay,
  consultation: SITE.consultation,
  groups: FAQ_GROUPS.map((g) => ({
    topic: g.title,
    items: g.items.map((i) => ({ q: i.q, a: i.a, page: i.source?.to ?? "/faq" })),
  })),
};
const file = new URL("../public/api/inc/faqs.json", import.meta.url);
writeFileSync(file, JSON.stringify(out));
console.log(`[faqs] wrote ${out.groups.reduce((n, g) => n + g.items.length, 0)} FAQs`);
