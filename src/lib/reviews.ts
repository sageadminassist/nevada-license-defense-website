import store from "@/data/reviews.json";

/**
 * Client reviews, shared with craigperry.com (same Google Business listing).
 *
 * This site is prerendered static HTML, so there is no server to call Google at
 * request time. Instead `scripts/sync-reviews.mjs` pulls the latest reviews from
 * the Google Places API and merges them into `src/data/reviews.json`, which only
 * ever grows (old reviews are never dropped). `bun run deploy` runs that sync
 * before every build.
 */
export interface Review {
  author: string;
  rating: number | null;
  text: string;
  /** Pre-formatted publish date, e.g. "March 2024". */
  date: string | null;
  relativeTime: string | null;
  photoUrl: string | null;
  authorUrl: string | null;
}

export interface ReviewStore {
  savedAt: number;
  reviews: Review[];
  /** Aggregate Google star rating. */
  rating: number | null;
  /** Total number of Google ratings. */
  total: number | null;
  /** Link to the Google listing. */
  googleUrl: string | null;
}

export const REVIEWS = store as ReviewStore;
