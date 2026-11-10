import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import appCss from "../index.css?url";
import { SiteHeader } from "@/components/marketing/site-header";
import { NLD_LD, SITE } from "@/lib/site";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Nevada License Defense | Medical Professional License Attorney | 702.893.4777",
      },
      {
        name: "description",
        content:
          "Nevada License Defense — Craig K. Perry & Associates defends physicians, pharmacists, nurses, and allied health professionals before Nevada state licensing boards. 31+ years' experience. Free consultation.",
      },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#1a2332" },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Nevada License Defense | Medical Professional License Attorney",
      },
      {
        property: "og:description",
        content:
          "Craig K. Perry & Associates defends physicians, pharmacists, nurses, and licensed health professionals before Nevada state licensing boards. Free consultation.",
      },
      { property: "og:site_name", content: "Nevada License Defense" },
      { property: "og:url", content: "https://nevadalicensedefense.com" },
      {
        property: "og:image",
        content: "https://nevadalicensedefense.com/images/craig_blue_arms_crossed.jpg",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Craig K. Perry, Nevada Medical License Defense Attorney" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Nevada License Defense | Medical Professional License Attorney",
      },
      {
        name: "twitter:description",
        content:
          "Craig K. Perry & Associates defends physicians, pharmacists, nurses, and licensed health professionals before Nevada state licensing boards.",
      },
      {
        name: "twitter:image",
        content: "https://nevadalicensedefense.com/images/craig_blue_arms_crossed.jpg",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;600;700&display=swap",
      },
      { rel: "icon", type: "image/svg+xml", href: "/images/NEVADA LICENSE DEFENSE LOGO-SVG.svg" },
      { rel: "canonical", href: "https://nevadalicensedefense.com" },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-2 text-6xl font-bold text-gold">404</p>
        <h1 className="mb-4 text-3xl font-bold text-dark-blue">Page Not Found</h1>
        <p className="mb-8 max-w-md text-gray-600">
          The page you're looking for doesn't exist. If you need legal help, call us directly.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a href={SITE.phoneHref} className="btn-gold">
            {SITE.phoneDisplay}
          </a>
          <Link to="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(NLD_LD) }}
        />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
