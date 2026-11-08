"use client";

import { useEffect } from "react";

// Sends one "view" per page and a "click" for every button that leaves the page
// (your Stripe link, your calendar) to your own database.
export default function Track() {
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const send = (event: string, target?: string) => {
      const body = JSON.stringify({ event, page: location.pathname, target, referrer: document.referrer, utm_source: q.get("utm_source"), utm_campaign: q.get("utm_campaign") });
      if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) void fetch("/api/track", { method: "POST", body, keepalive: true });
    };
    send("view");
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (a?.href && new URL(a.href).host !== location.host) send("click", a.href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
