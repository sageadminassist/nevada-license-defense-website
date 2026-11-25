import { useState, type ReactNode } from "react";

/**
 * Live HTML versions of the Nevada State Board of Nursing graphics.
 * All figures: NSBN Annual Report, Fiscal Year 2024/2025.
 */

const SOURCE = "Source: Nevada State Board of Nursing, Annual Report Fiscal Year 2024/2025 (July 1, 2024 – June 30, 2025).";

function Shell({
  tag,
  title,
  subtitle,
  note,
  children,
}: {
  tag: string;
  title: ReactNode;
  subtitle: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <figure className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-md">
      <div className="relative overflow-hidden bg-dark-blue px-6 py-10 sm:px-10 md:px-14 md:py-14">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full border-[36px] border-white/5 md:size-[26rem]" />
        <p className="relative inline-block rounded bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-dark-blue">{tag}</p>
        <h3 className="relative mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{title}</h3>
        <p className="relative mt-4 max-w-2xl text-base text-gray-200 md:text-lg">{subtitle}</p>
      </div>
      <div className="space-y-5 px-4 py-6 sm:px-8 md:space-y-8 md:px-14 md:py-10">
        {children}
        <figcaption className="text-sm text-gray-500">
          {SOURCE}
          {note ? ` ${note}` : ""}
        </figcaption>
      </div>
    </figure>
  );
}

const Gold = ({ children }: { children: ReactNode }) => <span className="text-gold">{children}</span>;

function Tile({ label, value, note, featured }: { label?: string; value: string; note: string; featured?: boolean }) {
  return (
    <div className={featured ? "flex flex-col rounded-xl bg-dark-blue p-4 md:p-6" : "flex flex-col rounded-xl border border-gray-200 bg-white p-4 md:p-6"}>
      {label && (
        <dt className={`mb-2 text-xs font-semibold uppercase tracking-[0.14em] ${featured ? "text-gray-200" : "text-gray-500"}`}>{label}</dt>
      )}
      <dd className={`text-4xl font-bold tabular-nums md:text-5xl ${featured ? "text-gold" : "text-dark-blue"}`}>{value}</dd>
      <dd className={`mt-2 text-sm md:text-base ${featured ? "text-gray-200" : "text-gray-600"}`}>{note}</dd>
    </div>
  );
}

/** Table from tablet up, stacked blocks on phones. */
function LicenseTable({
  firstColumn,
  columns,
  rows,
  totals,
}: {
  firstColumn: string;
  columns: string[];
  rows: { type: string; values: string[] }[];
  totals?: string[];
}) {
  const stacked = totals ? [...rows, { type: "Total", values: totals }] : rows;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-8">
      <h4 className="text-xl font-bold text-dark-blue md:text-2xl">By license type</h4>
      <table className="mt-4 hidden w-full text-right tabular-nums sm:table">
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase tracking-[0.14em] text-gray-500">
            <th scope="col" className="py-3 text-left font-semibold">{firstColumn}</th>
            {columns.map((c) => (
              <th key={c} scope="col" className="py-3 font-semibold">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-lg text-dark-blue">
          {rows.map((r) => (
            <tr key={r.type} className="border-b border-gray-200 last:border-b-0">
              <th scope="row" className="py-4 text-left font-semibold">{r.type}</th>
              {r.values.map((v, i) => (
                <td key={columns[i]} className="py-4">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
        {totals && (
          <tfoot className="text-lg font-bold text-dark-blue">
            <tr className="border-t-2 border-dark-blue">
              <th scope="row" className="py-4 text-left">Total</th>
              {totals.map((v, i) => (
                <td key={columns[i]} className="py-4">{v}</td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
      <div className="mt-4 space-y-4 sm:hidden">
        {stacked.map((r) => (
          <div key={r.type} className={r.type === "Total" ? "border-t-2 border-dark-blue pt-4" : "border-t border-gray-200 pt-4"}>
            <p className="text-lg font-bold text-dark-blue">{r.type}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
              {r.values.map((v, i) => (
                <div key={columns[i]}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">{columns[i]}</dt>
                  <dd className="text-lg tabular-nums text-dark-blue">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── By the numbers ───────────── */

export function NsbnNumbers() {
  return (
    <Shell
      tag="Nevada State Board of Nursing · FY 2024/25"
      title={<>One year of nursing board <Gold>enforcement</Gold></>}
      subtitle="Active licensees hit a record high, and investigations rose 29% in two years."
      note="APRNs also hold RN licenses, so license-type counts overlap; the 75,575 total is as reported by the Board."
    >
      <dl className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        <Tile featured label="Active licensees" value="75,575" note="A first in Nevada history" />
        <Tile label="Complaints" value="674" note="RN/LPN, APRN and CNA" />
        <Tile label="Investigations" value="422" note="Complaints opened to investigation" />
        <Tile label="Discipline" value="101" note="Disciplinary outcomes" />
      </dl>
      <LicenseTable
        firstColumn="License type"
        columns={["Active", "Complaints", "Investigated", "Disciplined"]}
        rows={[
          { type: "RN / LPN", values: ["65,090", "399", "232", "62"] },
          { type: "APRN", values: ["7,433", "202", "135", "26"] },
          { type: "CNA", values: ["10,485", "73", "55", "13"] },
        ]}
        totals={["—", "674", "422", "101"]}
      />
    </Shell>
  );
}

/* ───────────── Discipline outcomes ───────────── */

const OUTCOMES = [
  { n: 67, name: "Reprimands", note: "The most common outcome, about two in three cases.", bar: "bg-dark-blue", text: "text-white" },
  { n: 22, name: "Probations", note: "Practice under Board-ordered terms, typically 1–5 years.", bar: "bg-gold", text: "text-dark-blue" },
  { n: 7, name: "Revocations", note: "5 RNs and 2 CNAs lost their license or certificate.", bar: "bg-slate-400", text: "text-white" },
  { n: 5, name: "Voluntary surrenders", note: "Gave up the license or certificate voluntarily.", bar: "bg-slate-300", text: "text-dark-blue" },
];

export function NsbnOutcomes() {
  return (
    <Shell
      tag="What discipline looks like"
      title={<>101 Nevada nursing professionals were <Gold>disciplined</Gold> in one year</>}
      subtitle="Practice-related disciplinary outcomes for RNs, LPNs, APRNs and CNAs, FY24/25."
      note="Probation length per the Board's Compliance & Monitoring section."
    >
      <div aria-hidden className="flex h-12 gap-0.5 overflow-hidden rounded-lg md:h-14">
        {OUTCOMES.map((o) => (
          <div key={o.name} style={{ flexGrow: o.n }} className={`flex min-w-7 basis-0 items-center justify-center text-base font-bold ${o.bar} ${o.text}`}>
            {o.n}
          </div>
        ))}
      </div>
      <dl className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        {OUTCOMES.map((o) => (
          <div key={o.name} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 md:p-6">
            <span aria-hidden className={`h-12 w-3 shrink-0 rounded ${o.bar}`} />
            <dd className="w-16 shrink-0 text-4xl font-bold tabular-nums text-dark-blue md:text-5xl">{o.n}</dd>
            <div>
              <dt className="text-lg font-bold text-dark-blue">{o.name}</dt>
              <dd className="text-sm text-gray-600 md:text-base">{o.note}</dd>
            </div>
          </div>
        ))}
      </dl>
      <LicenseTable
        firstColumn="Type"
        columns={["Reprimand", "Probation", "Revocation", "Surrender", "Total"]}
        rows={[
          { type: "RN", values: ["35", "11", "5", "3", "54"] },
          { type: "LPN", values: ["7", "1", "0", "0", "8"] },
          { type: "APRN", values: ["18", "7", "0", "1", "26"] },
          { type: "CNA", values: ["7", "3", "2", "1", "13"] },
        ]}
      />
    </Shell>
  );
}

/* ───────────── Renewals & applications ───────────── */

const REQUIREMENTS = [
  "RN/LPN: 30 CE hours every 24 months",
  "APRN and CRNA: 45 CE hours tied to your role",
  "All nurses: 4-hour cultural competency course each cycle",
  "CNA: 24 CE hours plus 40 hours of supervised work",
];

function Group({ heading, lead, children }: { heading: string; lead: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-xl font-bold text-dark-blue md:text-2xl">{heading}</h4>
      <p className="mt-1 text-gray-600">{lead}</p>
      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-5">{children}</dl>
    </div>
  );
}

export function NsbnRenewals() {
  return (
    <Shell
      tag="Applying or renewing in Nevada?"
      title={<>The Board is <Gold>checking</Gold> more than you think</>}
      subtitle="How the Nevada State Board of Nursing screened applications and audited renewals in FY24/25."
      note="Also required for RN/LPN: a one-time 4-hour bioterrorism course."
    >
      <Group heading="Continuing-education audits" lead="About 1 in 10 renewing nurses is audited each month.">
        <Tile featured value="2,894" note="nurse renewals audited for CE compliance (10.3%)" />
        <Tile value="155" note="nurse complaints opened for failing a CE audit" />
        <Tile value="60" note="CNA complaints opened for failing an audit; 7 renewals denied by the Board" />
      </Group>
      <Group heading="Application screening" lead={'Criminal convictions are the leading reason for both "Yes" answers and fraudulent applications.'}>
        <Tile featured value="733" note={'nurse applicants answered "Yes" to an eligibility question (8.3%)'} />
        <Tile value="265" note={'CNA applicants answered "Yes" (14.9%)'} />
        <Tile value="92" note="initial applications found fraudulent, out of 310 flagged" />
      </Group>
      <div className="rounded-xl bg-slate-200/70 p-5 md:p-8">
        <h4 className="text-lg font-bold text-dark-blue md:text-xl">Renewal requirements the Board audits against</h4>
        <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-dark-blue md:grid-cols-2">
          {REQUIREMENTS.map((r) => (
            <li key={r} className="flex items-start gap-3">
              <span aria-hidden className="mt-2 size-2 shrink-0 rounded-sm bg-gold-dark" />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

/* ───────────── APRN growth ───────────── */

const APRN_YEARS = [
  { year: "FY22/23", n: 5407 },
  { year: "FY23/24", n: 6280 },
  { year: "FY24/25", n: 7433 },
];

export function NsbnAprn() {
  return (
    <Shell
      tag="APRNs · FY 2024/25"
      title={<>Nevada's fastest-growing license, and <Gold>202 complaints</Gold></>}
      subtitle="APRN licenses have grown faster than any other type for four straight years."
    >
      <div className="grid grid-cols-1 gap-3 md:gap-5 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-8 lg:col-span-3">
          <h4 className="text-xl font-bold text-dark-blue">Active APRN licenses</h4>
          <div className="mt-6 flex h-56 items-end gap-3 border-b-2 border-gray-200 md:h-72 md:gap-5" role="img" aria-label="Active APRN licenses: 5,407 in FY22/23, 6,280 in FY23/24, 7,433 in FY24/25">
            {APRN_YEARS.map((y, i) => (
              <div key={y.year} className="flex h-full flex-1 flex-col justify-end">
                <span className="mb-1 text-center text-base font-semibold tabular-nums text-dark-blue md:text-lg">{y.n.toLocaleString("en-US")}</span>
                <div style={{ height: `${(y.n / 7433) * 88}%` }} className={`rounded-t ${i === 2 ? "bg-dark-blue" : "bg-slate-300"}`} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 text-center text-sm text-gray-600 md:gap-5">
            {APRN_YEARS.map((y) => (
              <span key={y.year} className="flex-1">{y.year}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-8 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Where they live</p>
          <p className="mt-2 text-6xl font-bold text-dark-blue md:text-7xl">48%</p>
          <p className="mt-3 text-gray-600">of Nevada-licensed APRNs have an out-of-state address of record (3,556).</p>
          <div aria-hidden className="mt-5 flex h-10 gap-0.5 overflow-hidden rounded">
            <div style={{ flexGrow: 3877 }} className="basis-0 bg-dark-blue" />
            <div style={{ flexGrow: 3556 }} className="basis-0 bg-gold" />
          </div>
          <dl className="mt-4 space-y-2 text-lg text-dark-blue">
            <div className="flex justify-between"><dt>In Nevada</dt><dd className="font-semibold tabular-nums">3,877</dd></div>
            <div className="flex justify-between"><dt>Out of state</dt><dd className="font-semibold tabular-nums">3,556</dd></div>
          </dl>
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-5">
        <Tile label="Complaints" value="202" note="Up from 153 two years ago. 135 opened to investigation." />
        <Tile label="Top source" value="50" note="investigated complaints came from consumers and patients." />
        <Tile label="Discipline" value="26" note="18 reprimands, 7 probations, 1 voluntary surrender." />
      </dl>
    </Shell>
  );
}

/* ───────────── Your rights ───────────── */

const RIGHTS = [
  { name: "Hire an attorney", note: "You may be represented by counsel at your own expense." },
  { name: "See the complaint", note: "You have the right to see what was filed against you." },
  { name: "Not respond", note: "You do not have to respond to the allegations." },
  { name: "Not sign anything", note: "You are not required to sign any document." },
  { name: "Not negotiate", note: "You may decline to take part in settlement negotiations." },
  { name: "A hearing and an appeal", note: "Notice of the charges, a hearing or the chance for one, and the right to appeal." },
];

const POSSIBLE = ["Closed, no action", "Remediation", "Monitoring", "Reprimand", "Fine", "Probation", "Suspension", "Surrender", "Revocation"];

export function NsbnRights() {
  return (
    <Shell
      tag="Under investigation?"
      title={<>Your rights, <Gold>as the Board lists them</Gold></>}
      subtitle="The Nevada State Board of Nursing lists these due-process rights for every nurse and CNA it investigates."
      note="General information, not legal advice."
    >
      <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        {RIGHTS.map((r, i) => (
          <li key={r.name} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 md:p-6">
            <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold text-lg font-bold text-dark-blue">{i + 1}</span>
            <div>
              <p className="text-lg font-bold text-dark-blue md:text-xl">{r.name}</p>
              <p className="text-gray-600">{r.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="rounded-xl bg-dark-blue p-5 md:p-8">
        <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-gold">Possible outcomes</h4>
        <ul className="mt-4 flex flex-wrap gap-2">
          {POSSIBLE.map((p) => (
            <li key={p} className={`rounded-md px-3 py-2 text-sm font-semibold md:text-base ${p === "Revocation" ? "bg-gold text-dark-blue" : "bg-white/10 text-white"}`}>
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-200">Free consultation. Talk to a license defense attorney before you answer the Board.</p>
      </div>
    </Shell>
  );
}

/* ───────────── Shared pieces for the trend / bar graphics ───────────── */

function DarkNote({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-dark-blue p-5 text-base text-white md:p-8 md:text-lg [&_strong]:font-semibold [&_strong]:text-gold">{children}</p>;
}

function BigStat({ value, children }: { value: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
      <p className="text-7xl font-bold leading-none text-dark-blue md:text-9xl">{value}</p>
      <p className="max-w-xl text-lg text-dark-blue md:text-2xl">{children}</p>
    </div>
  );
}

function BarList({ rows }: { rows: { name: string; n: number; pct?: string }[] }) {
  const max = Math.max(...rows.map((r) => r.n));
  return (
    <ul className="rounded-xl border border-gray-200 bg-white px-5 py-2 md:px-8 md:py-4">
      {rows.map((r, i) => (
        <li key={r.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-gray-200 py-3 last:border-b-0 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)_5.5rem] md:py-4">
          <span className="text-base font-semibold text-dark-blue md:text-lg">{r.name}</span>
          <span className="text-right text-lg font-bold tabular-nums text-dark-blue md:order-3 md:text-xl">
            {r.n}
            {r.pct && <span className="ml-1.5 text-sm font-normal text-gray-500">{r.pct}</span>}
          </span>
          <span aria-hidden className="col-span-2 block h-3 md:order-2 md:col-span-1 md:h-5">
            <span style={{ width: `${(r.n / max) * 100}%` }} className={`block h-full rounded-sm ${i === 0 ? "bg-dark-blue" : "bg-slate-300"}`} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ───────────── Discipline rising ───────────── */

const TRENDS = [
  { label: "Complaints received", value: "399", change: "+6% since FY22/23", data: [377, 370, 399] },
  { label: "Opened to investigation", value: "232", change: "+22% since FY22/23", data: [190, 213, 232] },
  { label: "Discipline outcomes", value: "62", change: "+48% since FY22/23", data: [42, 50, 62] },
];
const TREND_YEARS = ["22/23", "23/24", "24/25"];

export function NsbnDisciplineRising() {
  return (
    <Shell
      tag="Nevada State Board of Nursing · FY 2024/25"
      title={<>Nurse discipline is <Gold>on the rise</Gold></>}
      subtitle="Complaints against Nevada RNs and LPNs grew modestly. The number ending in discipline grew much faster."
      note="Each chart uses its own scale."
    >
      <BigStat value="+48%">more RN/LPN disciplinary outcomes than two years earlier, from 42 to 62.</BigStat>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
        {TRENDS.map((t) => {
          const max = Math.max(...t.data);
          return (
            <div key={t.label} className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 md:min-h-8">{t.label}</p>
              <p className="mt-3 text-5xl font-bold tabular-nums text-dark-blue">{t.value}</p>
              <p className="mt-2 inline-block rounded bg-gold px-2 py-1 text-sm font-semibold text-dark-blue">{t.change}</p>
              <div
                className="mt-5 flex h-36 items-end gap-2 border-b-2 border-gray-200 md:h-44 md:gap-3"
                role="img"
                aria-label={`${t.label}: ${t.data.map((n, i) => `${n} in FY${TREND_YEARS[i]}`).join(", ")}`}
              >
                {t.data.map((n, i) => (
                  <div key={TREND_YEARS[i]} className="flex h-full flex-1 flex-col justify-end">
                    <span className="mb-1 text-center text-sm font-semibold tabular-nums text-dark-blue">{n}</span>
                    <div style={{ height: `${(n / max) * 85}%` }} className={`rounded-t ${i === 2 ? "bg-dark-blue" : "bg-slate-300"}`} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-2 text-center text-xs text-gray-600 md:gap-3 md:text-sm">
                {TREND_YEARS.map((y) => (
                  <span key={y} className="flex-1">{y}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <DarkNote>
        In FY24/25, <strong>16% of complaints</strong> led to discipline, up from 11% two years earlier: 5 RN revocations, 3
        voluntary surrenders, 12 probations and 42 reprimands.
      </DarkNote>
    </Shell>
  );
}

/* ───────────── Complaint sources ───────────── */

export function NsbnComplaintSources() {
  return (
    <Shell
      tag="Who reports Nevada nurses?"
      title={<>Most complaints <Gold>start at work</Gold></>}
      subtitle="Where the 232 RN/LPN complaints opened to investigation in FY24/25 came from."
      note="Percentages may not total 100 due to rounding."
    >
      <BigStat value="37%">came from the nurse's own employer, the #1 source two years running.</BigStat>
      <BarList
        rows={[
          { name: "Employer", n: 86, pct: "37%" },
          { name: "Anonymous", n: 31, pct: "13%" },
          { name: "Other", n: 30, pct: "13%" },
          { name: "Consumer/patient", n: 26, pct: "11%" },
          { name: "Board staff", n: 23, pct: "10%" },
          { name: "Licensed coworker", n: 14, pct: "6%" },
          { name: "Government agency", n: 13, pct: "6%" },
          { name: "All other sources", n: 9, pct: "4%" },
        ]}
      />
      <DarkNote>
        Terminated or asked to self-report? Anonymous complaints were the <strong>second-largest source</strong>. You may not
        know who filed, but you have the right to see the complaint.
      </DarkNote>
    </Shell>
  );
}

/* ───────────── Common allegations ───────────── */

export function NsbnAllegations() {
  return (
    <Shell
      tag="Why nurses are investigated"
      title={<>The most common allegation is <Gold>also the vaguest</Gold></>}
      subtitle={'Allegations in RN/LPN complaints, FY24/25. "Customary standards" appeared more than three times as often as anything else.'}
      note="A single complaint can include more than one allegation."
    >
      <BarList
        rows={[
          { name: "Customary standards of practice", n: 175 },
          { name: "Patient harm", n: 55 },
          { name: "Scope of practice", n: 37 },
          { name: "Falsified records", n: 35 },
          { name: "Failure to collaborate / report change", n: 32 },
          { name: "Failure to observe and report", n: 28 },
          { name: "Neglect", n: 25 },
          { name: "Medication error", n: 23 },
          { name: "Drug diversion", n: 21 },
          { name: "Abuse", n: 14 },
          { name: "Failure to document controlled substance", n: 12 },
        ]}
      />
      <DarkNote>
        A broad charge like "customary standards" can cover almost any practice decision.{" "}
        <strong>How the facts are framed early</strong> can shape where a case ends up.
      </DarkNote>
    </Shell>
  );
}

/* ───────────── Tabbed viewer: one graphic on screen at a time ───────────── */

const GRAPHICS = {
  numbers: { label: "By the numbers", render: () => <NsbnNumbers /> },
  rising: { label: "Discipline is rising", render: () => <NsbnDisciplineRising /> },
  outcomes: { label: "Outcomes", render: () => <NsbnOutcomes /> },
  sources: { label: "Who reports nurses", render: () => <NsbnComplaintSources /> },
  allegations: { label: "Common allegations", render: () => <NsbnAllegations /> },
  aprn: { label: "APRNs", render: () => <NsbnAprn /> },
  renewals: { label: "Renewals & applications", render: () => <NsbnRenewals /> },
  rights: { label: "Your rights", render: () => <NsbnRights /> },
};

export type NsbnGraphicKey = keyof typeof GRAPHICS;

/** Every panel stays in the page HTML (for search engines); only the chosen one is visible. */
export function NsbnTabs({ show }: { show: NsbnGraphicKey[] }) {
  const [active, setActive] = useState<NsbnGraphicKey>(show[0]);
  return (
    <div>
      <div role="tablist" aria-label="Nevada State Board of Nursing statistics" className="mx-auto mb-6 flex max-w-5xl flex-wrap justify-center gap-2">
        {show.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`nsbn-tab-${key}`}
            aria-selected={active === key}
            aria-controls={`nsbn-panel-${key}`}
            onClick={() => setActive(key)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold ${
              active === key ? "border-dark-blue bg-dark-blue text-white" : "border-gray-300 bg-white text-dark-blue hover:border-gold-dark"
            }`}
          >
            {GRAPHICS[key].label}
          </button>
        ))}
      </div>
      {show.map((key) => (
        <div key={key} role="tabpanel" id={`nsbn-panel-${key}`} aria-labelledby={`nsbn-tab-${key}`} hidden={active !== key}>
          {GRAPHICS[key].render()}
        </div>
      ))}
    </div>
  );
}
