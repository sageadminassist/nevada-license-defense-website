import { createFileRoute } from "@tanstack/react-router";

import { FaqList, Section, SectionTitle } from "@/components/marketing/sections";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Nevada License Defense | Craig K. Perry" },
      {
        name: "description",
        content:
          "Frequently asked questions about Nevada professional license defense — nursing board complaints, medical board investigations, and working with Craig K. Perry & Associates.",
      },
      { property: "og:title", content: "FAQ | Nevada License Defense | Craig K. Perry" },
      {
        property: "og:description",
        content:
          "Questions about a Nevada licensing board complaint? Find answers here — or call Craig K. Perry at 702.893.4777 for a free consultation.",
      },
      { property: "og:url", content: "https://nevadalicensedefense.com/faq" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/faq" }],
  }),
  component: FaqRoute,
});

const FAQS = [
  ["When should I contact an attorney about a board complaint?", "As soon as possible — ideally before you respond to the board at all. You always have more options the earlier you start, and the initial consultation with Craig K. Perry is free. If you've received a Notice of Investigation, the board typically expects a response within 14 days."],
  ["Do I have to self-report to my licensing board?", "It depends on your license type, the nature of the issue, and the specific circumstances. Self-reporting can carry real consequences and should not be done without first consulting an attorney. We can help you determine your obligations and how to respond strategically."],
  ["What happens at a disciplinary hearing?", "A disciplinary hearing is an administrative proceeding before your licensing board. You have the right to be represented by an attorney, to present evidence, and to cross-examine witnesses. The outcome can range from a reprimand or fine to license suspension or revocation. Having experienced legal representation significantly improves your odds."],
  ["Can I keep practicing while under investigation?", "Usually yes — a license investigation does not automatically suspend your license. However, the board can seek an emergency suspension in serious cases. Contact us immediately if you receive any communication from your licensing board."],
  ["How long does a board investigation take?", "It varies widely — from a few months to over a year, depending on the complexity of the case and the board involved. Some matters can be resolved quickly through informal conferences; others proceed to formal hearings. We'll give you a realistic picture of your timeline at the outset."],
  ["What does it cost to hire Craig K. Perry?", "Fees vary by case complexity. The initial consultation is always free. We'll discuss fee structures at that consultation — including whether a flat fee, retainer, or other arrangement makes sense for your situation."],
  ["My malpractice insurer assigned me an attorney — do I still need my own?", "It depends. Malpractice defense attorneys represent your insurer's interests, which may not align perfectly with yours — particularly when it comes to your license. A separate attorney focused on your license defense can be critical, especially if the board investigation parallels a civil case."],
  ["Can a revoked or surrendered license be reinstated?", "Often yes. After a specified period (which varies by board and by the nature of the original action), you may petition for reinstatement. We can help you build the strongest possible case for returning to practice."],
] as const;

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

function FaqRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Section>
        <SectionTitle as="h1">Frequently Asked Questions</SectionTitle>
        <p className="mb-10 max-w-3xl mx-auto text-lg text-gray-600 text-center">
          Common questions about Nevada professional license defense and working with Craig K.
          Perry &amp; Associates.
        </p>
        <div className="max-w-3xl mx-auto">
          <FaqList items={FAQS} />
        </div>
      </Section>

      <Section variant="dark">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Still have questions?</h2>
          <p className="max-w-xl text-lg text-white/80">
            Every situation is different. Call Craig K. Perry for a free 30–45 minute
            consultation.
          </p>
          <a
            href={SITE.phoneHref}
            className="text-3xl font-bold text-gold hover:text-white transition-colors duration-300 transform hover:scale-110"
          >
            {SITE.phoneDisplay}
          </a>
          <a href={SITE.phoneHref} className="btn-gold mt-2">Call Now — Free Consultation</a>
        </div>
      </Section>
    </>
  );
}
