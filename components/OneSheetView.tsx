import { fmtDay, type OneSheet, type SheetPhase } from "@/lib/one-sheet";

// The one-sheeter, drawn exactly like 7figceo.com/partner: a sticky seats bar, a dark hero,
// then white "document" sheets on a dark page, each closed out by its number. Plain
// server-safe markup so the same component is the editor's preview and the public page.

const C = { body: "#2f2f2f", blue: "#296ede", blueDark: "#1b5bc4", hair: "#e4e4e8", pill: "#fff7c0", painBg: "#fdeded", painFg: "#e11d1d", winBg: "#ecfaf0", winFg: "#12864a" };

function RT({ t }: { t: string }) {
  return <>{t.split(/(\*\*[^*]+\*\*)/g).map((c, i) => (c.startsWith("**") && c.endsWith("**") ? <strong key={i} className="font-bold text-black">{c.slice(2, -2)}</strong> : <span key={i}>{c}</span>))}</>;
}

function Sheet({ n, children, id }: { n?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-[1120px] scroll-mt-16 bg-white px-5 py-12 shadow-[0_1px_2px_rgba(0,0,0,.4),0_24px_70px_rgba(0,0,0,.55)] sm:px-8 md:py-14">
      <div className="mx-auto w-full max-w-[900px] text-[16px] leading-[1.43] [&_p]:mb-4 [&_p]:text-[#2f2f2f] [&_li]:mb-2 [&_li]:text-[#2f2f2f]">
        {children}
        {n && (
          <div className="mt-14">
            <div className="mb-4 h-px" style={{ background: C.hair }} />
            <div className="text-[14px] font-bold text-black/70">// {n}</div>
          </div>
        )}
      </div>
    </section>
  );
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => <p className="!mb-0 text-[13px] font-bold uppercase tracking-[0.25em] !text-[#2f2f2f]/45">{children}</p>;
const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="mt-2 text-[30px] font-extrabold leading-tight text-black sm:text-[38px]">{children}</h2>;

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-7 space-y-4 pl-[22px]">
      {items.map((t, k) => (
        <li key={k} className="flex gap-3.5"><span className="mt-0.5 shrink-0 text-[18px] font-bold leading-none" style={{ color: C.blue }}>✔</span><span><RT t={t} /></span></li>
      ))}
    </ul>
  );
}

function Videos({ items }: { items: OneSheet["results"] }) {
  if (!items.length) return null;
  return (
    <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => (
        <a key={r.name} href={`https://youtu.be/${r.video}`} target="_blank" rel="noopener noreferrer" className="group flex flex-col rounded-xl border p-4 transition hover:shadow-lg" style={{ borderColor: C.hair }}>
          <div className="relative mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.face || `https://i.ytimg.com/vi/${r.video}/hqdefault.jpg`} alt={`${r.name} testimonial`} className="aspect-video w-full rounded-lg object-cover object-[50%_30%]" loading="lazy" />
            <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/65 text-[15px] text-white transition group-hover:bg-[#296ede]">▶</span></span>
          </div>
          <p className="!mb-0 flex-1 text-[14px] italic leading-snug">&ldquo;{r.quote}&rdquo;</p>
          <div className="mt-3 text-[16px] font-bold text-black">{r.name}</div>
          <div className="text-[13px] text-[#2f2f2f]/60">{r.title}</div>
        </a>
      ))}
    </div>
  );
}

function Phase({ p, n, first }: { p: SheetPhase; n: number; first: boolean }) {
  return (
    <div className={first ? "mt-14" : "mt-20"}>
      {p.week && <p className="!mb-0 text-[14px] font-bold uppercase tracking-[0.22em] !text-[#2f2f2f]/45">{p.week}</p>}
      <h3 className="mt-3 text-[26px] font-extrabold leading-tight text-black sm:text-[30px]">Phase {n}: <span className="font-bold text-[#2f2f2f]/75">{p.title}</span></h3>
      {p.pain && <div className="mt-6 rounded-2xl px-7 py-5" style={{ background: C.painBg }}><p className="!mb-0 font-bold leading-snug" style={{ color: C.painFg }}>{p.pain}</p></div>}
      {p.intro && <div className="mt-6"><p><RT t={p.intro} /></p></div>}
      {p.items.length > 0 && <><p className="!mb-0 mt-2 font-bold text-black">Here&apos;s what we install:</p><Checklist items={p.items} /></>}
      {p.result && <div className="mt-8 rounded-2xl px-7 py-5" style={{ background: C.winBg }}><p className="!mb-0 font-bold leading-snug" style={{ color: C.winFg }}><RT t={p.result} /></p></div>}
      {p.proof && <blockquote className="mt-6 border-l-4 pl-5 text-[16px] italic leading-relaxed text-[#2f2f2f]/85" style={{ borderColor: `${C.blue}80` }}>{p.proof}</blockquote>}
      {p.closer && <p className="!mb-0 mt-5 text-[18px] font-bold !text-black">{p.closer}</p>}
    </div>
  );
}

export default function OneSheetView({ s, preview = false }: { s: OneSheet; preview?: boolean }) {
  const seatsOn = s.seats.on && s.seats.total > 0;
  const seatLine = seatsOn ? (s.seats.left && s.seats.left < s.seats.total ? `${s.seats.left} of ${s.seats.total} spots left` : `${s.seats.total} spots`) : "";
  const closes = fmtDay(s.seats.closes);
  const href = s.cta.url || "#next";
  const results = s.results.filter((r) => r.on && r.video);
  const top = results.slice(0, 6), mid = results.slice(6, 9), end = results.slice(9);
  const phases = s.path.on ? s.path.phases : [];
  let sheet = 0;
  const no = () => String(++sheet).padStart(2, "0");

  return (
    <div className="space-y-4 pb-10 text-[#2f2f2f] antialiased" style={{ background: "radial-gradient(70rem 40rem at 50% -5%, rgba(41,110,222,.13), transparent 70%), #0c0c10" }}>
      {(seatsOn || closes) && (
        <div className={`${preview ? "" : "sticky top-0"} z-50 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur`}>
          <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2.5 text-center text-[13px] font-semibold text-white sm:justify-between sm:text-left">
            <span className="flex items-center gap-2"><span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#f5c542]" /><span><span className="text-white/60">Private invitation · </span>{seatLine || s.brand.name}</span></span>
            <span className="flex items-center gap-3">{closes && <span className="text-white/70">Closes <span className="text-[#f5c542]">{closes}</span></span>}<a href={href} className="rounded-full bg-[#f5c542] px-3.5 py-1.5 text-[12px] font-extrabold text-black transition hover:brightness-110">{s.cta.label}</a></span>
          </div>
        </div>
      )}

      <header className="relative mx-auto max-w-[1120px] overflow-hidden bg-[#07090d] px-5 pb-12 pt-14 text-center text-white sm:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: "18px 18px", maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)" }} />
        <div className="relative">
          <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-white/60">Private invitation</p>
          <div className="mt-5 leading-[0.95]">
            <div className="text-[clamp(1.9rem,5.5vw,3.1rem)] font-extrabold uppercase tracking-[0.02em]">{s.brand.name}</div>
            {s.brand.sub && <div className="mt-1 text-[clamp(1.1rem,3.4vw,1.9rem)] font-extrabold uppercase tracking-[0.2em] text-white/55">{s.brand.sub}</div>}
          </div>
          {s.brand.tagline && <p className="mx-auto mt-6 max-w-[560px] text-[clamp(1.05rem,2.2vw,1.3rem)] leading-snug text-white/75">{s.brand.tagline}</p>}
          <a href="#invitation" className="mt-8 inline-flex rounded-2xl border border-white/20 bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] px-8 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.12em] shadow-[0_10px_40px_rgba(37,99,235,.45)] transition hover:brightness-110">Read the invitation</a>
          <p className="mt-3 text-[12px] text-white/45">It takes about four minutes</p>
          <div aria-hidden="true" className="mt-4 text-white/40">⌄ ⌄ ⌄</div>
        </div>
      </header>

      <Sheet n={no()} id="invitation">
        <div className="text-center leading-none">
          <div className="text-[15px] font-extrabold uppercase tracking-[0.04em] text-black">{s.brand.name}</div>
          {s.brand.sub && <div className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#2f2f2f]/50">{s.brand.sub}</div>}
        </div>
        <div className="mt-5 h-px" style={{ background: C.hair }} />
        {s.brand.author && <p className="mt-6 text-center text-[15px] !text-[#2f2f2f]/70">{s.brand.author}</p>}
        {seatsOn && (
          <div className="mx-auto mt-4 max-w-[610px]"><div className="rounded-lg px-5 py-2.5 text-center text-[15px] font-bold text-black" style={{ background: C.pill }}>[{s.seats.total} Spots Available{s.seats.left && s.seats.left < s.seats.total ? ` · ${s.seats.left} left` : ""}{closes ? `. Doors close ${closes}` : ""}]</div></div>
        )}
        {s.invest.urgency[0] && <p className="mx-auto mt-3 max-w-[610px] text-center text-[15px] !text-[#2f2f2f]/75">{s.invest.urgency.join(" · ")}</p>}

        <h1 className="mt-9 text-center text-[27px] font-extrabold leading-[1.22] tracking-[-0.01em] text-black sm:text-[36px]">{s.headline || "Your promise goes here"}</h1>
        {s.subhead && <p className="mt-3 text-center text-[21px] font-bold italic leading-[1.35] !text-black">{s.subhead}</p>}

        {s.why.on && s.why.title && (
          <>
            <div className="mt-8 h-px" style={{ background: C.hair }} />
            <div className="mt-8 rounded-2xl px-6 py-5" style={{ background: C.painBg, color: C.painFg }}>
              <p className="!mb-2 text-[20px] font-extrabold leading-snug" style={{ color: C.painFg }}>{s.why.title}</p>
              {s.why.lines.map((l, i) => <p key={i} className={`leading-snug ${i === s.why.lines.length - 1 ? "!mb-0 font-bold" : "!mb-2"}`} style={{ color: C.painFg }}>{l}</p>)}
            </div>
          </>
        )}

        {(s.goal.text || s.goal.bullets.length > 0) && (
          <div className="mt-9">
            {s.goal.text && <p><strong className="font-bold text-black">{s.goal.intro}</strong> {s.goal.text}</p>}
            {s.goal.bullets.length > 0 && <ul className="mt-4 pl-[22px]">{s.goal.bullets.map((b) => <li key={b} className="flex gap-2"><span style={{ color: C.blue }}>▪</span><span><RT t={b} /></span></li>)}</ul>}
            {s.goal.without && <p className="mt-5 italic">{s.goal.without}</p>}
            {s.goal.closing && <p className="mt-4 text-[18px] font-bold !text-black">{s.goal.closing}</p>}
          </div>
        )}

        {(s.cred.line || s.cred.extra.length > 0) && (
          <div className="mt-8">
            {s.cred.line && <p>{s.cred.line}</p>}
            {s.cred.extra.length > 0 && <ul className="mt-5 grid gap-1.5 pl-[22px] sm:grid-cols-2">{s.cred.extra.map((e) => <li key={e} className="flex gap-2 text-[15px]"><span style={{ color: C.blue }}>★</span>{e}</li>)}</ul>}
          </div>
        )}
        {s.cred.stats.length > 0 && (
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {s.cred.stats.map((x) => <div key={x.label} className="rounded-xl border px-4 py-4 text-center" style={{ borderColor: C.hair }}><div className="text-[26px] font-extrabold leading-none text-black">{x.n}</div><div className="mt-1.5 text-[13px] leading-snug text-[#2f2f2f]/60">{x.label}</div></div>)}
          </div>
        )}

        {s.problems.on && s.problems.items.length > 0 && (
          <div className="mt-12">
            <Eyebrow>Sound familiar?</Eyebrow>
            <p className="mt-2 text-[22px] font-extrabold leading-snug !text-black">{s.problems.title}</p>
            {s.problems.intro && <p className="mt-2">{s.problems.intro}</p>}
            <div className={`mt-6 grid gap-4 ${s.problems.items.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {s.problems.items.map((x, i) => (
                <div key={i} className="flex flex-col rounded-2xl border p-5" style={{ borderColor: C.hair }}>
                  <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#2f2f2f]/45">Problem {i + 1}</div>
                  <div className="mt-1 text-[19px] font-extrabold text-black">{x.label}</div>
                  {x.quote && <p className="mt-3 text-[15px] italic leading-snug">&ldquo;{x.quote}&rdquo;</p>}
                  {x.cost && <p className="mt-2 text-[14px] leading-snug !text-[#2f2f2f]/70">{x.cost}</p>}
                  {x.fix && <div className="mt-auto pt-4"><div className="rounded-xl px-3.5 py-3 text-[14px] leading-snug" style={{ background: `${C.blue}0f` }}><strong style={{ color: C.blue }}>The fix: {x.fix.replace(/\.$/, "")}.</strong> {x.fixLine}</div></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <Videos items={top} />

        {(s.fit.notFor.length > 0 || s.fit.forYou.length > 0) && (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {s.fit.notFor.length > 0 && (
              <div className="rounded-2xl border p-6" style={{ borderColor: C.hair }}>
                <h4 className="text-[20px] font-extrabold text-black">Do <span style={{ color: C.painFg }}>NOT</span> join if you...</h4>
                <ul className="mt-4">{s.fit.notFor.map((x) => <li key={x} className="flex gap-2.5 text-[15px]"><span className="mt-px font-bold text-[#2f2f2f]/35">✕</span>{x}</li>)}</ul>
              </div>
            )}
            {s.fit.forYou.length > 0 && (
              <div className="rounded-2xl border-2 p-6" style={{ borderColor: `${C.blue}66`, background: `${C.blue}08` }}>
                <h4 className="text-[20px] font-extrabold text-black">Join today if you...</h4>
                <ul className="mt-4">{s.fit.forYou.map((x) => <li key={x} className="flex gap-2.5 text-[15px]"><span className="mt-px font-bold" style={{ color: C.blue }}>✓</span>{x}</li>)}</ul>
              </div>
            )}
          </div>
        )}
      </Sheet>

      {phases.length > 0 && (
        <Sheet n={no()}>
          <Eyebrow>The pathway</Eyebrow>
          <H2>{s.path.title}</H2>
          {s.path.intro && <p className="mt-4">{s.path.intro}</p>}
          {phases.slice(0, 2).map((p, i) => <Phase key={i} p={p} n={i + 1} first={i === 0} />)}
          <Videos items={mid} />
        </Sheet>
      )}
      {phases.length > 2 && (
        <Sheet n={no()}>
          {phases.slice(2).map((p, i) => <Phase key={i} p={p} n={i + 3} first={i === 0} />)}
        </Sheet>
      )}

      {s.format.on && s.format.items.length > 0 && (
        <Sheet n={no()}>
          <Eyebrow>The format</Eyebrow>
          <H2>{s.format.title}</H2>
          <Checklist items={s.format.items} />
          <Videos items={end} />
        </Sheet>
      )}

      <Sheet n={no()} id="next">
        <Eyebrow>{s.invest.title}</Eyebrow>
        {s.invest.price && <H2>{s.invest.price[0].toUpperCase() + s.invest.price.slice(1)}</H2>}
        <div className="mt-6">{s.invest.body.map((t, i) => <p key={i}><RT t={t} /></p>)}</div>
        {s.invest.urgency.length > 0 && <div className="my-9 rounded-2xl px-7 py-6" style={{ background: C.painBg }}>{s.invest.urgency.map((u, i) => <p key={i} className={`font-bold leading-snug ${i === s.invest.urgency.length - 1 ? "!mb-0" : "!mb-2"}`} style={{ color: C.painFg }}>{u}.</p>)}</div>}
        {s.invest.guarantee && <p>And you&apos;re protected by our <strong className="font-bold text-black">{s.invest.guarantee}.</strong> If we miss the mark, we part as friends. No argument, no retention call.</p>}

        {s.invest.price && (
          <div className="mt-9 rounded-2xl border-2 px-7 py-6" style={{ borderColor: `${C.blue}66`, background: `${C.blue}0a` }}>
            <div className="text-[13px] font-bold uppercase tracking-[0.2em]" style={{ color: C.blue }}>{[s.brand.name, s.brand.sub].filter(Boolean).join(" ")}</div>
            <div className="mt-2 text-[30px] font-extrabold leading-tight text-black">{s.invest.price}</div>
            {s.invest.guarantee && <p className="!mb-0 mt-1 text-[15px] !text-[#2f2f2f]/70">{s.invest.guarantee}</p>}
            <a href={href} className="mt-4 inline-block rounded-[14px] px-[34px] py-4 text-[14px] font-bold uppercase tracking-[0.04em] text-white transition hover:brightness-110" style={{ background: C.blue, boxShadow: `0 4px 0 ${C.blueDark}` }}>{s.cta.label}</a>
          </div>
        )}

        <div className="my-12 h-px" style={{ background: C.hair }} />
        <Eyebrow>Next steps</Eyebrow>
        <H2>{seatsOn ? `It's only ${s.seats.total} spots${s.seats.period ? ` ${s.seats.period}` : ""}, and I'm hand-selecting the right people.` : "Here's how to start."}</H2>
        {seatsOn && (
          <div className="mt-6 inline-flex items-center gap-4 rounded-2xl border-2 px-6 py-4" style={{ borderColor: `${C.painFg}4d`, background: C.painBg }}>
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full" style={{ background: C.painFg }} />
            <span className="text-[34px] font-extrabold leading-none text-black">{s.seats.left || s.seats.total}<span className="text-[#2f2f2f]/40">/{s.seats.total}</span></span>
            <span className="text-[15px] font-bold leading-snug" style={{ color: C.painFg }}>spots left{s.seats.why ? <><br /><span className="font-semibold text-[#2f2f2f]/70">{s.seats.why}</span></> : null}</span>
          </div>
        )}
        <div className="mt-6 grid gap-3">
          {s.cta.steps.map((x) => <div key={x.h} className="rounded-xl border p-5" style={{ borderColor: C.hair }}><div className="font-bold text-black">{x.h}</div><p className="!mb-0 mt-1 text-[15px]">{x.b}</p></div>)}
        </div>
        <div className="mt-8 text-center">
          <a href={href} className="inline-block rounded-[14px] px-[34px] py-4 text-[14px] font-bold uppercase tracking-[0.04em] text-white transition hover:brightness-110" style={{ background: C.blue, boxShadow: `0 4px 0 ${C.blueDark}` }}>{s.cta.label}</a>
          {s.invest.guarantee && <p className="mt-3 text-[13px] !text-[#2f2f2f]/55">{s.invest.guarantee}</p>}
          {!s.cta.url && preview && <p className="mt-2 text-[12px] font-bold !text-[#e11d1d]">Add your button link in Next steps so this goes somewhere.</p>}
        </div>
        {s.signoff.name && <div className="mt-8"><div className="text-[24px] font-bold text-black">{s.signoff.name}</div>{s.signoff.role && <div className="text-[15px] text-[#2f2f2f]/60">{s.signoff.role}</div>}</div>}
        {s.ps && <><div className="my-9 h-px" style={{ background: C.hair }} /><p className="!mb-0 text-[15px] !text-[#2f2f2f]/80"><strong className="font-bold text-black">P.S.</strong> {s.ps}</p></>}
      </Sheet>

      <footer className="mx-auto max-w-[1120px] px-5 py-8 text-center text-[12px] text-white/30 sm:px-8">{[s.brand.name, s.brand.sub].filter(Boolean).join(" ")} · Private invitation</footer>
    </div>
  );
}
