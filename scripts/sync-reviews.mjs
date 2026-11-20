/**
 * Pull the latest Google reviews and merge them into src/data/reviews.json.
 *
 *   bun run reviews:sync
 *
 * Same rules as craigperry.com: 5-star reviews with text only, deduped by
 * author + text, and the saved list only grows.
 *
 * Reads GOOGLE_PLACES_API_KEY plus one Place ID per Google listing:
 * GOOGLE_PLACE_ID (main listing) and, optionally, GOOGLE_PLACE_ID_2. Locally
 * these come from .env.local (gitignored); in GitHub Actions from repo secrets.
 * The rating box shows both listings combined; the Google link goes to the main one.
 *
 * Never fails the caller: with no key, or if Google errors for a listing, what
 * is already saved for that listing is kept.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const FILE = fileURLToPath(new URL("../src/data/reviews.json", import.meta.url));

const key = (r) => `${r.author}::${r.text.slice(0, 80)}`;

async function fetchListing(apiKey, placeId) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    },
  });
  if (!res.ok) throw new Error(`Places API responded ${res.status}`);
  const data = await res.json();
  const reviews = (data.reviews ?? [])
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? "Google reviewer",
      rating: typeof r.rating === "number" ? r.rating : null,
      text: r.text?.text ?? r.originalText?.text ?? "",
      date: r.publishTime ? new Date(r.publishTime).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "America/Los_Angeles" }) : null,
      relativeTime: r.relativePublishTimeDescription ?? null,
      photoUrl: r.authorAttribution?.photoUri ?? null,
      authorUrl: r.authorAttribution?.uri ?? null,
    }))
    .filter((r) => r.rating === 5 && r.text.trim().length > 0);
  return {
    reviews,
    listing: {
      rating: typeof data.rating === "number" ? data.rating : null,
      total: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
      googleUrl: data.googleMapsUri ?? null,
    },
  };
}

async function main() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeIds = [process.env.GOOGLE_PLACE_ID, process.env.GOOGLE_PLACE_ID_2];
  if (!apiKey || !placeIds[0]) {
    console.log("[reviews] no Google key / Place ID, keeping saved reviews.");
    return;
  }

  const existing = JSON.parse(await readFile(FILE, "utf8"));
  // One entry per listing, by position. A listing we can't reach this run
  // (no Place ID on this machine, or Google errored) keeps its saved numbers.
  const listings = existing.listings ?? [{ rating: existing.rating, total: existing.total, googleUrl: existing.googleUrl }];
  const seen = new Set(existing.reviews.map(key));
  const added = [];

  for (const [i, placeId] of placeIds.entries()) {
    if (!placeId) continue;
    try {
      const { reviews, listing } = await fetchListing(apiKey, placeId);
      listings[i] = { ...listings[i], ...Object.fromEntries(Object.entries(listing).filter(([, v]) => v !== null)) };
      for (const r of reviews) {
        if (!seen.has(key(r))) {
          seen.add(key(r));
          added.push(r);
        }
      }
    } catch (err) {
      console.error(`[reviews] listing ${i + 1} failed, keeping what is saved:`, err.message);
    }
  }

  const rated = listings.filter((l) => l && typeof l.rating === "number" && typeof l.total === "number" && l.total > 0);
  const total = rated.reduce((n, l) => n + l.total, 0) || existing.total;
  const rating = rated.length ? Math.round((rated.reduce((n, l) => n + l.rating * l.total, 0) / total) * 10) / 10 : existing.rating;
  const googleUrl = listings[0]?.googleUrl ?? existing.googleUrl;

  const next = { savedAt: existing.savedAt, reviews: [...existing.reviews, ...added], rating, total, googleUrl, listings };
  if (added.length === 0 && JSON.stringify({ ...next, savedAt: 0 }) === JSON.stringify({ ...existing, savedAt: 0 })) {
    console.log(`[reviews] up to date (${existing.reviews.length} saved, ${rating} from ${total} ratings).`);
    return;
  }
  next.savedAt = Date.now();
  await writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`[reviews] added ${added.length} new, ${next.reviews.length} saved (${rating} from ${total} ratings across ${rated.length} listing(s)).`);
}

main().catch((err) => {
  console.error("[reviews] sync failed, keeping saved reviews:", err);
});
