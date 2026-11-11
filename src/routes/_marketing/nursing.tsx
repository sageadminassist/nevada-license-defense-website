import { createFileRoute } from "@tanstack/react-router";

import {
  FaqList,
  Section,
  SectionTitle,
  ServiceCard,
  ServiceGrid,
} from "@/components/marketing/sections";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_marketing/nursing")({
  head: () => ({
    meta: [
      { title: "Nevada State Board of Nursing Defense | Craig K. Perry | 702.893.4777" },
      {
        name: "description",
        content:
          "Defense before the Nevada State Board of Nursing (NSBN) for RNs, LPNs, NPs, and APRNs. Craig K. Perry has 31+ years defending nurses statewide. Free consultation.",
      },
      {
        property: "og:title",
        content: "Nevada State Board of Nursing Defense | Craig K. Perry",
      },
      {
        property: "og:description",
        content:
          "Facing an NSBN complaint or investigation? Craig K. Perry defends nurses before the Nevada State Board of Nursing. Free consultation — 702.893.4777.",
      },
      { property: "og:url", content: "https://nevadalicensedefense.com/nursing" },
      { property: "og:image", content: "https://nevadalicensedefense.com/images/nvboardofnursing.avif" },
    ],
    links: [{ rel: "canonical", href: "https://nevadalicensedefense.com/nursing" }],
  }),
  component: NursingRoute,
});

function NursingHero() {
  return (
    <section className="relative flex items-center justify-center py-28 text-center overflow-hidden" style={{ minHeight: "340px" }}>
      <img src={IMAGES.mountainClouds} alt="Nevada mountains" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-dark-blue/50" />
      <div className="relative z-10 max-w-3xl px-6 space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Nevada Board of Nursing Defense</h1>
        <p className="text-lg text-white/80">Defending RNs, LPNs, NPs, and APRNs before the Nevada State Board of Nursing.</p>
        <div className="flex justify-center gap-4 pt-2">
          <a href={SITE.phoneHref} className="btn-gold">Call {SITE.phoneDisplay}</a>
          <a href="/contact" className="btn-secondary">Free Consultation</a>
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  ["Investigations & Complaints", "Representation during NSBN investigations and complaints, including responding to Letters of Inquiry and negotiating settlements."],
  ["Unprofessional Conduct", "Defense against allegations such as HIPAA violations, scope-of-practice violations, patient boundary issues, and neglect claims."],
  ["Substance & Drug Diversion", "Support for nurses facing substance-abuse accusations or medication diversion allegations, including challenging drug-test results."],
  ["Formal & Informal Hearings", "Defense at hearings before the Nevada State Board of Nursing — both formal evidentiary hearings and informal settlement hearings."],
  ["Monitoring & Probation", "Reviewing monitoring agreements, defending probation violations, and resolving continuing-education audit deficiencies."],
  ["Criminal Matters", "Defense when criminal charges, DUI, or convictions affect your nursing license — including sealing arrest or criminal records."],
  ["Licensure & Reinstatement", "Help with endorsement applications, disclosure requirements, and reinstatement after suspension or revocation."],
  ["Employment Protection", "Guidance to help prevent termination and address workplace allegations of wrongdoing."],
] as const;

const FAQS = [
  ["When should I contact an attorney?", "As soon as possible. You always have more options the earlier you start — and the initial consultation is free. If you've received a Notice of Investigation, the NSBN typically expects a response within 14 days."],
  ["Do I have to report an arrest to the Board?", "Not always — arrests don't automatically need to be reported, but convictions must be handled carefully. Talk with an attorney before disclosing anything."],
  ["My employer told me to self-report. Should I?", "Self-reporting deserves careful thought — it can carry real consequences. Discuss your situation with experienced counsel before you act."],
  ["Someone from the Board called me — should I talk to them?", "Be careful. Anything you say can be used against you. Consult an attorney before responding or calling back."],
  ["Can I get a revoked license back?", "Often yes. After a period of time, nurses whose licenses were revoked or surrendered may pursue reinstatement. We can help you build a plan to return to practice."],
] as const;

function NursingRoute() {
  return (
    <>
      <NursingHero />
      <Section>
        <div className="mb-8 flex justify-center">
          <img src={IMAGES.boardNursing} alt="Nevada State Board of Nursing" className="w-auto h-36 md:h-44 object-contain" />
        </div>
        <SectionTitle as="h1">Nevada State Board of Nursing</SectionTitle>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-700">
          <p className="text-3xl font-bold text-dark-blue text-center">{SITE.phoneDisplay}</p>
          <p className="text-lg text-center">Serving Nevada Citizens &bull; {SITE.location}</p>
          <p className="text-lg">
            For 100 years, the Nevada State Board of Nursing (NSBN) has regulated nursing to
            ensure safe practices and public safety. The NSBN regulates more than 70,000 nurses
            statewide and has broad authority to investigate, discipline, and revoke licenses.
          </p>
          <p>
            When your nursing license is threatened, you need experienced legal representation.
            Craig K. Perry has defended nurses before the NSBN for over 16 years — from initial
            investigations through formal hearings and reinstatement proceedings.
          </p>
          <p className="text-sm text-gray-500">
            Nevada nursing licenses are governed by the{" "}
            <strong>Nevada Nurse Practice Act (NRS Chapter 632)</strong> and administrative
            regulations under <strong>NAC Chapter 632</strong>. The NSBN operates under{" "}
            <strong>NRS 233B</strong> (Nevada Administrative Procedure Act) for all disciplinary
            hearings and appeals.
          </p>
          <p className="font-semibold text-dark-blue">{SITE.consultation}</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
          <a href={SITE.phoneHref} className="btn-primary text-center">Call {SITE.phoneDisplay}</a>
          <a href="/contact" className="btn-secondary text-center">Free Consultation</a>
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>How We Help Nurses</SectionTitle>
        <ServiceGrid>
          {SERVICES.map(([title, body]) => (
            <ServiceCard key={title} title={title}>{body}</ServiceCard>
          ))}
        </ServiceGrid>
      </Section>

      <Section>
        <div className="rounded-lg border-l-4 border-gold bg-gray-50 p-8">
          <p className="text-2xl font-bold text-dark-blue">
            The Nevada State Board of Nursing opened{" "}
            <span className="text-gold-dark">605 investigations</span> in 2022–2023 — up 21% over the
            prior year.
          </p>
          <p className="mt-3 text-gray-600">
            That included 377 complaints against RNs and LPNs and 153 against APRNs (a 57% jump).
            If you've been contacted by the NSBN, don't face it alone.
          </p>
        </div>
      </Section>

      {/* When should I contact you */}
      <Section variant="muted">
        <SectionTitle>When Should I Contact You?</SectionTitle>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">The short answer is — the sooner the better. You will always have more options and sound advice the earlier you start. The initial consultation is free and confidential.</p>
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            ["I think I'm going to be reported for something I did at work.", "Let's talk. You can begin to plan on next steps, and work with the Board, from an attorney who has handled hundreds of cases. Such a call usually calms your fears and anxieties about losing your license."],
            ["I was arrested for something (DUI or Domestic Violence, for example).", "We can give you sound advice. For example, did you know that arrests do not need to be reported to the Board? Find out when and what you must tell the Board after an arrest."],
            ["My employer told me to self-report.", "This is a common suggestion that needs to be carefully discussed with an experienced attorney who has been asked this question in various situations dozens of times."],
            ["My employer said they're going to contact the Board.", "This is an excellent time to contact legal counsel and find out how to proceed and what to expect once a complaint is filed against you."],
            ["I received a Notice of Investigation from a Nursing Board Investigator.", "The notice of investigation (NOI) was sent out by an NSBN investigator. The clock is ticking — they expect an answer in 14 days. This is the most critical time when you need the advice of an attorney; it even suggests it in the letter you received."],
            ["Someone called me from the Board and I don't know if I should talk to them.", "Anything you say to the Board can and will be used against you if you self-incriminate. Sometimes things you say orally are misheard or misunderstood. Consult with an experienced attorney first."],
            ["Somebody reported me to the State Board of Nursing.", "Find out if being reported will result in receiving an NOI and what you should do about it, and what the possible consequences could be, and how to face them."],
            ["I quit my job rather than face termination.", "Many nurses who lose their jobs over an alleged act of unprofessional conduct face the prospect of finding a new job. Let us give you the best advice possible. We can help you decide how to handle it."],
            ["I want to get my license back.", "If you have already lost your license through inactivity, voluntary surrender, or revocation, we can help you get it back. Let's talk about a plan."],
            ["I was found guilty of a crime — how will it affect my license?", "Convictions for a crime must be handled properly. Remember, the Board must decide if you are safe to practice. There are several ways we can suggest you demonstrate to them that you can continue to be an upstanding nurse, even after a conviction."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-lg bg-white border border-gray-200 p-5 shadow-sm">
              <p className="font-bold text-dark-blue mb-1 italic">"{q}"</p>
              <p className="text-gray-600 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Common problems */}
      <Section>
        <SectionTitle>Common Reasons Nurses Are Investigated</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {[
            ["Fraudulent Application", "False information or concealment in an application for licensure, renewal, or endorsement — sometimes unintentional, such as not reporting a resolved criminal conviction."],
            ["Failure to Meet Standards of Care", "Neglecting necessary care, providing substandard care, or failing to properly monitor and assess a patient's condition."],
            ["Medication Diversion", "Diverting controlled substances for personal use, failing to document wastage, or signing as witness to wastage not actually witnessed."],
            ["Falsifying Documents", "Creating, altering, or destroying records — including medication administration records, nursing assessments, timecards, or CE certificates."],
            ["Lack of Collaboration", "Not reporting changes in a patient's condition, not following physician orders, or not communicating effectively with other healthcare team members."],
            ["Failing CE Audits", "Failure to retain proof of required CE courses. There is NO TIME LIMIT for keeping the bioterrorism class record — you must retain proof until audited, which could be decades later."],
            ["Expired License", "Practicing on an expired license, or failure to renew before the expiration date."],
            ["Intent to Deceive", "Lying to patients or colleagues, misrepresenting telehealth or home-health visits, or using prior vital signs instead of taking new ones."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-dark-blue mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-lg border-l-4 border-gold bg-gray-50 p-8 max-w-4xl mx-auto">
          <p className="text-2xl font-bold text-dark-blue">
            The Nevada State Board of Nursing opened{" "}
            <span className="text-gold-dark">605 investigations</span> in 2022–2023 — up 21% over the prior year.
          </p>
          <p className="mt-3 text-gray-600">
            That included 377 complaints against RNs and LPNs and 153 against APRNs (a 57% jump).
            Don't become a statistic — the initial consultation is free and confidential.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href={SITE.phoneHref} className="btn-primary">Call {SITE.phoneDisplay}</a>
            <a href="/contact" className="btn-secondary">Free Consultation</a>
          </div>
        </div>
      </Section>

      <Section variant="muted">
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <FaqList items={FAQS} />
        </div>
      </Section>

      <section className="border-t border-gray-200 bg-white py-8">
        <div className="section-container">
          <p className="text-center text-sm text-gray-600 max-w-2xl mx-auto">
            Nevada License Defense is a specialized practice of{" "}
            <a href="https://craigperry.com" className="font-semibold text-dark-blue hover:text-gold transition-colors" target="_blank" rel="noopener">Craig K. Perry &amp; Associates</a>
            {" "}— visit <a href="https://craigperry.com" className="font-semibold text-dark-blue hover:text-gold transition-colors" target="_blank" rel="noopener">CraigPerry.com</a> for the full firm profile, or{" "}
            <a href="https://lvnurseattorney.com" className="font-semibold text-dark-blue hover:text-gold transition-colors" target="_blank" rel="noopener">LVNurseAttorney.com</a>
            {" "}for dedicated Las Vegas nurse license defense resources.
          </p>
        </div>
      </section>
    </>
  );
}
