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
          <div className="space-y-6 text-gray-700">
            <p className="text-lg">
              If you're facing a complaint, investigation, or disciplinary action before a Nevada
              state licensing board, call us today. Your first consultation is free.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-gold-dark">Phone</p>
                <a href={SITE.phoneHref} className="text-3xl font-bold text-dark-blue hover:text-gold-dark transition-colors">
                  {SITE.phoneDisplay}
                </a>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-gold-dark">Email</p>
                <a href={SITE.emailHref} className="text-lg text-dark-blue hover:text-gold-dark transition-colors">
                  {SITE.email}
                </a>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-gold-dark">Office</p>
                <p>
                  2300 W Sahara Ave #800<br />
                  Las Vegas, NV 89102
                </p>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-gold-dark">Hours</p>
                <p>
                  Monday – Friday: 9:00 AM – 5:00 PM<br />
                  After-hours calls accepted for urgent matters
                </p>
              </div>
            </div>
            <div className="rounded-lg border-l-4 border-gold bg-gray-50 p-6">
              <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-white p-8 shadow-lg border border-gray-200">
              <h2 className="mb-4 text-2xl font-bold text-dark-blue">Client Portal Login</h2>
              <p className="mb-6 text-gray-600">
                Existing clients can access their case files and documents through our secure
                client portal.
              </p>
              <a
                href={SITE.mycaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-block"
              >
                Login to Client Portal →
              </a>
            </div>

            <div className="rounded-lg bg-dark-blue p-8 text-white">
              <h2 className="mb-3 text-2xl font-bold">Part of Craig K. Perry &amp; Associates</h2>
              <p className="mb-4 text-white/80">
                Nevada License Defense is a division of Craig K. Perry &amp; Associates, a Las
                Vegas law firm with over 31 years of experience.
              </p>
              <a
                href={SITE.firmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-white transition-colors underline-offset-4 hover:underline"
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
