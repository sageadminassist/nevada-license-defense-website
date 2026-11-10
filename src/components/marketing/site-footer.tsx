import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy px-8 py-8 text-center text-white">
      <div className="mx-auto max-w-6xl space-y-2">
        <p>&copy; {year} {SITE.name}. All rights reserved.</p>
        <p className="text-white/85">
          A division of{" "}
          <a
            href={SITE.firmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline text-gold/80 hover:text-gold"
          >
            {SITE.firmName}
          </a>
        </p>
        <p className="text-white/85">
          <a href={SITE.phoneHref} className="underline-offset-4 hover:underline">
            {SITE.phoneDisplay}
          </a>
          {" · "}
          <a href={SITE.emailHref} className="underline-offset-4 hover:underline">
            {SITE.email}
          </a>
        </p>
        <p className="flex justify-center gap-4">
          <Link to="/contact" className="text-white/85 underline-offset-4 hover:underline">
            Contact Us
          </Link>
          <span className="text-white/40">·</span>
          <Link to="/faq" className="text-white/85 underline-offset-4 hover:underline">
            FAQ
          </Link>
        </p>
      </div>
    </footer>
  );
}
