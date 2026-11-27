import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { openConsult } from "@/components/marketing/consult-modal";
import { track } from "@/lib/analytics";
import { FAQ_GROUPS, type FaqItem } from "@/lib/faqs";
import { SITE } from "@/lib/site";

const STOP = new Set(
  "a an the and or but if of to in on at for with by from is are was were be been am do does did can could should would will my me i you your our we it its this that these those what when where who how why have has had not no yes about get got any there their they them as so than then too very just need want know tell please".split(
    " ",
  ),
);

function stem(w: string) {
  return w.replace(/(ations?|ings?|ed|es|s)$/i, "").slice(0, 12) || w;
}
function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);
}

type Doc = { item: FaqItem; q: Set<string>; a: Set<string> };

/** Rank the site's FAQs against a typed question. Answers are always the firm's own FAQ text. */
function rank(docs: Doc[], query: string): FaqItem[] {
  const terms = [...new Set(tokens(query))];
  if (!terms.length) return [];
  return docs
    .map((d) => {
      let score = 0;
      let hits = 0;
      for (const t of terms) {
        const inQ = d.q.has(t);
        const inA = d.a.has(t);
        if (inQ || inA) hits++;
        score += (inQ ? 3 : 0) + (inA ? 1 : 0);
      }
      // Favour FAQs that cover most of what was asked.
      return { item: d.item, score: score * (hits / terms.length), hits };
    })
    .filter((r) => r.hits > 0 && r.score >= 2)
    .sort((x, y) => y.score - x.score)
    .slice(0, 4)
    .map((r) => r.item);
}

type Msg =
  | { from: "user"; text: string }
  | { from: "bot"; text: string; item?: FaqItem; related?: FaqItem[]; miss?: boolean; ai?: boolean; sources?: Source[] };

type Source = { question: string; faqUrl: string; page: string; pageLabel: string };

const STARTERS = [
  "When should I contact an attorney?",
  "Can I keep practicing while under investigation?",
  "How long does an investigation take?",
  "What does it cost?",
];

type BotMood = "idle" | "typing" | "thinking" | "speaking";

/** Small friendly helper for the chat header, drawn in the site's navy and gold. */
function ChatBotIcon({ mood }: { mood: BotMood }) {
  return (
    <span className={`nld-bot is-${mood} relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-gold/60`} aria-hidden="true">
      <style>{`
        @keyframes nld-bot-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-1.5px) } }
        @keyframes nld-bot-blink { 0%,92%,100% { transform: scaleY(1) } 95% { transform: scaleY(0.1) } }
        @keyframes nld-bot-glow { 0%,100% { opacity: .55; transform: scale(1) } 50% { opacity: 1; transform: scale(1.3) } }
        @keyframes nld-bot-talk { 0%,100% { transform: scaleY(.25) } 25% { transform: scaleY(1) } 50% { transform: scaleY(.45) } 75% { transform: scaleY(.9) } }
        .nld-bot svg { animation: nld-bot-bob 3.2s ease-in-out infinite; }
        .nld-bot .head { transform-box: fill-box; transform-origin: 50% 100%; transition: transform .35s ease; }
        .nld-bot .eye { transform-box: fill-box; transform-origin: center; animation: nld-bot-blink 4.5s infinite; }
        .nld-bot .spark { transform-box: fill-box; transform-origin: center; animation: nld-bot-glow 2s ease-in-out infinite; }
        .nld-bot .talk { display: none; transform-box: fill-box; transform-origin: center; }
        /* listening: head tilts toward the typing box */
        .nld-bot.is-typing .head { transform: rotate(-11deg); }
        /* working on an answer: quicker bob and antenna */
        .nld-bot.is-thinking svg { animation-duration: 1s; }
        .nld-bot.is-thinking .spark { animation-duration: .6s; }
        /* answering: the mouth moves */
        .nld-bot.is-speaking .smile { display: none; }
        .nld-bot.is-speaking .talk { display: block; animation: nld-bot-talk .38s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .nld-bot svg, .nld-bot .eye, .nld-bot .spark, .nld-bot.is-speaking .talk { animation: none; }
          .nld-bot .head { transition: none; }
        }
      `}</style>
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
        {/* stepped gold lines under the head, echoing the column capital in the logo */}
        <path d="M14 35.5h20M17.5 39.5h13M21 43.5h6" stroke="#f0c563" strokeWidth="2" strokeLinecap="round" />
        <g className="head">
          {/* antenna */}
          <path d="M24 9V5.8" stroke="#f0c563" strokeWidth="1.6" strokeLinecap="round" />
          <circle className="spark" cx="24" cy="4.2" r="2.1" fill="#f0c563" />
          {/* head and face plate */}
          {/* little ear caps */}
          <rect x="7.6" y="16" width="3.4" height="7" rx="1.7" fill="#f0c563" />
          <rect x="37" y="16" width="3.4" height="7" rx="1.7" fill="#f0c563" />
          <rect x="11" y="9" width="26" height="21" rx="8" fill="#fdf6e3" stroke="#f0c563" strokeWidth="1.8" />
          <rect x="14.5" y="13" width="19" height="13" rx="6" fill="#12203b" />
          <circle className="eye" cx="20" cy="18.2" r="2" fill="#f0c563" />
          <circle className="eye" cx="28" cy="18.2" r="2" fill="#f0c563" />
          <path className="smile" d="M21.2 22c1.7 1.3 3.9 1.3 5.6 0" stroke="#f0c563" strokeWidth="1.3" strokeLinecap="round" />
          <ellipse className="talk" cx="24" cy="22.4" rx="2.4" ry="1.7" fill="#f0c563" />
        </g>
      </svg>
    </span>
  );
}

export function FaqChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "bot",
      text: "Hi. Ask me about Nevada licensing board complaints and I will find the answer from our FAQ. This is general information, not legal advice.",
    },
  ]);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  const docs = useMemo<Doc[]>(
    () =>
      FAQ_GROUPS.flatMap((g) => g.items).map((item) => ({
        item,
        q: new Set(tokens(item.q)),
        a: new Set(tokens(item.a)),
      })),
    [],
  );

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [msgs, open, busy]);
  useEffect(() => {
    if (open) {
      field.current?.focus();
      track("faq_open");
    }
  }, [open]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const history = msgs
      .slice(1)
      .filter((m) => !(m.from === "bot" && m.miss))
      .slice(-6)
      .map((m) => ({ role: m.from === "user" ? "user" : "assistant", text: m.text }));
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTyping(false);
    setBusy(true);

    // Try the AI assistant first; if it is not switched on or fails, answer from the FAQ list.
    let reply: Msg | null = null;
    try {
      const res = await fetch("/api/ask.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; answer?: string; sources?: Source[] } | null;
      if (res.ok && json?.ok && json.answer) reply = { from: "bot", text: json.answer, ai: true, sources: json.sources ?? [] };
    } catch {
      // fall through to the built-in matcher
    }
    if (reply) {
      track("faq_question", q, "1|AI answer");
    } else {
      const found = rank(docs, q);
      track("faq_question", q, found.length ? `1|${found[0].q}` : "0");
      reply = found.length
        ? { from: "bot", text: found[0].a, item: found[0], related: found.slice(1, 4) }
        : {
            from: "bot",
            miss: true,
            text: "I could not find that in our FAQ. Every case is different, so the best next step is a free consultation with Craig.",
          };
    }
    const r = reply;
    setMsgs((m) => [...m, r]);
    setBusy(false);
    // The helper "speaks" for a moment, longer for longer answers.
    setSpeaking(true);
    if (speakTimer.current) clearTimeout(speakTimer.current);
    speakTimer.current = setTimeout(() => setSpeaking(false), Math.min(6000, 1500 + r.text.length * 12));
  }
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="FAQ assistant"
          className="fixed inset-x-3 bottom-24 z-[150] flex max-h-[min(70svh,600px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[390px]"
        >
          <div className="flex items-center justify-between gap-3 border-b-4 border-gold bg-dark-blue px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <ChatBotIcon mood={busy ? "thinking" : speaking ? "speaking" : typing ? "typing" : "idle"} />
              <div>
              <p className="text-lg font-bold leading-tight">Ask a Question</p>
              <p className="text-xs text-white/75">General information, not legal advice</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="cursor-pointer rounded-md p-1 text-2xl leading-none text-white/80 hover:text-white">
              ×
            </button>
          </div>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3 py-4" aria-live="polite">
            {msgs.map((m, i) =>
              m.from === "user" ? (
                <div key={i} className="ml-10 rounded-2xl rounded-br-sm bg-dark-blue px-3 py-2 text-sm text-white">
                  {m.text}
                </div>
              ) : (
                <div key={i} className="mr-6 rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800">
                  {m.item && <p className="mb-1 font-bold text-dark-blue">{m.item.q}</p>}
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  {m.item?.source && (
                    <a href={m.item.source.to} className="mt-2 inline-block text-xs font-semibold text-dark-blue underline">
                      Read more: {m.item.source.label}
                    </a>
                  )}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 border-t border-gray-100 pt-2">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Sources on this site</p>
                      <ul className="space-y-1.5">
                        {m.sources.map((src) => (
                          <li key={src.faqUrl} className="text-xs leading-snug">
                            <a href={src.faqUrl} className="font-semibold text-dark-blue underline">
                              {src.question}
                            </a>
                            {src.page !== "/faq" && (
                              <>
                                {" · "}
                                <a href={src.page} className="text-dark-blue underline">
                                  {src.pageLabel}
                                </a>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {m.related && m.related.length > 0 && (
                    <div className="mt-3 border-t border-gray-100 pt-2">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Related</p>
                      <div className="flex flex-col items-start gap-1">
                        {m.related.map((r) => (
                          <button key={r.q} type="button" onClick={() => ask(r.q)} className="cursor-pointer text-left text-xs font-semibold text-dark-blue underline">
                            {r.q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {(m.miss || m.item || m.ai) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => openConsult("consultation")} className="cursor-pointer rounded-md bg-gold px-3 py-1.5 text-xs font-bold text-dark-blue hover:bg-gold-dark">
                        Free Consultation
                      </button>
                      <a href={SITE.phoneHref} className="rounded-md border border-dark-blue px-3 py-1.5 text-xs font-bold text-dark-blue">
                        Call {SITE.phoneDisplay}
                      </a>
                    </div>
                  )}
                </div>
              ),
            )}
            {busy && (
              <div className="mr-6 inline-block rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500">
                Looking that up…
              </div>
            )}
            {msgs.length === 1 && (
              <div className="flex flex-col items-start gap-1.5 pt-1">
                {STARTERS.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)} className="cursor-pointer rounded-full border border-gray-300 bg-white px-3 py-1.5 text-left text-xs font-semibold text-dark-blue hover:border-gold-dark">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-gray-200 bg-white p-3">
            <input
              ref={field}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Head tilts while the visitor is typing, and straightens a moment after they stop.
                setTyping(true);
                if (typingTimer.current) clearTimeout(typingTimer.current);
                typingTimer.current = setTimeout(() => setTyping(false), 1200);
              }}
              maxLength={300}
              placeholder="Type your question"
              aria-label="Your question"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-dark-blue focus:outline-none focus:ring-2 focus:ring-gold/60"
            />
            <button type="submit" disabled={busy} className="cursor-pointer rounded-lg bg-dark-blue disabled:opacity-60 px-4 py-2 text-sm font-bold text-white hover:opacity-90">
              Ask
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close the FAQ assistant" : "Ask a question"}
        className="fixed bottom-6 right-4 z-[150] flex cursor-pointer items-center gap-2 rounded-full bg-dark-blue px-5 py-3.5 font-bold text-white shadow-xl ring-2 ring-gold hover:opacity-95 sm:right-6"
      >
        <svg className="h-5 w-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {open ? "Close" : "Ask a Question"}
      </button>
    </>
  );
}
