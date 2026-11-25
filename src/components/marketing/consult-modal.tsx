import { useEffect, useRef, useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";

export type ConsultKind = "consultation" | "appointment";
const EVENT = "nld:consult";

/** Open the consultation / appointment form from anywhere on the site. */
export function openConsult(kind: ConsultKind = "consultation") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: kind }));
}

const INPUT =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 focus:border-dark-blue focus:outline-none focus:ring-2 focus:ring-gold/60";
const LABEL = "mb-1 block text-sm font-semibold text-dark-blue";

export function ConsultForm({ kind, onKind }: { kind: ConsultKind; onKind: (k: ConsultKind) => void }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = Object.fromEntries(f.entries()) as Record<string, string>;
    if (!data.phone?.trim() && !data.email?.trim()) {
      setState("error");
      setError("Please enter a phone number or an email address so we can reach you.");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind, page: window.location.href }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) throw new Error(json?.error || "");
      setState("sent");
    } catch (err) {
      setState("error");
      setError(
        (err instanceof Error && err.message) ||
          `We could not send your message. Please call ${SITE.phoneDisplay}.`,
      );
    }
  }

  if (state === "sent") {
    return (
      <div className="py-6 text-center">
        <p className="text-2xl font-bold text-dark-blue">Thank you. Your message was sent.</p>
        <p className="mt-3 text-gray-700">
          We will get back to you as soon as we can. If your deadline is close, please also call{" "}
          <a href={SITE.phoneHref} className="font-bold text-dark-blue underline">
            {SITE.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate={false}>
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1" role="tablist" aria-label="Request type">
        {(
          [
            ["consultation", "Free Consultation"],
            ["appointment", "Request Appointment"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            onClick={() => onKind(k)}
            className={`cursor-pointer rounded-md px-3 py-2 text-sm font-bold ${
              kind === k ? "bg-dark-blue text-white shadow" : "text-dark-blue hover:bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" required maxLength={120} autoComplete="name" className={INPUT} />
        </div>
        <div>
          <label className={LABEL} htmlFor="cf-phone">Phone</label>
          <input id="cf-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={INPUT} />
        </div>
        <div>
          <label className={LABEL} htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" maxLength={160} autoComplete="email" className={INPUT} />
        </div>
        <div className={kind === "appointment" ? "" : "sm:col-span-2"}>
          <label className={LABEL} htmlFor="cf-license">License type or board <span className="font-normal text-gray-500">(optional)</span></label>
          <input id="cf-license" name="license" maxLength={120} placeholder="e.g. RN, Board of Nursing" className={INPUT} />
        </div>
        {kind === "appointment" && (
          <div>
            <label className={LABEL} htmlFor="cf-when">Preferred day and time</label>
            <input id="cf-when" name="when" maxLength={160} placeholder="e.g. weekday mornings" className={INPUT} />
          </div>
        )}
        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor="cf-message">Message</label>
          <textarea id="cf-message" name="message" required rows={4} maxLength={5000} placeholder="Briefly, what happened and any deadline you were given." className={INPUT} />
        </div>
        {/* Honeypot: hidden from people, filled by bots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="cf-website">Website</label>
          <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {state === "error" && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <button type="submit" disabled={state === "sending"} className="btn-gold w-full text-lg disabled:opacity-60">
        {state === "sending" ? "Sending…" : kind === "appointment" ? "Request Appointment" : "Request Free Consultation"}
      </button>
      <p className="text-xs leading-relaxed text-gray-500">
        Sending this form does not create an attorney-client relationship. Please do not include
        confidential details until we have spoken.
      </p>
    </form>
  );
}

/** Mounted once in the layout. Opens via openConsult() or any "consultation" link to /contact. */
export function ConsultModal() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<ConsultKind>("consultation");
  const [formKey, setFormKey] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = (k: ConsultKind) => {
      setKind(k);
      setFormKey((n) => n + 1);
      setOpen(true);
    };
    const onEvent = (e: Event) => show(((e as CustomEvent).detail as ConsultKind) || "consultation");
    // Any "Free Consultation" / "Schedule a Consultation" link that points at /contact opens the form instead.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href='/contact']");
      if (!a) return;
      const text = a.textContent || "";
      if (!/consult|appointment/i.test(text)) return;
      e.preventDefault();
      show(/appointment/i.test(text) ? "appointment" : "consultation");
    };
    window.addEventListener(EVENT, onEvent);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(EVENT, onEvent);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLInputElement>("input[name='name']")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-dark-blue/70 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consult-title"
        className="max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b-4 border-gold bg-dark-blue px-6 py-5 text-white">
          <div>
            <h2 id="consult-title" className="text-2xl font-bold">
              {kind === "appointment" ? "Request an Appointment" : "Free Consultation"}
            </h2>
            <p className="mt-1 text-sm text-white/80">
              Send us a message, or call{" "}
              <a href={SITE.phoneHref} className="font-bold text-gold underline">
                {SITE.phoneDisplay}
              </a>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="-mr-2 -mt-1 cursor-pointer rounded-md p-2 text-2xl leading-none text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">
          <ConsultForm key={formKey} kind={kind} onKind={setKind} />
        </div>
      </div>
    </div>
  );
}
