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
  // Clicking the helper makes it do a happy little hop.
  const [happy, setHappy] = useState(false);
  const happyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function cheer() {
    setHappy(false);
    if (happyTimer.current) clearTimeout(happyTimer.current);
    // Restart the animation even on quick repeat clicks.
    happyTimer.current = setTimeout(() => {
      setHappy(true);
      happyTimer.current = setTimeout(() => setHappy(false), 1400);
    }, 30);
  }
  return (
    <button
      type="button"
      onClick={cheer}
      aria-label="Say hello to the helper"
      className={`nld-bot is-${mood} ${happy ? "is-happy" : ""} relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 ring-1 ring-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold`}
    >
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
        /* clicked: a happy hop, smiling eyes and a few sparkles */
        @keyframes nld-bot-hop { 0%,100% { transform: translateY(0) scale(1) } 15% { transform: translateY(2px) scale(1.06,.92) } 40% { transform: translateY(-7px) scale(.96,1.05) rotate(-6deg) } 60% { transform: translateY(0) scale(1.05,.94) } 78% { transform: translateY(-4px) rotate(5deg) } }
        @keyframes nld-bot-pop { 0% { opacity: 0; transform: scale(0) } 35% { opacity: 1; transform: scale(1.2) } 100% { opacity: 0; transform: scale(.6) translateY(-4px) } }
        .nld-bot .happy-eye, .nld-bot .sparkle { display: none; }
        .nld-bot.is-happy svg { animation: nld-bot-hop 1.3s ease-in-out; }
        .nld-bot.is-happy .head { transform: none; }
        .nld-bot.is-happy .eye { display: none; }
        .nld-bot.is-happy .happy-eye { display: block; }
        .nld-bot.is-happy .smile { display: block; stroke-width: 1.8; }
        .nld-bot.is-happy .talk { display: none; }
        .nld-bot.is-happy .sparkle { display: block; transform-box: fill-box; transform-origin: center; animation: nld-bot-pop 1.1s ease-out both; }
        .nld-bot.is-happy .sparkle.s2 { animation-delay: .15s; }
        .nld-bot.is-happy .sparkle.s3 { animation-delay: .3s; }
        @media (prefers-reduced-motion: reduce) {
          .nld-bot svg, .nld-bot.is-happy svg, .nld-bot .eye, .nld-bot .spark, .nld-bot.is-speaking .talk { animation: none; }
          .nld-bot .head { transition: none; }
        }
      `}</style>
      <svg viewBox="0 -3.750 48 50" className="h-[3.1rem] w-12" fill="none">
        {/* sparkles that pop when clicked */}
        <path className="sparkle" d="M5 6l.9 2.1L8 9l-2.1.9L5 12l-.9-2.1L2 9l2.1-.9z" fill="#f0c563" />
        <path className="sparkle s2" d="M43.500 4l.8 1.800 1.800.8-1.800.8-.8 1.800-.8-1.800-1.800-.8 1.800-.8z" fill="#fdf6e3" />
        <path className="sparkle s3" d="M44.500 25l.7 1.600 1.600.7-1.600.7-.7 1.600-.7-1.600-1.600-.7 1.600-.7z" fill="#f0c563" />

        {/* body and arms sit tucked up under the head */}
        <g transform="translate(0 -4)">
          {/* small arms, one rounded shape each, tucked at the sides of the body */}
          <rect x="11" y="30.500" width="4.200" height="9" rx="2.100" fill="#f0c563" transform="rotate(14 13.100 30.500)" />
          <rect x="32.800" y="30.500" width="4.200" height="9" rx="2.100" fill="#f0c563" transform="rotate(-14 34.900 30.500)" />
          {/* small rounded body with a chest light */}
          <path d="M15.500 32c0-2.700 3.800-4 8.500-4s8.500 1.300 8.500 4c0 6.500-3.500 13.500-8.500 13.500S15.500 38.500 15.500 32z" fill="#fdf6e3" />
          <circle className="spark" cx="24" cy="35" r="2.800" fill="#f0c563" />
        </g>

        <g className="head">
          {/* antennae curving up from the sides */}
          <path d="M12.500 12c-2.200-3.400-1.700-7 1.400-9.200" stroke="#f0c563" strokeWidth="1.900" strokeLinecap="round" />
          <path d="M35.500 12c2.200-3.400 1.700-7-1.400-9.200" stroke="#f0c563" strokeWidth="1.900" strokeLinecap="round" />
          <circle cx="14.300" cy="2.700" r="1.700" fill="#f0c563" />
          <circle cx="33.700" cy="2.700" r="1.700" fill="#f0c563" />
          {/* ear pieces */}
          <rect x="7.300" y="12.500" width="4.200" height="8.500" rx="2.100" fill="#f0c563" />
          <rect x="36.500" y="12.500" width="4.200" height="8.500" rx="2.100" fill="#f0c563" />
          {/* head with a navy visor */}
          <ellipse cx="24" cy="16.500" rx="14" ry="12" fill="#fdf6e3" />
          <path d="M13.300 16.200c0-4.200 3.400-6.200 6.700-6.200 1.600 0 2.700.8 4 .8s2.400-.8 4-.8c3.300 0 6.700 2 6.700 6.200 0 4.600-4.300 7.600-10.700 7.600s-10.700-3-10.700-7.600z" fill="#12203b" />
          <rect className="eye" x="17.700" y="13.300" width="3.200" height="5.400" rx="1.600" fill="#f0c563" />
          <rect className="eye" x="27.100" y="13.300" width="3.200" height="5.400" rx="1.600" fill="#f0c563" />
          {/* smiling eyes, shown only during the happy hop */}
          <path className="happy-eye" d="M17.200 17.200c1.100-2.400 3.100-2.400 4.200 0M26.600 17.200c1.100-2.400 3.100-2.400 4.200 0" stroke="#f0c563" strokeWidth="1.600" strokeLinecap="round" />
          <path className="smile" d="M21.700 20.300c1.400 1 3.200 1 4.600 0" stroke="#f0c563" strokeWidth="1.200" strokeLinecap="round" />
          <ellipse className="talk" cx="24" cy="20.600" rx="2" ry="1.400" fill="#f0c563" />
        </g>
      </svg>
    </button>
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
