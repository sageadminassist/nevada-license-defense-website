import { useState } from "react";
import type { Video } from "@/lib/accusations";

// Custom thumbnails (public/images/video-thumbs/<id>.webp) made for Craig's videos.
const LOCAL_THUMBS = new Set([
  "xWVLP_fxJ3Y", "o4StWufcMCA", "53eOznxcMac", "H29BDE8hz0M", "c8xHd2jRTsA", "dSYM9Xp8CAc", "50fWCTz-0Ig",
  "HWUjbVo4mkE", "nv3278wZxY0", "K1ZemvWLY4o", "4jiLGDxN8G0", "wL8Z3KfIc1A", "Wc2CaPgKULU", "tzY1J3BNOKA",
  "n8OGqrbVAR8", "QaPA_Fgq8CQ", "ixiZf7lBEa8", "LORjfggVzgs", "RQ63vrM3YYI", "9cWvY5xT5mE",
  "-kuzykuleCs", "14Ah2mtH0W0", "5aPjzj2fWsg",
]);

/** Click-to-load YouTube embed (no YouTube JS until clicked) + VideoObject JSON-LD. */
export function VideoEmbed({ video, description }: { video: Video; description: string }) {
  const [play, setPlay] = useState(false);
  const thumb = LOCAL_THUMBS.has(video.id)
    ? `/images/video-thumbs/${video.id}.webp`
    : `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description,
    thumbnailUrl: thumb.startsWith("/") ? `https://nevadalicensedefense.com${thumb}` : thumb,
    uploadDate: video.uploadDate,
    duration: `PT${Math.floor(video.seconds / 60)}M${video.seconds % 60}S`,
    contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
    author: { "@type": "Person", "@id": "https://nevadalicensedefense.com/#craig-perry", name: "Craig K. Perry" },
  };
  return (
    <div className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg bg-black">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${video.title}`}>
            <img src={thumb} alt={video.title} loading="lazy" className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold shadow-xl group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9 fill-dark-blue"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="mt-3 text-center text-sm text-gray-500">
        {video.title} · <a href="https://www.youtube.com/@lvnurseattorney" target="_blank" rel="noopener" className="font-semibold text-dark-blue hover:text-gold">More videos from Craig</a>
      </p>
    </div>
  );
}
