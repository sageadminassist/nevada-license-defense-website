/**
 * Pull the latest Google reviews and merge them into src/data/reviews.json.
 *
 *   bun run reviews:sync
 *
 * Same rules as craigperry.com: 5-star reviews with text only, deduped by
 * author + text, and the saved list only grows. Needs GOOGLE_PLACES_API_KEY and
 * GOOGLE_PLACE_ID in .env.local (gitignored). Never fails the caller: with no
 * key, or if Google errors, the saved reviews are left as they are.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const FILE = fileURLToPath(new URL("../src/data/reviews.json", import.meta.url));

const key = (r) => `${r.author}::${r.text.slice(0, 80)}`;

async function main() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) {
    console.log("[reviews] no Google key in .env.local, keeping saved reviews.");
    return;
  }

  const existing = JSON.parse(await readFile(FILE, "utf8"));

  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    },
  });
  if (!res.ok) throw new Error(`Places API responded ${res.status}`);

  const data = await res.json();

  const incoming = (data.reviews ?? [])
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? "Google reviewer",
      rating: typeof r.rating === "number" ? r.rating : null,
      text: r.text?.text ?? r.originalText?.text ?? "",
      date: r.publishTime ? new Date(r.publishTime).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : null,
      relativeTime: r.relativePublishTimeDescription ?? null,
      photoUrl: r.authorAttribution?.photoUri ?? null,
      authorUrl: r.authorAttribution?.uri ?? null,
    }))
    .filter((r) => r.rating === 5 && r.text.trim().length > 0);

  const seen = new Set(existing.reviews.map(key));
  const added = incoming.filter((r) => !seen.has(key(r)));
  const rating = typeof data.rating === "number" ? data.rating : existing.rating;
  const total = typeof data.userRatingCount === "number" ? data.userRatingCount : existing.total;
  const googleUrl = data.googleMapsUri ?? existing.googleUrl;

  if (added.length === 0 && rating === existing.rating && total === existing.total && googleUrl === existing.googleUrl) {
    console.log(`[reviews] up to date (${existing.reviews.length} saved, ${rating} from ${total} ratings).`);
    return;
  }

  const next = { savedAt: Date.now(), reviews: [...existing.reviews, ...added], rating, total, googleUrl };
  await writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`[reviews] added ${added.length} new, ${next.reviews.length} saved (${rating} from ${total} ratings).`);
}

main().catch((err) => {
  console.error("[reviews] sync failed, keeping saved reviews:", err);
});
