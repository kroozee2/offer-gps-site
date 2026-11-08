import type { SkoolJoin } from "@/lib/skool-join";

// A member's free Skool community join page: the top of the 7-Figure Community Funnel.
// Hero → who it's for → what's inside → the weekly call → the host and proof → join.
// Own colors, plain markup: the portal preview and their own site (the offer-gps-site
// template keeps an identical copy) look the same.

const C = { bg: "#0b0b10", surf: "#14141c", line: "#262633", cream: "#f4f2ec", muted: "#a8a5b3", gold: "#d4af37", gold2: "#f0d27a", good: "#3fae6a" };

function Join({ j, big = false }: { j: SkoolJoin; big?: boolean }) {
  const cls = `inline-flex items-center justify-center rounded-2xl px-8 font-extrabold text-[#14120a] shadow-[0_10px_40px_-10px_rgba(212,175,55,.6)] transition hover:brightness-105 ${big ? "py-5 text-lg" : "py-4 text-base"}`;
  const style = { background: `linear-gradient(135deg, ${C.gold2}, ${C.gold})` };
  const label = `${j.button || "Join free"} →`;
  return j.skoolUrl
    ? <a href={j.skoolUrl} className={cls} style={style}>{label}</a>
    : <span className={`${cls} cursor-not-allowed opacity-70`} style={style} title="Add your Skool link to turn this on">{label}</span>;
}

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-center text-[clamp(1.5rem,3.8vw,2.3rem)] font-extrabold leading-tight tracking-tight" style={{ color: C.cream }}>{children}</h2>;

export default function JoinPageView({ j }: { j: SkoolJoin }) {
  return (
    <div style={{ background: C.bg, color: C.cream }} className="min-h-screen font-sans antialiased">
      <header className="px-5 pb-16 pt-16 text-center sm:px-8 md:pb-24 md:pt-24" style={{ background: `radial-gradient(ellipse at 50% 0%, ${C.gold}22, transparent 60%)` }}>
        <div className="mx-auto max-w-4xl space-y-6">
          {j.name && <p className="text-[12px] font-bold uppercase tracking-[0.25em]" style={{ color: C.gold }}>{j.name} · {j.price || "Free"}</p>}
          <h1 className="text-balance text-[clamp(2rem,5.4vw,3.4rem)] font-extrabold leading-[1.06] tracking-[-0.02em]">{j.headline || "Your community headline"}</h1>
          {j.sub && <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed" style={{ color: C.muted }}>{j.sub}</p>}
          <div className="pt-2"><Join j={j} big /></div>
          <p className="text-sm" style={{ color: C.muted }}>Free to join · Answer 3 quick questions · You&apos;re in</p>
        </div>
      </header>

      {j.who.length > 0 && (
        <section className="px-5 py-14 sm:px-8" style={{ background: C.surf, borderTop: `1px solid ${C.line}` }}>
          <div className="mx-auto max-w-3xl space-y-6">
            <H2>This is for you if…</H2>
            <ul className="space-y-3">{j.who.map((x, i) => <li key={i} className="flex gap-3 text-[16px] leading-relaxed"><span className="font-extrabold" style={{ color: C.good }}>✔</span>{x}</li>)}</ul>
          </div>
        </section>
      )}

      {j.inside.length > 0 && (
        <section className="px-5 py-14 sm:px-8" style={{ borderTop: `1px solid ${C.line}` }}>
          <div className="mx-auto max-w-4xl space-y-7">
            <H2>What&apos;s inside</H2>
            <div className="grid gap-3 sm:grid-cols-2">{j.inside.map((x, i) => <div key={i} className="rounded-2xl p-5 text-[16px] leading-relaxed" style={{ background: C.surf, border: `1px solid ${C.line}` }}>{x}</div>)}</div>
          </div>
        </section>
      )}

      {j.call && (
        <section className="px-5 py-12 text-center sm:px-8" style={{ background: `linear-gradient(135deg, ${C.gold}1f, transparent)`, borderTop: `1px solid ${C.line}` }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em]" style={{ color: C.gold }}>Every week, live</p>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-xl font-extrabold leading-snug">📅 {j.call}</p>
        </section>
      )}

      {(j.host || j.proof.length > 0) && (
        <section className="px-5 py-14 sm:px-8" style={{ borderTop: `1px solid ${C.line}` }}>
          <div className="mx-auto max-w-3xl space-y-6">
            {j.host && <p className="text-center text-[17px] leading-relaxed" style={{ color: C.muted }}>{j.host}</p>}
            {j.proof.length > 0 && <div className="grid gap-3">{j.proof.map((p, i) => <div key={i} className="rounded-xl p-4 text-[15px]" style={{ background: C.surf, border: `1px solid ${C.line}` }}>🏆 {p}</div>)}</div>}
          </div>
        </section>
      )}

      <section className="px-5 py-16 text-center sm:px-8" style={{ borderTop: `1px solid ${C.line}` }}>
        <div className="mx-auto max-w-xl space-y-5">
          <p className="text-balance text-2xl font-extrabold leading-snug">Come say hi. It&apos;s free.</p>
          <Join j={j} big />
        </div>
      </section>
    </div>
  );
}
