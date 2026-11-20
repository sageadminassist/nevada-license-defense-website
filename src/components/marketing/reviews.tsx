import { useEffect, useRef, useState } from "react";

import { REVIEWS } from "@/lib/reviews";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = ["#12203b", "#b27e4f", "#2c5f6e", "#2d6a4f", "#7b2d3e", "#4a5568"];

function ReviewCard({ name, rating, date, photoUrl, text }: { name: string; rating: number | null; date: string | null; photoUrl: string | null; text: string }) {
  const [expanded, setExpanded] = useState(false);
  // Initial guess so the button is in the prerendered HTML for long reviews;
  // corrected by the measurement below once mounted in the browser.
  const [canExpand, setCanExpand] = useState(() => text.length > 240);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    // While expanded the clamp is off, so the element no longer overflows:
    // skip measuring then so "Show less" stays visible.
    if (expanded) return;
    const el = quoteRef.current;
    if (!el) return;
    const measure = () => setCanExpand(el.scrollHeight - el.clientHeight > 1);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text, expanded]);

  const avatarColor = AVATAR_COLORS[name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
  const stars = rating ? Math.round(rating) : 0;
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const subline = [date, "via Google"].filter(Boolean).join(" · ");

  return (
    <figure className="flex h-full flex-col rounded-lg bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      {stars > 0 ? (
        <div className="mb-3 text-gold" aria-label={`${stars} out of 5 stars`}>
          {"★".repeat(stars)}
          <span className="text-gray-300">{"★".repeat(5 - stars)}</span>
        </div>
      ) : null}
      <div className="flex-1">
        {/* Collapsed preview height. Change `line-clamp-4` to show more/fewer lines. */}
        <blockquote ref={quoteRef} className={cn("text-gray-600 italic", !expanded && "line-clamp-4")}>
          &ldquo;{text}&rdquo;
        </blockquote>
        {canExpand && (
          <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} className="mt-2 cursor-pointer text-sm font-semibold text-gold-dark hover:text-dark-blue">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
      <figcaption className="mt-6 flex items-center gap-3">
        {photoUrl ? (
          <img src={photoUrl} alt={name} width={40} height={40} loading="lazy" referrerPolicy="no-referrer" className="size-10 shrink-0 rounded-full object-cover" />
        ) : (
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: avatarColor }}>
            {initials}
          </span>
        )}
        <span className="min-w-0">
          <span className="block font-bold tracking-[0.05em] text-dark-blue">{name}</span>
          <span className="block text-xs font-medium text-gray-500">{subline}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Google rating summary plus every saved review. Wrap in a <Section> at the call site. */
export function Reviews() {
  const { reviews, rating, total, googleUrl } = REVIEWS;
  const overallStars = rating ? Math.round(rating) : 0;
  return (
    <>
      {rating ? (
        <div className="mb-10 flex flex-col items-center gap-2 rounded-lg bg-white p-8 text-center shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-dark-blue">{rating.toFixed(1)}</span>
            <span className="text-lg text-gray-500">/ 5</span>
          </div>
          <div className="text-2xl text-gold" aria-label={`${overallStars} out of 5 stars`}>
            {"★".repeat(overallStars)}
            <span className="text-gray-300">{"★".repeat(5 - overallStars)}</span>
          </div>
          <p className="text-gray-600">{total ? `Based on ${total.toLocaleString()} Google reviews` : "Rated on Google"}</p>
          {googleUrl ? (
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="mt-1 font-bold uppercase tracking-[0.1em] text-gold-dark hover:text-dark-blue">
              Read them on Google →
            </a>
          ) : null}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <ReviewCard key={`${r.author}-${i}`} name={r.author} rating={r.rating} date={r.date} photoUrl={r.photoUrl} text={r.text} />
        ))}
      </div>
    </>
  );
}
