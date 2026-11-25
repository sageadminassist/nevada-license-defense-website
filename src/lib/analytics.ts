/**
 * First-party, cookieless analytics. Sends small beacons to /api/track.php, which stores them
 * in the site's own private database (see /admin). No cookies, no third parties, and nothing
 * is sent when the browser asks not to be tracked. Every failure is silent by design.
 */
const ENDPOINT = "/api/track.php";
const SESSION_KEY = "nld_s";
const OPT_OUT_KEY = "nld_notrack";

export type TrackEvent =
  | "call_click"
  | "email_click"
  | "consult_open"
  | "consult_submit"
  | "faq_open"
  | "faq_question"
  | "outbound"
  | "search";

type Session = { id: string; r: string; us: string; um: string; uc: string; ut: string; un: string; n: number };

function optedOut(): boolean {
  try {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
    if (nav.doNotTrack === "1" || nav.msDoNotTrack === "1" || nav.globalPrivacyControl === true) return true;
    if ((window as Window & { doNotTrack?: string }).doNotTrack === "1") return true;
    if (nav.webdriver) return true;
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

/** One id per browser tab session (sessionStorage, not a cookie), plus how the visit started. */
function session(): Session {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) return JSON.parse(saved) as Session;
  } catch {
    /* fall through to a fresh session */
  }
  const q = new URLSearchParams(window.location.search);
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const s: Session = {
    id: Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(""),
    r: document.referrer || "",
    us: q.get("utm_source") || "",
    um: q.get("utm_medium") || "",
    uc: q.get("utm_campaign") || "",
    ut: q.get("utm_term") || "",
    un: q.get("utm_content") || "",
    n: 0,
  };
  save(s);
  return s;
}
function save(s: Session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    /* private mode: the visit is still counted, just not stitched together */
  }
}

/** Session id, so a submitted form can be matched to where the visitor came from. */
export function analyticsSessionId(): string {
  if (typeof window === "undefined" || optedOut()) return "";
  return session().id;
}

function send(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "text/plain" }))) return;
    void fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
  } catch {
    /* analytics must never break the page */
  }
}

function base(s: Session) {
  return {
    s: s.id,
    p: window.location.pathname,
    r: s.r,
    us: s.us,
    um: s.um,
    uc: s.uc,
    ut: s.ut,
    un: s.un,
    w: window.innerWidth || screen.width || 0,
    l: navigator.language || "",
  };
}

/** Handles /?nld_notrack=1 (and =0), the "do not count my own visits" switch from the admin. */
function handleOptOutLink() {
  try {
    const q = new URLSearchParams(window.location.search);
    const v = q.get("nld_notrack");
    if (v === null) return;
    if (v === "0") localStorage.removeItem(OPT_OUT_KEY);
    else localStorage.setItem(OPT_OUT_KEY, "1");
    q.delete("nld_notrack");
    const rest = q.toString();
    history.replaceState(null, "", window.location.pathname + (rest ? `?${rest}` : "") + window.location.hash);
    window.alert(
      v === "0"
        ? "This browser is counted in the website statistics again."
        : "Done. Visits from this browser are no longer counted in the website statistics.",
    );
  } catch {
    /* ignore */
  }
}

let lastPath = "";
export function trackPageview() {
  if (typeof window === "undefined") return;
  handleOptOutLink();
  if (optedOut()) return;
  const path = window.location.pathname;
  if (path === lastPath) return;
  lastPath = path;
  const s = session();
  const entry = s.n === 0;
  s.n += 1;
  save(s);
  send({ t: "pageview", e: entry ? 1 : 0, ...base(s) });
}

/** Record something a visitor did. `target` is the thing acted on, `meta` a short extra detail. */
export function track(name: TrackEvent, target = "", meta = "") {
  if (typeof window === "undefined" || optedOut()) return;
  send({ t: "event", n: name, g: target.slice(0, 300), m: meta.slice(0, 200), ...base(session()) });
}

/** Search boxes fire on every keystroke; record a query once, after the visitor pauses typing. */
let searchTimer: ReturnType<typeof setTimeout> | undefined;
let lastSearch = "";
export function trackSearch(query: string, resultCount: number) {
  if (typeof window === "undefined") return;
  clearTimeout(searchTimer);
  const q = query.trim().toLowerCase();
  if (q.length < 3) return;
  searchTimer = setTimeout(() => {
    if (q === lastSearch) return;
    lastSearch = q;
    track("search", q, String(resultCount));
  }, 1500);
}
