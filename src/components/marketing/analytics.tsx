import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { track, trackPageview } from "@/lib/analytics";

/** Mounted once in the marketing layout: counts page views and link clicks (calls, email, other sites). */
export function Analytics() {
  const pathname = useLocation({ select: (l) => l.pathname });

  useEffect(() => {
    trackPageview();
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("tel:")) return track("call_click", href.slice(4));
      if (href.startsWith("mailto:")) return track("email_click", href.slice(7).split("?")[0]);
      if (/^https?:\/\//i.test(href) && a.host && a.host !== window.location.host) {
        track("outbound", (a.host + a.pathname).replace(/\/$/, ""), (a.textContent || "").trim().slice(0, 80));
      }
    };
    // Capture phase, so clicks are counted even when another handler stops them.
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  return null;
}
