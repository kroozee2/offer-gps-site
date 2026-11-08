// A member's free Skool community: the weekly call run-of-show and the join page
// (Andrew's 7-Figure Community Funnel: page → Skool About → membership questions →
// weekly call → offers). Written from their Offer GPS, shown on their own site at
// /join. Pure: the offer-gps-site template keeps an identical copy.

export type SkoolCall = {
  name: string;          // "The Friday Build Room"
  when: string;          // "Fridays, 11am PT"
  length: string;        // "60 minutes"
  agenda: { min: string; title: string; what: string }[];
  pitch: string;         // the soft offer moment, word for word
  invite: string;        // the post / DM that fills the call
};

export type SkoolJoin = {
  live: boolean;
  name: string;          // community name
  headline: string;
  sub: string;
  who: string[];         // who it's for
  inside: string[];      // what's inside
  host: string;          // one line about the host
  proof: string[];       // real wins, one line each
  call: string;          // one line about the weekly call
  price: string;         // "Free" / "Free, with a $47/mo tier"
  button: string;        // "Join free"
  skoolUrl: string;      // their skool.com/… link
  updatedAt: string;
};

export const emptyJoin = (): SkoolJoin => ({ live: false, name: "", headline: "", sub: "", who: [], inside: [], host: "", proof: [], call: "", price: "Free", button: "Join free", skoolUrl: "", updatedAt: "" });

const o = (v: unknown) => (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
const s = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/\s*[—–]\s*/g, ", ").trim().slice(0, n) : "");
const list = (v: unknown, max: number, n: number) => (Array.isArray(v) ? v : []).map((x) => s(x, n)).filter(Boolean).slice(0, max);

/** A skool.com link, https only. */
export function cleanSkoolUrl(v: unknown): string {
  const t = s(v, 300);
  if (!t) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    return u.protocol === "https:" && /(^|\.)skool\.com$/.test(u.hostname) ? u.toString() : "";
  } catch { return ""; }
}

export function cleanCall(v: unknown): SkoolCall | undefined {
  const x = o(v);
  const name = s(x.name, 60);
  if (!name) return undefined;
  return {
    name, when: s(x.when, 80), length: s(x.length, 40),
    agenda: (Array.isArray(x.agenda) ? x.agenda : []).map((a) => ({ min: s(o(a).min, 20), title: s(o(a).title, 80), what: s(o(a).what, 300) })).filter((a) => a.title).slice(0, 8),
    pitch: s(x.pitch, 800), invite: s(x.invite, 1200),
  };
}

export function cleanJoin(v: unknown): SkoolJoin {
  const x = o(v);
  return {
    live: x.live === true,
    name: s(x.name, 60), headline: s(x.headline, 160), sub: s(x.sub, 320),
    who: list(x.who, 5, 200), inside: list(x.inside, 7, 200), host: s(x.host, 300), proof: list(x.proof, 4, 240),
    call: s(x.call, 240), price: s(x.price, 80) || "Free", button: s(x.button, 40) || "Join free",
    skoolUrl: cleanSkoolUrl(x.skoolUrl), updatedAt: s(x.updatedAt, 40),
  };
}

export const joinReady = (j: SkoolJoin) => !!(j.headline && j.inside.length);
