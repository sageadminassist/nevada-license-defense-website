import { createFileRoute } from "@tanstack/react-router";

import { Section } from "@/components/marketing/sections";
import { IMAGES } from "@/lib/images";
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
      {/* Hero */}
      <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "300px" }}>
        <img src={IMAGES.mountainCaleb2} alt="Nevada mountains" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-dark-blue/50" />
        <div className="relative z-10 max-w-2xl px-6 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-lg text-white/80">Your first consultation is free — call, email, or request a Zoom meeting.</p>
        </div>
      </section>

      {/* Main content */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left — Craig + contact info */}
          <div className="space-y-8">
            {/* Craig photo + intro */}
            <div className="flex gap-6 items-start">
              <img
                src={IMAGES.craigContact}
                alt="Craig K. Perry — Nevada License Defense Attorney"
                className="w-64 h-80 object-cover object-top rounded-xl shadow-lg flex-shrink-0"
              />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-dark-blue">Craig K. Perry</h2>
                <p className="text-gold-dark font-semibold text-sm uppercase tracking-wide">Attorney at Law · 31+ Years Experience</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Craig personally handles every Nevada professional license defense case. When you call, you speak with him — not a paralegal or intake specialist.
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-0.5">Phone</p>
                  <a href={SITE.phoneHref} className="text-2xl font-bold text-dark-blue hover:text-gold-dark transition-colors">
                    {SITE.phoneDisplay}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">After-hours calls accepted for urgent matters</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-0.5">Email</p>
                  <a href={SITE.emailHref} className="text-lg font-semibold text-dark-blue hover:text-gold-dark transition-colors">
                    {SITE.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-0.5">Office</p>
                  <p className="text-dark-blue font-semibold">2300 W Sahara Ave #800</p>
                  <p className="text-gray-600">Las Vegas, NV 89102</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-gold-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-0.5">Hours</p>
                  <p className="text-dark-blue font-semibold">Monday – Friday: 9:00 AM – 5:00 PM</p>
                  <p className="text-gray-500 text-sm">Zoom meetings available</p>
                </div>
              </div>
            </div>

            {/* Consultation callout */}
            <div className="rounded-xl border-l-4 border-gold bg-amber-50 p-5">
              <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
            </div>
          </div>

          {/* Right — portal + firm info */}
          <div className="space-y-5">
            <div className="rounded-xl bg-white p-8 shadow-lg border border-gray-200">
              <h2 className="mb-1 text-2xl font-bold text-dark-blue">Client Portal</h2>
              <p className="mb-6 text-gray-500 text-sm">
                Existing clients can access case files, documents, and billing through our secure portal.
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

            <div className="rounded-xl bg-dark-blue p-8 text-white">
              <h2 className="mb-3 text-xl font-bold">Part of Craig K. Perry &amp; Associates</h2>
              <p className="mb-5 text-white/75 text-sm leading-relaxed">
                Nevada License Defense is a specialized practice of Craig K. Perry &amp; Associates
                — a Las Vegas law firm with over 31 years of experience defending licensed professionals.
              </p>
              <div className="flex flex-col gap-2">
                <a href={SITE.firmUrl} target="_blank" rel="noopener" className="text-gold hover:text-white transition-colors text-sm font-semibold">
                  Visit CraigPerry.com →
                </a>
                <a href="https://lvnurseattorney.com" target="_blank" rel="noopener" className="text-gold hover:text-white transition-colors text-sm font-semibold">
                  Visit LVNurseAttorney.com →
                </a>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
              <iframe
                title="Craig K. Perry & Associates office location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3223.388!2d-115.17528!3d36.14990!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8c432d7b82c7f%3A0x3400f1b1b1b1b1b1!2s2300+W+Sahara+Ave+%23800%2C+Las+Vegas%2C+NV+89102!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
