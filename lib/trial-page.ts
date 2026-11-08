// A member's paid trial sales page, modeled on our $47 trial page (7fc-trial-welcome):
// spots bar → hero → credibility → problems → the 7 days → results → who it's for →
// the offer → FAQ → close. Written from their Offer GPS, edited in the portal, shown
// on their own site at /trial. Pure: the site template keeps an identical copy.

export type TrialPage = {
  live: boolean;           // published to their site
  eyebrow: string;         // e.g. "7-day paid trial · 30 spots"
  headline: string;
  sub: string;
  button: string;          // e.g. "Start my 7-day trial · $47"
  cred: string;            // one line: who they are and why listen
  problems: { title: string; body: string }[];
  gets: string[];          // what they get this week
  results: { name: string; line: string }[];
  forYou: string[];
  notFor: string[];
  price: string;           // "47"
  value: string;           // what it's worth / what it leads to
  guarantee: string;
  faq: { q: string; a: string }[];
  close: string;           // the last line above the final button
  updatedAt: string;
};

export const emptyTrialPage = (): TrialPage => ({
  live: false, eyebrow: "", headline: "", sub: "", button: "", cred: "", problems: [], gets: [], results: [],
  forYou: [], notFor: [], price: "47", value: "", guarantee: "", faq: [], close: "", updatedAt: "",
});

const o = (v: unknown) => (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
const s = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/\s*[—–]\s*/g, ", ").trim().slice(0, n) : "");
const list = (v: unknown, max: number, n: number) => (Array.isArray(v) ? v : []).map((x) => s(x, n)).filter(Boolean).slice(0, max);

export function cleanTrialPage(v: unknown): TrialPage {
  const x = o(v);
  return {
    live: x.live === true,
    eyebrow: s(x.eyebrow, 80), headline: s(x.headline, 160), sub: s(x.sub, 320), button: s(x.button, 60), cred: s(x.cred, 300),
    problems: (Array.isArray(x.problems) ? x.problems : []).map((p) => ({ title: s(o(p).title, 90), body: s(o(p).body, 300) })).filter((p) => p.title).slice(0, 4),
    gets: list(x.gets, 8, 200),
    results: (Array.isArray(x.results) ? x.results : []).map((r) => ({ name: s(o(r).name, 80), line: s(o(r).line, 240) })).filter((r) => r.line).slice(0, 6),
    forYou: list(x.forYou, 6, 200), notFor: list(x.notFor, 5, 200),
    price: s(x.price, 12).replace(/[^\d.]/g, "") || "47", value: s(x.value, 300), guarantee: s(x.guarantee, 200),
    faq: (Array.isArray(x.faq) ? x.faq : []).map((f) => ({ q: s(o(f).q, 160), a: s(o(f).a, 600) })).filter((f) => f.q && f.a).slice(0, 8),
    close: s(x.close, 240), updatedAt: s(x.updatedAt, 40),
  };
}

/** Enough on the page to show it? */
export const pageReady = (p: TrialPage) => !!(p.headline && p.gets.length);
