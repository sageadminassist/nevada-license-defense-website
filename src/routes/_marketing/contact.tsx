import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/marketing/site-header";
import { Section, SectionTitle } from "@/components/marketing/sections";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/contact")({
  head: () => ({
    meta: [
      { title: "Contact Nevada License Defense | 702.893.4777" },
      {
        name: "description",
        content:
          "Contact Craig K. Perry & Associates for a free Nevada professional license defense consultation. Call 702.893.4777 or email info@craigperry.com.",
      },
      { property: "og:title", content: "Contact Nevada License Defense | 702.893.4777" },
      {
        property: "og:description",
        content:
          "Contact Craig K. Perry for a free consultation on your Nevada professional license defense case. 702.893.4777.",
      },
      { property: "og:url", content: "https://nevadalicensedefense.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/contact" }],
  }),
  component: ContactRoute,
});

function ContactRoute() {
  return (
    <>
      <SiteHeader />
      <Section>
        <SectionTitle as="h1">Contact Us</SectionTitle>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-navy">
            <p className="text-lg">
              If you're facing a complaint, investigation, or disciplinary action before a Nevada
              state licensing board, call us today. Your first consultation is free.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-gold">Phone</p>
                <a
                  href={SITE.phoneHref}
                  className="font-heading text-3xl font-bold text-navy hover:text-gold"
                >
                  {SITE.phoneDisplay}
                </a>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-gold">Email</p>
                <a
                  href={SITE.emailHref}
                  className="text-lg text-navy hover:text-gold"
                >
                  {SITE.email}
                </a>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-gold">Office</p>
                <p className="text-navy">
                  2300 W Sahara Ave #800<br />
                  Las Vegas, NV 89102
                </p>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-gold">Hours</p>
                <p className="text-navy">
                  Monday – Friday: 9:00 AM – 5:00 PM<br />
                  After-hours calls accepted for urgent matters
                </p>
              </div>
            </div>
            <div className="rounded-lg border-l-4 border-gold bg-muted p-6">
              <p className="font-semibold text-navy">{SITE.consultation}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-card p-8 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
              <h2 className="mb-4 font-heading text-2xl font-bold text-navy">
                Client Portal Login
              </h2>
              <p className="mb-6 text-muted-foreground">
                Existing clients can access their case files and documents through our secure
                client portal.
              </p>
              <a
                href={SITE.mycaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-gold px-6 py-3 font-bold uppercase tracking-[0.1em] text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-dark"
              >
                Login to Client Portal →
              </a>
            </div>

            <div className="rounded-lg bg-navy p-8 text-white">
              <h2 className="mb-3 font-heading text-2xl font-bold">
                Part of Craig K. Perry &amp; Associates
              </h2>
              <p className="mb-4 text-white/80">
                Nevada License Defense is a division of Craig K. Perry &amp; Associates, a Las
                Vegas law firm with over 31 years of experience.
              </p>
              <a
                href={SITE.firmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 underline-offset-4 hover:underline"
              >
                Visit CraigPerry.com →
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
