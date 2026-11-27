import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { REVIEWS, type Review } from "@/lib/reviews";

const AVATAR_COLORS = ["#12203b", "#b27e4f", "#2c5f6e", "#2d6a4f", "#7b2d3e", "#4a5568"];

function Stars({ rating, className }: { rating: number | null; className?: string }) {
  const stars = rating ? Math.round(rating) : 0;
  if (!stars) return null;
  return (
    <div className={`text-gold ${className ?? ""}`} aria-label={`${stars} out of 5 stars`}>
      {"★".repeat(stars)}
      <span className="text-gray-300">{"★".repeat(5 - stars)}</span>
    </div>
  );
}

function Reviewer({ review, large }: { review: Review; large?: boolean }) {
  const name = review.author;
  const avatarColor = AVATAR_COLORS[name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const subline = [review.date, "via Google"].filter(Boolean).join(" · ");
  const size = large ? "size-12" : "size-10";
  return (
    <div className="flex items-center gap-3">
      {review.photoUrl ? (
        <img src={review.photoUrl} alt={name} width={48} height={48} loading="lazy" referrerPolicy="no-referrer" className={`${size} shrink-0 rounded-full object-cover`} />
      ) : (
        <span aria-hidden className={`flex ${size} shrink-0 items-center justify-center rounded-full text-sm font-bold text-white`} style={{ backgroundColor: avatarColor }}>
          {initials}
        </span>
      )}
      <span className="min-w-0">
        <span className={`block font-bold tracking-[0.05em] text-dark-blue ${large ? "text-lg" : ""}`}>{name}</span>
        <span className="block text-xs font-medium text-gray-500">{subline}</span>
      </span>
    </div>
  );
}

function ReviewCard({ review, onOpen }: { review: Review; onOpen: () => void }) {
  // Initial guess so the button is in the prerendered HTML for long reviews;
  // corrected by the measurement below once mounted in the browser.
  const [canExpand, setCanExpand] = useState(() => review.text.length > 240);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    const measure = () => setCanExpand(el.scrollHeight - el.clientHeight > 1);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [review.text]);

  return (
    <figure className="flex h-full flex-col rounded-lg bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.1)] sm:p-8">
      <Stars rating={review.rating} className="mb-3" />
      <div className="flex-1">
        {/* Preview height. Change `line-clamp-4` to show more/fewer lines. */}
        <blockquote ref={quoteRef} className="line-clamp-4 text-gray-600 italic">
          &ldquo;{review.text}&rdquo;
        </blockquote>
        {canExpand && (
          <button type="button" onClick={onOpen} aria-haspopup="dialog" className="mt-4 cursor-pointer rounded-lg bg-gold px-4 py-2 text-sm font-bold text-dark-blue transition-colors duration-300 hover:bg-gold-dark">
            Read more
          </button>
        )}
      </div>
      <figcaption className="mt-6">
        <Reviewer review={review} />
      </figcaption>
    </figure>
  );
}

/** Full review in a large, easy-to-read pop-up. Closes on X, Escape, or a click outside. */
function ReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-dark-blue/70 p-4 backdrop-blur-sm animate-fade-in" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={`Review from ${review.author}`} className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-scale-in">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5 md:px-10">
          <div className="space-y-3">
            <Reviewer review={review} large />
            <Stars rating={review.rating} className="text-xl" />
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close review" className="-mr-2 cursor-pointer rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-dark-blue">
            <X className="size-6" />
          </button>
        </div>
        <blockquote className="overflow-y-auto px-6 py-7 text-lg leading-relaxed text-gray-700 md:px-10 md:text-xl md:leading-relaxed">
          &ldquo;{review.text}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}

const FIRST_PHONE = 3;
const FIRST_DESKTOP = 6;

/** Google rating summary plus every saved review. Wrap in a <Section> at the call site. */
export function Reviews() {
  const { reviews, rating, total, googleUrl } = REVIEWS;
  const [open, setOpen] = useState<Review | null>(null);
  const close = useRef(() => setOpen(null)).current;
  const [showAll, setShowAll] = useState(false);
  const listTop = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={listTop} className="scroll-mt-32" />
      {rating ? (
        <div className="mb-8 flex flex-col items-center gap-2 rounded-lg bg-white p-6 text-center sm:mb-10 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-dark-blue">{rating.toFixed(1)}</span>
            <span className="text-lg text-gray-500">/ 5</span>
          </div>
          <Stars rating={rating} className="text-2xl" />
          <p className="text-gray-600">{total ? `Based on ${total.toLocaleString()} Google reviews` : "Rated on Google"}</p>
          {googleUrl ? (
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="mt-1 font-bold uppercase tracking-[0.1em] text-gold-dark hover:text-dark-blue">
              Read them on Google →
            </a>
          ) : null}
        </div>
      ) : null}
      {/* Three reviews on phones, six on larger screens; the rest stay in the page (for search
          engines) but are hidden until "Read more reviews" is pressed. */}
      <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <div
            key={`${r.author}-${i}`}
            className={showAll || i < FIRST_PHONE ? "h-full" : i < FIRST_DESKTOP ? "hidden h-full md:block" : "hidden"}
          >
            <ReviewCard review={r} onOpen={() => setOpen(r)} />
          </div>
        ))}
      </div>
      {reviews.length > FIRST_PHONE && (
        <div className={`mt-8 text-center ${reviews.length > FIRST_DESKTOP ? "" : "md:hidden"}`}>
          <button
            type="button"
            onClick={() => {
              if (showAll) listTop.current?.scrollIntoView({ block: "start" });
              setShowAll((v) => !v);
            }}
            aria-expanded={showAll}
            className="btn-primary"
          >
            {showAll ? "Show fewer reviews" : `Read more reviews (${reviews.length} total)`}
          </button>
        </div>
      )}
      {open ? <ReviewModal review={open} onClose={close} /> : null}
    </>
  );
}
