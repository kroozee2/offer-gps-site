import type { TrialPage } from "@/lib/trial-page";

// A member's paid trial page, laid out like our $47 trial page: spots bar, hero,
// credibility, problems, this week, results, who it's for, the offer, FAQ, close.
// Plain markup with its own colors, so the portal preview and their own site
// (the offer-gps-site template keeps an identical copy) look exactly the same.

const C = { bg: "#0b0b10", surf: "#14141c", line: "#262633", cream: "#f4f2ec", muted: "#a8a5b3", gold: "#d4af37", gold2: "#f0d27a", good: "#3fae6a", bad: "#e5636b" };

type Meta = { checkout: string; spots?: string; starts?: string };

function Button({ p, m, big = false }: { p: TrialPage; m: Meta; big?: boolean }) {
  const label = p.button || `Start my 7-day trial · $${p.price || "47"}`;
  const cls = `inline-flex items-center justify-center rounded-2xl px-7 font-extrabold text-[#14120a] shadow-[0_10px_40px_-10px_rgba(212,175,55,.6)] transition hover:brightness-105 ${big ? "py-5 text-lg" : "py-4 text-base"}`;
  const style = { background: `linear-gradient(135deg, ${C.gold2}, ${C.gold})` };
  return m.checkout
    ? <a href={m.checkout} className={cls} style={style}>{label} →</a>
    : <span className={`${cls} cursor-not-allowed opacity-70`} style={style} title="Add your Stripe payment link to turn this on">{label} →</span>;
}

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="mx-auto max-w-3xl text-center text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.12] tracking-tight" style={{ color: C.cream }}>{children}</h2>;
const Eyebrow = ({ children }: { children: React.ReactNode }) => <p className="text-center text-[12px] font-bold uppercase tracking-[0.22em]" style={{ color: C.gold }}>{children}</p>;
const Section = ({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) => (
  <section className="px-5 py-14 sm:px-8 md:py-20" style={{ background: alt ? C.surf : C.bg, borderTop: `1px solid ${C.line}` }}><div className="mx-auto max-w-5xl space-y-8">{children}</div></section>
);

export default function TrialPageView({ p, m }: { p: TrialPage; m: Meta }) {
  const auto = [`7-day trial`, m.spots ? `${m.spots} spots` : "", m.starts ? `starts ${m.starts}` : ""].filter(Boolean).join(" · ");
  // the AI may leave [DATE] / [N] placeholders: fill them from the trial, else use the plain line
  const filled = (p.eyebrow || "").replace(/\[(DATE|START DATE)\]/gi, m.starts || "").replace(/\[(N|SPOTS|SPOTS LEFT)\]/gi, m.spots || "").replace(/\s*·\s*starts\s*$/i, "").trim();
  const bar = filled && !/\[|\]/.test(filled) ? filled : auto;
  return (
    <div style={{ background: C.bg, color: C.cream }} className="min-h-screen font-sans antialiased">
      <div className="sticky top-0 z-10 px-4 py-2.5 text-center text-[13px] font-bold" style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.gold2})`, color: "#14120a" }}>🔥 {bar}</div>

      <header className="px-5 pb-16 pt-14 text-center sm:px-8 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-balance text-[clamp(2rem,5.6vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">{p.headline || "Your headline goes here"}</h1>
          {p.sub && <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed" style={{ color: C.muted }}>{p.sub}</p>}
          <div className="pt-2"><Button p={p} m={m} big /></div>
          <p className="text-sm" style={{ color: C.muted }}>{p.guarantee || `Love it or get your $${p.price || "47"} back.`}</p>
        </div>
      </header>

      {p.cred && <div className="px-5 py-8 text-center text-[15px] leading-relaxed sm:px-8" style={{ background: C.surf, borderTop: `1px solid ${C.line}`, color: C.muted }}><p className="mx-auto max-w-3xl">{p.cred}</p></div>}

      {p.problems.length > 0 && (
        <Section>
          <Eyebrow>Sound familiar?</Eyebrow>
          <H2>You&apos;re not lazy. You&apos;re missing the system.</H2>
          <div className={`grid gap-4 ${p.problems.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {p.problems.map((x, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: C.surf, border: `1px solid ${C.line}` }}>
                <div className="text-lg font-extrabold">❌ {x.title}</div>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.muted }}>{x.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {p.gets.length > 0 && (
        <Section alt>
          <Eyebrow>Your 7 days</Eyebrow>
          <H2>What happens this week</H2>
          <ul className="mx-auto max-w-2xl space-y-3">
            {p.gets.map((g, i) => <li key={i} className="flex gap-3 rounded-xl p-4 text-[16px] leading-relaxed" style={{ background: C.bg, border: `1px solid ${C.line}` }}><span style={{ color: C.good }} className="font-extrabold">✔</span><span>{g}</span></li>)}
          </ul>
          <div className="text-center"><Button p={p} m={m} /></div>
        </Section>
      )}

      {p.results.length > 0 && (
        <Section>
          <Eyebrow>Real results</Eyebrow>
          <H2>People like you, already doing it</H2>
          <div className="grid gap-4 sm:grid-cols-2">
            {p.results.map((r, i) => (
              <figure key={i} className="rounded-2xl p-5" style={{ background: C.surf, border: `1px solid ${C.line}` }}>
                <blockquote className="text-[16px] leading-relaxed">&ldquo;{r.line}&rdquo;</blockquote>
                {r.name && <figcaption className="mt-3 text-sm font-bold" style={{ color: C.gold }}>{r.name}</figcaption>}
              </figure>
            ))}
          </div>
        </Section>
      )}

      {(p.forYou.length > 0 || p.notFor.length > 0) && (
        <Section alt>
          <H2>Is this for you?</H2>
          <div className="grid gap-4 md:grid-cols-2">
            {p.forYou.length > 0 && <div className="rounded-2xl p-5" style={{ background: C.bg, border: `1px solid ${C.line}` }}><div className="mb-3 font-extrabold" style={{ color: C.good }}>This is for you if…</div><ul className="space-y-2">{p.forYou.map((x, i) => <li key={i} className="flex gap-2 text-[15px]"><span style={{ color: C.good }}>✔</span>{x}</li>)}</ul></div>}
            {p.notFor.length > 0 && <div className="rounded-2xl p-5" style={{ background: C.bg, border: `1px solid ${C.line}` }}><div className="mb-3 font-extrabold" style={{ color: C.bad }}>This isn&apos;t for you if…</div><ul className="space-y-2">{p.notFor.map((x, i) => <li key={i} className="flex gap-2 text-[15px]" style={{ color: C.muted }}><span style={{ color: C.bad }}>✕</span>{x}</li>)}</ul></div>}
          </div>
        </Section>
      )}

      <Section>
        <Eyebrow>The offer</Eyebrow>
        <div className="mx-auto max-w-xl rounded-3xl p-7 text-center" style={{ background: C.surf, border: `1px solid ${C.gold}55` }}>
          <div className="text-sm font-bold uppercase tracking-widest" style={{ color: C.muted }}>7 days · full access</div>
          <div className="mt-2 text-6xl font-extrabold">${p.price || "47"}</div>
          {p.value && <p className="mt-3 text-[15px] leading-relaxed" style={{ color: C.muted }}>{p.value}</p>}
          <div className="mt-6"><Button p={p} m={m} big /></div>
          <p className="mt-3 text-sm" style={{ color: C.muted }}>{p.guarantee || `Love it or get your $${p.price || "47"} back.`}</p>
        </div>
      </Section>

      {p.faq.length > 0 && (
        <Section alt>
          <H2>Questions</H2>
          <div className="mx-auto max-w-3xl space-y-3">
            {p.faq.map((f, i) => (
              <details key={i} className="group rounded-xl p-4" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
                <summary className="cursor-pointer list-none font-bold">{f.q}<span className="float-right transition group-open:rotate-45" style={{ color: C.gold }}>+</span></summary>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.muted }}>{f.a}</p>
              </details>
            ))}
          </div>
        </Section>
      )}

      <section className="px-5 py-16 text-center sm:px-8" style={{ borderTop: `1px solid ${C.line}` }}>
        <div className="mx-auto max-w-2xl space-y-5">
          <p className="text-balance text-2xl font-extrabold leading-snug">{p.close || "Seven days from now, you'll either have the win or your money back."}</p>
          <Button p={p} m={m} big />
        </div>
      </section>
    </div>
  );
}
