// Messaging AI → Use it → One-Sheeter. The offer, written as one long page in the style of
// 7figceo.com/partner (dark hero, white "document" sheets), assembled from the 7Ps:
//   Person → who it's for / not for       Problems → "Sound familiar?" cards
//   Promise → headline, goal, solutions   Path → "The plan is simple" phases
//   Packaging → "How it works"           Price Point → investment, guarantee, why now
//   Proof → credibility, stats, video testimonials
// A draft per offer lives in client_assets "one_sheet"; publishing copies it to
// "one_sheet_pub:<slug>" so the public /o/<slug> page shows only what's on the sheet. Pure.

export const ONE_SHEET_KIND = "one_sheet";
export const pubKind = (slug: string) => `one_sheet_pub:${slug}`;

export type SheetProblem = { label: string; quote: string; cost: string; fix: string; fixLine: string };
export type SheetPhase = { week: string; title: string; pain: string; intro: string; items: string[]; result: string; proof: string; closer: string };
export type SheetResult = { name: string; title: string; quote: string; video: string; face: string; on: boolean };

export type OneSheet = {
  brand: { name: string; sub: string; tagline: string; author: string };
  seats: { on: boolean; total: number; left: number; period: string; closes: string; why: string };
  headline: string; subhead: string;
  why: { on: boolean; title: string; lines: string[] };
  goal: { intro: string; text: string; bullets: string[]; without: string; closing: string };
  cred: { line: string; extra: string[]; stats: { n: string; label: string }[] };
  problems: { on: boolean; title: string; intro: string; items: SheetProblem[] };
  results: SheetResult[];
  fit: { notFor: string[]; forYou: string[] };
  path: { on: boolean; title: string; intro: string; phases: SheetPhase[] };
  format: { on: boolean; title: string; items: string[] };
  invest: { title: string; price: string; body: string[]; guarantee: string; urgency: string[] };
  cta: { label: string; url: string; steps: { h: string; b: string }[] };
  signoff: { name: string; role: string };
  ps: string;
};

// ── cleaning ──────────────────────────────────────────────────────────────────

const o = (v: unknown) => (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
const s = (v: unknown, n = 2000) => (typeof v === "string" ? v : "").replace(/\r\n?/g, "\n").replace(/\s*—\s*/g, ", ").slice(0, n);
const ss = (v: unknown, max: number, n = 600) => (Array.isArray(v) ? v : []).map((x) => s(x, n)).filter((x) => x.trim()).slice(0, max);
const num = (v: unknown) => Math.max(0, Math.min(10000, Math.round(Number(v) || 0)));
const day = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "");
const ytId = (v: unknown) => (typeof v === "string" && /^[\w-]{11}$/.test(v) ? v : "");

export function cleanSheet(v: unknown): OneSheet {
  const x = o(v), b = o(x.brand), st = o(x.seats), w = o(x.why), g = o(x.goal), c = o(x.cred), p = o(x.problems), f = o(x.fit), pa = o(x.path), fo = o(x.format), iv = o(x.invest), ct = o(x.cta), so = o(x.signoff);
  return {
    brand: { name: s(b.name, 80), sub: s(b.sub, 80), tagline: s(b.tagline, 300), author: s(b.author, 80) },
    seats: { on: st.on !== false, total: num(st.total), left: num(st.left), period: s(st.period, 40), closes: day(st.closes), why: s(st.why, 200) },
    headline: s(x.headline, 300), subhead: s(x.subhead, 300),
    why: { on: w.on !== false, title: s(w.title, 300), lines: ss(w.lines, 6) },
    goal: { intro: s(g.intro, 80), text: s(g.text, 400), bullets: ss(g.bullets, 6, 300), without: s(g.without, 300), closing: s(g.closing, 300) },
    cred: { line: s(c.line, 600), extra: ss(c.extra, 10, 200), stats: (Array.isArray(c.stats) ? c.stats : []).slice(0, 4).map((z) => { const y = o(z); return { n: s(y.n, 16), label: s(y.label, 60) }; }).filter((z) => z.n || z.label) },
    problems: { on: p.on !== false, title: s(p.title, 200), intro: s(p.intro, 300), items: (Array.isArray(p.items) ? p.items : []).slice(0, 5).map((z) => { const y = o(z); return { label: s(y.label, 60), quote: s(y.quote, 400), cost: s(y.cost, 300), fix: s(y.fix, 120), fixLine: s(y.fixLine, 300) }; }) },
    results: (Array.isArray(x.results) ? x.results : []).slice(0, 12).map((z) => { const y = o(z); return { name: s(y.name, 80), title: s(y.title, 120), quote: s(y.quote, 300), video: ytId(y.video), face: s(y.face, 600), on: y.on !== false }; }).filter((z) => z.name),
    fit: { notFor: ss(f.notFor, 10, 200), forYou: ss(f.forYou, 10, 200) },
    path: { on: pa.on !== false, title: s(pa.title, 120), intro: s(pa.intro, 400), phases: (Array.isArray(pa.phases) ? pa.phases : []).slice(0, 5).map((z) => { const y = o(z); return { week: s(y.week, 40), title: s(y.title, 140), pain: s(y.pain, 1200), intro: s(y.intro, 1500), items: ss(y.items, 8, 700), result: s(y.result, 800), proof: s(y.proof, 1200), closer: s(y.closer, 300) }; }) },
    format: { on: fo.on !== false, title: s(fo.title, 80), items: ss(fo.items, 12, 700) },
    invest: { title: s(iv.title, 160), price: s(iv.price, 120), body: ss(iv.body, 6, 800), guarantee: s(iv.guarantee, 300), urgency: ss(iv.urgency, 4, 200) },
    cta: { label: s(ct.label, 60), url: s(ct.url, 500), steps: (Array.isArray(ct.steps) ? ct.steps : []).slice(0, 4).map((z) => { const y = o(z); return { h: s(y.h, 120), b: s(y.b, 300) }; }).filter((z) => z.h) },
    signoff: { name: s(so.name, 80), role: s(so.role, 80) },
    ps: s(x.ps, 600),
  };
}

/** Saved drafts, one per offer id, plus where each is published. */
export type SheetStore = { byOffer: Record<string, { draft: OneSheet; updatedAt: string; slug: string; publishedAt: string }> };
export function cleanStore(v: unknown): SheetStore {
  const x = o(o(v).byOffer), byOffer: SheetStore["byOffer"] = {};
  for (const [k, e] of Object.entries(x).slice(0, 10)) {
    if (!/^[a-z0-9]{4,16}$/.test(k)) continue;
    const y = o(e);
    byOffer[k] = { draft: cleanSheet(y.draft), updatedAt: s(y.updatedAt, 40), slug: /^[a-z0-9-]{4,60}$/.test(String(y.slug ?? "")) ? String(y.slug) : "", publishedAt: s(y.publishedAt, 40) };
  }
  return { byOffer };
}

export const slugFor = (name: string) => `${(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(-2).join("-") || "offer").slice(0, 30)}-${Math.random().toString(36).slice(2, 6)}`;

// ── building it from the 7Ps ──────────────────────────────────────────────────

export type SheetInput = {
  offerName: string; ticket: "high" | "low"; author: string; owner: boolean;
  avatar: string; forList: string[]; notFor: string[];
  problems: { big: string[]; frustrations: { label: string; text: string }[]; fears: { label: string; text: string }[]; current: string };
  promise: { headline: string; subheadline: string; withoutHook: string; solutions: string[]; transformation: string };
  foundation: { goal: string; oldWay: string; newWay: string; mechanism: string; thinkProblem: string; realProblem: string };
  steps: string[];
  phases: { headline: string; summary: string; phases: { timeline: string; name: string; problem: string; intro: string; moves: { lead: string; body: string }[]; result: string; proof: string; closer: string }[] };
  packaging: { qty: string; name: string; statement: string }[];
  price: { line: string; guarantee: string; urgency: string[]; scarcity: { on: boolean; spots: number; left: number; why: string }; closes: string; noContract: boolean; notes: string };
  proof: { oneliner: string; bullets: string[]; core: string };
  results: { name: string; title: string; quote: string; video: string; face: string }[];
  cta: { label: string; url: string };
};

const count = (n: number) => ["zero", "one", "two", "three", "four", "five"][n] ?? String(n);
/** "Every coach we meet is" for coaches, a neutral line for anyone else. */
const stuckOn = (avatar: string) => (/^coaches\b/i.test(avatar) ? "Every coach we meet is" : /^consultants\b/i.test(avatar) ? "Every consultant we meet is" : "Most of the people we work with are");
/** The line that's about this problem, by shared words ("No Time" ↔ "too much time on the wrong tasks"). None that fits → "". */
const STOP = new Set(["their", "they", "with", "that", "this", "from", "have", "into", "every", "your", "what", "when", "will", "just", "more", "than", "does", "not", "the", "and", "for", "but", "are", "all", "any", "out"]);
const stems = (t: string) => new Set(t.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length >= 4 && !STOP.has(w)).map((w) => w.replace(/(ing|ers|es|s)$/, "")));
export function matchLine(problem: string, lines: { label: string; text: string }[], used: Set<number>): string {
  const want = stems(problem);
  let best = -1, score = 0;
  lines.forEach((l, i) => {
    if (used.has(i)) return;
    const have = stems(`${l.label} ${l.text}`);
    const n = [...want].filter((w) => have.has(w)).length;
    if (n > score) { score = n; best = i; }
  });
  if (best < 0) return "";
  used.add(best);
  return lines[best].text;
}
const dot = (t: string) => (t && !/[.!?…]$/.test(t.trim()) ? `${t.trim()}.` : t.trim());
const lower = (t: string) => (t ? t.charAt(0).toLowerCase() + t.slice(1) : t);

/** "$10,000,000+ generated across coaching" → { n: "$10M+", label: "generated across coaching" } */
export function statOf(line: string): { n: string; label: string } | null {
  const m = line.match(/^(\$?[\d][\d,.]*\s?(?:K|M|B|k|m|mil|million)?\+?%?)\s+(.{3,60})$/);
  if (!m) return null;
  let n = m[1].replace(/\s/g, "");
  const big = n.match(/^\$?([\d,]+)\+?$/);
  if (big) { const v = Number(big[1].replace(/,/g, "")); if (v >= 1_000_000) n = `${n.startsWith("$") ? "$" : ""}${Math.round(v / 100_000) / 10}M${n.endsWith("+") ? "+" : ""}`.replace(".0M", "M"); else if (v >= 10_000) n = `${n.startsWith("$") ? "$" : ""}${Math.round(v / 1000)}K${n.endsWith("+") ? "+" : ""}`; }
  return { n, label: m[2].replace(/^(from|in|across)\s/i, "") };
}

export function composeSheet(x: SheetInput): OneSheet {
  const brandSplit = x.owner && /^7-figure ceo\s+/i.test(x.offerName) ? { name: "7-Figure CEO", sub: x.offerName.replace(/^7-figure ceo\s+/i, "") } : { name: x.offerName, sub: "" };
  const who = x.avatar ? lower(x.avatar) : "our clients";
  const n = Math.max(x.problems.big.filter(Boolean).length, 0);
  const sol = x.promise.solutions;
  const stats = x.proof.bullets.map(statOf).filter((z): z is { n: string; label: string } => !!z).slice(0, 4);
  const high = x.ticket === "high";
  const usedF = new Set<number>(), usedC = new Set<number>();
  return cleanSheet({
    brand: { ...brandSplit, tagline: x.promise.subheadline, author: x.author },
    seats: { on: x.price.scarcity.on, total: x.price.scarcity.spots, left: x.price.scarcity.left, period: "", closes: x.price.closes, why: x.price.scarcity.why },
    headline: x.promise.headline,
    subhead: x.promise.withoutHook ? `...${x.promise.withoutHook.replace(/^\.+/, "")}` : "",
    why: {
      on: !!(x.foundation.thinkProblem || x.foundation.realProblem),
      title: x.foundation.thinkProblem ? `Most ${who} think the problem is ${lower(x.foundation.thinkProblem.replace(/\.$/, ""))}.` : "",
      lines: [x.foundation.realProblem ? `It isn't. ${dot(x.foundation.realProblem)}` : "", x.foundation.oldWay ? `So they do more of the old way: ${dot(lower(x.foundation.oldWay))}` : "", x.foundation.newWay ? `The new way: ${dot(lower(x.foundation.newWay))}` : ""].filter(Boolean),
    },
    goal: {
      intro: "My goal is simple:", text: dot(x.foundation.goal || x.promise.transformation),
      bullets: sol.map((z, i) => (x.problems.big[i] ? `**${z.replace(/\.$/, "")}**, instead of ${lower(x.problems.big[i])}` : `**${z.replace(/\.$/, "")}**`)),
      without: x.promise.withoutHook ? dot(x.promise.withoutHook) : "", closing: dot(x.promise.transformation),
    },
    cred: { line: x.proof.oneliner || x.proof.core, extra: x.proof.bullets.filter((b) => !statOf(b)).slice(0, 6), stats },
    problems: {
      on: n > 0,
      title: n ? `${stuckOn(x.avatar)} stuck on one of ${count(n)} things.` : "",
      intro: "Not a lack of effort. A missing system. Here's what each one sounds like, and what it costs.",
      items: x.problems.big.filter(Boolean).map((label, i) => ({
        // only a frustration and a fear that are actually about this problem; blank beats wrong
        label, quote: matchLine(label, x.problems.frustrations, usedF), cost: matchLine(label, x.problems.fears, usedC),
        fix: sol[i] ?? x.steps[i] ?? "", fixLine: x.phases.phases[i]?.intro?.split(/(?<=\.)\s/)[0] ?? "",
      })),
    },
    results: x.results.map((r) => ({ ...r, on: true })),
    fit: { notFor: x.notFor, forYou: x.forList },
    path: {
      on: x.phases.phases.length > 0, title: x.phases.headline || "The Plan is Simple", intro: x.phases.summary,
      phases: x.phases.phases.map((p) => ({ week: p.timeline, title: p.name, pain: p.problem, intro: p.intro, items: p.moves.map((m) => `**${m.lead.replace(/\.$/, "")}.** ${m.body}`), result: p.result, proof: p.proof, closer: p.closer })),
    },
    format: { on: x.packaging.length > 0, title: "How it Works", items: x.packaging.map((i) => `**${[i.qty, i.name].filter(Boolean).join(" ")}** ${i.statement}`.trim()) },
    invest: {
      title: high ? "The investment" : "Get started today",
      price: x.price.line,
      body: [x.price.line ? `It's ${x.price.line}.${x.price.noContract ? " That's it. No long contract, you stay because it's working." : ""}` : "", x.price.notes && !/love it or leave it/i.test(x.price.notes) ? x.price.notes : ""].filter(Boolean),
      guarantee: x.price.guarantee, urgency: x.price.urgency,
    },
    cta: {
      label: x.cta.label || (high ? "Book your call" : "Join now"), url: x.cta.url,
      steps: high
        ? [{ h: "Step 1 · Book your call", b: "Pick a time that works. It takes two minutes." }, { h: "Step 2 · We map your plan together", b: "Come with your numbers. You leave with your first moves, whether or not we work together." }, { h: "Step 3 · Start Phase 1", b: x.phases.phases[0] ? `${x.phases.phases[0].name}, starting this week.` : "We get to work this week." }]
        : [{ h: `Step 1 · ${x.cta.label || "Join now"}`, b: "Secure checkout. It takes two minutes." }, { h: "Step 2 · Get your welcome and access", b: "Everything lands in your inbox right away." }, { h: "Step 3 · Start", b: x.phases.phases[0] ? `${x.phases.phases[0].name}, today.` : "Start today." }],
    },
    signoff: { name: x.author, role: "Founder" },
    ps: [x.promise.headline ? `If you skipped to the bottom: ${dot(x.promise.headline)}` : "", x.price.line ? `${x.price.line[0].toUpperCase()}${x.price.line.slice(1)}${x.price.guarantee ? `, with a ${x.price.guarantee}` : ""}.` : "", x.price.urgency[0] ? dot(x.price.urgency[0]) : ""].filter(Boolean).join(" "),
  });
}

/** "December 31" */
export const fmtDay = (d: string) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" }) : "");
